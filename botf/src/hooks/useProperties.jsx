import { useQuery } from "react-query"; // Ensure you import the correct hook
import { getAllProperties } from "../utils/api";

const useProperties = () => {
  // Fetch all properties using react-query
  const { data, isLoading, isError, refetch } = useQuery(
    "allProperties",
    getAllProperties,
    { refetchOnWindowFocus: false } // Prevent refetching on window focus
  );

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useProperties;
