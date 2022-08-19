import fs from "fs";
import path from "path";
import { resourceLimits } from "worker_threads";
import { ROOT_CONTENT_PATH } from "common/constants";

const sanitizeName = (name) => name.toLowerCase().replace(" ", "-");
const injectableFrontMatter = ({ fileName, folderName }) => {
  const frontMatter = `---
title: ${fileName}
id: ${sanitizeName(folderName + "-" + fileName)}
---
`;
  return frontMatter;
};

const handler = (req, res) => {
  const reqJson = JSON.parse(req.query.json) as Record<
    string,
    Record<string, string>
  >;

  Object.entries(reqJson).map(([folderName, fileList]) => {
    const folderPath = path.join(
      ROOT_CONTENT_PATH,
      "md",
      sanitizeName(folderName)
    );
    try {
      fs.mkdirSync(folderPath);
    } catch (error) {
      // if we're erroring besides Folder existing
      if (error.code !== "EEXIST") throw error;
    }

    Object.entries(fileList).map(([fileName, content]) => {
      const filePath = path.join(folderPath, `${sanitizeName(fileName)}.md`);
      try {
        fs.statSync(filePath);
      } catch (error) {
        // If file doesn't exist then create it with seed content
        if (error.code === "ENOENT") {
          fs.writeFileSync(
            filePath,
            injectableFrontMatter({ fileName, folderName }) + content
          );
        } else {
          throw error;
        }
      }
    });
  });

  return res.status(200).json({ message: "all good" });
};

export default handler;
