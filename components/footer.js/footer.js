import { Box, Stack } from "@mui/material";
import Image from "next/image";

export default function Footer() {
  return (
    <Stack>
      <Box>
        <Image
          src="/images/base/footerdesktop1080.jpeg"
          alt="desktop footer"
          width="100%"
          height="80%"
        />
      </Box>
    </Stack>
  );
}
