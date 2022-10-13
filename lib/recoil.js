import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const sessionStorage =
  typeof window !== `undefined` ? window.sessionStorage : undefined;

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

const { persistAtom: persistFilter_ } = recoilPersist({
  key: "persistFilter_",
  storage: sessionStorage,
});

export const filter_ = atom({
  key: "filter_",
  default: "Newest",
  effects_UNSTABLE: [persistFilter_],
});

const { persistAtom: persistSelectCountry_ } = recoilPersist({
  key: "persistSelectCountry_",
  storage: sessionStorage,
});

export const selectCountry_ = atom({
  key: "selectCountry_",
  default: null,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistSelectCountry_],
});

const { persistAtom: persistCategory_ } = recoilPersist({
  key: "persistSelectCategory_",
  storage: sessionStorage,
});

export const category_ = atom({
  key: "category_",
  default: "All Posts",
  effects_UNSTABLE: [persistCategory_],
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

const { persistAtom: persistMeCategory_ } = recoilPersist({
  key: "persistSelectCategory_",
  storage: sessionStorage,
});

export const meCategory_ = atom({
  key: "meCategory_",
  default: "Account Details",
  effects_UNSTABLE: [persistMeCategory_],
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

const { persistAtom: persistsidebarFilter_ } = recoilPersist({
  key: "persistsidebarFilter_",
  storage: sessionStorage,
});

export const sidebarFilter_ = atom({
  key: "sidebarFilter_",
  default: [],
  effects_UNSTABLE: [persistsidebarFilter_],
  dangerouslyAllowMutability: true,
});

const { persistAtom: persistDbFilter_ } = recoilPersist({
  key: "persistDbFilter_",
  storage: sessionStorage,
});

export const dbFilter_ = atom({
  key: "dbFilter_",
  default: {
    post_type: [],
    countries: [],
    otherTags: [],
    index: 1,
  },
  effects_UNSTABLE: [persistDbFilter_],
  dangerouslyAllowMutability: true,
});

export const mobileSearchOpen_ = atom({
  key: "mobileSearchOpen_",
  default: false,
});

const { persistAtom: mobileFilterPersist_ } = recoilPersist({
  key: "mobileFilterPersist_",
  storage: sessionStorage,
});

export const mobileFilter_ = atom({
  key: "mobileFilter_",
  default: [],
  effects_UNSTABLE: [mobileFilterPersist_],
  dangerouslyAllowMutability: true,
});

const { persistAtom: postsPersist_ } = recoilPersist({
  key: "postsPersist_",
  storage: sessionStorage,
});

export const posts_ = atom({
  key: "posts_",
  default: [],
  //  effects_UNSTABLE: [postsPersist_],
  dangerouslyAllowMutability: true,
});

export const post_ = atom({
  key: "post_",
  default: null,
  dangerouslyAllowMutability: true,
});

const { persistAtom: searchTextPersist_ } = recoilPersist({
  key: "searchTextPersist_",
  storage: sessionStorage,
});

export const searchText_ = atom({
  key: "searchText_",
  default: "",
  effects_UNSTABLE: [searchTextPersist_],
});

// Start Flights Search State Parameters

const { persistAtom: tripPersist_ } = recoilPersist({
  key: "tripPersist_",
  storage: sessionStorage,
});

export const trip_ = atom({
  key: "trip_",
  default: "return",
  effects_UNSTABLE: [tripPersist_],
});

const { persistAtom: classPersist_ } = recoilPersist({
  key: "classPersist_",
  storage: sessionStorage,
});

export const class_ = atom({
  key: "class_",
  default: "ECONOMY",
  effects_UNSTABLE: [classPersist_],
});

const { persistAtom: passengersPersist_ } = recoilPersist({
  key: "passengersPersist_",
  storage: sessionStorage,
});

export const passengers_ = atom({
  key: "passengers_",
  default: {
    adult: 1,
    child: 0,
    infant: 0,
  },
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [passengersPersist_],
});

const { persistAtom: startDatePersist_ } = recoilPersist({
  key: "startDatePersist_",
  storage: sessionStorage,
});

export const startDate_ = atom({
  key: "startDate_",
  default: new Date(),
  effects_UNSTABLE: [startDatePersist_],
});

const { persistAtom: endDatePersist_ } = recoilPersist({
  key: "endDatePersist_",
  storage: sessionStorage,
});

export const endDate_ = atom({
  key: "endDate_",
  default: new Date(),
  effects_UNSTABLE: [endDatePersist_],
});

const { persistAtom: datesPersist_ } = recoilPersist({
  key: "datesPersist_",
  storage: sessionStorage,
});

export const dates_ = atom({
  key: "dates_",
  default: [new Date()],
  effects_UNSTABLE: [datesPersist_],
});

const { persistAtom: locationsPersist_ } = recoilPersist({
  key: "locationsPersist_",
  storage: sessionStorage,
});

export const locations_ = atom({
  key: "locations_",
  default: Array.from({ length: 2 }, (_, i) => ({
    prettyText: "",
    data: null,
  })),
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [locationsPersist_],
});

const { persistAtom: multiCityPerssist_ } = recoilPersist({
  key: "multiCityPerssist_",
  storage: sessionStorage,
});

export const multiCity_ = atom({
  key: "multiCity_",
  default: Array.from({ length: 1 }, (_, i) => ({
    a: 0,
    b: 1,
  })),
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [multiCityPerssist_],
});

const { persistAtom: queryParamsPerssist_ } = recoilPersist({
  key: "queryParamsPerssist_",
  storage: sessionStorage,
});

export const queryParams_ = atom({
  key: "queryParams_",
  default: null,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [queryParamsPerssist_],
});

export const flightOffer_ = atom({
  key: "flightOffer_",
  default: null,
  dangerouslyAllowMutability: true,
});

// End Flights Search State Parameters
