import fs from "fs";
import { exec } from "child_process";
import jest from "jest";
import process from "process";
import path from "path";

const handler = async (req, res) => {
  const runJestAndGetResults = () =>
    new Promise((resolve, reject) => {
      const cmd = exec("yarn test:md");
      cmd.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      cmd.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      cmd.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
        if (code > 0) reject({ code });
        return resolve({ code });
      });
    });

  await runJestAndGetResults();

  const getAndParseReport = async (reportPath, json = false) => {
    const report = await fs.promises.readFile(
      path.join(process.cwd(), reportPath)
    );
    if (json) {
      return JSON.parse(report.toString());
    }
    return report.toString();
  };

  const jestReport = await getAndParseReport("coverage/jestResults.json", true);
  const coverageReport = await getAndParseReport("coverage/istanbul.txt");

  return res.status(200).json({ jestReport, coverageReport });
};

export default handler;
