import { getCookie } from "cookies-next";

export default async function handler(req, res) {
  console.log("check cookie");
  try {
    console.log("token", getCookie("accessToken", { req, res }));

    res.status(200).json(true);
  } catch (error) {
    console.log("error", error.response.data);
    res.status(400).json(error.response.data);
  }
}
