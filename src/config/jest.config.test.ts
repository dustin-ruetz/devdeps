import {dependsOnMock} from "../utils/dependsOn.mock.js";
import {getAbsoluteRepoRootPathMock} from "../utils/getAbsoluteRepoRootPath.mock.js";
import {makeJestConfig} from "./jest.config.js";

afterEach(() => {
	jest.clearAllMocks();
});

describe("it exports a configuration object and the most important config options are correct", () => {
	test("for the parts of the config that *are not* affected by conditional logic", async () => {
		const hasFrontendDependencies = false;
		dependsOnMock.mockResolvedValue(hasFrontendDependencies);
		getAbsoluteRepoRootPathMock.mockReturnValue(
			"/Users/username/repos/devdeps",
		);

		const jestConfig = await makeJestConfig();

		expect(dependsOnMock).toHaveBeenCalledWith(["pug", "react"]);

		expect(typeof jestConfig).toEqual("object");

		expect(jestConfig.cacheDirectory).toEqual("<rootDir>/.caches/.jestcache/");
		expect(jestConfig.coverageProvider).toEqual("v8");
		expect(jestConfig.transform?.[".(js|jsx|ts|tsx)"]?.[0]).toEqual(
			"@swc/jest",
		);
		expect(jestConfig.verbose).toBe(true);
	});

	test("when testing this devdeps repo (which *does not* have frontend dependencies)", async () => {
		const hasFrontendDependencies = false;
		dependsOnMock.mockResolvedValue(hasFrontendDependencies);
		getAbsoluteRepoRootPathMock.mockReturnValue(
			"/Users/username/repos/devdeps",
		);

		const jestConfig = await makeJestConfig();

		expect(jestConfig.rootDir).toEqual("/Users/username/repos/devdeps");
		expect(jestConfig.testEnvironment).toEqual("node");
		// Sample the transform config object to verify that the paths to the transformer files are correct.
		expect(jestConfig.transform?.[".svg"]).toEqual(
			"<rootDir>/lib/config/jest-transformers/svgFile.js",
		);
	});

	test("when testing a repo that has installed the devdeps package (repo *does* have frontend dependencies)", async () => {
		const hasFrontendDependencies = true;
		dependsOnMock.mockResolvedValue(hasFrontendDependencies);
		getAbsoluteRepoRootPathMock.mockReturnValue(
			"/Users/username/repos/consuming-repo",
		);

		const jestConfig = await makeJestConfig();

		expect(jestConfig.rootDir).toEqual("/Users/username/repos/consuming-repo");
		expect(jestConfig.testEnvironment).toEqual("jsdom");
		// Sample the transform config object to verify that the paths to the transformer files are correct.
		expect(jestConfig.transform?.[".svg"]).toEqual(
			"<rootDir>/node_modules/@dustin-ruetz/devdeps/lib/config/jest-transformers/svgFile.js",
		);
	});
});
