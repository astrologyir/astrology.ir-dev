# astrology.ir-dev — staging

Compiled staging builds for [astrology.ir](https://astrology.ir) deployed to
GitHub Pages. This repo is **public**; the live site lives in
[`astrologyir/web`](https://github.com/astrologyir/web) and the compute engine
in [`astrologyir/engine`](https://github.com/astrologyir/engine).

## Why a separate repo?

The live site must never be reachable from a public repo. This repo holds only
the compiled `build/` output — no source, no secrets, no engine code. The
staging URL is the Pages URL of this repo.

## Deploy

`.github/workflows/staging-deploy.yml` runs on `push` to `main` (and on
`repository_dispatch` with type `staging-deploy`, so the live `web` CI can
trigger a staging rebuild after a release).

### Required secret

| Secret          | Scope                                  | Purpose                                            |
| --------------- | -------------------------------------- | -------------------------------------------------- |
| `ENGINE_TOKEN`  | `astrologyir/astrology.ir-dev` (secrets) | Fine-grained PAT with `Contents: read` on BOTH `astrologyir/engine` and `astrologyir/web` |

The default `GITHUB_TOKEN` cannot cross into the private repos (cross-owner
restriction), so a PAT is mandatory. Create it at
`https://github.com/astrologyir/astrology.ir-dev/settings/secrets/actions`.

If `ENGINE_TOKEN` is missing the engine checkout falls back to the committed
`vendor/engine.bundle` in the web repo (292 KB git bundle, full main history).

### Manual trigger

`Actions → Staging Deploy → Run workflow` rebuilds from the pinned branches.

## Pin

The wasm binary is pinned to `mshafiee/swisseph-zig@v2.10.3-rc2` (see the
`Build swisseph-zig wasm` step). Bump the `ref:` there for a new release.