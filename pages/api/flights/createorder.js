import { getCookie } from "cookies-next";
import axios from "axios";


export default async function handler(req, res) {
  const { data } = req.body;
  console.log("FLIGHT CREATE ORDER");

  try {
    console.log("token", getCookie("accessToken", { req, res }));
    const config = {
      method: "post",
      url: "https://test.api.amadeus.com/v1/booking/flight-orders",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken", {
          req,
          res,
        })}`,
      },
      data: data,
    };
    // @ts-ignore
    const response = await axios(config);

    res.status(200).json(response.data);
  } catch (error) {
    console.log("error", error.response.data);
    res.status(400).json(error.response.data);
  }
}
