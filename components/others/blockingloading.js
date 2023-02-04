import { Backdrop } from "@mui/material";
import React from "react";
import { BounceLoader, HashLoader } from "react-spinners";
import { styled, alpha } from "@mui/material/styles";
import Image from "next/image";

export default function BlockingLoading({ isAnimating }) {
  return (
    <Backdrop
      sx={{
        // color: "#fff",
        zIndex: 10000,
        backgroundColor: (t) => alpha(t.palette.common.black, 0.3),
        // opacity: 0.8,
      }}
      open={isAnimating}
    >
      <HashLoader color="#5348dc" loading size={70} speedMultiplier={1} />
    </Backdrop>
  );
}
