import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { ROOT_CONTENT_PATH } from "common/constants";

function handler(req: NextApiRequest, res: NextApiResponse) {
  const { updateConfirmed, data, fileName } = req.query;

  // TS makin me mad
  const fixTypeScript = Object.values(req.query).filter((prop) =>
    Array.isArray(prop)
  );
  if (fixTypeScript.length) {
    const eMsg = "Somehow we hit this weird error";
    console.error(eMsg, fileName);
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
  if (regexNoPathCharacters.test(fileName as string)) {
    const eMsg = "File name can not contain \\,/,.,,";
    console.error(eMsg);
    return res.status(400).send(eMsg);
  }

  let fileExists;
  const fp = path.join(ROOT_CONTENT_PATH, "JSONs", `${fileName}.json`);
  try {
    console.log(fp);
    fileExists = fs.statSync(fp);
  } catch (e) {
    fileExists = false;
  }

  if (fileExists && updateConfirmed !== "true") {
    return res.status(409).send("File already exists");
  }

  fs.writeFileSync(fp, data as string);

  console.debug("File saved successfully");

  return res.status(200).send("File saved successfully");
}

export default handler;
