import { atom } from "recoil";
import * as ls from "local-storage";
import { isDate } from "lodash";
import dayjs, { Ls } from "dayjs";

const persistFxn =
  (key) =>
  ({ setSelf, onSet }) => {
    setSelf((defaultVal) => {
      if (
        ls.get(key) &&
        (key === "startDate_" || key === "endDate_" || key === "dates_")
      ) {
        return new Date(ls.get(key));
      } else {
        return JSON.parse(ls.get(key)) ? JSON.parse(ls.get(key)) : defaultVal;
      }
    });

    onSet((newValue, oldValue) => {
      if (isDate(newValue)) {
        ls.set(key, newValue.toJSON());
      } else {
        ls.set(key, JSON.stringify(newValue));
      }
    });
  };

export const isLoading_ = atom({
  key: "isLoading_",
  default: false,
});

export const blockLoading_ = atom({
  key: "blockLoading_",
  default: false,
});

export const countState_ = atom({
  key: "count",
  default: 0,
});

export const filter_ = atom({
  key: "filter_",
  default: "Newest",
  effects_UNSTABLE: [persistFxn("filter_")],
});

export const selectCountry_ = atom({
  key: "selectCountry_",
  default: null,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("selectCountry_")],
});

export const category_ = atom({
  key: "category_",
  default: "All Posts",
  effects_UNSTABLE: [persistFxn("category_")],
});

export const addPost_ = atom({
  key: "addPost_",
  default: false,
});

export const replyPost_ = atom({
  key: "replyPost_",
  default: false,
});

export const login_ = atom({
  key: "login_",
  default: false,
});

export const editorLoaded_ = atom({
  key: "editorLoaded_",
  default: false,
});

export const meCategory_ = atom({
  key: "meCategory_",
  default: "Account Details",
  effects_UNSTABLE: [persistFxn("meCategory_")],
});

export const postReplyData_ = atom({
  key: "postReplyData_",
  default: {
    parentPost: null,
    post: null,
    isComment: false,
  },
  dangerouslyAllowMutability: true,
});

export const host_ = atom({
  key: "host_",
  default: "",
});

export const updateProfile_ = atom({
  key: "updateProfile_",
  default: false,
});

export const updatePost_ = atom({
  key: "updatePost_",
  default: false,
});

export const sidebarFilter_ = atom({
  key: "sidebarFilter_",
  default: [],
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("sidebarFilter_")],
});

export const dbFilter_ = atom({
  key: "dbFilter_",
  default: {
    post_type: [],
    countries: [],
    otherTags: [],
    index: 1,
  },
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("dbFilter_")],
});

export const mobileSearchOpen_ = atom({
  key: "mobileSearchOpen_",
  default: false,
});

export const mobileFilter_ = atom({
  key: "mobileFilter_",
  default: [],
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("mobileFilter_")],
});

export const post_ = atom({
  key: "post_",
  default: [],
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("post_")],
});

export const postType_ = atom({
  key: "postType_",
  default: ["Posts", "Questions"],
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("postType_")],
});

export const searchText_ = atom({
  key: "searchText_",
  default: "",
  effects_UNSTABLE: [persistFxn("searchText_")],
});


// Start Visa Order State

export const visaProducts_ = atom({
  key: "visaProducts_",
  default: [
    { name: "Hotel Reservation For Visa", selected: false, price: 5000 },
    { name: "Flight Reseravation For Visa", selected: false, price: 0 },
    { name: "Application Form Filling", selected: false, price: 10000 },
    { name: "Embassy Appointment Booking", selected: false, price: 10000 },
  ],
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("visaProducts_")],
});

const defaultQueryParams = {
  "Hotel Reservation For Visa": {
    price: 5000,
    selected: false,
    type: "product",
  },
  "Flight Reservation For Visa": {
    price: 5000,
    selected: false,
    type: "product",
  },
  "Application Form Filling": {
    price: 10000,
    selected: false,
    type: "product",
  },
  "Embassy Appointment Booking": {
    price: 5000,
    selected: false,
    type: "product",
  },
  passengers: {
    adult: 1,
    child: 0,
    infant: 0,
  },
  "Departure City, Country": "",
  "Arrival City, Country": "",
  "Arrival Date": null,
  "Return Date": null,
};

export const visaOrderParams_ = atom({
  key: "visaOrderParams_",
  default: defaultQueryParams,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      setSelf((defaultVal) => {
        const prevValue = ls.get("visaOrderParams_");
        console.log("prevValue", prevValue);
        if (prevValue) {
          const myValue = {
            ...prevValue,
            "Return Date": prevValue["Return Date"]
              ? new Date(prevValue["Return Date"])
              : null,
            "Arrival Date": prevValue["Arrival Date"]
              ? new Date(prevValue["Arrival Date"])
              : null,
          };
          return myValue;
        } else {
          return defaultVal;
        }
      });

      onSet((newValue, oldValue) => {
        console.log("newValue", newValue);
        const myValue = {
          ...newValue,
          "Return Date": newValue["Return Date"]
            ? // @ts-ignore
              newValue["Return Date"].toJSON()
            : null,
          "Arrival Date": newValue["Arrival Date"]
            ? // @ts-ignore
              newValue["Arrival Date"].toJSON()
            : null,
        };
        ls.set("visaOrderParams_", myValue);
      });
    },
  ],
});

// New State

export const showNewPostDialog_ = atom({
  key: "showNewPostDialog_",
  default: false,
  //effects_UNSTABLE: [persistFxn("showNewPostDialog")],
});

export const editPostDialog_ = atom({
  key: "editPostDialog_",
  default: false,
  //effects_UNSTABLE: [persistFxn("showNewPostDialog")],
});
