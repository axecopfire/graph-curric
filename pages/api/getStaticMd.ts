import process from "process";
import fs from "fs/promises";
import path from "path";
import { getMarkdownFileNames } from "../../common/api/utils";

export async function handler(req, res) {
  const result = [];
  const cwd = process.cwd();
  const fileNames = await getMarkdownFileNames();

  for (const fileName of fileNames) {
    const md = await fs.readFile(path.resolve(cwd, fileName), {
      encoding: "utf-8",
    });
    result.push({
      fileName,
      markdown: md,
    });
  }

  return res.status(200).json(result);
}
