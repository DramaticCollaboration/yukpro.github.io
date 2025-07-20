<template>
  <q-layout view="lHh Lpr lFf">
    <!-- 헤더 -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- 메뉴 버튼 (모든 화면 크기에서 표시) -->
        <q-btn
          flat
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="q-mr-sm"
        />

        <!-- 로고 -->
        <q-toolbar-title class="cursor-pointer" @click="goToHome">
          <div class="row items-center q-gutter-sm">
            <span class="text-h5">🥩</span>
            <span class="text-weight-bold">육프로</span>
          </div>
        </q-toolbar-title>

        <!-- 중앙 검색바 (데스크톱) -->
        <div class="col-4 gt-sm q-px-md">
          <q-input
            v-model="searchKeyword"
            placeholder="상품 검색..."
            outlined
            dense
            bg-color="white"
            class="search-input"
            @keyup.enter="performSearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- 우측 메뉴 -->
        <div class="row items-center q-gutter-sm">
          <!-- 알림 (로그인된 사용자만) -->
          <q-btn
            v-if="authStore.isAuthenticated"
            flat
            round
            icon="notifications"
            @click="showNotifications"
          >
            <q-badge v-if="notificationCount > 0" floating color="red">
              {{ notificationCount }}
            </q-badge>
            <q-tooltip>알림</q-tooltip>
          </q-btn>

          <!-- 장바구니 (로그인된 사용자만) -->
          <q-btn
            v-if="authStore.isAuthenticated"
            flat
            round
            icon="shopping_cart"
            @click="goToCart"
          >
            <q-badge v-if="cartCount > 0" floating color="orange">
              {{ cartCount }}
            </q-badge>
            <q-tooltip>장바구니</q-tooltip>
          </q-btn>

          <!-- 사용자 메뉴 (데스크톱만) -->
          <q-btn-dropdown
            v-if="authStore.isAuthenticated"
            flat
            no-caps
            class="user-dropdown gt-sm"
          >
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-avatar size="32px" color="white" text-color="primary">
                  <q-icon name="business" />
                </q-avatar>
                <div class="column items-start q-ml-sm">
                  <div class="text-caption text-weight-bold">
                    {{ authStore.user?.contactName || '사용자' }}님
                  </div>
                  <div class="text-caption text-grey-3">
                    {{ authStore.user?.businessName }}
                  </div>
                </div>
              </div>
            </template>

            <q-list style="min-width: 200px">
              <!-- 사업자 정보 -->
              <q-item-label header class="text-grey-8">
                <q-icon name="business" class="q-mr-sm" />
                사업자 정보
              </q-item-label>
              <q-item clickable v-close-popup @click="viewProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>프로필 관리</q-item-label>
                  <q-item-label caption>
                    {{ authStore.user?.businessNumber }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <!-- 주문/거래 -->
              <q-item-label header class="text-grey-8">
                <q-icon name="receipt" class="q-mr-sm" />
                주문/거래
              </q-item-label>
              <q-item clickable v-close-popup @click="goToOrders">
                <q-item-section avatar>
                  <q-icon name="list_alt" />
                </q-item-section>
                <q-item-section>주문 내역</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="goToInvoices">
                <q-item-section avatar>
                  <q-icon name="receipt_long" />
                </q-item-section>
                <q-item-section>세금계산서</q-item-section>
              </q-item>

              <q-separator />

              <!-- 설정 -->
              <q-item-label header class="text-grey-8">
                <q-icon name="settings" class="q-mr-sm" />
                설정
              </q-item-label>
              <q-item clickable v-close-popup @click="goToSettings">
                <q-item-section avatar>
                  <q-icon name="tune" />
                </q-item-section>
                <q-item-section>계정 설정</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="goToNotificationSettings">
                <q-item-section avatar>
                  <q-icon name="notifications" />
                </q-item-section>
                <q-item-section>알림 설정</q-item-section>
              </q-item>

              <q-separator />

              <!-- 로그아웃 -->
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="red" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-red">로그아웃</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <!-- 로그인 버튼 (비로그인 상태, 데스크톱만) -->
          <div v-else class="row q-gutter-sm gt-sm">
            <q-btn
              outline
              no-caps
              label="로그인"
              @click="goToLogin"
              class="text-white"
              style="border-color: white;"
            />
            <q-btn
              no-caps
              label="사업자 인증"
              @click="goToRegister"
              color="white"
              text-color="primary"
              class="text-weight-bold"
            />
          </div>
        </div>
      </q-toolbar>

      <!-- 모바일 검색바 -->
      <q-toolbar class="lt-md bg-primary q-py-sm">
        <q-input
          v-model="searchKeyword"
          placeholder="상품 검색..."
          outlined
          dense
          bg-color="white"
          class="full-width"
          @keyup.enter="performSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <!-- 왼쪽 드로어 (PC/모바일 모두) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list>
          <!-- 사용자 정보 (로그인 상태) -->
          <div v-if="authStore.isAuthenticated" class="q-pa-md bg-primary text-white">
            <div class="row items-center q-gutter-md">
              <q-avatar size="48px" color="white" text-color="primary">
                <q-icon name="business" />
              </q-avatar>
              <div class="col">
                <div class="text-subtitle1 text-weight-bold">
                  {{ authStore.user?.contactName || '사용자' }}님
                </div>
                <div class="text-caption">
                  {{ authStore.user?.businessName }}
                </div>
                <div class="text-caption">
                  {{ authStore.user?.businessNumber }}
                </div>
                <div class="q-mt-sm">
                  <q-chip
                    dense
                    :color="authStore.user?.isVerified ? 'green' : 'orange'"
                    text-color="white"
                    :icon="authStore.user?.isVerified ? 'verified' : 'pending'"
                  >
                    {{ authStore.user?.isVerified ? '인증완료' : '인증대기' }}
                  </q-chip>
                </div>
              </div>
            </div>
          </div>

          <!-- 비로그인 상태 -->
          <div v-else class="q-pa-md text-center">
            <div class="q-mb-md">
              <q-avatar size="64px" color="grey-4" text-color="grey-7">
                <q-icon name="person" size="32px" />
              </q-avatar>
            </div>
            <div class="text-subtitle2 text-grey-7 q-mb-md">
              로그인하여 더 많은<br>서비스를 이용하세요
            </div>
            <q-btn
              label="로그인"
              color="primary"
              class="full-width q-mb-sm"
              @click="goToLogin"
            />
            <q-btn
              label="사업자 인증"
              outline
              color="primary"
              class="full-width"
              @click="goToRegister"
            />
          </div>

          <q-separator />

          <!-- 메인 메뉴 -->
          <q-item-label header class="text-grey-8 text-weight-bold">
            <q-icon name="storefront" class="q-mr-sm" />
            상품 카테고리
          </q-item-label>
          <q-item
            clickable
            @click="goToProducts('beef')"
            :active="isActiveCategory('beef')"
          >
            <q-item-section avatar>
              <span class="text-h6">🐄</span>
            </q-item-section>
            <q-item-section>
              <q-item-label>소고기</q-item-label>
              <q-item-label caption>1++ 등급 한우부터 육우까지</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="goToProducts('pork')"
            :active="isActiveCategory('pork')"
          >
            <q-item-section avatar>
              <span class="text-h6">🐷</span>
            </q-item-section>
            <q-item-section>
              <q-item-label>돼지고기</q-item-label>
              <q-item-label caption>국내산 신선한 돼지고기</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="goToProducts('chicken')"
            :active="isActiveCategory('chicken')"
          >
            <q-item-section avatar>
              <span class="text-h6">🐔</span>
            </q-item-section>
            <q-item-section>
              <q-item-label>닭고기</q-item-label>
              <q-item-label caption>건강한 국내산 닭고기</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator v-if="authStore.isAuthenticated" />

          <!-- 로그인된 사용자 메뉴 -->
          <template v-if="authStore.isAuthenticated">
            <q-item-label header class="text-grey-8 text-weight-bold">
              <q-icon name="account_circle" class="q-mr-sm" />
              내 서비스
            </q-item-label>
            <q-item clickable @click="goToCart">
              <q-item-section avatar>
                <q-icon name="shopping_cart" />
                <q-badge v-if="cartCount > 0" floating color="orange">
                  {{ cartCount }}
                </q-badge>
              </q-item-section>
              <q-item-section>
                <q-item-label>장바구니</q-item-label>
                <q-item-label caption>주문 전 상품 확인</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="goToOrders">
              <q-item-section avatar>
                <q-icon name="list_alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>주문 내역</q-item-label>
                <q-item-label caption>배송 추적 및 주문 관리</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="goToInvoices">
              <q-item-section avatar>
                <q-icon name="receipt_long" />
              </q-item-section>
              <q-item-section>
                <q-item-label>세금계산서</q-item-label>
                <q-item-label caption>사업자 증빙 서류</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="viewProfile">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>프로필 관리</q-item-label>
                <q-item-label caption>사업자 정보 수정</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item-label header class="text-grey-8 text-weight-bold">
              <q-icon name="support_agent" class="q-mr-sm" />
              고객 지원
            </q-item-label>
            <q-item clickable @click="goToSupport">
              <q-item-section avatar>
                <q-icon name="headset_mic" />
              </q-item-section>
              <q-item-section>
                <q-item-label>고객센터</q-item-label>
                <q-item-label caption>1:1 문의 및 채팅</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="goToNotifications">
              <q-item-section avatar>
                <q-icon name="notifications" />
                <q-badge v-if="notificationCount > 0" floating color="red">
                  {{ notificationCount }}
                </q-badge>
              </q-item-section>
              <q-item-section>
                <q-item-label>알림</q-item-label>
                <q-item-label caption>주문, 배송, 재입고 알림</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="goToSettings">
              <q-item-section avatar>
                <q-icon name="tune" />
              </q-item-section>
              <q-item-section>
                <q-item-label>설정</q-item-label>
                <q-item-label caption>계정 및 알림 설정</q-item-label>
              </q-item-section>
            </q-item>

            <!-- 모바일에서만 로그아웃 버튼 -->
            <div class="lt-md">
              <q-separator />
              <q-item clickable @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="red" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-red">로그아웃</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </template>

          <q-separator />

          <!-- 하단 메뉴 -->
          <q-item-label header class="text-grey-8 text-weight-bold">
            <q-icon name="info" class="q-mr-sm" />
            서비스 정보
          </q-item-label>
          <q-item clickable @click="goToAbout">
            <q-item-section avatar>
              <q-icon name="business" />
            </q-item-section>
            <q-item-section>
              <q-item-label>서비스 소개</q-item-label>
              <q-item-label caption>육프로 플랫폼 안내</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="goToTerms">
            <q-item-section avatar>
              <q-icon name="description" />
            </q-item-section>
            <q-item-section>
              <q-item-label>이용약관</q-item-label>
              <q-item-label caption>서비스 이용 규정</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="goToPrivacy">
            <q-item-section avatar>
              <q-icon name="privacy_tip" />
            </q-item-section>
            <q-item-section>
              <q-item-label>개인정보처리방침</q-item-label>
              <q-item-label caption>개인정보 보호 정책</q-item-label>
            </q-item-section>
          </q-item>

          <!-- 앱 버전 정보 -->
          <q-item>
            <q-item-section>
              <q-item-label caption class="text-center text-grey-5">
                육프로 v1.0.0
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- 메인 컨텐츠 -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- 플로팅 고객센터 버튼 -->
    <q-page-sticky
      v-if="authStore.isAuthenticated"
      position="bottom-left"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        icon="support_agent"
        color="orange"
        @click="goToSupport"
      >
        <q-tooltip>고객센터</q-tooltip>
      </q-btn>
    </q-page-sticky>

    <!-- 알림 다이얼로그 -->
    <q-dialog v-model="showNotificationDialog" position="top">
      <q-card style="min-width: 350px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">알림</div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-list>
            <q-item
              v-for="notification in notifications"
              :key="notification.id"
              clickable
              @click="handleNotificationClick(notification)"
            >
              <q-item-section avatar>
                <q-icon
                  :name="notification.icon"
                  :color="notification.color"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ notification.title }}</q-item-label>
                <q-item-label caption>
                  {{ notification.message }}
                </q-item-label>
                <q-item-label caption class="text-grey-5">
                  {{ formatDate(notification.createdAt) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side v-if="!notification.isRead">
                <q-icon name="circle" color="primary" size="8px" />
              </q-item-section>
            </q-item>

            <q-item v-if="notifications.length === 0">
              <q-item-section class="text-center text-grey-6">
                알림이 없습니다
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-if="notifications.length > 0"
            flat
            label="모두 읽음"
            @click="markAllAsRead"
          />
          <q-btn flat label="닫기" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
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
const leftDrawerOpen = ref(false);
const searchKeyword = ref('');
const showNotificationDialog = ref(false);
const cartCount = ref(0);
const notificationCount = ref(0);

// 알림 데이터
const notifications = ref([
  {
    id: 1,
    title: '주문 배송 시작',
    message: '한우 등심 10kg 배송이 시작되었습니다.',
    icon: 'local_shipping',
    color: 'primary',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    type: 'shipping'
  },
  {
    id: 2,
    title: '결제 완료',
    message: '돼지 삼겹살 5kg 결제가 완료되었습니다.',
    icon: 'payment',
    color: 'green',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    type: 'payment'
  },
  {
    id: 3,
    title: '상품 재입고',
    message: '관심상품 "한우 갈비"가 재입고되었습니다.',
    icon: 'inventory',
    color: 'orange',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    type: 'restock'
  }
]);

// 계산된 속성
notificationCount.value = computed(() =>
  notifications.value.filter(n => !n.isRead).length
).value;

// 메서드
const performSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value.trim())}`);
    searchKeyword.value = '';
  }
};

const isActiveCategory = (category: string) => {
  return route.path === '/products' && route.query.category === category;
};

const goToHome = () => {
  router.push('/');
};

const goToLogin = () => {
  leftDrawerOpen.value = false;
  router.push('/auth/login');
};

const goToRegister = () => {
  leftDrawerOpen.value = false;
  router.push('/auth/register');
};

const goToProducts = (category: string) => {
  leftDrawerOpen.value = false;
  router.push(`/products?category=${category}`);
};

const goToCart = () => {
  leftDrawerOpen.value = false;
  if (!authStore.isAuthenticated) {
    router.push('/auth/login');
    return;
  }
  router.push('/cart');
};

const goToOrders = () => {
  leftDrawerOpen.value = false;
  router.push('/orders');
};

const goToInvoices = () => {
  leftDrawerOpen.value = false;
  router.push('/invoices');
};

const goToSettings = () => {
  router.push('/settings');
};

const goToNotificationSettings = () => {
  router.push('/settings/notifications');
};

const goToSupport = () => {
  leftDrawerOpen.value = false;
  router.push('/support');
};

const goToNotifications = () => {
  leftDrawerOpen.value = false;
  showNotificationDialog.value = true;
};

const goToAbout = () => {
  leftDrawerOpen.value = false;
  router.push('/about');
};

const goToTerms = () => {
  leftDrawerOpen.value = false;
  router.push('/terms');
};

const goToPrivacy = () => {
  leftDrawerOpen.value = false;
  router.push('/privacy');
};

const viewProfile = () => {
  router.push('/profile');
};

const showNotifications = () => {
  showNotificationDialog.value = true;
};

const handleNotificationClick = (notification: any) => {
  // 알림을 읽음으로 표시
  notification.isRead = true;
  updateNotificationCount();

  // 알림 타입에 따른 네비게이션
  switch (notification.type) {
    case 'shipping':
      router.push('/orders');
      break;
    case 'payment':
      router.push('/orders');
      break;
    case 'restock':
      // 상품 상세 페이지로 이동 (실제로는 상품 ID 필요)
      break;
    default:
      break;
  }

  showNotificationDialog.value = false;
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.isRead = true);
  updateNotificationCount();
};

const updateNotificationCount = () => {
  notificationCount.value = notifications.value.filter(n => !n.isRead).length;
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return date.toLocaleDateString('ko-KR');
};

const handleLogout = () => {
  $q.dialog({
    title: '로그아웃',
    message: '정말 로그아웃하시겠습니까?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    authStore.logout();
    $q.notify({
      type: 'positive',
      message: '로그아웃되었습니다',
      timeout: 2000
    });
    router.push('/');
  });
};

// 생명주기
onMounted(() => {
  // 장바구니 개수 초기화 (실제로는 API에서 가져옴)
  if (authStore.isAuthenticated) {
    cartCount.value = 3; // 임시 데이터
  }
});
</script>

<style scoped>
.search-input {
  border-radius: 20px;
}

.user-dropdown :deep(.q-btn-dropdown__arrow) {
  margin-left: 8px;
}

:deep(.q-toolbar) {
  min-height: 64px;
}

:deep(.q-item) {
  padding: 8px 16px;
}

:deep(.q-item__section--avatar) {
  min-width: 40px;
}

.q-layout :deep(.q-drawer) {
  .q-item {
    border-radius: 0 20px 20px 0;
    margin: 2px 8px 2px 0;
  }

  .q-item--active {
    background: rgba(25, 118, 210, 0.1);
    color: #1976d2;
  }
}

/* PC에서 드로어 스타일링 */
@media (min-width: 1024px) {
  .q-drawer {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }

  .q-drawer :deep(.q-scrollarea__content) {
    width: 100%;
  }
}

/* 모바일 최적화 */
@media (max-width: 600px) {
  .q-toolbar-title {
    font-size: 1.1rem;
  }

  :deep(.q-btn) {
    min-width: auto;
  }
}

/* 데스크톱 검색바 스타일링 */
@media (min-width: 1024px) {
  .search-input :deep(.q-field__control) {
    border-radius: 25px;
  }
}
</style>
