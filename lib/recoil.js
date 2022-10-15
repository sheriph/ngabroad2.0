import { atom } from "recoil";
//import localforage from "localforage";
//import * as memoryDriver from "localforage-driver-memory";
import * as localforage from "localforage";
import * as memoryDriver from "localforage-driver-memory";

localforage.defineDriver(memoryDriver);
localforage.setDriver(memoryDriver._driver);

// @ts-ignore
//localforage.setDriver(memoryDriver);

localforage.config({
  driver: [
    localforage.LOCALSTORAGE,
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    //  memoryDriver._driver,
    memoryDriver._driver,
  ],
  name: "ngabroad_store",
  storeName: "ngabroad_indexdb",
});

const persistFxn =
  (key) =>
  ({ setSelf, onSet }) => {
    console.log("loading recoil 2");
    localforage.getItem(key, (err, value) => {
      console.log("loading err, value", err, value);
      setSelf((defaultVal) => {
        if (value && !err) {
          return value;
        } else {
          return defaultVal;
        }
      });
    });

    onSet((newValue, oldValue) => {
      console.log("loading recoil 3");
      localforage.setItem(key, newValue, (err, value) =>
        console.log("loading err, value", err, value)
      );
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

export const posts_ = atom({
  key: "posts_",
  default: [],
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("posts_")],
});

export const post_ = atom({
  key: "post_",
  default: null,
  dangerouslyAllowMutability: true,
});

export const searchText_ = atom({
  key: "searchText_",
  default: "",
  effects_UNSTABLE: [persistFxn("searchText_")],
});

// Start Flights Search State Parameters

export const trip_ = atom({
  key: "trip_",
  default: "return",
  effects_UNSTABLE: [persistFxn("trip_")],
});

export const class_ = atom({
  key: "class_",
  default: "ECONOMY",
  effects_UNSTABLE: [persistFxn("class_")],
});

export const passengers_ = atom({
  key: "passengers_",
  default: {
    adult: 1,
    child: 0,
    infant: 0,
  },
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("passengers_")],
});

export const startDate_ = atom({
  key: "startDate_",
  default: new Date(),
  effects_UNSTABLE: [persistFxn("startDate_")],
});

export const endDate_ = atom({
  key: "endDate_",
  default: new Date(),
  effects_UNSTABLE: [persistFxn("endDate_")],
});

export const dates_ = atom({
  key: "dates_",
  default: [new Date()],
  effects_UNSTABLE: [persistFxn("dates_")],
});

export const locations_ = atom({
  key: "locations_",
  default: Array.from({ length: 2 }, (_, i) => ({
    prettyText: "",
    data: null,
  })),
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("locations_")],
});

export const multiCity_ = atom({
  key: "multiCity_",
  default: Array.from({ length: 1 }, (_, i) => ({
    a: 0,
    b: 1,
  })),
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("multiCity_")],
});

export const queryParams_ = atom({
  key: "queryParams_",
  default: null,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("queryParams_")],
});

export const flightOffer_ = atom({
  key: "flightOffer_",
  default: null,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistFxn("flightOffer_")],
});

export const openFlightSearchDrawer_ = atom({
  key: "openFlightSearchDrawer_",
  default: false,
  dangerouslyAllowMutability: true,
});

// End Flights Search State Parameters
