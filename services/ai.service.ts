import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiChatRequest {
  message: string;
  history?: AiChatMessage[];
}

const isSuccessStatus = (status: number) => status >= 200 && status < 300;

export const aiService = {
  getFinancialAdvice: async (): Promise<string> => {
    const response = await axiosInstance.get<ApiResponse<string>>("/ai/advice");

    if (!isSuccessStatus(response.data.status)) {
      throw new Error(response.data.message || "Không lấy được lời khuyên AI");
    }

    return response.data.data;
  },

  chat: async (
    message: string,
    history: AiChatMessage[] = []
  ): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<string>>("/ai/chat", {
      message,
      history,
    } satisfies AiChatRequest);

    if (!isSuccessStatus(response.data.status)) {
      throw new Error(response.data.message || "Không chat được với AI");
    }

    return response.data.data;
  },
};