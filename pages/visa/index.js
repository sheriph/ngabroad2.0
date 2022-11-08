import { Stack } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";

const VisaPassengerForm = dynamic(
  () => import("../../components/visa/visapassengerform"),
  {
    ssr: false,
  }
);

export default function CompleteVisa() {
  return (
    <Stack>
      {/* 
    // @ts-ignore */}
      <VisaPassengerForm />
    </Stack>
  );
}
