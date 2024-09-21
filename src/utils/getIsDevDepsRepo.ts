import {packageName} from "../constants.js";

/** Given a path, determine whether or not it's this `devdeps` repository. */
export const getIsDevDepsRepo = (path: string) =>
	path.endsWith(packageName) || path.endsWith(`${packageName}/`);
