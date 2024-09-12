/**
 * Fix `typescript-eslint` errors on the `eslintjs.configs.recommended` config object and avoid the need to install
 * the `@types/eslint__js` package by declaring the shape of the `@eslint/js` default module export here.
 */
declare module "@eslint/js" {
	export default {
		configs: {
			recommended: {},
		},
	};
}
