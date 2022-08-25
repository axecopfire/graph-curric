import { getMarkdownFileNames, getStaticMd } from "./commonApiUtils";
import fs from "fs";

const mockTestPath = "__mocks__/test.md";
const testMdMocks = [
  {
    fileName: mockTestPath,
    rawMd: fs.readFileSync(mockTestPath).toString(),
  },
];

test("Glob works", async () => {
  const expectedResult = testMdMocks.map((md) => md.fileName);
  const result = await getMarkdownFileNames("__mocks__/").catch(console.error);
  expect(result).toEqual(expectedResult);
});

test("Should return an array of read files", async () => {
  const result = await getStaticMd("__mocks__/").catch(console.error);
  expect(result).toEqual(testMdMocks);
});
