import {mkdir, readdir, readFile, writeFile} from "node:fs/promises";
import {
	writeGitAttributes,
	writeGitHooks,
	writeGitIgnore,
	writeLicense,
	writeNodeVersion,
	writePackageJson,
	writeReadme,
	writeTsConfig,
	writeTsConfigBuild,
	writeVsCodeSettings,
} from "./initRepoHelpers.js";

jest.mock("node:fs/promises", () => ({
	mkdir: jest.fn(),
	readdir: jest.fn(),
	readFile: jest.fn(),
	writeFile: jest.fn(),
}));
// Paraphrased excerpt from https://www.mikeborozdin.com/post/changing-jest-mocks-between-tests:
// > Typecast the imported mocked module into a mocked function with writeable properties.
const readdirMock = readdir as jest.MockedFunction<typeof readdir>;
const readFileMock = readFile as jest.MockedFunction<typeof readFile>;

beforeAll(() => {
	jest.spyOn(console, "log").mockImplementation();
});

afterEach(() => {
	jest.clearAllMocks();
});

test("writeGitAttributes", async () => {
	await writeGitAttributes();

	expect(writeFile).toHaveBeenCalledTimes(1);
	expect(writeFile).toHaveBeenCalledWith(
		expect.stringContaining(".gitattributes"),
		expect.stringContaining("* text=auto"),
	);
});

test("writeGitHooks", async () => {
	const githooksDirectoryContents = [
		"_",
		"commit-msg",
		"pre-commit",
		"pre-push",
	] as const;
	/** @ts-expect-error @todo Figure out how to correctly type the promise's resolved value here. */
	readdirMock.mockResolvedValue(githooksDirectoryContents);
	// Filter out the "_" underscore directory since it contains the husky-specific script files.
	const githooksFiles = githooksDirectoryContents.filter(
		(item) => item !== "_",
	);

	await writeGitHooks();

	githooksFiles.forEach((githook, index) => {
		/** The path of the filename to write. */
		const file = `.githooks/${githook}`;
		/** The contents to write to the file. */
		const contents = `./node_modules/@dustin-ruetz/devdeps/.githooks/_/${githook}`;

		expect(mkdir).toHaveBeenCalledTimes(1);
		expect(mkdir).toHaveBeenCalledWith(expect.stringContaining(".githooks/"));
		expect(writeFile).toHaveBeenNthCalledWith(
			index + 1,
			expect.stringContaining(file),
			expect.stringContaining(contents),
		);
	});
});

test("writeGitIgnore", async () => {
	await writeGitIgnore();

	expect(writeFile).toHaveBeenCalledTimes(1);
	expect(writeFile).toHaveBeenCalledWith(
		expect.stringContaining(".gitignore"),
		expect.stringContaining("node_modules/"),
	);
});

test("writeLicense", async () => {
	readFileMock.mockResolvedValue("Copyright (c) 1999 Dustin Ruetz");
	const currentYear = new Date().getFullYear().toString();

	await writeLicense();

	expect(readFile).toHaveBeenCalledTimes(1);
	expect(readFile).toHaveBeenCalledWith(expect.stringContaining("LICENSE"), {
		encoding: "utf-8",
	});
	expect(writeFile).toHaveBeenCalledTimes(1);
	expect(writeFile).toHaveBeenCalledWith(
		expect.stringContaining("LICENSE"),
		`Copyright (c) ${currentYear} Dustin Ruetz`,
	);
});

test("writeNodeVersion", async () => {
	await writeNodeVersion("20");

	expect(writeFile).toHaveBeenCalledTimes(1);
	expect(writeFile).toHaveBeenCalledWith(
		expect.stringContaining(".node-version"),
		"20",
	);
});

describe("writePackageJson", () => {
	/** Simplified mock of the file contents from a `package.json` file. */
	const mockPackageJsonContents = `
{
		"name": "",
		"version": "",
		"description": "",
		"scripts": {
			"script": "package --config ./lib/config/package.config.js"
		},
		"files": [],
		"repository": {
			"url": ""
		},
		"publishConfig": {},
		"dependencies": {},
		"devDependencies": {}
}
`;
	/** Generic script representing a library named `package` that is called with its associated `package.config.js` configuration file. */
	const genericScript =
		"package --config ./node_modules/@dustin-ruetz/devdeps/lib/config/package.config.js";
	/** Script representing the Stylelint library getting called with its associated configuration file. */
	const lintStylesScript =
		"stylelint --config ./node_modules/@dustin-ruetz/devdeps/lib/config/stylelint.config.js";

	test("it *does not* configure Stylelint", async () => {
		readFileMock.mockResolvedValue(mockPackageJsonContents);

		await writePackageJson("repo-name", false);

		expect(readFile).toHaveBeenCalledTimes(1);
		expect(readFile).toHaveBeenCalledWith(
			expect.stringContaining("package.json"),
			{encoding: "utf-8"},
		);

		expect(writeFile).toHaveBeenCalledTimes(1);
		expect(writeFile).toHaveBeenCalledWith(
			expect.stringContaining("package.json"),
			expect.stringMatching(new RegExp(genericScript)),
		);
		expect(writeFile).toHaveBeenCalledWith(
			expect.stringContaining("package.json"),
			expect.not.stringMatching(new RegExp(lintStylesScript)),
		);
	});

	test("it *does* configure Stylelint", async () => {
		readFileMock.mockResolvedValue(mockPackageJsonContents);

		await writePackageJson("repo-name", true);

		expect(readFile).toHaveBeenCalledTimes(1);
		expect(readFile).toHaveBeenCalledWith(
			expect.stringContaining("package.json"),
			{encoding: "utf-8"},
		);

		expect(writeFile).toHaveBeenCalledTimes(1);
		expect(writeFile).toHaveBeenCalledWith(
			expect.stringContaining("package.json"),
			expect.stringMatching(
				// Regular expression adapted from Michael Socha's 2014-Nov-18 answer to the following question posted on Stack Overflow:
				// https://stackoverflow.com/questions/2219830/regular-expression-to-find-two-strings-anywhere-in-input/27005678#27005678
				new RegExp(`(${genericScript}(.|\n)*${lintStylesScript})`),
			),
		);
	});
});

test("writeReadme", async () => {
	await writeReadme("repo-name");

	expect(writeFile).toHaveBeenCalledTimes(1);
	expect(writeFile).toHaveBeenCalledWith(
		expect.stringContaining("README.md"),
		"# repo-name",
	);
});

test("writeTsConfigBuild", async () => {
	await writeTsConfigBuild();

	expect(writeFile).toHaveBeenCalledTimes(1);
	expect(writeFile).toHaveBeenCalledWith(
		expect.stringContaining("tsconfig.build.json"),
		expect.stringContaining(
			"./node_modules/@dustin-ruetz/devdeps/tsconfig.build.json",
		),
	);
});

test("writeTsConfig", async () => {
	await writeTsConfig();

	expect(writeFile).toHaveBeenCalledTimes(1);
	expect(writeFile).toHaveBeenCalledWith(
		expect.stringContaining("tsconfig.json"),
		expect.stringContaining(
			"./node_modules/@dustin-ruetz/devdeps/tsconfig.json",
		),
	);
});

describe("writeVsCodeSettings", () => {
	test("it *does not* configure Stylelint", async () => {
		const configureStylelint = false;

		await writeVsCodeSettings(configureStylelint);

		expect(writeFile).toHaveBeenCalledTimes(1);
		expect(writeFile).toHaveBeenCalledWith(
			expect.stringContaining(".vscode/settings.json"),
			expect.not.stringContaining("stylelint.configFile"),
		);
	});

	test("it *does* configure Stylelint", async () => {
		const configureStylelint = true;

		await writeVsCodeSettings(configureStylelint);

		expect(mkdir).toHaveBeenCalledTimes(1);
		expect(mkdir).toHaveBeenCalledWith(expect.stringContaining(".vscode/"));
		expect(writeFile).toHaveBeenCalledTimes(1);
		expect(writeFile).toHaveBeenCalledWith(
			expect.stringContaining(".vscode/settings.json"),
			expect.stringContaining("stylelint.configFile"),
		);
	});
});
