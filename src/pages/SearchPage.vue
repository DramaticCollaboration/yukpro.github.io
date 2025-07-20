<template>
  <q-page class="bg-grey-1">
    <!-- 검색 헤더 -->
    <div class="bg-white q-pa-md shadow-1">
      <div class="row items-center q-gutter-md">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="$router.go(-1)"
        />
        <q-input
          v-model="searchQuery"
          placeholder="상품을 검색해보세요 (예: 한우, 등심)"
          outlined
          dense
          bg-color="grey-2"
          class="col-grow"
          @keyup.enter="performSearch"
          @input="onSearchInput"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append v-if="searchQuery">
            <q-btn
              flat
              round
              dense
              icon="clear"
              @click="clearSearch"
            />
          </template>
        </q-input>
        <q-btn
          color="primary"
          label="검색"
          @click="performSearch"
          :loading="isSearching"
        />
      </div>

      <!-- 최근 검색어 -->
      <div v-if="!searchQuery && recentSearches.length > 0" class="q-mt-md">
        <div class="text-body2 text-grey-7 q-mb-sm">최근 검색어</div>
        <div class="row q-gutter-xs">
          <q-chip
            v-for="term in recentSearches"
            :key="term"
            clickable
            removable
            color="grey-3"
            text-color="grey-8"
            @click="searchQuery = term; performSearch()"
            @remove="removeRecentSearch(term)"
          >
            {{ term }}
          </q-chip>
        </div>
      </div>
    </div>

    <!-- 필터링 및 정렬 -->
    <div v-if="searchResults.length > 0 || hasSearched" class="bg-white q-pa-md q-mt-sm shadow-1">
      <div class="row items-center justify-between">
        <div class="text-body2 text-grey-7">
          <span v-if="searchResults.length > 0">
            총 <span class="text-weight-bold text-primary">{{ searchResults.length }}</span>개 상품
          </span>
          <span v-else-if="hasSearched">
            검색 결과가 없습니다
          </span>
        </div>

        <div class="row q-gutter-sm">
          <!-- 카테고리 필터 -->
          <q-select
            v-model="selectedCategory"
            :options="categoryOptions"
            label="카테고리"
            outlined
            dense
            style="min-width: 120px"
            @update:model-value="applyFilters"
          />

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
          v-if="selectedCategory?.value !== 'all'"
          removable
          color="primary"
          text-color="white"
          @remove="selectedCategory = categoryOptions[0]; applyFilters()"
        >
          {{ selectedCategory?.label }}
        </q-chip>
        <q-chip
          v-if="selectedPriceRange?.value !== 'all'"
          removable
          color="primary"
          text-color="white"
          @remove="selectedPriceRange = priceRangeOptions[0]; applyFilters()"
        >
          {{ selectedPriceRange?.label }}
        </q-chip>
      </div>
    </div>

    <!-- 검색 결과 -->
    <div v-if="hasSearched" class="q-pa-md">
      <!-- 검색 결과가 있는 경우 -->
      <div v-if="filteredResults.length > 0" class="row q-gutter-md">
        <q-card
          v-for="product in paginatedResults"
          :key="product.id"
          class="col-12 col-sm-6 col-md-4 cursor-pointer product-card"
          @click="viewProduct(product.id)"
        >
          <q-img
            :src="product.image"
            ratio="4/3"
            class="rounded-borders"
          >
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
            <div v-if="product.stock < 10" class="absolute-top-left q-ma-xs">
              <q-chip
                dense
                color="red"
                text-color="white"
                icon="warning"
              >
                품절임박
              </q-chip>
            </div>
          </q-img>

          <q-card-section>
            <div class="text-subtitle1 text-weight-bold" v-html="highlightSearchTerm(product.name)"></div>
            <div class="text-h6 text-primary q-mt-xs">
              {{ product.price.toLocaleString() }}원/kg
            </div>
            <div class="text-body2 text-grey-7 q-mt-xs" v-html="highlightSearchTerm(product.description)"></div>

            <!-- 상품 등급/원산지 정보 -->
            <div class="q-mt-sm">
              <q-chip
                v-if="product.grade"
                dense
                color="amber"
                text-color="white"
                class="q-mr-xs"
              >
                {{ product.grade }}
              </q-chip>
              <q-chip
                dense
                color="grey-5"
                text-color="white"
              >
                {{ product.origin }}
              </q-chip>
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
              label="장바구니"
              @click.stop="addToCart(product)"
              :disable="product.stock === 0"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- 검색 결과가 없는 경우 -->
      <div v-else-if="searchResults.length === 0" class="text-center q-py-xl">
        <q-icon name="search_off" size="80px" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">
          "{{ searchQuery }}"에 대한 검색 결과가 없습니다
        </div>
        <div class="text-body2 text-grey-5 q-mt-sm">
          다른 검색어를 시도해보세요
        </div>

        <!-- 추천 상품 -->
        <div class="q-mt-xl">
          <div class="text-h6 q-mb-md">추천 상품</div>
          <div class="row justify-center q-gutter-md">
            <q-card
              v-for="product in recommendedProducts.slice(0, 3)"
              :key="product.id"
              class="cursor-pointer"
              style="width: 200px"
              @click="viewProduct(product.id)"
            >
              <q-img
                :src="product.image"
                ratio="4/3"
              >
                <div class="absolute-bottom-right q-ma-xs">
                  <q-chip dense color="primary" text-color="white">
                    최소 5kg
                  </q-chip>
                </div>
              </q-img>
              <q-card-section>
                <div class="text-subtitle2 text-weight-bold">{{ product.name }}</div>
                <div class="text-body2 text-primary">{{ product.price.toLocaleString() }}원/kg</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="filteredResults.length > itemsPerPage" class="row justify-center q-mt-xl">
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

    <!-- 검색하지 않은 초기 상태 -->
    <div v-else class="q-pa-md">
      <!-- 인기 검색어 -->
      <div class="q-mb-xl">
        <div class="text-h6 q-mb-md">인기 검색어</div>
        <div class="row q-gutter-sm">
          <q-chip
            v-for="(term, index) in popularSearchTerms"
            :key="term"
            clickable
            color="primary"
            outline
            @click="searchQuery = term; performSearch()"
          >
            <span class="text-weight-bold q-mr-xs">{{ index + 1 }}</span>
            {{ term }}
          </q-chip>
        </div>
      </div>

      <!-- 카테고리별 추천 상품 -->
      <div class="q-mb-xl">
        <div class="text-h6 q-mb-md">카테고리별 인기 상품</div>

        <q-tabs
          v-model="featuredCategory"
          dense
          class="text-grey q-mb-md"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="beef" label="🐄 소고기" />
          <q-tab name="pork" label="🐷 돼지고기" />
          <q-tab name="chicken" label="🐔 닭고기" />
        </q-tabs>

        <div class="row q-gutter-md">
          <q-card
            v-for="product in getFeaturedProducts(featuredCategory)"
            :key="product.id"
            class="col-12 col-sm-6 col-md-4 cursor-pointer"
            @click="viewProduct(product.id)"
          >
            <q-img
              :src="product.image"
              ratio="4/3"
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
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
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
const searchQuery = ref('');
const isSearching = ref(false);
const hasSearched = ref(false);
const searchResults = ref<any[]>([]);
const currentPage = ref(1);
const itemsPerPage = 20; // 문서에서 명시된 20개/페이지
const featuredCategory = ref('beef');

// 필터 옵션
const selectedCategory = ref({ label: '전체', value: 'all' });
const selectedPriceRange = ref({ label: '전체', value: 'all' });
const selectedSort = ref({ label: '인기순', value: 'popular' });

const categoryOptions = [
  { label: '전체', value: 'all' },
  { label: '소고기', value: 'beef' },
  { label: '돼지고기', value: 'pork' },
  { label: '닭고기', value: 'chicken' }
];

const priceRangeOptions = [
  { label: '전체', value: 'all' },
  { label: '1만원 이하', value: '0-10000' },
  { label: '1-3만원', value: '10000-30000' },
  { label: '3-5만원', value: '30000-50000' },
  { label: '5만원 이상', value: '50000-999999' }
];

const sortOptions = [
  { label: '인기순', value: 'popular' },
  { label: '가격 낮은순', value: 'price_asc' },
  { label: '가격 높은순', value: 'price_desc' },
  { label: '최신순', value: 'newest' }
];

// 최근 검색어 및 인기 검색어
const recentSearches = ref<string[]>(['한우', '등심', '삼겹살']);
const popularSearchTerms = ref(['한우 등심', '돼지 삼겹살', '닭가슴살', '소갈비', '목살']);

// 샘플 데이터
const allProducts = ref([
  {
    id: 1,
    name: '한우 등심 A++',
    price: 85000,
    description: '1++ 등급 한우 등심, 마블링 우수',
    image: 'https://placehold.co/400x300/FF6B6B/FFFFFF?text=한우+등심',
    category: 'beef',
    grade: '1++',
    origin: '국내산',
    stock: 50
  },
  {
    id: 2,
    name: '돼지 삼겹살',
    price: 15000,
    description: '국내산 신선한 삼겹살',
    image: 'https://placehold.co/400x300/4ECDC4/FFFFFF?text=돼지+삼겹살',
    category: 'pork',
    grade: '1등급',
    origin: '국내산',
    stock: 5
  },
  {
    id: 3,
    name: '닭가슴살',
    price: 8000,
    description: '신선한 닭가슴살, 프로틴 풍부',
    image: 'https://placehold.co/400x300/45B7D1/FFFFFF?text=닭가슴살',
    category: 'chicken',
    grade: '1등급',
    origin: '국내산',
    stock: 30
  },
  {
    id: 4,
    name: '한우 갈비',
    price: 65000,
    description: '한우 LA갈비, 구이용',
    image: 'https://placehold.co/400x300/96CEB4/FFFFFF?text=한우+갈비',
    category: 'beef',
    grade: '1+',
    origin: '국내산',
    stock: 20
  },
  {
    id: 5,
    name: '돼지 목살',
    price: 18000,
    description: '고기 질이 좋은 목살',
    image: 'https://placehold.co/400x300/FFEAA7/FFFFFF?text=돼지+목살',
    category: 'pork',
    grade: '1등급',
    origin: '국내산',
    stock: 15
  }
]);

const recommendedProducts = ref([
  {
    id: 101,
    name: '추천 한우',
    price: 75000,
    image: 'https://placehold.co/400x300/DDA0DD/FFFFFF?text=추천+한우'
  },
  {
    id: 102,
    name: '추천 삼겹살',
    price: 12000,
    image: 'https://placehold.co/400x300/98D8C8/FFFFFF?text=추천+삼겹살'
  },
  {
    id: 103,
    name: '추천 닭고기',
    price: 7000,
    image: 'https://placehold.co/400x300/F7DC6F/FFFFFF?text=추천+닭고기'
  }
]);

// 계산된 속성
const hasActiveFilters = computed(() => {
  return selectedCategory.value?.value !== 'all' ||
    selectedPriceRange.value?.value !== 'all';
});

const filteredResults = computed(() => {
  let filtered = [...searchResults.value];

  // 카테고리 필터
  if (selectedCategory.value?.value !== 'all') {
    filtered = filtered.filter(product => product.category === selectedCategory.value?.value);
  }

  // 가격 필터
  if (selectedPriceRange.value?.value !== 'all') {
    const [min, max] = selectedPriceRange.value?.value.split('-').map(Number);
    filtered = filtered.filter(product => product.price >= min && product.price <= max);
  }

  // 정렬
  const sortValue = selectedSort.value?.value;
  if (sortValue === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'newest') {
    filtered.sort((a, b) => b.id - a.id);
  }

  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredResults.value.length / itemsPerPage);
});

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredResults.value.slice(start, end);
});

// 메서드
const performSearch = async () => {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;
  hasSearched.value = true;

  try {
    // 실제 API 호출 대신 로컬 필터링
    await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션

    searchResults.value = allProducts.value.filter(product =>
      product.name.includes(searchQuery.value) ||
      product.description.includes(searchQuery.value)
    );

    // 최근 검색어에 추가
    if (!recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.unshift(searchQuery.value);
      if (recentSearches.value.length > 5) {
        recentSearches.value.pop();
      }
    }

    currentPage.value = 1; // 검색 시 첫 페이지로

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '검색 중 오류가 발생했습니다'
    });
  } finally {
    isSearching.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  hasSearched.value = false;
  currentPage.value = 1;
};

const onSearchInput = () => {
  // 실시간 검색 (디바운스 적용 가능)
  if (searchQuery.value.length >= 2) {
    // performSearch();
  }
};

const applyFilters = () => {
  currentPage.value = 1;
};

const removeRecentSearch = (term: string) => {
  const index = recentSearches.value.indexOf(term);
  if (index > -1) {
    recentSearches.value.splice(index, 1);
  }
};

const highlightSearchTerm = (text: string) => {
  if (!searchQuery.value || !text) return text;

  const regex = new RegExp(`(${searchQuery.value})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-3">$1</mark>');
};

const getFeaturedProducts = (category: string) => {
  return allProducts.value.filter(product => product.category === category).slice(0, 3);
};

const viewProduct = (productId: number) => {
  router.push(`/products/${productId}`);
};

const addToCart = (product: any) => {
  $q.notify({
    type: 'positive',
    message: `${product.name}이(가) 장바구니에 추가되었습니다`,
    timeout: 2000
  });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 생명주기
onMounted(() => {
  // URL 쿼리에서 검색어 가져오기
  const query = route.query.q as string;
  if (query) {
    searchQuery.value = query;
    performSearch();
  }
});

// 라우트 쿼리 변경 감시
watch(() => route.query.q, (newQuery) => {
  if (newQuery && newQuery !== searchQuery.value) {
    searchQuery.value = newQuery as string;
    performSearch();
  }
});
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

:deep(mark) {
  background-color: #fff59d !important;
  padding: 0 2px;
  border-radius: 2px;
}

.q-chip--clickable:hover {
  opacity: 0.8;
}
</style>
