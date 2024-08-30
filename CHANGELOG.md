# CHANGELOG

## [1.9.1](https://github.com/dustin-ruetz/devdeps/compare/v1.9.0...v1.9.1) (2024-08-30)

### Bug Fixes

* **dependencies:** update packages to latest versions ([f8148a5](https://github.com/dustin-ruetz/devdeps/commit/f8148a5ee016a63219227964803d0015ef5a8f6c))

## [1.9.0](https://github.com/dustin-ruetz/devdeps/compare/v1.8.0...v1.9.0) (2024-08-30)

### Features

* **config/lint-staged.config:** remove '.json' files from file extensions and simplify file ([61cad4b](https://github.com/dustin-ruetz/devdeps/commit/61cad4bf31f1a52ab1a6b87c69e1292b33edd343))

### Bug Fixes

* **dependencies:** update packages to latest versions ([f8eefd8](https://github.com/dustin-ruetz/devdeps/commit/f8eefd8849a88be7dfc821e8ba3c2485d6cec0f0))

## [1.8.0](https://github.com/dustin-ruetz/devdeps/compare/v1.7.0...v1.8.0) (2024-08-30)

### Features

* enable typed linting feature of `typescript-eslint` ([#59](https://github.com/dustin-ruetz/devdeps/issues/59)) ([4a0026d](https://github.com/dustin-ruetz/devdeps/commit/4a0026da15483df7946d530c0aa0404069f414be))

## [1.7.0](https://github.com/dustin-ruetz/devdeps/compare/v1.6.0...v1.7.0) (2024-08-28)

### Features

* **.actrc:** initial 'act' configuration file ([fa55478](https://github.com/dustin-ruetz/devdeps/commit/fa55478fe70aad9307e5281af1733ab487f9b301)), closes [/github.com/nektos/act/issues/2239#issuecomment-1979819940](https://github.com/dustin-ruetz//github.com/nektos/act/issues/2239/issues/issuecomment-1979819940)
* **package.json:** run 'npx jest --clearCache' command as part of 'clean/caches' NPM script ([0f1dfd5](https://github.com/dustin-ruetz/devdeps/commit/0f1dfd5b2f0284eb1c5c470257de24981a1a2b35))

### Bug Fixes

* correct 'getRootPaths' and rename test output folder for 'init-repo' script ([f7e5a39](https://github.com/dustin-ruetz/devdeps/commit/f7e5a3927b4a2e0c15f91c4a02997063601eb7f4))
* **dependencies:** update packages to latest versions ([db4b4fc](https://github.com/dustin-ruetz/devdeps/commit/db4b4fca6b4a978bb3ec46adec4c666fbd1ae269))
* npm audit issue(s) ([77125aa](https://github.com/dustin-ruetz/devdeps/commit/77125aa4603cad7e5d969cc862acab8109b144fc))

## [1.6.0](https://github.com/dustin-ruetz/devdeps/compare/v1.5.0...v1.6.0) (2024-08-22)

### Features

* **constants:** initial constants file and unit test ([aa391d8](https://github.com/dustin-ruetz/devdeps/commit/aa391d8f343c2f0eb69697a8bf297aac2e67799d))
* move all configuration files into dedicated 'config/' directory ([a81f942](https://github.com/dustin-ruetz/devdeps/commit/a81f9426dd3353fa4c432bb9584d5bf87f951f19))
* **utils/getIsDevDepsRepo:** initial function and unit test ([c5b77ca](https://github.com/dustin-ruetz/devdeps/commit/c5b77caa96700141b186c4b947c6c6840b15be3a))

### Bug Fixes

* add 'v8 ignore next #' comments to work around erroneous 'Uncovered Line [#s](https://github.com/dustin-ruetz/devdeps/issues/s)' errors ([83633c6](https://github.com/dustin-ruetz/devdeps/commit/83633c677fc046e7b33c9c733c0d162c685f03b4))
* **dependencies:** update packages to latest versions ([84e2d6c](https://github.com/dustin-ruetz/devdeps/commit/84e2d6c353c6b60a238912e004129d10ff0fd994))
* **scripts/helpers/getRootPaths:** switch from 'absoluteRootDir' to 'cwd' of Node.js process ([0035a1c](https://github.com/dustin-ruetz/devdeps/commit/0035a1cfe3cd4f72c6f8cff5ca9d2e2972f12af6))

## [1.5.0](https://github.com/dustin-ruetz/devdeps/compare/v1.4.1...v1.5.0) (2024-08-19)

### Features

* remove CommonJS (.cjs) and CommonTS (.cts) file extensions from Jest config ([#53](https://github.com/dustin-ruetz/devdeps/issues/53)) ([4d8d197](https://github.com/dustin-ruetz/devdeps/commit/4d8d1975d4a66b57bcb747dd58ac5e02cba8a4bc))

## [1.4.1](https://github.com/dustin-ruetz/devdeps/compare/v1.4.0...v1.4.1) (2024-08-17)

### Bug Fixes

* **dependencies:** update packages to latest versions ([d8f5437](https://github.com/dustin-ruetz/devdeps/commit/d8f54372956d8de71ae3d670ea66b46fda20bf51))
* **scripts/helpers/initRepoHelpers:** format 'package.json' + '.vscode/settings.json' files w/ tabs ([a8e4fca](https://github.com/dustin-ruetz/devdeps/commit/a8e4fca18a1d3180f7b9a6bdcc572933572358ea))

## [1.4.0](https://github.com/dustin-ruetz/devdeps/compare/v1.3.1...v1.4.0) (2024-08-17)

### Features

* upgrade ESLint from v8 to v9 ([#52](https://github.com/dustin-ruetz/devdeps/issues/52)) ([6246dba](https://github.com/dustin-ruetz/devdeps/commit/6246dba9dfd60b014abfa0c38aa101fac67aca35))

## [1.3.1](https://github.com/dustin-ruetz/devdeps/compare/v1.3.0...v1.3.1) (2024-08-15)

### Bug Fixes

* **dependencies:** update packages to latest versions ([92017b8](https://github.com/dustin-ruetz/devdeps/commit/92017b80c0eb5b65db9fc22a59a73aba17dc77f7))
* **jest.config:** modify '@swc/jest' config to handle JSX/TSX files when testing React components ([89c1de1](https://github.com/dustin-ruetz/devdeps/commit/89c1de1d5da45773c8a7d92815dac6f7243e1a60))

## [1.3.0](https://github.com/dustin-ruetz/devdeps/compare/v1.2.0...v1.3.0) (2024-08-13)

### Features

* **.gitignore:** ignore '_/' underscore directory ([a95a181](https://github.com/dustin-ruetz/devdeps/commit/a95a1810a88184836f1d36b9691b231678347b33))
* **package.json:** add 'init-repo' NPM script for purposes of local development/testing ([239881f](https://github.com/dustin-ruetz/devdeps/commit/239881fa1a77848704d767ae8fe8ca6149b9ebee))
* **package.json:** add 'test/unit/coverage-watchAll' NPM script ([eded75a](https://github.com/dustin-ruetz/devdeps/commit/eded75a9f760ceece437137d5e2615476411a60d))
* **scripts/helpers/getRootPaths:** initial 'getRootPaths' function and unit test ([1ef08e1](https://github.com/dustin-ruetz/devdeps/commit/1ef08e1d79bdbde695e36f5019cca07fe182937e))
* **scripts/helpers/initRepoHelpers:** initial 'initRepoHelpers' functions and unit tests ([7188eb4](https://github.com/dustin-ruetz/devdeps/commit/7188eb416690712b3ef99aa2dfc3dc504e2c0462))
* **scripts/helpers/semVerRegExp:** initial 'semVerRegExp' function and unit test ([d1d1010](https://github.com/dustin-ruetz/devdeps/commit/d1d1010d71cc95ae036788ea4387d31b19973fa5))
* **scripts/initRepo:** initial 'initRepo' function and unit tests ([6abee1a](https://github.com/dustin-ruetz/devdeps/commit/6abee1aaf9852001632e1ca8698f913c71a04584))
* **src/index:** add 'eslint sort-keys' code comment to ensure alphabetical 'scripts' object keys ([b8e1532](https://github.com/dustin-ruetz/devdeps/commit/b8e1532fff8f753b4002b9fc3dbf02a712f0080f))
* **src/index:** initial 'runScript' index and unit tests ([f5bfcec](https://github.com/dustin-ruetz/devdeps/commit/f5bfcec796527f40308ace5541df35ffc3a222ef))

### Bug Fixes

* add 'v8 ignore next #' comments to work around erroneous 'Uncovered Line [#s](https://github.com/dustin-ruetz/devdeps/issues/s)' errors ([5295eef](https://github.com/dustin-ruetz/devdeps/commit/5295eef607ecda32f33bea4f03506aec843b7ea1))
* add 'v8 ignore next #' comments to work around erroneous 'Uncovered Line [#s](https://github.com/dustin-ruetz/devdeps/issues/s)' errors ([b36eaaf](https://github.com/dustin-ruetz/devdeps/commit/b36eaaff8190c02d55ecdf31fe23101418180cc3))
* change output path of 'init-repo' script (from '_/' to '.initRepoScriptTestOutput/') ([47ee350](https://github.com/dustin-ruetz/devdeps/commit/47ee350859f01f6864cfdf392edf92770fd02e13))
* **dependencies:** update husky to latest version ([c9e80a9](https://github.com/dustin-ruetz/devdeps/commit/c9e80a9c07394776ff5769a52bbfb98baddaa3ea))
* **dependencies:** update packages to latest versions ([8087b39](https://github.com/dustin-ruetz/devdeps/commit/8087b397de124f0f45119dabebd78b0357d20cc8))
* **eslint.config:** remove unnecessary 'no-undefined': 'error' rule ([d69f209](https://github.com/dustin-ruetz/devdeps/commit/d69f20931988f6397115a565a3ea3264ae7e03b0))
* **package.json:** improve format of 'repository.url' value ([d4e0d77](https://github.com/dustin-ruetz/devdeps/commit/d4e0d7778133629039851526ef4d318ea3ad2f35))
* **utils/dependsOn:** explicitly check if 'dep' is an empty string ([60fd183](https://github.com/dustin-ruetz/devdeps/commit/60fd183f432ebfcb13f8299100d3d30a5d32037c))

## [1.2.0](https://github.com/dustin-ruetz/devdeps/compare/v1.1.0...v1.2.0) (2024-08-01)

### Features

* include '.node-version' file in published NPM package ([c3bc22f](https://github.com/dustin-ruetz/devdeps/commit/c3bc22faba825e16e471696b26bad9aec59c1c69))

## [1.1.0](https://github.com/dustin-ruetz/devdeps/compare/v1.0.2...v1.1.0) (2024-07-25)

### Features

* **.githooks/_/husky:** prefix error message with 'ERR_HUSKY' code ([1bcdcd2](https://github.com/dustin-ruetz/devdeps/commit/1bcdcd2461ccac4ce05699d128a6a59b11c91197))
* **eslint.config:** turn off 'no-unused-vars' in favor of 'typescript-eslint/no-unused-vars' ([d6f949e](https://github.com/dustin-ruetz/devdeps/commit/d6f949e17b2dd4a909c7cb1bd804af06b42b34a5))

### Bug Fixes

* **dependencies:** update packages to latest versions ([3f66286](https://github.com/dustin-ruetz/devdeps/commit/3f6628678cbf7a789c88b050c874a3e70d93fccf))

## [1.0.2](https://github.com/dustin-ruetz/devdeps/compare/v1.0.1...v1.0.2) (2024-06-24)

### Bug Fixes

* **dependencies:** update packages to latest versions ([4092f6b](https://github.com/dustin-ruetz/devdeps/commit/4092f6b5a4a3e6d3f14174c569fff3ffa850be82))

## [1.0.1](https://github.com/dustin-ruetz/devdeps/compare/v1.0.0...v1.0.1) (2024-06-19)

### Bug Fixes

* npm audit issue(s) ([2f31aa6](https://github.com/dustin-ruetz/devdeps/commit/2f31aa67e52cea5f17e16593e0c507a9a5787a1c))

## 1.0.0 (2024-06-19)

### Features

* initial release of devdeps package
