import vscodeSettingsJSON from "./settings.json";

test("it is a configuration object and the most important config options are correct", () => {
	expect(typeof vscodeSettingsJSON).toEqual("object");

	// https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
	expect(vscodeSettingsJSON["eslint.options"].ignorePath).toEqual(".gitignore");
	expect(vscodeSettingsJSON["eslint.options"].overrideConfigFile).toEqual(
		"lib/eslint.config.cjs",
	);

	// https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
	expect(vscodeSettingsJSON["prettier.configPath"]).toEqual(
		"lib/prettier.config.js",
	);
	expect(vscodeSettingsJSON["prettier.ignorePath"]).toEqual(".gitignore");
});
