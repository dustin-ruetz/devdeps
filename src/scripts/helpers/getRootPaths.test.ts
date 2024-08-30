import {getAbsoluteRepoRootPathMock} from "../../utils/getAbsoluteRepoRootPath.mock.js";
import {getRootPaths} from "./getRootPaths.js";

afterEach(() => {
	jest.clearAllMocks();
});

/**
 * @todo Ideally this `unbound-method` lint error should be handled by the `eslint-plugin-jest` package.
 * @link https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/unbound-method.md
 */
// eslint-disable-next-line @typescript-eslint/unbound-method
const initialProcessCwd = process.cwd;
afterAll(() => {
	process.cwd = initialProcessCwd;
});

describe("the returned root paths (1. to read from, and 2. to write to) are correct when called from", () => {
	test("this devdeps repo", () => {
		getAbsoluteRepoRootPathMock.mockReturnValue(
			"/Users/username/repos/devdeps",
		);

		const rootPaths = getRootPaths();

		expect(rootPaths.readFrom).toEqual("/Users/username/repos/devdeps");
		expect(rootPaths.writeTo).toEqual(
			"/Users/username/repos/devdeps/.init-repo-script-test-output",
		);
	});

	test("a consuming repo that has installed the devdeps package", () => {
		const consumingRepoAbsoluteRootDir = "/Users/username/repos/consuming-repo";
		getAbsoluteRepoRootPathMock.mockReturnValue(consumingRepoAbsoluteRootDir);

		process.cwd = () => consumingRepoAbsoluteRootDir;

		const rootPaths = getRootPaths();

		expect(rootPaths.readFrom).toEqual(
			"/Users/username/repos/consuming-repo/node_modules/@dustin-ruetz/devdeps",
		);
		expect(rootPaths.writeTo).toEqual("/Users/username/repos/consuming-repo");
	});
});
