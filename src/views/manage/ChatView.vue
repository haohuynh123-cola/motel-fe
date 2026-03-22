<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useChat } from '@/composables/useChat'
import { chatService, type Conversation, type ChatMessage } from '@/api/chatService'
import { useAuthStore } from '@/stores/auth'
import { message } from 'ant-design-vue'

const route = useRoute()
const authStore = useAuthStore()
const { connect, sendMessage, messages, isConnected } = useChat()

const conversations = ref<Conversation[]>([])
const selectedUserId = ref<number | null>(null)
const chatMessages = ref<ChatMessage[]>([])
const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)

const fetchConversations = async () => {
  try {
    const res = await chatService.getConversations()
    conversations.value = res.data

    // Nếu có userId từ query, tự động chọn hội thoại đó
    const queryUserId = route.query.userId
    if (queryUserId) {
      const targetId = Number(queryUserId)
      // Nếu chưa có trong danh sách hội thoại, có thể cần tạo hội thoại giả lập hoặc load tin nhắn
      selectConversation(targetId)
    }
  } catch (err) {
    console.error('Failed to fetch conversations', err)
  }
}

const selectConversation = async (userId: number) => {
  selectedUserId.value = userId
  try {
    const res = await chatService.getMessages(userId)
    chatMessages.value = res.data
    scrollToBottom()
  } catch (err) {
    console.error('Failed to fetch messages', err)
  }
}

const handleSend = () => {
  if (!newMessage.value.trim() || !selectedUserId.value) return
  
  sendMessage(selectedUserId.value, newMessage.value)
  
  // Tạo tin nhắn tạm thời để hiển thị ngay lập tức (hoặc đợi WS phản hồi)
  // Ở đây chúng ta đợi WS phản hồi qua `messages` ref của composable
  newMessage.value = ''
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

// Theo dõi tin nhắn mới từ WebSocket
watch(messages, (newMsgs) => {
  const lastMsg = newMsgs[newMsgs.length - 1]
  if (lastMsg && (lastMsg.sender_id === selectedUserId.value || lastMsg.receiver_id === selectedUserId.value)) {
    chatMessages.value.push(lastMsg)
    scrollToBottom()
  }
}, { deep: true })

onMounted(() => {
  fetchConversations()
  connect()
})
</script>

<template>
  <div class="flex h-[calc(100vh-120px)] bg-white rounded-lg shadow overflow-hidden">
    <!-- Sidebar: Danh sách hội thoại -->
    <div class="w-1/3 border-r border-gray-200 flex flex-col">
      <div class="p-4 border-b border-gray-200 font-bold text-lg flex items-center justify-between">
        Tin nhắn
        <span :class="isConnected ? 'bg-green-500' : 'bg-red-500'" class="w-3 h-3 rounded-full" title="Connection status"></span>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div 
          v-for="conv in conversations" 
          :key="conv.user_id"
          @click="selectConversation(conv.user_id)"
          :class="['p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition', selectedUserId === conv.user_id ? 'bg-blue-50' : '']"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {{ conv.full_name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 overflow-hidden">
              <div class="flex justify-between items-center">
                <h4 class="font-semibold truncate">{{ conv.full_name }}</h4>
                <span class="text-xs text-gray-400">{{ new Date(conv.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
              </div>
              <p class="text-sm text-gray-500 truncate">{{ conv.last_message }}</p>
            </div>
            <div v-if="conv.unread_count > 0" class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ conv.unread_count }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main: Khung chat -->
    <div class="flex-1 flex flex-col">
      <template v-if="selectedUserId">
        <div class="p-4 border-b border-gray-200 font-semibold text-lg flex items-center gap-2">
           Hội thoại với {{ conversations.find(c => c.user_id === selectedUserId)?.full_name }}
        </div>
        
        <div ref="messageContainer" class="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          <div 
            v-for="msg in chatMessages" 
            :key="msg.id"
            :class="['flex', msg.sender_id === authStore.user?.id ? 'justify-end' : 'justify-start']"
          >
            <div 
              :class="['max-w-[70%] px-4 py-2 rounded-lg shadow-sm', 
                msg.sender_id === authStore.user?.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none']"
            >
              <div class="text-sm">{{ msg.content }}</div>
              <div class="text-[10px] mt-1 text-right opacity-70">
                {{ new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 flex gap-2 items-center bg-white">
          <textarea 
            v-model="newMessage" 
            placeholder="Nhập tin nhắn..." 
            class="flex-1 border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows="1"
            @keyup.enter="handleSend"
          ></textarea>
          <button 
            @click="handleSend"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            :disabled="!newMessage.trim()"
          >
            Gửi
          </button>
        </div>
      </template>
      <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400">
        <span class="text-4xl mb-4">💬</span>
        Chọn một người dùng để bắt đầu trò chuyện
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tuỳ chọn: Smooth scroll cho message container */
.overflow-y-auto {
  scroll-behavior: smooth;
}
</style>
