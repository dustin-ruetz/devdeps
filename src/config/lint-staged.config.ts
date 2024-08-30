import type {Config} from "lint-staged";

/** https://github.com/lint-staged/lint-staged */
const lintstagedConfig: Config = {
	/**
	 * Note: Run "format" and "lint/*" as their base scripts (i.e. _not_ "fix/format" and "fix/lint/*") because
	 * lint-staged passes the staged file(s) by appending the path(s) as the last argument to the commands.
	 */
	// Fix code formatting for all file types that Prettier supports.
	"*": "npm run format -- --ignore-unknown --write",
	"*.{css,scss,jsx,tsx}": "npm run lint/styles -- --fix",
	"*.{js,jsx,ts,tsx}": (relativePaths) => {
		const lintJavaScriptTypeScriptCommand = `npm run lint/js-ts -- --fix ${relativePaths.join(" ")}`;

		/**
		 * The "check/types" script runs the TypeScript compiler (`tsc`), but `tsc` ignores the `tsconfig.json` file
		 * due to the file paths that are appended to the command by `lint-staged`. Work around this limitation by
		 * typechecking the entire codebase, i.e. not just the staged files.
		 *
		 * @link https://github.com/lint-staged/lint-staged/issues/825
		 * @link https://github.com/microsoft/TypeScript/issues/27379
		 */
		const typecheckCommand = "npm run check/types";

		const unitTestCommand =
			"npm run test/unit/coverage --" +
			// Excerpt from https://jestjs.io/docs/cli#--findrelatedtests-spaceseparatedlistofsourcefiles:
			// > Find and run the tests that cover a space-separated list of source files that were passed in as arguments.
			// > Useful for pre-commit hook integration to run the minimal amount of tests necessary.
			" --findRelatedTests" +
			// Excerpt from https://jestjs.io/docs/cli#--collectcoveragefromglob:
			// > A glob pattern relative to `rootDir` matching the files that coverage info needs to be collected from.
			" --collectCoverageFrom=" +
			// Important: Add a space between `--collectCoverageFrom=` and the relative paths to properly scope the coverage report.
			` ${relativePaths.join(" ")}`;

		return [lintJavaScriptTypeScriptCommand, typecheckCommand, unitTestCommand];
	},
} as const;

export default lintstagedConfig;
