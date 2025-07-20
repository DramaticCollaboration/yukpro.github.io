<template>
  <q-page class="bg-grey-1">
    <!-- 카테고리 헤더 -->
    <div class="bg-white q-pa-md shadow-1 sticky-header">
      <div class="row items-center q-gutter-md">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="$router.go(-1)"
        />
        <div class="col-grow">
          <div class="text-h6 text-weight-bold row items-center">
            <span class="text-h5 q-mr-xs">{{ getCategoryIcon(currentCategory) }}</span>
            {{ getCategoryName(currentCategory) }}
          </div>
          <div class="text-caption text-grey-7">
            {{ getCategoryDescription(currentCategory) }}
          </div>
        </div>
        <q-btn
          flat
          round
          icon="search"
          @click="goToSearch"
        />
      </div>

      <!-- 카테고리 탭 -->
      <q-tabs
        v-model="currentCategory"
        dense
        class="text-grey q-mt-md"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        @update:model-value="onCategoryChange"
      >
        <q-tab name="beef" label="🐄 소고기" />
        <q-tab name="pork" label="🐷 돼지고기" />
        <q-tab name="chicken" label="🐔 닭고기" />
      </q-tabs>
    </div>

    <!-- 필터링 및 정렬 바 -->
    <div class="bg-white q-pa-md q-mt-sm shadow-1">
      <div class="row items-center justify-between">
        <div class="text-body2 text-grey-7">
          총 <span class="text-weight-bold text-primary">{{ filteredProducts.length }}</span>개 상품
        </div>

        <div class="row q-gutter-sm">
          <!-- 가격 필터 -->
          <q-select
            v-model="selectedPriceRange"
            :options="priceRangeOptions"
            label="가격대"
            outlined
            dense
            style="min-width: 120px"
            @update:model-value="applyFilters"
          />

          <!-- 등급 필터 -->
          <q-select
            v-model="selectedGrade"
            :options="gradeOptions"
            label="등급"
            outlined
            dense
            style="min-width: 100px"
            @update:model-value="applyFilters"
          />

          <!-- 정렬 -->
          <q-select
            v-model="selectedSort"
            :options="sortOptions"
            label="정렬"
            outlined
            dense
            style="min-width: 120px"
            @update:model-value="applyFilters"
          />
        </div>
      </div>

      <!-- 적용된 필터 태그 -->
      <div v-if="hasActiveFilters" class="q-mt-sm">
        <q-chip
          v-if="selectedPriceRange?.value !== 'all'"
          removable
          color="primary"
          text-color="white"
          @remove="selectedPriceRange = priceRangeOptions[0]; applyFilters()"
        >
          {{ selectedPriceRange?.label }}
        </q-chip>
        <q-chip
          v-if="selectedGrade?.value !== 'all'"
          removable
          color="primary"
          text-color="white"
          @remove="selectedGrade = gradeOptions[0]; applyFilters()"
        >
          {{ selectedGrade?.label }}
        </q-chip>
      </div>

      <!-- 5kg 단위 주문 안내 -->
      <div class="bg-blue-1 q-pa-sm q-mt-md rounded-borders">
        <div class="row items-center">
          <q-icon name="info" color="primary" class="q-mr-sm" />
          <div class="text-body2 text-primary">
            <span class="text-weight-bold">5kg 단위 주문</span> - 소량 주문으로 재고 부담을 줄이세요!
          </div>
        </div>
      </div>
    </div>

    <!-- 상품 목록 -->
    <div class="q-pa-md">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="row justify-center q-gutter-md">
        <q-skeleton
          v-for="n in 6"
          :key="n"
          class="col-12 col-sm-6 col-md-4"
          height="350px"
        />
      </div>

      <!-- 상품이 없는 경우 -->
      <div v-else-if="filteredProducts.length === 0" class="text-center q-py-xl">
        <q-icon :name="getCategoryIcon(currentCategory)" size="80px" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">
          {{ getCategoryName(currentCategory) }} 상품이 없습니다
        </div>
        <div class="text-body2 text-grey-5 q-mt-sm">
          다른 카테고리를 확인해보세요
        </div>
      </div>

      <!-- 상품 그리드 -->
      <div v-else class="row justify-center q-gutter-md">
        <q-card
          v-for="product in paginatedProducts"
          :key="product.id"
          class="col-12 col-sm-6 col-md-4 cursor-pointer product-card"
          @click="viewProduct(product.id)"
        >
          <q-img
            :src="product.image"
            ratio="4/3"
            class="rounded-borders"
          >
            <!-- 5kg 단위 뱃지 -->
            <div class="absolute-top-right q-ma-xs">
              <q-chip
                dense
                color="primary"
                text-color="white"
                icon="scale"
              >
                최소 5kg
              </q-chip>
            </div>

            <!-- 재고 상태 -->
            <div v-if="product.stock <= 10" class="absolute-top-left q-ma-xs">
              <q-chip
                dense
                :color="product.stock === 0 ? 'red' : 'orange'"
                text-color="white"
                :icon="product.stock === 0 ? 'block' : 'warning'"
              >
                {{ product.stock === 0 ? '품절' : '품절임박' }}
              </q-chip>
            </div>

            <!-- 할인 표시 -->
            <div v-if="product.discount > 0" class="absolute-bottom-left q-ma-xs">
              <q-chip
                dense
                color="red"
                text-color="white"
                icon="local_offer"
              >
                {{ product.discount }}% 할인
              </q-chip>
            </div>
          </q-img>

          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">{{ product.name }}</div>
            <div class="row items-center q-mt-xs">
              <div class="text-h6 text-primary">
                {{ getDiscountedPrice(product).toLocaleString() }}원/kg
              </div>
              <div v-if="product.discount > 0" class="text-body2 text-grey-5 text-strike q-ml-sm">
                {{ product.price.toLocaleString() }}원
              </div>
            </div>
            <div class="text-body2 text-grey-7 q-mt-xs">{{ product.description }}</div>

            <!-- 상품 정보 태그 -->
            <div class="q-mt-sm">
              <q-chip
                dense
                :color="getGradeColor(product.grade)"
                text-color="white"
                class="q-mr-xs"
              >
                {{ product.grade }}
              </q-chip>
              <q-chip
                dense
                color="grey-5"
                text-color="white"
                class="q-mr-xs"
              >
                {{ product.origin }}
              </q-chip>
              <q-chip
                v-if="product.freshness"
                dense
                color="green"
                text-color="white"
              >
                {{ product.freshness }}
              </q-chip>
            </div>

            <!-- 재고 정보 -->
            <div class="q-mt-sm text-caption text-grey-6">
              재고: {{ product.stock }}kg
            </div>
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
              :label="product.stock === 0 ? '품절' : '장바구니'"
              @click.stop="addToCart(product)"
              :disable="product.stock === 0"
            />
          </q-card-actions>

          <!-- 언박싱 리뷰 표시 -->
          <div v-if="product.reviewCount > 0" class="absolute-bottom-right q-ma-xs">
            <q-btn
              fab-mini
              color="orange"
              text-color="white"
              icon="video_library"
              @click.stop="viewReviews(product.id)"
            >
              <q-tooltip>언박싱 리뷰 {{ product.reviewCount }}개</q-tooltip>
            </q-btn>
          </div>
        </q-card>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="row justify-center q-mt-xl">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          direction-links
          boundary-links
          color="primary"
          @update:model-value="scrollToTop"
        />
      </div>
    </div>

    <!-- 플로팅 액션 버튼 -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="shopping_cart"
        color="primary"
        @click="goToCart"
      >
        <q-badge v-if="cartCount > 0" floating color="red">
          {{ cartCount }}
        </q-badge>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// 반응형 데이터
const currentCategory = ref('beef');
const isLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = 20; // 문서에서 명시된 20개/페이지
const cartCount = ref(0);

// 필터 상태
const selectedPriceRange = ref({ label: '전체', value: 'all' });
const selectedGrade = ref({ label: '전체', value: 'all' });
const selectedSort = ref({ label: '인기순', value: 'popular' });

// 필터 옵션
const priceRangeOptions = [
  { label: '전체', value: 'all' },
  { label: '1만원 이하', value: '0-10000' },
  { label: '1-3만원', value: '10000-30000' },
  { label: '3-5만원', value: '30000-50000' },
  { label: '5-10만원', value: '50000-100000' },
  { label: '10만원 이상', value: '100000-999999' }
];

const gradeOptions = [
  { label: '전체', value: 'all' },
  { label: '1++', value: '1++' },
  { label: '1+', value: '1+' },
  { label: '1등급', value: '1등급' },
  { label: '2등급', value: '2등급' }
];

const sortOptions = [
  { label: '인기순', value: 'popular' },
  { label: '가격 낮은순', value: 'price_asc' },
  { label: '가격 높은순', value: 'price_desc' },
  { label: '최신순', value: 'newest' },
  { label: '할인율순', value: 'discount' }
];

// 상품 데이터 (실제로는 API에서 가져옴)
const allProducts = ref([
  // 소고기
  {
    id: 1,
    name: '한우 등심 A++',
    price: 85000,
    discount: 10,
    description: '1++ 등급 한우 등심, 마블링 우수',
    image: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=한우+등심',
    category: 'beef',
    grade: '1++',
    origin: '국내산',
    stock: 50,
    freshness: '신선',
    reviewCount: 12
  },
  {
    id: 2,
    name: '한우 갈비',
    price: 65000,
    discount: 0,
    description: '한우 LA갈비, 구이용',
    image: 'https://via.placeholder.com/400x300/96CEB4/FFFFFF?text=한우+갈비',
    category: 'beef',
    grade: '1+',
    origin: '국내산',
    stock: 20,
    freshness: '신선',
    reviewCount: 8
  },
  {
    id: 3,
    name: '한우 불고기',
    price: 45000,
    discount: 15,
    description: '부드러운 한우 불고기용',
    image: 'https://via.placeholder.com/400x300/F8B500/FFFFFF?text=한우+불고기',
    category: 'beef',
    grade: '1등급',
    origin: '국내산',
    stock: 5,
    freshness: '신선',
    reviewCount: 15
  },

  // 돼지고기
  {
    id: 4,
    name: '돼지 삼겹살',
    price: 15000,
    discount: 5,
    description: '국내산 신선한 삼겹살',
    image: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=돼지+삼겹살',
    category: 'pork',
    grade: '1등급',
    origin: '국내산',
    stock: 80,
    freshness: '신선',
    reviewCount: 25
  },
  {
    id: 5,
    name: '돼지 목살',
    price: 18000,
    discount: 0,
    description: '고기 질이 좋은 목살',
    image: 'https://via.placeholder.com/400x300/FFEAA7/FFFFFF?text=돼지+목살',
    category: 'pork',
    grade: '1등급',
    origin: '국내산',
    stock: 15,
    freshness: '신선',
    reviewCount: 7
  },
  {
    id: 6,
    name: '돼지 등심',
    price: 22000,
    discount: 8,
    description: '부드러운 돼지 등심',
    image: 'https://via.placeholder.com/400x300/FF7675/FFFFFF?text=돼지+등심',
    category: 'pork',
    grade: '1등급',
    origin: '국내산',
    stock: 0,
    freshness: '신선',
    reviewCount: 3
  },

  // 닭고기
  {
    id: 7,
    name: '닭가슴살',
    price: 8000,
    discount: 0,
    description: '신선한 닭가슴살, 프로틴 풍부',
    image: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=닭가슴살',
    category: 'chicken',
    grade: '1등급',
    origin: '국내산',
    stock: 100,
    freshness: '신선',
    reviewCount: 18
  },
  {
    id: 8,
    name: '닭다리살',
    price: 6000,
    discount: 12,
    description: '부드러운 닭다리살',
    image: 'https://via.placeholder.com/400x300/A29BFE/FFFFFF?text=닭다리살',
    category: 'chicken',
    grade: '1등급',
    origin: '국내산',
    stock: 60,
    freshness: '신선',
    reviewCount: 9
  }
]);

// 계산된 속성
const categoryProducts = computed(() => {
  return allProducts.value.filter(product => product.category === currentCategory.value);
});

const hasActiveFilters = computed(() => {
  return selectedPriceRange.value?.value !== 'all' ||
    selectedGrade.value?.value !== 'all';
});

const filteredProducts = computed(() => {
  let filtered = [...categoryProducts.value];

  // 가격 필터
  if (selectedPriceRange.value?.value !== 'all') {
    const [min, max] = selectedPriceRange.value?.value.split('-').map(Number);
    filtered = filtered.filter(product => {
      const price = getDiscountedPrice(product);
      return price >= min && price <= max;
    });
  }

  // 등급 필터
  if (selectedGrade.value?.value !== 'all') {
    filtered = filtered.filter(product => product.grade === selectedGrade.value?.value);
  }

  // 정렬
  const sortValue = selectedSort.value?.value;
  if (sortValue === 'price_asc') {
    filtered.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
  } else if (sortValue === 'price_desc') {
    filtered.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
  } else if (sortValue === 'newest') {
    filtered.sort((a, b) => b.id - a.id);
  } else if (sortValue === 'discount') {
    filtered.sort((a, b) => b.discount - a.discount);
  }

  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

// 메서드
const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    beef: '🐄',
    pork: '🐷',
    chicken: '🐔'
  };
  return icons[category] || '🥩';
};

const getCategoryName = (category: string) => {
  const names: { [key: string]: string } = {
    beef: '소고기',
    pork: '돼지고기',
    chicken: '닭고기'
  };
  return names[category] || '전체';
};

const getCategoryDescription = (category: string) => {
  const descriptions: { [key: string]: string } = {
    beef: '1++ 등급 한우부터 육우까지',
    pork: '국내산 신선한 돼지고기',
    chicken: '건강한 국내산 닭고기'
  };
  return descriptions[category] || '';
};

const getDiscountedPrice = (product: any) => {
  return Math.round(product.price * (100 - product.discount) / 100);
};

const getGradeColor = (grade: string) => {
  const colors: { [key: string]: string } = {
    '1++': 'red',
    '1+': 'orange',
    '1등급': 'amber',
    '2등급': 'grey'
  };
  return colors[grade] || 'grey';
};

const onCategoryChange = (newCategory: string) => {
  currentPage.value = 1;
  router.replace({ query: { ...route.query, category: newCategory } });
  loadProducts();
};

const applyFilters = () => {
  currentPage.value = 1;
};

const loadProducts = async () => {
  isLoading.value = true;
  try {
    // 실제 API 호출
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '상품을 불러오는 중 오류가 발생했습니다'
    });
  } finally {
    isLoading.value = false;
  }
};

const viewProduct = (productId: number) => {
  router.push(`/products/${productId}`);
};

const addToCart = (product: any) => {
  if (product.stock === 0) {
    $q.notify({
      type: 'warning',
      message: '품절된 상품입니다'
    });
    return;
  }

  cartCount.value++;
  $q.notify({
    type: 'positive',
    message: `${product.name}이(가) 장바구니에 추가되었습니다`,
    timeout: 2000
  });
};

const viewReviews = (productId: number) => {
  router.push(`/products/${productId}/reviews`);
};

const goToSearch = () => {
  router.push('/search');
};

const goToCart = () => {
  router.push('/cart');
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 생명주기
onMounted(() => {
  // URL 파라미터에서 카테고리 가져오기
  const categoryParam = route.query.category as string;
  if (categoryParam && ['beef', 'pork', 'chicken'].includes(categoryParam)) {
    currentCategory.value = categoryParam;
  }

  loadProducts();
});

// 라우트 쿼리 변경 감시
watch(() => route.query.category, (newCategory) => {
  if (newCategory && newCategory !== currentCategory.value) {
    currentCategory.value = newCategory as string;
    loadProducts();
  }
});
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.text-strike {
  text-decoration: line-through;
}

:deep(.q-tab__label) {
  font-size: 14px;
}

.q-skeleton {
  border-radius: 8px;
}
</style>
