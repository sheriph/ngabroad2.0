import { getCookie } from "cookies-next";
import axios from "axios";
import { get } from "lodash";

export default async function createFlightOffers(data) {
  const trip = JSON.parse(data).trip;
  console.log("FLIGHTOFFERSS SEARCH", trip, getCookie("accessToken"));

  try {
    const config = {
      method: "post",
      url: "https://test.api.amadeus.com/v2/shopping/flight-offers",
      headers: {
        "Content-Type": "application/json",
        "X-HTTP-Method-Override": "GET",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
      data: data,
    };

    // @ts-ignore
    const response = await axios(config);
    const updatedOffers = {
      ...response.data,
      data: get(response.data, "data", []).map((offer) => ({ ...offer, trip })),
    };
    return updatedOffers;
  } catch (error) {
    console.log("error in flightOffer", error);
    // viewErrors(get(error.response, "data.errors", []))
    throw new Error(error);
  }
}
