import * as getStaticMd from "./getStaticMd";

jest.mock("../../common/api/utils", () => {
  const originalModule = jest.requireActual("../../common/api/utils");
  return {
    ...originalModule,
    getMarkdownFileNames: jest.fn(() =>
      Promise.resolve(["content/f.md", "content/d.md", "content/test.md"])
    ),
  };
});

jest.mock("fs/promises", () => {
  const originalModule = jest.requireActual("fs/promises");
  return {
    ...originalModule,
    readFile: jest.fn(() => Promise.resolve("Test text")),
  };
});

test("Should return an array of read files", async () => {
  const expectedReturn = [
    { fileName: "content/f.md", markdown: "Test text" },
    { fileName: "content/d.md", markdown: "Test text" },
    { fileName: "content/test.md", markdown: "Test text" },
  ];
  const mockHttpResponse = {
    status: () => ({
      json: jest.fn((r) => r),
    }),
  };

  const result = await getStaticMd.handler({}, mockHttpResponse);
  expect(result).toEqual(expectedReturn);
});
