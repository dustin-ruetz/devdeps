import typescripteslint from "typescript-eslint";

/**
 * @description "**`typescript-eslint` enables ESLint to run on TypeScript code.** It brings in the best of
 *              both tools to help you write the best JavaScript or TypeScript code you possibly can."
 * @link https://typescript-eslint.io/getting-started/
 */
export const typescripteslintPlugin = typescripteslint.config(
	// Excerpt from https://typescript-eslint.io/getting-started/#additional-configs:
	// > `strict` - A superset of `recommended` that includes more opinionated rules which may also catch bugs.
	// > `stylistic` - Additional rules that enforce consistent styling without significantly catching bugs or changing logic.
	...typescripteslint.configs.strictTypeChecked,
	...typescripteslint.configs.stylisticTypeChecked,
	{
		name: "typescript-eslint/user-defined-config",
		// https://typescript-eslint.io/getting-started/typed-linting/
		languageOptions: {
			parserOptions: {
				// Excerpt from https://typescript-eslint.io/packages/parser#projectservice:
				// > Specifies using TypeScript APIs to generate type information for rules. It will automatically detect
				// > the TSConfig for each file (like `project: true`), and will also allow type information to be
				// > computed for JavaScript files without the `allowJs` compiler option (unlike `project: true`).
				projectService: true,
			},
		},
		rules: {
			// https://typescript-eslint.io/rules/#extension-rules

			/**
			 * @description Prefer the `type` keyword over `interface` because it displays the full type information
			 *              in the IntelliSense hint when the mouse cursor is hovered over the type definition.
			 * @todo Consider removing this rule from the config if this issues is addressed when TypeScript 5.6.0 is released.
			 * @link https://github.com/microsoft/TypeScript/issues/38040
			 * @link https://github.com/microsoft/TypeScript/issues/59029
			 * @link https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
			 */
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],

			// Excerpt from https://typescript-eslint.io/rules/dot-notation/:
			// > Extending `"plugin:@typescript-eslint/stylistic-type-checked"` in an ESLint configuration enables this rule.
			// > This rule extends the base `eslint/dot-notation` rule. It adds:
			// > - Support for optionally ignoring computed `private` and/or `protected` member access.
			// > - Compatibility with TypeScript's `noPropertyAccessFromIndexSignature` option.

			// Excerpt from https://typescript-eslint.io/rules/no-unused-vars/#how-to-use:
			// > Note: You must disable the base rule as it can report incorrect errors.
			"no-unused-vars": "off",
			// Excerpt from https://typescript-eslint.io/rules/no-unused-vars/#benefits-over-typescript:
			// > If you would like to emulate the TypeScript style of exempting names starting with `_`,
			// > you can use this configuration (this includes errors as well):
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					args: "all",
					argsIgnorePattern: "^_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
					varsIgnorePattern: "^_",
				},
			],
		},
	},
);
