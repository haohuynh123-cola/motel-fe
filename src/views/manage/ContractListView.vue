<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { message } from 'ant-design-vue'
  import { SyncOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
  import { useContracts } from '@/composables/useContracts'
  import { formatCurrency, formatDate } from '@/utils/format'
  import AppTable from '@/components/shared/AppTable.vue'

  const route = useRoute()
  const router = useRouter()
  const houseId = route.params.id as string

  const { loading, contracts, fetchContracts } = useContracts()

  const isGeneralView = computed(() => !houseId)

  const columns = [
    {
      title: 'Mã hợp đồng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Phòng ID',
      dataIndex: 'room_id',
      key: 'room_id',
    },
    {
      title: 'Tiền cọc',
      dataIndex: 'deposit',
      key: 'deposit',
      customRender: ({ text }: { text: number }) => formatCurrency(text),
    },
    {
      title: 'Tiền thuê',
      dataIndex: 'monthly_rent',
      key: 'monthly_rent',
      customRender: ({ text }: { text: number }) => formatCurrency(text),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
      customRender: ({ text }: { text: string }) => formatDate(text),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  const dataSource = computed(() =>
    contracts.value.map((item: any) => ({
      ...item,
      key: item.id,
    }))
  )

  const handleRefresh = async () => {
    try {
      await fetchContracts(houseId)
    } catch (error) {
      message.error('Lỗi tải danh sách hợp đồng!')
    }
  }

  const goBack = () => {
    if (houseId) {
      router.push(`/manage/houses/${houseId}/rooms`)
    } else {
      router.push('/manage/houses')
    }
  }

  onMounted(handleRefresh)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <a-button @click="goBack" class="inline-flex items-center justify-center">
          <template #icon><ArrowLeftOutlined /></template>
        </a-button>
        <h2 class="text-2xl font-bold m-0">
          {{ isGeneralView ? 'Tất cả hợp đồng' : 'Hợp đồng của nhà' }}
        </h2>
      </div>
      <a-button
        type="primary"
        @click="handleRefresh"
        :loading="loading"
        class="inline-flex items-center"
      >
        <template #icon><SyncOutlined /></template>
        <span>Làm mới</span>
      </a-button>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <AppTable :dataSource="dataSource" :columns="columns" :loading="loading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag color="blue">{{ record.status }}</a-tag>
          </template>
        </template>
      </AppTable>
    </a-card>
  </div>
</template>
