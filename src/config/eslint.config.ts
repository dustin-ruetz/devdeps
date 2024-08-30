import {includeIgnoreFile} from "@eslint/compat";
import eslintjs from "@eslint/js";
import globals from "globals";
import typescripteslint from "typescript-eslint";
import {getAbsoluteRepoRootPath} from "../utils/getAbsoluteRepoRootPath.js";
import {typescripteslintPlugin} from "./eslint-plugins/typescript-eslint.js";

const absoluteRepoRootPath = getAbsoluteRepoRootPath();
const gitignorePath = `${absoluteRepoRootPath}/.gitignore`;

/**
 * @description "ESLint statically analyzes your code to quickly find problems."
 * @link https://eslint.org/docs/latest/use/configure/
 */
const eslintConfig = typescripteslint.config(
	// Excerpt from https://eslint.org/docs/latest/use/configure/ignore#including-gitignore-files:
	// > If you want to include patterns from a `.gitignore` file or any other file with gitignore-style patterns,
	// > you can use `includeIgnoreFile` utility from the `@eslint/compat` package. This automatically loads
	// > the specified file and translates gitignore-style patterns into `ignores` glob patterns.
	includeIgnoreFile(gitignorePath),
	// Excerpt from https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations:
	// > `js.configs.recommended` - Enables the rules that ESLint recommends everyone use to avoid potential errors.
	{
		name: "eslintjs/recommended",
		...eslintjs.configs.recommended,
	},
	{
		name: "eslintjs/user-defined-config",
		languageOptions: {
			// Excerpt from https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables:
			// > Apart from the ECMAScript standard built-in globals, which are automatically enabled based on the configured
			// > `languageOptions.ecmaVersion`, ESLint doesn't provide predefined sets of global variables. You can use
			// > the `globals` package to additionally enable all globals for a specific environment.
			globals: {
				/**
				 * @todo Ideally the `browser` global variables would be included conditionally in the configuration
				 *       only if/when the consuming repository depends on a frontend-specific package. This check
				 *       could be done easily if either 1) ESLint supported functions in its config, or 2) if Jest
				 *       supported top-level `await`; revisit this if/when these limitations can be overcome.
				 */
				...globals.browser,
				...globals.jest,
				...globals.node,
			},
		},
		// Excerpt from https://eslint.org/docs/latest/use/configure/rules#report-unused-eslint-disable-comments:
		// > To report unused `eslint-disable` comments, use the `reportUnusedDisableDirectives` setting.
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
		rules: {
			// https://eslint.org/docs/latest/rules/#possible-problems
			"array-callback-return": ["error", {checkForEach: true}],
			"no-await-in-loop": "error",
			"no-constructor-return": "error",
			"no-duplicate-imports": "error",
			"no-promise-executor-return": "error",
			"no-self-compare": "error",
			"no-template-curly-in-string": "error",
			"no-unmodified-loop-condition": "error",
			"no-unreachable-loop": "error",
			"no-use-before-define": "error",
			"require-atomic-updates": "error",
			// https://eslint.org/docs/latest/rules/#suggestions
			"arrow-body-style": "error",
			camelcase: "error",
			curly: "error",
			/**
			 * Refer to the `typescript-eslint` configuration file to see how this `dot-notation` rule is overridden.
			 * @see [typescript-eslint.ts](./eslint-plugins/typescript-eslint.ts)
			 */
			"dot-notation": "error",
			eqeqeq: "error",
			"guard-for-in": "error",
			"no-array-constructor": "error",
			"no-console": "warn",
			"no-empty-function": "error",
			"no-eq-null": "error",
			"no-eval": "error",
			"no-extend-native": "error",
			"no-extra-bind": "error",
			"no-implicit-coercion": "error",
			"no-implied-eval": "error",
			"no-invalid-this": "error",
			"no-iterator": "error",
			"no-label-var": "error",
			"no-labels": "error",
			"no-lonely-if": "error",
			"no-loop-func": "error",
			"no-magic-numbers": [
				"error",
				{
					enforceConst: true,
					// Allow the following numbers since they're commonly used when working with array methods.
					ignore: [-1, 0, 1],
					// Allow numbers to be used directly when working with arrays to avoid overly-verbose `const firstIndex = 0` declarations.
					ignoreArrayIndexes: true,
				},
			],
			"no-multi-assign": "error",
			"no-multi-str": "error",
			"no-new": "error",
			"no-new-func": "error",
			"no-new-wrappers": "error",
			"no-object-constructor": "error",
			"no-octal-escape": "error",
			"no-param-reassign": "error",
			"no-plusplus": ["error", {allowForLoopAfterthoughts: true}],
			"no-proto": "error",
			"no-return-assign": "error",
			"no-sequences": "error",
			"no-script-url": "error",
			"no-throw-literal": "error",
			"no-undef-init": "error",
			"no-unneeded-ternary": "error",
			"no-unused-expressions": "error",
			/**
			 * Refer to the `typescript-eslint` configuration file to see how this `no-unused-vars` rule is overridden.
			 * @see [typescript-eslint.ts](./eslint-plugins/typescript-eslint.ts)
			 */
			"no-unused-vars": "error",
			"no-useless-call": "error",
			"no-useless-computed-key": "error",
			"no-useless-concat": "error",
			"no-useless-constructor": "error",
			"no-useless-rename": "error",
			"no-useless-return": "error",
			"no-var": "error",
			"object-shorthand": "error",
			"one-var": ["error", "never"],
			"prefer-const": "error",
			"prefer-numeric-literals": "error",
			"prefer-object-has-own": "error",
			"prefer-object-spread": "error",
			"prefer-promise-reject-errors": "error",
			"prefer-spread": "error",
			radix: "error",
			"require-await": "error",
			yoda: "error",
		},
	},
	/** @todo See above to-do comment, but in the situation when the consuming repository depends on the `typescript` package. */
	...typescripteslintPlugin,
	// Overrides for test files.
	{
		name: "eslintjs/user-defined-test-overrides",
		files: ["**/*.test.+(js|jsx|ts|tsx)"],
		rules: {
			// It's useful to reference arbitrary numbers directly in unit test files, so disable the "no-magic-numbers" rule for tests.
			"no-magic-numbers": "off",
		},
	},
);

export default eslintConfig;
