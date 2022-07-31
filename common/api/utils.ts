import glob from "glob";

export const getMarkdownFileNames = (root = "content/"): Promise<string[]> =>
  new Promise((resolve, reject) =>
    glob(
      `${root}*.md`,
      (err, files: string[]) =>
        new Promise(() => (err ? reject(err) : resolve(files)))
    )
  );
