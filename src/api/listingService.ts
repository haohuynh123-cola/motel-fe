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
  latitude: number
  longitude: number
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

export interface ListingDetailResponse {
  status: boolean
  data: MarketListing
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

  async getListingById(id: string, source = 'chotot'): Promise<ListingDetailResponse> {
    const response = await apiClient.get<ListingDetailResponse>(`/market-listings/${id}`, {
      params: { source },
    })
    return response.data
  },
}
