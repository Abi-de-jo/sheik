import { useQuery } from "react-query";
import {  getProperty } from "../utils/api";

const useLikes = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allLikes",
    getProperty,
   );

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useLikes;
