export default async function handler(req, res) {
  console.log("req.body", req.body);

  try {
    if (!req.body) throw new Error("Upload failed");
    res.status(200).json({ url: req.body });
  } catch (error) {
    res.status(400).json(error);
  }
}
