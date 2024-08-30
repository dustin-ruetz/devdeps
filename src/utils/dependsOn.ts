import {readFile} from "node:fs/promises";
import type {PackageJsonTypes} from "../types.js";
import {getAbsoluteRepoRootPath} from "./getAbsoluteRepoRootPath.js";
import {ValidationError} from "./ValidationError.js";

/**
 * @description Given a list of dependencies, check the repository's `package.json` file
 *              and determine whether or not the project depends on any of them.
 *
 * @example
 * ```js
 * // The following line of code checks the repository's `package.json` file to determine
 * // whether or not the project depends on either the Pug or React packages.
 * const testEnvironment = await dependsOn(["pug", "react"]) ? "jsdom" : "node";
 * ```
 */
export const dependsOn = async (deps: string[]) => {
	// It's possible to use this function directly from the compiled lib/ .js file,
	// so start with validation checks and throw errors early if needed.
	if (!Array.isArray(deps) || deps.length < 1) {
		throw new ValidationError(
			"Argument for the `deps` parameter must be an array of strings with a length >= 1.",
			{
				cause: {
					code: "ERR_INVALID_DEPS_ARRAY",
					values: {deps, "typeof deps": typeof deps},
				},
			},
		);
	}
	deps.forEach((dep) => {
		if (dep === "" || typeof dep !== "string") {
			throw new ValidationError(
				"All values in the `deps` array argument must be non-empty strings.",
				{
					cause: {
						code: "ERR_TYPEOF_DEP_NOT_STRING",
						values: {deps, dep, "typeof dep": typeof dep},
					},
				},
			);
		}
	});

	// Read the package.json file and parse its string contents into an object,
	// then merge its three dependency objects into one combined object.
	const packageJsonPath = `${getAbsoluteRepoRootPath()}/package.json`;
	const packageJsonContents = await readFile(packageJsonPath, {
		encoding: "utf-8",
	});
	const packageJson = JSON.parse(packageJsonContents) as PackageJsonTypes;
	const allDependencies = {
		...packageJson.dependencies,
		...packageJson.devDependencies,
		...packageJson.peerDependencies,
	};

	// Determine whether or not the package.json file has any of the passed dependencies.
	let hasDependency = false;
	deps.forEach((dep) => {
		if (allDependencies[dep]) {
			hasDependency = true;
		}
	});

	return hasDependency;
};
