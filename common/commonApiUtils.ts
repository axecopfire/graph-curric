import glob from "glob";
import process from "process";
import fs from "fs/promises";
import path from "path";

export type RawMdDataType = { fileName: string; rawMd: string }[];

export const getRootContentFilePath = "public/content/";

export const getMarkdownFileNames = (
  root = getRootContentFilePath
): Promise<string[]> =>
  new Promise((resolve, reject) =>
    glob(
      `${root}*.md`,
      (err, files: string[]) =>
        new Promise(() => (err ? reject(err) : resolve(files)))
    )
  );

export const getStaticMd = async (root?: string) => {
  const result: RawMdDataType = [];
  const cwd = process.cwd();
  const fileNames = await getMarkdownFileNames(root);

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
