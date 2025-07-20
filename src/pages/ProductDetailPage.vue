<template>
  <q-page class="product-detail-page">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-container">
      <div class="text-center q-pa-xl">
        <q-spinner-dots size="50px" color="primary" />
        <div class="text-h6 q-mt-md">상품 정보를 불러오는 중...</div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-container">
      <div class="text-center q-pa-xl">
        <q-icon name="error" size="64px" color="negative" />
        <div class="text-h6 q-mt-md">상품을 찾을 수 없습니다</div>
        <div class="text-body1 text-grey-7 q-mt-sm">{{ error }}</div>
        <q-btn
          color="primary"
          label="상품 목록으로"
          icon="arrow_back"
          @click="$router.push('/products')"
          class="q-mt-md"
        />
      </div>
    </div>

    <!-- 상품 상세 내용 -->
    <div v-else class="product-content">
      <!-- 브레드크럼 -->
      <div class="breadcrumb-section bg-grey-1 q-py-md">
        <div class="container">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el :label="product.categoryName" :to="`/products?category=${product.categoryId}`" />
            <q-breadcrumbs-el :label="product.name" />
          </q-breadcrumbs>
        </div>
      </div>

      <!-- 메인 상품 정보 -->
      <div class="container q-py-xl">
        <div class="row q-gutter-xl">
          <!-- 왼쪽: 이미지 갤러리 -->
          <div class="col-12 col-md-6">
            <div class="image-gallery">
              <!-- 메인 이미지 -->
              <div class="main-image-container">
                <q-img
                  :src="selectedImage"
                  :ratio="4/3"
                  class="main-image rounded-borders"
                  @click="openImageViewer"
                >
                  <div class="absolute-top-right q-ma-sm">
                    <q-btn
                      round
                      color="white"
                      text-color="dark"
                      icon="zoom_in"
                      size="sm"
                      @click="openImageViewer"
                    />
                  </div>

                  <!-- 품질 인증 뱃지 -->
                  <div class="absolute-top-left q-ma-sm">
                    <q-chip
                      color="green"
                      text-color="white"
                      icon="verified"
                      dense
                    >
                      {{ product.grade }}등급
                    </q-chip>
                  </div>

                  <!-- 재고 상태 -->
                  <div class="absolute-bottom-left q-ma-sm">
                    <q-chip
                      :color="product.stock > 0 ? 'positive' : 'negative'"
                      text-color="white"
                      :icon="product.stock > 0 ? 'inventory' : 'inventory_2'"
                      dense
                    >
                      {{ product.stock > 0 ? `재고 ${product.stock}kg` : '품절' }}
                    </q-chip>
                  </div>
                </q-img>
              </div>

              <!-- 썸네일 이미지들 -->
              <div class="thumbnail-container q-mt-md">
                <q-scroll-area
                  :thumb-style="{ width: '4px' }"
                  style="height: 100px"
                  horizontal
                >
                  <div class="row no-wrap q-gutter-sm">
                    <q-img
                      v-for="(image, index) in product.images"
                      :key="index"
                      :src="image"
                      :ratio="1"
                      width="80px"
                      height="80px"
                      class="thumbnail-image rounded-borders cursor-pointer"
                      :class="{ 'selected': selectedImageIndex === index }"
                      @click="selectImage(index)"
                    />
                  </div>
                </q-scroll-area>
              </div>
            </div>
          </div>

          <!-- 오른쪽: 상품 정보 -->
          <div class="col-12 col-md-6">
            <div class="product-info">
              <!-- 상품명 -->
              <div class="product-header q-mb-lg">
                <div class="product-category text-primary text-weight-bold text-uppercase q-mb-sm">
                  {{ product.categoryName }}
                </div>
                <h1 class="product-title text-h4 text-weight-bold q-mb-md">
                  {{ product.name }}
                </h1>
                <div class="product-subtitle text-body1 text-grey-7">
                  {{ product.description }}
                </div>
              </div>

              <!-- 등급 및 인증 정보 -->
              <div class="certification-section q-mb-lg">
                <div class="row q-gutter-md">
                  <q-card flat bordered class="cert-card">
                    <q-card-section class="text-center">
                      <q-icon name="grade" size="32px" color="amber" />
                      <div class="text-subtitle2 text-weight-bold">품질 등급</div>
                      <div class="text-h6 text-primary">{{ product.grade }}등급</div>
                    </q-card-section>
                  </q-card>
                  <q-card flat bordered class="cert-card">
                    <q-card-section class="text-center">
                      <q-icon name="eco" size="32px" color="green" />
                      <div class="text-subtitle2 text-weight-bold">인증</div>
                      <div class="text-caption">HACCP</div>
                    </q-card-section>
                  </q-card>
                  <q-card flat bordered class="cert-card">
                    <q-card-section class="text-center">
                      <q-icon name="local_shipping" size="32px" color="blue" />
                      <div class="text-subtitle2 text-weight-bold">배송</div>
                      <div class="text-caption">냉장배송</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

              <!-- 가격 정보 -->
              <div class="pricing-section q-mb-lg">
                <div class="price-container bg-grey-1 rounded-borders q-pa-lg">
                  <div class="row items-center">
                    <div class="col">
                      <div class="original-price text-strike text-grey-6 q-mb-xs" v-if="product.originalPrice > product.price">
                        {{ formatPrice(product.originalPrice) }}원/kg
                      </div>
                      <div class="current-price text-h4 text-weight-bold text-primary">
                        {{ formatPrice(product.price) }}원<span class="text-subtitle1">/kg</span>
                      </div>
                      <div class="discount-info text-positive q-mt-xs" v-if="discountRate > 0">
                        <q-icon name="local_offer" class="q-mr-xs" />
                        {{ discountRate }}% 할인
                      </div>
                    </div>
                    <div v-if="discountRate > 0">
                      <q-chip color="red" text-color="white" icon="local_offer">
                        {{ discountRate }}% 할인
                      </q-chip>
                    </div>
                  </div>

                  <!-- 최소 주문 안내 -->
                  <q-banner class="bg-orange-1 text-orange-8 q-mt-md">
                    <template v-slot:avatar>
                      <q-icon name="info" />
                    </template>
                    <strong>최소 주문량:</strong> 5kg 이상 ({{ formatPrice(product.price * 5) }}원 부터)
                  </q-banner>
                </div>
              </div>

              <!-- 주문 옵션 -->
              <div class="order-section q-mb-lg">
                <div class="section-title text-h6 text-weight-bold q-mb-md">주문 옵션</div>

                <!-- 수량 선택 -->
                <div class="quantity-selector q-mb-md">
                  <div class="row items-center q-gutter-md">
                    <div class="text-subtitle1 text-weight-medium">수량:</div>
                    <div class="quantity-input">
                      <q-btn
                        round
                        color="grey-3"
                        text-color="dark"
                        icon="remove"
                        size="sm"
                        @click="decreaseQuantity"
                        :disable="quantity <= minQuantity"
                      />
                      <q-input
                        v-model.number="quantity"
                        type="number"
                        :min="minQuantity"
                        :max="product.stock"
                        outlined
                        dense
                        style="width: 80px"
                        class="q-mx-sm"
                        @update:model-value="validateQuantity"
                      />
                      <q-btn
                        round
                        color="grey-3"
                        text-color="dark"
                        icon="add"
                        size="sm"
                        @click="increaseQuantity"
                        :disable="quantity >= product.stock"
                      />
                    </div>
                    <div class="text-body2 text-grey-7">kg (5kg 단위)</div>
                  </div>

                  <!-- 수량 안내 -->
                  <div class="quantity-info q-mt-sm">
                    <div class="text-caption text-grey-6">
                      • 최소 주문량: {{ minQuantity }}kg
                      • 최대 주문량: {{ product.stock }}kg
                    </div>
                    <div v-if="quantity < minQuantity" class="text-negative q-mt-xs">
                      <q-icon name="warning" class="q-mr-xs" />
                      최소 {{ minQuantity }}kg 이상 주문해야 합니다
                    </div>
                  </div>
                </div>

                <!-- 배송일 선택 -->
                <div class="delivery-date-selector q-mb-md">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">희망 배송일:</div>
                  <q-select
                    v-model="selectedDeliveryDate"
                    :options="deliveryDateOptions"
                    outlined
                    dense
                    emit-value
                    map-options
                  />
                  <div class="text-caption text-grey-6 q-mt-xs">
                    • 주문 마감: 오후 3시 (당일 배송은 오전 11시까지)
                    • 일요일/공휴일 배송 불가
                  </div>
                </div>
              </div>

              <!-- 총 금액 -->
              <div class="total-section q-mb-lg">
                <div class="total-container bg-primary text-white rounded-borders q-pa-lg">
                  <div class="row items-center">
                    <div class="col">
                      <div class="text-subtitle2 opacity-80">총 주문 금액</div>
                      <div class="text-h5 text-weight-bold">
                        {{ formatPrice(totalAmount) }}원
                      </div>
                      <div class="text-caption opacity-80">
                        {{ quantity }}kg × {{ formatPrice(product.price) }}원/kg
                      </div>
                    </div>
                    <div v-if="freeShipping">
                      <q-chip color="white" text-color="primary" icon="local_shipping">
                        무료배송
                      </q-chip>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 주문 버튼들 -->
              <div class="action-buttons q-mb-lg">
                <div class="row q-gutter-md">
                  <q-btn
                    color="grey-4"
                    text-color="dark"
                    icon="favorite_border"
                    label="찜하기"
                    size="lg"
                    @click="toggleWishlist"
                    :outline="!isWishlist"
                    class="col-12 col-sm"
                  />
                  <q-btn
                    color="grey-6"
                    text-color="white"
                    icon="shopping_cart"
                    label="장바구니"
                    size="lg"
                    @click="addToCart"
                    :loading="isAddingToCart"
                    :disable="!canOrder"
                    class="col-12 col-sm"
                  />
                  <q-btn
                    color="primary"
                    icon="payment"
                    label="바로 주문"
                    size="lg"
                    @click="orderNow"
                    :disable="!canOrder"
                    class="col-12 col-sm"
                  />
                </div>
              </div>

              <!-- 상품 특징 -->
              <div class="features-section">
                <div class="section-title text-h6 text-weight-bold q-mb-md">상품 특징</div>
                <q-list>
                  <q-item v-for="feature in product.features" :key="feature">
                    <q-item-section avatar>
                      <q-icon name="check_circle" color="positive" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ feature }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 상품 상세 탭 -->
      <div class="product-tabs-section bg-grey-1">
        <div class="container">
          <q-tabs
            v-model="activeTab"
            dense
            class="text-primary"
            indicator-color="primary"
            align="left"
            no-caps
          >
            <q-tab name="detail" icon="info" label="상품 상세정보" />
            <q-tab name="nutrition" icon="restaurant" label="영양 정보" />
            <q-tab name="reviews" icon="rate_review" label="언박싱 리뷰" />
            <q-tab name="qna" icon="help" label="상품 문의" />
            <q-tab name="delivery" icon="local_shipping" label="배송/교환/반품" />
          </q-tabs>
        </div>
      </div>

      <div class="container q-py-lg">
        <q-tab-panels v-model="activeTab" animated>
          <!-- 상품 상세정보 -->
          <q-tab-panel name="detail" class="q-pa-none">
            <div class="detail-content">
              <div class="text-h6 text-weight-bold q-mb-md">상품 상세정보</div>

              <!-- 상세 이미지들 -->
              <div class="detail-images q-mb-lg">
                <q-img
                  v-for="(image, index) in product.detailImages"
                  :key="index"
                  :src="image"
                  class="q-mb-md rounded-borders"
                />
              </div>

              <!-- 상품 스펙 -->
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1 text-weight-bold q-mb-md">상품 정보</div>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>원산지</q-item-label>
                        <q-item-label>{{ product.origin }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>보관방법</q-item-label>
                        <q-item-label>{{ product.storageMethod }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>유통기한</q-item-label>
                        <q-item-label>{{ product.shelfLife }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>포장단위</q-item-label>
                        <q-item-label>{{ product.packingUnit }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <!-- 영양 정보 -->
          <q-tab-panel name="nutrition" class="q-pa-none">
            <div class="nutrition-content">
              <div class="text-h6 text-weight-bold q-mb-md">영양 정보 (100g당)</div>

              <q-card flat bordered>
                <q-card-section>
                  <div class="row q-gutter-md">
                    <div class="col-12 col-md-6">
                      <q-list>
                        <q-item v-for="nutrient in product.nutrition" :key="nutrient.name">
                          <q-item-section>
                            <q-item-label>{{ nutrient.name }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label>{{ nutrient.value }}{{ nutrient.unit }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-img
                        :src="product.nutritionChart"
                        class="rounded-borders"
                        v-if="product.nutritionChart"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <!-- 언박싱 리뷰 -->
          <q-tab-panel name="reviews" class="q-pa-none">
            <div class="reviews-content">
              <div class="review-header q-mb-lg">
                <div class="row items-center justify-between">
                  <div class="text-h6 text-weight-bold">언박싱 리뷰</div>
                  <q-btn
                    color="primary"
                    label="리뷰 작성"
                    icon="add"
                    @click="writeReview"
                  />
                </div>
                <div class="review-stats q-mt-md">
                  <div class="row items-center q-gutter-md">
                    <div class="rating-info">
                      <q-rating
                        v-model="product.averageRating"
                        size="24px"
                        color="amber"
                        readonly
                      />
                      <span class="text-h6 text-weight-bold q-ml-sm">
                        {{ product.averageRating.toFixed(1) }}
                      </span>
                    </div>
                    <div class="review-count text-grey-7">
                      ({{ product.reviewCount }}개 리뷰)
                    </div>
                  </div>
                </div>
              </div>

              <!-- 리뷰 목록 -->
              <div class="review-list">
                <div v-for="review in product.reviews" :key="review.id" class="review-item q-mb-lg">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="row items-start q-gutter-md">
                        <!-- 리뷰 이미지/동영상 -->
                        <div class="review-media">
                          <q-img
                            v-if="review.type === 'image'"
                            :src="review.media"
                            width="120px"
                            height="120px"
                            class="rounded-borders cursor-pointer"
                            @click="viewReviewImage(review.media)"
                          />
                          <div v-else-if="review.type === 'video'" class="video-thumbnail">
                            <q-img
                              :src="review.thumbnail"
                              width="120px"
                              height="120px"
                              class="rounded-borders cursor-pointer"
                              @click="playReviewVideo(review.media)"
                            >
                              <div class="absolute-center">
                                <q-btn
                                  fab
                                  color="white"
                                  text-color="primary"
                                  icon="play_arrow"
                                  size="sm"
                                />
                              </div>
                            </q-img>
                          </div>
                        </div>

                        <!-- 리뷰 내용 -->
                        <div class="review-content col">
                          <div class="review-header q-mb-sm">
                            <div class="row items-center justify-between">
                              <div>
                                <q-rating
                                  v-model="review.rating"
                                  size="16px"
                                  color="amber"
                                  readonly
                                />
                                <span class="text-weight-bold q-ml-sm">{{ review.customerName }}</span>
                                <q-chip
                                  v-if="review.verified"
                                  dense
                                  color="green"
                                  text-color="white"
                                  icon="verified"
                                  size="sm"
                                  class="q-ml-sm"
                                >
                                  구매인증
                                </q-chip>
                              </div>
                              <div class="text-caption text-grey-6">
                                {{ formatDate(review.createdAt) }}
                              </div>
                            </div>
                          </div>

                          <div class="review-text text-body1 q-mb-sm">
                            {{ review.content }}
                          </div>

                          <!-- 포인트 적립 정보 -->
                          <div v-if="review.type === 'video'" class="reward-info">
                            <q-chip
                              dense
                              color="orange"
                              text-color="white"
                              icon="emoji_events"
                              size="sm"
                            >
                              영상 리뷰 +500P 적립
                            </q-chip>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

              <!-- 더보기 버튼 -->
              <div class="text-center q-mt-lg">
                <q-btn
                  flat
                  color="primary"
                  label="더 많은 리뷰 보기"
                  icon="expand_more"
                  @click="loadMoreReviews"
                />
              </div>
            </div>
          </q-tab-panel>

          <!-- 상품 문의 -->
          <q-tab-panel name="qna" class="q-pa-none">
            <div class="qna-content">
              <div class="qna-header q-mb-lg">
                <div class="row items-center justify-between">
                  <div class="text-h6 text-weight-bold">상품 문의</div>
                  <q-btn
                    color="primary"
                    label="문의하기"
                    icon="help"
                    @click="writeQuestion"
                  />
                </div>
              </div>

              <!-- 문의 목록 -->
              <div class="qna-list">
                <div v-for="qna in product.questions" :key="qna.id" class="qna-item q-mb-md">
                  <q-expansion-item
                    :icon="qna.answered ? 'check_circle' : 'help_outline'"
                    :label="qna.title"
                    :caption="`${qna.customerName} • ${formatDate(qna.createdAt)}`"
                    :header-class="qna.answered ? 'text-positive' : 'text-grey-7'"
                  >
                    <q-card>
                      <q-card-section class="bg-grey-1">
                        <div class="text-subtitle2 text-weight-bold q-mb-sm">문의 내용</div>
                        <div class="text-body1">{{ qna.question }}</div>
                      </q-card-section>

                      <q-card-section v-if="qna.answered">
                        <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">
                          <q-icon name="support_agent" class="q-mr-xs" />
                          육프로 답변
                        </div>
                        <div class="text-body1">{{ qna.answer }}</div>
                        <div class="text-caption text-grey-6 q-mt-sm">
                          {{ formatDate(qna.answeredAt) }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- 배송/교환/반품 -->
          <q-tab-panel name="delivery" class="q-pa-none">
            <div class="delivery-content">
              <div class="text-h6 text-weight-bold q-mb-md">배송 정보</div>

              <q-card flat bordered class="q-mb-lg">
                <q-card-section>
                  <q-list>
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="local_shipping" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold">배송 방법</q-item-label>
                        <q-item-label caption>CJ대한통운 냉장배송</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="schedule" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold">배송 시간</q-item-label>
                        <q-item-label caption>오전 7시 ~ 오후 7시</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="payments" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold">배송비</q-item-label>
                        <q-item-label caption>30만원 이상 무료, 미만시 5,000원</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>

              <div class="text-h6 text-weight-bold q-mb-md">교환/반품 정책</div>

              <q-card flat bordered>
                <q-card-section>
                  <div class="text-body1 q-mb-md">
                    <strong>교환/반품 가능 기간:</strong> 상품 수령 후 24시간 이내
                  </div>
                  <div class="text-body1 q-mb-md">
                    <strong>교환/반품 불가 사유:</strong>
                  </div>
                  <ul class="text-body2 q-pl-md">
                    <li>냉장/냉동 상품 특성상 포장 개봉 후</li>
                    <li>고객 단순 변심 (단, 상품 하자 시 가능)</li>
                    <li>보관 부주의로 인한 품질 변화</li>
                  </ul>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <!-- 관련 상품 추천 -->
      <div class="related-products-section bg-grey-1 q-py-xl">
        <div class="container">
          <div class="text-h5 text-weight-bold q-mb-lg">이런 상품은 어때요?</div>

          <div class="row q-gutter-md">
            <q-card
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              class="related-product-card col-12 col-sm-6 col-md-3 cursor-pointer"
              @click="goToProduct(relatedProduct.id)"
            >
              <q-img
                :src="relatedProduct.image"
                :ratio="4/3"
                class="rounded-borders-top"
              >
                <div class="absolute-bottom-right q-ma-xs">
                  <q-chip dense color="primary" text-color="white">
                    최소 5kg
                  </q-chip>
                </div>
              </q-img>
              <q-card-section>
                <div class="text-subtitle2 text-weight-bold">{{ relatedProduct.name }}</div>
                <div class="text-h6 text-primary">{{ formatPrice(relatedProduct.price) }}원/kg</div>
                <div class="text-caption text-grey-7">{{ relatedProduct.description }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 주문 바 (모바일) -->
    <div v-if="$q.screen.lt.md" class="mobile-order-bar">
      <div class="row items-center q-pa-md bg-white shadow-up">
        <div class="col">
          <div class="text-caption text-grey-7">총 주문 금액</div>
          <div class="text-h6 text-weight-bold text-primary">
            {{ formatPrice(totalAmount) }}원
          </div>
        </div>
        <div class="q-gutter-sm">
          <q-btn
            color="grey-6"
            icon="shopping_cart"
            @click="addToCart"
            :loading="isAddingToCart"
            :disable="!canOrder"
          />
          <q-btn
            color="primary"
            label="바로 주문"
            @click="orderNow"
            :disable="!canOrder"
          />
        </div>
      </div>
    </div>

    <!-- 이미지 뷰어 다이얼로그 -->
    <q-dialog v-model="showImageViewer" :maximized="$q.screen.lt.sm">
      <q-card style="min-width: 600px">
        <q-card-section class="bg-dark text-white">
          <div class="text-h6">상품 이미지</div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-carousel
            v-model="imageViewerIndex"
            navigation
            padding
            arrows
            height="500px"
          >
            <q-carousel-slide
              v-for="(image, index) in product.images"
              :key="index"
              :name="index"
              :img-src="image"
            />
          </q-carousel>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="닫기" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

// 반응형 데이터
const isLoading = ref(true)
const error = ref('')
const activeTab = ref('detail')
const selectedImageIndex = ref(0)
const quantity = ref(5)
const selectedDeliveryDate = ref('')
const isAddingToCart = ref(false)
const isWishlist = ref(false)
const showImageViewer = ref(false)
const imageViewerIndex = ref(0)

const minQuantity = 5 // 최소 주문량 5kg

// 상품 데이터
const product = ref({
  id: '',
  name: '',
  description: '',
  categoryId: '',
  categoryName: '',
  price: 0,
  originalPrice: 0,
  grade: '',
  stock: 0,
  images: [] as string[],
  detailImages: [] as string[],
  origin: '',
  storageMethod: '',
  shelfLife: '',
  packingUnit: '',
  features: [] as string[],
  nutrition: [] as { name: string; value: number; unit: string }[],
  nutritionChart: '',
  averageRating: 0,
  reviewCount: 0,
  reviews: [] as any[],
  questions: [] as any[]
})

// 관련 상품
const relatedProducts = ref([
  {
    id: '2',
    name: '프리미엄 한우 갈비',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    description: '1++등급 한우 갈비'
  },
  {
    id: '3',
    name: '국내산 돼지 목살',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
    description: '부드럽고 고소한 목살'
  },
  {
    id: '4',
    name: '닭가슴살 (무항생제)',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    description: '건강한 무항생제 닭가슴살'
  },
  {
    id: '5',
    name: 'LA갈비 (호주산)',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    description: '부드러운 호주산 LA갈비'
  }
])

// computed
const selectedImage = computed(() => {
  return product.value.images[selectedImageIndex.value] || ''
})

const discountRate = computed(() => {
  if (product.value.originalPrice > product.value.price) {
    return Math.round(((product.value.originalPrice - product.value.price) / product.value.originalPrice) * 100)
  }
  return 0
})

const totalAmount = computed(() => {
  return quantity.value * product.value.price
})

const freeShipping = computed(() => {
  return totalAmount.value >= 300000 // 30만원 이상 무료배송
})

const canOrder = computed(() => {
  return quantity.value >= minQuantity &&
    quantity.value <= product.value.stock &&
    product.value.stock > 0 &&
    selectedDeliveryDate.value
})

const deliveryDateOptions = computed(() => {
  const options = []
  const today = new Date()

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // 일요일 제외
    if (date.getDay() !== 0) {
      const label = i === 1 ? '내일' :
        i === 2 ? '모레' :
          `${date.getMonth() + 1}/${date.getDate()}(${['일','월','화','수','목','금','토'][date.getDay()]})`

      options.push({
        label: label,
        value: date.toISOString().split('T')[0]
      })
    }
  }

  return options
})

// 메소드
const loadProduct = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const productId = route.params.id as string

    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock 데이터
    const mockProduct = {
      id: productId,
      name: '프리미엄 한우 등심',
      description: '1++등급 한우로만 만든 최고급 등심입니다',
      categoryId: 'beef',
      categoryName: '한우',
      price: 65000,
      originalPrice: 75000,
      grade: '1++',
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
        'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
        'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800',
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800'
      ],
      detailImages: [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200',
        'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=1200'
      ],
      origin: '국내산 (전라북도 정읍)',
      storageMethod: '냉장 보관 (0~4℃)',
      shelfLife: '제조일로부터 7일',
      packingUnit: '1kg 단위 진공포장',
      features: [
        '1++등급 한우만 사용',
        '24시간 숙성으로 부드러운 식감',
        '무항생제 인증',
        'HACCP 인증 시설에서 가공',
        '진공포장으로 신선도 유지'
      ],
      nutrition: [
        { name: '칼로리', value: 250, unit: 'kcal' },
        { name: '단백질', value: 26.4, unit: 'g' },
        { name: '지방', value: 15.2, unit: 'g' },
        { name: '탄수화물', value: 0, unit: 'g' },
        { name: '나트륨', value: 65, unit: 'mg' },
        { name: '콜레스테롤', value: 75, unit: 'mg' }
      ],
      nutritionChart: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
      averageRating: 4.8,
      reviewCount: 127,
      reviews: [
        {
          id: '1',
          type: 'video',
          media: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200',
          rating: 5,
          customerName: '김○○',
          content: '정말 맛있어요! 마블링이 예술이네요. 가족들이 너무 좋아해서 재주문할 예정입니다.',
          verified: true,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'image',
          media: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
          rating: 4,
          customerName: '박○○',
          content: '포장도 깔끔하고 고기 품질이 정말 좋네요. 다음에는 더 많이 주문해야겠어요.',
          verified: true,
          createdAt: '2024-01-10T14:20:00Z'
        }
      ],
      questions: [
        {
          id: '1',
          title: '유통기한이 얼마나 되나요?',
          question: '주문 후 며칠 정도 보관할 수 있는지 궁금합니다.',
          customerName: '이○○',
          createdAt: '2024-01-12T09:15:00Z',
          answered: true,
          answer: '배송일 기준으로 냉장보관시 7일간 보관 가능합니다. 진공포장 상태로 배송되어 신선도가 오래 유지됩니다.',
          answeredAt: '2024-01-12T15:30:00Z'
        },
        {
          id: '2',
          title: '5kg 미만으로도 주문 가능한가요?',
          question: '혼자 살아서 5kg는 너무 많을 것 같은데 소량 주문이 가능한지 문의드립니다.',
          customerName: '최○○',
          createdAt: '2024-01-08T16:45:00Z',
          answered: true,
          answer: '죄송하지만 B2B 특성상 최소 주문량이 5kg입니다. 진공포장되어 있어 소분하여 냉동보관하시면 오래 드실 수 있습니다.',
          answeredAt: '2024-01-09T11:20:00Z'
        }
      ]
    }

    product.value = mockProduct

    // 기본 배송일 설정
    if (deliveryDateOptions.value.length > 0) {
      selectedDeliveryDate.value = deliveryDateOptions.value[0].value
    }

  } catch (err) {
    error.value = '상품 정보를 불러오는데 실패했습니다.'
    console.error('Product loading error:', err)
  } finally {
    isLoading.value = false
  }
}

const selectImage = (index: number) => {
  selectedImageIndex.value = index
}

const openImageViewer = () => {
  imageViewerIndex.value = selectedImageIndex.value
  showImageViewer.value = true
}

const validateQuantity = (newQuantity: number) => {
  if (newQuantity < minQuantity) {
    quantity.value = minQuantity
  } else if (newQuantity > product.value.stock) {
    quantity.value = product.value.stock
  } else {
    // 5kg 단위로 조정
    quantity.value = Math.round(newQuantity / 5) * 5
  }
}

const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value += 5
  }
}

const decreaseQuantity = () => {
  if (quantity.value > minQuantity) {
    quantity.value -= 5
  }
}

const toggleWishlist = () => {
  isWishlist.value = !isWishlist.value

  $q.notify({
    type: 'positive',
    message: isWishlist.value ? '찜 목록에 추가되었습니다' : '찜 목록에서 제거되었습니다',
    icon: isWishlist.value ? 'favorite' : 'favorite_border'
  })
}

const addToCart = async () => {
  if (!canOrder.value) return

  isAddingToCart.value = true

  try {
    // 장바구니 추가 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000))

    const cartItem = {
      productId: product.value.id,
      name: product.value.name,
      price: product.value.price,
      quantity: quantity.value,
      deliveryDate: selectedDeliveryDate.value,
      image: product.value.images[0]
    }

    console.log('Added to cart:', cartItem)

    $q.notify({
      type: 'positive',
      message: '장바구니에 추가되었습니다',
      actions: [
        {
          label: '장바구니 보기',
          color: 'white',
          handler: () => router.push('/cart')
        }
      ]
    })

  } catch (err) {
    $q.notify({
      type: 'negative',
      message: '장바구니 추가에 실패했습니다'
    })
  } finally {
    isAddingToCart.value = false
  }
}

const orderNow = () => {
  if (!canOrder.value) return

  const orderData = {
    items: [{
      productId: product.value.id,
      name: product.value.name,
      price: product.value.price,
      quantity: quantity.value,
      deliveryDate: selectedDeliveryDate.value,
      image: product.value.images[0]
    }]
  }

  // 주문 페이지로 이동
  sessionStorage.setItem('directOrder', JSON.stringify(orderData))
  router.push('/checkout')
}

const writeReview = () => {
  // 리뷰 작성 페이지 또는 모달
  $q.notify({
    type: 'info',
    message: '구매 후 리뷰 작성이 가능합니다'
  })
}

const writeQuestion = () => {
  // 문의 작성 모달 또는 페이지
  $q.notify({
    type: 'info',
    message: '문의 작성 기능은 준비중입니다'
  })
}

const loadMoreReviews = () => {
  // 더 많은 리뷰 로드
  $q.notify({
    type: 'info',
    message: '더 이상 리뷰가 없습니다'
  })
}

const viewReviewImage = (imageUrl: string) => {
  // 리뷰 이미지 확대 보기
  console.log('View review image:', imageUrl)
}

const playReviewVideo = (videoUrl: string) => {
  // 리뷰 동영상 재생
  console.log('Play review video:', videoUrl)
  window.open(videoUrl, '_blank')
}

const goToProduct = (productId: string) => {
  router.push(`/products/${productId}`)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// 라이프사이클
onMounted(() => {
  loadProduct()
})

// 상품 ID가 변경되면 다시 로드
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadProduct()
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.product-detail-page {
  min-height: 100vh;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.loading-container,
.error-container {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.breadcrumb-section {
  border-bottom: 1px solid #e0e0e0;
}

.image-gallery {
  .main-image-container {
    position: relative;

    .main-image {
      border: 1px solid #e0e0e0;
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.02);
      }
    }
  }

  .thumbnail-container {
    .thumbnail-image {
      border: 2px solid transparent;
      transition: border-color 0.2s ease;

      &:hover,
      &.selected {
        border-color: var(--q-primary);
      }
    }
  }
}

.product-info {
  .product-header {
    .product-category {
      font-size: 14px;
      letter-spacing: 1px;
    }

    .product-title {
      line-height: 1.3;
    }
  }

  .certification-section {
    .cert-card {
      flex: 1;
      border-radius: 8px;
    }
  }

  .pricing-section {
    .price-container {
      border: 2px solid var(--q-primary);

      .original-price {
        font-size: 16px;
      }

      .current-price {
        color: var(--q-primary);
      }
    }
  }

  .order-section {
    .quantity-selector {
      .quantity-input {
        display: flex;
        align-items: center;
      }
    }
  }

  .total-section {
    .total-container {
      background: linear-gradient(135deg, var(--q-primary) 0%, #1565C0 100%);
    }
  }

  .action-buttons {
    .q-btn {
      min-height: 56px;
    }
  }
}

.product-tabs-section {
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-content {
  .detail-images {
    img {
      max-width: 100%;
    }
  }
}

.reviews-content {
  .review-item {
    .review-media {
      flex-shrink: 0;
    }

    .video-thumbnail {
      position: relative;
    }
  }
}

.related-products-section {
  .related-product-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  }
}

.mobile-order-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 600px) {
  .container {
    padding: 0 8px;
  }

  .row.q-gutter-xl {
    gap: 24px;
  }

  .certification-section {
    .row.q-gutter-md {
      flex-direction: column;
      gap: 8px;
    }
  }

  .action-buttons {
    .row.q-gutter-md {
      flex-direction: column;
      gap: 8px;
    }
  }
}

@media (max-width: 1024px) {
  .image-gallery {
    margin-bottom: 32px;
  }

  .product-info {
    .action-buttons {
      position: sticky;
      bottom: 16px;
      background: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
      margin: 0 -16px;
      z-index: 100;
    }
  }
}
</style>
