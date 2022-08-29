import { getStaticMd } from "../../common/commonApiUtils";

async function handler(req, res) {
  const fileList = JSON.parse(req.query.fileList);
  const root = req?.query.root;

  const result = await getStaticMd(root, fileList);
  return res.status(200).json(result);
}

export default handler;
