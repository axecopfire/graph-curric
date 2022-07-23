import process from "process";
import fs from "fs/promises";
import glob from "glob";
import path from "path";

const getMarkdownFileNames = (root = "content/") =>
  new Promise((resolve, reject) =>
    glob(
      `${root}*.md`,
      (err, files) => new Promise(() => (err ? reject(err) : resolve(files)))
    )
  );

async function handler(req, res) {
  const result = {};
  const cwd = process.cwd();
  const fileNames = await getMarkdownFileNames();

  for (const fileName of fileNames) {
    const sanitizedFileName = fileName.split("/").pop();
    const md = await fs.readFile(path.resolve(cwd, fileName), {
      encoding: "utf-8",
    });

    result[sanitizedFileName] = md;
  }

  res.status(200).json(result);
}

export default handler;
