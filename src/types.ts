/**
 * Specify the shape and types of the `package.json` object's key/value pairs (for scenarios
 * like `readFile(packageJsonPath)`) where TypeScript has no way of knowing what they are.
 */
export type PackageJsonTypes = {
	name: string;
	version: string;
	description: string;
	scripts: Record<string, string>;
	files: [];
	publishConfig?: Record<string, string>;
	repository: {
		url: string;
	};
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
	peerDependencies: Record<string, string>;
};
