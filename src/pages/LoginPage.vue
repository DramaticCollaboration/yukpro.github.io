<template>
  <q-page class="bg-primary flex flex-center min-h-screen">
    <q-card class="login-card q-pa-lg">
      <!-- 로고 및 타이틀 -->
      <q-card-section class="text-center q-pb-md">
        <div class="text-h4 text-weight-bold text-primary q-mb-sm">
          🥩 육프로
        </div>
        <div class="text-subtitle1 text-grey-7">
          B2B 축산물 유통 플랫폼
        </div>
        <div class="text-body2 text-grey-6 q-mt-sm">
          사업자 계정으로 로그인하세요
        </div>
      </q-card-section>

      <!-- 로그인 폼 -->
      <q-card-section>
        <q-form @submit="handleLogin" @reset="handleReset" class="q-gutter-md">
          <!-- 이메일 입력 -->
          <q-input
            v-model="loginForm.email"
            type="email"
            label="이메일"
            outlined
            :rules="emailRules"
            :error="hasEmailError"
            :error-message="emailErrorMessage"
            @input="clearFieldError('email')"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <!-- 비밀번호 입력 -->
          <q-input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            label="비밀번호"
            outlined
            :rules="passwordRules"
            :error="hasPasswordError"
            :error-message="passwordErrorMessage"
            @input="clearFieldError('password')"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- 로그인 유지 및 비밀번호 찾기 -->
          <div class="row items-center justify-between">
            <q-checkbox
              v-model="rememberMe"
              label="로그인 유지"
              color="primary"
            />
            <q-btn
              flat
              dense
              color="primary"
              label="비밀번호 찾기"
              @click="goToForgotPassword"
            />
          </div>

          <!-- 에러 메시지 -->
          <div v-if="authStore.error" class="text-center">
            <q-banner dense rounded class="bg-red-1 text-red-8">
              <template v-slot:avatar>
                <q-icon name="error" color="red" />
              </template>
              {{ authStore.error }}
              <template v-slot:action>
                <q-btn
                  flat
                  dense
                  icon="close"
                  @click="authStore.clearError"
                />
              </template>
            </q-banner>
          </div>

          <!-- 로그인 버튼 -->
          <div class="q-pt-md">
            <q-btn
              type="submit"
              color="primary"
              size="lg"
              class="full-width"
              :loading="authStore.isLoading"
              :disable="!isFormValid"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                로그인 중...
              </template>
              로그인
            </q-btn>
          </div>

          <!-- 구분선 -->
          <q-separator class="q-my-lg" />

          <!-- 회원가입 링크 -->
          <div class="text-center">
            <div class="text-body2 text-grey-7 q-mb-sm">
              아직 계정이 없으신가요?
            </div>
            <q-btn
              flat
              color="primary"
              label="사업자 인증하기"
              @click="goToRegister"
              icon="business"
            />
          </div>
        </q-form>
      </q-card-section>

      <!-- 테스트 계정 안내 (개발용) -->
      <q-card-section class="bg-grey-1 q-mt-md">
        <div class="text-caption text-grey-7 text-center">
          <div class="text-weight-bold q-mb-xs">테스트 계정</div>
          <div>이메일: test@yukpro.com</div>
          <div>비밀번호: test123</div>
          <q-btn
            flat
            dense
            size="sm"
            color="primary"
            label="테스트 계정으로 로그인"
            @click="fillTestAccount"
            class="q-mt-xs"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- PWA 설치 유도 -->
    <div class="fixed-bottom-right q-pa-md">
      <q-btn
        fab
        icon="download"
        color="orange"
        @click="showInstallPrompt"
      >
        <q-tooltip>앱으로 설치하기</q-tooltip>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();

// 반응형 데이터
const loginForm = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
const rememberMe = ref(false);
const fieldErrors = ref<{[key: string]: string}>({});

// 유효성 검사 규칙
const emailRules = [
  (val: string) => !!val || '이메일을 입력해주세요',
  (val: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(val) || '올바른 이메일 형식이 아닙니다';
  }
];

const passwordRules = [
  (val: string) => !!val || '비밀번호를 입력해주세요',
  (val: string) => val.length >= 6 || '비밀번호는 6자 이상이어야 합니다'
];

// 계산된 속성
const isFormValid = computed(() => {
  return loginForm.value.email &&
    loginForm.value.password &&
    loginForm.value.email.includes('@') &&
    loginForm.value.password.length >= 6;
});

const hasEmailError = computed(() => {
  return !!fieldErrors.value.email;
});

const emailErrorMessage = computed(() => {
  return fieldErrors.value.email;
});

const hasPasswordError = computed(() => {
  return !!fieldErrors.value.password;
});

const passwordErrorMessage = computed(() => {
  return fieldErrors.value.password;
});

// 메서드
const handleLogin = async () => {
  // 폼 유효성 검사
  if (!validateForm()) {
    return;
  }

  try {
    const success = await authStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    });

    if (success) {
      $q.notify({
        type: 'positive',
        message: '로그인되었습니다',
        icon: 'check_circle'
      });

      // 리디렉션 처리
      const redirectTo = route.query.redirect as string || '/';
      router.replace(redirectTo);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

const handleReset = () => {
  loginForm.value = {
    email: '',
    password: ''
  };
  fieldErrors.value = {};
  authStore.clearError();
};

const validateForm = (): boolean => {
  fieldErrors.value = {};

  // 이메일 검증
  if (!loginForm.value.email) {
    fieldErrors.value.email = '이메일을 입력해주세요';
  } else if (!loginForm.value.email.includes('@')) {
    fieldErrors.value.email = '올바른 이메일 형식이 아닙니다';
  }

  // 비밀번호 검증
  if (!loginForm.value.password) {
    fieldErrors.value.password = '비밀번호를 입력해주세요';
  } else if (loginForm.value.password.length < 6) {
    fieldErrors.value.password = '비밀번호는 6자 이상이어야 합니다';
  }

  return Object.keys(fieldErrors.value).length === 0;
};

const clearFieldError = (field: string) => {
  if (fieldErrors.value[field]) {
    delete fieldErrors.value[field];
  }
  if (authStore.error) {
    authStore.clearError();
  }
};

const fillTestAccount = () => {
  loginForm.value = {
    email: 'test@yukpro.com',
    password: 'test123'
  };
  fieldErrors.value = {};
  authStore.clearError();
};

const goToRegister = () => {
  router.push('/auth/register');
};

const goToForgotPassword = () => {
  router.push('/auth/forgot-password');
};

const showInstallPrompt = () => {
  $q.notify({
    message: '브라우저에서 "홈 화면에 추가"를 선택하여 앱을 설치할 수 있습니다',
    multiLine: true,
    timeout: 5000,
    icon: 'info'
  });
};

// 생명주기
onMounted(() => {
  // 이미 로그인된 경우 메인 페이지로 리디렉션
  if (authStore.isAuthenticated) {
    const redirectTo = route.query.redirect as string || '/';
    router.replace(redirectTo);
  }

  // 로그인 유지 설정 불러오기
  rememberMe.value = localStorage.getItem('remember_me') === 'true';

  if (rememberMe.value) {
    const savedEmail = localStorage.getItem('saved_email');
    if (savedEmail) {
      loginForm.value.email = savedEmail;
    }
  }
});

// 로그인 유지 감시
import { watch } from 'vue';
watch(rememberMe, (newValue) => {
  localStorage.setItem('remember_me', newValue.toString());

  if (newValue && loginForm.value.email) {
    localStorage.setItem('saved_email', loginForm.value.email);
  } else {
    localStorage.removeItem('saved_email');
  }
});

watch(() => loginForm.value.email, (newEmail) => {
  if (rememberMe.value && newEmail) {
    localStorage.setItem('saved_email', newEmail);
  }
});
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.fixed-bottom-right {
  position: fixed;
  bottom: 0;
  right: 0;
}

@media (max-width: 600px) {
  .login-card {
    margin: 16px;
    max-width: none;
  }
}
</style>
