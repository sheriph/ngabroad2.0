import useSWR from "swr";
import ReactLoading from "react-loading";
import { useRecoilState } from "recoil";
import { host_, isLoading_ } from "./recoil";
import useSWRImmutable from "swr/immutable";
import {
  Backdrop,
  Slide,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import { Auth, Storage } from "aws-amplify";
import axios from "axios";
import React from "react";
import { styled } from "@mui/styles";
import { get } from "lodash";
const { removeStopwords } = require("stopword");

export const useUser = () => {
  const userFetcher = async () => {
    try {
      console.log("geting authed user");
      const auth = await Auth.currentAuthenticatedUser();
      console.log("auth", auth);
      const email = auth.attributes.email;
      const user = await axios.post("/api/getuserdata", { email });
      console.log("user", user.data);
      return user.data;
    } catch (error) {
      console.log("error", error);
      throw new Error(error);
    }
  };

  const { data, mutate, error } = useSWR("api/autheduser", userFetcher, {
    // errorRetryCount: 3,
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
    console.log(`object`, upload, upload.key);
    // @ts-ignore
    return `https://ngabucket194956-ngaenv.s3.us-west-2.amazonaws.com/public/${upload.key}`.replaceAll(
      " ",
      "+"
    );
  } catch (error) {
    console.log("Error uploading file: ", error);
    throw new Error(error.message);
  }
};

export const removeAwsUrl = async (url) => {
  const key = url.split("/public/")[1];
  try {
    const remove = await Storage.remove(key);
    console.log(`remove`, remove);
    return remove;
  } catch (error) {
    console.log("Error removing file: ", error);
    throw new Error(error.message);
  }
};

export const countries = [
  {
    name: "Afghanistan",
    code: "AF",
    timezone: "Afghanistan Standard Time",
    utc: "UTC+04:30",
    mobileCode: "+93",
  },
  {
    name: "Åland Islands",
    code: "AX",
    timezone: "FLE Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+358-18",
  },
  {
    name: "Albania",
    code: "AL",
    timezone: "Central Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+355",
  },
  {
    name: "Algeria",
    code: "DZ",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+213",
  },
  {
    name: "American Samoa",
    code: "AS",
    timezone: "UTC-11",
    utc: "UTC-11:00",
    mobileCode: "+1-684",
  },
  {
    name: "Andorra",
    code: "AD",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+376",
  },
  {
    name: "Angola",
    code: "AO",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+244",
  },
  {
    name: "Anguilla",
    code: "AI",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-264",
  },
  {
    name: "Antigua and Barbuda",
    code: "AG",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-268",
  },
  {
    name: "Argentina",
    code: "AR",
    timezone: "Argentina Standard Time",
    utc: "UTC-03:00",
    mobileCode: "+54",
  },
  {
    name: "Armenia",
    code: "AM",
    timezone: "Caucasus Standard Time",
    utc: "UTC+04:00",
    mobileCode: "+374",
  },
  {
    name: "Aruba",
    code: "AW",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+297",
  },
  {
    name: "Australia",
    code: "AU",
    timezone: "AUS Eastern Standard Time",
    utc: "UTC+10:00",
    mobileCode: "+61",
  },
  {
    name: "Austria",
    code: "AT",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+43",
  },
  {
    name: "Azerbaijan",
    code: "AZ",
    timezone: "Azerbaijan Standard Time",
    utc: "UTC+04:00",
    mobileCode: "+994",
  },
  {
    name: "Bahamas",
    code: "BS",
    timezone: "Eastern Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+1-242",
  },
  {
    name: "Bahrain",
    code: "BH",
    timezone: "Arab Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+973",
  },
  {
    name: "Bangladesh",
    code: "BD",
    timezone: "Bangladesh Standard Time",
    utc: "UTC+06:00",
    mobileCode: "+880",
  },
  {
    name: "Barbados",
    code: "BB",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-246",
  },
  {
    name: "Belarus",
    code: "BY",
    timezone: "Belarus Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+375",
  },
  {
    name: "Belgium",
    code: "BE",
    timezone: "Romance Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+32",
  },
  {
    name: "Belize",
    code: "BZ",
    timezone: "Central America Standard Time",
    utc: "UTC-06:00",
    mobileCode: "+501",
  },
  {
    name: "Benin",
    code: "BJ",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+229",
  },
  {
    name: "Bermuda",
    code: "BM",
    timezone: "Atlantic Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-441",
  },
  {
    name: "Bhutan",
    code: "BT",
    timezone: "Bangladesh Standard Time",
    utc: "UTC+06:00",
    mobileCode: "+975",
  },
  {
    name: "Bolivarian Republic of Venezuela",
    code: "VE",
    timezone: "Venezuela Standard Time",
    utc: "UTC-04:30",
    mobileCode: "+58",
  },
  {
    name: "Bolivia",
    code: "BO",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+591",
  },
  {
    name: "Bosnia and Herzegovina",
    code: "BA",
    timezone: "Central European Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+387",
  },
  {
    name: "Botswana",
    code: "BW",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+267",
  },
  {
    name: "Brazil",
    code: "BR",
    timezone: "E. South America Standard Time",
    utc: "UTC-03:00",
    mobileCode: "+55",
  },
  {
    name: "British Indian Ocean Territory",
    code: "IO",
    timezone: "Central Asia Standard Time",
    utc: "UTC+06:00",
    mobileCode: "+246",
  },
  {
    name: "Brunei",
    code: "BN",
    timezone: "Singapore Standard Time",
    utc: "UTC+08:00",
    mobileCode: "+673",
  },
  {
    name: "Bulgaria",
    code: "BG",
    timezone: "FLE Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+359",
  },
  {
    name: "Burkina Faso",
    code: "BF",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+226",
  },
  {
    name: "Burundi",
    code: "BI",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+257",
  },
  {
    name: "Cabo Verde",
    code: "CV",
    timezone: "Cape Verde Standard Time",
    utc: "UTC-01:00",
    mobileCode: "+238",
  },
  {
    name: "Cambodia",
    code: "KH",
    timezone: "SE Asia Standard Time",
    utc: "UTC+07:00",
    mobileCode: "+855",
  },
  {
    name: "Cameroon",
    code: "CM",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+237",
  },
  {
    name: "Canada",
    code: "CA",
    timezone: "Eastern Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+1",
  },
  {
    name: "Cayman Islands",
    code: "KY",
    timezone: "SA Pacific Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+1-345",
  },
  {
    name: "Central African Republic",
    code: "CF",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+236",
  },
  {
    name: "Chad",
    code: "TD",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+235",
  },
  {
    name: "Chile",
    code: "CL",
    timezone: "Pacific SA Standard Time",
    utc: "UTC-03:00",
    mobileCode: "+56",
  },
  {
    name: "China",
    code: "CN",
    timezone: "China Standard Time",
    utc: "UTC+08:00",
    mobileCode: "+86",
  },

  {
    name: "Colombia",
    code: "CO",
    timezone: "SA Pacific Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+57",
  },
  {
    name: "Comoros",
    code: "KM",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+269",
  },
  {
    name: "Congo",
    code: "CG",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+242",
  },
  {
    name: "Congo (DRC)",
    code: "CD",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+243",
  },
  {
    name: "Cook Islands",
    code: "CK",
    timezone: "Hawaiian Standard Time",
    utc: "UTC-10:00",
    mobileCode: "+682",
  },
  {
    name: "Costa Rica",
    code: "CR",
    timezone: "Central America Standard Time",
    utc: "UTC-06:00",
    mobileCode: "+506",
  },
  {
    name: "Côte d'Ivoire",
    code: "CI",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+225",
  },
  {
    name: "Croatia",
    code: "HR",
    timezone: "Central European Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+385",
  },
  {
    name: "Cuba",
    code: "CU",
    timezone: "Eastern Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+53",
  },
  {
    name: "Cyprus",
    code: "CY",
    timezone: "E. Europe Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+357",
  },
  {
    name: "Czech Republic",
    code: "CZ",
    timezone: "Central Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+420",
  },
  {
    name: "Democratic Republic of Timor-Leste",
    code: "TL",
    timezone: "Tokyo Standard Time",
    utc: "UTC+09:00",
    mobileCode: "+670",
  },
  {
    name: "Denmark",
    code: "DK",
    timezone: "Romance Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+45",
  },
  {
    name: "Djibouti",
    code: "DJ",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+253",
  },
  {
    name: "Dominica",
    code: "DM",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-767",
  },
  {
    name: "Dominican Republic",
    code: "DO",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-809 and 1-829",
  },
  {
    name: "Ecuador",
    code: "EC",
    timezone: "SA Pacific Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+593",
  },
  {
    name: "Egypt",
    code: "EG",
    timezone: "Egypt Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+20",
  },
  {
    name: "El Salvador",
    code: "SV",
    timezone: "Central America Standard Time",
    utc: "UTC-06:00",
    mobileCode: "+503",
  },
  {
    name: "Equatorial Guinea",
    code: "GQ",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+240",
  },
  {
    name: "Eritrea",
    code: "ER",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+291",
  },
  {
    name: "Estonia",
    code: "EE",
    timezone: "FLE Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+372",
  },
  {
    name: "Ethiopia",
    code: "ET",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+251",
  },
  {
    name: "Falkland Islands (Islas Malvinas)",
    code: "FK",
    timezone: "SA Eastern Standard Time",
    utc: "UTC-03:00",
    mobileCode: "+500",
  },
  {
    name: "Faroe Islands",
    code: "FO",
    timezone: "GMT Standard Time",
    utc: "UTC",
    mobileCode: "+298",
  },
  {
    name: "Fiji Islands",
    code: "FJ",
    timezone: "Fiji Standard Time",
    utc: "UTC+12:00",
    mobileCode: "+679",
  },
  {
    name: "Finland",
    code: "FI",
    timezone: "FLE Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+358",
  },
  {
    name: "France",
    code: "FR",
    timezone: "Romance Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+33",
  },
  {
    name: "French Guiana",
    code: "GF",
    timezone: "SA Eastern Standard Time",
    utc: "UTC-03:00",
    mobileCode: "+594",
  },
  {
    name: "French Polynesia",
    code: "PF",
    timezone: "Hawaiian Standard Time",
    utc: "UTC-10:00",
    mobileCode: "+689",
  },

  {
    name: "Gabon",
    code: "GA",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+241",
  },
  {
    name: "Gambia",
    code: "GM",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+220",
  },
  {
    name: "Georgia",
    code: "GE",
    timezone: "Georgian Standard Time",
    utc: "UTC+04:00",
    mobileCode: "+995",
  },
  {
    name: "Germany",
    code: "DE",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+49",
  },
  {
    name: "Ghana",
    code: "GH",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+233",
  },
  {
    name: "Gibraltar",
    code: "GI",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+350",
  },
  {
    name: "Greece",
    code: "GR",
    timezone: "GTB Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+30",
  },
  {
    name: "Greenland",
    code: "GL",
    timezone: "Greenland Standard Time",
    utc: "UTC-03:00",
    mobileCode: "+299",
  },
  {
    name: "Grenada",
    code: "GD",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-473",
  },
  {
    name: "Guadeloupe",
    code: "GP",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+590",
  },
  {
    name: "Guam",
    code: "GU",
    timezone: "West Pacific Standard Time",
    utc: "UTC+10:00",
    mobileCode: "+1-671",
  },
  {
    name: "Guatemala",
    code: "GT",
    timezone: "Central America Standard Time",
    utc: "UTC-06:00",
    mobileCode: "+502",
  },
  {
    name: "Guernsey",
    code: "GG",
    timezone: "GMT Standard Time",
    utc: "UTC",
    mobileCode: "+44-1481",
  },
  {
    name: "Guinea",
    code: "GN",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+224",
  },
  {
    name: "Guinea-Bissau",
    code: "GW",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+245",
  },
  {
    name: "Guyana",
    code: "GY",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+592",
  },
  {
    name: "Haiti",
    code: "HT",
    timezone: "Eastern Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+509",
  },
  {
    name: "Heard Island and McDonald Islands",
    code: "HM",
    timezone: "Mauritius Standard Time",
    utc: "UTC+04:00",
    mobileCode: "+ ",
  },
  {
    name: "Honduras",
    code: "HN",
    timezone: "Central America Standard Time",
    utc: "UTC-06:00",
    mobileCode: "+504",
  },
  {
    name: "Hong Kong SAR",
    code: "HK",
    timezone: "China Standard Time",
    utc: "UTC+08:00",
    mobileCode: "+852",
  },
  {
    name: "Hungary",
    code: "HU",
    timezone: "Central Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+36",
  },
  {
    name: "Iceland",
    code: "IS",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+354",
  },
  {
    name: "India",
    code: "IN",
    timezone: "India Standard Time",
    utc: "UTC+05:30",
    mobileCode: "+91",
  },
  {
    name: "Indonesia",
    code: "ID",
    timezone: "SE Asia Standard Time",
    utc: "UTC+07:00",
    mobileCode: "+62",
  },
  {
    name: "Iran",
    code: "IR",
    timezone: "Iran Standard Time",
    utc: "UTC+03:30",
    mobileCode: "+98",
  },
  {
    name: "Iraq",
    code: "IQ",
    timezone: "Arabic Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+964",
  },
  {
    name: "Ireland",
    code: "IE",
    timezone: "GMT Standard Time",
    utc: "UTC",
    mobileCode: "+353",
  },
  {
    name: "Israel",
    code: "IL",
    timezone: "Israel Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+972",
  },
  {
    name: "Italy",
    code: "IT",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+39",
  },
  {
    name: "Jamaica",
    code: "JM",
    timezone: "SA Pacific Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+1-876",
  },
  {
    name: "Japan",
    code: "JP",
    timezone: "Tokyo Standard Time",
    utc: "UTC+09:00",
    mobileCode: "+81",
  },
  {
    name: "Jersey",
    code: "JE",
    timezone: "GMT Standard Time",
    utc: "UTC",
    mobileCode: "+44-1534",
  },
  {
    name: "Jordan",
    code: "JO",
    timezone: "Jordan Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+962",
  },
  {
    name: "Kenya",
    code: "KE",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+254",
  },
  {
    name: "Kiribati",
    code: "KI",
    timezone: "UTC+12",
    utc: "UTC+12:00",
    mobileCode: "+686",
  },
  {
    name: "Korea",
    code: "KR",
    timezone: "Korea Standard Time",
    utc: "UTC+09:00",
    mobileCode: "+82",
  },

  {
    name: "Kuwait",
    code: "KW",
    timezone: "Arab Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+965",
  },
  {
    name: "Kyrgyzstan",
    code: "KG",
    timezone: "Central Asia Standard Time",
    utc: "UTC+06:00",
    mobileCode: "+996",
  },
  {
    name: "Laos",
    code: "LA",
    timezone: "SE Asia Standard Time",
    utc: "UTC+07:00",
    mobileCode: "+856",
  },
  {
    name: "Latvia",
    code: "LV",
    timezone: "FLE Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+371",
  },
  {
    name: "Lebanon",
    code: "LB",
    timezone: "Middle East Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+961",
  },
  {
    name: "Lesotho",
    code: "LS",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+266",
  },
  {
    name: "Liberia",
    code: "LR",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+231",
  },
  {
    name: "Libya",
    code: "LY",
    timezone: "E. Europe Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+218",
  },
  {
    name: "Liechtenstein",
    code: "LI",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+423",
  },
  {
    name: "Lithuania",
    code: "LT",
    timezone: "FLE Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+370",
  },
  {
    name: "Luxembourg",
    code: "LU",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+352",
  },
  {
    name: "Macao SAR",
    code: "MO",
    timezone: "China Standard Time",
    utc: "UTC+08:00",
    mobileCode: "+853",
  },
  {
    name: "Macedonia",
    code: "MK",
    timezone: "Central European Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+389",
  },
  {
    name: "Madagascar",
    code: "MG",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+261",
  },
  {
    name: "Malawi",
    code: "MW",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+265",
  },
  {
    name: "Malaysia",
    code: "MY",
    timezone: "Singapore Standard Time",
    utc: "UTC+08:00",
    mobileCode: "+60",
  },
  {
    name: "Maldives",
    code: "MV",
    timezone: "West Asia Standard Time",
    utc: "UTC+05:00",
    mobileCode: "+960",
  },
  {
    name: "Mali",
    code: "ML",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+223",
  },
  {
    name: "Malta",
    code: "MT",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+356",
  },
  {
    name: "Marshall Islands",
    code: "MH",
    timezone: "UTC+12",
    utc: "UTC+12:00",
    mobileCode: "+692",
  },
  {
    name: "Martinique",
    code: "MQ",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+596",
  },
  {
    name: "Mauritania",
    code: "MR",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+222",
  },
  {
    name: "Mauritius",
    code: "MU",
    timezone: "Mauritius Standard Time",
    utc: "UTC+04:00",
    mobileCode: "+230",
  },
  {
    name: "Mexico",
    code: "MX",
    timezone: "Central Standard Time (Mexico)",
    utc: "UTC-06:00",
    mobileCode: "+52",
  },
  {
    name: "Micronesia",
    code: "FM",
    timezone: "West Pacific Standard Time",
    utc: "UTC+10:00",
    mobileCode: "+691",
  },
  {
    name: "Moldova",
    code: "MD",
    timezone: "GTB Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+373",
  },
  {
    name: "Monaco",
    code: "MC",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+377",
  },
  {
    name: "Mongolia",
    code: "MN",
    timezone: "Ulaanbaatar Standard Time",
    utc: "UTC+08:00",
    mobileCode: "+976",
  },
  {
    name: "Montenegro",
    code: "ME",
    timezone: "Central European Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+382",
  },
  {
    name: "Montserrat",
    code: "MS",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-664",
  },
  {
    name: "Morocco",
    code: "MA",
    timezone: "Morocco Standard Time",
    utc: "UTC",
    mobileCode: "+212",
  },
  {
    name: "Mozambique",
    code: "MZ",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+258",
  },
  {
    name: "Myanmar",
    code: "MM",
    timezone: "Myanmar Standard Time",
    utc: "UTC+06:30",
    mobileCode: "+95",
  },
  {
    name: "Namibia",
    code: "NA",
    timezone: "Namibia Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+264",
  },
  {
    name: "Nauru",
    code: "NR",
    timezone: "UTC+12",
    utc: "UTC+12:00",
    mobileCode: "+674",
  },
  {
    name: "Nepal",
    code: "NP",
    timezone: "Nepal Standard Time",
    utc: "UTC+05:45",
    mobileCode: "+977",
  },
  {
    name: "Netherlands",
    code: "NL",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+31",
  },
  {
    name: "New Caledonia",
    code: "NC",
    timezone: "Central Pacific Standard Time",
    utc: "UTC+11:00",
    mobileCode: "+687",
  },
  {
    name: "New Zealand",
    code: "NZ",
    timezone: "New Zealand Standard Time",
    utc: "UTC+12:00",
    mobileCode: "+64",
  },
  {
    name: "Nicaragua",
    code: "NI",
    timezone: "Central America Standard Time",
    utc: "UTC-06:00",
    mobileCode: "+505",
  },
  {
    name: "Niger",
    code: "NE",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+227",
  },
  {
    name: "Nigeria",
    code: "NG",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+234",
  },
  {
    name: "Niue",
    code: "NU",
    timezone: "UTC-11",
    utc: "UTC-11:00",
    mobileCode: "+683",
  },
  {
    name: "Norfolk Island",
    code: "NF",
    timezone: "Central Pacific Standard Time",
    utc: "UTC+11:00",
    mobileCode: "+672",
  },
  {
    name: "North Korea",
    code: "KP",
    timezone: "Korea Standard Time",
    utc: "UTC+09:00",
    mobileCode: "+850",
  },
  {
    name: "Northern Mariana Islands",
    code: "MP",
    timezone: "West Pacific Standard Time",
    utc: "UTC+10:00",
    mobileCode: "+1-670",
  },
  {
    name: "Norway",
    code: "NO",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+47",
  },
  {
    name: "Oman",
    code: "OM",
    timezone: "Arabian Standard Time",
    utc: "UTC+04:00",
    mobileCode: "+968",
  },
  {
    name: "Pakistan",
    code: "PK",
    timezone: "Pakistan Standard Time",
    utc: "UTC+05:00",
    mobileCode: "+92",
  },
  {
    name: "Palau",
    code: "PW",
    timezone: "Tokyo Standard Time",
    utc: "UTC+09:00",
    mobileCode: "+680",
  },
  {
    name: "Palestinian Authority",
    code: "PS",
    timezone: "Egypt Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+970",
  },
  {
    name: "Panama",
    code: "PA",
    timezone: "SA Pacific Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+507",
  },
  {
    name: "Papua New Guinea",
    code: "PG",
    timezone: "West Pacific Standard Time",
    utc: "UTC+10:00",
    mobileCode: "+675",
  },
  {
    name: "Paraguay",
    code: "PY",
    timezone: "Paraguay Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+595",
  },
  {
    name: "Peru",
    code: "PE",
    timezone: "SA Pacific Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+51",
  },
  {
    name: "Philippines",
    code: "PH",
    timezone: "Singapore Standard Time",
    utc: "UTC+08:00",
    mobileCode: "+63",
  },
  {
    name: "Pitcairn Islands",
    code: "PN",
    timezone: "Pacific Standard Time",
    utc: "UTC-08:00",
    mobileCode: "+870",
  },
  {
    name: "Poland",
    code: "PL",
    timezone: "Central European Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+48",
  },
  {
    name: "Portugal",
    code: "PT",
    timezone: "GMT Standard Time",
    utc: "UTC",
    mobileCode: "+351",
  },
  {
    name: "Puerto Rico",
    code: "PR",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-787 and 1-939",
  },
  {
    name: "Qatar",
    code: "QA",
    timezone: "Arab Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+974",
  },
  {
    name: "Romania",
    code: "RO",
    timezone: "GTB Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+40",
  },
  {
    name: "Russia",
    code: "RU",
    timezone: "Russian Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+7",
  },
  {
    name: "Rwanda",
    code: "RW",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+250",
  },
  {
    name: "Saint Barthélemy",
    code: "BL",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+590",
  },
  {
    name: "Saint Kitts and Nevis",
    code: "KN",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-869",
  },
  {
    name: "Saint Lucia",
    code: "LC",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-758",
  },
  {
    name: "Saint Martin (French part)",
    code: "MF",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+590",
  },
  {
    name: "Saint Pierre and Miquelon",
    code: "PM",
    timezone: "Greenland Standard Time",
    utc: "UTC-03:00",
    mobileCode: "+508",
  },
  {
    name: "Saint Vincent and the Grenadines",
    code: "VC",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-784",
  },
  {
    name: "Samoa",
    code: "WS",
    timezone: "Samoa Standard Time",
    utc: "UTC+13:00",
    mobileCode: "+685",
  },
  {
    name: "San Marino",
    code: "SM",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+378",
  },
  {
    name: "São Tomé and Príncipe",
    code: "ST",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+239",
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    timezone: "Arab Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+966",
  },
  {
    name: "Senegal",
    code: "SN",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+221",
  },
  {
    name: "Serbia",
    code: "RS",
    timezone: "Central Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+381",
  },
  {
    name: "Seychelles",
    code: "SC",
    timezone: "Mauritius Standard Time",
    utc: "UTC+04:00",
    mobileCode: "+248",
  },
  {
    name: "Sierra Leone",
    code: "SL",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+232",
  },
  {
    name: "Singapore",
    code: "SG",
    timezone: "Singapore Standard Time",
    utc: "UTC+08:00",
    mobileCode: "+65",
  },
  {
    name: "Slovakia",
    code: "SK",
    timezone: "Central Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+421",
  },
  {
    name: "Slovenia",
    code: "SI",
    timezone: "Central Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+386",
  },
  {
    name: "Solomon Islands",
    code: "SB",
    timezone: "Central Pacific Standard Time",
    utc: "UTC+11:00",
    mobileCode: "+677",
  },
  {
    name: "Somalia",
    code: "SO",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+252",
  },
  {
    name: "South Africa",
    code: "ZA",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+27",
  },
  {
    name: "South Sudan",
    code: "SS",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+211",
  },
  {
    name: "Spain",
    code: "ES",
    timezone: "Romance Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+34",
  },
  {
    name: "Sri Lanka",
    code: "LK",
    timezone: "Sri Lanka Standard Time",
    utc: "UTC+05:30",
    mobileCode: "+94",
  },
  {
    name: "Sudan",
    code: "SD",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+249",
  },
  {
    name: "Suriname",
    code: "SR",
    timezone: "SA Eastern Standard Time",
    utc: "UTC-03:00",
    mobileCode: "+597",
  },
  {
    name: "Swaziland",
    code: "SZ",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+268",
  },
  {
    name: "Sweden",
    code: "SE",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+46",
  },
  {
    name: "Switzerland",
    code: "CH",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+41",
  },
  {
    name: "Syria",
    code: "SY",
    timezone: "Syria Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+963",
  },
  {
    name: "Taiwan",
    code: "TW",
    timezone: "Taipei Standard Time",
    utc: "UTC+08:00",
    mobileCode: "+886",
  },
  {
    name: "Tajikistan",
    code: "TJ",
    timezone: "West Asia Standard Time",
    utc: "UTC+05:00",
    mobileCode: "+992",
  },
  {
    name: "Tanzania",
    code: "TZ",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+255",
  },
  {
    name: "Thailand",
    code: "TH",
    timezone: "SE Asia Standard Time",
    utc: "UTC+07:00",
    mobileCode: "+66",
  },
  {
    name: "Togo",
    code: "TG",
    timezone: "Greenwich Standard Time",
    utc: "UTC",
    mobileCode: "+228",
  },
  {
    name: "Tokelau",
    code: "TK",
    timezone: "Tonga Standard Time",
    utc: "UTC+13:00",
    mobileCode: "+690",
  },
  {
    name: "Tonga",
    code: "TO",
    timezone: "Tonga Standard Time",
    utc: "UTC+13:00",
    mobileCode: "+676",
  },
  {
    name: "Trinidad and Tobago",
    code: "TT",
    timezone: "SA Western Standard Time",
    utc: "UTC-04:00",
    mobileCode: "+1-868",
  },
  {
    name: "Tunisia",
    code: "TN",
    timezone: "W. Central Africa Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+216",
  },
  {
    name: "Turkey",
    code: "TR",
    timezone: "Turkey Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+90",
  },
  {
    name: "Turkmenistan",
    code: "TM",
    timezone: "West Asia Standard Time",
    utc: "UTC+05:00",
    mobileCode: "+993",
  },
  {
    name: "Turks and Caicos Islands",
    code: "TC",
    timezone: "Eastern Standard Time",
    utc: "UTC-05:00",
    mobileCode: "+1-649",
  },
  {
    name: "Tuvalu",
    code: "TV",
    timezone: "UTC+12",
    utc: "UTC+12:00",
    mobileCode: "+688",
  },
  {
    name: "U.S. Minor Outlying Islands",
    code: "UM",
    timezone: "UTC-11",
    utc: "UTC-11:00",
    mobileCode: "+1",
  },
  {
    name: "Uganda",
    code: "UG",
    timezone: "E. Africa Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+256",
  },
  {
    name: "Ukraine",
    code: "UA",
    timezone: "FLE Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+380",
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    timezone: "Arabian Standard Time",
    utc: "UTC+04:00",
    mobileCode: "+971",
  },
  {
    name: "United Kingdom",
    code: "GB",
    timezone: "GMT Standard Time",
    utc: "UTC",
    mobileCode: "+44",
  },
  {
    name: "United States",
    code: "US",
    timezone: "Pacific Standard Time",
    utc: "UTC-08:00",
    mobileCode: "+1",
  },
  {
    name: "Uruguay",
    code: "UY",
    timezone: "Montevideo Standard Time",
    utc: "UTC-03:00",
    mobileCode: "+598",
  },
  {
    name: "Uzbekistan",
    code: "UZ",
    timezone: "West Asia Standard Time",
    utc: "UTC+05:00",
    mobileCode: "+998",
  },
  {
    name: "Vanuatu",
    code: "VU",
    timezone: "Central Pacific Standard Time",
    utc: "UTC+11:00",
    mobileCode: "+678",
  },
  {
    name: "Vatican City",
    code: "VA",
    timezone: "W. Europe Standard Time",
    utc: "UTC+01:00",
    mobileCode: "+379",
  },
  {
    name: "Vietnam",
    code: "VN",
    timezone: "SE Asia Standard Time",
    utc: "UTC+07:00",
    mobileCode: "+84",
  },
  {
    name: "Wallis and Futuna",
    code: "WF",
    timezone: "UTC+12",
    utc: "UTC+12:00",
    mobileCode: "+681",
  },
  {
    name: "Yemen",
    code: "YE",
    timezone: "Arab Standard Time",
    utc: "UTC+03:00",
    mobileCode: "+967",
  },
  {
    name: "Zambia",
    code: "ZM",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+260",
  },
  {
    name: "Zimbabwe",
    code: "ZW",
    timezone: "South Africa Standard Time",
    utc: "UTC+02:00",
    mobileCode: "+263",
  },
];

export const countryCode = [
  { country: "Afghanistan", code: "93", iso: "AF" },
  { country: "Albania", code: "355", iso: "AL" },
  { country: "Algeria", code: "213", iso: "DZ" },
  { country: "American Samoa", code: "1-684", iso: "AS" },
  { country: "Andorra", code: "376", iso: "AD" },
  { country: "Angola", code: "244", iso: "AO" },
  { country: "Anguilla", code: "1-264", iso: "AI" },
  { country: "Antarctica", code: "672", iso: "AQ" },
  { country: "Antigua and Barbuda", code: "1-268", iso: "AG" },
  { country: "Argentina", code: "54", iso: "AR" },
  { country: "Armenia", code: "374", iso: "AM" },
  { country: "Aruba", code: "297", iso: "AW" },
  { country: "Australia", code: "61", iso: "AU" },
  { country: "Austria", code: "43", iso: "AT" },
  { country: "Azerbaijan", code: "994", iso: "AZ" },
  { country: "Bahamas", code: "1-242", iso: "BS" },
  { country: "Bahrain", code: "973", iso: "BH" },
  { country: "Bangladesh", code: "880", iso: "BD" },
  { country: "Barbados", code: "1-246", iso: "BB" },
  { country: "Belarus", code: "375", iso: "BY" },
  { country: "Belgium", code: "32", iso: "BE" },
  { country: "Belize", code: "501", iso: "BZ" },
  { country: "Benin", code: "229", iso: "BJ" },
  { country: "Bermuda", code: "1-441", iso: "BM" },
  { country: "Bhutan", code: "975", iso: "BT" },
  { country: "Bolivia", code: "591", iso: "BO" },
  { country: "Bosnia and Herzegovina", code: "387", iso: "BA" },
  { country: "Botswana", code: "267", iso: "BW" },
  { country: "Brazil", code: "55", iso: "BR" },
  { country: "British Indian Ocean Territory", code: "246", iso: "IO" },
  { country: "British Virgin Islands", code: "1-284", iso: "VG" },
  { country: "Brunei", code: "673", iso: "BN" },
  { country: "Bulgaria", code: "359", iso: "BG" },
  { country: "Burkina Faso", code: "226", iso: "BF" },
  { country: "Burundi", code: "257", iso: "BI" },
  { country: "Cambodia", code: "855", iso: "KH" },
  { country: "Cameroon", code: "237", iso: "CM" },
  { country: "Canada", code: "1", iso: "CA" },
  { country: "Cape Verde", code: "238", iso: "CV" },
  { country: "Cayman Islands", code: "1-345", iso: "KY" },
  { country: "Central African Republic", code: "236", iso: "CF" },
  { country: "Chad", code: "235", iso: "TD" },
  { country: "Chile", code: "56", iso: "CL" },
  { country: "China", code: "86", iso: "CN" },
  { country: "Colombia", code: "57", iso: "CO" },
  { country: "Comoros", code: "269", iso: "KM" },
  { country: "Cook Islands", code: "682", iso: "CK" },
  { country: "Costa Rica", code: "506", iso: "CR" },
  { country: "Croatia", code: "385", iso: "HR" },
  { country: "Cuba", code: "53", iso: "CU" },
  { country: "Curacao", code: "599", iso: "CW" },
  { country: "Cyprus", code: "357", iso: "CY" },
  { country: "Czech Republic", code: "420", iso: "CZ" },
  { country: "Democratic Republic of the Congo", code: "243", iso: "CD" },
  { country: "Denmark", code: "45", iso: "DK" },
  { country: "Djibouti", code: "253", iso: "DJ" },
  { country: "Dominica", code: "1-767", iso: "DM" },
  { country: "Dominican Republic", code: "1-809, 1-829, 1-849", iso: "DO" },
  { country: "East Timor", code: "670", iso: "TL" },
  { country: "Ecuador", code: "593", iso: "EC" },
  { country: "Egypt", code: "20", iso: "EG" },
  { country: "El Salvador", code: "503", iso: "SV" },
  { country: "Equatorial Guinea", code: "240", iso: "GQ" },
  { country: "Eritrea", code: "291", iso: "ER" },
  { country: "Estonia", code: "372", iso: "EE" },
  { country: "Ethiopia", code: "251", iso: "ET" },
  { country: "Falkland Islands", code: "500", iso: "FK" },
  { country: "Faroe Islands", code: "298", iso: "FO" },
  { country: "Fiji", code: "679", iso: "FJ" },
  { country: "Finland", code: "358", iso: "FI" },
  { country: "France", code: "33", iso: "FR" },
  { country: "French Polynesia", code: "689", iso: "PF" },
  { country: "Gabon", code: "241", iso: "GA" },
  { country: "Gambia", code: "220", iso: "GM" },
  { country: "Georgia", code: "995", iso: "GE" },
  { country: "Germany", code: "49", iso: "DE" },
  { country: "Ghana", code: "233", iso: "GH" },
  { country: "Gibraltar", code: "350", iso: "GI" },
  { country: "Greece", code: "30", iso: "GR" },
  { country: "Greenland", code: "299", iso: "GL" },
  { country: "Grenada", code: "1-473", iso: "GD" },
  { country: "Guam", code: "1-671", iso: "GU" },
  { country: "Guatemala", code: "502", iso: "GT" },
  { country: "Guernsey", code: "44-1481", iso: "GG" },
  { country: "Guinea", code: "224", iso: "GN" },
  { country: "Guinea-Bissau", code: "245", iso: "GW" },
  { country: "Guyana", code: "592", iso: "GY" },
  { country: "Haiti", code: "509", iso: "HT" },
  { country: "Honduras", code: "504", iso: "HN" },
  { country: "Hong Kong", code: "852", iso: "HK" },
  { country: "Hungary", code: "36", iso: "HU" },
  { country: "Iceland", code: "354", iso: "IS" },
  { country: "India", code: "91", iso: "IN" },
  { country: "Indonesia", code: "62", iso: "ID" },
  { country: "Iran", code: "98", iso: "IR" },
  { country: "Iraq", code: "964", iso: "IQ" },
  { country: "Ireland", code: "353", iso: "IE" },
  { country: "Isle of Man", code: "44-1624", iso: "IM" },
  { country: "Israel", code: "972", iso: "IL" },
  { country: "Italy", code: "39", iso: "IT" },
  { country: "Ivory Coast", code: "225", iso: "CI" },
  { country: "Jamaica", code: "1-876", iso: "JM" },
  { country: "Japan", code: "81", iso: "JP" },
  { country: "Jersey", code: "44-1534", iso: "JE" },
  { country: "Jordan", code: "962", iso: "JO" },
  { country: "Kazakhstan", code: "7", iso: "KZ" },
  { country: "Kenya", code: "254", iso: "KE" },
  { country: "Kiribati", code: "686", iso: "KI" },
  { country: "Kosovo", code: "383", iso: "XK" },
  { country: "Kuwait", code: "965", iso: "KW" },
  { country: "Kyrgyzstan", code: "996", iso: "KG" },
  { country: "Laos", code: "856", iso: "LA" },
  { country: "Latvia", code: "371", iso: "LV" },
  { country: "Lebanon", code: "961", iso: "LB" },
  { country: "Lesotho", code: "266", iso: "LS" },
  { country: "Liberia", code: "231", iso: "LR" },
  { country: "Libya", code: "218", iso: "LY" },
  { country: "Liechtenstein", code: "423", iso: "LI" },
  { country: "Lithuania", code: "370", iso: "LT" },
  { country: "Luxembourg", code: "352", iso: "LU" },
  { country: "Macao", code: "853", iso: "MO" },
  { country: "Macedonia", code: "389", iso: "MK" },
  { country: "Madagascar", code: "261", iso: "MG" },
  { country: "Malawi", code: "265", iso: "MW" },
  { country: "Malaysia", code: "60", iso: "MY" },
  { country: "Maldives", code: "960", iso: "MV" },
  { country: "Mali", code: "223", iso: "ML" },
  { country: "Malta", code: "356", iso: "MT" },
  { country: "Marshall Islands", code: "692", iso: "MH" },
  { country: "Mauritania", code: "222", iso: "MR" },
  { country: "Mauritius", code: "230", iso: "MU" },
  { country: "Mayotte", code: "262", iso: "YT" },
  { country: "Mexico", code: "52", iso: "MX" },
  { country: "Micronesia", code: "691", iso: "FM" },
  { country: "Moldova", code: "373", iso: "MD" },
  { country: "Monaco", code: "377", iso: "MC" },
  { country: "Mongolia", code: "976", iso: "MN" },
  { country: "Montenegro", code: "382", iso: "ME" },
  { country: "Montserrat", code: "1-664", iso: "MS" },
  { country: "Morocco", code: "212", iso: "MA" },
  { country: "Mozambique", code: "258", iso: "MZ" },
  { country: "Myanmar", code: "95", iso: "MM" },
  { country: "Namibia", code: "264", iso: "NA" },
  { country: "Nauru", code: "674", iso: "NR" },
  { country: "Nepal", code: "977", iso: "NP" },
  { country: "Netherlands", code: "31", iso: "NL" },
  { country: "Netherlands Antilles", code: "599", iso: "AN" },
  { country: "New Caledonia", code: "687", iso: "NC" },
  { country: "New Zealand", code: "64", iso: "NZ" },
  { country: "Nicaragua", code: "505", iso: "NI" },
  { country: "Niger", code: "227", iso: "NE" },
  { country: "Nigeria", code: "234", iso: "NG" },
  { country: "Niue", code: "683", iso: "NU" },
  { country: "North Korea", code: "850", iso: "KP" },
  { country: "Northern Mariana Islands", code: "1-670", iso: "MP" },
  { country: "Norway", code: "47", iso: "NO" },
  { country: "Oman", code: "968", iso: "OM" },
  { country: "Pakistan", code: "92", iso: "PK" },
  { country: "Palau", code: "680", iso: "PW" },
  { country: "Palestine", code: "970", iso: "PS" },
  { country: "Panama", code: "507", iso: "PA" },
  { country: "Papua New Guinea", code: "675", iso: "PG" },
  { country: "Paraguay", code: "595", iso: "PY" },
  { country: "Peru", code: "51", iso: "PE" },
  { country: "Philippines", code: "63", iso: "PH" },
  { country: "Pitcairn", code: "64", iso: "PN" },
  { country: "Poland", code: "48", iso: "PL" },
  { country: "Portugal", code: "351", iso: "PT" },
  { country: "Puerto Rico", code: "1-787, 1-939", iso: "PR" },
  { country: "Qatar", code: "974", iso: "QA" },
  { country: "Republic of the Congo", code: "242", iso: "CG" },
  { country: "Reunion", code: "262", iso: "RE" },
  { country: "Romania", code: "40", iso: "RO" },
  { country: "Russia", code: "7", iso: "RU" },
  { country: "Rwanda", code: "250", iso: "RW" },
  { country: "Saint Barthelemy", code: "590", iso: "BL" },
  { country: "Saint Helena", code: "290", iso: "SH" },
  { country: "Saint Kitts and Nevis", code: "1-869", iso: "KN" },
  { country: "Saint Lucia", code: "1-758", iso: "LC" },
  { country: "Saint Martin", code: "590", iso: "MF" },
  { country: "Saint Pierre and Miquelon", code: "508", iso: "PM" },
  { country: "Saint Vincent and the Grenadines", code: "1-784", iso: "VC" },
  { country: "Samoa", code: "685", iso: "WS" },
  { country: "San Marino", code: "378", iso: "SM" },
  { country: "Sao Tome and Principe", code: "239", iso: "ST" },
  { country: "Saudi Arabia", code: "966", iso: "SA" },
  { country: "Senegal", code: "221", iso: "SN" },
  { country: "Serbia", code: "381", iso: "RS" },
  { country: "Seychelles", code: "248", iso: "SC" },
  { country: "Sierra Leone", code: "232", iso: "SL" },
  { country: "Singapore", code: "65", iso: "SG" },
  { country: "Sint Maarten", code: "1-721", iso: "SX" },
  { country: "Slovakia", code: "421", iso: "SK" },
  { country: "Slovenia", code: "386", iso: "SI" },
  { country: "Solomon Islands", code: "677", iso: "SB" },
  { country: "Somalia", code: "252", iso: "SO" },
  { country: "South Africa", code: "27", iso: "ZA" },
  { country: "South Korea", code: "82", iso: "KR" },
  { country: "South Sudan", code: "211", iso: "SS" },
  { country: "Spain", code: "34", iso: "ES" },
  { country: "Sri Lanka", code: "94", iso: "LK" },
  { country: "Sudan", code: "249", iso: "SD" },
  { country: "Suriname", code: "597", iso: "SR" },
  { country: "Svalbard and Jan Mayen", code: "47", iso: "SJ" },
  { country: "Swaziland", code: "268", iso: "SZ" },
  { country: "Sweden", code: "46", iso: "SE" },
  { country: "Switzerland", code: "41", iso: "CH" },
  { country: "Syria", code: "963", iso: "SY" },
  { country: "Taiwan", code: "886", iso: "TW" },
  { country: "Tajikistan", code: "992", iso: "TJ" },
  { country: "Tanzania", code: "255", iso: "TZ" },
  { country: "Thailand", code: "66", iso: "TH" },
  { country: "Togo", code: "228", iso: "TG" },
  { country: "Tokelau", code: "690", iso: "TK" },
  { country: "Tonga", code: "676", iso: "TO" },
  { country: "Trinidad and Tobago", code: "1-868", iso: "TT" },
  { country: "Tunisia", code: "216", iso: "TN" },
  { country: "Turkey", code: "90", iso: "TR" },
  { country: "Turkmenistan", code: "993", iso: "TM" },
  { country: "Turks and Caicos Islands", code: "1-649", iso: "TC" },
  { country: "Tuvalu", code: "688", iso: "TV" },
  { country: "U.S. Virgin Islands", code: "1-340", iso: "VI" },
  { country: "Uganda", code: "256", iso: "UG" },
  { country: "Ukraine", code: "380", iso: "UA" },
  { country: "United Arab Emirates", code: "971", iso: "AE" },
  { country: "United Kingdom", code: "44", iso: "GB" },
  { country: "United States", code: "1", iso: "US" },
  { country: "Uruguay", code: "598", iso: "UY" },
  { country: "Uzbekistan", code: "998", iso: "UZ" },
  { country: "Vanuatu", code: "678", iso: "VU" },
  { country: "Vatican", code: "379", iso: "VA" },
  { country: "Venezuela", code: "58", iso: "VE" },
  { country: "Vietnam", code: "84", iso: "VN" },
  { country: "Wallis and Futuna", code: "681", iso: "WF" },
  { country: "Western Sahara", code: "212", iso: "EH" },
  { country: "Yemen", code: "967", iso: "YE" },
  { country: "Zambia", code: "260", iso: "ZM" },
  { country: "Zimbabwe", code: "263", iso: "ZW" },
];

/* export const postTags = [
  { name: "Visa" },
  { name: "Ticket" },
  { name: "Tour" },
  { name: "Hotel Booking" },
  { name: "Schengen" },
  { name: "Travel Insurance" },
  { name: "Express Entry" },
  { name: "Study Abroad" },
]; */

export const tags = {
  "Immigrant Visa": false,
  "Non-Immigrant Visa": false,
  "Student Visa": false,
  Flight: false,
  Hotel: false,
  Tour: false,
  "Travel Insurance": false,
};

export const TransitionComponent = React.forwardRef(function Transition(
  props,
  ref
) {
  // @ts-ignore
  return <Slide direction="down" ref={ref} {...props} />;
});

export const LinkTypography = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    textDecoration: "underline",
    textDecorationStyle: "dotted",
    textDecorationColor: "primary.main",
    cursor: "pointer",
  },
}));

export const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    // @ts-ignore
    backgroundColor: theme.palette.background.paper,
    maxWidth: 300,
    // @ts-ignore
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    // @ts-ignore
    color: theme.palette.text.primary,
  },
  [`& .${tooltipClasses.arrow}`]: {
    "&::before": {
      // @ts-ignore
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #dadde9",
    },
  },
}));

export const useAuthUser = () => {
  const userFetcher = async () => {
    try {
      console.log("geting authed user");
      const user = await axios.get("/api/getuserdata");
      console.log("user", user.data);
      return user.data;
    } catch (error) {
      console.log("error", error);
      throw new Error(error);
    }
  };

  const {
    data: user,
    mutate,
    error,
    isValidating,
    isLoading: loading,
  } = useSWR("/useAuthUser", userFetcher, { errorRetryCount: 3 });

  return { user, loading, error, mutate, isValidating };
};

export const seoSlug = (title) => {
  return removeStopwords(
    title
      .replace(/((?!([a-z0-9])).)/gi, "-")
      .split("-")
      .filter((word) => word)
  ).join("-");
};

export const useHost = () => {
  const [host, setHost] = useRecoilState(host_);
  React.useEffect(() => {
    if (window !== undefined) {
      setHost(window.location.host);
    }
  }, [window !== undefined]);
  return [host];
};

export function capitalizeName(name) {
  return name.replace(/\b(\w)/g, (s) => s.toUpperCase());
}

export const getUsername = async (user_id) => {
  try {
    const username = await axios.post("/api/getusername", { user_id: user_id });
    console.log("username", username.data);
    return username.data;
  } catch (error) {
    console.log("error", error);
  }
};

/* export const userFetcher = async () => {
  try {
    console.log("geting authed user");
    const authUser = await Auth.currentAuthenticatedUser();
    console.log("auth user", authUser);
    const user = await axios.post("/api/getuserdata", {
      email: get(authUser, "attributes.email"),
    });
    console.log("user", user.data);
    return user.data;
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
}; */

export const useFetchPosts = (filter) => {
  const fetchPosts = async (key) => {
    try {
      const dbFilter = JSON.parse(key);
      console.log("dbFilter in fetch", dbFilter);
      const posts = await axios.post("/api/getposts", { ...dbFilter });
      console.log("posts", posts.data);
      return posts.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const {
    data: posts,
    mutate,
    isValidating,
    isLoading,
  } = useSWRImmutable(filter, fetchPosts, {
    keepPreviousData: true,
  });

  return { posts, isValidating, isLoading };
};

//ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
/* 
export const prettyClass = (bookingClass) => {
  if (bookingClass === "ECONOMY") return "Economy";
  if (bookingClass === "premium_economy") return "Premium Economy";
  if (bookingClass === "business") return "Business";
  if (bookingClass === "first") return "First Class";
};
 */
export const prettyTrip = (trip) => {
  if (trip === "return") return "Return";
  if (trip === "one_way") return "One Way";
  if (trip === "multi") return "Multi-City";
};

export const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const money = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getStops = (number) => {
  switch (number) {
    case 0:
      return "Direct";
    case 1:
      return "1 Stop";
    default:
      return `${number} Stops`;
  }
};

export const getFilterOffer = async (key) => {
  try {
    const { airlines, stopValue, flightOffers } = JSON.parse(key);

    const offers = await axios.post("/api/flights/filter", {
      airlines,
      stopValue,
      flightOffers,
    });
    console.log('offers.data', offers.data)
    return offers.data;
  } catch (error) {
    console.log("error", error);
  }
};
