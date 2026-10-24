# ⚡ Vibe

### Point it at any repo. Get a running app. Zero config.

[![CI](https://github.com/hydope/vibe/actions/workflows/ci.yml/badge.svg)](https://github.com/hydope/vibe/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](package.json)

![Vibe running its bundled demo: one command, detect, install, serve](demo/vibe-demo.gif)

<sub>Real terminal recording of `npx -y hydope/vibe demo` (made with [VHS](https://github.com/charmbracelet/vhs) from [`demo/vibe-demo.tape`](demo/vibe-demo.tape)), nothing staged.</sub>

## 🚀 Try it in 10 seconds

```bash
npx -y hydope/vibe demo                                    # bundled Express app: detect → npm install → serve
npx -y hydope/vibe hydope/vibe-demo                        # clone + run a public repo (owner/name or URL)
npx -y hydope/vibe heroku/node-js-getting-started          # any public GitHub repo
npx -y hydope/vibe ./path/to/your/project                  # or a local folder
```

Vibe shallow-clones the repo, sniffs the stack, installs dependencies with the right package manager, figures out the start command, grabs a free port, injects `PORT`, and runs it in a sandbox, streaming clean logs while it works. No Dockerfile to write. No YAML. No README archaeology.

Requires Node ≥ 18 and git. Runs straight from GitHub via `npx`, no npm account or global install needed.

## 🧪 Verified on real repos

Every row below was run end-to-end with Vibe v0.1.1 and answered `HTTP 200` on `/`:

| Target | Stack | Result |
|---|---|---|
| `npx -y hydope/vibe demo` | Node + Express | served in ~5s (bundled, works offline after first install) |
| `hydope/vibe-demo` | Node + Express (git clone) | served on first try |
| `heroku/node-js-getting-started` | Node + Express + EJS | served on first try |
| `render-examples/flask-hello-world` | Python + Flask (venv + pip) | served on first try |

Big monorepos that need API keys (e.g. cal.com) stop and tell you exactly which env vars are missing instead of pretending. Found a repo Vibe can't run? [Open an issue](https://github.com/hydope/vibe/issues/new) with the URL and the log tail; that is the most useful bug report there is.

## 🧠 What it actually does

```
Repo URL ──▶ Ingest ──▶ Detect ──▶ Install ──▶ Heal ──▶ Sandbox ──▶ Serve
             (shallow   (stack     (right pm,   (bounded   (scrubbed   (free port,
              clone)     heuristics) 10-min cap) retries)   env, tree    readiness
                                                          kill)      probe)
```

**Stack detection** — `package.json` (npm/yarn/pnpm/bun lockfiles), `requirements.txt` / `pyproject.toml` (Flask, FastAPI, Django, Streamlit, plain scripts), `go.mod`, `Cargo.toml`, `Dockerfile`, static sites. Unknown layout? It tells you exactly what's missing instead of guessing.

**Self-healing loop** — watches the app's stderr with pattern matchers and retries, *always printing what it's doing*:

| It sees | It does |
|---|---|
| `Cannot find module 'x'` | `npm install x`, restart |
| `No module named 'y'` | `pip install y` into the venv, restart |
| `EADDRINUSE` | grabs the next free port, restart |
| missing `ALL_CAPS` env var | stubs a `.env` entry and warns you loudly |

Two retries max, then it hands you the real error. Nothing silent, nothing magic.

**Sandbox** — apps run as child processes with a scrubbed environment (only `PATH`, `HOME`, `PORT`, and your `--env` flags), a 10-minute install cap, and full process-tree kill on exit. `--docker` builds and runs the repo's `Dockerfile` instead. `--tunnel` exposes it publicly via cloudflared.

## 🆚 How it compares

| | **Vibe** | [Nixpacks](https://github.com/railwayapp/nixpacks) (★3.5k) | [Buildpacks `pack`](https://github.com/buildpacks/pack) (★3.0k) | [Dev Containers CLI](https://github.com/devcontainers/cli) (★3.0k) | [Gitpod](https://github.com/gitpod-io/gitpod) (★13.8k) |
|---|---|---|---|---|---|
| Goal | **run it now, locally** | build an OCI image | build an OCI image | reproducible dev env | cloud dev env |
| Zero config on a random repo | ✅ | ✅ | ✅ | ⚠️ wants `devcontainer.json` | ⚠️ best with `.gitpod.yml` |
| Needs Docker | ❌ (optional `--docker`) | ✅ | ✅ | ✅ | hosted |
| Starts the app + finds a free port | ✅ | ❌ build only | ❌ build only | ❌ | ✅ |
| Self-heals missing deps / busy ports | ✅ | ❌ | ❌ | ❌ | ❌ |
| One-command public URL | ✅ `--tunnel` | ❌ | ❌ | ❌ | ✅ |
| Account required | ❌ | ❌ | ❌ | ❌ | ✅ |

<sub>Star counts from the GitHub API on 2026-10-23.</sub>

Vibe isn't a replacement for any of these. It's the thing you reach for *before* them, when you just want to see the code run.

## ⌨️ Usage

```bash
vibe <repo> [options]          # run it. repo = owner/name, git URL, or local dir

  --docker                     # build & run via the repo's Dockerfile
  --tunnel                     # expose on a public URL (needs cloudflared)
  --env KEY=VAL                # extra env vars (repeatable)
  --port N                     # preferred starting port (default: auto)
  --no-install                 # skip dependency install

vibe demo                      # run the bundled demo app (no other repo needed)
vibe doctor                    # check your toolchain
vibe badge [owner/repo]        # print a "Run with Vibe" README badge
vibe clean                     # wipe cached runs (~/.vibe/runs)
```

## 🏷️ Add the badge to your repo

Let people run your project with one click:

```markdown
[![Run with Vibe](https://img.shields.io/badge/Run_with-Vibe-7c3aed?style=flat-square)](https://github.com/hydope/vibe)
```

```bash
npx -y hydope/vibe <your-repo-url>
```

## 🛣️ Roadmap

- [x] `vibe demo`: bundled example so the quickstart works with nothing else (v0.1.1)
- [ ] `npm i -g vibe-run` (npm publish)
- [ ] Container-first sandbox (rootless, resource-capped) as the default
- [ ] More stacks: Bun, Deno, PHP, Ruby, JVM
- [ ] Smarter healing: an opt-in LLM pass over unknown tracebacks
- [ ] `vibe deploy`: one-click export to Fly / Render / K8s

## 🤝 Contributing

Found a repo Vibe can't run? That's the best possible issue: [open one](https://github.com/hydope/vibe/issues) with the repo URL and the log tail. PRs that add stack detectors or heal patterns are especially welcome. See [ARCHITECTURE.md](ARCHITECTURE.md) for the pipeline.

```bash
git clone https://github.com/hydope/vibe && cd vibe && npm install && npm test
node dist/cli.js demo
```

## 🏷️ Add the badge to your repo

```markdown
[![Run with Vibe](https://img.shields.io/badge/Run_with-Vibe-7c3aed?style=flat-square)](https://github.com/hydope/vibe)
```

## 📄 License

MIT, see [LICENSE](LICENSE).
