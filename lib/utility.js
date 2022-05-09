import useSWR from "swr";
import ReactLoading from "react-loading";
import { useRecoilState } from "recoil";
import { isLoading_ } from "./recoil";
import { Backdrop } from "@mui/material";
import { Auth } from "aws-amplify";

export const useUser = () => {
  const userFetcher = async (second) => {
    console.log("geting authed user");
    try {
      const user = await Auth.currentAuthenticatedUser({
        bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      });
      console.log("user", user);
      return user;
    } catch (error) {
      console.log("error", error);
      throw new Error(error);
    }
  };
  const { data, mutate, error } = useSWR("api/autheduser", userFetcher);

  const loading = !data && !error;

  return {
    loading,
    user: data,
    mutate,
  };
};

export const Wait = () => {
  const [isLoading, setLoading] = useRecoilState(isLoading_);
  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1000 }}
      open={isLoading}
      invisible
    >
      {/* 
    // @ts-ignore */}
      <ReactLoading type="bars" color="#5348dc" height={80} width={80} />
    </Backdrop>
  );
};
