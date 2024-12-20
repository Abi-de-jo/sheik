import { useQuery } from "react-query";
import { getAllDraft } from "../utils/api";

const useDraft = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allDraftsss",
    getAllDraft,
    { refetchOnWindowFocus: false }
  );

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useDraft;
