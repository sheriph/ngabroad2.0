import { Button } from "@mui/material";
import { useRecoilState } from "recoil";
import { countState_ } from "../lib/recoil";

export default function Form() {
  const [count, setCount] = useRecoilState(countState_);
  console.log("count", count);
  return <Button onClick={() => setCount(count + 1)}>Count {count}</Button>;
}
