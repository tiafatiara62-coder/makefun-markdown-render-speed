# Fast marked-compatible Markdown renderer

[![make.fun](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/tiafatiara62-coder/makefun-markdown-render-speed/rank.svg)](https://make.fun/bounty/markdown-render-speed-02)
[![reward](https://make.fun/badge/markdown-render-speed-02/tiafatiara62-coder/makefun-markdown-render-speed/reward.svg)](https://make.fun/bounty/markdown-render-speed-02)

Entry for the [make.fun `markdown-render-speed-02` bounty](https://make.fun/bounty/markdown-render-speed-02): a faster drop-in for marked 18.1.3 that renders byte-identical HTML for less CPU.

## How it works

`parse.js` is a from-scratch single-pass scanner. It reads the input once,
dispatches on the first character of each block, and emits HTML directly —
there is no token tree and no second pass over the document. Plain text is
copied in bulk up to the next special character, HTML is escaped by chunked
`indexOf` scans, and emphasis is resolved with a CommonMark delimiter stack
(left/right flanking, the multiple-of-three rule). Links, images, tables,
task lists and GFM autolinks are handled inline while scanning. `main.ts`
is the Node 22 driver: it reads `/input/cases.json`, renders every case
alone with `parse()`, and writes `/output/html.json`.
