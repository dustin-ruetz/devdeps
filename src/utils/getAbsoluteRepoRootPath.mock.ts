import {getAbsoluteRepoRootPath} from "./getAbsoluteRepoRootPath.js";

jest.mock("./getAbsoluteRepoRootPath.js", () => ({
	// The function returns a string, so have the mock return an empty string by default.
	getAbsoluteRepoRootPath: jest.fn(() => ""),
}));

/**
 * @description Reusable mock for the `getAbsoluteRepoRootPath` utility function.
 *
 * @example
 * ```js
 * getAbsoluteRepoRootPathMock.mockReturnValue("/Users/username/repos/repo-name")
 * ```
 */
export const getAbsoluteRepoRootPathMock =
	getAbsoluteRepoRootPath as jest.MockedFunction<
		typeof getAbsoluteRepoRootPath
	>;
