import {getAbsoluteRepoRootPath} from "../../utils/getAbsoluteRepoRootPath.js";
import {getIsDevDepsRepo} from "../../utils/getIsDevDepsRepo.js";
import {nodeModulesPackagePath} from "../../constants.js";

/** Determines the root paths when running the `init-repo` script and its associated helper functions. */
export const getRootPaths = () => {
	const absoluteRepoRootPath = getAbsoluteRepoRootPath();
	const isDevDepsRepo = getIsDevDepsRepo(absoluteRepoRootPath);

	const rootPaths = {
		readFrom: "",
		writeTo: "",
	};

	// *If* developing/testing locally from this `devdeps` repo:
	// 1. Read from the root of the repo, and
	// 2. Write to the .gitignore'd `.init-repo-script-test-output/` directory.
	if (isDevDepsRepo) {
		rootPaths.readFrom = absoluteRepoRootPath;
		rootPaths.writeTo = `${absoluteRepoRootPath}/.init-repo-script-test-output`;
	}
	// *Else* the script is being run from a consuming repo, so:
	// 1. Read from the `node_modules/@dustin-ruetz/devdeps/` directory, and
	// 2. Write to the root of the consuming repo, i.e. the current working directory of the Node.js process.
	else {
		rootPaths.readFrom = `${absoluteRepoRootPath}/${nodeModulesPackagePath}`;
		rootPaths.writeTo = process.cwd();
	}

	return rootPaths;
};
