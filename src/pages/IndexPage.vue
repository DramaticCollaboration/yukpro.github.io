
<template>
  <q-page class="bg-grey-1 min-h-screen">
    <!-- PWA 설치 배너 (5초 후 표시) -->
    <div class="content-container">
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
      <div class="q-pa-md text-center">
        <q-input
          v-model="searchKeyword"
          placeholder="상품을 검색해보세요 (예: 한우, 등심)"
          outlined
          bg-color="white"
          @keyup.enter="searchProducts"
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- 왜 육프로인가요? -->
      <div class="q-pa-md text-center">
        <div class="text-h6 q-mb-md">왜 육프로인가요?</div>
        <div class="row q-col-gutter-md justify-center">
          <div v-for="(feature, index) in features" :key="index" class="col-12 col-sm-10 col-md-8">
            <q-card flat bordered>
              <q-card-section class="q-pa-md">
                <div class="row items-center justify-center">
                  <q-icon :name="feature.icon" size="2rem" :color="feature.color" class="q-mr-md" />
                  <div class="text-subtitle1 text-weight-medium">{{ feature.text }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- 인기 상품 -->
      <div class="q-pa-md text-center">
        <div class="text-h6 q-mb-md">인기 상품</div>
        <div class="row q-col-gutter-md justify-center">
          <div v-for="product in popularProducts" :key="product.id" class="col-12 col-sm-6 col-md-4">
            <q-card class="cursor-pointer" @click="viewProduct(product.id)">
              <q-img :src="product.image" ratio="1">
                <div class="absolute-top-right q-ma-sm">
                  <q-badge color="green" v-if="product.inStock" floating>
                    재고 있음
                  </q-badge>
                  <q-badge color="orange" v-if="product.fastDelivery" floating>
                    빠른배송
                  </q-badge>
                </div>
                <div class="absolute-bottom-right q-ma-sm">
                  <q-badge v-if="product.rating >= 4.5" color="purple" floating>
                    베스트셀러
                  </q-badge>
                </div>
              </q-img>
              <q-card-section>
                <div class="row items-center justify-between">
                  <div class="text-subtitle1 text-weight-bold">{{ product.name }}</div>
                  <div class="row items-center">
                    <q-icon name="star" color="amber" size="xs" />
                    <span class="text-caption q-ml-xs">{{ product.rating }}</span>
                  </div>
                </div>
                <div class="text-h6 text-primary q-mt-sm">{{ product.price.toLocaleString() }}원/kg</div>
                <div class="text-caption text-grey-7">{{ product.description }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- 언박싱 리뷰 -->
      <div class="q-pa-md bg-grey-2 text-center">
        <div class="text-h6 q-mb-md">실시간 언박싱 리뷰</div>
        <div class="row q-col-gutter-md justify-center">
          <div v-for="review in unboxingReviews" :key="review.id" class="col-12 col-sm-6 col-md-4">
            <q-card class="review-card">
              <q-img
                :src="review.thumbnail"
                ratio="16/9"
                class="review-thumbnail"
              >
                <template v-slot:default>
                  <div class="absolute-full flex flex-center" v-if="review.type === 'video'">
                    <q-btn round color="white" text-color="primary" icon="play_circle" size="lg" />
                  </div>
                </template>
              </q-img>
              <q-card-section class="q-pa-sm">
                <div class="row items-center justify-between">
                  <q-avatar size="40px">
                    <img :src="review.profileImage">
                  </q-avatar>
                  <div class="col q-ml-sm text-left">
                    <div class="text-subtitle2 text-weight-bold">{{ review.customerName }}</div>
                    <div class="text-caption text-grey">{{ review.date }}</div>
                  </div>
                  <q-btn flat round icon="share" size="sm" />
                </div>
                <div class="text-body2 q-mt-sm text-left">{{ review.comment }}</div>
                <div class="q-mt-sm">
                  <q-chip
                    dense
                    :color="review.verified ? 'green' : 'grey'"
                    text-color="white"
                    icon="verified"
                  >
                    인증 구매
                  </q-chip>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
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
const showPWABanner = ref(false);
const isAuthenticated = ref(false);

// 육프로 특징
const features = [
  {
    icon: 'scale',
    color: 'primary',
    text: '대량 압박 없이, 딱 5kg부터!'
  },
  {
    icon: 'phone_iphone',
    color: 'green',
    text: '모바일 웹앱으로 언제든! 세금계산서 자동 발행까지,'
  },
  {
    icon: 'visibility',
    color: 'deep-orange',
    text: '사장님, 이제 고기도 직접 보고 구매하세요! 언박싱 인증과 사업자 검증으로 투명한 육프로.'
  },
  {
    icon: 'savings',
    color: 'purple',
    text: '복잡한 유통 마진은 이제 그만! 육프로의 온라인 자동화로 운영 비용과 시간을 획기적으로 줄이세요.'
  },
  {
    icon: 'touch_app',
    color: 'blue',
    text: '매번 구매하던 고기는 \'바로 주문\'! 직관적인 화면으로 가장 편리하게 고기를 공급받으세요.'
  }
];

// 인기 상품 데이터
const popularProducts = ref([
  {
    id: 1,
    name: '한우 등심',
    price: 85000,
    description: '1++ 등급 한우 등심, 마블링 우수',
    image: 'https://placehold.co/400x400/FF6B6B/FFFFFF?text=한우+등심',
    rating: 4.8,
    inStock: true,
    fastDelivery: true
  },
  {
    id: 2,
    name: '돼지 삼겹살',
    price: 15000,
    description: '국내산 신선한 삼겹살',
    image: 'https://placehold.co/400x400/4ECDC4/FFFFFF?text=돼지+삼겹살',
    rating: 4.6,
    inStock: true,
    fastDelivery: false
  }
]);

// 언박싱 리뷰 데이터
const unboxingReviews = ref([
  {
    id: 1,
    productName: '한우 등심 10kg',
    customerName: '김사장님',
    profileImage: 'https://placehold.co/100x100/FF6B6B/FFFFFF?text=김',
    date: '2024.07.15',
    type: 'video',
    thumbnail: 'https://placehold.co/400x225/FF6B6B/FFFFFF?text=언박싱+영상',
    comment: '마블링이 정말 일정하고 신선도가 훌륭합니다.',
    verified: true
  },
  {
    id: 2,
    productName: '돼지 삼겹살 5kg',
    customerName: '박셰프님',
    profileImage: 'https://placehold.co/100x100/4ECDC4/FFFFFF?text=박',
    date: '2024.07.18',
    type: 'image',
    thumbnail: 'https://placehold.co/400x225/4ECDC4/FFFFFF?text=언박싱+이미지',
    comment: '두께가 균일하고 지방 비율이 완벽해요!',
    verified: true
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

const closePWABanner = () => {
  showPWABanner.value = false;
};

const goToRegister = async () => {
  await router.push('/auth/register');
};

const goToProducts = async () => {
  await router.push('/products');
};

const goToCart = async () => {
  await router.push('/cart');
};

onMounted(() => {
  setTimeout(() => {
    showPWABanner.value = true;
  }, 5000);
});
</script>

<style scoped>
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
}

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

.review-card {
  transition: transform 0.2s;
}

.review-card:hover {
  transform: translateY(-4px);
}

.review-thumbnail {
  border-radius: 8px 8px 0 0;
}

@media (max-width: 599px) {
  .q-card {
    margin-bottom: 16px;
  }

  .content-container {
    padding: 0 8px;
  }
}
</style>
