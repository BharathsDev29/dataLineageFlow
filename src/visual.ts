
var dataLineageFlow1163C8FD56F049FA866FE2D65619549C;
(function(){
"use strict";

var DEFAULT_COLORS=["#9594B8","#3B82F6","#22C55E","#D49A2E","#F97316","#8B5CF6","#06B6D4","#EF4444","#EC4899","#84CC16","#F59E0B","#6366F1"];

function rgba(hex,a){
  var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return "rgba("+r+","+g+","+b+","+a+")";
}

function healthColor(val){
  var v=(val||"").trim().toLowerCase();
  if(v==="green"||v==="healthy"||v==="health"||v==="ok"||v==="good") return "#22c55e";
  if(v==="yellow"||v==="warning"||v==="amber"||v==="degraded") return "#eab308";
  if(v==="red"||v==="critical"||v==="error"||v==="down"||v==="stale") return "#ef4444";
  return "#6b7280";
}

/* ── Constructor ── */
function Visual(options){
  this.target=options.element;
  this.host=options.host;
  this.target.style.overflow="auto";
  this.container=document.createElement("div");
  this.container.className="lineage-container";
  this.target.appendChild(this.container);
  this.settings={headerFontSize:10,cellFontSize:10,storageFontSize:7,lineOpacity:0.25,lineWidth:1.5,showBadge:true,enableCrossFilter:true,urlClickAction:"open",showTooltip:true};
  this.layerColorOverrides={};
  this.layerSubtitleOverrides={};
  this.layerIsUrl={};
  this._dv=null;
  this.selectionManager=this.host.createSelectionManager();
  this._clickedKey=null;
  this._layers=null;
  this._connections=null;
  this._nodeEls=null;
  this._svg=null;
  this._subtitleEls={};
  this._subtitleOriginals={};
}

/* ── Update ── */
Visual.prototype.update=function(options){
  this.container.innerHTML="";
  var dv=options.dataViews&&options.dataViews[0];
  this._dv=dv;
  if(!dv||!dv.table||!dv.table.columns||dv.table.columns.length===0){this.renderEmpty();return;}

  this.readSettings(dv);

  var table=dv.table,cols=table.columns,rows=table.rows,numCols=cols.length;
  if(rows.length===0){this.renderEmpty();return;}

  var classified=this.classifyColumns(cols);
  var layerCols=classified.layerCols;
  var metaMap=classified.metaMap;
  var numLayers=layerCols.length;
  if(numLayers===0){this.renderEmpty();return;}

  var layers=this.buildLayers(cols,rows,layerCols,metaMap);
  var connections=this.buildConnections(rows,layers,layerCols);
  this.buildSelectionIds(table,rows);

  var vw=options.viewport.width,vh=options.viewport.height;
  this.container.style.width=vw+"px";
  this.container.style.height=vh+"px";

  var self=this;
  var main=document.createElement("div");
  main.className="lineage-main";

  var svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("class","lineage-svg");

  var nodeEls={};
  this._layers=layers;
  this._connections=connections;
  this._nodeEls=nodeEls;
  this._svg=svg;
  this._clickedKey=null;
  this._subtitleEls={};
  this._subtitleOriginals={};

  for(var ci=0;ci<numLayers;ci++){
    (function(colIdx){
      var layer=layers[colIdx];
      var color=self.getLayerColor(colIdx);
      var isUrlCol=!!self.layerIsUrl[colIdx];
      var col=document.createElement("div");
      col.className="lineage-col";
      col.style.background="linear-gradient(180deg, "+rgba(color,0.13)+" 0%, "+rgba(color,0.03)+" 100%)";
      if(colIdx<numLayers-1) col.style.borderRight="1px solid "+rgba(color,0.08);

      var header=document.createElement("div");
      header.className="lineage-col-header";
      header.style.borderBottom="1px solid "+rgba(color,0.1);

      var labelLine=document.createElement("div");
      labelLine.style.marginBottom="2px";

      var dot=document.createElement("span");
      dot.className="lineage-col-dot";
      dot.style.background=color;
      dot.style.boxShadow="0 0 6px "+rgba(color,0.5);
      labelLine.appendChild(dot);

      var lbl=document.createElement("span");
      lbl.className="lineage-col-label";
      lbl.style.fontSize=self.settings.headerFontSize+"px";
      lbl.style.color=color;
      lbl.textContent=layer.name;
      labelLine.appendChild(lbl);
      header.appendChild(labelLine);

      /* v4 #2: custom subtitle */
      var cnt=document.createElement("div");
      cnt.className="lineage-col-count";
      cnt.style.fontSize=Math.max(7,self.settings.headerFontSize-2)+"px";
      var subtitle=self.layerSubtitleOverrides[colIdx];
      if(subtitle&&subtitle.trim()!==""){
        cnt.textContent=layer.count+" "+subtitle;
      } else {
        cnt.textContent=layer.count+" table"+(layer.count!==1?"s":"");
      }
      /* v6.1: health summary dots in subtitle */
      self._appendHealthSummary(cnt,layer.nodes);
      header.appendChild(cnt);
      self._subtitleEls[colIdx]=cnt;
      self._subtitleOriginals[colIdx]=cnt.innerHTML;
      col.appendChild(header);

      var nodesDiv=document.createElement("div");
      nodesDiv.className="lineage-nodes";

      for(var ni=0;ni<layer.nodes.length;ni++){
        (function(nodeIdx){
          var node=layer.nodes[nodeIdx];
          var el=document.createElement("div");
          el.className="lineage-node"+(isUrlCol?" lineage-node-url":"");
          el.style.fontSize=self.settings.cellFontSize+"px";
          el.style.border="1px solid "+rgba(color,0.25);
          el.style.color=color;
          el.style.background=rgba(color,0.08);

          var txt=document.createElement("span");
          txt.className="lineage-node-text";
          txt.textContent=node.value;
          el.appendChild(txt);

          /* v6: health indicator */
          if(node.meta&&node.meta.health){
            var hVal=(node.meta.health||"").toLowerCase();
            var isWarn=(hVal==="yellow"||hVal==="warning"||hVal==="amber"||hVal==="degraded");
            var isRed=(hVal==="red"||hVal==="critical"||hVal==="error"||hVal==="down"||hVal==="stale");
            var hspan=document.createElement("span");
            hspan.className="lineage-health-dot";
            hspan.style.background=healthColor(node.meta.health);
            hspan.style.boxShadow="0 0 4px "+healthColor(node.meta.health);
            el.appendChild(hspan);
          }

          /* v5 #2: URL icon only for columns marked as URL in format pane */
          if(isUrlCol){
            var icon=document.createElement("span");
            icon.className="lineage-url-icon";
            icon.textContent="\u{1F517}";
            el.appendChild(icon);
          }

          /* v6: storage label at bottom-left (like badge at top-right) */
          if(node.meta&&node.meta.storage){
            var stLabel=document.createElement("span");
            stLabel.className="lineage-storage-label";
            stLabel.style.color=rgba(color,0.6);
            stLabel.style.fontSize=self.settings.storageFontSize+"px";
            stLabel.textContent=node.meta.storage;
            el.appendChild(stLabel);
          }

          /* v5.2: badge shows downstream (children) count */
          if(self.settings.showBadge){
            var downCount=0;
            for(var ci2=0;ci2<connections.length;ci2++){
              if(connections[ci2].fromCol===colIdx&&connections[ci2].fromIdx===nodeIdx) downCount++;
            }
            if(downCount>0){
              var badge=document.createElement("span");
              badge.className="lineage-badge";
              badge.style.fontSize=Math.max(7,self.settings.cellFontSize-3)+"px";
              badge.style.background=color;
              badge.textContent=String(downCount);
              el.appendChild(badge);
            }
          }

          /* HOVER: immediate neighbors only (unchanged) */
          el.addEventListener("mouseenter",function(){
            if(self._clickedKey){
              /* In trace mode: show tooltip for traced nodes only */
              if(self.settings.showTooltip&&el.classList.contains("lineage-node-selected")){
                self.showTooltip(el,node.value,node.meta);
              }
              return;
            }
            self.highlightNode(colIdx,nodeIdx,layers,connections,nodeEls,svg);
            if(self.settings.showTooltip) self.showTooltip(el,node.value,node.meta);
          });
          el.addEventListener("mouseleave",function(){
            if(self._clickedKey){
              self.hideTooltip();
              return;
            }
            self.clearHighlight(layers,nodeEls,svg);
            self.hideTooltip();
          });

          /* RIGHT-CLICK: context menu with Copy option */
          el.addEventListener("contextmenu",function(e){
            e.preventDefault();
            e.stopPropagation();
            self.showContextMenu(e.clientX,e.clientY,node.value);
          });

          /* CLICK: directed lineage trace + cross-filter + URL action */
          el.addEventListener("click",function(e){
            e.stopPropagation();

            /* URL click action */
            if(isUrlCol){
              var action=self.settings.urlClickAction;
              if(action==="open"||action==="both"){
                self.host.launchUrl(node.value);
              }
              if(action==="copy"||action==="both"){
                self.copyToClipboard(node.value);
              }
            }

            var key=colIdx+"-"+nodeIdx;

            /* Hide any lingering tooltip on click */
            self.hideTooltip();

            /* Toggle off */
            if(self._clickedKey===key){
              self._clickedKey=null;
              self.clearHighlight(layers,nodeEls,svg);
              self.clearAllSelected(nodeEls);
              if(self.settings.enableCrossFilter) self.selectionManager.clear();
              return;
            }

            self._clickedKey=key;

            /* v5 #1: DIRECTED lineage trace */
            self.traceDirectedLineage(colIdx,nodeIdx,layers,connections,nodeEls,svg);

            /* Cross-filter */
            if(self.settings.enableCrossFilter) self.applyCrossFilter(node);
          });

          nodeEls[colIdx+"-"+nodeIdx]=el;
          nodesDiv.appendChild(el);
        })(ni);
      }
      col.appendChild(nodesDiv);
      main.appendChild(col);
    })(ci);
  }

  /* Click empty space → clear */
  main.addEventListener("click",function(e){
    if(e.target===main||e.target.classList.contains("lineage-nodes")||e.target.classList.contains("lineage-col")){
      self._clickedKey=null;
      self.clearHighlight(layers,nodeEls,svg);
      self.clearAllSelected(nodeEls);
      if(self.settings.enableCrossFilter) self.selectionManager.clear();
    }
  });

  this.container.appendChild(main);
  main.appendChild(svg);

  requestAnimationFrame(function(){
    self.drawEdges(main,svg,connections,layers,nodeEls);
  });
};

/* ── Classify Columns ── */
Visual.prototype.classifyColumns=function(cols){
  var META_SUFFIXES=["__health","__refreshed","__storage","__storagewithunits"];
  var layerCols=[];
  var metaCols={};
  for(var c=0;c<cols.length;c++){
    var name=cols[c].displayName||"";
    var isMeta=false;
    for(var s=0;s<META_SUFFIXES.length;s++){
      var sfx=META_SUFFIXES[s];
      if(name.length>sfx.length&&name.slice(-sfx.length).toLowerCase()===sfx){
        var type=sfx.slice(2);
        if(type==="storagewithunits") type="storage";
        metaCols[c]={baseName:name.slice(0,-sfx.length),type:type};
        isMeta=true;break;
      }
    }
    if(!isMeta) layerCols.push(c);
  }
  var nameToCol={};
  for(var i=0;i<layerCols.length;i++) nameToCol[(cols[layerCols[i]].displayName||"")]=layerCols[i];
  var metaMap={};
  for(var mc in metaCols){
    var m=metaCols[mc];
    var lc=nameToCol[m.baseName];
    if(lc!=null){
      if(!metaMap[lc]) metaMap[lc]={};
      metaMap[lc][m.type]=parseInt(mc,10);
    }
  }
  return {layerCols:layerCols,metaMap:metaMap};
};

/* ── Build Layers ── */
Visual.prototype.buildLayers=function(cols,rows,layerCols,metaMap){
  var layers=[];
  for(var li=0;li<layerCols.length;li++){
    var c=layerCols[li];
    var map=new Map();
    for(var r=0;r<rows.length;r++){
      var v=rows[r][c];
      var s=v==null?"":String(v).trim();
      if(s==="") continue;
      if(!map.has(s)) map.set(s,{value:s,rows:[]});
      map.get(s).rows.push(r);
    }
    var nodes=Array.from(map.values());
    var meta=metaMap[c];
    if(meta){
      for(var ni=0;ni<nodes.length;ni++){
        var nd=nodes[ni],row=nd.rows[0];
        nd.meta={};
        if(meta.health!=null){var hv=rows[row][meta.health];nd.meta.health=hv==null?"":String(hv).trim();}
        if(meta.refreshed!=null){var rv=rows[row][meta.refreshed];nd.meta.refreshed=rv==null?"":String(rv).trim();}
        if(meta.storage!=null){var sv=rows[row][meta.storage];nd.meta.storage=sv==null?"":String(sv).trim();}
      }
    }
    layers.push({name:cols[c].displayName||"Layer "+li,nodes:nodes,count:map.size});
  }
  return layers;
};

/* ── Build Connections ── */
Visual.prototype.buildConnections=function(rows,layers,layerCols){
  var conns=[];
  var seen={};
  for(var r=0;r<rows.length;r++){
    var filled=[];
    for(var lc=0;lc<layerCols.length;lc++){
      var c=layerCols[lc];
      var v=rows[r][c];
      var s=v==null?"":String(v).trim();
      if(s!=="") filled.push({col:lc,val:s});
    }
    for(var i=0;i<filled.length-1;i++){
      var fromCol=filled[i].col,toCol=filled[i+1].col;
      var fromVal=filled[i].val,toVal=filled[i+1].val;
      var isSkip=(toCol-fromCol)>1;
      var key=fromCol+":"+fromVal+">>"+toCol+":"+toVal;
      if(seen[key]!=null){conns[seen[key]].rows.push(r);continue;}
      var fi=-1,ti=-1;
      for(var a=0;a<layers[fromCol].nodes.length;a++){
        if(layers[fromCol].nodes[a].value===fromVal){fi=a;break;}
      }
      for(var b=0;b<layers[toCol].nodes.length;b++){
        if(layers[toCol].nodes[b].value===toVal){ti=b;break;}
      }
      if(fi>=0&&ti>=0){
        seen[key]=conns.length;
        conns.push({fromCol:fromCol,toCol:toCol,fromIdx:fi,toIdx:ti,isSkip:isSkip,rows:[r]});
      }
    }
  }
  return conns;
};

/* ── Build SelectionIds ── */
Visual.prototype.buildSelectionIds=function(table,rows){
  this._rowSelectionIds=[];
  for(var r=0;r<rows.length;r++){
    try{
      var sid=this.host.createSelectionIdBuilder()
        .withTable(table,r)
        .createSelectionId();
      this._rowSelectionIds.push(sid);
    }catch(ex){
      this._rowSelectionIds.push(null);
    }
  }
};

/* ── Apply cross-filter ── */
Visual.prototype.applyCrossFilter=function(node){
  var ids=[];
  for(var i=0;i<node.rows.length;i++){
    var sid=this._rowSelectionIds[node.rows[i]];
    if(sid) ids.push(sid);
  }
  if(ids.length>0) this.selectionManager.select(ids,false);
};

/* ══════════════════════════════════════════════════════════════════════════
   v5 FIX #1: DIRECTED LINEAGE TRACE
   Two separate BFS passes:
     1. Upstream: only follow edges BACKWARD (to → from)
     2. Downstream: only follow edges FORWARD (from → to)
   This prevents fan-out through shared ancestors like source_owner.
   ══════════════════════════════════════════════════════════════════════════ */
Visual.prototype.traceDirectedLineage=function(col,idx,layers,connections,nodeEls,svg){
  var connectedEdges={};
  var startKey=col+"-"+idx;

  /* Seed with the rows that contain the clicked node */
  var clickedNode=layers[col].nodes[idx];
  var seedRows={};
  for(var ri=0;ri<clickedNode.rows.length;ri++) seedRows[clickedNode.rows[ri]]=true;

  /* nodeRows tracks which data rows are active at each node */
  var nodeRows={};
  nodeRows[startKey]=seedRows;

  /* --- Pass 1: trace UPSTREAM (row-aware) --- */
  var upQueue=[startKey];
  while(upQueue.length>0){
    var cur=upQueue.shift();
    var parts=cur.split("-");
    var cCol=parseInt(parts[0],10);
    var cIdx=parseInt(parts[1],10);
    var curRows=nodeRows[cur];

    for(var i=0;i<connections.length;i++){
      var c=connections[i];
      if(c.toCol===cCol&&c.toIdx===cIdx){
        var hasShared=false;
        for(var er=0;er<c.rows.length;er++){
          if(curRows[c.rows[er]]){hasShared=true;break;}
        }
        if(!hasShared) continue;
        connectedEdges[i]=true;
        var fromKey=c.fromCol+"-"+c.fromIdx;
        var addedNew=false;
        if(!nodeRows[fromKey]) nodeRows[fromKey]={};
        for(var er2=0;er2<c.rows.length;er2++){
          if(curRows[c.rows[er2]]&&!nodeRows[fromKey][c.rows[er2]]){
            nodeRows[fromKey][c.rows[er2]]=true;
            addedNew=true;
          }
        }
        if(addedNew) upQueue.push(fromKey);
      }
    }
  }

  /* --- Pass 2: trace DOWNSTREAM (row-aware) --- */
  nodeRows[startKey]=seedRows;
  var downQueue=[startKey];
  while(downQueue.length>0){
    var cur2=downQueue.shift();
    var parts2=cur2.split("-");
    var cCol2=parseInt(parts2[0],10);
    var cIdx2=parseInt(parts2[1],10);
    var curRows2=nodeRows[cur2];

    for(var j=0;j<connections.length;j++){
      var c2=connections[j];
      if(c2.fromCol===cCol2&&c2.fromIdx===cIdx2){
        var hasShared2=false;
        for(var er3=0;er3<c2.rows.length;er3++){
          if(curRows2[c2.rows[er3]]){hasShared2=true;break;}
        }
        if(!hasShared2) continue;
        connectedEdges[j]=true;
        var toKey=c2.toCol+"-"+c2.toIdx;
        var addedNew2=false;
        if(!nodeRows[toKey]) nodeRows[toKey]={};
        for(var er4=0;er4<c2.rows.length;er4++){
          if(curRows2[c2.rows[er4]]&&!nodeRows[toKey][c2.rows[er4]]){
            nodeRows[toKey][c2.rows[er4]]=true;
            addedNew2=true;
          }
        }
        if(addedNew2) downQueue.push(toKey);
      }
    }
  }

  var connected={};
  for(var nk in nodeRows) connected[nk]=true;

  /* Apply visual highlight */
  this.clearAllSelected(nodeEls);
  for(var key in nodeEls){
    if(connected[key]){
      nodeEls[key].style.opacity="1";
      nodeEls[key].classList.add("lineage-node-selected");
    } else {
      nodeEls[key].style.opacity="0.12";
      nodeEls[key].classList.remove("lineage-node-selected");
    }
  }

  var edges=svg.querySelectorAll(".lineage-edge");
  for(var ei=0;ei<edges.length;ei++){
    var edge=edges[ei];
    var edgeIdx=parseInt(edge.dataset.edgeIdx,10);
    if(connectedEdges[edgeIdx]){
      edge.setAttribute("opacity","0.85");
      edge.setAttribute("stroke-width","2.5");
    } else {
      edge.setAttribute("opacity","0.03");
      edge.setAttribute("stroke-width","1");
    }
  }

  /* v5.4: Update subtitles to show highlighted count */
  var highlightedPerCol={};
  for(var hKey in connected){
    var hParts=hKey.split("-");
    var hCol=parseInt(hParts[0],10);
    if(!highlightedPerCol[hCol]) highlightedPerCol[hCol]=0;
    highlightedPerCol[hCol]++;
  }
  for(var sc=0;sc<layers.length;sc++){
    if(this._subtitleEls[sc]){
      var hCount=highlightedPerCol[sc]||0;
      var totalCount=layers[sc].count;
      var subtitle=this.layerSubtitleOverrides[sc];
      var unit=(subtitle&&subtitle.trim()!=="")?subtitle:("table"+(totalCount!==1?"s":""));
      if(hCount>0){
        this._subtitleEls[sc].textContent=hCount+" of "+totalCount+" "+unit;
      } else {
        this._subtitleEls[sc].textContent="0 of "+totalCount+" "+unit;
      }
      /* v6.1: show health counts for highlighted nodes only */
      var highlightedNodes=[];
      for(var hk in connected){
        var hp=hk.split("-");
        if(parseInt(hp[0],10)===sc) highlightedNodes.push(layers[sc].nodes[parseInt(hp[1],10)]);
      }
      this._appendHealthSummary(this._subtitleEls[sc],highlightedNodes);
    }
  }
};

/* ── Clear selected ── */
Visual.prototype.clearAllSelected=function(nodeEls){
  for(var key in nodeEls) nodeEls[key].classList.remove("lineage-node-selected");
};

/* ── Health summary: count green/yellow/red from nodes ── */
Visual.prototype._countHealth=function(nodes){
  var g=0,y=0,r=0;
  for(var i=0;i<nodes.length;i++){
    if(!nodes[i].meta||!nodes[i].meta.health) continue;
    var v=(nodes[i].meta.health||"").trim().toLowerCase();
    if(v==="green"||v==="healthy"||v==="health"||v==="ok"||v==="good") g++;
    else if(v==="yellow"||v==="warning"||v==="amber"||v==="degraded") y++;
    else if(v==="red"||v==="critical"||v==="error"||v==="down"||v==="stale") r++;
  }
  return {green:g,yellow:y,red:r,total:g+y+r};
};

/* ── Append colored health dots to a subtitle element ── */
Visual.prototype._appendHealthSummary=function(el,nodes){
  var h=this._countHealth(nodes);
  if(h.total===0) return;
  var span=document.createElement("span");
  span.className="lineage-health-summary";
  var parts=[];
  if(h.green>0) parts.push('<span style="color:#22c55e">\u25CF</span>'+h.green);
  if(h.yellow>0) parts.push('<span style="color:#eab308">\u25CF</span>'+h.yellow);
  if(h.red>0) parts.push('<span style="color:#ef4444">\u25CF</span>'+h.red);
  span.innerHTML=" \u00b7 "+parts.join(" ");
  el.appendChild(span);
};

/* ── Copy to clipboard + toast ── */
Visual.prototype.copyToClipboard=function(text){
  var self=this;
  var fallback=function(){
    var ta=document.createElement("textarea");
    ta.value=text;
    ta.style.position="fixed";
    ta.style.left="-9999px";
    ta.style.top="-9999px";
    ta.style.opacity="0";
    self.target.appendChild(ta);
    ta.focus();
    ta.select();
    try{
      var ok=document.execCommand("copy");
      if(ok) self.showToast("Copied!");
    }catch(e){}
    self.target.removeChild(ta);
  };
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(
      function(){self.showToast("Copied!");},
      function(){fallback();}
    );
  }else{
    fallback();
  }
};

Visual.prototype.showToast=function(msg){
  var ex=this.container.querySelector(".lineage-toast");
  if(ex) ex.remove();
  var t=document.createElement("div");
  t.className="lineage-toast";t.textContent=msg;
  this.container.appendChild(t);
  setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},1600);
};

/* ── Tooltip (below hovered node) ── */
Visual.prototype.showTooltip=function(el,text,meta){
  this.hideTooltip();
  var tip=document.createElement("div");
  tip.className="lineage-tooltip";
  var nameDiv=document.createElement("div");
  nameDiv.textContent=text;
  nameDiv.style.fontWeight="600";
  tip.appendChild(nameDiv);
  if(meta){
    if(meta.health){var hd=document.createElement("div");hd.className="lineage-tip-meta";var hv2=(meta.health||"").toLowerCase();var isW=(hv2==="yellow"||hv2==="warning"||hv2==="amber"||hv2==="degraded");var isR=(hv2==="red"||hv2==="critical"||hv2==="error"||hv2==="down"||hv2==="stale");hd.innerHTML='<span class="lineage-health-dot" style="background:'+healthColor(meta.health)+';box-shadow:0 0 4px '+healthColor(meta.health)+';width:6px;height:6px;margin-right:4px"></span>Health: '+meta.health;tip.appendChild(hd);}
    if(meta.refreshed){var rd=document.createElement("div");rd.className="lineage-tip-meta";rd.textContent="Refreshed: "+meta.refreshed;tip.appendChild(rd);}
    if(meta.storage){var sd=document.createElement("div");sd.className="lineage-tip-meta";sd.textContent="Storage: "+meta.storage;tip.appendChild(sd);}
  }
  this.container.appendChild(tip);
  var elRect=el.getBoundingClientRect();
  var cRect=this.container.getBoundingClientRect();
  var tipX=elRect.left+elRect.width/2-cRect.left;
  var tipY=elRect.bottom-cRect.top+6;
  tip.style.left=tipX+"px";
  tip.style.top=tipY+"px";
  tip.style.transform="translateX(-50%)";
  /* Clamp horizontally so it stays within the container */
  var tipRect=tip.getBoundingClientRect();
  if(tipRect.left<cRect.left){tip.style.left=(tipRect.width/2+4)+"px";}
  if(tipRect.right>cRect.right){tip.style.left=(cRect.width-tipRect.width/2-4)+"px";}
};

Visual.prototype.hideTooltip=function(){
  var ex=this.container.querySelector(".lineage-tooltip");
  if(ex) ex.remove();
};

/* ── Right-click context menu ── */
Visual.prototype.showContextMenu=function(x,y,text){
  var self=this;
  /* Remove any existing menu */
  var existing=this.container.querySelector(".lineage-ctx-menu");
  if(existing) existing.remove();

  var menu=document.createElement("div");
  menu.className="lineage-ctx-menu";

  /* Position relative to container */
  var cRect=this.container.getBoundingClientRect();
  var posX=x-cRect.left;
  var posY=y-cRect.top;
  menu.style.left=posX+"px";
  menu.style.top=posY+"px";

  var item=document.createElement("div");
  item.className="lineage-ctx-item";
  item.innerHTML='<span style="margin-right:6px;">&#128203;</span>Copy Value';
  item.addEventListener("click",function(e){
    e.stopPropagation();
    self.copyToClipboard(text);
    menu.remove();
  });
  menu.appendChild(item);

  this.container.appendChild(menu);

  /* Close on click anywhere else */
  var closeHandler=function(e){
    if(!menu.contains(e.target)){
      menu.remove();
      document.removeEventListener("click",closeHandler,true);
      document.removeEventListener("contextmenu",closeHandler,true);
    }
  };
  setTimeout(function(){
    document.addEventListener("click",closeHandler,true);
    document.addEventListener("contextmenu",closeHandler,true);
  },0);
};

/* ── Draw Edges ── */
Visual.prototype.drawEdges=function(main,svg,connections,layers,nodeEls){
  svg.innerHTML="";
  var cRect=main.getBoundingClientRect();
  var svgH=main.scrollHeight,svgW=main.scrollWidth;
  svg.setAttribute("width",String(svgW));
  svg.setAttribute("height",String(svgH));
  svg.style.width=svgW+"px";
  svg.style.height=svgH+"px";
  var self=this;
  for(var idx=0;idx<connections.length;idx++){
    (function(edgeIdx){
      var conn=connections[edgeIdx];
      var fromEl=nodeEls[conn.fromCol+"-"+conn.fromIdx];
      var toEl=nodeEls[conn.toCol+"-"+conn.toIdx];
      if(!fromEl||!toEl) return;
      var fR=fromEl.getBoundingClientRect();
      var tR=toEl.getBoundingClientRect();
      var x1=fR.right-cRect.left;
      var y1=fR.top+fR.height/2-cRect.top;
      var x2=tR.left-cRect.left;
      var y2=tR.top+tR.height/2-cRect.top;
      var cx1=x1+(x2-x1)*0.4;
      var cx2=x1+(x2-x1)*0.6;
      var path=document.createElementNS("http://www.w3.org/2000/svg","path");
      path.setAttribute("d","M "+x1+" "+y1+" C "+cx1+" "+y1+", "+cx2+" "+y2+", "+x2+" "+y2);
      path.setAttribute("fill","none");
      path.setAttribute("stroke",self.getLayerColor(conn.fromCol));
      path.setAttribute("stroke-width",conn.isSkip?String(Math.max(1,self.settings.lineWidth-0.5)):String(self.settings.lineWidth));
      path.setAttribute("opacity",String(self.settings.lineOpacity));
      path.setAttribute("class","lineage-edge");
      if(conn.isSkip) path.setAttribute("stroke-dasharray","6 4");
      path.dataset.from=conn.fromCol+"-"+conn.fromIdx;
      path.dataset.to=conn.toCol+"-"+conn.toIdx;
      path.dataset.edgeIdx=String(edgeIdx);
      svg.appendChild(path);
    })(idx);
  }
};

/* ── Highlight (hover - immediate neighbors) ── */
Visual.prototype.highlightNode=function(col,idx,layers,connections,nodeEls,svg){
  var connected={};
  connected[col+"-"+idx]=true;
  connections.forEach(function(c){
    if(c.fromCol===col&&c.fromIdx===idx) connected[c.toCol+"-"+c.toIdx]=true;
    if(c.toCol===col&&c.toIdx===idx) connected[c.fromCol+"-"+c.fromIdx]=true;
  });
  for(var key in nodeEls){
    nodeEls[key].style.opacity=connected[key]?"1":"0.15";
  }
  svg.querySelectorAll(".lineage-edge").forEach(function(edge){
    var f=edge.dataset.from,t=edge.dataset.to;
    var isConn=(f===col+"-"+idx)||(t===col+"-"+idx);
    edge.setAttribute("opacity",isConn?"0.8":"0.04");
    edge.setAttribute("stroke-width",isConn?"2.5":"1");
  });
};

/* ── Clear highlight ── */
Visual.prototype.clearHighlight=function(layers,nodeEls,svg){
  for(var key in nodeEls) nodeEls[key].style.opacity="1";
  var self=this;
  svg.querySelectorAll(".lineage-edge").forEach(function(edge){
    edge.setAttribute("opacity",String(self.settings.lineOpacity));
    var isDash=edge.getAttribute("stroke-dasharray");
    edge.setAttribute("stroke-width",isDash?String(Math.max(1,self.settings.lineWidth-0.5)):String(self.settings.lineWidth));
  });
  /* v5.4: restore original subtitles */
  for(var sc in this._subtitleOriginals){
    if(this._subtitleEls[sc]) this._subtitleEls[sc].innerHTML=this._subtitleOriginals[sc];
  }
};

/* ── Read Settings ── */
Visual.prototype.readSettings=function(dv){
  var obj=dv.metadata&&dv.metadata.objects;
  if(!obj) return;
  var g=obj.general;
  if(g){
    if(g.headerFontSize!=null) this.settings.headerFontSize=Math.max(6,Math.min(40,Number(g.headerFontSize)||10));
    if(g.cellFontSize!=null) this.settings.cellFontSize=Math.max(6,Math.min(40,Number(g.cellFontSize)||10));
    if(g.showBadge!=null) this.settings.showBadge=!!g.showBadge;
    if(g.showTooltip!=null) this.settings.showTooltip=!!g.showTooltip;
    if(g.storageFontSize!=null) this.settings.storageFontSize=Math.max(5,Math.min(20,Number(g.storageFontSize)||7));
  }
  var ls=obj.lineSettings;
  if(ls){
    if(ls.lineOpacity!=null) this.settings.lineOpacity=Math.max(0.05,Math.min(1,Number(ls.lineOpacity)||0.25));
    if(ls.lineWidth!=null) this.settings.lineWidth=Math.max(0.5,Math.min(6,Number(ls.lineWidth)||1.5));
  }
  var lc=obj.layerColors;
  if(lc){
    for(var i=0;i<12;i++){
      var key="layer"+i+"Color";
      if(lc[key]&&lc[key].solid&&lc[key].solid.color) this.layerColorOverrides[i]=lc[key].solid.color;
    }
  }
  /* v4: subtitles */
  var lsub=obj.layerSubtitles;
  if(lsub){
    for(var j=0;j<12;j++){
      var skey="layer"+j+"Subtitle";
      if(lsub[skey]!=null) this.layerSubtitleOverrides[j]=String(lsub[skey]);
    }
  }
  /* v5: URL columns */
  var uc=obj.urlColumns;
  if(uc){
    for(var k=0;k<12;k++){
      var ukey="layer"+k+"IsUrl";
      if(uc[ukey]!=null) this.layerIsUrl[k]=!!uc[ukey];
    }
  }
  /* v4: interaction */
  var ia=obj.interaction;
  if(ia){
    if(ia.enableCrossFilter!=null) this.settings.enableCrossFilter=!!ia.enableCrossFilter;
    if(ia.urlClickAction!=null) this.settings.urlClickAction=String(ia.urlClickAction);
  }
};

Visual.prototype.getLayerColor=function(idx){
  if(this.layerColorOverrides[idx]) return this.layerColorOverrides[idx];
  return DEFAULT_COLORS[idx%DEFAULT_COLORS.length];
};

Visual.prototype.renderEmpty=function(){
  this.container.innerHTML='<div class="lineage-empty"><div class="lineage-empty-icon">&#8644;</div><div class="lineage-empty-title">Data Lineage Flow v6</div><div class="lineage-empty-desc">Drop columns into the <strong>Layers</strong> well in order.<br/>Each column becomes a layer. Duplicate values are grouped.<br/>Connections trace each row path; skipped layers use dashed lines.<br/><br/><strong>v6:</strong> Metadata columns (<code>X__health</code>, <code>X__refreshed</code>, <code>X__storage</code>) \u2022 Tooltip toggle \u2022 Health indicators<br/><strong>v5:</strong> Directed lineage trace \u2022 URL columns \u2022 Cross-filter \u2022 Custom subtitles</div></div>';
};

/* ── Formatting Model ── */
Visual.prototype.getFormattingModel=function(){
  var dv=this._dv;
  var obj=(dv&&dv.metadata&&dv.metadata.objects)||{};
  var g=obj.general||{};
  var ls=obj.lineSettings||{};
  var lc=obj.layerColors||{};
  var lsub=obj.layerSubtitles||{};
  var uc=obj.urlColumns||{};
  var ia=obj.interaction||{};

  var generalCard={
    displayName:"General",
    uid:"generalCard_uid",
    groups:[{uid:"general_group",slices:[
      {displayName:"Header Font Size",uid:"headerFontSize_uid",control:{type:"NumUpDown",properties:{descriptor:{objectName:"general",propertyName:"headerFontSize"},value:g.headerFontSize||10}}},
      {displayName:"Cell Font Size",uid:"cellFontSize_uid",control:{type:"NumUpDown",properties:{descriptor:{objectName:"general",propertyName:"cellFontSize"},value:g.cellFontSize||10}}},
      {displayName:"Show Count Badge",uid:"showBadge_uid",control:{type:"ToggleSwitch",properties:{descriptor:{objectName:"general",propertyName:"showBadge"},value:g.showBadge!=null?g.showBadge:true}}},
      {displayName:"Show Tooltip on Hover",uid:"showTooltip_uid",control:{type:"ToggleSwitch",properties:{descriptor:{objectName:"general",propertyName:"showTooltip"},value:g.showTooltip!=null?g.showTooltip:true}}},
      {displayName:"Storage Label Font Size",uid:"storageFontSize_uid",control:{type:"NumUpDown",properties:{descriptor:{objectName:"general",propertyName:"storageFontSize"},value:g.storageFontSize||7}}}
    ]}]
  };

  var interactionCard={
    displayName:"Interaction",
    uid:"interactionCard_uid",
    groups:[{uid:"interaction_group",slices:[
      {displayName:"Enable Cross-Filter on Click",uid:"enableCrossFilter_uid",control:{type:"ToggleSwitch",properties:{descriptor:{objectName:"interaction",propertyName:"enableCrossFilter"},value:ia.enableCrossFilter!=null?ia.enableCrossFilter:true}}},
      {displayName:"URL Click Action",uid:"urlClickAction_uid",control:{type:"Dropdown",properties:{descriptor:{objectName:"interaction",propertyName:"urlClickAction"},value:ia.urlClickAction||"open"}}}
    ]}]
  };

  var lineCard={
    displayName:"Connection Lines",
    uid:"lineCard_uid",
    groups:[{uid:"line_group",slices:[
      {displayName:"Line Opacity",uid:"lineOpacity_uid",control:{type:"NumUpDown",properties:{descriptor:{objectName:"lineSettings",propertyName:"lineOpacity"},value:ls.lineOpacity||0.25}}},
      {displayName:"Line Width",uid:"lineWidth_uid",control:{type:"NumUpDown",properties:{descriptor:{objectName:"lineSettings",propertyName:"lineWidth"},value:ls.lineWidth||1.5}}}
    ]}]
  };

  var colorSlices=[];
  for(var i=0;i<12;i++){
    var key="layer"+i+"Color";
    var val=DEFAULT_COLORS[i];
    if(lc[key]&&lc[key].solid&&lc[key].solid.color) val=lc[key].solid.color;
    colorSlices.push({displayName:"Layer "+i,uid:"layer"+i+"Color_uid",control:{type:"ColorPicker",properties:{descriptor:{objectName:"layerColors",propertyName:key},value:{value:val}}}});
  }
  var colorCard={displayName:"Layer Colors",uid:"colorCard_uid",groups:[{uid:"color_group",slices:colorSlices}]};

  var subtitleSlices=[];
  for(var j=0;j<12;j++){
    var skey="layer"+j+"Subtitle";
    var sval=lsub[skey]||"";
    subtitleSlices.push({displayName:"Layer "+j+" Subtitle",uid:"layer"+j+"Subtitle_uid",control:{type:"TextInput",properties:{descriptor:{objectName:"layerSubtitles",propertyName:skey},value:sval,placeholder:"tables"}}});
  }
  var subtitleCard={displayName:"Layer Subtitles",uid:"subtitleCard_uid",groups:[{uid:"subtitle_group",slices:subtitleSlices}]};

  /* v5: URL Columns card */
  var urlSlices=[];
  for(var k=0;k<12;k++){
    var ukey="layer"+k+"IsUrl";
    var uval=uc[ukey]!=null?!!uc[ukey]:false;
    urlSlices.push({displayName:"Layer "+k+" is URL",uid:"layer"+k+"IsUrl_uid",control:{type:"ToggleSwitch",properties:{descriptor:{objectName:"urlColumns",propertyName:ukey},value:uval}}});
  }
  var urlCard={displayName:"URL Columns",uid:"urlCard_uid",groups:[{uid:"url_group",slices:urlSlices}]};

  return {cards:[generalCard,interactionCard,urlCard,colorCard,subtitleCard,lineCard]};
};

var pbi=window.powerbi;
var pluginDef={
  name:"dataLineageFlow1163C8FD56F049FA866FE2D65619549C",
  displayName:"Data Lineage Flow",
  class:"Visual",
  apiVersion:"5.3.0",
  create:function(opts){return new Visual(opts);},
  createModalDialog:function(){},
  custom:true
};
if(typeof pbi!=="undefined"){
  pbi.visuals=pbi.visuals||{};
  pbi.visuals.plugins=pbi.visuals.plugins||{};
  pbi.visuals.plugins["dataLineageFlow1163C8FD56F049FA866FE2D65619549C"]=pluginDef;
}
dataLineageFlow1163C8FD56F049FA866FE2D65619549C = {default:pluginDef};
})();
