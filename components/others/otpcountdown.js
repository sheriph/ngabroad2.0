import { Box, Stack, Typography } from "@mui/material";
import Countdown from "react-countdown";
import React from "react";

export default function OtpCountdown({
  countdownKey,
  setDisableCodeResend,
  disableCodeResend,
}) {
  const renderer = ({ hours, minutes, seconds, completed }) => {
    return (
      <Typography component="span">
        {disableCodeResend && !completed
          ? `Resend Code in ${seconds}`
          : "Resend Now"}
      </Typography>
    );
  };

  return (
    <Box component="span">
      {/* 
    // @ts-ignore */}
      <Countdown
        zeroPadTime={2}
        key={countdownKey}
        date={Date.now() + 30000}
        renderer={renderer}
        onComplete={() => setDisableCodeResend(false)}
      />
    </Box>
  );
}
