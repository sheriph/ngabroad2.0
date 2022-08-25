import { LinearProgress, Stack } from "@mui/material";
import React from "react";
import { useRecoilValue } from "recoil";
import { isLoading_ } from "../../lib/recoil";

export default function Loading() {
  const loading = useRecoilValue(isLoading_);

  return (
    <React.Fragment>
      {loading ? (
        <Stack
          sx={{
            width: "100%",
            position: "sticky",
            zIndex: 100000000000,
            top: 0,
          }}
        >
          <LinearProgress color="primary" />
        </Stack>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}
