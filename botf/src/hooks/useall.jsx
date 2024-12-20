import { useQuery } from "react-query";  
import { getAll } from "../utils/api";

const UseAll = () => {
   const { data, isLoading, isError, refetch } = useQuery(
    "all",
    getAll,
    { refetchOnWindowFocus: false } // Prevent refetching on window focus
  );

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default UseAll;


