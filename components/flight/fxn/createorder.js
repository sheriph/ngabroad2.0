import { getCookie } from "cookies-next";
import axios from "axios";

export default async function createdOrder(data) {
  // const { data } = req.body;
  console.log("FLIGHT CREATE ORDER");

  try {
    const config = {
      method: "post",
      url: "https://test.api.amadeus.com/v1/booking/flight-orders",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
      data: data,
    };
    // @ts-ignore
    const response = await axios(config);

    return response;
  } catch (error) {
    console.log("error", error.response.data);
    throw new Error(error);
  }
}
