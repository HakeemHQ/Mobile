import { apiClient } from './client';

import type {
    ChatbotRequest,
    ChatbotResponse,
} from '@/types/chatbot';

export const sendChatbotMessageApi = async (
    payload: ChatbotRequest,
): Promise<ChatbotResponse> => {
    const response = await apiClient.post(
        '/medical-intelligence/chat',
        payload,
    );

    return response.data;
};