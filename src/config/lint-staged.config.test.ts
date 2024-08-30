import type {Config} from "lint-staged";
import lintstagedConfig from "./lint-staged.config.js";

test("it exports a configuration object", () => {
	expect(typeof lintstagedConfig).toEqual("object");
});

describe("it runs the correct commands for", () => {
	const relativePaths = ["src/lint-staged.config.ts"] as const;
	const [relativePath] = relativePaths;

	test("formatting", () => {
		expect(lintstagedConfig["*" as keyof Config]).toEqual(
			"npm run format -- --ignore-unknown --write",
		);
	});

	test("linting files with styles", () => {
		expect(lintstagedConfig["*.{css,scss,jsx,tsx}" as keyof Config]).toEqual(
			"npm run lint/styles -- --fix",
		);
	});

	/**
	 * @todo Figure out how to correctly type the objects on `lintstagedConfig`, then
	 *       remove the `eslint-disable` and `@ts-expect-error` comments below.
	 */

	/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
	const [lintJavaScriptTypeScriptCommand, typecheckCommand, unitTestCommand] =
		/** @ts-expect-error - See above to-do comment. */
		lintstagedConfig["*.{js,jsx,ts,tsx}"](relativePaths);
	/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

	test("linting JS and TS files", () => {
		expect(lintJavaScriptTypeScriptCommand).toEqual(
			`npm run lint/js-ts -- --fix ${relativePath}`,
		);
	});

	test("typechecking", () => {
		expect(typecheckCommand).toEqual("npm run check/types");
	});

	test("unit testing", () => {
		expect(unitTestCommand).toEqual(
			`npm run test/unit/coverage -- --findRelatedTests --collectCoverageFrom= ${relativePath}`,
		);
	});
});
