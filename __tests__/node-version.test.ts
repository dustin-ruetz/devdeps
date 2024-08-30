import {readFile} from "fs/promises";

test("the correct version of Node.js is specified", async () => {
	const versionNumber = (
		await readFile(".node-version", {encoding: "utf-8"})
	).trim();

	expect(versionNumber).toEqual("20");
});
