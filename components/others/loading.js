import { Container, LinearProgress } from "@mui/material";
import { useNProgress } from "@tanem/react-nprogress";
import React from "react";

export default function Loading({ isAnimating }) {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  const [buffer, setBuffer] = React.useState(10);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      setBuffer(progress * 100 + Math.random() * 10);
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    !isAnimating && clearInterval(timer);
  }, [isAnimating]);

  return (
    <Container
      sx={{
        width: "100%",
        position: "sticky",
        zIndex: 100000000000,
        top: 0,
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
        pointerEvents: "none",
      }}
      disableGutters={true}
    >
      <LinearProgress
        color="success"
        value={progress * 100}
        variant="buffer"
        valueBuffer={buffer}
        sx={{ transitionDuration: `${animationDuration}ms` }}
      />
    </Container>
  );
}
