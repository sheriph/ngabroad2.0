import { Stack } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";

const FindMyOrder = dynamic(() => import("../../components/visa/findmyorder"), {
  ssr: false,
});

export default function CompleteVisa() {
  return (
    <Stack>
      {/* 
    // @ts-ignore */}
      <FindMyOrder />
    </Stack>
  );
}
