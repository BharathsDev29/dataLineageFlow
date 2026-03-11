# Data Lineage Flow — Power BI Custom Visual

**Author:** Bharath S.

## Project Structure

```
dataLineageFlow/
├── src/
│   └── visual.ts          ← Your visual logic (JavaScript)
├── style/
│   └── visual.less        ← Your styles (CSS)
├── assets/
│   └── icon.png           ← Visual icon (shows in Power BI toolbar)
├── capabilities.json      ← Data roles + Format pane settings
├── pbiviz.json            ← Visual metadata (name, version, author)
├── build.py               ← Build script
└── README.md              ← This file
```

## How to Build

### Prerequisites
- Python 3.x (already on most systems)

### Build Steps

1. Open a terminal/command prompt
2. Navigate to this folder:
   ```
   cd dataLineageFlow
   ```
3. Run the build script:
   ```
   python build.py
   ```
4. Output will be in `dist/` folder — a `.pbiviz` file

### Import into Power BI Desktop

1. Open Power BI Desktop
2. In the Visualizations pane, click `...` (three dots)
3. Choose **"Import a visual from a file"**
4. Select the `.pbiviz` file from the `dist/` folder
5. Your visual appears in the toolbar — drag it onto the canvas

## How to Edit

### Change visual logic
Edit `src/visual.ts` then run `python build.py`

### Change styles
Edit `style/visual.less` then run `python build.py`

### Add a Format pane setting
1. Add the property in `capabilities.json` under `objects`
2. Read it in `readSettings()` in `src/visual.ts`
3. Add the UI control in `getFormattingModel()` in `src/visual.ts`
4. Run `python build.py`

### Change version
Edit `version` in `pbiviz.json` then run `python build.py`

## Features

- Multi-layer column layout with auto-grouping
- SVG bezier curve connections between layers
- Directed lineage trace (BFS upstream + downstream)
- Right-click → Copy Value on any node
- Cross-filter integration with other Power BI visuals
- 12 configurable layer colors
- Custom subtitles per layer
- URL column support (open/copy/both)
- Dynamic subtitle updates during trace
- Downstream children badge count
