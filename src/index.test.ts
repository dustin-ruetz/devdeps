import {initRepo, logInitRepoHelpText} from "./scripts/initRepo.js";
import {runScript} from "./index.js";

jest.mock("./scripts/initRepo.js");

afterEach(() => {
	jest.clearAllMocks();
});

const initialProcessArgv = process.argv;
afterAll(() => {
	process.argv = initialProcessArgv;
});

describe("`initRepo` script", () => {
	const processArgv = ["_execPath", "_filePath", "init-repo"] as const;

	beforeEach(() => {
		process.argv = [...processArgv];
	});

	describe("logs the help text", () => {
		test("when no arguments are passed", async () => {
			await runScript();

			expect(logInitRepoHelpText).toHaveBeenCalledTimes(1);
			expect(initRepo).not.toHaveBeenCalled();
		});

		test("when the `--help` argument is passed", async () => {
			process.argv.push("--help");

			await runScript();

			expect(logInitRepoHelpText).toHaveBeenCalledTimes(1);
			expect(initRepo).not.toHaveBeenCalled();
		});

		test("when the `-h` argument is passed", async () => {
			process.argv.push("-h");

			await runScript();

			expect(logInitRepoHelpText).toHaveBeenCalledTimes(1);
			expect(initRepo).not.toHaveBeenCalled();
		});
	});

	describe("is called with the correct arguments", () => {
		test("when the required `repoName` argument is not passed", async () => {
			// @ts-expect-error if a non-string value is pushed into the `argv` array.
			process.argv.push(undefined);

			await runScript();

			expect(logInitRepoHelpText).not.toHaveBeenCalled();
			expect(initRepo).toHaveBeenCalledTimes(1);
			expect(initRepo).toHaveBeenCalledWith("", []);
		});

		test("when the required `repoName` argument is passed as an empty string", async () => {
			process.argv.push("");

			await runScript();

			expect(logInitRepoHelpText).not.toHaveBeenCalled();
			expect(initRepo).toHaveBeenCalledTimes(1);
			expect(initRepo).toHaveBeenCalledWith("", []);
		});

		test("when the required `repoName` argument is passed *and* the optional flags are not passed", async () => {
			process.argv.push("repo-name");

			await runScript();

			expect(logInitRepoHelpText).not.toHaveBeenCalled();
			expect(initRepo).toHaveBeenCalledTimes(1);
			expect(initRepo).toHaveBeenCalledWith("repo-name", []);
		});

		test("when the required `repoName` argument is passed *and* the optional flags are passed", async () => {
			process.argv.push(
				"repo-name",
				"--configure-stylelint",
				"--node-version=20",
			);

			await runScript();

			expect(logInitRepoHelpText).not.toHaveBeenCalled();
			expect(initRepo).toHaveBeenCalledTimes(1);
			expect(initRepo).toHaveBeenCalledWith("repo-name", [
				"--configure-stylelint",
				"--node-version=20",
			]);
		});
	});
});

describe("throws an error", () => {
	const processArgv = ["_execPath", "_filePath"] as const;

	beforeEach(() => {
		process.argv = [...processArgv];
	});

	test("when no script name is passed", () => {
		void expect(async () => {
			await runScript();
		}).rejects.toThrow(/ERR_UNKNOWN_SCRIPT/);
	});

	test("when an unknown script is passed", () => {
		process.argv.push("unknown-script");

		void expect(async () => {
			await runScript();
		}).rejects.toThrow(/ERR_UNKNOWN_SCRIPT/);
	});
});
