import { getMarkdownFileNames } from "common/commonApiUtils";
import { ROOT_CONTENT_PATH } from "common/constants";

const handler = async (req, res) => {
  const mdPath = ROOT_CONTENT_PATH + "**/";
  const files = await getMarkdownFileNames(mdPath);

  return res.status(200).json(files);
};

export default handler;
