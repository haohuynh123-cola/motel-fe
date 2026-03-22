import apiClient from './axios'

export interface ChatMessage {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  created_at: string
}

export interface Conversation {
  user_id: number
  full_name: string
  avatar_url?: string
  last_message: string
  last_message_at: string
  unread_count: number
}

export const chatService = {
  // Lấy danh sách những người đã từng nhắn tin
  getConversations: () => apiClient.get<Conversation[]>('/chat/conversations'),

  // Lấy lịch sử tin nhắn giữa mình và một người khác
  getMessages: (receiverId: number) =>
    apiClient.get<ChatMessage[]>(`/chat/messages?receiver_id=${receiverId}`),

  // Đánh dấu tin nhắn đã xem
  markRead: (senderId: number) => apiClient.post(`/chat/read?sender_id=${senderId}`),
}
