import { Stack } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";

const PassengerForm = dynamic(
  () => import("../../components/flight/passengerform"),
  {
    ssr: false,
  }
);

export default function CompleteBooking() {
  return (
    <Stack>
      {/* 
    // @ts-ignore */}
      <PassengerForm />
    </Stack>
  );
}
