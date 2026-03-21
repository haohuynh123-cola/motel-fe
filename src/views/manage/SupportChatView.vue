<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import {
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import supportService, { type GuestSession, type SupportMessage } from '@/api/supportService'

const wsBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1').replace(
  /^http/,
  'ws',
)

const sessions = ref<GuestSession[]>([])
const selectedSession = ref<GuestSession | null>(null)
const messages = ref<SupportMessage[]>([])
const replyText = ref('')
const loadingSessions = ref(false)
const loadingMessages = ref(false)
const sendingReply = ref(false)
const messagesEndRef = ref<HTMLElement | null>(null)
let ws: WebSocket | null = null

async function loadSessions() {
  loadingSessions.value = true
  try {
    const res = await supportService.getSessions()
    if (res.status) sessions.value = (res.data as any) ?? []
  } finally {
    loadingSessions.value = false
  }
}

async function selectSession(session: GuestSession) {
  selectedSession.value = session
  loadingMessages.value = true
  try {
    const res = await supportService.getMessages(session.id)
    if (res.status) messages.value = (Array.isArray(res.data) ? res.data : []) as SupportMessage[]
  } finally {
    loadingMessages.value = false
  }
}

async function sendReply() {
  if (!selectedSession.value || !replyText.value.trim()) return
  sendingReply.value = true
  try {
    const res = await supportService.replyToSession(selectedSession.value.id, replyText.value.trim())
    if (res.status) {
      messages.value = [...messages.value, res.data]
      replyText.value = ''
      scrollToBottom()
    }
  } finally {
    sendingReply.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendReply()
  }
}

async function scrollToBottom() {
  await nextTick()
  messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
}

watch(messages, scrollToBottom, { deep: true })

function connectAdminWs() {
  const token = localStorage.getItem('token')
  if (!token) return
  ws = new WebSocket(`${wsBaseUrl}/ws/support/admin?token=${token}`)
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        const msg = data.data as SupportMessage
        if (selectedSession.value?.id === msg.session_id) {
          messages.value = [...messages.value, msg]
        }
        // refresh sessions list to update any badges
        loadSessions()
      }
    } catch {}
  }
}

onMounted(() => {
  loadSessions()
  connectAdminWs()
})

onUnmounted(() => {
  ws?.close()
})

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  })
}
</script>

<template>
  <div class="flex h-full gap-0 -m-8 rounded-2xl overflow-hidden" style="min-height: 600px">
    <!-- Left: Session List -->
    <div class="w-72 flex-shrink-0 border-r border-slate-100 flex flex-col bg-slate-50">
      <div class="px-4 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-slate-700 flex items-center gap-2">
          <MessageOutlined class="text-emerald-600" /> Hội thoại
        </h3>
        <button
          @click="loadSessions"
          class="text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <ReloadOutlined :class="{ 'animate-spin': loadingSessions }" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="loadingSessions" class="p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="animate-pulse flex items-center gap-3 p-3">
            <div class="w-10 h-10 rounded-full bg-gray-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-gray-200 rounded w-2/3"></div>
              <div class="h-2 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div
          v-else-if="!sessions.length"
          class="p-6 text-center text-slate-400 text-sm"
        >
          Chưa có hội thoại nào
        </div>

        <button
          v-for="session in sessions"
          :key="session.id"
          @click="selectSession(session)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-white border-b border-slate-100/60',
            selectedSession?.id === session.id ? 'bg-white border-l-2 border-l-emerald-500' : '',
          ]"
        >
          <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <UserOutlined class="text-emerald-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-slate-700 text-sm truncate">{{ session.name }}</p>
            <p class="text-slate-400 text-xs truncate">{{ session.phone }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Right: Chat Area -->
    <div class="flex-1 flex flex-col bg-white">
      <!-- Empty state -->
      <div
        v-if="!selectedSession"
        class="flex-1 flex flex-col items-center justify-center text-slate-300"
      >
        <MessageOutlined class="text-7xl mb-4" />
        <p class="text-base font-medium">Chọn một hội thoại để xem tin nhắn</p>
      </div>

      <template v-else>
        <!-- Chat header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <UserOutlined class="text-emerald-600" />
          </div>
          <div>
            <p class="font-bold text-slate-700">{{ selectedSession.name }}</p>
            <p class="text-slate-400 text-xs">{{ selectedSession.phone }} · {{ selectedSession.email }}</p>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div v-if="loadingMessages" class="flex justify-center pt-8">
            <a-spin />
          </div>
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'flex flex-col max-w-[70%]',
              msg.sender_type === 'admin' ? 'self-end items-end ml-auto' : 'self-start items-start',
            ]"
          >
            <span class="text-[11px] text-slate-400 mb-1 px-1 font-medium">
              {{ msg.sender_type === 'admin' ? 'Bạn' : selectedSession.name }}
            </span>
            <div
              :class="[
                'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                msg.sender_type === 'admin'
                  ? 'bg-emerald-500 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm',
              ]"
            >
              {{ msg.content }}
            </div>
            <span class="text-[10px] text-slate-300 mt-1 px-1">{{ formatTime(msg.created_at) }}</span>
          </div>
          <div ref="messagesEndRef" />
        </div>

        <!-- Reply input -->
        <div class="px-4 pb-4 pt-3 border-t border-slate-100 flex gap-2">
          <a-input
            v-model:value="replyText"
            placeholder="Nhập phản hồi..."
            size="large"
            class="rounded-xl flex-1"
            @keydown="handleKeydown"
          />
          <a-button
            type="primary"
            size="large"
            class="rounded-xl bg-emerald-600 border-emerald-600 hover:bg-emerald-700 font-bold"
            :loading="sendingReply"
            :disabled="!replyText.trim()"
            @click="sendReply"
          >
            <template #icon><SendOutlined /></template>
          </a-button>
        </div>
      </template>
    </div>
  </div>
</template>
