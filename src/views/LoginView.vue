<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import authService from '../api/authService'
  import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    IdcardOutlined,
    SafetyOutlined,
    ArrowLeftOutlined,
  } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'

  const router = useRouter()
  const loading = ref(false)
  const mode = ref<'login' | 'register' | 'otp'>('login')

  const formState = reactive({
    username: '',
    password: '',
    email: '',
    full_name: '',
    otp: '',
  })

  const onLogin = async () => {
    try {
      loading.value = true
      const res = await authService.login(formState.username, formState.password)
      console.log('Login response:', res)
      if (res.status) {
        message.success('Đăng nhập thành công!')
        router.push('/manage')
      } else {
        message.error(res.message || 'Tài khoản hoặc mật khẩu không chính xác!')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      message.error(error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau!')
    } finally {
      loading.value = false
    }
  }

  const onRegister = async () => {
    try {
      loading.value = true
      const res = await authService.register({
        username: formState.username,
        password: formState.password,
        email: formState.email,
        full_name: formState.full_name,
      })
      console.log('Register response:', res)
      if (res.status) {
        message.success('Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.')
        // Chuyển sang form OTP
        mode.value = 'otp'
      } else {
        message.error(res.message || 'Đăng ký thất bại!')
      }
    } catch (error: any) {
      console.error('Register error:', error)
      message.error(error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau!')
    } finally {
      loading.value = false
    }
  }

  const onVerifyOtp = async () => {
    try {
      loading.value = true
      const res = await authService.verifyOtp(formState.email, formState.otp)
      console.log('Verify OTP response:', res)
      if (res.status) {
        message.success('Xác thực thành công!')
        router.push('/manage')
      } else {
        message.error(res.message || 'Mã OTP không chính xác!')
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error)
      message.error(error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn!')
    } finally {
      loading.value = false
    }
  }

  const toggleMode = (newMode: 'login' | 'register') => {
    mode.value = newMode
  }
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">Tro-Go</h2>
        <p class="mt-2 text-sm text-gray-600" v-if="mode === 'login'">Đăng nhập vào hệ thống quản lý</p>
        <p class="mt-2 text-sm text-gray-600" v-else-if="mode === 'register'">Tạo tài khoản mới</p>
        <p class="mt-2 text-sm text-gray-600" v-else>Xác thực mã OTP</p>
      </div>

      <!-- Login Form -->
      <div v-if="mode === 'login'">
        <a-form :model="formState" name="login_form" @finish="onLogin" layout="vertical">
          <a-form-item
            label="Tài khoản"
            name="username"
            :rules="[{ required: true, message: 'Vui lòng nhập tài khoản!' }]"
          >
            <a-input v-model:value="formState.username" size="large" placeholder="Tên đăng nhập">
              <template #prefix><UserOutlined class="text-gray-400" /></template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="Mật khẩu"
            name="password"
            :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]"
          >
            <a-input-password v-model:value="formState.password" size="large" placeholder="Mật khẩu">
              <template #prefix><LockOutlined class="text-gray-400" /></template>
            </a-input-password>
          </a-form-item>

          <a-form-item class="mt-6">
            <a-button type="primary" html-type="submit" size="large" class="w-full" :loading="loading">
              Đăng nhập
            </a-button>
            <div class="text-center mt-4">
              <span class="text-gray-500">Chưa có tài khoản? </span>
              <a @click="toggleMode('register')" class="text-blue-600 font-bold hover:underline cursor-pointer">Đăng ký ngay</a>
            </div>
          </a-form-item>
        </a-form>
      </div>

      <!-- Register Form -->
      <div v-if="mode === 'register'">
        <a-form :model="formState" name="register_form" @finish="onRegister" layout="vertical">
          <a-form-item
            label="Họ và tên"
            name="full_name"
            :rules="[{ required: true, message: 'Vui lòng nhập họ và tên!' }]"
          >
            <a-input v-model:value="formState.full_name" size="large" placeholder="Nguyễn Văn A">
              <template #prefix><IdcardOutlined class="text-gray-400" /></template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="Email"
            name="email"
            :rules="[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]"
          >
            <a-input v-model:value="formState.email" size="large" placeholder="example@gmail.com">
              <template #prefix><MailOutlined class="text-gray-400" /></template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="Tài khoản"
            name="username"
            :rules="[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]"
          >
            <a-input v-model:value="formState.username" size="large" placeholder="Tên đăng nhập">
              <template #prefix><UserOutlined class="text-gray-400" /></template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="Mật khẩu"
            name="password"
            :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]"
          >
            <a-input-password v-model:value="formState.password" size="large" placeholder="Mật khẩu">
              <template #prefix><LockOutlined class="text-gray-400" /></template>
            </a-input-password>
          </a-form-item>

          <a-form-item class="mt-6">
            <a-button type="primary" html-type="submit" size="large" class="w-full" :loading="loading">
              Đăng ký
            </a-button>
            <div class="text-center mt-4">
              <span class="text-gray-500">Đã có tài khoản? </span>
              <a @click="toggleMode('login')" class="text-blue-600 font-bold hover:underline cursor-pointer">Đăng nhập</a>
            </div>
          </a-form-item>
        </a-form>
      </div>

      <!-- OTP Form -->
      <div v-if="mode === 'otp'">
        <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p class="text-sm text-blue-700 m-0 text-center">
            Mã OTP đã được gửi đến <strong>{{ formState.email }}</strong>. Vui lòng nhập mã để hoàn tất.
          </p>
        </div>

        <a-form :model="formState" name="otp_form" @finish="onVerifyOtp" layout="vertical">
          <a-form-item
            label="Mã OTP"
            name="otp"
            :rules="[{ required: true, message: 'Vui lòng nhập mã OTP!' }]"
          >
            <a-input v-model:value="formState.otp" size="large" placeholder="Nhập mã 6 chữ số">
              <template #prefix><SafetyOutlined class="text-gray-400" /></template>
            </a-input>
          </a-form-item>

          <a-form-item class="mt-6">
            <a-button type="primary" html-type="submit" size="large" class="w-full" :loading="loading">
              Xác thực tài khoản
            </a-button>
            <div class="text-center mt-4">
              <a @click="mode = 'register'" class="text-gray-500 flex items-center justify-center gap-1 hover:text-blue-600 cursor-pointer">
                <ArrowLeftOutlined class="text-xs" /> Quay lại đăng ký
              </a>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
