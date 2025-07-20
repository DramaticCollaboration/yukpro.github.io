<template>
  <q-page class="checkout-page">
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
            <div class="text-h4 text-weight-bold">주문/결제</div>
            <div class="text-subtitle1 opacity-80">
              안전하고 신속한 B2B 전용 결제 시스템
            </div>
          </div>
          <div class="header-info">
            <q-icon name="security" class="q-mr-xs" />
            <span class="text-caption">보안결제</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 진행 단계 표시 -->
    <div class="bg-grey-1 q-py-md">
      <div class="container">
        <q-stepper
          v-model="currentStep"
          color="primary"
          header-nav
          flat
          animated
        >
          <q-step
            :name="1"
            title="주문 정보 확인"
            icon="shopping_cart"
            :done="currentStep > 1"
          />
          <q-step
            :name="2"
            title="배송 정보"
            icon="local_shipping"
            :done="currentStep > 2"
          />
          <q-step
            :name="3"
            title="결제 정보"
            icon="payment"
            :done="currentStep > 3"
          />
          <q-step
            :name="4"
            title="주문 완료"
            icon="check_circle"
          />
        </q-stepper>
      </div>
    </div>

    <div class="container q-py-lg">
      <div class="row q-gutter-lg">
        <!-- 왼쪽: 주문 정보 -->
        <div class="col-12 col-md-8">
          <!-- 1단계: 주문 정보 확인 -->
          <div v-show="currentStep === 1" class="checkout-step">
            <div class="step-header q-mb-lg">
              <h5 class="text-weight-bold">주문 상품 확인</h5>
              <p class="text-grey-7">주문하실 상품을 확인해주세요</p>
            </div>

            <q-card flat bordered class="order-items-card">
              <q-card-section>
                <div class="order-items">
                  <div
                    v-for="(item, index) in orderItems"
                    :key="item.id"
                    class="order-item"
                    :class="{ 'q-mb-lg': index < orderItems.length - 1 }"
                  >
                    <div class="row q-gutter-md">
                      <!-- 상품 이미지 -->
                      <div class="col-auto">
                        <q-img
                          :src="item.image"
                          style="width: 100px; height: 100px"
                          class="rounded-borders"
                          spinner-color="primary"
                        />
                      </div>

                      <!-- 상품 정보 -->
                      <div class="col">
                        <div class="row items-start justify-between">
                          <div class="item-details">
                            <div class="text-h6 text-weight-bold q-mb-xs">
                              {{ item.name }}
                            </div>
                            <div class="text-body2 text-grey-6 q-mb-sm">
                              {{ item.category }} | {{ item.grade }}등급 | {{ item.origin }}
                            </div>

                            <div class="item-specs q-mb-sm">
                              <q-chip
                                size="sm"
                                color="primary"
                                text-color="white"
                                icon="scale"
                              >
                                {{ item.weight }}kg
                              </q-chip>
                              <q-chip
                                size="sm"
                                color="blue"
                                text-color="white"
                                icon="ac_unit"
                              >
                                냉장배송
                              </q-chip>
                              <q-chip
                                v-if="item.urgent"
                                size="sm"
                                color="red"
                                text-color="white"
                                icon="priority_high"
                              >
                                긴급
                              </q-chip>
                            </div>

                            <!-- 배송일 정보 -->
                            <div class="delivery-info">
                              <q-icon name="schedule" color="orange" class="q-mr-xs" />
                              <span class="text-body2">
                                배송예정: {{ formatDeliveryDate(item.deliveryDate) }}
                              </span>
                            </div>
                          </div>

                          <!-- 가격 정보 -->
                          <div class="item-pricing text-right">
                            <div class="text-h6 text-weight-bold text-primary">
                              {{ formatPrice(item.totalPrice) }}원
                            </div>
                            <div class="text-body2 text-grey-6">
                              {{ formatPrice(item.unitPrice) }}원/kg × {{ item.weight }}kg
                            </div>

                            <!-- 수량 조정 버튼 -->
                            <div class="quantity-controls q-mt-sm">
                              <q-btn-group outline>
                                <q-btn
                                  outline
                                  color="grey-6"
                                  icon="remove"
                                  size="sm"
                                  @click="decreaseQuantity(item.id)"
                                  :disable="item.weight <= 5"
                                />
                                <q-btn
                                  outline
                                  color="grey-6"
                                  :label="`${item.weight}kg`"
                                  size="sm"
                                  style="min-width: 60px"
                                  no-caps
                                />
                                <q-btn
                                  outline
                                  color="grey-6"
                                  icon="add"
                                  size="sm"
                                  @click="increaseQuantity(item.id)"
                                />
                              </q-btn-group>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 삭제 버튼 -->
                      <div class="col-auto">
                        <q-btn
                          flat
                          round
                          color="grey-5"
                          icon="delete"
                          @click="removeItem(item.id)"
                        >
                          <q-tooltip>상품 삭제</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>

              <!-- 추가 상품 주문 -->
              <q-card-section class="bg-grey-1">
                <div class="text-center">
                  <q-btn
                    flat
                    color="primary"
                    icon="add_shopping_cart"
                    label="추가 상품 주문"
                    @click="addMoreProducts"
                  />
                </div>
              </q-card-section>
            </q-card>

            <!-- 최소 주문량 안내 -->
            <q-banner
              v-if="!isMinimumOrderMet"
              class="bg-orange-1 text-orange-8 q-mt-md"
            >
              <template v-slot:avatar>
                <q-icon name="warning" />
              </template>
              <strong>최소 주문량 미달:</strong>
              {{ totalWeight }}kg / {{ minimumOrderWeight }}kg 이상 주문해주세요
            </q-banner>

            <div class="step-actions q-mt-xl">
              <q-btn
                color="primary"
                label="배송 정보 입력"
                icon-right="arrow_forward"
                size="lg"
                @click="goToStep(2)"
                :disable="!isMinimumOrderMet"
              />
            </div>
          </div>

          <!-- 2단계: 배송 정보 -->
          <div v-show="currentStep === 2" class="checkout-step">
            <div class="step-header q-mb-lg">
              <h5 class="text-weight-bold">배송 정보</h5>
              <p class="text-grey-7">상품을 받으실 정보를 입력해주세요</p>
            </div>

            <!-- 배송지 정보 -->
            <q-card flat bordered class="delivery-card q-mb-lg">
              <q-card-section>
                <div class="card-title text-h6 text-weight-bold q-mb-md">
                  <q-icon name="location_on" class="q-mr-sm" />
                  배송지 정보
                </div>

                <!-- 기본 배송지 선택 -->
                <div class="saved-addresses q-mb-lg" v-if="savedAddresses.length > 0">
                  <div class="text-subtitle2 text-weight-bold q-mb-sm">
                    저장된 배송지
                  </div>
                  <div class="row q-gutter-sm">
                    <q-card
                      v-for="address in savedAddresses"
                      :key="address.id"
                      flat
                      bordered
                      class="address-card cursor-pointer col-12 col-sm-6"
                      :class="{ 'selected': selectedAddressId === address.id }"
                      @click="selectAddress(address)"
                    >
                      <q-card-section>
                        <div class="row items-center">
                          <div class="col">
                            <div class="text-weight-bold">{{ address.name }}</div>
                            <div class="text-body2 text-grey-7">{{ address.address }}</div>
                            <div class="text-caption text-grey-6">
                              {{ address.phone }} | {{ address.company }}
                            </div>
                          </div>
                          <div class="col-auto">
                            <q-radio
                              v-model="selectedAddressId"
                              :val="address.id"
                              color="primary"
                            />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <q-separator class="q-my-lg" />
                </div>

                <!-- 새 배송지 입력 -->
                <div class="new-address">
                  <div class="text-subtitle2 text-weight-bold q-mb-sm">
                    {{ savedAddresses.length > 0 ? '새 배송지' : '배송지 정보' }}
                  </div>

                  <div class="row q-gutter-md">
                    <!-- 받는 분 -->
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="deliveryInfo.recipientName"
                        label="받는 분"
                        outlined
                        dense
                        :rules="[val => !!val || '받는 분을 입력해주세요']"
                      >
                        <template v-slot:prepend>
                          <q-icon name="person" />
                        </template>
                      </q-input>
                    </div>

                    <!-- 연락처 -->
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="deliveryInfo.phone"
                        label="연락처"
                        outlined
                        dense
                        mask="###-####-####"
                        placeholder="010-0000-0000"
                        :rules="[val => !!val || '연락처를 입력해주세요']"
                      >
                        <template v-slot:prepend>
                          <q-icon name="phone" />
                        </template>
                      </q-input>
                    </div>

                    <!-- 회사명 -->
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="deliveryInfo.company"
                        label="회사명"
                        outlined
                        dense
                      >
                        <template v-slot:prepend>
                          <q-icon name="business" />
                        </template>
                      </q-input>
                    </div>

                    <!-- 부서 -->
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="deliveryInfo.department"
                        label="부서/직책"
                        outlined
                        dense
                      >
                        <template v-slot:prepend>
                          <q-icon name="badge" />
                        </template>
                      </q-input>
                    </div>

                    <!-- 우편번호 검색 -->
                    <div class="col-12">
                      <div class="row q-gutter-md">
                        <div class="col">
                          <q-input
                            v-model="deliveryInfo.zipCode"
                            label="우편번호"
                            outlined
                            dense
                            readonly
                            :rules="[val => !!val || '우편번호를 검색해주세요']"
                          >
                            <template v-slot:prepend>
                              <q-icon name="location_on" />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-auto">
                          <q-btn
                            color="primary"
                            label="주소 검색"
                            icon="search"
                            @click="searchAddress"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- 기본 주소 -->
                    <div class="col-12">
                      <q-input
                        v-model="deliveryInfo.address"
                        label="기본 주소"
                        outlined
                        dense
                        readonly
                        :rules="[val => !!val || '주소를 검색해주세요']"
                      />
                    </div>

                    <!-- 상세 주소 -->
                    <div class="col-12">
                      <q-input
                        v-model="deliveryInfo.detailAddress"
                        label="상세 주소"
                        outlined
                        dense
                        placeholder="동, 호수 등 상세 주소를 입력해주세요"
                      />
                    </div>

                    <!-- 배송 요청사항 -->
                    <div class="col-12">
                      <q-select
                        v-model="deliveryInfo.deliveryRequest"
                        :options="deliveryRequestOptions"
                        label="배송 요청사항"
                        outlined
                        dense
                        emit-value
                        map-options
                        clearable
                      >
                        <template v-slot:prepend>
                          <q-icon name="message" />
                        </template>
                      </q-select>

                      <!-- 직접 입력 -->
                      <q-input
                        v-if="deliveryInfo.deliveryRequest === 'custom'"
                        v-model="deliveryInfo.customRequest"
                        label="직접 입력"
                        outlined
                        dense
                        class="q-mt-sm"
                        maxlength="50"
                        counter
                      />
                    </div>

                    <!-- 배송지 저장 -->
                    <div class="col-12">
                      <q-checkbox
                        v-model="deliveryInfo.saveAddress"
                        label="이 주소를 기본 배송지로 저장"
                        color="primary"
                      />
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- 배송일 선택 -->
            <q-card flat bordered class="delivery-date-card">
              <q-card-section>
                <div class="card-title text-h6 text-weight-bold q-mb-md">
                  <q-icon name="schedule" class="q-mr-sm" />
                  배송일 선택
                </div>

                <!-- 달력 UI -->
                <div class="delivery-calendar q-mb-md">
                  <q-date
                    v-model="deliveryInfo.deliveryDate"
                    :options="availableDeliveryDates"
                    color="primary"
                    today-btn
                    minimal
                  />
                </div>

                <!-- 배송 시간 선택 -->
                <div class="delivery-time q-mb-md">
                  <div class="text-subtitle2 text-weight-bold q-mb-sm">배송 시간</div>
                  <q-option-group
                    v-model="deliveryInfo.deliveryTime"
                    :options="deliveryTimeOptions"
                    color="primary"
                    inline
                  />
                </div>

                <!-- 배송 안내 -->
                <q-banner class="bg-blue-1 text-blue-8">
                  <template v-slot:avatar>
                    <q-icon name="info" />
                  </template>
                  <div class="text-body2">
                    <strong>배송 안내:</strong><br>
                    • 냉장배송으로 신선도를 유지합니다<br>
                    • 일요일/공휴일은 배송이 불가합니다<br>
                    • 당일 배송은 오전 11시까지 주문 시 가능합니다<br>
                    • 배송지 도서산간 지역은 추가 배송비가 발생할 수 있습니다
                  </div>
                </q-banner>
              </q-card-section>
            </q-card>

            <div class="step-actions q-mt-xl">
              <div class="row q-gutter-md">
                <q-btn
                  outline
                  color="grey-6"
                  label="이전 단계"
                  icon="arrow_back"
                  @click="goToStep(1)"
                />
                <q-btn
                  color="primary"
                  label="결제 정보 입력"
                  icon-right="arrow_forward"
                  size="lg"
                  @click="goToStep(3)"
                  :disable="!isDeliveryInfoValid"
                />
              </div>
            </div>
          </div>

          <!-- 3단계: 결제 정보 -->
          <div v-show="currentStep === 3" class="checkout-step">
            <div class="step-header q-mb-lg">
              <h5 class="text-weight-bold">결제 정보</h5>
              <p class="text-grey-7">결제 방법을 선택해주세요</p>
            </div>

            <!-- 결제 방법 선택 -->
            <q-card flat bordered class="payment-card q-mb-lg">
              <q-card-section>
                <div class="card-title text-h6 text-weight-bold q-mb-md">
                  <q-icon name="payment" class="q-mr-sm" />
                  결제 방법
                </div>

                <q-list>
                  <q-item
                    v-for="method in paymentMethods"
                    :key="method.id"
                    clickable
                    @click="selectPaymentMethod(method.id)"
                    :active="selectedPaymentMethod === method.id"
                    active-class="text-primary bg-blue-1"
                  >
                    <q-item-section avatar>
                      <q-radio
                        v-model="selectedPaymentMethod"
                        :val="method.id"
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="method.icon" :color="method.color" size="md" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ method.name }}</q-item-label>
                      <q-item-label caption>{{ method.description }}</q-item-label>
                      <div v-if="method.discount" class="text-positive q-mt-xs">
                        <q-icon name="local_offer" class="q-mr-xs" />
                        {{ method.discount }}% 할인 혜택
                      </div>
                    </q-item-section>
                    <q-item-section side v-if="method.fee">
                      <q-item-label caption>수수료 {{ formatPrice(method.fee) }}원</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>

            <!-- 계좌이체 정보 (선택 시) -->
            <q-card
              v-if="selectedPaymentMethod === 'bank_transfer'"
              flat
              bordered
              class="bank-info-card q-mb-lg"
            >
              <q-card-section class="bg-grey-1">
                <div class="text-subtitle2 text-weight-bold q-mb-md">
                  <q-icon name="account_balance" class="q-mr-sm" />
                  입금 계좌 정보
                </div>
                <div class="bank-accounts">
                  <div
                    v-for="account in bankAccounts"
                    :key="account.bank"
                    class="bank-account q-mb-sm"
                  >
                    <div class="text-body1 text-weight-bold">
                      {{ account.bank }} {{ account.accountNumber }}
                    </div>
                    <div class="text-body2 text-grey-7">예금주: {{ account.accountHolder }}</div>
                  </div>
                </div>
                <q-banner class="bg-orange-1 text-orange-8 q-mt-md">
                  <template v-slot:avatar>
                    <q-icon name="schedule" />
                  </template>
                  입금 확인 후 상품이 발송됩니다. 영업일 기준 1-2일 소요됩니다.
                </q-banner>
              </q-card-section>
            </q-card>

            <!-- 세금계산서 정보 -->
            <q-card flat bordered class="tax-invoice-card">
              <q-card-section>
                <div class="card-title text-h6 text-weight-bold q-mb-md">
                  <q-icon name="receipt" class="q-mr-sm" />
                  세금계산서 정보
                </div>

                <q-checkbox
                  v-model="taxInvoiceInfo.required"
                  label="세금계산서 발행 요청"
                  color="primary"
                  class="q-mb-md"
                />

                <div v-if="taxInvoiceInfo.required" class="tax-invoice-form">
                  <div class="row q-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="taxInvoiceInfo.businessNumber"
                        label="사업자등록번호"
                        outlined
                        dense
                        mask="###-##-#####"
                        placeholder="000-00-00000"
                        :rules="[val => !!val || '사업자등록번호를 입력해주세요']"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="taxInvoiceInfo.companyName"
                        label="회사명"
                        outlined
                        dense
                        :rules="[val => !!val || '회사명을 입력해주세요']"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="taxInvoiceInfo.ceoName"
                        label="대표자명"
                        outlined
                        dense
                        :rules="[val => !!val || '대표자명을 입력해주세요']"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="taxInvoiceInfo.email"
                        label="세금계산서 이메일"
                        outlined
                        dense
                        type="email"
                        :rules="[val => !!val || '이메일을 입력해주세요']"
                      />
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <div class="step-actions q-mt-xl">
              <div class="row q-gutter-md">
                <q-btn
                  outline
                  color="grey-6"
                  label="이전 단계"
                  icon="arrow_back"
                  @click="goToStep(2)"
                />
                <q-btn
                  color="primary"
                  label="결제하기"
                  icon="payment"
                  size="lg"
                  @click="processPayment"
                  :loading="isProcessingPayment"
                  :disable="!isPaymentInfoValid"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 주문 요약 -->
        <div class="col-12 col-md-4">
          <div class="order-summary-sticky">
            <q-card flat bordered class="order-summary-card">
              <q-card-section class="bg-primary text-white">
                <div class="text-h6 text-weight-bold">
                  <q-icon name="shopping_cart" class="q-mr-sm" />
                  주문 요약
                </div>
              </q-card-section>

              <q-card-section>
                <!-- 상품 목록 요약 -->
                <div class="summary-items q-mb-md">
                  <div class="text-subtitle2 text-weight-bold q-mb-sm">주문 상품</div>
                  <div
                    v-for="item in orderItems"
                    :key="item.id"
                    class="summary-item q-mb-sm"
                  >
                    <div class="row items-center">
                      <div class="col">
                        <div class="text-body2 text-weight-medium">{{ item.name }}</div>
                        <div class="text-caption text-grey-6">
                          {{ item.weight }}kg × {{ formatPrice(item.unitPrice) }}원/kg
                        </div>
                      </div>
                      <div class="col-auto">
                        <div class="text-body2 text-weight-bold">
                          {{ formatPrice(item.totalPrice) }}원
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <!-- 배송 정보 요약 -->
                <div v-if="currentStep >= 2" class="summary-delivery q-mb-md">
                  <div class="text-subtitle2 text-weight-bold q-mb-sm">배송 정보</div>
                  <div class="text-body2">
                    <div v-if="deliveryInfo.recipientName">
                      받는분: {{ deliveryInfo.recipientName }}
                    </div>
                    <div v-if="deliveryInfo.address">
                      주소: {{ deliveryInfo.address }} {{ deliveryInfo.detailAddress }}
                    </div>
                    <div v-if="deliveryInfo.deliveryDate">
                      배송일: {{ formatDeliveryDate(deliveryInfo.deliveryDate) }}
                    </div>
                    <div v-if="deliveryInfo.deliveryTime">
                      시간: {{ getDeliveryTimeLabel(deliveryInfo.deliveryTime) }}
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <!-- 결제 금액 계산 -->
                <div class="summary-calculation">
                  <div class="calculation-item">
                    <div class="row justify-between">
                      <div class="text-body2">상품 금액</div>
                      <div class="text-body2">{{ formatPrice(subtotal) }}원</div>
                    </div>
                  </div>

                  <div class="calculation-item">
                    <div class="row justify-between">
                      <div class="text-body2">배송비</div>
                      <div class="text-body2">
                        {{ deliveryFee > 0 ? formatPrice(deliveryFee) + '원' : '무료' }}
                      </div>
                    </div>
                  </div>

                  <div v-if="discount > 0" class="calculation-item">
                    <div class="row justify-between">
                      <div class="text-body2 text-positive">할인</div>
                      <div class="text-body2 text-positive">-{{ formatPrice(discount) }}원</div>
                    </div>
                  </div>

                  <q-separator class="q-my-sm" />

                  <div class="calculation-item total">
                    <div class="row justify-between">
                      <div class="text-h6 text-weight-bold">총 결제금액</div>
                      <div class="text-h6 text-weight-bold text-primary">
                        {{ formatPrice(totalAmount) }}원
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 무료배송 안내 -->
                <div v-if="freeShippingThreshold > 0" class="free-shipping-info q-mt-md">
                  <q-linear-progress
                    :value="subtotal / freeShippingThreshold"
                    color="primary"
                    size="8px"
                    class="q-mb-xs"
                  />
                  <div class="text-caption text-center">
                    <span v-if="subtotal >= freeShippingThreshold" class="text-positive">
                      <q-icon name="local_shipping" class="q-mr-xs" />
                      무료배송 적용
                    </span>
                    <span v-else>
                      {{ formatPrice(freeShippingThreshold - subtotal) }}원 추가 시 무료배송
                    </span>
                  </div>
                </div>

                <!-- 적립 포인트 -->
                <div class="earning-points q-mt-md">
                  <div class="bg-grey-1 rounded-borders q-pa-sm">
                    <div class="text-center">
                      <q-icon name="stars" color="amber" class="q-mr-xs" />
                      <span class="text-body2">
                        결제 시 <strong class="text-amber">{{ formatPrice(earningPoints) }}P</strong> 적립
                      </span>
                    </div>
                  </div>
                </div>
              </q-card-section>

              <!-- 모바일 결제 버튼 -->
              <q-card-section v-if="$q.screen.lt.md && currentStep === 3" class="q-pa-md">
                <q-btn
                  color="primary"
                  label="결제하기"
                  icon="payment"
                  size="lg"
                  class="full-width"
                  @click="processPayment"
                  :loading="isProcessingPayment"
                  :disable="!isPaymentInfoValid"
                />
              </q-card-section>
            </q-card>

            <!-- 고객 지원 -->
            <q-card flat bordered class="support-card q-mt-md">
              <q-card-section>
                <div class="text-subtitle2 text-weight-bold q-mb-sm">
                  <q-icon name="support_agent" class="q-mr-sm" />
                  주문 문의
                </div>
                <div class="text-body2 text-grey-7 q-mb-md">
                  주문 과정에서 궁금한 점이 있으시면 언제든 연락해주세요.
                </div>
                <q-btn
                  flat
                  color="primary"
                  icon="phone"
                  label="1588-0000"
                  size="sm"
                  class="full-width"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 주소 검색 다이얼로그 -->
    <q-dialog v-model="showAddressSearch" persistent>
      <q-card style="min-width: 400px">
        <q-bar class="bg-primary text-white">
          <div class="text-h6">주소 검색</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showAddressSearch = false" />
        </q-bar>

        <q-card-section>
          <div id="addressSearchContainer" style="height: 400px">
            <!-- 다음 우편번호 API가 로드될 컨테이너 -->
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 결제 처리 다이얼로그 -->
    <q-dialog v-model="showPaymentDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="text-center q-py-lg">
          <q-spinner-dots size="50px" color="primary" />
          <div class="text-h6 q-mt-md">결제 처리중...</div>
          <div class="text-body2 text-grey-6">
            안전한 결제를 위해 잠시만 기다려주세요.
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// 반응형 데이터
const currentStep = ref(1)
const isProcessingPayment = ref(false)
const showAddressSearch = ref(false)
const showPaymentDialog = ref(false)

// 주문 상품
const orderItems = ref([
  {
    id: '1',
    name: '프리미엄 한우 등심',
    category: '한우',
    grade: '1++',
    origin: '국내산',
    weight: 10,
    unitPrice: 65000,
    totalPrice: 650000,
    deliveryDate: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    urgent: false
  },
  {
    id: '2',
    name: '국내산 돼지 삼겹살',
    category: '국내산 돼지',
    grade: '1',
    origin: '국내산',
    weight: 5,
    unitPrice: 18000,
    totalPrice: 90000,
    deliveryDate: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
    urgent: false
  }
])

// 배송 정보
const deliveryInfo = reactive({
  recipientName: '',
  phone: '',
  company: '',
  department: '',
  zipCode: '',
  address: '',
  detailAddress: '',
  deliveryRequest: '',
  customRequest: '',
  saveAddress: false,
  deliveryDate: '',
  deliveryTime: 'morning'
})

// 저장된 배송지
const savedAddresses = ref([
  {
    id: '1',
    name: '회사 (기본)',
    company: '삼성전자',
    address: '서울시 강남구 테헤란로 123',
    phone: '010-1234-5678',
    isDefault: true
  },
  {
    id: '2',
    name: '공장',
    company: '삼성전자 화성공장',
    address: '경기도 화성시 삼성로 456',
    phone: '010-1234-5678',
    isDefault: false
  }
])

const selectedAddressId = ref('1')

// 결제 정보
const selectedPaymentMethod = ref('credit_card')

const paymentMethods = ref([
  {
    id: 'credit_card',
    name: '신용카드',
    description: '모든 카드사 결제 가능',
    icon: 'credit_card',
    color: 'blue',
    fee: 0,
    discount: 0
  },
  {
    id: 'bank_transfer',
    name: '무통장입금',
    description: '계좌이체 결제',
    icon: 'account_balance',
    color: 'green',
    fee: 0,
    discount: 2
  },
  {
    id: 'virtual_account',
    name: '가상계좌',
    description: '개인별 전용계좌 발급',
    icon: 'account_balance_wallet',
    color: 'orange',
    fee: 0,
    discount: 0
  }
])

const bankAccounts = ref([
  {
    bank: '국민은행',
    accountNumber: '123456-78-901234',
    accountHolder: '(주)육프로'
  },
  {
    bank: '신한은행',
    accountNumber: '987-654-321098',
    accountHolder: '(주)육프로'
  }
])

// 세금계산서 정보
const taxInvoiceInfo = reactive({
  required: false,
  businessNumber: '',
  companyName: '',
  ceoName: '',
  email: ''
})

// 배송 관련 옵션
const deliveryRequestOptions = ref([
  { label: '문 앞에 놓아주세요', value: 'door' },
  { label: '경비실에 맡겨주세요', value: 'security' },
  { label: '택배함에 넣어주세요', value: 'box' },
  { label: '부재 시 연락주세요', value: 'call' },
  { label: '직접 입력', value: 'custom' }
])

const deliveryTimeOptions = ref([
  { label: '오전 (9시-12시)', value: 'morning' },
  { label: '오후 (12시-18시)', value: 'afternoon' },
  { label: '저녁 (18시-21시)', value: 'evening' }
])

// 상수
const minimumOrderWeight = 5
const freeShippingThreshold = 300000

// computed
const totalWeight = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.weight, 0)
})

const isMinimumOrderMet = computed(() => {
  return totalWeight.value >= minimumOrderWeight
})

const subtotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.totalPrice, 0)
})

const deliveryFee = computed(() => {
  return subtotal.value >= freeShippingThreshold ? 0 : 5000
})

const discount = computed(() => {
  const selectedMethod = paymentMethods.value.find(m => m.id === selectedPaymentMethod.value)
  const discountRate = selectedMethod?.discount || 0
  return Math.floor(subtotal.value * discountRate / 100)
})

const totalAmount = computed(() => {
  return subtotal.value + deliveryFee.value - discount.value
})

const earningPoints = computed(() => {
  return Math.floor(totalAmount.value * 0.01) // 1% 적립
})

const isDeliveryInfoValid = computed(() => {
  return deliveryInfo.recipientName &&
    deliveryInfo.phone &&
    deliveryInfo.address &&
    deliveryInfo.deliveryDate &&
    deliveryInfo.deliveryTime
})

const isPaymentInfoValid = computed(() => {
  if (!selectedPaymentMethod.value) return false
  if (taxInvoiceInfo.required) {
    return taxInvoiceInfo.businessNumber &&
      taxInvoiceInfo.companyName &&
      taxInvoiceInfo.ceoName &&
      taxInvoiceInfo.email
  }
  return true
})

// 메소드
const goBack = () => {
  if (currentStep.value === 1) {
    router.push('/cart')
  } else {
    goToStep(currentStep.value - 1)
  }
}

const goToStep = (step: number) => {
  currentStep.value = step

  // 스크롤 최상단으로 이동
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

const increaseQuantity = (itemId: string) => {
  const item = orderItems.value.find(i => i.id === itemId)
  if (item) {
    item.weight += 5 // 5kg 단위
    item.totalPrice = item.weight * item.unitPrice
  }
}

const decreaseQuantity = (itemId: string) => {
  const item = orderItems.value.find(i => i.id === itemId)
  if (item && item.weight > 5) {
    item.weight -= 5 // 5kg 단위
    item.totalPrice = item.weight * item.unitPrice
  }
}

const removeItem = (itemId: string) => {
  $q.dialog({
    title: '상품 삭제',
    message: '주문 상품에서 삭제하시겠습니까?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    const index = orderItems.value.findIndex(i => i.id === itemId)
    if (index > -1) {
      orderItems.value.splice(index, 1)
    }

    if (orderItems.value.length === 0) {
      router.push('/products')
    }
  })
}

const addMoreProducts = () => {
  router.push('/products')
}

const selectAddress = (address: any) => {
  selectedAddressId.value = address.id
  deliveryInfo.recipientName = address.name
  deliveryInfo.phone = address.phone
  deliveryInfo.company = address.company
  deliveryInfo.address = address.address
}

const searchAddress = () => {
  showAddressSearch.value = true

  nextTick(() => {
    // 다음 우편번호 API 로드
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data: any) => {
          deliveryInfo.zipCode = data.zonecode
          deliveryInfo.address = data.roadAddress || data.jibunAddress
          showAddressSearch.value = false
        },
        width: '100%',
        height: '100%'
      }).embed(document.getElementById('addressSearchContainer'))
    } else {
      // API 로드되지 않은 경우 Mock 데이터
      setTimeout(() => {
        deliveryInfo.zipCode = '06234'
        deliveryInfo.address = '서울특별시 강남구 테헤란로 123'
        showAddressSearch.value = false
      }, 1000)
    }
  })
}

const availableDeliveryDates = (date: string) => {
  const selectedDate = new Date(date)
  const today = new Date()
  const dayOfWeek = selectedDate.getDay()

  // 오늘부터 7일 후까지, 일요일 제외
  return selectedDate >= today &&
    selectedDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) &&
    dayOfWeek !== 0
}

const selectPaymentMethod = (methodId: string) => {
  selectedPaymentMethod.value = methodId
}

const processPayment = async () => {
  if (!isPaymentInfoValid.value) {
    $q.notify({
      type: 'negative',
      message: '결제 정보를 확인해주세요'
    })
    return
  }

  isProcessingPayment.value = true
  showPaymentDialog.value = true

  try {
    // 결제 처리 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 3000))

    const orderData = {
      items: orderItems.value,
      delivery: deliveryInfo,
      payment: {
        method: selectedPaymentMethod.value,
        amount: totalAmount.value
      },
      taxInvoice: taxInvoiceInfo.required ? taxInvoiceInfo : null
    }

    console.log('Order processed:', orderData)

    // 주문 완료 페이지로 이동
    const orderId = 'ORD' + Date.now()
    router.push(`/order/complete/${orderId}`)

  } catch (error) {
    console.error('Payment processing error:', error)
    $q.notify({
      type: 'negative',
      message: '결제 처리 중 오류가 발생했습니다'
    })
  } finally {
    isProcessingPayment.value = false
    showPaymentDialog.value = false
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

const formatDeliveryDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  }).format(date)
}

const getDeliveryTimeLabel = (timeValue: string) => {
  const option = deliveryTimeOptions.value.find(o => o.value === timeValue)
  return option?.label || ''
}

// 라이프사이클
onMounted(() => {
  // 세션에서 직접 주문 데이터 확인
  const directOrderData = sessionStorage.getItem('directOrder')
  if (directOrderData) {
    const orderData = JSON.parse(directOrderData)
    orderItems.value = orderData.items
    sessionStorage.removeItem('directOrder')
  }

  // 다음 우편번호 API 로드
  const script = document.createElement('script')
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.async = true
  document.head.appendChild(script)

  // 기본 배송일 설정 (내일)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  deliveryInfo.deliveryDate = tomorrow.toISOString().split('T')[0]
})

// 전역 선언 (타입스크립트용)
declare global {
  interface Window {
    daum: any;
  }
}
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.checkout-step {
  .step-header {
    h5 {
      margin: 0;
      color: #1976d2;
    }
  }
}

.order-items-card {
  .order-item {
    padding: 16px 0;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }

    .item-specs {
      .q-chip {
        margin-right: 8px;
        margin-bottom: 4px;
      }
    }

    .quantity-controls {
      .q-btn-group {
        box-shadow: none;
      }
    }
  }
}

.address-card {
  transition: all 0.2s ease;

  &.selected {
    border-color: var(--q-primary);
    background-color: #e3f2fd;
  }

  &:hover {
    border-color: var(--q-primary);
  }
}

.delivery-calendar {
  .q-date {
    width: 100%;
  }
}

.payment-card {
  .q-item {
    border-radius: 8px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.bank-info-card {
  .bank-accounts {
    .bank-account {
      padding: 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }
  }
}

.order-summary-sticky {
  position: sticky;
  top: 20px;
}

.order-summary-card {
  .summary-items {
    .summary-item {
      padding: 8px 0;
    }
  }

  .summary-calculation {
    .calculation-item {
      padding: 8px 0;

      &.total {
        padding-top: 16px;
        border-top: 2px solid #e0e0e0;
        margin-top: 8px;
      }
    }
  }
}

.support-card {
  .q-btn {
    text-transform: none;
  }
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;

  .q-btn {
    min-width: 140px;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 0 8px;
  }

  .row.q-gutter-lg {
    gap: 16px;
  }

  .step-actions {
    justify-content: stretch;

    .q-btn {
      flex: 1;
    }
  }

  .order-summary-sticky {
    position: static;
  }
}

@media (max-width: 1024px) {
  .order-summary-sticky {
    position: static;
    margin-top: 32px;
  }
}
</style>
