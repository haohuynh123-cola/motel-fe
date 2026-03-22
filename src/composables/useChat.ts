import { ref, onUnmounted, nextTick } from 'vue'
import type { ChatMessage } from '@/api/chatService'

interface ChatPayload {
  type: 'message' | 'notification' | 'read'
  sender_id?: number
  receiver_id?: number
  content?: string
  data?: any
}

export function useChat() {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const messages = ref<ChatMessage[]>([])
  const onlineUsers = ref<number[]>([]) // Danh sách userID đang online

  const connect = (onMessageReceived?: (payload: ChatPayload) => void) => {
    const token = localStorage.getItem('token')
    if (!token) return

    // Base URL từ env hoặc mặc định
    const wsBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('http', 'ws') || 'ws://localhost:8080/api/v1'
    
    // Kết nối kèm JWT token trong query (vì websocket không hỗ trợ headers chuẩn khi handshake)
    ws.value = new WebSocket(`${wsBaseUrl}/ws/chat?token=${token}`)

    ws.value.onopen = () => {
      isConnected.value = true
      console.log('Connected to User Chat')
    }

    ws.value.onmessage = (event) => {
      const payload: ChatPayload = JSON.parse(event.data)

      if (payload.type === 'message' && payload.data) {
        messages.value.push(payload.data)
        if (onMessageReceived) onMessageReceived(payload)
      } else if (payload.type === 'notification' && payload.content === 'online_users') {
        onlineUsers.value = payload.data || []
      }
    }

    ws.value.onclose = () => {
      isConnected.value = false
      // Tự động kết nối lại sau 3 giây
      setTimeout(() => connect(onMessageReceived), 3000)
    }

    ws.value.onerror = (err) => {
      console.error('WebSocket Error:', err)
      ws.value?.close()
    }
  }

  const sendMessage = (receiverId: number, content: string) => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      const payload: ChatPayload = {
        type: 'message',
        receiver_id: receiverId,
        content: content,
      }
      ws.value.send(JSON.stringify(payload))
    }
  }

  const disconnect = () => {
    ws.value?.close()
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    messages,
    onlineUsers,
    connect,
    sendMessage,
    disconnect,
  }
}
