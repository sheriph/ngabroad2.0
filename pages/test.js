import { Button } from "@mui/material";
import axios from "axios";
import React from "react";

export default function Test() {
  const processWp = async () => {
    try {
      const posts = await axios.get("/api/processwp");
      console.log("posts", posts.data);
    } catch (error) {
      console.log(error.response.data, error);
    }
  };
  return <Button onClick={processWp}>TEST</Button>;
}
