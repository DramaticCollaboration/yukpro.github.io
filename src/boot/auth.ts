import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth-store';

export default boot(({ app, router }) => {
  const authStore = useAuthStore();

  // 앱 시작 시 인증 상태 초기화
  authStore.initializeAuth();

  // 라우터 네비게이션 가드 설정
  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta?.requiresAuth);

    if (requiresAuth && !authStore.isAuthenticated) {
      // 인증이 필요한 페이지인데 로그인하지 않은 경우
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      });
    } else if (to.path === '/auth/login' && authStore.isAuthenticated) {
      // 이미 로그인한 상태에서 로그인 페이지 접근 시
      next('/');
    } else {
      next();
    }
  });
});
