<template>
  <q-page>
    <!-- 제품 정보 섹션 -->
    <div class="q-pa-lg">
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="row items-center">
            <q-btn
              flat
              round
              icon="arrow_back"
              @click="$router.back()"
              class="q-mr-sm"
            />
            <div class="text-h5">제품 리뷰</div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 제품 요약 정보 -->
      <q-card class="q-mb-lg">
        <q-card-section class="row items-center">
          <q-img
            :src="product.image"
            width="80px"
            height="80px"
            class="rounded-borders q-mr-md"
            loading="lazy"
          />
          <div class="col">
            <div class="text-h6">{{ product.name }}</div>
            <div class="text-body2 text-grey-7">{{ product.description }}</div>
            <div class="text-weight-bold text-primary q-mt-xs">
              {{ formatPrice(product.price) }}원
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 리뷰 통계 -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="text-h6 q-mb-md">리뷰 통계</div>
          <div class="row items-center q-mb-md">
            <q-rating
              v-model="reviewStats.averageRating"
              readonly
              size="sm"
              color="orange"
              class="q-mr-sm"
            />
            <span class="text-h6 q-mr-sm">{{ reviewStats.averageRating }}</span>
            <span class="text-grey-7">({{ reviewStats.totalReviews }}개 리뷰)</span>
          </div>

          <!-- 평점 분포 -->
          <div class="q-mb-sm" v-for="(count, rating) in reviewStats.ratingDistribution" :key="rating">
            <div class="row items-center">
              <span class="text-body2 q-mr-sm">{{ rating }}점</span>
              <q-linear-progress
                :value="count / reviewStats.totalReviews"
                color="orange"
                class="col q-mx-sm"
                size="8px"
              />
              <span class="text-body2">{{ count }}개</span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 리뷰 필터 -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <q-select
              v-model="selectedSort"
              :options="sortOptions"
              option-label="label"
              option-value="value"
              outlined
              dense
              label="정렬"
              style="min-width: 120px"
              @update:model-value="applyFilter"
            />
            <q-select
              v-model="selectedRating"
              :options="ratingFilterOptions"
              option-label="label"
              option-value="value"
              outlined
              dense
              label="평점 필터"
              style="min-width: 120px"
              @update:model-value="applyFilter"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- 리뷰 작성 버튼 -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <q-btn
            color="primary"
            label="리뷰 작성하기"
            icon="edit"
            @click="showWriteReviewDialog = true"
            class="full-width"
          />
        </q-card-section>
      </q-card>

      <!-- 리뷰 목록 -->
      <div v-if="loading" class="text-center q-pa-lg">
        <q-spinner size="lg" color="primary" />
      </div>

      <div v-else>
        <q-card
          v-for="review in filteredReviews"
          :key="review.id"
          class="q-mb-md"
        >
          <q-card-section>
            <div class="row items-start">
              <q-avatar size="40px" class="q-mr-md">
                <img :src="review.user.avatar || '/default-avatar.png'" />
              </q-avatar>
              <div class="col">
                <div class="row items-center q-mb-xs">
                  <span class="text-weight-bold q-mr-sm">{{ review.user.name }}</span>
                  <q-rating
                    v-model="review.rating"
                    readonly
                    size="sm"
                    color="orange"
                  />
                </div>
                <div class="text-grey-7 text-caption q-mb-sm">
                  {{ formatDate(review.createdAt) }}
                </div>
                <p class="text-body1">{{ review.content }}</p>

                <!-- 리뷰 이미지 -->
                <div v-if="review.images && review.images.length > 0" class="q-mt-sm">
                  <div class="row q-gutter-sm">
                    <q-img
                      v-for="(image, index) in review.images"
                      :key="index"
                      :src="image"
                      width="80px"
                      height="80px"
                      class="rounded-borders cursor-pointer"
                      @click="showImageDialog(review.images, index)"
                    />
                  </div>
                </div>

                <!-- 리뷰 액션 -->
                <div class="row items-center q-mt-sm">
                  <q-btn
                    flat
                    dense
                    :color="review.isHelpful ? 'primary' : 'grey'"
                    :icon="review.isHelpful ? 'thumb_up' : 'thumb_up_off_alt'"
                    :label="`도움됨 ${review.helpfulCount}`"
                    @click="toggleHelpful(review)"
                  />
                  <q-btn
                    flat
                    dense
                    color="grey"
                    icon="reply"
                    label="답글"
                    @click="showReplyDialog(review)"
                    v-if="isOwner"
                  />
                </div>

                <!-- 답글 -->
                <div v-if="review.reply" class="q-mt-sm q-pl-md border-left">
                  <div class="text-weight-bold text-primary q-mb-xs">
                    사장님 답글
                  </div>
                  <p class="text-body2">{{ review.reply.content }}</p>
                  <div class="text-grey-7 text-caption">
                    {{ formatDate(review.reply.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 리뷰가 없을 때 -->
        <div v-if="filteredReviews.length === 0" class="text-center q-pa-xl">
          <q-icon name="rate_review" size="64px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">
            {{ selectedRating.value !== 'all' ? '해당 평점의 리뷰가 없습니다' : '아직 리뷰가 없습니다' }}
          </div>
          <div class="text-body2 text-grey-6 q-mt-xs">
            첫 번째 리뷰를 작성해보세요!
          </div>
        </div>
      </div>
    </div>

    <!-- 리뷰 작성 다이얼로그 -->
    <q-dialog v-model="showWriteReviewDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">리뷰 작성</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-rating
            v-model="newReview.rating"
            size="md"
            color="orange"
            class="q-mb-md"
          />

          <q-input
            v-model="newReview.content"
            type="textarea"
            rows="4"
            outlined
            label="리뷰 내용"
            placeholder="제품에 대한 솔직한 후기를 남겨주세요"
            :rules="[val => !!val || '리뷰 내용을 입력해주세요']"
          />

          <q-file
            v-model="newReview.images"
            multiple
            accept="image/*"
            outlined
            label="이미지 첨부 (선택사항)"
            class="q-mt-md"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="취소" @click="closeWriteReviewDialog" />
          <q-btn
            color="primary"
            label="작성 완료"
            @click="submitReview"
            :loading="submittingReview"
            :disable="!newReview.rating || !newReview.content"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 이미지 뷰어 다이얼로그 -->
    <q-dialog v-model="showImageViewerDialog">
      <q-card>
        <q-card-section class="q-pa-none">
          <q-carousel
            v-model="currentImageIndex"
            arrows
            navigation
            height="400px"
          >
            <q-carousel-slide
              v-for="(image, index) in selectedImages"
              :key="index"
              :name="index"
            >
              <q-img :src="image" fit="contain" />
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="닫기" @click="showImageViewerDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

interface User {
  id: number;
  name: string;
  avatar?: string;
}

interface Review {
  id: number;
  user: User;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  helpfulCount: number;
  isHelpful: boolean;
  reply?: {
    content: string;
    createdAt: string;
  };
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

// 상태 관리
const loading = ref(true);
const submittingReview = ref(false);
const showWriteReviewDialog = ref(false);
const showImageViewerDialog = ref(false);

// 샘플 데이터
const product = ref<Product>({
  id: 1,
  name: '프리미엄 한우 등심 5kg',
  description: '최고급 한우 등심을 5kg 단위로 제공합니다. 신선하고 부드러운 식감을 자랑합니다.',
  price: 85000,
  image: 'https://placehold.co/200x200/e91e63/ffffff?text=한우등심'
});

const reviews = ref<Review[]>([
  {
    id: 1,
    user: {
      id: 1,
      name: '김사장',
      avatar: 'https://placehold.co/40x40/2196f3/ffffff?text=김'
    },
    rating: 5,
    content: '정말 최고의 고기입니다! 5kg 주문했는데 포장도 깔끔하고 신선도가 정말 좋네요. 손님들 반응도 너무 좋아서 재주문 확정입니다.',
    images: [
      'https://placehold.co/200x200/4caf50/ffffff?text=고기1',
      'https://placehold.co/200x200/ff9800/ffffff?text=고기2'
    ],
    createdAt: '2024-07-15T10:30:00Z',
    helpfulCount: 12,
    isHelpful: false,
    reply: {
      content: '좋은 평가 감사합니다! 항상 최고의 품질로 공급하겠습니다.',
      createdAt: '2024-07-15T14:30:00Z'
    }
  },
  {
    id: 2,
    user: {
      id: 2,
      name: '박대표',
      avatar: 'https://placehold.co/40x40/9c27b0/ffffff?text=박'
    },
    rating: 4,
    content: '가격 대비 품질이 좋습니다. 5kg 단위로 주문할 수 있어서 재고 관리하기도 편하고, 무엇보다 고기 품질이 일정해서 믿고 주문하고 있어요.',
    createdAt: '2024-07-12T09:15:00Z',
    helpfulCount: 8,
    isHelpful: true
  },
  {
    id: 3,
    user: {
      id: 3,
      name: '이사장',
      avatar: 'https://placehold.co/40x40/f44336/ffffff?text=이'
    },
    rating: 5,
    content: '언박싱부터 감동이었습니다. 포장 상태가 정말 좋고, 고기 색깔과 마블링이 예술이네요. 고객들이 너무 만족해해서 단골집이 되었습니다!',
    images: [
      'https://placehold.co/200x200/673ab7/ffffff?text=언박싱'
    ],
    createdAt: '2024-07-10T16:45:00Z',
    helpfulCount: 15,
    isHelpful: false
  },
  {
    id: 4,
    user: {
      id: 4,
      name: '최실장',
      avatar: 'https://placehold.co/40x40/009688/ffffff?text=최'
    },
    rating: 3,
    content: '고기 품질은 좋은데, 배송이 조금 늦어져서 아쉬웠어요. 그래도 전반적으로는 만족합니다.',
    createdAt: '2024-07-08T13:20:00Z',
    helpfulCount: 3,
    isHelpful: false
  },
  {
    id: 5,
    user: {
      id: 5,
      name: '정부장',
      avatar: 'https://placehold.co/40x40/795548/ffffff?text=정'
    },
    rating: 5,
    content: 'B2B 거래하면서 이렇게 믿을 수 있는 업체는 처음입니다. 5kg 단위라서 부담도 적고, 품질도 좋고, 가격도 합리적이에요. 적극 추천!',
    createdAt: '2024-07-05T11:10:00Z',
    helpfulCount: 9,
    isHelpful: true
  },
  {
    id: 6,
    user: {
      id: 6,
      name: '강사장',
      avatar: 'https://placehold.co/40x40/607d8b/ffffff?text=강'
    },
    rating: 2,
    content: '고기는 나쁘지 않았는데 가격이 조금 비싸게 느껴졌어요. 다른 업체와 비교해보니 차이가 있더라구요.',
    createdAt: '2024-07-02T08:30:00Z',
    helpfulCount: 1,
    isHelpful: false
  }
]);

const reviewStats = ref<ReviewStats>({
  averageRating: 4.2,
  totalReviews: 6,
  ratingDistribution: {
    5: 3,
    4: 1,
    3: 1,
    2: 1,
    1: 0
  }
});

// 필터 및 정렬
const selectedSort = ref({ label: '최신순', value: 'latest' });
const selectedRating = ref({ label: '전체', value: 'all' });

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '오래된순', value: 'oldest' },
  { label: '평점 높은순', value: 'rating_desc' },
  { label: '평점 낮은순', value: 'rating_asc' },
  { label: '도움됨 많은순', value: 'helpful' }
];

const ratingFilterOptions = [
  { label: '전체', value: 'all' },
  { label: '5점', value: 5 },
  { label: '4점', value: 4 },
  { label: '3점', value: 3 },
  { label: '2점', value: 2 },
  { label: '1점', value: 1 }
];

// 리뷰 작성
const newReview = ref({
  rating: 5,
  content: '',
  images: null as File[] | null
});

// 이미지 뷰어
const selectedImages = ref<string[]>([]);
const currentImageIndex = ref(0);

// 계산된 속성
const productId = computed(() => route.params.id as string);
const isOwner = computed(() => {
  // TODO: 실제 사장님/소유자 확인 로직 구현
  return false;
});

const filteredReviews = computed(() => {
  let filtered = [...reviews.value];

  // 평점 필터
  if (selectedRating.value.value !== 'all') {
    filtered = filtered.filter(review => review.rating === selectedRating.value.value);
  }

  // 정렬
  switch (selectedSort.value.value) {
    case 'latest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'rating_desc':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'rating_asc':
      filtered.sort((a, b) => a.rating - b.rating);
      break;
    case 'helpful':
      filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
      break;
  }

  return filtered;
});

// 메서드
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const applyFilter = () => {
  // 필터링은 computed property에서 자동으로 처리됨
};

const submitReview = () => {
  submittingReview.value = true;

  // 새 리뷰 생성
  const newReviewData: Review = {
    id: reviews.value.length + 1,
    user: {
      id: 999,
      name: '나',
      avatar: 'https://placehold.co/40x40/3f51b5/ffffff?text=나'
    },
    rating: newReview.value.rating,
    content: newReview.value.content,
    createdAt: new Date().toISOString(),
    helpfulCount: 0,
    isHelpful: false
  };

  // 시뮬레이션을 위한 딜레이
  setTimeout(() => {
    reviews.value.unshift(newReviewData);

    // 통계 업데이트
    reviewStats.value.totalReviews += 1;
    reviewStats.value.ratingDistribution[newReview.value.rating] += 1;

    // 평균 평점 재계산
    const totalRating = reviews.value.reduce((sum, review) => sum + review.rating, 0);
    reviewStats.value.averageRating = Number((totalRating / reviews.value.length).toFixed(1));

    $q.notify({
      type: 'positive',
      message: '리뷰가 작성되었습니다'
    });

    closeWriteReviewDialog();
    submittingReview.value = false;
  }, 1000);
};

const closeWriteReviewDialog = () => {
  showWriteReviewDialog.value = false;
  newReview.value = {
    rating: 5,
    content: '',
    images: null
  };
};

const toggleHelpful = (review: Review) => {
  review.isHelpful = !review.isHelpful;
  review.helpfulCount += review.isHelpful ? 1 : -1;

  $q.notify({
    type: 'positive',
    message: review.isHelpful ? '도움됨으로 표시했습니다' : '도움됨을 취소했습니다'
  });
};

const showImageDialog = (images: string[], startIndex: number) => {
  selectedImages.value = images;
  currentImageIndex.value = startIndex;
  showImageViewerDialog.value = true;
};

const showReplyDialog = (review: Review) => {
  $q.notify({
    type: 'info',
    message: '답글 작성 기능은 준비 중입니다'
  });
};

// 라이프사이클
onMounted(() => {
  // 로딩 시뮬레이션
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
.border-left {
  border-left: 3px solid var(--q-primary);
}
</style>
