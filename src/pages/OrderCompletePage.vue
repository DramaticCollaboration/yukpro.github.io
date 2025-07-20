<template>
  <q-page class="order-complete-page">
    <div class="container">
      <!-- 주문 완료 메시지 -->
      <div class="completion-header text-center q-py-xl">
        <div class="success-animation q-mb-lg">
          <q-icon name="check_circle" color="positive" size="120px" />
        </div>
        <h1 class="text-h3 text-weight-bold text-positive q-mb-md">
          주문이 완료되었습니다!
        </h1>
        <p class="text-h6 text-grey-7 q-mb-lg">
          주문번호: <strong class="text-primary">{{ orderId }}</strong>
        </p>
        <div class="completion-info">
          <q-chip color="blue" text-color="white" icon="schedule">
            예상 배송일: {{ expectedDeliveryDate }}
          </q-chip>
          <q-chip color="green" text-color="white" icon="email">
            주문 확인 이메일 발송
          </q-chip>
        </div>
      </div>

      <!-- 주문 요약 -->
      <div class="order-summary-section q-mb-xl">
        <q-card flat bordered>
          <q-card-section class="bg-grey-1">
            <div class="text-h6 text-weight-bold">
              <q-icon name="receipt_long" class="q-mr-sm" />
              주문 내역
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-gutter-lg">
              <div class="col-12 col-md-6">
                <div class="text-subtitle2 text-weight-bold q-mb-md">결제 정보</div>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>총 결제금액</q-item-label>
                      <q-item-label caption class="text-h6 text-weight-bold text-primary">
                        {{ formatPrice(totalAmount) }}원
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>결제방법</q-item-label>
                      <q-item-label caption>{{ paymentMethod }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>적립 포인트</q-item-label>
                      <q-item-label caption class="text-positive">
                        +{{ formatPrice(earnedPoints) }}P
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-6">
                <div class="text-subtitle2 text-weight-bold q-mb-md">배송 정보</div>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>받는분</q-item-label>
                      <q-item-label caption>{{ deliveryInfo.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>연락처</q-item-label>
                      <q-item-label caption>{{ deliveryInfo.phone }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>배송지</q-item-label>
                      <q-item-label caption>{{ deliveryInfo.address }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 다음 단계 안내 -->
      <div class="next-steps-section q-mb-xl">
        <div class="text-h5 text-weight-bold q-mb-lg text-center">
          다음 단계 안내
        </div>

        <div class="row q-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="step-card">
              <q-card-section class="text-center">
                <q-icon name="email" color="blue" size="48px" class="q-mb-sm" />
                <div class="text-subtitle1 text-weight-bold">주문 확인</div>
                <div class="text-body2 text-grey-7">
                  이메일로 주문 확인서가 발송됩니다
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="step-card">
              <q-card-section class="text-center">
                <q-icon name="inventory_2" color="orange" size="48px" class="q-mb-sm" />
                <div class="text-subtitle1 text-weight-bold">상품 준비</div>
                <div class="text-body2 text-grey-7">
                  신선한 상품을 포장하여 준비합니다
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="step-card">
              <q-card-section class="text-center">
                <q-icon name="local_shipping" color="green" size="48px" class="q-mb-sm" />
                <div class="text-subtitle1 text-weight-bold">배송 출발</div>
                <div class="text-body2 text-grey-7">
                  냉장 배송으로 안전하게 출발합니다
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="step-card">
              <q-card-section class="text-center">
                <q-icon name="home" color="purple" size="48px" class="q-mb-sm" />
                <div class="text-subtitle1 text-weight-bold">배송 완료</div>
                <div class="text-body2 text-grey-7">
                  지정하신 장소로 안전하게 배송됩니다
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- 액션 버튼들 -->
      <div class="action-buttons text-center q-mb-xl">
        <div class="row q-gutter-md justify-center">
          <q-btn
            color="primary"
            size="lg"
            icon="visibility"
            label="주문 상세보기"
            @click="viewOrderDetail"
          />
          <q-btn
            color="green"
            size="lg"
            icon="receipt"
            label="세금계산서 다운로드"
            @click="downloadTaxInvoice"
            v-if="taxInvoiceAvailable"
          />
          <q-btn
            outline
            color="blue"
            size="lg"
            icon="local_shipping"
            label="배송 추적"
            @click="trackDelivery"
          />
          <q-btn
            outline
            color="grey-6"
            size="lg"
            icon="shopping_cart"
            label="추가 주문"
            @click="continuesShopping"
          />
        </div>
      </div>

      <!-- 고객 지원 -->
      <div class="support-section">
        <q-card flat bordered class="bg-grey-1">
          <q-card-section class="text-center">
            <div class="text-h6 text-weight-bold q-mb-md">
              <q-icon name="support_agent" class="q-mr-sm" />
              고객 지원
            </div>
            <p class="text-body1 text-grey-7 q-mb-lg">
              주문이나 배송에 관한 문의사항이 있으시면 언제든 연락해주세요.
            </p>
            <div class="row q-gutter-md justify-center">
              <q-btn
                color="orange"
                icon="phone"
                label="전화 문의: 1588-0000"
                @click="callSupport"
              />
              <q-btn
                outline
                color="blue"
                icon="chat"
                label="채팅 상담"
                @click="openChat"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const orderId = ref('')
const totalAmount = ref(740000)
const paymentMethod = ref('신용카드')
const earnedPoints = ref(7400)
const expectedDeliveryDate = ref('2024년 1월 20일 (토)')
const taxInvoiceAvailable = ref(true)

const deliveryInfo = ref({
  name: '김철수',
  phone: '010-1234-5678',
  address: '서울시 강남구 테헤란로 123, 삼성빌딩 5층'
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

const viewOrderDetail = () => {
  router.push('/orders')
}

const downloadTaxInvoice = () => {
  $q.notify({
    type: 'positive',
    message: '세금계산서 다운로드를 시작합니다',
    icon: 'download'
  })
}

const trackDelivery = () => {
  $q.notify({
    type: 'info',
    message: '상품 준비 중입니다. 배송 시작 후 추적이 가능합니다',
    icon: 'info'
  })
}

const continuesShopping = () => {
  router.push('/products')
}

const callSupport = () => {
  window.location.href = 'tel:1588-0000'
}

const openChat = () => {
  router.push('/support')
}

onMounted(() => {
  orderId.value = route.params.id as string

  // 주문 완료 알림
  $q.notify({
    type: 'positive',
    message: '주문이 성공적으로 완료되었습니다!',
    timeout: 5000,
    actions: [
      {
        label: '닫기',
        color: 'white',
        handler: () => {}
      }
    ]
  })
})
</script>

<style lang="scss" scoped>
.order-complete-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 16px;
}

.completion-header {
  .success-animation {
    animation: bounce 1s ease-in-out;
  }

  .completion-info {
    .q-chip {
      margin: 0 8px 8px 0;
    }
  }
}

.step-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.action-buttons {
  .q-btn {
    min-width: 160px;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

@media (max-width: 600px) {
  .container {
    padding: 20px 8px;
  }

  .completion-header {
    .success-animation {
      .q-icon {
        font-size: 80px !important;
      }
    }
  }

  .action-buttons {
    .row {
      flex-direction: column;
      gap: 12px;
    }

    .q-btn {
      width: 100%;
    }
  }
}
</style>
