# Cloud transfer: TA Learning Platform seed v7

Created by Cursor cloud agent when push to `ta-learning-platform` returned 403.

- Commit: `b00f60e` — Expand TA study book content for Months 2–12 (seed v7).

## Apply on a machine that can push to ta-learning-platform

```bash
cd /path/to/ta-learning-platform
git fetch ../vishalthakur.github.io/cloud-transfers/ta-seed-v7.bundle HEAD:cursor/seed-v7-textbook-expansion
git checkout main
git merge --ff-only cursor/seed-v7-textbook-expansion
git push origin main
```

Or from this portfolio clone path next to the TA repo:

```bash
git -C ta-learning-platform fetch ../vishalthakur.github.io/cloud-transfers/ta-seed-v7.bundle HEAD:cursor/seed-v7-textbook-expansion
git -C ta-learning-platform merge --ff-only cursor/seed-v7-textbook-expansion
git -C ta-learning-platform push origin main
```
