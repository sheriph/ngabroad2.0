import { Backdrop } from "@mui/material";
import React from "react";
import { BounceLoader } from "react-spinners";

export default function BlockingLoading({ isAnimating }) {
  return (
    <Backdrop
      sx={{
        // color: "#fff",
        zIndex: 100000000000,
        backgroundColor: "transparent",
        opacity: 1,
      }}
      open={isAnimating}
    >
      <BounceLoader color="#5348dc" />
    </Backdrop>
  );
}
