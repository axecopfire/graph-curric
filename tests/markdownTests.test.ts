import fs from "fs";
import glob from "glob";
import path from "path";
import { getMarkdownFileNames, getStaticMd } from "common/commonApiUtils";
import { ROOT_CONTENT_PATH } from "common/constants";
import { renderRawMd } from "common/commonBrowserUtils";

describe("Check markdown files", () => {
  it("should have content", async () => {
    const mdFilePath = ROOT_CONTENT_PATH + "md/**/";
    const mdFiles = await getStaticMd(mdFilePath);
    const fileResults = await Promise.all(
      renderRawMd(mdFiles).map(async (file) => {
        const result = {
          fileName: file.fileName,
          error: [],
        };
        if (!file.renderedMd) {
          result.error.push({ statusCode: 204, message: "no rendered md" });
        }
        return result;
      })
    );

    console.log({ JestMdTestResults: JSON.stringify(fileResults) });

    let failedTest = false;
    fileResults.map((file) => {
      if (file.error.length) {
        failedTest = true;
        // Console.error makes Jest very verbose so, keep as console.log
        console.log(JSON.stringify(file));
      }
    });

    expect(failedTest).toEqual(false);
    expect(1).toEqual(1);
  });
});
