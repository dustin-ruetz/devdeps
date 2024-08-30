import {readFile} from "node:fs/promises";
// Ideally the following two import statements would be in alphabetical order, but since
// `getAbsoluteRepoRootPath` is imported in `dependsOn`, its mock must be imported first.
import {getAbsoluteRepoRootPathMock} from "./getAbsoluteRepoRootPath.mock.js";
import {dependsOn} from "./dependsOn.js";

jest.mock("node:fs/promises", () => ({
	readFile: jest.fn(),
}));
// Paraphrased excerpt from https://www.mikeborozdin.com/post/changing-jest-mocks-between-tests:
// > Typecast the imported mocked module into a mocked function with writeable properties.
const readFileMock = readFile as jest.MockedFunction<typeof readFile>;

afterEach(() => {
	jest.clearAllMocks();
});

test("throws errors if the required `deps` argument is invalid", () => {
	void expect(async () => {
		// @ts-expect-error if `deps` is not passed.
		await dependsOn();
	}).rejects.toThrow(/ERR_INVALID_DEPS_ARRAY/);

	void expect(async () => {
		// @ts-expect-error if `deps` is not an array.
		await dependsOn("package1");
	}).rejects.toThrow(/ERR_INVALID_DEPS_ARRAY/);

	void expect(async () => {
		// Expect an error if `deps` is an empty array.
		await dependsOn([]);
	}).rejects.toThrow(/ERR_INVALID_DEPS_ARRAY/);

	void expect(async () => {
		// Expect an error if `deps` is an array containing an empty string.
		await dependsOn(["package1", ""]);
	}).rejects.toThrow(/ERR_TYPEOF_DEP_NOT_STRING/);

	void expect(async () => {
		// @ts-expect-error if `deps` is an array containing non-string values.
		await dependsOn(["package1", 2]);
	}).rejects.toThrow(/ERR_TYPEOF_DEP_NOT_STRING/);
});

test("returns `false` if the repo *does not* depend on the package", async () => {
	getAbsoluteRepoRootPathMock.mockReturnValue("/Users/username/repos/devdeps");
	const packageJsonContents = `
{
	"dependencies": {
		"dep1": "major.minor.patch"
	}
}
`;
	readFileMock.mockResolvedValue(packageJsonContents);

	const dependsOnDep0 = await dependsOn(["dep0"]);

	expect(getAbsoluteRepoRootPathMock).toHaveBeenCalledTimes(1);
	expect(readFileMock).toHaveBeenCalledWith(
		"/Users/username/repos/devdeps/package.json",
		{encoding: "utf-8"},
	);
	expect(dependsOnDep0).toBe(false);
});

test("returns `true` if the repo *does* depend on the package", async () => {
	const packageJsonContents = `
{
	"devDependencies": {
		"devDep1": "major.minor.patch"
	}
}
`;
	readFileMock.mockResolvedValue(packageJsonContents);

	const dependsOnDevDep1 = await dependsOn(["devDep1"]);

	expect(getAbsoluteRepoRootPathMock).toHaveBeenCalledTimes(1);
	expect(readFileMock).toHaveBeenCalledTimes(1);
	expect(dependsOnDevDep1).toBe(true);
});

test("returns `true` if the repo depends on at least one of the passed packages", async () => {
	const packageJsonContents = `
{
	"dependencies": {
		"dep1": "major.minor.patch"
	},
	"devDependencies": {
		"devDep1": "major.minor.patch"
	},
	"peerDependencies": {
		"peerDep1": "major.minor.patch"
	}
}
`;
	readFileMock.mockResolvedValue(packageJsonContents);

	const dependsOnPeerDep1 = await dependsOn(["dep0", "devDep0", "peerDep1"]);

	expect(getAbsoluteRepoRootPathMock).toHaveBeenCalledTimes(1);
	expect(readFileMock).toHaveBeenCalledTimes(1);
	expect(dependsOnPeerDep1).toBe(true);
});
