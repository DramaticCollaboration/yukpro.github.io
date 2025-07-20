<template>
  <q-page class="cart-page">
    <!-- 헤더 -->
    <div class="bg-primary text-white q-py-lg">
      <div class="container">
        <div class="row items-center">
          <q-btn
            flat
            round
            icon="arrow_back"
            color="white"
            @click="goBack"
            class="q-mr-md"
          />
          <div class="col">
            <div class="text-h4 text-weight-bold">장바구니</div>
            <div class="text-subtitle1 opacity-80">
              {{ cartItems.length > 0 ? `${cartItems.length}개 상품` : '장바구니가 비어있습니다' }}
            </div>
          </div>
          <div class="header-actions">
            <q-btn
              v-if="cartItems.length > 0"
              flat
              icon="delete_sweep"
              color="white"
              @click="clearAllItems"
            >
              <q-tooltip>전체 삭제</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <div class="container q-py-lg">
      <!-- 빈 장바구니 상태 -->
      <div v-if="cartItems.length === 0" class="empty-cart text-center q-py-xl">
        <div class="empty-icon q-mb-lg">
          <q-icon name="shopping_cart" size="120px" color="grey-4" />
        </div>
        <div class="text-h5 text-weight-bold text-grey-6 q-mb-md">
          장바구니가 비어있습니다
        </div>
        <div class="text-body1 text-grey-5 q-mb-xl">
          원하는 상품을 장바구니에 담아보세요<br>
          신선한 축산물이 기다리고 있습니다
        </div>
        <q-btn
          color="primary"
          size="lg"
          icon="storefront"
          label="상품 둘러보기"
          @click="goToProducts"
        />
      </div>

      <!-- 장바구니 아이템들 -->
      <div v-else class="cart-content">
        <div class="row q-gutter-lg">
          <!-- 왼쪽: 장바구니 아이템 목록 -->
          <div class="col-12 col-md-8">
            <!-- 전체 선택 및 액션 -->
            <div class="cart-actions q-mb-md">
              <div class="row items-center justify-between">
                <div class="selection-actions">
                  <q-checkbox
                    v-model="selectAll"
                    @update:model-value="handleSelectAll"
                    label="전체 선택"
                    color="primary"
                    class="q-mr-md"
                  />
                  <q-btn
                    flat
                    size="sm"
                    color="grey-6"
                    icon="delete"
                    label="선택 삭제"
                    @click="deleteSelectedItems"
                    :disable="selectedItems.length === 0"
                  />
                </div>
                <div class="sort-actions">
                  <q-select
                    v-model="sortBy"
                    :options="sortOptions"
                    label="정렬"
                    outlined
                    dense
                    emit-value
                    map-options
                    style="min-width: 120px"
                    @update:model-value="applySorting"
                  />
                </div>
              </div>
            </div>

            <!-- 상품 목록 -->
            <div class="cart-items">
              <q-card
                v-for="item in sortedCartItems"
                :key="item.id"
                flat
                bordered
                class="cart-item q-mb-md"
                :class="{ 'selected': selectedItems.includes(item.id) }"
              >
                <q-card-section class="cart-item-content">
                  <div class="row q-gutter-md">
                    <!-- 선택 체크박스 -->
                    <div class="col-auto">
                      <q-checkbox
                        v-model="selectedItems"
                        :val="item.id"
                        color="primary"
                        @update:model-value="updateSelectAll"
                      />
                    </div>

                    <!-- 상품 이미지 -->
                    <div class="col-auto">
                      <q-img
                        :src="item.image"
                        style="width: 120px; height: 120px"
                        class="rounded-borders cursor-pointer"
                        @click="goToProductDetail(item.id)"
                        spinner-color="primary"
                      >
                        <template v-slot:error>
                          <div class="absolute-full flex flex-center bg-grey-3">
                            <q-icon name="image" size="32px" color="grey-6" />
                          </div>
                        </template>
                      </q-img>
                    </div>

                    <!-- 상품 정보 -->
                    <div class="col">
                      <div class="item-details">
                        <!-- 상품명 -->
                        <div class="text-h6 text-weight-bold q-mb-xs cursor-pointer" @click="goToProductDetail(item.id)">
                          {{ item.name }}
                        </div>

                        <!-- 상품 옵션 -->
                        <div class="item-options q-mb-sm">
                          <q-chip
                            size="sm"
                            color="grey-2"
                            text-color="grey-8"
                            icon="category"
                          >
                            {{ item.category }}
                          </q-chip>
                          <q-chip
                            size="sm"
                            color="blue-2"
                            text-color="blue-8"
                            icon="grade"
                          >
                            {{ item.grade }}등급
                          </q-chip>
                          <q-chip
                            size="sm"
                            color="green-2"
                            text-color="green-8"
                            icon="place"
                          >
                            {{ item.origin }}
                          </q-chip>
                          <q-chip
                            v-if="item.temperature"
                            size="sm"
                            color="cyan-2"
                            text-color="cyan-8"
                            icon="ac_unit"
                          >
                            {{ item.temperature }}
                          </q-chip>
                        </div>

                        <!-- 상품 설명 -->
                        <div class="text-body2 text-grey-7 q-mb-md">
                          {{ item.description }}
                        </div>

                        <!-- 재고 및 유통기한 정보 -->
                        <div class="item-info q-mb-md">
                          <div class="row q-gutter-md">
                            <div class="info-item">
                              <q-icon name="inventory" color="orange" class="q-mr-xs" />
                              <span class="text-body2">
                                재고: {{ item.stock }}kg
                              </span>
                            </div>
                            <div class="info-item">
                              <q-icon name="schedule" color="red" class="q-mr-xs" />
                              <span class="text-body2">
                                유통기한: {{ formatDate(item.expiryDate) }}
                              </span>
                            </div>
                            <div v-if="item.isLimitedTime" class="info-item">
                              <q-icon name="timer" color="deep-orange" class="q-mr-xs" />
                              <span class="text-body2 text-deep-orange">
                                한정 특가
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- 모바일에서 가격 정보 -->
                        <div class="mobile-price lt-md q-mb-md">
                          <div class="price-info">
                            <div class="current-price">
                              <span class="text-h6 text-weight-bold text-primary">
                                {{ formatPrice(item.unitPrice) }}원/kg
                              </span>
                              <span v-if="item.originalPrice && item.originalPrice > item.unitPrice" class="original-price q-ml-sm">
                                {{ formatPrice(item.originalPrice) }}원
                              </span>
                            </div>
                            <div v-if="item.discountRate" class="discount-rate">
                              <q-chip size="sm" color="red" text-color="white">
                                {{ item.discountRate }}% 할인
                              </q-chip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 수량 조절 및 가격 (데스크톱) -->
                    <div class="col-auto gt-sm item-actions">
                      <div class="action-section">
                        <!-- 단가 정보 -->
                        <div class="price-section q-mb-md text-right">
                          <div class="current-price">
                            <span class="text-h6 text-weight-bold text-primary">
                              {{ formatPrice(item.unitPrice) }}원/kg
                            </span>
                          </div>
                          <div v-if="item.originalPrice && item.originalPrice > item.unitPrice" class="original-price">
                            <span class="text-body2 text-strike text-grey-6">
                              {{ formatPrice(item.originalPrice) }}원
                            </span>
                          </div>
                          <div v-if="item.discountRate" class="discount-rate q-mt-xs">
                            <q-chip size="sm" color="red" text-color="white">
                              {{ item.discountRate }}% 할인
                            </q-chip>
                          </div>
                        </div>

                        <!-- 수량 조절 -->
                        <div class="quantity-section q-mb-md">
                          <div class="text-caption text-grey-7 q-mb-sm">수량 (5kg 단위)</div>
                          <q-btn-group outline>
                            <q-btn
                              outline
                              color="grey-6"
                              icon="remove"
                              @click="decreaseQuantity(item.id)"
                              :disable="item.quantity <= 5"
                            />
                            <q-input
                              v-model.number="item.quantity"
                              type="number"
                              outlined
                              dense
                              style="width: 80px"
                              :min="5"
                              :step="5"
                              suffix="kg"
                              @update:model-value="updateQuantity(item.id, $event)"
                              @blur="validateQuantity(item.id)"
                            />
                            <q-btn
                              outline
                              color="grey-6"
                              icon="add"
                              @click="increaseQuantity(item.id)"
                              :disable="item.quantity >= item.stock"
                            />
                          </q-btn-group>

                          <!-- 재고 부족 경고 -->
                          <div v-if="item.quantity > item.stock" class="text-caption text-red q-mt-xs">
                            재고 부족 (최대 {{ item.stock }}kg)
                          </div>
                        </div>

                        <!-- 총 가격 -->
                        <div class="total-price-section q-mb-md text-right">
                          <div class="text-caption text-grey-7">총 가격</div>
                          <div class="text-h6 text-weight-bold text-primary">
                            {{ formatPrice(item.totalPrice) }}원
                          </div>
                        </div>

                        <!-- 액션 버튼들 -->
                        <div class="action-buttons">
                          <q-btn
                            flat
                            size="sm"
                            color="grey-6"
                            icon="favorite_border"
                            @click="addToWishlist(item.id)"
                          >
                            <q-tooltip>찜하기</q-tooltip>
                          </q-btn>
                          <q-btn
                            flat
                            size="sm"
                            color="red"
                            icon="delete"
                            @click="removeItem(item.id)"
                          >
                            <q-tooltip>삭제</q-tooltip>
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 모바일 수량 조절 -->
                  <div class="mobile-quantity lt-md q-mt-md">
                    <div class="row items-center justify-between">
                      <div class="quantity-controls">
                        <div class="text-caption text-grey-7 q-mb-xs">수량 (5kg 단위)</div>
                        <q-btn-group outline>
                          <q-btn
                            outline
                            color="grey-6"
                            icon="remove"
                            @click="decreaseQuantity(item.id)"
                            :disable="item.quantity <= 5"
                          />
                          <q-btn
                            outline
                            color="grey-6"
                            :label="`${item.quantity}kg`"
                            style="min-width: 80px"
                            no-caps
                          />
                          <q-btn
                            outline
                            color="grey-6"
                            icon="add"
                            @click="increaseQuantity(item.id)"
                            :disable="item.quantity >= item.stock"
                          />
                        </q-btn-group>
                      </div>
                      <div class="total-price text-right">
                        <div class="text-caption text-grey-7">총 가격</div>
                        <div class="text-h6 text-weight-bold text-primary">
                          {{ formatPrice(item.totalPrice) }}원
                        </div>
                      </div>
                    </div>

                    <!-- 모바일 액션 버튼 -->
                    <div class="mobile-actions q-mt-sm">
                      <div class="row q-gutter-sm">
                        <q-btn
                          outline
                          size="sm"
                          color="grey-6"
                          icon="favorite_border"
                          label="찜하기"
                          @click="addToWishlist(item.id)"
                          class="col"
                        />
                        <q-btn
                          outline
                          size="sm"
                          color="red"
                          icon="delete"
                          label="삭제"
                          @click="removeItem(item.id)"
                          class="col"
                        />
                      </div>
                    </div>
                  </div>
                </q-card-section>

                <!-- 상품별 알림 -->
                <q-banner
                  v-if="getItemWarning(item)"
                  :class="`bg-${getItemWarning(item).color}-1 text-${getItemWarning(item).color}-8`"
                  dense
                >
                  <template v-slot:avatar>
                    <q-icon :name="getItemWarning(item).icon" />
                  </template>
                  {{ getItemWarning(item).message }}
                </q-banner>
              </q-card>
            </div>

            <!-- 추천 상품 -->
            <div v-if="recommendedProducts.length > 0" class="recommended-section q-mt-xl">
              <div class="section-header q-mb-lg">
                <h5 class="text-weight-bold">함께 주문하면 좋은 상품</h5>
                <p class="text-grey-7">다른 고객들이 함께 구매한 상품들입니다</p>
              </div>

              <div class="row q-gutter-md">
                <div
                  v-for="product in recommendedProducts"
                  :key="product.id"
                  class="col-12 col-sm-6 col-md-4"
                >
                  <q-card flat bordered class="recommended-product cursor-pointer" @click="goToProductDetail(product.id)">
                    <q-img
                      :src="product.image"
                      height="140px"
                      spinner-color="primary"
                    />
                    <q-card-section>
                      <div class="text-subtitle2 text-weight-bold q-mb-xs">
                        {{ product.name }}
                      </div>
                      <div class="text-body2 text-primary text-weight-bold">
                        {{ formatPrice(product.price) }}원/kg
                      </div>
                      <q-btn
                        color="primary"
                        label="담기"
                        size="sm"
                        class="full-width q-mt-sm"
                        @click.stop="addToCart(product)"
                      />
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </div>

          <!-- 오른쪽: 주문 요약 -->
          <div class="col-12 col-md-4">
            <div class="order-summary-sticky">
              <q-card flat bordered class="order-summary">
                <q-card-section class="bg-grey-1">
                  <div class="text-h6 text-weight-bold">
                    <q-icon name="receipt" class="q-mr-sm" />
                    주문 요약
                  </div>
                </q-card-section>

                <q-card-section>
                  <!-- 선택된 상품 수 -->
                  <div class="summary-row q-mb-md">
                    <div class="text-body1">선택상품 {{ selectedItemsCount }}개</div>
                    <div class="text-body1">총 {{ selectedTotalWeight }}kg</div>
                  </div>

                  <q-separator class="q-mb-md" />

                  <!-- 가격 계산 -->
                  <div class="price-calculation">
                    <div class="calc-row">
                      <span class="text-body1">상품금액</span>
                      <span class="text-body1">{{ formatPrice(selectedSubtotal) }}원</span>
                    </div>
                    <div class="calc-row">
                      <span class="text-body1">배송비</span>
                      <span class="text-body1">
                        {{ deliveryFee > 0 ? formatPrice(deliveryFee) + '원' : '무료' }}
                      </span>
                    </div>
                    <div v-if="totalDiscount > 0" class="calc-row">
                      <span class="text-body1 text-positive">할인</span>
                      <span class="text-body1 text-positive">-{{ formatPrice(totalDiscount) }}원</span>
                    </div>
                  </div>

                  <q-separator class="q-my-md" />

                  <!-- 총 결제금액 -->
                  <div class="total-amount">
                    <div class="row justify-between items-center">
                      <span class="text-h6 text-weight-bold">총 결제금액</span>
                      <span class="text-h5 text-weight-bold text-primary">
                        {{ formatPrice(totalAmount) }}원
                      </span>
                    </div>
                  </div>

                  <!-- 무료배송 진행바 -->
                  <div v-if="freeShippingThreshold > 0" class="free-shipping-progress q-mt-md">
                    <q-linear-progress
                      :value="selectedSubtotal / freeShippingThreshold"
                      color="primary"
                      size="10px"
                      class="q-mb-sm"
                    />
                    <div class="text-caption text-center">
                      <span v-if="selectedSubtotal >= freeShippingThreshold" class="text-positive">
                        <q-icon name="local_shipping" class="q-mr-xs" />
                        무료배송 달성!
                      </span>
                      <span v-else>
                        {{ formatPrice(freeShippingThreshold - selectedSubtotal) }}원 더 주문하면 무료배송
                      </span>
                    </div>
                  </div>

                  <!-- 적립 포인트 -->
                  <div class="earning-points q-mt-md">
                    <div class="bg-amber-1 rounded-borders q-pa-sm text-center">
                      <q-icon name="stars" color="amber" class="q-mr-xs" />
                      <span class="text-body2">
                        주문 시 <strong class="text-amber">{{ formatPrice(earningPoints) }}P</strong> 적립
                      </span>
                    </div>
                  </div>

                  <!-- 주문 버튼 -->
                  <div class="order-actions q-mt-lg">
                    <q-btn
                      color="primary"
                      size="lg"
                      class="full-width"
                      :label="`선택상품 주문 (${selectedItemsCount}개)`"
                      icon="shopping_cart"
                      @click="proceedToCheckout"
                      :disable="selectedItems.length === 0 || !isMinimumOrderMet"
                    />

                    <!-- 최소 주문량 안내 -->
                    <div v-if="!isMinimumOrderMet && selectedItems.length > 0" class="q-mt-sm">
                      <q-banner class="bg-orange-1 text-orange-8" dense>
                        <template v-slot:avatar>
                          <q-icon name="warning" />
                        </template>
                        최소 {{ minimumOrderWeight }}kg 이상 주문해주세요<br>
                        현재: {{ selectedTotalWeight }}kg
                      </q-banner>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- 쿠폰 및 할인 -->
              <q-card flat bordered class="coupon-section q-mt-md">
                <q-card-section>
                  <div class="text-subtitle2 text-weight-bold q-mb-md">
                    <q-icon name="local_offer" class="q-mr-sm" />
                    쿠폰 & 할인
                  </div>

                  <q-btn
                    outline
                    color="primary"
                    icon="add"
                    label="쿠폰 적용"
                    class="full-width q-mb-sm"
                    @click="showCouponDialog = true"
                  />

                  <div v-if="appliedCoupons.length > 0" class="applied-coupons">
                    <div
                      v-for="coupon in appliedCoupons"
                      :key="coupon.id"
                      class="applied-coupon q-mb-sm"
                    >
                      <q-chip
                        removable
                        color="green"
                        text-color="white"
                        :icon="coupon.type === 'percent' ? 'percent' : 'money'"
                        @remove="removeCoupon(coupon.id)"
                      >
                        {{ coupon.name }} (-{{ formatPrice(coupon.discountAmount) }}원)
                      </q-chip>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- 고객센터 -->
              <q-card flat bordered class="support-section q-mt-md">
                <q-card-section>
                  <div class="text-subtitle2 text-weight-bold q-mb-sm">
                    <q-icon name="support_agent" class="q-mr-sm" />
                    고객센터
                  </div>
                  <div class="text-body2 text-grey-7 q-mb-md">
                    주문 관련 문의사항이 있으시면<br>언제든 연락해주세요.
                  </div>
                  <div class="row q-gutter-sm">
                    <q-btn
                      outline
                      color="primary"
                      icon="phone"
                      label="전화"
                      size="sm"
                      class="col"
                      @click="callSupport"
                    />
                    <q-btn
                      outline
                      color="blue"
                      icon="chat"
                      label="채팅"
                      size="sm"
                      class="col"
                      @click="openChat"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 쿠폰 선택 다이얼로그 -->
    <q-dialog v-model="showCouponDialog" persistent>
      <q-card style="min-width: 400px">
        <q-bar class="bg-primary text-white">
          <div class="text-h6">쿠폰 선택</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showCouponDialog = false" />
        </q-bar>

        <q-card-section class="q-pa-none">
          <q-list>
            <q-item
              v-for="coupon in availableCoupons"
              :key="coupon.id"
              clickable
              @click="applyCoupon(coupon)"
              :disable="!canApplyCoupon(coupon)"
            >
              <q-item-section avatar>
                <q-icon
                  :name="coupon.type === 'percent' ? 'percent' : 'money'"
                  :color="canApplyCoupon(coupon) ? 'primary' : 'grey'"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ coupon.name }}</q-item-label>
                <q-item-label caption>
                  {{ coupon.description }}
                </q-item-label>
                <q-item-label caption class="text-grey-5">
                  유효기간: {{ formatDate(coupon.expiryDate) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-weight-bold text-primary">
                  {{ coupon.type === 'percent' ? `${coupon.value}%` : `${formatPrice(coupon.value)}원` }} 할인
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="availableCoupons.length === 0">
              <q-item-section class="text-center text-grey-6">
                사용 가능한 쿠폰이 없습니다
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// 반응형 데이터
const selectAll = ref(false)
const selectedItems = ref<string[]>([])
const sortBy = ref('name')
const showCouponDialog = ref(false)
const appliedCoupons = ref<any[]>([])

// 정렬 옵션
const sortOptions = ref([
  { label: '이름순', value: 'name' },
  { label: '가격낮은순', value: 'price_asc' },
  { label: '가격높은순', value: 'price_desc' },
  { label: '최근 추가순', value: 'recent' }
])

// 장바구니 아이템 (Mock 데이터)
const cartItems = ref([
  {
    id: '1',
    name: '프리미엄 한우 등심',
    category: '한우',
    grade: '1++',
    origin: '국내산',
    description: '마블링이 뛰어난 최상급 한우 등심으로 특별한 날에 어울리는 프리미엄 상품입니다.',
    unitPrice: 65000,
    originalPrice: 70000,
    discountRate: 7,
    quantity: 10,
    stock: 50,
    temperature: '냉장',
    expiryDate: new Date('2024-02-15'),
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    addedAt: new Date('2024-01-15'),
    isLimitedTime: true
  },
  {
    id: '2',
    name: '국내산 돼지 삼겹살',
    category: '국내산 돼지',
    grade: '1',
    origin: '국내산',
    description: '신선하고 부드러운 국내산 돼지 삼겹살로 구이용으로 최적입니다.',
    unitPrice: 18000,
    originalPrice: null,
    discountRate: null,
    quantity: 5,
    stock: 30,
    temperature: '냉장',
    expiryDate: new Date('2024-02-10'),
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
    addedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    name: '국내산 닭다리살',
    category: '국내산 닭',
    grade: '특',
    origin: '국내산',
    description: '부드럽고 육즙이 풍부한 국내산 닭다리살입니다.',
    unitPrice: 12000,
    originalPrice: 14000,
    discountRate: 14,
    quantity: 8,
    stock: 25,
    temperature: '냉장',
    expiryDate: new Date('2024-02-08'),
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    addedAt: new Date('2024-01-17')
  }
])

// 추천 상품
const recommendedProducts = ref([
  {
    id: 'r1',
    name: '한우 갈비',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400'
  },
  {
    id: 'r2',
    name: '돼지 목살',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400'
  },
  {
    id: 'r3',
    name: '닭가슴살',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400'
  }
])

// 사용 가능한 쿠폰
const availableCoupons = ref([
  {
    id: 'c1',
    name: '첫 주문 10% 할인',
    description: '첫 주문 시 10% 할인 (최대 5만원)',
    type: 'percent',
    value: 10,
    maxDiscount: 50000,
    minOrderAmount: 100000,
    expiryDate: new Date('2024-03-31')
  },
  {
    id: 'c2',
    name: '대량주문 5만원 할인',
    description: '50만원 이상 주문시 5만원 할인',
    type: 'amount',
    value: 50000,
    minOrderAmount: 500000,
    expiryDate: new Date('2024-02-29')
  }
])

// 상수
const minimumOrderWeight = 5
const freeShippingThreshold = 300000

// computed 속성들
const sortedCartItems = computed(() => {
  const items = [...cartItems.value]

  switch (sortBy.value) {
    case 'price_asc':
      return items.sort((a, b) => a.unitPrice - b.unitPrice)
    case 'price_desc':
      return items.sort((a, b) => b.unitPrice - a.unitPrice)
    case 'recent':
      return items.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
    case 'name':
    default:
      return items.sort((a, b) => a.name.localeCompare(b.name))
  }
})

const selectedItemsData = computed(() => {
  return cartItems.value.filter(item => selectedItems.value.includes(item.id))
})

const selectedItemsCount = computed(() => selectedItems.value.length)

const selectedTotalWeight = computed(() => {
  return selectedItemsData.value.reduce((sum, item) => sum + item.quantity, 0)
})

const selectedSubtotal = computed(() => {
  return selectedItemsData.value.reduce((sum, item) => {
    item.totalPrice = item.quantity * item.unitPrice
    return sum + item.totalPrice
  }, 0)
})

const deliveryFee = computed(() => {
  return selectedSubtotal.value >= freeShippingThreshold ? 0 : 5000
})

const totalDiscount = computed(() => {
  let discount = 0

  appliedCoupons.value.forEach(coupon => {
    if (coupon.type === 'percent') {
      const percentDiscount = Math.floor(selectedSubtotal.value * coupon.value / 100)
      discount += Math.min(percentDiscount, coupon.maxDiscount || percentDiscount)
    } else {
      discount += coupon.value
    }
  })

  return discount
})

const totalAmount = computed(() => {
  return Math.max(0, selectedSubtotal.value + deliveryFee.value - totalDiscount.value)
})

const earningPoints = computed(() => {
  return Math.floor(totalAmount.value * 0.01) // 1% 적립
})

const isMinimumOrderMet = computed(() => {
  return selectedTotalWeight.value >= minimumOrderWeight
})

// 메소드들
const goBack = () => {
  router.go(-1)
}

const goToProducts = () => {
  router.push('/products')
}

const goToProductDetail = (productId: string) => {
  router.push(`/products/${productId}`)
}

const handleSelectAll = (value: boolean) => {
  if (value) {
    selectedItems.value = cartItems.value.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

const updateSelectAll = () => {
  selectAll.value = selectedItems.value.length === cartItems.value.length
}

const applySorting = () => {
  // 정렬은 computed에서 자동으로 처리됨
}

const increaseQuantity = (itemId: string) => {
  const item = cartItems.value.find(i => i.id === itemId)
  if (item && item.quantity < item.stock) {
    item.quantity += 5 // 5kg 단위
    item.totalPrice = item.quantity * item.unitPrice
  }
}

const decreaseQuantity = (itemId: string) => {
  const item = cartItems.value.find(i => i.id === itemId)
  if (item && item.quantity > 5) {
    item.quantity -= 5 // 5kg 단위
    item.totalPrice = item.quantity * item.unitPrice
  }
}

const updateQuantity = (itemId: string, newQuantity: number) => {
  const item = cartItems.value.find(i => i.id === itemId)
  if (item) {
    // 5kg 단위로 반올림
    const roundedQuantity = Math.round(newQuantity / 5) * 5
    item.quantity = Math.max(5, Math.min(roundedQuantity, item.stock))
    item.totalPrice = item.quantity * item.unitPrice
  }
}

const validateQuantity = (itemId: string) => {
  const item = cartItems.value.find(i => i.id === itemId)
  if (item) {
    if (item.quantity < 5) {
      item.quantity = 5
    } else if (item.quantity > item.stock) {
      item.quantity = item.stock
    } else {
      // 5kg 단위로 반올림
      item.quantity = Math.round(item.quantity / 5) * 5
    }
    item.totalPrice = item.quantity * item.unitPrice
  }
}

const removeItem = (itemId: string) => {
  $q.dialog({
    title: '상품 삭제',
    message: '장바구니에서 이 상품을 삭제하시겠습니까?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    const index = cartItems.value.findIndex(i => i.id === itemId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      selectedItems.value = selectedItems.value.filter(id => id !== itemId)
      updateSelectAll()

      $q.notify({
        type: 'positive',
        message: '상품이 삭제되었습니다',
        timeout: 2000
      })
    }
  })
}

const deleteSelectedItems = () => {
  if (selectedItems.value.length === 0) return

  $q.dialog({
    title: '선택 상품 삭제',
    message: `선택하신 ${selectedItems.value.length}개 상품을 삭제하시겠습니까?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    cartItems.value = cartItems.value.filter(item => !selectedItems.value.includes(item.id))
    selectedItems.value = []
    selectAll.value = false

    $q.notify({
      type: 'positive',
      message: '선택된 상품들이 삭제되었습니다',
      timeout: 2000
    })
  })
}

const clearAllItems = () => {
  $q.dialog({
    title: '장바구니 비우기',
    message: '장바구니의 모든 상품을 삭제하시겠습니까?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    cartItems.value = []
    selectedItems.value = []
    selectAll.value = false

    $q.notify({
      type: 'positive',
      message: '장바구니가 비워졌습니다',
      timeout: 2000
    })
  })
}

const addToWishlist = (itemId: string) => {
  $q.notify({
    type: 'positive',
    message: '찜 목록에 추가되었습니다',
    timeout: 2000
  })
}

const addToCart = (product: any) => {
  $q.notify({
    type: 'positive',
    message: `${product.name}이(가) 장바구니에 추가되었습니다`,
    timeout: 2000
  })
}

const getItemWarning = (item: any) => {
  const today = new Date()
  const expiryDate = new Date(item.expiryDate)
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (item.quantity > item.stock) {
    return {
      icon: 'error',
      color: 'red',
      message: `재고 부족: 최대 ${item.stock}kg까지 주문 가능합니다`
    }
  }

  if (daysUntilExpiry <= 3) {
    return {
      icon: 'schedule',
      color: 'orange',
      message: `유통기한 임박: ${daysUntilExpiry}일 남음 (${formatDate(expiryDate)})`
    }
  }

  return null
}

const canApplyCoupon = (coupon: any) => {
  return selectedSubtotal.value >= coupon.minOrderAmount &&
    !appliedCoupons.value.find(c => c.id === coupon.id) &&
    new Date() <= coupon.expiryDate
}

const applyCoupon = (coupon: any) => {
  if (canApplyCoupon(coupon)) {
    appliedCoupons.value.push({
      ...coupon,
      discountAmount: coupon.type === 'percent'
        ? Math.min(Math.floor(selectedSubtotal.value * coupon.value / 100), coupon.maxDiscount || Infinity)
        : coupon.value
    })
    showCouponDialog.value = false

    $q.notify({
      type: 'positive',
      message: '쿠폰이 적용되었습니다',
      timeout: 2000
    })
  }
}

const removeCoupon = (couponId: string) => {
  appliedCoupons.value = appliedCoupons.value.filter(c => c.id !== couponId)
}

const proceedToCheckout = () => {
  if (selectedItems.value.length === 0) {
    $q.notify({
      type: 'warning',
      message: '주문할 상품을 선택해주세요',
      timeout: 2000
    })
    return
  }

  if (!isMinimumOrderMet.value) {
    $q.notify({
      type: 'warning',
      message: `최소 ${minimumOrderWeight}kg 이상 주문해주세요`,
      timeout: 2000
    })
    return
  }

  // 선택된 아이템들을 세션스토리지에 저장
  const orderData = {
    items: selectedItemsData.value.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    })),
    coupons: appliedCoupons.value
  }

  sessionStorage.setItem('cartOrder', JSON.stringify(orderData))
  router.push('/checkout')
}

const callSupport = () => {
  window.location.href = 'tel:1588-0000'
}

const openChat = () => {
  router.push('/support')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// 라이프사이클
onMounted(() => {
  // 모든 아이템 기본 선택
  selectedItems.value = cartItems.value.map(item => item.id)
  selectAll.value = true

  // 초기 총 가격 계산
  cartItems.value.forEach(item => {
    item.totalPrice = item.quantity * item.unitPrice
  })
})
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.empty-cart {
  .empty-icon {
    animation: float 3s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.cart-item {
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  &.selected {
    border-color: var(--q-primary);
    background: rgba(25, 118, 210, 0.02);
  }

  .cart-item-content {
    padding: 20px;
  }

  .item-details {
    .item-options {
      .q-chip {
        margin-right: 8px;
        margin-bottom: 4px;
      }
    }

    .item-info {
      .info-item {
        display: flex;
        align-items: center;
      }
    }

    .mobile-price {
      .price-info {
        .original-price {
          text-decoration: line-through;
          color: #999;
        }
      }
    }
  }

  .item-actions {
    min-width: 200px;

    .action-section {
      display: flex;
      flex-direction: column;
      height: 100%;

      .price-section {
        .original-price {
          text-decoration: line-through;
        }
      }

      .quantity-section {
        .q-btn-group {
          .q-input {
            .q-field__control {
              height: 40px;
            }
          }
        }
      }

      .action-buttons {
        display: flex;
        gap: 8px;
        justify-content: center;
        margin-top: auto;
      }
    }
  }
}

.order-summary-sticky {
  position: sticky;
  top: 20px;
}

.order-summary {
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price-calculation {
    .calc-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
  }

  .free-shipping-progress {
    .q-linear-progress {
      border-radius: 5px;
    }
  }
}

.recommended-section {
  .recommended-product {
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  }
}

.mobile-quantity {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;

  .quantity-controls {
    .q-btn-group {
      .q-btn {
        min-height: 36px;
      }
    }
  }
}

@media (max-width: 600px) {
  .container {
    padding: 0 8px;
  }

  .cart-item {
    .cart-item-content {
      padding: 16px;
    }

    .row.q-gutter-md {
      gap: 12px;
    }
  }

  .order-summary-sticky {
    position: static;
    margin-top: 32px;
  }
}

@media (max-width: 1024px) {
  .order-summary-sticky {
    position: static;
    margin-top: 32px;
  }
}
</style>
