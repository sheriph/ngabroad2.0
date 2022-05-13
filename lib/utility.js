import useSWR from "swr";
import ReactLoading from "react-loading";
import { useRecoilState } from "recoil";
import { isLoading_ } from "./recoil";
import { Backdrop } from "@mui/material";
import { Auth, Storage } from "aws-amplify";
import axios from "axios";

export const useUser = () => {
  const userFetcher = async (second) => {
    console.log("geting authed user");
    try {
      const auth = await Auth.currentAuthenticatedUser({
        bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      });
      console.log("auth", auth);
      const email = auth.attributes.email;
      const user = await axios.post("/api/getuserdata", { email });
      console.log("user", user.data);
      return user.data;
    } catch (error) {
      console.log("error", error.response.status, error.response.data);
      throw new Error(error);
    }
  };
  const { data, mutate, error } = useSWR("api/autheduser", userFetcher, {
    errorRetryCount: 3,
  });

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

export const getAwsUrl = async (file) => {
  try {
    const upload = await Storage.put(`${file.name}`, file, {
      /*  progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
      }, */
    });
    console.log(`object`, upload);
    // @ts-ignore
    return `https://ngav21e78a8b3cc4f543578f719d56dc031e1c170205-dev.s3.eu-west-2.amazonaws.com/public/${upload.key}`.replaceAll(
      " ",
      "+"
    );
  } catch (error) {
    console.log("Error uploading file: ", error);
    throw new Error(error.message);
  }
};
