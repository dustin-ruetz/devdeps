import {dependsOn} from "./dependsOn.js";

jest.mock("./dependsOn.js", () => ({
	dependsOn: jest.fn(),
}));

/**
 * @description Reusable mock for the `dependsOn` utility function.
 *
 * @example
 * ```js
 * // Use the mocked implementation of `dependsOn` by resolving its promise to the value needed for the test.
 * const doesDependOnFrontendPackages = dependsOnMock.mockResolvedValue(true)
 * const doesNotDependOnFrontendPackages = dependsOnMock.mockResolvedValue(false)
 * ```
 */
export const dependsOnMock = dependsOn as jest.MockedFunction<typeof dependsOn>;
