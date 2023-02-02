import { Backdrop } from "@mui/material";
import React from "react";
import { BounceLoader } from "react-spinners";
import { styled, alpha } from "@mui/material/styles";
import Image from "next/image";

export default function BlockingLoading({ isAnimating }) {
  return (
    <Backdrop
      sx={{
        // color: "#fff",
        zIndex: (t) => t.zIndex.drawer + 100,
        backgroundColor: (t) => alpha(t.palette.common.black, 0.5),
        // opacity: 0.8,
      }}
      open={isAnimating}
    >
      {/* <BounceLoader color="#5348dc" /> */}
      <Image
        alt="loading"
        src="/images/base/ngaloading2.gif"
        width={160}
        height={120}
      />
    </Backdrop>
  );
}
