import {fileURLToPath} from "node:url";
import {getAbsoluteRepoRootPath} from "./getAbsoluteRepoRootPath.js";

jest.mock("node:url", () => ({
	fileURLToPath: jest.fn(),
}));
// Paraphrased excerpt from https://www.mikeborozdin.com/post/changing-jest-mocks-between-tests:
// > Typecast the imported mocked module into a mocked function with writeable properties.
const fileURLToPathMock = jest.mocked(fileURLToPath);

/** Object of static strings and helper methods meant to keep code DRY and organized. */
const absolutePaths = {
	// Start by defining the static partials that comprise the absolute paths.
	base: "/Users/username/repos",
	scope: "@dustin-ruetz",
	name: "devdeps",
	// Combine the static partials in the return values of the methods.
	/**
	 * @description Test the value of `getAbsoluteRepoRootPath()` when used by a repository that depends on the `devdeps` package.
	 * @returns Simulated path to `devdeps` when it's installed as a dependency running from a `node_modules/` folder.
	 */
	asDependency() {
		return `${this.base}/consuming-repo/node_modules/${this.scope}/${this.name}/`;
	},
	/**
	 * @description Test the value of `getAbsoluteRepoRootPath()` when used in this `devdeps` repo.
	 * @returns Simulated path to this `devdeps` repo.
	 */
	asRepo() {
		return `${this.base}/${this.name}/`;
	},
} as const;

describe("it determines the correct absolute root directory", () => {
	test("when installed as a dependency running from a `node_modules/` folder", () => {
		const absolutePath = absolutePaths.asDependency();
		fileURLToPathMock.mockReturnValue(absolutePath);

		const absoluteRepoRootPath = getAbsoluteRepoRootPath();

		expect(absoluteRepoRootPath).toBe("/Users/username/repos/consuming-repo");
	});

	test("when run from this `devdeps` repo", () => {
		const absolutePath = absolutePaths.asRepo();
		fileURLToPathMock.mockReturnValue(absolutePath);

		const absoluteRepoRootPath = getAbsoluteRepoRootPath();

		expect(absoluteRepoRootPath).toBe("/Users/username/repos/devdeps");
	});
});

test("throws an error if path does not end with either `/node_modules/@dustin-ruetz/devdeps/` or `/devdeps/`", () => {
	const absolutePath = `${absolutePaths.base}/bad-path`;
	fileURLToPathMock.mockReturnValue(absolutePath);

	expect(() => {
		getAbsoluteRepoRootPath();
	}).toThrow(/ERR_PATH_MISMATCH/);
});
