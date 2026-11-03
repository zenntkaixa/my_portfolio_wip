# Moving this repo from Windows to Ubuntu

## On Windows (PowerShell), one time

```powershell
cd C:\my_projects\my_portfolio
# (extract the zip contents here first, so CLAUDE.md sits directly in this folder)
git init -b main
git config core.autocrlf false        # .gitattributes handles line endings
git add -A
git commit -m "chore: project scaffold and Claude Code framework"
gh repo create my_portfolio --private --source . --push
# or create an empty repo on github.com, then:
#   git remote add origin https://github.com/zenntkaixa/my_portfolio.git
#   git push -u origin main
```

Don't run `npm install` on Windows unless you plan to develop there too; `node_modules` is ignored anyway.

## On Ubuntu

```bash
git clone https://github.com/zenntkaixa/my_portfolio.git
cd my_portfolio
nvm install && nvm use          # Node 26 from .nvmrc
npm install
npx playwright install --with-deps chromium
cp .env.example .env.local      # add ANTHROPIC_API_KEY yourself
npm run check
claude
```

In Claude Code, type `/next-task`. It will pick up "First run on Ubuntu" from the roadmap.

## Working on both machines
Always `git pull` before starting and `/ship` (commit and push) before switching machines.
`docs/PROGRESS.md` travels with the repo, so Claude Code on either machine knows where you left off.
