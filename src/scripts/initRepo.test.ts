import {readFile} from "node:fs/promises";
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
} from "./helpers/initRepoHelpers.js";
import {initRepo, logInitRepoHelpText} from "./initRepo.js";

jest.mock("node:fs/promises");
// Paraphrased excerpt from https://www.mikeborozdin.com/post/changing-jest-mocks-between-tests:
// > Typecast the imported mocked module into a mocked function with writeable properties.
const readFileMock = readFile as jest.MockedFunction<typeof readFile>;

jest.mock("./helpers/initRepoHelpers.js");

beforeAll(() => {
	readFileMock.mockResolvedValue("20");

	jest.spyOn(console, "log").mockImplementation();
	jest.spyOn(console, "table").mockImplementation();
});

const testRepoName = "repo-name";
/**
 * Node.js version number for the purposes of this unit test; specify a very old/obviously
 * out-of-long-term-support version number to avoid any inclination to update it.
 */
const testNodeVersion = "10";

/* eslint-disable no-console */
test("the logInitRepoHelpText helper function logs the correct values", async () => {
	const baseCommand = "npx @dustin-ruetz/devdeps init-repo repo-name";

	await logInitRepoHelpText();

	// Verify that the examples on how to run the command are correct.
	expect(console.log).toHaveBeenCalledWith(
		expect.stringContaining(baseCommand),
	);
	expect(console.log).toHaveBeenCalledWith(
		expect.stringContaining(
			`${baseCommand} --configure-stylelint --node-version=20`,
		),
	);
	expect(console.log).toHaveBeenCalledWith(
		expect.stringContaining(`${baseCommand} -cs -nv=20`),
	);

	// Verify that the information about the function's arguments is logged in tabular format.
	expect(console.table).toHaveBeenCalledTimes(1);
});
/* eslint-enable no-console */

describe("initRepo", () => {
	test("throws an error if the required `repoName` argument is invalid", () => {
		const invalidRepoNameErrorCode = /ERR_INVALID_REPONAME/;

		void expect(async () => {
			// @ts-expect-error if `repoName` is not passed.
			await initRepo();
		}).rejects.toThrow(invalidRepoNameErrorCode);

		void expect(async () => {
			// Expect an error if `repoName` is an empty string.
			await initRepo("");
		}).rejects.toThrow(invalidRepoNameErrorCode);
	});

	describe("throws an error if invalid flags are passed", () => {
		const invalidFlagPassedErrorCode = "ERR_INVALID_FLAG_PASSED";

		test.each`
			argsArray
			${["--invalid-flag"]}
			${["--configure-stylelint", "--node-version=20", "--invalid-flag"]}
		`(
			`initRepo("${testRepoName}", $argsArray) throws ${invalidFlagPassedErrorCode} error`,
			(testRow: {argsArray: string[]}) => {
				void expect(async () => {
					await initRepo(testRepoName, testRow.argsArray);
				}).rejects.toThrow(new RegExp(invalidFlagPassedErrorCode));
			},
		);
	});

	describe("throws an error if an optional flag is passed multiple times", () => {
		const optionalFlagPassedMultipleTimesErrorCode =
			"ERR_OPTIONAL_FLAG_PASSED_MULTIPLE_TIMES";

		test.each`
			argsArray
			${["--configure-stylelint", "-cs"]}
			${["--configure-stylelint", "--configure-stylelint"]}
			${["-cs", "-cs"]}
			${[`--node-version=${testNodeVersion}`, `-nv=${testNodeVersion}`]}
			${[`--node-version=${testNodeVersion}`, `--node-version=${testNodeVersion}`]}
			${[`-nv=${testNodeVersion}`, `-nv=${testNodeVersion}`]}
		`(
			`initRepo("${testRepoName}", $argsArray) throws ${optionalFlagPassedMultipleTimesErrorCode} error`,
			(testRow: {argsArray: string[]}) => {
				void expect(async () => {
					await initRepo(testRepoName, testRow.argsArray);
				}).rejects.toThrow(
					new RegExp(optionalFlagPassedMultipleTimesErrorCode),
				);
			},
		);
	});

	describe("throws an error if the optional `--node-version`/`-nv` argument is invalid", () => {
		const invalidNodeVersionErrorCode = "ERR_INVALID_NODEVERSION";

		test.each`
			argsArray
			${["--node-version"]}
			${["--node-version="]}
			${["--node-version=A"]}
			${["-nv"]}
			${["-nv="]}
			${["-nv=A"]}
		`(
			`initRepo("${testRepoName}", $argsArray) throws ${invalidNodeVersionErrorCode} error`,
			(testRow: {argsArray: string[]}) => {
				void expect(async () => {
					await initRepo(testRepoName, testRow.argsArray);
				}).rejects.toThrow(new RegExp(invalidNodeVersionErrorCode));
			},
		);
	});

	test("executes the helper functions with the correct default arguments", async () => {
		const defaultArgumentValues = {
			configureStylelint: false,
			nodeVersion: "20",
		} as const;

		await initRepo("repo-name", []);

		expect(writeGitAttributes).toHaveBeenCalledTimes(1);
		expect(writeGitIgnore).toHaveBeenCalledTimes(1);
		expect(writeGitHooks).toHaveBeenCalledTimes(1);
		expect(writeLicense).toHaveBeenCalledTimes(1);
		expect(writeNodeVersion).toHaveBeenCalledTimes(1);
		expect(writeNodeVersion).toHaveBeenCalledWith(
			defaultArgumentValues.nodeVersion,
		);
		expect(writePackageJson).toHaveBeenCalledTimes(1);
		expect(writePackageJson).toHaveBeenCalledWith(
			"repo-name",
			defaultArgumentValues.configureStylelint,
		);
		expect(writeReadme).toHaveBeenCalledTimes(1);
		expect(writeReadme).toHaveBeenCalledWith("repo-name");
		expect(writeTsConfig).toHaveBeenCalledTimes(1);
		expect(writeTsConfigBuild).toHaveBeenCalledTimes(1);
		expect(writeVsCodeSettings).toHaveBeenCalledTimes(1);
		expect(writeVsCodeSettings).toHaveBeenCalledWith(
			defaultArgumentValues.configureStylelint,
		);
	});

	describe("executes the helper functions with the correct arguments when passed", () => {
		const passedFlagValues = {
			configureStylelint: true,
			nodeVersion: testNodeVersion,
		} as const;

		test("with the long flags in the suggested order", async () => {
			await initRepo("repo-name", [
				"--configure-stylelint",
				`--node-version=${passedFlagValues.nodeVersion}`,
			]);

			expect(writeNodeVersion).toHaveBeenCalledWith(
				passedFlagValues.nodeVersion,
			);
			expect(writePackageJson).toHaveBeenCalledWith(
				"repo-name",
				passedFlagValues.configureStylelint,
			);
			expect(writeVsCodeSettings).toHaveBeenCalledWith(
				passedFlagValues.configureStylelint,
			);
		});

		test("with the long flags in a different order", async () => {
			await initRepo("repo-name", [
				`--node-version=${passedFlagValues.nodeVersion}`,
				"--configure-stylelint",
			]);

			expect(writeNodeVersion).toHaveBeenCalledWith(
				passedFlagValues.nodeVersion,
			);
			expect(writePackageJson).toHaveBeenCalledWith(
				"repo-name",
				passedFlagValues.configureStylelint,
			);
			expect(writeVsCodeSettings).toHaveBeenCalledWith(
				passedFlagValues.configureStylelint,
			);
		});

		test("with the short flags in the suggested order", async () => {
			await initRepo("repo-name", [
				"-cs",
				`-nv=${passedFlagValues.nodeVersion}`,
			]);

			expect(writeNodeVersion).toHaveBeenCalledWith(
				passedFlagValues.nodeVersion,
			);
			expect(writePackageJson).toHaveBeenCalledWith(
				"repo-name",
				passedFlagValues.configureStylelint,
			);
			expect(writeVsCodeSettings).toHaveBeenCalledWith(
				passedFlagValues.configureStylelint,
			);
		});

		test("with the short flags in a different order", async () => {
			await initRepo("repo-name", [
				`-nv=${passedFlagValues.nodeVersion}`,
				"-cs",
			]);

			expect(writeNodeVersion).toHaveBeenCalledWith(
				passedFlagValues.nodeVersion,
			);
			expect(writePackageJson).toHaveBeenCalledWith(
				"repo-name",
				passedFlagValues.configureStylelint,
			);
			expect(writeVsCodeSettings).toHaveBeenCalledWith(
				passedFlagValues.configureStylelint,
			);
		});
	});
});
