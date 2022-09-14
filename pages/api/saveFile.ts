import fs from "fs";

export default function saveFile(req, res) {
  const { data, fileName } = JSON.parse(req.body);

  fs.statSync(fileName);

  fs.writeFileSync(fileName, JSON.parse(data));
  return res.send(200);
}
