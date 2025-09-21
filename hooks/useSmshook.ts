import { getSMSHistory } from "@/actions/twilo-actions";
import { useQuery } from "@tanstack/react-query";

export const useGetSMSHistory = () => {
  const { data, refetch } = useQuery({
    queryKey: ["Top300SMShistory"],
    queryFn: getSMSHistory,
  });

  return {
    data,
    refetch,
  };
};
