import apiClient from './axios'

export interface MarketListing {
  id: string
  source: string
  title: string
  description: string
  price: number
  area: number
  address: string
  contact_phone: string
  url: string
  image_url: string
  images: string[]
  posted_at: string
  created_at: string
}

export interface ListingResponse {
  status: boolean
  data: {
    total: number
    listings: MarketListing[]
  }
}

export default {
  async getListings(params: {
    source?: string
    page?: number
    limit?: number
  } = {}): Promise<ListingResponse> {
    const response = await apiClient.get<ListingResponse>('/market-listings', {
      params: {
        source: params.source ?? 'chotot',
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    })
    return response.data
  },
}
