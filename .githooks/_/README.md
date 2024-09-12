# .githooks/\_/husky

## Summary

- Description: husky shell script adapted from the original husky template for Git hooks.
- Documentation: https://typicode.github.io/husky/
- Repository: https://github.com/typicode/husky
- Version: 9.1.6

## Upgrading the husky version

1. Begin by running the following commands:

```sh
# Upgrade to the latest version of husky.
npm install --save-dev --save-exact husky@latest

# Re-initialize the `.husky` folder and its Git hook files.
npx husky init
```

2. Update the `Version` number in the [Summary](#summary) section of this file.

3. Open the `package.json` file and delete the unneeded `prepare` script that was added after running the `husky init` command.

4. Execute the `npm run init` command to re-configure the Git hooks path back to the `.githooks/` directory.

5. Compare the Git diffs between the following files and incorporate the changes from the former into the latter:

| Former               | Latter                  |
| :------------------- | :---------------------- |
| .husky/\_/h          | .githooks/\_/husky      |
| .husky/\_/commit-msg | .githooks/\_/commit-msg |
| .husky/\_/pre-commit | .githooks/\_/pre-commit |
| .husky/\_/pre-push   | .githooks/\_/pre-push   |

6. Delete the `.husky/` directory.

7. Commit the changes to all modified files:

```sh
git add --all && git commit -m "fix(dependencies): update 'husky' to latest version"
```
