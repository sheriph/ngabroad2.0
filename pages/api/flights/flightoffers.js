import { getCookie } from "cookies-next";
import { setCookie } from "cookies-next";
import axios from "axios";
import { get } from "lodash";

export default async function handler(req, res) {
  const { data } = req.body;
  const trip = JSON.parse(data).trip;
  console.log("FLIGHTOFFERSS SEARCH", trip);

  try {
       console.log("token", getCookie("accessToken", { req, res }));

    //originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2022-11-01&returnDate=2022-11-18&adults=1&children=0&infants=0&travelClass=ECONOMY

    /*     const config = {
      method: "get",
      url: `https://test.api.amadeus.com/v2/shopping/flight-offers?${keyword}`,
      headers: {
        Authorization: `Bearer ${getCookie("accessToken", { req, res })}`,
      },
    }; */

    const config = {
      method: "post",
      url: "https://test.api.amadeus.com/v2/shopping/flight-offers",
      headers: {
        "Content-Type": "application/json",
        "X-HTTP-Method-Override": "GET",
        "Authorization": `Bearer ${getCookie("accessToken", {
          req,
          res,
        })}`,
      },
      data: data,
    };

    // @ts-ignore
    const response = await axios(config);
    const updatedOffers = {
      ...response.data,
      data: get(response.data, "data", []).map((offer) => ({ ...offer, trip })),
    };
    res.status(200).json(updatedOffers);
  } catch (error) {
    console.log("error", error.response.data);
    res.status(400).json(error.response.data);
  }
}
