import { getMarkdownFileNames, getStaticMd } from "./commonApiUtils";

const testMdMocks = [
  {
    fileName: "__mocks__/test.md",
    markdown:
      "---\r\n" +
      "Title: Test\r\n" +
      "Author: Schuster Braun\r\n" +
      "Date: July 31, 2022\r\n" +
      'heroimage: "http://i.imgur.com/rBX9z0k.png"\r\n' +
      "tags:\r\n" +
      "  - data visualization\r\n" +
      "  - bitmap\r\n" +
      "  - raster graphics\r\n" +
      "  - navigation\r\n" +
      "---\r\n" +
      "\r\n" +
      "# Wow\r\n" +
      "\r\n" +
      "Ahem, Test 1 2. Test 1 2\r\n",
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
