import { getStaticMd } from "../../common/commonApiUtils";

async function handler(req, res) {
  let fileList = req.query.fileList;
  const root = req?.query.root;
  fileList = fileList ? JSON.parse(fileList) : [];

  const result = await getStaticMd(root, fileList);
  return res.status(200).json(result);
}

export default handler;
