import apiClient from './axios'

export interface GuestSession {
  id: string
  name: string
  phone: string
  email: string
  created_at: string
}

export interface SupportMessage {
  id: number
  session_id: string
  sender_type: 'guest' | 'admin'
  admin_id?: number
  content: string
  is_read: boolean
  created_at: string
}

export default {
  async createSession(data: {
    name: string
    phone: string
    email?: string
  }): Promise<{ status: boolean; data: GuestSession }> {
    const res = await apiClient.post<{ status: boolean; data: GuestSession }>('/support/session', data)
    return res.data
  },

  async getSessions(
    page = 1,
    limit = 20,
  ): Promise<{ status: boolean; data: GuestSession[] }> {
    const res = await apiClient.get('/support/sessions', { params: { page, limit } })
    return res.data
  },

  async getGuestMessages(
    sessionId: string,
    limit = 50,
    offset = 0,
  ): Promise<{ status: boolean; data: SupportMessage[] }> {
    const res = await apiClient.get(`/support/session/${sessionId}/messages`, {
      params: { limit, offset },
    })
    return res.data
  },

  async getMessages(
    sessionId: string,
    limit = 50,
    offset = 0,
  ): Promise<{ status: boolean; data: SupportMessage[] }> {
    const res = await apiClient.get(`/support/sessions/${sessionId}/messages`, {
      params: { limit, offset },
    })
    return res.data
  },

  async replyToSession(
    sessionId: string,
    content: string,
  ): Promise<{ status: boolean; data: SupportMessage }> {
    const res = await apiClient.post(`/support/sessions/${sessionId}/reply`, { content })
    return res.data
  },
}
