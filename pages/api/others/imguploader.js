export default async function handler(req, res) {
  console.log("herw");
  console.log("req.body", req.body);

  try {
    //  if (!req.body) throw new Error("Upload failed");
    const response = {
      success: 1,
      file: {
        url: "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
        // ... and any additional fields you want to store, such as width, height, color, extension, etc
      },
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
