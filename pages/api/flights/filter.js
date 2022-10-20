import { filter, find, forEach, get } from "lodash";
import { getStops } from "../../../lib/utility";

export default async function handler(req, res) {
  const { airlines, stopValue, flightOffers } = req.body;

  console.log({ airlines, stopValue, flightOffers });

  console.time("filterTime");

  try {
    if (flightOffers.length === 0) {
      res.status(200).json([]);
      return;
    }
    const newOffers1 = filter(flightOffers, (flightOffer) => {
      let included = [];
      forEach(get(flightOffer, "itineraries", []), (itinerary) => {
        forEach(get(itinerary, "segments", []), (segment) => {
          const selectedAirlines = filter(
            airlines,
            // @ts-ignore
            (airline) => airline.status
          );
          /*  console.log(
            "selectedAirlines",
            selectedAirlines,
            get(segment, "operating.carrierCode", "") === "AA"
          ); */
          included.push(
            selectedAirlines
              // @ts-ignore
              .map((airline) => airline.iataCode)
              .includes(get(segment, "carrierCode", ""))
          );
          included.push(
            selectedAirlines
              // @ts-ignore
              .map((airline) => airline.iataCode)
              .includes(get(segment, "operating.carrierCode", ""))
          );
        });
      });
      return included.includes(true);
    });
    const newOffers2 = filter(newOffers1, (offer, index, arr) => {
      if (stopValue.value < 0) return true;
      const newStops = [{ label: "Any", value: -1 }];
      forEach(get(offer, "itineraries", []), (itinerary, index, arr2) => {
        const stop = {
          label: getStops(get(itinerary, "segments", []).length - 1),
          value: get(itinerary, "segments", []).length - 1,
        };
        newStops.push(stop);
      });
      //  console.log("newStops", newStops);
      return Boolean(find(newStops, (stop) => stop.value === stopValue.value));
    });
    console.timeEnd("filterTime");

    res.status(200).json(newOffers2);
  } catch (error) {
    // res.status(400).json(error);
    console.log("error", error);
    res.status(200).json([]);
  }
}
