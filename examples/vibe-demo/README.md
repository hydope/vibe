# vibe-demo

A 10-line Express app bundled with [Vibe](https://github.com/hydope/vibe). The fastest way to see Vibe work:

```bash
npx -y hydope/vibe demo                 # runs this folder
# or, from a clone of hydope/vibe:
node dist/cli.js examples/vibe-demo
```

Vibe copies it into a sandbox, detects Node, runs `npm install`, picks `npm start`, grabs a free port, and hands you a URL. Seconds, no config.

This used to live in a separate `hydope/vibe-demo` repo; it was merged here with its history (`git subtree`).
