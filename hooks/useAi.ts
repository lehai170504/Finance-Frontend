import { useMutation, useQuery } from "@tanstack/react-query";
import { aiService, AiChatMessage } from "@/services/ai.service";

export const useFinancialAdvice = () => {
  return useQuery<string, Error>({
    queryKey: ["ai", "advice"],
    queryFn: aiService.getFinancialAdvice,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useAiChat = () => {
  return useMutation<
    string,
    Error,
    {
      message: string;
      history?: AiChatMessage[];
    }
  >({
    mutationFn: ({ message, history }) => aiService.chat(message, history || []),
  });
};