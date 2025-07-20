import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  businessNumber: string;
  businessName: string;
  contactName: string;
  contactPhone: string;
  isVerified: boolean;
  createdAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const useAuthStore = defineStore('auth', () => {
  // 상태
  const isAuthenticated = ref(false);
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // 초기화 - 로컬 스토리지에서 토큰 확인
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
      isAuthenticated.value = true;

      // axios 기본 헤더 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  };

  // 로그인
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      // 실제 API 호출 대신 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 임시 응답 데이터 (실제로는 API에서 받아옴)
      const response: LoginResponse = {
        token: 'jwt_token_example_' + Date.now(),
        user: {
          id: 1,
          email: credentials.email,
          businessNumber: '123-45-67890',
          businessName: '육프로 테스트 업체',
          contactName: '김사장',
          contactPhone: '010-1234-5678',
          isVerified: true,
          createdAt: new Date().toISOString()
        }
      };

      // 실제 API 호출 코드 (주석 처리)
      /*
      const response = await axios.post('/api/auth/login', credentials);
      const { token: authToken, user: userData } = response.data;
      */

      // 상태 업데이트
      token.value = response.token;
      user.value = response.user;
      isAuthenticated.value = true;

      // 로컬 스토리지에 저장
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));

      // axios 기본 헤더 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || '로그인에 실패했습니다.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 로그아웃
  const logout = () => {
    // 상태 초기화
    isAuthenticated.value = false;
    user.value = null;
    token.value = null;
    error.value = null;

    // 로컬 스토리지 정리
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // axios 헤더 제거
    delete axios.defaults.headers.common['Authorization'];
  };

  // 토큰 유효성 검증
  const validateToken = async (): Promise<boolean> => {
    if (!token.value) return false;

    try {
      // 실제 API 호출로 토큰 검증
      // const response = await axios.get('/api/auth/verify');
      // return response.status === 200;

      // 임시로 true 반환 (실제로는 API 검증 결과)
      return true;
    } catch {
      logout();
      return false;
    }
  };

  // 에러 초기화
  const clearError = () => {
    error.value = null;
  };

  return {
    // 상태
    isAuthenticated,
    user,
    token,
    isLoading,
    error,

    // 액션
    initializeAuth,
    login,
    logout,
    validateToken,
    clearError
  };
});
