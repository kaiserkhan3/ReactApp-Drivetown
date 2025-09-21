import { getMessageTemplates } from "@/actions/message-template-actions";
import { useQuery } from "@tanstack/react-query";

export const useGetSMSTemplates = () => {
  const { data } = useQuery({
    queryKey: ["MessageTemplates"],
    queryFn: () => getMessageTemplates(),
    staleTime: 600000,
  });

  return {
    messageTemplatesData: data,
  };
};
