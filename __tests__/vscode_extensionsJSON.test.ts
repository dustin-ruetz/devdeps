import vscodeExtensionsJSON from "../.vscode/extensions.json";

test("it is a configuration object and the most important config options are correct", () => {
	expect(typeof vscodeExtensionsJSON).toEqual("object");

	// > List of extensions which should be recommended for users of this workspace.
	// > The identifier of an extension is always '${publisher}.${name}'.
	// https://code.visualstudio.com/docs/editor/extension-marketplace#_workspace-recommended-extensions
	expect(vscodeExtensionsJSON.recommendations).toStrictEqual([
		"dbaeumer.vscode-eslint",
		"esbenp.prettier-vscode",
		"redhat.vscode-yaml",
	]);
});
