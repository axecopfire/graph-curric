import fs from "fs";
import { exec } from "child_process";
import jest from "jest";
import process from "process";
import path from "path";

const handler = async (req, res) => {
  let testResults = "";
  const runJestAndGetResults = () =>
    new Promise((resolve, reject) => {
      const cmd = exec("yarn test:md");
      cmd.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      cmd.stderr.on("data", (data) => {
        if (data.includes("JestMdTestResults")) {
          testResults = data;
        }
        console.error(`stderr: ${data}`);
      });

      cmd.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
        // We get results from the files written in /coverage. So we ignore any error codes
        return resolve({ code });
      });
    });

  await runJestAndGetResults();

  // These reports would be cool to send to the UI user
  // However, running paralleled fs read/writes is going to be a challenge for another day
  // const getAndParseReport = async (reportPath, json = false) => {
  //   const report = await fs.promises.readFile(
  //     path.join(process.cwd(), reportPath)
  //   );
  //   if (json) {
  //     return JSON.parse(report.toString());
  //   }
  //   return report.toString();
  // };

  // const jestReport = await getAndParseReport("coverage/jestResults.json", true);
  // const coverageReport = await getAndParseReport("coverage/istanbul.txt");

  /**
   * The JestMdTestResults can be found in the `validateContent.test.ts`
   * It shows up in this file as a string that says `console.log` something
   * So we pull out just the results using this regex (which is pretty flimsy and prone to break)
   */
  const cleanedTestResults = testResults.match(/{"JestMdTestResults.*/)[0];
  let response;
  try {
    response = JSON.parse(cleanedTestResults);
    console.log("Test Results are successfully parseable");
  } catch (error) {
    console.log("Failed to parse JSON test results");
    console.error(error);
  }

  return res.status(200).json({ testResults: response.JestMdTestResults });
};

export default handler;
