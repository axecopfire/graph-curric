import fs from "fs";
import process from 'process';
import path from 'path'

export default function handler(req, res) {
  const { data, fileName, force } = JSON.parse(req.body);
  const fp = path.join(process.cwd(), fileName);

  // Force should force create a file if it doesn't
  if (!force) {
    fs.statSync(fileName);
  }

  fs.writeFileSync(fp, JSON.parse(data));
  return res.send(200);
}
