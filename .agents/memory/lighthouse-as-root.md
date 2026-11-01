# Lighthouse in a root container

2026-11-01. `make lighthouse` fails in agent containers that run as root (“Running as root without --no-sandbox is not supported”), and there is no system Chrome. A local run that works:

```sh
export CHROME_PATH=$(node -e "console.log(require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright').chromium.executablePath())")
npx lhci collect --staticDistDir=./dist --numberOfRuns=1 --url=/ --settings.chromeFlags="--no-sandbox --headless=new"
```

Scores are in `.lighthouseci/lhr-*.json` (delete the folder afterwards). CI isn’t affected, so don’t change `lighthouserc.json` for this.
