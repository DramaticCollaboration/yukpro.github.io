<template>
  <q-page class="bg-grey-1 min-h-screen">
    <!-- PWA 설치 배너 (5초 후 표시) -->
    <transition name="slide-down">
      <div
        v-if="showPWABanner"
        class="bg-orange-2 text-orange-9 q-pa-sm text-center"
      >
        <q-icon name="download" class="q-mr-xs" />
        앱으로 설치하여 더 편리하게 이용하세요
        <q-btn
          flat
          dense
          icon="close"
          class="float-right"
          @click="closePWABanner"
        />
      </div>
    </transition>

    <!-- 검색 -->
    <div class="q-pa-md">
      <q-input
        v-model="searchKeyword"
        placeholder="상품을 검색해보세요 (예: 한우, 등심)"
        outlined
        bg-color="white"
        @keyup.enter="searchProducts"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- 카테고리 탭 -->
    <div class="q-pa-md">
      <q-tabs
        v-model="selectedCategory"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="beef" label="소" />
        <q-tab name="pork" label="돼지" />
        <q-tab name="chicken" label="닭" />
      </q-tabs>
    </div>

    <!-- 주요 기능 소개 -->
    <div class="q-pa-md">
      <div class="text-h6 q-mb-md">왜 Yukpro인가요?</div>
      <div class="row q-gutter-md">
        <q-card class="col-12 col-sm-4">
          <q-card-section class="text-center">
            <q-icon name="scale" size="48px" color="primary" />
            <div class="text-subtitle1 q-mt-sm text-weight-bold">5kg 단위 소량 주문</div>
            <div class="text-body2 text-grey-7">
              대량 구매 부담 없이<br>필요한 만큼만 주문
            </div>
          </q-card-section>
        </q-card>

        <q-card class="col-12 col-sm-4">
          <q-card-section class="text-center">
            <q-icon name="verified" size="48px" color="green" />
            <div class="text-subtitle1 q-mt-sm text-weight-bold">사업자 인증</div>
            <div class="text-body2 text-grey-7">
              OCR 기반 자동 인증<br>세금계산서 발행
            </div>
          </q-card-section>
        </q-card>

        <q-card class="col-12 col-sm-4">
          <q-card-section class="text-center">
            <q-icon name="local_shipping" size="48px" color="orange" />
            <div class="text-subtitle1 q-mt-sm text-weight-bold">실시간 배송 추적</div>
            <div class="text-body2 text-grey-7">
              CJ 대한통운 연동<br>배송 상태 실시간 확인
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 인기 상품 -->
    <div class="q-pa-md">
      <div class="text-h6 q-mb-md">인기 상품</div>
      <div class="row q-gutter-md">
        <q-card
          v-for="product in popularProducts"
          :key="product.id"
          class="col-12 col-sm-6 cursor-pointer"
          @click="viewProduct(product.id)"
        >
          <q-img
            :src="product.image"
            ratio="4/3"
            class="rounded-borders"
          >
            <div class="absolute-bottom-right q-ma-xs">
              <q-chip dense color="primary" text-color="white">
                최소 5kg
              </q-chip>
            </div>
          </q-img>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">{{ product.name }}</div>
            <div class="text-h6 text-primary">{{ product.price.toLocaleString() }}원/kg</div>
            <div class="text-caption text-grey-7">{{ product.description }}</div>
          </q-card-section>
          <q-card-actions>
            <q-btn
              flat
              color="primary"
              label="상세보기"
              @click.stop="viewProduct(product.id)"
            />
            <q-space />
            <q-btn
              color="primary"
              label="장바구니"
              @click.stop="addToCart(product)"
              :disable="!isAuthenticated"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- 언박싱 리뷰 섹션 -->
    <div class="q-pa-md bg-grey-2">
      <div class="text-h6 q-mb-md">고객 언박싱 리뷰</div>
      <div class="text-body2 text-grey-7 q-mb-md">
        실제 구매 고객들의 언박싱 영상과 이미지를 확인하세요
      </div>
      <div class="row q-gutter-md">
        <q-card
          v-for="review in unboxingReviews"
          :key="review.id"
          class="col-12 col-sm-6"
        >
          <q-img
            :src="review.thumbnail"
            ratio="16/9"
            class="rounded-borders"
          >
            <div class="absolute-center">
              <q-btn
                fab
                color="white"
                text-color="primary"
                icon="play_arrow"
                @click="playReview(review.id)"
              />
            </div>
          </q-img>
          <q-card-section>
            <div class="text-subtitle2">{{ review.productName }}</div>
            <div class="text-caption text-grey-7">{{ review.customerName }} • {{ review.date }}</div>
            <div class="q-mt-sm">
              <q-chip
                v-if="review.type === 'video'"
                dense
                color="red"
                text-color="white"
              >
                영상 리뷰 +500P
              </q-chip>
              <q-chip
                v-else
                dense
                color="blue"
                text-color="white"
              >
                이미지 리뷰 +300P
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 하단 액션 버튼 -->
    <div class="fixed-bottom q-pa-md bg-white" style="box-shadow: 0 -2px 8px rgba(0,0,0,0.1)">
      <div class="row q-gutter-sm">
        <q-btn
          v-if="!isAuthenticated"
          color="primary"
          label="사업자 인증하기"
          class="col"
          @click="goToRegister"
        />
        <template v-else>
          <q-btn
            flat
            color="primary"
            label="전체 상품"
            class="col"
            @click="goToProducts"
          />
          <q-btn
            color="primary"
            label="주문하기"
            class="col"
            @click="goToCart"
          />
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

// 반응형 데이터
const searchKeyword = ref('');
const selectedCategory = ref('beef');
const showPWABanner = ref(false);
const isAuthenticated = ref(false); // 실제로는 store에서 관리

// 인기 상품 데이터
const popularProducts = ref([
  {
    id: 1,
    name: '한우 등심',
    price: 85000,
    description: '1++ 등급 한우 등심, 마블링 우수',
    image: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=한우+등심'
  },
  {
    id: 2,
    name: '돼지 삼겹살',
    price: 15000,
    description: '국내산 신선한 삼겹살',
    image: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=돼지+삼겹살'
  }
]);

// 언박싱 리뷰 데이터
const unboxingReviews = ref([
  {
    id: 1,
    productName: '한우 등심 10kg',
    customerName: '김사장님',
    date: '2024.07.15',
    type: 'video',
    thumbnail: 'https://via.placeholder.com/400x225/FF6B6B/FFFFFF?text=언박싱+영상'
  },
  {
    id: 2,
    productName: '돼지 삼겹살 5kg',
    customerName: '박셰프님',
    date: '2024.07.18',
    type: 'image',
    thumbnail: 'https://via.placeholder.com/400x225/4ECDC4/FFFFFF?text=언박싱+이미지'
  }
]);

// 메서드들
const searchProducts = async () => {
  if (searchKeyword.value.trim()) {
    await router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`);
  }
};

const viewProduct = async (productId: number) => {
  await router.push(`/products/${productId}`);
};

const addToCart = (product: any) => {
  if (!isAuthenticated.value) {
    $q.notify({
      type: 'warning',
      message: '사업자 인증 후 이용 가능합니다',
      actions: [
        {
          label: '인증하기',
          color: 'white',
          handler: () => goToRegister()
        }
      ]
    });
    return;
  }

  $q.notify({
    type: 'positive',
    message: `${product.name}이(가) 장바구니에 추가되었습니다`,
    timeout: 2000
  });
};

const playReview = (reviewId: number) => {
  $q.notify({
    message: '언박싱 리뷰 재생 기능 준비 중입니다',
    timeout: 2000
  });
};

const closePWABanner = () => {
  showPWABanner.value = false;
};

const goToRegister = async () => {
  await router.push('/auth/register');
};

const goToProducts = async () => {
  await router.push(`/products?category=${selectedCategory.value}`);
};

const goToCart = async () => {
  await router.push('/cart');
};

// 생명주기
onMounted(() => {
  // PWA 배너 5초 후 표시
  setTimeout(() => {
    showPWABanner.value = true;
  }, 5000);

  // 실제로는 토큰 확인 로직
  // isAuthenticated.value = !!localStorage.getItem('auth_token');
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.min-h-screen {
  min-height: calc(100vh - 120px);
  padding-bottom: 80px;
}
</style>
