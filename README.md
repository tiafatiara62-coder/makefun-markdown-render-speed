# Fast marked-compatible Markdown renderer

[![make.fun](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/tiafatiara62-coder/makefun-markdown-render-speed/rank.svg)](https://make.fun/bounty/markdown-render-speed-02)
[![reward](https://make.fun/badge/markdown-render-speed-02/tiafatiara62-coder/makefun-markdown-render-speed/reward.svg)](https://make.fun/bounty/markdown-render-speed-02)

Entry for the [make.fun `markdown-render-speed-02` bounty](https://make.fun/bounty/markdown-render-speed-02): a faster drop-in for [marked](https://github.com/markedjs/marked) 18.1.3 that renders byte-identical HTML for less CPU.

## Method

`parse.js` is a from-scratch single-pass index scanner that emits HTML directly — no token tree. First-char dispatch, plain-text fast paths, fast HTML escaping, memoized regexes, lazy emphasis scan. `main.ts` is the Node 22 driver: reads `/input/cases.json`, renders each case alone with `parse()`, writes `/output/html.json`.
