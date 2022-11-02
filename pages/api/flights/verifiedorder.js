import { getCookie } from "cookies-next";
import axios from "axios";

export default async function handler(req, res) {
  const { key } = req.body;
  console.log("keyword", key);

  try {
    const config = {
      method: "get",
      url: `https://test.api.amadeus.com/v1/booking/flight-orders/${key}`,
      headers: {
        Authorization: `Bearer ${getCookie("accessToken", {
          req,
          res,
        })}`,
      },
    };

    // @ts-ignore
    const response = await axios(config);
    res.status(200).json(response.data);
  } catch (error) {
    console.log("error.response", error.response.data);
    res.status(400).json(error.response.data);
  }
}
