
<template>
  <q-page class="orders-page">
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
            class="q-mr-md lt-md"
          />
          <div class="col">
            <div class="text-h4 text-weight-bold">주문 내역</div>
            <div class="text-subtitle1 opacity-80">
              총 {{ totalOrders }}건의 주문 내역을 확인하세요
            </div>
          </div>
          <div class="header-actions">
            <q-btn
              flat
              icon="refresh"
              color="white"
              @click="refreshOrders"
              :loading="isRefreshing"
            >
              <q-tooltip>새로고침</q-tooltip>
            </q-btn>
            <q-btn
              flat
              icon="download"
              color="white"
              @click="exportOrders"
            >
              <q-tooltip>엑셀 다운로드</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- 필터 및 검색 -->
    <div class="bg-grey-1 q-py-md">
      <div class="container">
        <div class="row q-gutter-md items-end">
          <!-- 상태 필터 -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              label="주문 상태"
              outlined
              dense
              emit-value
              map-options
              clearable
              @update:model-value="filterOrders"
            >
              <template v-slot:prepend>
                <q-icon name="filter_list" />
              </template>
            </q-select>
          </div>

          <!-- 기간 필터 -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.period"
              :options="periodOptions"
              label="기간"
              outlined
              dense
              emit-value
              map-options
              @update:model-value="filterOrders"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" />
              </template>
            </q-select>
          </div>

          <!-- 사용자 정의 날짜 -->
          <div class="col-12 col-sm-6 col-md-2" v-if="filters.period === 'custom'">
            <q-input
              v-model="filters.startDate"
              label="시작일"
              outlined
              dense
              type="date"
              @update:model-value="filterOrders"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-2" v-if="filters.period === 'custom'">
            <q-input
              v-model="filters.endDate"
              label="종료일"
              outlined
              dense
              type="date"
              @update:model-value="filterOrders"
            />
          </div>

          <!-- 검색 -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.search"
              label="주문번호 / 상품명 검색"
              outlined
              dense
              @keyup.enter="filterOrders"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  icon="search"
                  @click="filterOrders"
                />
              </template>
            </q-input>
          </div>
        </div>

        <!-- 필터 결과 -->
        <div v-if="hasActiveFilters" class="q-mt-md">
          <div class="row items-center">
            <div class="text-caption text-grey-7 q-mr-md">
              활성 필터:
            </div>
            <q-chip
              v-if="filters.status"
              removable
              color="blue"
              text-color="white"
              @remove="clearFilter('status')"
            >
              상태: {{ getStatusLabel(filters.status) }}
            </q-chip>
            <q-chip
              v-if="filters.period && filters.period !== 'all'"
              removable
              color="green"
              text-color="white"
              @remove="clearFilter('period')"
            >
              기간: {{ getPeriodLabel(filters.period) }}
            </q-chip>
            <q-chip
              v-if="filters.search"
              removable
              color="purple"
              text-color="white"
              @remove="clearFilter('search')"
            >
              검색: {{ filters.search }}
            </q-chip>
            <q-btn
              flat
              size="sm"
              label="전체 해제"
              icon="clear"
              @click="clearAllFilters"
              class="q-ml-sm"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 주문 목록 -->
    <div class="container q-py-lg">
      <div v-if="isLoading" class="text-center q-py-xl">
        <q-spinner-dots size="50px" color="primary" />
        <div class="text-subtitle2 text-grey-6 q-mt-md">
          주문 내역을 불러오는 중...
        </div>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="empty-state">
        <div class="text-center q-py-xl">
          <q-icon name="receipt_long" size="64px" color="grey-4" />
          <div class="text-h6 text-grey-6 q-mt-md">
            {{ hasActiveFilters ? '필터 조건에 맞는 주문이 없습니다' : '아직 주문 내역이 없습니다' }}
          </div>
          <div class="text-body2 text-grey-5 q-mt-sm">
            {{ hasActiveFilters ? '다른 조건으로 검색해보세요' : '첫 주문을 시작해보세요' }}
          </div>
          <q-btn
            v-if="!hasActiveFilters"
            color="primary"
            label="상품 둘러보기"
            icon="storefront"
            @click="goToProducts"
            class="q-mt-lg"
          />
        </div>
      </div>

      <div v-else class="orders-list">
        <q-card
          v-for="order in paginatedOrders"
          :key="order.id"
          class="order-card q-mb-lg"
          flat
          bordered
        >
          <!-- 주문 헤더 -->
          <q-card-section class="order-header bg-grey-1">
            <div class="row items-center">
              <div class="col">
                <div class="row items-center q-gutter-sm">
                  <div class="text-subtitle1 text-weight-bold">
                    주문번호: {{ order.orderNumber }}
                  </div>
                  <q-chip
                    :color="getStatusColor(order.status)"
                    text-color="white"
                    :icon="getStatusIcon(order.status)"
                    size="sm"
                  >
                    {{ getStatusLabel(order.status) }}
                  </q-chip>
                  <q-chip
                    v-if="order.isUrgent"
                    color="red"
                    text-color="white"
                    icon="priority_high"
                    size="sm"
                  >
                    긴급
                  </q-chip>
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  주문일시: {{ formatDateTime(order.createdAt) }} |
                  배송예정: {{ formatDate(order.deliveryDate) }}
                </div>
              </div>
              <div class="order-actions">
                <q-btn
                  flat
                  round
                  icon="more_vert"
                  color="grey-7"
                >
                  <q-menu>
                    <q-list>
                      <q-item clickable @click="viewOrderDetail(order.id)">
                        <q-item-section avatar>
                          <q-icon name="visibility" />
                        </q-item-section>
                        <q-item-section>상세 보기</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="trackDelivery(order.id)"
                        v-if="canTrackDelivery(order.status)"
                      >
                        <q-item-section avatar>
                          <q-icon name="local_shipping" />
                        </q-item-section>
                        <q-item-section>배송 추적</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="downloadInvoice(order.id)"
                        v-if="order.invoiceAvailable"
                      >
                        <q-item-section avatar>
                          <q-icon name="receipt" />
                        </q-item-section>
                        <q-item-section>세금계산서</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="reorder(order.id)"
                        v-if="canReorder(order.status)"
                      >
                        <q-item-section avatar>
                          <q-icon name="refresh" />
                        </q-item-section>
                        <q-item-section>재주문</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item
                        clickable
                        @click="requestCS(order.id)"
                        v-if="canRequestCS(order.status)"
                      >
                        <q-item-section avatar>
                          <q-icon name="support_agent" color="orange" />
                        </q-item-section>
                        <q-item-section>고객지원 요청</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="cancelOrder(order.id)"
                        v-if="canCancelOrder(order.status)"
                      >
                        <q-item-section avatar>
                          <q-icon name="cancel" color="red" />
                        </q-item-section>
                        <q-item-section class="text-red">주문 취소</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn
                  flat
                  icon="chevron_right"
                  color="primary"
                  @click="viewOrderDetail(order.id)"
                />
              </div>
            </div>
          </q-card-section>

          <!-- 배송 정보 -->
          <q-card-section v-if="order.deliveryInfo" class="delivery-info bg-blue-1">
            <div class="row items-center">
              <q-icon name="local_shipping" color="blue" class="q-mr-sm" />
              <div class="col">
                <div class="text-body2 text-weight-bold">
                  {{ order.deliveryInfo.company }} - {{ order.deliveryInfo.trackingNumber }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ order.deliveryInfo.currentLocation }} | {{ order.deliveryInfo.lastUpdate }}
                </div>
              </div>
              <q-btn
                flat
                size="sm"
                label="추적"
                icon="search"
                color="blue"
                @click="trackDelivery(order.id)"
              />
            </div>
          </q-card-section>

          <!-- 주문 상품 목록 -->
          <q-card-section class="order-items">
            <div
              v-for="(item, index) in order.items"
              :key="index"
              class="order-item"
              :class="{ 'q-mb-md': index < order.items.length - 1 }"
            >
              <div class="row q-gutter-md">
                <!-- 상품 이미지 -->
                <div class="col-auto">
                  <q-img
                    :src="item.image"
                    style="width: 80px; height: 80px"
                    class="rounded-borders"
                    spinner-color="primary"
                  >
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-grey-3">
                        <q-icon name="image" size="24px" color="grey-6" />
                      </div>
                    </template>
                  </q-img>
                </div>

                <!-- 상품 정보 -->
                <div class="col">
                  <div class="row items-start justify-between">
                    <div>
                      <div class="text-subtitle2 text-weight-bold q-mb-xs">
                        {{ item.name }}
                      </div>
                      <div class="text-caption text-grey-6 q-mb-sm">
                        {{ item.category }} | {{ item.grade }} | {{ item.origin }}
                      </div>
                      <div class="item-specs">
                        <q-chip
                          size="sm"
                          color="grey-2"
                          text-color="grey-8"
                          icon="scale"
                        >
                          {{ item.weight }}kg
                        </q-chip>
                        <q-chip
                          size="sm"
                          color="grey-2"
                          text-color="grey-8"
                          icon="inventory_2"
                        >
                          {{ item.quantity }}개
                        </q-chip>
                        <q-chip
                          v-if="item.temperature"
                          size="sm"
                          color="blue-2"
                          text-color="blue-8"
                          icon="ac_unit"
                        >
                          {{ item.temperature }}
                        </q-chip>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-body1 text-weight-bold">
                        {{ formatCurrency(item.totalPrice) }}
                      </div>
                      <div class="text-caption text-grey-6">
                        {{ formatCurrency(item.unitPrice) }}/kg
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- 주문 요약 -->
          <q-card-section class="order-summary bg-grey-1">
            <div class="row justify-between items-center">
              <div class="col">
                <div class="row q-gutter-lg">
                  <div class="summary-item">
                    <div class="text-caption text-grey-6">총 중량</div>
                    <div class="text-body2 text-weight-bold">
                      {{ order.totalWeight }}kg
                    </div>
                  </div>
                  <div class="summary-item">
                    <div class="text-caption text-grey-6">총 수량</div>
                    <div class="text-body2 text-weight-bold">
                      {{ order.totalQuantity }}개
                    </div>
                  </div>
                  <div class="summary-item">
                    <div class="text-caption text-grey-6">배송비</div>
                    <div class="text-body2 text-weight-bold">
                      {{ order.deliveryFee > 0 ? formatCurrency(order.deliveryFee) : '무료' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="total-amount">
                <div class="text-caption text-grey-6 text-right">총 결제금액</div>
                <div class="text-h6 text-weight-bold text-primary">
                  {{ formatCurrency(order.totalAmount) }}
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- 주문 상태별 액션 버튼 -->
          <q-card-section class="order-actions-section">
            <div class="row q-gutter-sm justify-end">
              <q-btn
                v-if="canTrackDelivery(order.status)"
                outline
                color="blue"
                icon="local_shipping"
                label="배송 추적"
                @click="trackDelivery(order.id)"
              />
              <q-btn
                v-if="order.invoiceAvailable"
                outline
                color="green"
                icon="receipt"
                label="세금계산서"
                @click="downloadInvoice(order.id)"
              />
              <q-btn
                v-if="canReorder(order.status)"
                outline
                color="primary"
                icon="refresh"
                label="재주문"
                @click="reorder(order.id)"
              />
              <q-btn
                v-if="canRequestCS(order.status)"
                outline
                color="orange"
                icon="support_agent"
                label="고객지원"
                @click="requestCS(order.id)"
              />
              <q-btn
                v-if="canCancelOrder(order.status)"
                outline
                color="red"
                icon="cancel"
                label="주문 취소"
                @click="cancelOrder(order.id)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="filteredOrders.length > 0" class="pagination-wrapper q-mt-xl">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          direction-links
          boundary-links
          icon-first="skip_previous"
          icon-last="skip_next"
          icon-prev="fast_rewind"
          icon-next="fast_forward"
          color="primary"
          class="flex justify-center"
        />
      </div>
    </div>

    <!-- 주문 상세 다이얼로그 -->
    <q-dialog v-model="showOrderDetail" maximized>
      <q-card class="order-detail-dialog">
        <q-bar class="bg-primary text-white">
          <div class="text-h6">주문 상세 정보</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showOrderDetail = false" />
        </q-bar>

        <q-card-section class="q-pa-lg scroll">
          <div v-if="selectedOrder">
            <!-- 주문 기본 정보 -->
            <div class="order-detail-section q-mb-xl">
              <div class="text-h6 text-weight-bold q-mb-md text-primary">
                <q-icon name="info" class="q-mr-sm" />
                주문 정보
              </div>
              <div class="row q-gutter-lg">
                <div class="col-12 col-md-6">
                  <q-list>
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="confirmation_number" color="blue" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>주문번호</q-item-label>
                        <q-item-label caption>{{ selectedOrder.orderNumber }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="schedule" color="purple" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>주문일시</q-item-label>
                        <q-item-label caption>{{ formatDateTime(selectedOrder.createdAt) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="local_shipping" color="orange" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>배송예정일</q-item-label>
                        <q-item-label caption>{{ formatDate(selectedOrder.deliveryDate) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="col-12 col-md-6">
                  <q-list>
                    <q-item>
                      <q-item-section avatar>
                        <q-icon :name="getStatusIcon(selectedOrder.status)" :color="getStatusColor(selectedOrder.status)" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>주문 상태</q-item-label>
                        <q-item-label caption>{{ getStatusLabel(selectedOrder.status) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="payment" color="green" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>결제방법</q-item-label>
                        <q-item-label caption>{{ selectedOrder.paymentMethod }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="location_on" color="red" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>배송주소</q-item-label>
                        <q-item-label caption>{{ selectedOrder.deliveryAddress }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>

            <!-- 상품 상세 -->
            <div class="order-detail-section q-mb-xl">
              <div class="text-h6 text-weight-bold q-mb-md text-primary">
                <q-icon name="inventory" class="q-mr-sm" />
                주문 상품
              </div>
              <q-table
                :rows="selectedOrder.items"
                :columns="itemColumns"
                row-key="id"
                flat
                bordered
                :pagination="{ rowsPerPage: 0 }"
                hide-pagination
              >
                <template v-slot:body-cell-image="props">
                  <q-td :props="props">
                    <q-img
                      :src="props.value"
                      style="width: 50px; height: 50px"
                      class="rounded-borders"
                      spinner-color="primary"
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-name="props">
                  <q-td :props="props">
                    <div>
                      <div class="text-weight-bold">{{ props.value }}</div>
                      <div class="text-caption text-grey-6">
                        {{ props.row.category }} | {{ props.row.grade }} | {{ props.row.origin }}
                      </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-specs="props">
                  <q-td :props="props">
                    <div class="specs-chips">
                      <q-chip size="sm" color="grey-2" text-color="grey-8">
                        {{ props.row.weight }}kg
                      </q-chip>
                      <q-chip size="sm" color="grey-2" text-color="grey-8">
                        {{ props.row.quantity }}개
                      </q-chip>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-unitPrice="props">
                  <q-td :props="props">
                    {{ formatCurrency(props.value) }}/kg
                  </q-td>
                </template>
                <template v-slot:body-cell-totalPrice="props">
                  <q-td :props="props" class="text-weight-bold">
                    {{ formatCurrency(props.value) }}
                  </q-td>
                </template>
              </q-table>
            </div>

            <!-- 결제 정보 -->
            <div class="order-detail-section">
              <div class="text-h6 text-weight-bold q-mb-md text-primary">
                <q-icon name="receipt_long" class="q-mr-sm" />
                결제 정보
              </div>
              <div class="payment-summary">
                <q-list>
                  <q-item>
                    <q-item-section>상품금액</q-item-section>
                    <q-item-section side>{{ formatCurrency(selectedOrder.subtotal) }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>배송비</q-item-section>
                    <q-item-section side>
                      {{ selectedOrder.deliveryFee > 0 ? formatCurrency(selectedOrder.deliveryFee) : '무료' }}
                    </q-item-section>
                  </q-item>
                  <q-item v-if="selectedOrder.discount > 0">
                    <q-item-section>할인금액</q-item-section>
                    <q-item-section side class="text-red">
                      -{{ formatCurrency(selectedOrder.discount) }}
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item class="text-weight-bold text-primary">
                    <q-item-section>총 결제금액</q-item-section>
                    <q-item-section side class="text-h6">
                      {{ formatCurrency(selectedOrder.totalAmount) }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 배송 추적 다이얼로그 -->
    <q-dialog v-model="showDeliveryTracker">
      <q-card style="min-width: 400px">
        <q-bar class="bg-blue text-white">
          <q-icon name="local_shipping" />
          <div class="q-ml-sm">배송 추적</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showDeliveryTracker = false" />
        </q-bar>

        <q-card-section>
          <div v-if="trackingInfo">
            <div class="text-center q-mb-lg">
              <div class="text-subtitle1 text-weight-bold">
                {{ trackingInfo.company }}
              </div>
              <div class="text-h6 text-primary">
                {{ trackingInfo.trackingNumber }}
              </div>
            </div>

            <q-timeline color="secondary">
              <q-timeline-entry
                v-for="(event, index) in trackingInfo.events"
                :key="index"
                :icon="getTrackingIcon(event.status)"
                :color="getTrackingColor(event.status)"
              >
                <template v-slot:title>
                  <div class="text-weight-bold">{{ event.description }}</div>
                </template>
                <template v-slot:subtitle>
                  <div>{{ event.location }}</div>
                  <div class="text-caption">{{ formatDateTime(event.timestamp) }}</div>
                </template>
              </q-timeline-entry>
            </q-timeline>
          </div>
          <div v-else class="text-center">
            <q-spinner size="40px" />
            <div class="q-mt-md">배송 정보를 조회하는 중...</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();

// 반응형 데이터
const isLoading = ref(false);
const isRefreshing = ref(false);
const showOrderDetail = ref(false);
const showDeliveryTracker = ref(false);
const selectedOrder = ref(null);
const trackingInfo = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(5);

// 필터
const filters = ref({
  status: '',
  period: 'all',
  startDate: '',
  endDate: '',
  search: ''
});

// 주문 데이터 (실제로는 API에서 가져옴)
const orders = ref([
  {
    id: 1,
    orderNumber: 'YK2024010001',
    status: 'delivered',
    createdAt: '2024-01-15T09:30:00Z',
    deliveryDate: '2024-01-17',
    isUrgent: false,
    totalWeight: 25.5,
    totalQuantity: 3,
    subtotal: 850000,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 850000,
    paymentMethod: '기업 신용카드',
    deliveryAddress: '서울특별시 강남구 테헤란로 123, 육프로 빌딩 5층',
    invoiceAvailable: true,
    deliveryInfo: {
      company: 'CJ대한통운',
      trackingNumber: '123456789012',
      currentLocation: '강남구 배송센터',
      lastUpdate: '2시간 전'
    },
    items: [
      {
        id: 1,
        name: '프리미엄 한우 등심 1++',
        category: '소고기',
        grade: '1++',
        origin: '국내산',
        weight: 10,
        quantity: 1,
        unitPrice: 45000,
        totalPrice: 450000,
        temperature: '냉장 보관',
        image: '/images/beef-sirloin.jpg'
      },
      {
        id: 2,
        name: '돼지 삼겹살 특등급',
        category: '돼지고기',
        grade: '특등급',
        origin: '국내산',
        weight: 15,
        quantity: 2,
        unitPrice: 26667,
        totalPrice: 400000,
        temperature: '냉장 보관',
        image: '/images/pork-belly.jpg'
      }
    ]
  },
  {
    id: 2,
    orderNumber: 'YK2024010002',
    status: 'shipping',
    createdAt: '2024-01-16T14:20:00Z',
    deliveryDate: '2024-01-18',
    isUrgent: true,
    totalWeight: 30,
    totalQuantity: 2,
    subtotal: 1200000,
    deliveryFee: 15000,
    discount: 50000,
    totalAmount: 1165000,
    paymentMethod: '기업 계좌이체',
    deliveryAddress: '부산광역시 해운대구 센텀로 456',
    invoiceAvailable: false,
    deliveryInfo: {
      company: '롯데택배',
      trackingNumber: '987654321098',
      currentLocation: '부산 허브터미널',
      lastUpdate: '30분 전'
    },
    items: [
      {
        id: 3,
        name: '한우 갈비 1+',
        category: '소고기',
        grade: '1+',
        origin: '국내산',
        weight: 20,
        quantity: 1,
        unitPrice: 55000,
        totalPrice: 1100000,
        temperature: '냉장 보관',
        image: '/images/beef-ribs.jpg'
      },
      {
        id: 4,
        name: '국내산 닭 정육',
        category: '닭고기',
        grade: '특등급',
        origin: '국내산',
        weight: 10,
        quantity: 1,
        unitPrice: 10000,
        totalPrice: 100000,
        temperature: '냉장 보관',
        image: '/images/chicken.jpg'
      }
    ]
  },
  {
    id: 3,
    orderNumber: 'YK2024010003',
    status: 'processing',
    createdAt: '2024-01-17T11:45:00Z',
    deliveryDate: '2024-01-19',
    isUrgent: false,
    totalWeight: 18,
    totalQuantity: 1,
    subtotal: 720000,
    deliveryFee: 0,
    discount: 20000,
    totalAmount: 700000,
    paymentMethod: '기업 신용카드',
    deliveryAddress: '대구광역시 수성구 동대구로 789',
    invoiceAvailable: false,
    items: [
      {
        id: 5,
        name: '돼지 목살 1등급',
        category: '돼지고기',
        grade: '1등급',
        origin: '국내산',
        weight: 18,
        quantity: 1,
        unitPrice: 40000,
        totalPrice: 720000,
        temperature: '냉장 보관',
        image: '/images/pork-shoulder.jpg'
      }
    ]
  }
]);

// 옵션 데이터
const statusOptions = [
  { label: '전체', value: '' },
  { label: '주문 접수', value: 'pending' },
  { label: '준비 중', value: 'processing' },
  { label: '배송 중', value: 'shipping' },
  { label: '배송 완료', value: 'delivered' },
  { label: '취소됨', value: 'cancelled' }
];

const periodOptions = [
  { label: '전체', value: 'all' },
  { label: '최근 1주일', value: '1week' },
  { label: '최근 1개월', value: '1month' },
  { label: '최근 3개월', value: '3months' },
  { label: '최근 6개월', value: '6months' },
  { label: '사용자 정의', value: 'custom' }
];

// 테이블 컬럼 정의
const itemColumns = [
  { name: 'image', label: '상품', field: 'image', align: 'center' },
  { name: 'name', label: '상품명', field: 'name', align: 'left' },
  { name: 'specs', label: '규격', field: 'specs', align: 'center' },
  { name: 'unitPrice', label: '단가', field: 'unitPrice', align: 'right' },
  { name: 'totalPrice', label: '금액', field: 'totalPrice', align: 'right' }
];

// 계산된 속성
const totalOrders = computed(() => orders.value.length);

const filteredOrders = computed(() => {
  let filtered = [...orders.value];

  // 상태 필터
  if (filters.value.status) {
    filtered = filtered.filter(order => order.status === filters.value.status);
  }

  // 기간 필터
  if (filters.value.period !== 'all') {
    const now = new Date();
    let filterDate = new Date();

    switch (filters.value.period) {
      case '1week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case 'custom':
        if (filters.value.startDate && filters.value.endDate) {
          const start = new Date(filters.value.startDate);
          const end = new Date(filters.value.endDate);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= start && orderDate <= end;
          });
        }
        break;
    }

    if (filters.value.period !== 'custom') {
      filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
    }
  }

  // 검색 필터
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(search) ||
      order.items.some(item => item.name.toLowerCase().includes(search))
    );
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value));

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOrders.value.slice(start, end);
});

const hasActiveFilters = computed(() => {
  return filters.value.status ||
    filters.value.period !== 'all' ||
    filters.value.search;
});

// 메서드
const goBack = () => {
  router.go(-1);
};

const refreshOrders = async () => {
  isRefreshing.value = true;
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    $q.notify({
      type: 'positive',
      message: '주문 내역이 업데이트되었습니다',
      icon: 'refresh'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '새로고침 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isRefreshing.value = false;
  }
};

const exportOrders = () => {
  $q.notify({
    type: 'info',
    message: '엑셀 다운로드를 시작합니다',
    icon: 'download'
  });
};

const filterOrders = () => {
  currentPage.value = 1;
};

const clearFilter = (filterName: string) => {
  if (filterName === 'period') {
    filters.value.period = 'all';
    filters.value.startDate = '';
    filters.value.endDate = '';
  } else {
    filters.value[filterName] = '';
  }
  filterOrders();
};

const clearAllFilters = () => {
  filters.value = {
    status: '',
    period: 'all',
    startDate: '',
    endDate: '',
    search: ''
  };
  filterOrders();
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'orange',
    processing: 'blue',
    shipping: 'purple',
    delivered: 'green',
    cancelled: 'red'
  };
  return colors[status] || 'grey';
};

const getStatusIcon = (status: string) => {
  const icons = {
    pending: 'schedule',
    processing: 'engineering',
    shipping: 'local_shipping',
    delivered: 'check_circle',
    cancelled: 'cancel'
  };
  return icons[status] || 'help';
};

const getStatusLabel = (status: string) => {
  const labels = {
    pending: '주문 접수',
    processing: '준비 중',
    shipping: '배송 중',
    delivered: '배송 완료',
    cancelled: '취소됨'
  };
  return labels[status] || status;
};

const getPeriodLabel = (period: string) => {
  const option = periodOptions.find(opt => opt.value === period);
  return option ? option.label : period;
};

const canTrackDelivery = (status: string) => {
  return ['shipping', 'delivered'].includes(status);
};

const canReorder = (status: string) => {
  return ['delivered', 'cancelled'].includes(status);
};

const canRequestCS = (status: string) => {
  return !['cancelled'].includes(status);
};

const canCancelOrder = (status: string) => {
  return ['pending', 'processing'].includes(status);
};

const viewOrderDetail = (orderId: number) => {
  selectedOrder.value = orders.value.find(order => order.id === orderId);
  showOrderDetail.value = true;
};

const trackDelivery = async (orderId: number) => {
  showDeliveryTracker.value = true;
  trackingInfo.value = null;

  // 배송 추적 정보 시뮬레이션
  setTimeout(() => {
    trackingInfo.value = {
      company: 'CJ대한통운',
      trackingNumber: '123456789012',
      events: [
        {
          status: 'delivered',
          description: '배송 완료',
          location: '강남구 테헤란로 123 (육프로 빌딩)',
          timestamp: '2024-01-17T16:30:00Z'
        },
        {
          status: 'out_for_delivery',
          description: '배송 중',
          location: '강남구 배송센터',
          timestamp: '2024-01-17T08:00:00Z'
        },
        {
          status: 'in_transit',
          description: '간선 수송',
          location: '서울 허브터미널',
          timestamp: '2024-01-16T22:00:00Z'
        },
        {
          status: 'picked_up',
          description: '상품 인수',
          location: '경기도 이천시 물류센터',
          timestamp: '2024-01-16T14:00:00Z'
        }
      ]
    };
  }, 1000);
};

const getTrackingIcon = (status: string) => {
  const icons = {
    picked_up: 'inventory',
    in_transit: 'local_shipping',
    out_for_delivery: 'delivery_dining',
    delivered: 'home'
  };
  return icons[status] || 'circle';
};

const getTrackingColor = (status: string) => {
  const colors = {
    picked_up: 'blue',
    in_transit: 'purple',
    out_for_delivery: 'orange',
    delivered: 'green'
  };
  return colors[status] || 'grey';
};

const downloadInvoice = (orderId: number) => {
  $q.notify({
    type: 'positive',
    message: '세금계산서 다운로드를 시작합니다',
    icon: 'receipt'
  });
};

const reorder = (orderId: number) => {
  const order = orders.value.find(o => o.id === orderId);
  if (!order) return;

  $q.dialog({
    title: '재주문 확인',
    message: `주문번호 ${order.orderNumber}의 상품들을 장바구니에 담으시겠습니까?`,
    cancel: true
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: '장바구니에 상품이 추가되었습니다',
      icon: 'shopping_cart'
    });
    router.push('/cart');
  });
};

const requestCS = (orderId: number) => {
  const order = orders.value.find(o => o.id === orderId);
  if (!order) return;

  router.push(`/support?order=${order.orderNumber}`);
};

const cancelOrder = (orderId: number) => {
  const order = orders.value.find(o => o.id === orderId);
  if (!order) return;

  $q.dialog({
    title: '주문 취소',
    message: `주문번호 ${order.orderNumber}을 취소하시겠습니까?`,
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(() => {
    // 실제로는 API 호출
    order.status = 'cancelled';
    $q.notify({
      type: 'positive',
      message: '주문이 취소되었습니다',
      icon: 'cancel'
    });
  });
};

const goToProducts = () => {
  router.push('/products');
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR');
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('ko-KR') + '원';
};

// 와처
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 생명주기
onMounted(async () => {
  // 인증 확인
  if (!authStore.isAuthenticated) {
    router.push('/auth/login');
    return;
  }

  // URL 쿼리 파라미터로부터 초기 필터 설정
  const { status, period, search } = route.query;
  if (status) filters.value.status = status as string;
  if (period) filters.value.period = period as string;
  if (search) filters.value.search = search as string;

  // 주문 데이터 로드
  isLoading.value = true;
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '주문 내역을 불러오는 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.orders-page {
  background: #fafafa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.order-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.order-header {
  border-bottom: 1px solid #e0e0e0;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.delivery-info {
  border-bottom: 1px solid #e3f2fd;
}

.order-item {
  padding: 12px 0;
}

.order-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.item-specs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.order-summary {
  border-top: 1px solid #e0e0e0;
}

.summary-item {
  text-align: center;
}

.total-amount {
  text-align: right;
  padding: 8px;
  background: rgba(25, 118, 210, 0.05);
  border-radius: 8px;
}

.order-actions-section {
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}

.empty-state {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.pagination-wrapper {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.order-detail-dialog :deep(.q-dialog__inner) {
  padding: 0;
}

.order-detail-section {
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.order-detail-section:last-child {
  border-bottom: none;
}

.specs-chips {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.payment-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 0 8px;
  }

  .header-actions {
    flex-direction: column;
    gap: 4px;
  }

  .order-actions {
    flex-direction: column;
    align-items: flex-end;
  }

  .text-h4 {
    font-size: 1.5rem;
  }

  .summary-item {
    margin-bottom: 8px;
  }
}

/* 로딩 애니메이션 */
.order-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 상태별 색상 */
.status-pending { color: #ff9800; }
.status-processing { color: #2196f3; }
.status-shipping { color: #9c27b0; }
.status-delivered { color: #4caf50; }
.status-cancelled { color: #f44336; }

/* 테이블 스타일링 */
:deep(.q-table) {
  border-radius: 8px;
}

:deep(.q-table th) {
  font-weight: bold;
  background: #f5f5f5;
}

/* 배송 추적 타임라인 */
:deep(.q-timeline-entry) {
  padding-bottom: 24px;
}

:deep(.q-timeline-entry:last-child) {
  padding-bottom: 0;
}
</style>
