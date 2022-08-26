import { ROOT_CONTENT_PATH } from "common/constants";
import fs from "fs";

export default async function handler(req, res) {
  const curriculum = JSON.parse(req.query?.curriculum);

  const jsonToMarkdown = (json, memo = "", level = 0) => {
    function isEmpty(obj) {
      return Object.keys(obj).length === 0;
    }

    return Object.entries(json).reduce((acc, [key, value]) => {
      const filePath = `${memo}/${key}`;
      let heading = "";
      const createHeading = (str, prepend, filePath) => {
        const sanitizedKey = str.replace(".md", "");
        return `${prepend} [${sanitizedKey}](md${filePath})\n`;
      };
      switch (level) {
        case 0:
          heading = createHeading(key, "#", filePath);
          break;
        case 1:
          heading = createHeading(key, "-", filePath);
          break;
        case 2:
          heading = createHeading(key, "\t-", filePath);
          break;
        default:
          throw new Error(`Can't tell the level: ${key + " " + level}`);
      }

      if (isEmpty(value)) {
        return acc + heading;
      }

      return `${
        acc + heading + "\n" + jsonToMarkdown(value, filePath, level + 1)
      }`;
    }, "");
  };

  const result = jsonToMarkdown(curriculum.md);

  fs.writeFileSync(`${ROOT_CONTENT_PATH}/README.md`, result);
  return res.status(200).json({ curriculum: result });
}
