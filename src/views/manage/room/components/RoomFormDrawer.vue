<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { message } from 'ant-design-vue'
  import roomService, { type Room } from '@/api/roomService'

  interface Props {
    open: boolean
    houseId: string | number
    initialValues?: any
  }

  const props = defineProps<Props>()
  const emit = defineEmits(['update:open', 'success'])

  const loading = ref(false)
  const formRef = ref()

  const formState = reactive({
    room_number: '',
    floor: 1,
    price: 0,
    description: '',
  })

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen && props.initialValues) {
        Object.assign(formState, props.initialValues)
      } else if (isOpen) {
        formState.room_number = ''
        formState.floor = 1
        formState.price = 0
        formState.description = ''
      }
    }
  )

  const handleClose = () => {
    emit('update:open', false)
  }

  const onFinish = async () => {
    try {
      loading.value = true
      // Chuyển đổi house_id sang đúng định dạng của Room interface (thường là number)
      const payload: Partial<Room> = {
        ...formState,
        house_id: typeof props.houseId === 'string' ? parseInt(props.houseId) : props.houseId,
      }

      if (props.initialValues?.id) {
        // Logic update room
        message.info('Tính năng cập nhật phòng đang phát triển')
      } else {
        await roomService.createRoom(payload)
        message.success('Thêm phòng mới thành công')
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
    :title="props.initialValues ? 'Cập nhật Phòng' : 'Thêm Phòng mới'"
    :width="400"
    :open="props.open"
    @close="handleClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish" ref="formRef">
      <a-form-item
        label="Số phòng / Tên phòng"
        name="room_number"
        :rules="[{ required: true, message: 'Vui lòng nhập tên phòng' }]"
      >
        <a-input v-model:value="formState.room_number" placeholder="Ví dụ: 101" />
      </a-form-item>

      <a-form-item label="Tầng" name="floor">
        <a-input-number v-model:value="formState.floor" :min="1" style="width: 100%" />
      </a-form-item>

      <a-form-item
        label="Giá thuê (VNĐ/tháng)"
        name="price"
        :rules="[{ required: true, message: 'Vui lòng nhập giá thuê' }]"
      >
        <a-input-number
          v-model:value="formState.price"
          :min="0"
          :formatter="(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value: string) => value.replace(/\$\s?|(,*)/g, '')"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item label="Mô tả" name="description">
        <a-textarea v-model:value="formState.description" :rows="3" />
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
