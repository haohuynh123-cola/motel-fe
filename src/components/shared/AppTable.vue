<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    columns: any[]
    dataSource: any[]
    loading?: boolean
    pagination?: any
  }

  const props = defineProps<Props>()
  const emit = defineEmits(['change'])

  // Định nghĩa slots cho TypeScript
  defineSlots<{
    bodyCell(props: { column: any; record: any; index: number; text: any; value: any }): any
    headerCell(props: { column: any; title: string }): any
  }>()

  const mergedPagination = computed(() => {
    if (props.pagination === false) return false

    return {
      showTotal: (total: number, range: [number, number]) =>
        `Showing ${range[0].toLocaleString('en-US')} to ${range[1].toLocaleString('en-US')} of ${total.toLocaleString('en-US')} results`,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      ...props.pagination,
    }
  })

  const handleTableChange = (pag: any, filters: any, sorter: any) => {
    emit('change', pag, filters, sorter)
  }
</script>

<template>
  <a-table
    :columns="props.columns"
    :data-source="props.dataSource"
    :loading="props.loading"
    :pagination="mergedPagination"
    @change="handleTableChange"
    class="app-table"
  >
    <!-- Forward các slots từ component cha xuống a-table -->
    <template #bodyCell="slotProps">
      <slot name="bodyCell" v-bind="slotProps" />
    </template>

    <template #headerCell="slotProps">
      <slot name="headerCell" v-bind="slotProps" />
    </template>
  </a-table>
</template>

<style scoped>
  .app-table :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa;
    font-weight: 600;
  }

  .app-table :deep(.ant-table-pagination) {
    margin-top: 24px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  /* Đẩy phần tổng số bản ghi sang bên trái */
  .app-table :deep(.ant-pagination-total-text) {
    margin-right: auto;
    font-weight: 500;
    color: #666;
  }
</style>
