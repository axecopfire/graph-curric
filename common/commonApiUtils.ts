import glob from "glob";
import process from "process";
import fs from "fs/promises";
import path from "path";
import { ROOT_CONTENT_PATH } from "common/constants";

export type RawMdDataType = { fileName: string; rawMd: string }[];

export const getMarkdownFileNames = (
  root = ROOT_CONTENT_PATH
): Promise<string[]> =>
  new Promise((resolve, reject) =>
    glob(
      `${root}*.md`,
      (err, files: string[]) =>
        new Promise(() => (err ? reject(err) : resolve(files)))
    )
  );

export const getStaticMd = async (root?: string, fileList = []) => {
  const result: RawMdDataType = [];
  const cwd = process.cwd();
  let fileNames = [];
  if (fileList) {
    fileNames = fileList;
    if (root) {
      fileNames = fileNames.map(f => root + f);
    }
  } else {
    fileNames = await getMarkdownFileNames(root)
  }

  for (const fileName of fileNames) {
    const md = await fs.readFile(path.resolve(cwd, fileName), {
      encoding: "utf-8",
    });
    result.push({
      fileName,
      rawMd: md,
    });
  }

  return result;
};
