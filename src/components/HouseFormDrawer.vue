<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { message } from 'ant-design-vue'
  import houseService from '@/api/houseService'

  interface Props {
    open: boolean
    initialValues?: any
  }

  const props = defineProps<Props>()
  const emit = defineEmits(['update:open', 'success'])

  const loading = ref(false)
  const formRef = ref()

  const formState = reactive({
    name: '',
    address: '',
  })

  // Đồng bộ form khi mở drawer để sửa
  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen && props.initialValues) {
        Object.assign(formState, props.initialValues)
      } else if (isOpen) {
        // Reset form khi tạo mới
        formState.name = ''
        formState.address = ''
      }
    }
  )

  const handleClose = () => {
    emit('update:open', false)
  }

  const onFinish = async () => {
    try {
      loading.value = true
      if (props.initialValues?.id) {
        await houseService.updateHouse(props.initialValues.id, formState)
        message.success('Cập nhật nhà trọ thành công')
      } else {
        await houseService.createHouse(formState)
        message.success('Thêm nhà trọ mới thành công')
      }
      emit('success')
      handleClose()
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <a-drawer
    :title="props.initialValues ? 'Cập nhật Nhà trọ' : 'Thêm Nhà trọ mới'"
    :width="400"
    :open="props.open"
    :body-style="{ paddingBottom: '80px' }"
    @close="handleClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish" ref="formRef">
      <a-form-item
        label="Tên nhà trọ"
        name="name"
        :rules="[{ required: true, message: 'Vui lòng nhập tên nhà trọ' }]"
      >
        <a-input v-model:value="formState.name" placeholder="Ví dụ: Nhà trọ Minh Khai" />
      </a-form-item>

      <a-form-item
        label="Địa chỉ"
        name="address"
        :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ' }]"
      >
        <a-textarea v-model:value="formState.address" placeholder="Địa chỉ chi tiết..." :rows="4" />
      </a-form-item>
    </a-form>

    <template #extra>
      <a-space>
        <a-button @click="handleClose">Hủy</a-button>
        <a-button type="primary" :loading="loading" @click="() => formRef.submit()">Lưu</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
