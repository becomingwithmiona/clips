# pixie-clips

Miona's clips hub, served at https://becomingwithmiona.github.io/clips/

One folder per stream (e.g. `ep1-ep2-recut/`, `ep4/`), linked from `index.html`.

## Adding a stream
1. Put the full-quality `*-vertical.mp4` clips and transcript(s) in a new folder.
2. Run `sh _template/make-save-copies.sh FOLDER` to create light phone save copies in `FOLDER/save/` (1080x1920 H.264, CRF 25, max 700k, AAC 160k, faststart, about 4 to 8 MB).
3. Build the page with `_template/clip-block.html`: `data-src` points to the light save copy, `data-open` to the full file. Load `../save.js` once at the end.
4. Add the folder to `index.html`.

`save.js` downloads only the tapped clip (no prefetch), shows a real percent, retries on timeout, then shows "Tap again to save", which opens the iPhone share sheet (Save Video). An "Open video" link sits under each button as a fallback.
