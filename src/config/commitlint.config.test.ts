import commitlintConfig from "./commitlint.config.js";

test("it exports a configuration object and the most important config options are correct", () => {
	expect(typeof commitlintConfig).toBe("object");

	expect(commitlintConfig.extends).toStrictEqual([
		"@commitlint/config-conventional",
	]);
});
