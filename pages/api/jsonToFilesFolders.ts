import { getRootContentFilePath } from "../../common/commonApiUtils";
import fs from "fs";
import path from "path";

const handler = (req, res) => {
  const reqJson = JSON.parse(req.query.json) as Record<
    string,
    Record<string, string>
  >;

  Object.entries(reqJson).map(([folderName, fileList]) => {
    const folderPath = path.join(getRootContentFilePath, "md", folderName);
    try {
      fs.mkdirSync(folderPath);
    } catch (error) {
      // if we're erroring besides Folder existing
      if (error.code !== "EEXIST") throw error;
    }

    Object.entries(fileList).map(([fileName, content]) => {
      const filePath = path.join(folderPath, `${fileName}.md`);
      try {
        fs.statSync(filePath);
      } catch (error) {
        // If file doesn't exist then create it with seed content
        if (error.code === "ENOENT") {
          fs.writeFileSync(filePath, content);
        } else {
          throw error;
        }
      }
    });
  });

  return res.send({ g: "all good" });
};

export default handler;
