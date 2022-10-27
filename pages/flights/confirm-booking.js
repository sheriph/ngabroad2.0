import { Stack } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";

const FindBooking = dynamic(
  () => import("../../components/flight/findbooking"),
  {
    ssr: false,
  }
);

export default function ConfirmBooking() {
  return (
    <Stack>
      {/* 
    // @ts-ignore */}
      <FindBooking />
    </Stack>
  );
}
