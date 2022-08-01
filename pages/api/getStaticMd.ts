import { getStaticMd } from "../../common/commonApiUtils";

async function handler(req, res) {
  const result = await getStaticMd();

  return res.status(200).json(result);
}

export default handler;
