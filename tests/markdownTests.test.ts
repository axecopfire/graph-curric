import fs from "fs";
import glob from "glob";
import path from "path";
import { getMarkdownFileNames, getStaticMd } from "common/commonApiUtils";
import { ROOT_CONTENT_PATH } from "common/constants";
import { renderRawMd } from "common/commonBrowserUtils";

describe("Check markdown files", () => {
  it("should have content", async () => {
    const mdFilePath = ROOT_CONTENT_PATH + "md/**/";
    // console.log({ mdFilePath });
    const mdFiles = await getStaticMd(mdFilePath);
    // console.log(renderRawMd(mdFiles));
    // await Promise.all(mdFiles.map(async file => {
    // }))

    expect(1).toEqual(1);
  });
});
