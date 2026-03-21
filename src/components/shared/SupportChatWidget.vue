<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { MessageOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons-vue'
import { useSupportChat } from '@/composables/useSupportChat'

const open = ref(false)
const inputText = ref('')
const messagesEndRef = ref<HTMLElement | null>(null)

// Guest info form
const guestName = ref('')
const guestPhone = ref('')
const guestEmail = ref('')
const formLoading = ref(false)
const formError = ref('')

const { sessionId, sessionInfo, messages, connected, connecting, startSession, sendMessage } =
  useSupportChat()

async function handleStartSession() {
  if (!guestName.value.trim() || !guestPhone.value.trim()) {
    formError.value = 'Vui lòng nhập họ tên và số điện thoại.'
    return
  }
  formError.value = ''
  formLoading.value = true
  try {
    await startSession(guestName.value.trim(), guestPhone.value.trim(), guestEmail.value.trim() || undefined)
  } catch {
    formError.value = 'Không thể tạo phiên hỗ trợ. Vui lòng thử lại.'
  } finally {
    formLoading.value = false
  }
}

function handleSend() {
  const content = inputText.value.trim()
  if (!content) return
  sendMessage(content)
  inputText.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

async function scrollToBottom() {
  await nextTick()
  messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
}

watch(messages, scrollToBottom, { deep: true })
watch(open, (v) => { if (v) scrollToBottom() })

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
    <!-- Chat Window -->
    <Transition name="chat">
      <div
        v-if="open"
        class="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        style="height: 480px"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-2">
            <div class="relative">
              <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageOutlined class="text-white text-sm" />
              </div>
              <span
                :class="[
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
                  connected ? 'bg-green-400' : 'bg-gray-300',
                ]"
              />
            </div>
            <div>
              <p class="text-white font-bold text-sm leading-none">Hỗ trợ trực tuyến</p>
              <p class="text-blue-100 text-[11px] mt-0.5">
                {{ connected ? 'Đang kết nối' : 'Ngoại tuyến' }}
              </p>
            </div>
          </div>
          <button
            @click="open = false"
            class="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <CloseOutlined class="text-white text-xs" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-hidden flex flex-col">
          <!-- No session: registration form -->
          <div v-if="!sessionId" class="flex-1 flex flex-col justify-center p-5">
            <p class="text-center text-gray-500 text-sm mb-5">
              Xin chào! Nhập thông tin để bắt đầu chat với tư vấn viên.
            </p>
            <div class="space-y-3">
              <a-input
                v-model:value="guestName"
                placeholder="Họ và tên *"
                size="large"
                class="rounded-xl"
                @keydown.enter="handleStartSession"
              />
              <a-input
                v-model:value="guestPhone"
                placeholder="Số điện thoại *"
                size="large"
                class="rounded-xl"
                @keydown.enter="handleStartSession"
              />
              <a-input
                v-model:value="guestEmail"
                placeholder="Email (tuỳ chọn)"
                size="large"
                class="rounded-xl"
                @keydown.enter="handleStartSession"
              />
              <p v-if="formError" class="text-red-500 text-xs">{{ formError }}</p>
              <a-button
                type="primary"
                block
                size="large"
                class="rounded-xl bg-blue-600 font-bold mt-2"
                :loading="formLoading || connecting"
                @click="handleStartSession"
              >
                Bắt đầu chat
              </a-button>
            </div>
          </div>

          <!-- Has session: messages -->
          <template v-else>
            <div class="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
              <div
                v-if="messages.length === 0"
                class="text-center text-gray-400 text-sm pt-6"
              >
                Xin chào {{ sessionInfo?.name }}! Hãy gửi tin nhắn để bắt đầu.
              </div>
              <div
                v-for="msg in messages"
                :key="msg.id"
                :class="[
                  'flex flex-col max-w-[80%]',
                  msg.sender_type === 'guest' ? 'self-end items-end ml-auto' : 'self-start items-start',
                ]"
              >
                <span
                  v-if="msg.sender_type === 'admin'"
                  class="text-[10px] text-gray-400 font-bold mb-1 px-1"
                >
                  Tư vấn viên
                </span>
                <div
                  :class="[
                    'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                    msg.sender_type === 'guest'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm',
                  ]"
                >
                  {{ msg.content }}
                </div>
                <span class="text-[10px] text-gray-300 mt-1 px-1">{{ formatTime(msg.created_at) }}</span>
              </div>
              <div ref="messagesEndRef" />
            </div>

            <!-- Input -->
            <div class="px-3 pb-3 pt-2 border-t border-gray-100 flex gap-2 flex-shrink-0">
              <a-input
                v-model:value="inputText"
                placeholder="Nhập tin nhắn..."
                class="rounded-xl flex-1"
                :disabled="!connected"
                @keydown="handleKeydown"
              />
              <a-button
                type="primary"
                class="rounded-xl bg-blue-600 border-none"
                :disabled="!connected || !inputText.trim()"
                @click="handleSend"
              >
                <template #icon><SendOutlined /></template>
              </a-button>
            </div>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Toggle Button -->
    <button
      @click="open = !open"
      class="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <CloseOutlined v-if="open" class="text-white text-xl" />
      <MessageOutlined v-else class="text-white text-xl" />
    </button>
  </div>
</template>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
</style>
