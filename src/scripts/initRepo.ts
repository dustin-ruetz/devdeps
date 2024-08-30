// To develop and test this script locally:
// 1. Execute the `npm run dev` command so that `tsc` watches and auto-compiles all changes to this file.
// 2. Execute the following command to run the script:
//    ```sh
//    npm run init-repo -- repo-name --configure-stylelint --node-version=20
//    ```

import {readFile} from "node:fs/promises";
import {ValidationError} from "../utils/ValidationError.js";
import {packageName, packageScope} from "../constants.js";
import {getRootPaths} from "./helpers/getRootPaths.js";
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
import {semVerRegExp} from "./helpers/semVerRegExp.js";

/** Defines the information about the arguments (both required and optional) for running the `init-repo` script. */
const getInitRepoArgs = async () => {
	const rootPathToReadFrom = getRootPaths().readFrom;

	/** Parse the `.node-version` file and use its value to determine the default version of Node.js to use. */
	let defaultNodeVersion = await readFile(
		`${rootPathToReadFrom}/.node-version`,
		{encoding: "utf-8"},
	);
	defaultNodeVersion = defaultNodeVersion.trim();

	/** Each child objects's keys are ordered in the way that they should be printed in the `console.table` help text. */
	return {
		repoName: {
			type: "required",
			defaultValue: undefined,
			longFlag: null,
			shortFlag: null,
			description:
				"The name of the repository. Written to the `package.json` and `README.md` files.",
		},
		configureStylelint: {
			type: "optional",
			defaultValue: false,
			longFlag: "--configure-stylelint",
			shortFlag: "-cs",
			description:
				"Whether or not to include the Stylelint configuration and scripts in the outputted code.",
		},
		nodeVersion: {
			type: "optional",
			defaultValue: defaultNodeVersion,
			longFlag: "--node-version",
			shortFlag: "-nv",
			description:
				"Node.js version number in SemVer (semantic version) format to use for the repo.",
		},
	} as const;
};

/* eslint-disable no-console */
/*
 * Log all messages in the passed array, then log a blank new line at the end
 * to help visually indicate where one section ends and another one begins.
 */
const logSection = (messages: string[]) => {
	messages.forEach((message) => {
		console.log(message);
	});
	console.log("");
};

/** Log a generic introduction prior to throwing an error, then log a message on how to get help running the command. */
const logErrorIntro = () => {
	logSection([
		"❌ An error occurred; see below for details.",
		`ℹ️ Run \`npx ${packageScope}/${packageName} init-repo --help\` for documentation on this command.`,
	]);
};

/** Log the help text for this `init-repo` script. */
export const logInitRepoHelpText = async () => {
	const initRepoArgs = await getInitRepoArgs();

	logSection(["The `init-repo` script initializes a new repository."]);

	const baseCommand = `npx ${packageScope}/${packageName} init-repo repo-name`;

	logSection(["Command example:", `  ${baseCommand}`]);

	logSection([
		"Command examples with optional flags:",
		// First command example using the `--long-flag` format.
		`  ${baseCommand}` +
			` ${initRepoArgs.configureStylelint.longFlag}` +
			` ${initRepoArgs.nodeVersion.longFlag}=${initRepoArgs.nodeVersion.defaultValue}`,
		// Second command example using the `-shortflag` format.
		`  ${baseCommand}` +
			` ${initRepoArgs.configureStylelint.shortFlag}` +
			` ${initRepoArgs.nodeVersion.shortFlag}=${initRepoArgs.nodeVersion.defaultValue}`,
	]);

	console.log("Arguments:");
	console.table(initRepoArgs);
};
/* eslint-enable no-console */

/**
 * @description Writes the initial files needed for web-/Node.js-based projects when creating a new Git repository.
 * @param repoName - The name of the repository. Written to the `package.json` and `README.md` files.
 * @param args - The array of arguments passed to the `init-repo` script. Refer to the arg descriptions in `getInitRepoArgs` for more information.
 */
export const initRepo = async (repoName: string, args?: string[]) => {
	if (!repoName || repoName.length < 1) {
		logErrorIntro();
		throw new ValidationError(
			"Argument for the required `repoName` parameter must be a string with a length >= 1.",
			{
				cause: {
					code: "ERR_INVALID_REPONAME",
					values: {repoName},
				},
			},
		);
	}

	const initRepoArgs = await getInitRepoArgs();

	/** Array of objects containing the information about the script's optional arguments. */
	const optionalArgs = Object.values(initRepoArgs).filter(
		(arg) => arg.type === "optional",
	);
	/** Array of strings listing the script's optional flags (in both long and short formats). */
	const optionalFlags = optionalArgs.flatMap((arg) => [
		arg.longFlag,
		arg.shortFlag,
	]);
	// Throw an error if an invalid flag was passed, i.e. one that's not present in the `optionalFlags` array.
	args?.forEach((arg) => {
		const [flag] = arg.split("=") as typeof optionalFlags;
		if (flag && !optionalFlags.includes(flag)) {
			throw new ValidationError(`Invalid flag passed: ${flag}`, {
				cause: {
					code: "ERR_INVALID_FLAG_PASSED",
					values: {flags: args, invalidFlag: flag},
				},
			});
		}
	});

	// Determine whether or not to configure Stylelint.
	let configureStylelint = Boolean(
		initRepoArgs.configureStylelint.defaultValue,
	);
	const configureStylelintFlag = args?.filter(
		(arg) =>
			arg === initRepoArgs.configureStylelint.longFlag ||
			arg === initRepoArgs.configureStylelint.shortFlag,
	);
	if (configureStylelintFlag && configureStylelintFlag.length > 1) {
		throw new ValidationError(
			"Multiple `configureStylelint` flags received; only one may be passed.",
			{
				cause: {
					code: "ERR_OPTIONAL_FLAG_PASSED_MULTIPLE_TIMES",
					values: {configureStylelintFlag},
				},
			},
		);
	}
	if (configureStylelintFlag && configureStylelintFlag.length === 1) {
		configureStylelint = true;
	}

	// Determine whether or not to use the default Node.js version or the passed one.
	let nodeVersion = initRepoArgs.nodeVersion.defaultValue;
	const nodeVersionFlagAndArg = args?.filter((arg) => {
		const [flag] = arg.split("=");
		return (
			flag === initRepoArgs.nodeVersion.longFlag ||
			flag === initRepoArgs.nodeVersion.shortFlag
		);
	});
	if (nodeVersionFlagAndArg && nodeVersionFlagAndArg.length > 1) {
		throw new ValidationError(
			"Multiple `nodeVersion` flags received; only one may be passed.",
			{
				cause: {
					code: "ERR_OPTIONAL_FLAG_PASSED_MULTIPLE_TIMES",
					values: {nodeVersionFlagAndArg},
				},
			},
		);
	}
	if (nodeVersionFlagAndArg?.[0] && nodeVersionFlagAndArg.length === 1) {
		const flag = nodeVersionFlagAndArg[0].split("=")[0];
		const version = nodeVersionFlagAndArg[0].split("=")[1] ?? "";

		const isValidSemanticVersion = semVerRegExp(version).isMatch;
		if (!isValidSemanticVersion) {
			logErrorIntro();
			throw new ValidationError(
				"Argument for the optional" +
					` \`${initRepoArgs.nodeVersion.longFlag}\`/\`${initRepoArgs.nodeVersion.shortFlag}\` ` +
					"flag must be a valid semantic version number.",
				{
					cause: {
						code: "ERR_INVALID_NODEVERSION",
						values: {flag, version},
					},
				},
			);
		}
		nodeVersion = version;
	}

	await Promise.all([
		writeGitAttributes(),
		writeGitHooks(),
		writeGitIgnore(),
		writeLicense(),
		writeNodeVersion(nodeVersion),
		writePackageJson(repoName, configureStylelint),
		writeReadme(repoName),
		writeTsConfigBuild(),
		writeTsConfig(),
		writeVsCodeSettings(configureStylelint),
	]);
};
