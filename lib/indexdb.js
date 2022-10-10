import Dexie from "dexie";

export const indexdb = new Dexie("indexdb-database");

indexdb.version(1).stores({
  useSWRdata: "++id, swrCustomCache", // Primary key and indexed props
});
