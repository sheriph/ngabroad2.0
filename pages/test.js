import { Button } from "@mui/material";
import axios from "axios";
import React from "react";

export default function Test() {
  const getPostPathsNow = async () => {
    try {
      const path = await axios.get("/api/getpaths");
      console.log("path", path.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return <Button onClick={getPostPathsNow}>TEST</Button>;
}


