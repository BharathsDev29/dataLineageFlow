"""
Build script for Data Lineage Flow custom visual.
Packages src/visual.ts + style/visual.less into a .pbiviz file.

Usage:
    python build.py
"""
import json, base64, zipfile, os

GUID = "dataLineageFlow1163C8FD56F049FA866FE2D65619549C"

# ── Read source files ──
with open("src/visual.ts", "r", encoding="utf-8") as f:
    js_code = f.read()

with open("style/visual.less", "r", encoding="utf-8") as f:
    css_code = f.read()

with open("capabilities.json", "r", encoding="utf-8") as f:
    capabilities = json.load(f)

with open("pbiviz.json", "r", encoding="utf-8") as f:
    pbiviz_meta = json.load(f)

# ── Read icon ──
icon_b64 = ""
icon_path = "assets/icon.png"
if os.path.exists(icon_path):
    with open(icon_path, "rb") as f:
        icon_b64 = base64.b64encode(f.read()).decode()

# ── Build the inner pbiviz.json ──
inner = {
    "visual": {
        "name": pbiviz_meta["visual"]["guid"],
        "displayName": pbiviz_meta["visual"]["displayName"],
        "guid": pbiviz_meta["visual"]["guid"],
        "visualClassName": pbiviz_meta["visual"]["visualClassName"],
        "version": pbiviz_meta["visual"]["version"],
        "description": pbiviz_meta["visual"]["description"],
        "supportUrl": pbiviz_meta["visual"].get("supportUrl", ""),
        "gitHubUrl": pbiviz_meta["visual"].get("gitHubUrl", "")
    },
    "apiVersion": pbiviz_meta.get("apiVersion", "5.3.0"),
    "style": {"resources": []},
    "capabilities": capabilities,
    "content": {
        "js": js_code,
        "css": css_code,
        "iconBase64": icon_b64
    }
}

# ── Build the outer package.json ──
resource_file = f"resources/{GUID}.pbiviz.json"
package = {
    "version": pbiviz_meta["visual"]["version"] + ".0",
    "author": pbiviz_meta.get("author", {"name": "Developer", "email": "dev@example.com"}),
    "resources": [
        {
            "resourceId": "rId0",
            "sourceType": 5,
            "file": resource_file
        }
    ],
    "visual": {
        "name": pbiviz_meta["visual"]["name"],
        "displayName": pbiviz_meta["visual"]["displayName"],
        "guid": pbiviz_meta["visual"]["guid"],
        "visualClassName": pbiviz_meta["visual"]["visualClassName"],
        "version": pbiviz_meta["visual"]["version"],
        "description": pbiviz_meta["visual"]["description"],
        "supportUrl": pbiviz_meta["visual"].get("supportUrl", ""),
        "gitHubUrl": pbiviz_meta["visual"].get("gitHubUrl", "")
    },
    "metadata": {
        "pbivizjson": {
            "resourceId": "rId0"
        }
    }
}

# ── Create .pbiviz (ZIP) ──
os.makedirs("dist", exist_ok=True)
version = pbiviz_meta["visual"]["version"].replace(".", "_")
output_file = f"dist/DataLineageFlow_v{version}.pbiviz"

with zipfile.ZipFile(output_file, "w", zipfile.ZIP_DEFLATED) as zf:
    zf.writestr("package.json", json.dumps(package))
    zf.writestr(resource_file, json.dumps(inner))

print(f"Built: {output_file}")
print(f"  JS:  {len(js_code)} chars")
print(f"  CSS: {len(css_code)} chars")
print(f"  Icon: {'yes' if icon_b64 else 'no'}")
print(f"\nImport this file into Power BI Desktop:")
print(f"  Visualizations pane > ... > Import a visual from a file > {output_file}")
