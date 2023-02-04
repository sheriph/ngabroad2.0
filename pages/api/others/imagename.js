const { promisify } = require("util");
// @ts-ignore
const sizeOf = promisify(require("image-size"));

export default async function handler(req, res) {
  console.log("req.body", req.body);

  const { file } = req.body;

  try {
    const dimensions = await sizeOf(file);
    console.log(dimensions.width, dimensions.height);
    res.status(200).json("");
  } catch (error) {
    res.status(400).json(error);
  }
}
