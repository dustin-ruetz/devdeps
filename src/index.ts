#!/usr/bin/env node

import {initRepo, logInitRepoHelpText} from "./scripts/initRepo.js";
import {ValidationError} from "./utils/ValidationError.js";

/** Function that serves as the entrypoint file for runnable Node.js CLI scripts from this `@dustin-ruetz/devdeps` package. */
export const runScript = async () => {
	const [
		_execPath, // executor - the Node.js executable
		_filePath, // ignoredBin - ./lib/ (i.e. the path to the JavaScript file being executed)
		script, // the name of the script to run
		...args // all arguments that follow the script name
	] = process.argv;

	/** List of known scripts. */
	/* eslint sort-keys: ["error", "asc"] */
	const scripts = {
		initRepo: "init-repo",
	} as const;

	switch (script) {
		case scripts.initRepo: {
			const hasHelpFlag = Boolean(
				args.find((arg) => arg === "--help" || arg === "-h"),
			);

			// If either 1) no arguments are passed, or 2) one of the `help` flags are passed, then:
			if (args.length === 0 || hasHelpFlag) {
				// 1. Log the help text for the command.
				void logInitRepoHelpText();
				// 2. Terminate the script.
				break;
			}

			// The repository name is the only required argument and it has to be the first one, so:
			// 1. `shift` it out of the `args` array if it's defined; or
			// 2. Set it to an empty string if it's `undefined` and let the `initRepo` function throw an error.
			const repoName = args.shift() ?? "";
			await initRepo(repoName, args);
			break;
		}
		default: {
			throw new ValidationError(
				`Unknown script. Known scripts are: [${Object.values(scripts).join(", ")}]`,
				{
					cause: {
						code: "ERR_UNKNOWN_SCRIPT",
						values: {script},
					},
				},
			);
		}
	}
};

// The unit test for this file imports the `runScript` function to test it, but the problem with this
// is that `runScript` gets called in the test just from importing it. Since Jest automatically sets
// the `NODE_ENV=true` environment variable when the test suite is run, use this as the conditional
// logic to prevent `runScript` from being automatically called when it's imported for the unit test.
//
// It's very difficult to test whether or not the `runScript` function is called based on the value of `NODE_ENV`,
// so use the special `v8 ignore next #` comment to exclude these lines from the test coverage report.
//
/* v8 ignore next 3 */
if (process.env["NODE_ENV"] !== "test") {
	void runScript();
}
