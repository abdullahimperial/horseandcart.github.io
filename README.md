# Let’s Fix Money

Source for Abdullah Mohiuddin’s book companion website, interactive course, financial tools, games and Money Snapshot Android app.

**This repository is the source of truth for continuing development. A previous ChatGPT conversation must not be required.** Changes include the relevant code, documentation, verification and a current handover. This is the owner’s standing instruction, recorded in [AGENTS.md](AGENTS.md).

## Start or resume here

1. [AGENTS.md](AGENTS.md): instructions for every contributor and future coding session.
2. [Current checkpoint](docs/PROJECT_STATUS.md): completed work, verification, limitations and next steps.
3. [Development guide](docs/DEVELOPMENT.md): setup, tests, Android builds and deployment.
4. [Architecture](docs/ARCHITECTURE.md): where behavior lives and why.
5. [Changelog](CHANGELOG.md): meaningful changes.
6. [Editorial source register](docs/CONTENT_SOURCES.md): book/workshop originals outside this public software repository.

## Run the website

Static HTML, CSS and JavaScript; no site build, package install or API key required.

```sh
git clone https://github.com/abdullahimperial/horseandcart.github.io.git
cd horseandcart.github.io
python3 -m http.server 8010
```

Open `http://localhost:8010/`. On Windows, `py -3` can replace `python3`. Serve the repository root so nested pages resolve their assets.

- [Live website](https://www.letsfixmoney.com/)
- [Urdu website](https://www.letsfixmoney.com/?lang=ur)
- [Course](https://www.letsfixmoney.com/course/index.html)
- [Money Snapshot](https://www.letsfixmoney.com/apps/financial-reset/)

English is the first-visit default. The top English/اردو control preserves the current page and entered values. A remembered preference applies later; `?lang=en` or `?lang=ur` overrides it.

## Repository map

| Path | Purpose |
| --- | --- |
| Root HTML and `assets/` | Homepage/framework animation, navigation, resources, currency, privacy and language controls |
| [course/](course/README.md) | Nine modules, 102 lessons, 55 activities, visual experiments and saved workbook |
| [apps/financial-reset/](apps/financial-reset/README.md) | Money Snapshot: local statement imports, review, reports and action plans |
| `apps/true-cost/`, `apps/investment/`, `apps/checklist/`, `apps/savings-planner/` | Other tools and calculation engines |
| `activities/`, `calculators/`, [games/](games/README.md) | Exercises, mortgage calculator and financial games |
| [android/](android/README.md) | Native shell and offline bundle of the shared Money Snapshot code |
| [assets/i18n/](assets/i18n/README.md) | Authored Urdu copy, language runtime, RTL styling and local fonts |
| `scripts/`, `.github/workflows/` | Repeatable checks and Android build automation |
| `docs/`, `AGENTS.md`, `CHANGELOG.md` | Project instructions and continuity |

## Verify a change

Install Node.js 22+ and Python 3.10+, then run:

```sh
python3 scripts/check.py
```

This runs the source JavaScript suites and Android offline-bundle tests without the Android SDK. The same command runs in the **Repository checks** workflow. Browser tests and native compilation are separate; see [DEVELOPMENT.md](docs/DEVELOPMENT.md).

The **Android Money Snapshot** workflow builds preview and unsigned-release APKs. [android/README.md](android/README.md) explains downloads, signing and device testing. An installed offline app needs a new APK to receive website changes.

## Scope and data

The site remains an educational simulation with its existing notices. Money Snapshot processes CAD statements locally; development uses fictional inputs. There is no bank connection, account backend or AI report API. Purchases count once; repayments are transfers, interest/fees are expenses and purchase refunds reduce spending.

Course notes can be saved locally. Imported financial records stay in memory until explicitly exported. See the component READMEs for exact behavior.

`contact.html` creates an inquiry draft; it does not submit a form to a server. Public email and YouTube links are present. Newsletter signup remains a placeholder.

## Finish every work session

Update relevant component documentation, `CHANGELOG.md` and `docs/PROJECT_STATUS.md` with what changed, why, checks actually run, limitations and the next concrete step. Commit and push authorized changes, then verify the remote commit and applicable workflows. Checkpoint substantial work before a long build or interruption. Necessary decisions and unfinished-work notes must not exist only in chat.

## Narrated short

[Horse and cart production](media/horse-cart-heart-v2/README.md) records the script, Kokoro Heart model, audio-first timing and rebuild workflow on branch `media/horse-cart-heart-v2`.
