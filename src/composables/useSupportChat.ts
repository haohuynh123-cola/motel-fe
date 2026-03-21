import { ref, onMounted, onUnmounted } from 'vue'
import supportService, { type GuestSession, type SupportMessage } from '@/api/supportService'

const wsBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1').replace(
  /^https/,
  'wss',
).replace(/^http/, 'ws')

export function useSupportChat() {
  const sessionId = ref<string | null>(localStorage.getItem('support_session_id'))
  const sessionInfo = ref<GuestSession | null>(
    JSON.parse(localStorage.getItem('support_session_info') || 'null'),
  )
  const messages = ref<SupportMessage[]>([])
  const connected = ref(false)
  const connecting = ref(false)
  let ws: WebSocket | null = null

  async function loadHistory(): Promise<void> {
    if (!sessionId.value) return
    try {
      const res = await supportService.getGuestMessages(sessionId.value)
      if (res.status && Array.isArray(res.data)) {
        messages.value = res.data
      }
    } catch {
      // ignore — session có thể đã hết hạn
    }
  }

  async function startSession(name: string, phone: string, email?: string): Promise<void> {
    try {
      connecting.value = true
      const res = await supportService.createSession({ name, phone, email })
      if (res.status) {
        sessionId.value = res.data.id
        sessionInfo.value = res.data
        localStorage.setItem('support_session_id', res.data.id)
        localStorage.setItem('support_session_info', JSON.stringify(res.data))
        messages.value = []
        connect()
      }
    } finally {
      connecting.value = false
    }
  }

  function connect(): void {
    if (!sessionId.value || ws?.readyState === WebSocket.OPEN) return
    ws = new WebSocket(`${wsBaseUrl}/ws/support?session_id=${sessionId.value}`)
    ws.onopen = () => {
      connected.value = true
    }
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        // Chỉ push tin nhắn mới, tránh trùng với lịch sử đã load
        const msg = (payload.data ?? payload) as SupportMessage
        if (msg.id && !messages.value.find((m) => m.id === msg.id)) {
          messages.value = [...messages.value, msg]
        }
      } catch {}
    }
    ws.onclose = () => {
      connected.value = false
    }
    ws.onerror = () => {
      connected.value = false
    }
  }

  function sendMessage(content: string): void {
    if (ws?.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({ type: 'message', content }))
    // Optimistic update — hiện tin nhắn ngay không chờ server echo
    messages.value = [
      ...messages.value,
      {
        id: Date.now(), // tạm, sẽ bị replace khi load lại history
        session_id: sessionId.value ?? '',
        sender_type: 'guest',
        content,
        is_read: false,
        created_at: new Date().toISOString(),
      } as SupportMessage,
    ]
  }

  function disconnect(): void {
    ws?.close()
    ws = null
    connected.value = false
  }

  onMounted(async () => {
    if (sessionId.value) {
      await loadHistory()
      connect()
    }
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    sessionId,
    sessionInfo,
    messages,
    connected,
    connecting,
    startSession,
    sendMessage,
    disconnect,
  }
}
