import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { getRootContentFilePath } from "../../common/commonApiUtils";

function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("--->", req.query);
  const fileName = req.query?.fileName;
  const data = req.query?.data;

  if (Array.isArray(fileName) || Array.isArray(data)) {
    const eMsg = "Somehow we hit this weird error";
    console.error(eMsg, fileName, data);
    return res
      .status(400)
      .send(
        "Please let the developers know how you got this error. This error catch was made because Typescript was complaining"
      );
  }

  if (!fileName) {
    const eMsg = "fileName required";
    console.error(eMsg);
    return res.status(400).send(eMsg);
  }

  if (!data) {
    const eMsg = "No data provided";
    console.error(eMsg);
    return res.status(400).send(eMsg);
  }

  const regexNoPathCharacters = /(\.|\\|\/|\,)/g;
  if (regexNoPathCharacters.test(fileName)) {
    const eMsg = "File name can not contain \\,/,.,,";
    console.error(eMsg);
    return res.status(400).send(eMsg);
  }

  let fileExists;
  const fp = path.join(getRootContentFilePath, "JSONs", `${fileName}.json`);
  try {
    console.log(fp);
    fileExists = fs.statSync(fp);
  } catch (e) {
    fileExists = false;
  }

  if (fileExists) {
    return res.status(400).send("File already exists");
  }

  fs.writeFileSync(fp, data);

  console.debug("File saved successfully");

  return res.status(200).send("File saved successfully");
}

export default handler;
