import globals from "globals";
import eslintConfig from "./eslint.config.js";

test("it exports a configuration array and the most important config options are correct", () => {
	expect(Array.isArray(eslintConfig)).toBe(true);

	// Verify that the contents of the `.gitignore` file are successfully read and included as patterns.
	const importedGitignorePatterns = eslintConfig.find(
		(configObj) => configObj.name === "Imported .gitignore patterns",
	);
	expect(importedGitignorePatterns?.ignores).toEqual(
		expect.arrayContaining(["**/lib/", "**/node_modules/"]),
	);

	// Verify that one of the recommended rules is included in the configuration.
	const recommendedConfig = eslintConfig.find(
		(configObj) => configObj.name === "eslintjs/recommended",
	);
	expect(recommendedConfig?.rules?.["no-const-assign"]).toEqual("error");

	// Verify that the user-defined configuration is correct.
	const userDefinedConfig = eslintConfig.find(
		(configObj) => configObj.name === "eslintjs/user-defined-config",
	);
	expect(userDefinedConfig?.languageOptions).toStrictEqual({
		globals: {
			...globals.browser,
			...globals.jest,
			...globals.node,
		},
	});
	expect(userDefinedConfig?.linterOptions).toStrictEqual({
		reportUnusedDisableDirectives: "error",
	});
	expect(userDefinedConfig?.rules?.["camelcase"]).toEqual("error");
	expect(userDefinedConfig?.rules?.["no-console"]).toEqual("warn");
	expect(userDefinedConfig?.rules?.["no-magic-numbers"]).toStrictEqual([
		"error",
		{
			enforceConst: true,
			ignore: [-1, 0, 1],
			ignoreArrayIndexes: true,
		},
	]);
	expect(userDefinedConfig?.rules?.["no-var"]).toEqual("error");

	// Verify that the typescript-eslint user-defined config is included in the configuration.
	const typescripteslintUserDefinedConfig = eslintConfig.find(
		(configObj) => configObj.name === "typescript-eslint/user-defined-config",
	);
	expect(typeof typescripteslintUserDefinedConfig?.rules).toEqual("object");

	// Verify that the user-defined overrides for test files are correct.
	const userDefinedTestOverrides = eslintConfig.find(
		(configObj) => configObj.name === "eslintjs/user-defined-test-overrides",
	);
	expect(userDefinedTestOverrides?.files).toStrictEqual([
		"**/*.test.+(js|jsx|ts|tsx)",
	]);
	expect(userDefinedTestOverrides?.rules).toStrictEqual({
		"no-magic-numbers": "off",
	});
});
