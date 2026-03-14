<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../api/authService';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  username: '',
  password: '',
});

const onFinish = async (values: any) => {
  try {
    loading.value = true;
    await authService.login(values.username, values.password);
    message.success('Đăng nhập thành công!');
    router.push('/manage');

  } catch (error) {
    message.error('Tài khoản hoặc mật khẩu không chính xác!');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">Tro-Go Admin</h2>
        <p class="mt-2 text-sm text-gray-600">Đăng nhập vào hệ thống quản lý</p>
      </div>

      <a-form
        :model="formState"
        name="normal_login"
        @finish="onFinish"
        layout="vertical"
      >
        <a-form-item
          label="Tài khoản"
          name="username"
          :rules="[{ required: true, message: 'Vui lòng nhập tài khoản!' }]"
        >
          <a-input v-model:value="formState.username" size="large" placeholder="Ví dụ: admin">
            <template #prefix>
              <UserOutlined class="text-gray-400" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Mật khẩu"
          name="password"
          :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]"
        >
          <a-input-password v-model:value="formState.password" size="large" placeholder="Mật khẩu">
            <template #prefix>
              <LockOutlined class="text-gray-400" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item class="mt-6">
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            class="w-full"
            :loading="loading"
          >
            Đăng nhập
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
