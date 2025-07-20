<template>
  <q-page class="invoices-page">
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
            <div class="text-h4 text-weight-bold">세금계산서 관리</div>
            <div class="text-subtitle1 opacity-80">
              총 {{ totalInvoices }}건의 세금계산서를 관리하세요
            </div>
          </div>
          <div class="header-actions">
            <q-btn
              flat
              icon="refresh"
              color="white"
              @click="refreshInvoices"
              :loading="isRefreshing"
            >
              <q-tooltip>새로고침</q-tooltip>
            </q-btn>
            <q-btn
              flat
              icon="cloud_download"
              color="white"
              @click="bulkDownload"
            >
              <q-tooltip>전체 다운로드</q-tooltip>
            </q-btn>
            <q-btn
              color="white"
              text-color="primary"
              icon="add"
              label="세금계산서 발행"
              @click="showIssueDialog = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="bg-grey-1 q-py-lg">
      <div class="container">
        <div class="row q-gutter-lg">
          <div class="col-12 col-md-3">
            <q-card class="stats-card">
              <q-card-section class="text-center">
                <div class="stats-icon bg-blue-1">
                  <q-icon name="receipt_long" size="32px" color="blue" />
                </div>
                <div class="text-h6 text-weight-bold q-mt-md">
                  {{ totalInvoices }}
                </div>
                <div class="text-body2 text-grey-6">총 발행건수</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card class="stats-card">
              <q-card-section class="text-center">
                <div class="stats-icon bg-green-1">
                  <q-icon name="attach_money" size="32px" color="green" />
                </div>
                <div class="text-h6 text-weight-bold q-mt-md">
                  {{ formatCurrency(totalAmount) }}
                </div>
                <div class="text-body2 text-grey-6">총 공급가액</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card class="stats-card">
              <q-card-section class="text-center">
                <div class="stats-icon bg-orange-1">
                  <q-icon name="account_balance" size="32px" color="orange" />
                </div>
                <div class="text-h6 text-weight-bold q-mt-md">
                  {{ formatCurrency(totalTax) }}
                </div>
                <div class="text-body2 text-grey-6">총 부가세</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card class="stats-card">
              <q-card-section class="text-center">
                <div class="stats-icon bg-purple-1">
                  <q-icon name="trending_up" size="32px" color="purple" />
                </div>
                <div class="text-h6 text-weight-bold q-mt-md">
                  {{ thisMonthCount }}
                </div>
                <div class="text-body2 text-grey-6">이번 달 발행</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 필터 및 검색 -->
    <div class="bg-white q-py-md shadow-1">
      <div class="container">
        <div class="row q-gutter-md items-end">
          <!-- 상태 필터 -->
          <div class="col-12 col-sm-6 col-md-2">
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              label="발행 상태"
              outlined
              dense
              emit-value
              map-options
              clearable
              @update:model-value="filterInvoices"
            >
              <template v-slot:prepend>
                <q-icon name="filter_list" />
              </template>
            </q-select>
          </div>

          <!-- 발행일 필터 -->
          <div class="col-12 col-sm-6 col-md-2">
            <q-select
              v-model="filters.period"
              :options="periodOptions"
              label="발행일"
              outlined
              dense
              emit-value
              map-options
              @update:model-value="filterInvoices"
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
              @update:model-value="filterInvoices"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-2" v-if="filters.period === 'custom'">
            <q-input
              v-model="filters.endDate"
              label="종료일"
              outlined
              dense
              type="date"
              @update:model-value="filterInvoices"
            />
          </div>

          <!-- 금액 범위 -->
          <div class="col-12 col-sm-6 col-md-2">
            <q-select
              v-model="filters.amountRange"
              :options="amountRangeOptions"
              label="금액 범위"
              outlined
              dense
              emit-value
              map-options
              clearable
              @update:model-value="filterInvoices"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-select>
          </div>

          <!-- 검색 -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.search"
              label="계산서번호 / 주문번호 검색"
              outlined
              dense
              @keyup.enter="filterInvoices"
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
                  @click="filterInvoices"
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
              v-if="filters.amountRange"
              removable
              color="purple"
              text-color="white"
              @remove="clearFilter('amountRange')"
            >
              금액: {{ getAmountRangeLabel(filters.amountRange) }}
            </q-chip>
            <q-chip
              v-if="filters.search"
              removable
              color="orange"
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

    <!-- 세금계산서 목록 -->
    <div class="container q-py-lg">
      <div v-if="isLoading" class="text-center q-py-xl">
        <q-spinner-dots size="50px" color="primary" />
        <div class="text-subtitle2 text-grey-6 q-mt-md">
          세금계산서를 불러오는 중...
        </div>
      </div>

      <div v-else-if="filteredInvoices.length === 0" class="empty-state">
        <div class="text-center q-py-xl">
          <q-icon name="receipt" size="64px" color="grey-4" />
          <div class="text-h6 text-grey-6 q-mt-md">
            {{ hasActiveFilters ? '필터 조건에 맞는 세금계산서가 없습니다' : '아직 발행된 세금계산서가 없습니다' }}
          </div>
          <div class="text-body2 text-grey-5 q-mt-sm">
            {{ hasActiveFilters ? '다른 조건으로 검색해보세요' : '주문 후 세금계산서를 발행하세요' }}
          </div>
          <q-btn
            v-if="!hasActiveFilters"
            color="primary"
            label="세금계산서 발행"
            icon="add"
            @click="showIssueDialog = true"
            class="q-mt-lg"
          />
        </div>
      </div>

      <div v-else class="invoices-list">
        <q-card
          v-for="invoice in paginatedInvoices"
          :key="invoice.id"
          class="invoice-card q-mb-lg"
          flat
          bordered
        >
          <!-- 세금계산서 헤더 -->
          <q-card-section class="invoice-header bg-grey-1">
            <div class="row items-center">
              <div class="col">
                <div class="row items-center q-gutter-sm">
                  <div class="text-subtitle1 text-weight-bold">
                    계산서번호: {{ invoice.invoiceNumber }}
                  </div>
                  <q-chip
                    :color="getStatusColor(invoice.status)"
                    text-color="white"
                    :icon="getStatusIcon(invoice.status)"
                    size="sm"
                  >
                    {{ getStatusLabel(invoice.status) }}
                  </q-chip>
                  <q-chip
                    v-if="invoice.isElectronic"
                    color="blue"
                    text-color="white"
                    icon="cloud"
                    size="sm"
                  >
                    전자세금계산서
                  </q-chip>
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  발행일: {{ formatDate(invoice.issueDate) }} |
                  주문번호: {{ invoice.orderNumber }}
                </div>
              </div>
              <div class="invoice-actions">
                <q-btn
                  flat
                  round
                  icon="more_vert"
                  color="grey-7"
                >
                  <q-menu>
                    <q-list>
                      <q-item clickable @click="viewInvoiceDetail(invoice.id)">
                        <q-item-section avatar>
                          <q-icon name="visibility" />
                        </q-item-section>
                        <q-item-section>상세 보기</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="downloadInvoice(invoice.id)"
                        v-if="invoice.status === 'issued'"
                      >
                        <q-item-section avatar>
                          <q-icon name="download" />
                        </q-item-section>
                        <q-item-section>PDF 다운로드</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="emailInvoice(invoice.id)"
                        v-if="invoice.status === 'issued'"
                      >
                        <q-item-section avatar>
                          <q-icon name="email" />
                        </q-item-section>
                        <q-item-section>이메일 발송</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="printInvoice(invoice.id)"
                        v-if="invoice.status === 'issued'"
                      >
                        <q-item-section avatar>
                          <q-icon name="print" />
                        </q-item-section>
                        <q-item-section>인쇄</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item
                        clickable
                        @click="copyInvoiceNumber(invoice.invoiceNumber)"
                      >
                        <q-item-section avatar>
                          <q-icon name="content_copy" />
                        </q-item-section>
                        <q-item-section>번호 복사</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="cancelInvoice(invoice.id)"
                        v-if="canCancelInvoice(invoice.status)"
                      >
                        <q-item-section avatar>
                          <q-icon name="cancel" color="red" />
                        </q-item-section>
                        <q-item-section class="text-red">발행 취소</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn
                  flat
                  icon="chevron_right"
                  color="primary"
                  @click="viewInvoiceDetail(invoice.id)"
                />
              </div>
            </div>
          </q-card-section>

          <!-- 사업자 정보 -->
          <q-card-section class="business-info">
            <div class="row q-gutter-lg">
              <div class="col-12 col-md-6">
                <div class="info-section">
                  <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">
                    <q-icon name="business" class="q-mr-xs" />
                    공급받는자 (매입처)
                  </div>
                  <div class="text-body2">
                    <div><strong>{{ invoice.buyer.companyName }}</strong></div>
                    <div class="text-grey-7">{{ invoice.buyer.businessNumber }}</div>
                    <div class="text-grey-7">{{ invoice.buyer.address }}</div>
                    <div class="text-grey-7">{{ invoice.buyer.representative }} / {{ invoice.buyer.phone }}</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="info-section">
                  <div class="text-subtitle2 text-weight-bold text-secondary q-mb-sm">
                    <q-icon name="store" class="q-mr-xs" />
                    공급하는자 (매출처)
                  </div>
                  <div class="text-body2">
                    <div><strong>{{ invoice.supplier.companyName }}</strong></div>
                    <div class="text-grey-7">{{ invoice.supplier.businessNumber }}</div>
                    <div class="text-grey-7">{{ invoice.supplier.address }}</div>
                    <div class="text-grey-7">{{ invoice.supplier.representative }} / {{ invoice.supplier.phone }}</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- 상품 목록 -->
          <q-card-section class="items-section">
            <div class="text-subtitle2 text-weight-bold q-mb-md">
              <q-icon name="inventory" class="q-mr-xs" />
              공급 상품 내역
            </div>
            <q-table
              :rows="invoice.items"
              :columns="invoiceItemColumns"
              row-key="id"
              flat
              dense
              :pagination="{ rowsPerPage: 0 }"
              hide-pagination
              class="invoice-items-table"
            >
              <template v-slot:body-cell-description="props">
                <q-td :props="props">
                  <div>
                    <div class="text-weight-bold">{{ props.value }}</div>
                    <div class="text-caption text-grey-6">
                      {{ props.row.specification }}
                    </div>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-quantity="props">
                <q-td :props="props" class="text-center">
                  {{ props.value }}{{ props.row.unit }}
                </q-td>
              </template>
              <template v-slot:body-cell-unitPrice="props">
                <q-td :props="props" class="text-right">
                  {{ formatCurrency(props.value) }}
                </q-td>
              </template>
              <template v-slot:body-cell-amount="props">
                <q-td :props="props" class="text-right text-weight-bold">
                  {{ formatCurrency(props.value) }}
                </q-td>
              </template>
            </q-table>
          </q-card-section>

          <!-- 금액 요약 -->
          <q-card-section class="amount-summary bg-grey-1">
            <div class="row justify-end">
              <div class="col-12 col-md-6">
                <q-list dense>
                  <q-item>
                    <q-item-section>공급가액</q-item-section>
                    <q-item-section side class="text-weight-bold">
                      {{ formatCurrency(invoice.supplyAmount) }}
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>부가세 (10%)</q-item-section>
                    <q-item-section side class="text-weight-bold">
                      {{ formatCurrency(invoice.taxAmount) }}
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item class="text-primary">
                    <q-item-section>
                      <div class="text-h6 text-weight-bold">총 금액</div>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-h6 text-weight-bold">
                        {{ formatCurrency(invoice.totalAmount) }}
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>

          <!-- 액션 버튼 -->
          <q-card-section class="invoice-actions-section">
            <div class="row q-gutter-sm justify-end">
              <q-btn
                v-if="invoice.status === 'issued'"
                outline
                color="blue"
                icon="download"
                label="PDF 다운로드"
                @click="downloadInvoice(invoice.id)"
              />
              <q-btn
                v-if="invoice.status === 'issued'"
                outline
                color="green"
                icon="email"
                label="이메일 발송"
                @click="emailInvoice(invoice.id)"
              />
              <q-btn
                v-if="invoice.status === 'issued'"
                outline
                color="purple"
                icon="print"
                label="인쇄"
                @click="printInvoice(invoice.id)"
              />
              <q-btn
                v-if="canCancelInvoice(invoice.status)"
                outline
                color="red"
                icon="cancel"
                label="발행 취소"
                @click="cancelInvoice(invoice.id)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="filteredInvoices.length > 0" class="pagination-wrapper q-mt-xl">
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

    <!-- 세금계산서 발행 다이얼로그 -->
    <q-dialog v-model="showIssueDialog" persistent>
      <q-card style="min-width: 500px">
        <q-bar class="bg-primary text-white">
          <div class="text-h6">세금계산서 발행</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showIssueDialog = false" />
        </q-bar>

        <q-card-section class="q-pa-lg">
          <div class="text-subtitle1 q-mb-md">주문번호를 선택하여 세금계산서를 발행하세요</div>

          <q-select
            v-model="issueForm.selectedOrder"
            :options="availableOrders"
            option-label="orderNumber"
            option-value="id"
            label="주문번호 선택"
            outlined
            emit-value
            map-options
            class="q-mb-md"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.orderNumber }}</q-item-label>
                  <q-item-label caption>
                    {{ formatDate(scope.opt.orderDate) }} | {{ formatCurrency(scope.opt.totalAmount) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model="issueForm.issueDate"
            label="발행일자"
            type="date"
            outlined
            class="q-mb-md"
          />

          <q-select
            v-model="issueForm.deliveryMethod"
            :options="deliveryMethodOptions"
            label="전달 방법"
            outlined
            emit-value
            map-options
            multiple
            use-chips
            class="q-mb-md"
          />

          <q-input
            v-if="issueForm.deliveryMethod.includes('email')"
            v-model="issueForm.email"
            label="이메일 주소"
            type="email"
            outlined
            class="q-mb-md"
          />

          <q-textarea
            v-model="issueForm.note"
            label="비고 (선택사항)"
            outlined
            rows="3"
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn
            flat
            label="취소"
            @click="showIssueDialog = false"
          />
          <q-btn
            color="primary"
            label="발행"
            :loading="isIssuing"
            @click="issueInvoice"
            :disable="!issueForm.selectedOrder || !issueForm.issueDate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 세금계산서 상세 다이얼로그 -->
    <q-dialog v-model="showDetailDialog" maximized>
      <q-card class="invoice-detail-dialog">
        <q-bar class="bg-primary text-white">
          <div class="text-h6">세금계산서 상세</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showDetailDialog = false" />
        </q-bar>

        <q-card-section class="q-pa-lg scroll">
          <div v-if="selectedInvoice" class="invoice-detail-content">
            <!-- 세금계산서 프리뷰 -->
            <div class="invoice-preview bg-white q-pa-xl" style="border: 1px solid #ddd;">
              <div class="text-center q-mb-lg">
                <div class="text-h4 text-weight-bold">세 금 계 산 서</div>
                <div class="text-subtitle1 q-mt-sm">({{ selectedInvoice.isElectronic ? '전자' : '종이' }}세금계산서)</div>
              </div>

              <!-- 기본 정보 -->
              <div class="row q-mb-lg">
                <div class="col-6">
                  <div class="text-weight-bold">계산서번호: {{ selectedInvoice.invoiceNumber }}</div>
                  <div>발행일자: {{ formatDate(selectedInvoice.issueDate) }}</div>
                </div>
                <div class="col-6 text-right">
                  <div>작성일자: {{ formatDate(selectedInvoice.createdAt) }}</div>
                  <div v-if="selectedInvoice.dueDate">지급기일: {{ formatDate(selectedInvoice.dueDate) }}</div>
                </div>
              </div>

              <!-- 사업자 정보 테이블 -->
              <table class="full-width q-mb-lg" style="border-collapse: collapse; border: 2px solid black;">
                <tr>
                  <td style="border: 1px solid black; padding: 8px; width: 50%; background: #f5f5f5;">
                    <div class="text-weight-bold text-center">공급받는자</div>
                  </td>
                  <td style="border: 1px solid black; padding: 8px; width: 50%; background: #f5f5f5;">
                    <div class="text-weight-bold text-center">공급하는자</div>
                  </td>
                </tr>
                <tr>
                  <td style="border: 1px solid black; padding: 12px; vertical-align: top;">
                    <div><strong>사업자등록번호:</strong> {{ selectedInvoice.buyer.businessNumber }}</div>
                    <div><strong>상호(법인명):</strong> {{ selectedInvoice.buyer.companyName }}</div>
                    <div><strong>성명:</strong> {{ selectedInvoice.buyer.representative }}</div>
                    <div><strong>주소:</strong> {{ selectedInvoice.buyer.address }}</div>
                    <div><strong>업태:</strong> {{ selectedInvoice.buyer.businessType }}</div>
                    <div><strong>종목:</strong> {{ selectedInvoice.buyer.businessItem }}</div>
                  </td>
                  <td style="border: 1px solid black; padding: 12px; vertical-align: top;">
                    <div><strong>사업자등록번호:</strong> {{ selectedInvoice.supplier.businessNumber }}</div>
                    <div><strong>상호(법인명):</strong> {{ selectedInvoice.supplier.companyName }}</div>
                    <div><strong>성명:</strong> {{ selectedInvoice.supplier.representative }}</div>
                    <div><strong>주소:</strong> {{ selectedInvoice.supplier.address }}</div>
                    <div><strong>업태:</strong> {{ selectedInvoice.supplier.businessType }}</div>
                    <div><strong>종목:</strong> {{ selectedInvoice.supplier.businessItem }}</div>
                  </td>
                </tr>
              </table>

              <!-- 상품 내역 테이블 -->
              <table class="full-width q-mb-lg" style="border-collapse: collapse; border: 2px solid black;">
                <thead>
                <tr style="background: #f5f5f5;">
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">품목</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">규격</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">수량</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">단가</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">공급가액</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">세액</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: center;">비고</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in selectedInvoice.items" :key="item.id">
                  <td style="border: 1px solid black; padding: 8px;">{{ item.description }}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: center;">{{ item.specification }}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: center;">{{ item.quantity }}{{ item.unit }}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: right;">{{ formatCurrency(item.unitPrice) }}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: right;">{{ formatCurrency(item.amount) }}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: right;">{{ formatCurrency(item.taxAmount) }}</td>
                  <td style="border: 1px solid black; padding: 8px;">{{ item.note || '' }}</td>
                </tr>
                </tbody>
              </table>

              <!-- 합계 -->
              <div class="row q-mb-lg">
                <div class="col-6"></div>
                <div class="col-6">
                  <table class="full-width" style="border-collapse: collapse; border: 2px solid black;">
                    <tr>
                      <td style="border: 1px solid black; padding: 8px; background: #f5f5f5; text-align: center; font-weight: bold;">공급가액</td>
                      <td style="border: 1px solid black; padding: 8px; background: #f5f5f5; text-align: center; font-weight: bold;">세액</td>
                      <td style="border: 1px solid black; padding: 8px; background: #f5f5f5; text-align: center; font-weight: bold;">총액</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid black; padding: 12px; text-align: right; font-weight: bold;">{{ formatCurrency(selectedInvoice.supplyAmount) }}</td>
                      <td style="border: 1px solid black; padding: 12px; text-align: right; font-weight: bold;">{{ formatCurrency(selectedInvoice.taxAmount) }}</td>
                      <td style="border: 1px solid black; padding: 12px; text-align: right; font-weight: bold;">{{ formatCurrency(selectedInvoice.totalAmount) }}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- 하단 정보 -->
              <div class="row">
                <div class="col-6">
                  <div v-if="selectedInvoice.note" class="text-body2">
                    <strong>비고:</strong> {{ selectedInvoice.note }}
                  </div>
                </div>
                <div class="col-6 text-right">
                  <div class="text-body2">
                    위 금액을 {{ selectedInvoice.isElectronic ? '전자세금계산서' : '세금계산서' }}로 발행합니다.
                  </div>
                  <div class="q-mt-md">
                    <div>{{ formatDate(selectedInvoice.issueDate) }}</div>
                    <div class="text-weight-bold">{{ selectedInvoice.supplier.companyName }} (인)</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 액션 버튼 -->
            <div class="text-center q-mt-lg">
              <q-btn
                color="primary"
                icon="download"
                label="PDF 다운로드"
                @click="downloadInvoice(selectedInvoice.id)"
                class="q-mr-sm"
              />
              <q-btn
                color="green"
                icon="email"
                label="이메일 발송"
                @click="emailInvoice(selectedInvoice.id)"
                class="q-mr-sm"
              />
              <q-btn
                color="purple"
                icon="print"
                label="인쇄"
                @click="printInvoice(selectedInvoice.id)"
              />
            </div>
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
const isIssuing = ref(false);
const showIssueDialog = ref(false);
const showDetailDialog = ref(false);
const selectedInvoice = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(5);

// 필터
const filters = ref({
  status: '',
  period: 'all',
  startDate: '',
  endDate: '',
  amountRange: '',
  search: ''
});

// 발행 폼
const issueForm = ref({
  selectedOrder: null,
  issueDate: new Date().toISOString().split('T')[0],
  deliveryMethod: ['download'],
  email: '',
  note: ''
});

// 세금계산서 데이터 (실제로는 API에서 가져옴)
const invoices = ref([
  {
    id: 1,
    invoiceNumber: 'YK-2024-001',
    orderNumber: 'YK2024010001',
    status: 'issued',
    isElectronic: true,
    issueDate: '2024-01-17T00:00:00Z',
    createdAt: '2024-01-17T10:30:00Z',
    dueDate: '2024-02-17T00:00:00Z',
    supplyAmount: 909091,
    taxAmount: 90909,
    totalAmount: 1000000,
    note: '축산물 납품',
    buyer: {
      companyName: '육프로 레스토랑',
      businessNumber: '123-45-67890',
      representative: '김사장',
      address: '서울특별시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      businessType: '음식점업',
      businessItem: '한식'
    },
    supplier: {
      companyName: '(주)육프로',
      businessNumber: '987-65-43210',
      representative: '박대표',
      address: '경기도 이천시 축산로 456',
      phone: '031-9876-5432',
      businessType: '도매업',
      businessItem: '축산물'
    },
    items: [
      {
        id: 1,
        description: '한우 등심',
        specification: '1++ 등급, 10kg',
        quantity: 10,
        unit: 'kg',
        unitPrice: 90909,
        amount: 909091,
        taxAmount: 90909,
        note: '냉장보관'
      }
    ]
  },
  {
    id: 2,
    invoiceNumber: 'YK-2024-002',
    orderNumber: 'YK2024010002',
    status: 'pending',
    isElectronic: true,
    issueDate: '2024-01-18T00:00:00Z',
    createdAt: '2024-01-18T14:20:00Z',
    supplyAmount: 1818182,
    taxAmount: 181818,
    totalAmount: 2000000,
    buyer: {
      companyName: '맛있는 정육점',
      businessNumber: '111-22-33444',
      representative: '이사장',
      address: '부산광역시 해운대구 센텀로 789',
      phone: '051-1111-2222',
      businessType: '소매업',
      businessItem: '정육점'
    },
    supplier: {
      companyName: '(주)육프로',
      businessNumber: '987-65-43210',
      representative: '박대표',
      address: '경기도 이천시 축산로 456',
      phone: '031-9876-5432',
      businessType: '도매업',
      businessItem: '축산물'
    },
    items: [
      {
        id: 2,
        description: '돼지 삼겹살',
        specification: '특등급, 20kg',
        quantity: 20,
        unit: 'kg',
        unitPrice: 90909,
        amount: 1818182,
        taxAmount: 181818,
        note: '냉장보관'
      }
    ]
  }
]);

// 발행 가능한 주문 목록
const availableOrders = ref([
  {
    id: 3,
    orderNumber: 'YK2024010003',
    orderDate: '2024-01-19T00:00:00Z',
    totalAmount: 1500000,
    status: 'delivered'
  },
  {
    id: 4,
    orderNumber: 'YK2024010004',
    orderDate: '2024-01-20T00:00:00Z',
    totalAmount: 800000,
    status: 'delivered'
  }
]);

// 옵션 데이터
const statusOptions = [
  { label: '전체', value: '' },
  { label: '발행 대기', value: 'pending' },
  { label: '발행 완료', value: 'issued' },
  { label: '발행 취소', value: 'cancelled' }
];

const periodOptions = [
  { label: '전체', value: 'all' },
  { label: '최근 1주일', value: '1week' },
  { label: '최근 1개월', value: '1month' },
  { label: '최근 3개월', value: '3months' },
  { label: '최근 6개월', value: '6months' },
  { label: '사용자 정의', value: 'custom' }
];

const amountRangeOptions = [
  { label: '100만원 미만', value: '0-1000000' },
  { label: '100-500만원', value: '1000000-5000000' },
  { label: '500-1000만원', value: '5000000-10000000' },
  { label: '1000만원 이상', value: '10000000-' }
];

const deliveryMethodOptions = [
  { label: 'PDF 다운로드', value: 'download' },
  { label: '이메일 발송', value: 'email' },
  { label: '문자 발송', value: 'sms' },
  { label: '우편 발송', value: 'mail' }
];

// 테이블 컬럼 정의
const invoiceItemColumns = [
  { name: 'description', label: '품목', field: 'description', align: 'left' },
  { name: 'specification', label: '규격', field: 'specification', align: 'center' },
  { name: 'quantity', label: '수량', field: 'quantity', align: 'center' },
  { name: 'unitPrice', label: '단가', field: 'unitPrice', align: 'right' },
  { name: 'amount', label: '공급가액', field: 'amount', align: 'right' }
];

// 계산된 속성
const totalInvoices = computed(() => invoices.value.length);
const totalAmount = computed(() => invoices.value.reduce((sum, inv) => sum + inv.supplyAmount, 0));
const totalTax = computed(() => invoices.value.reduce((sum, inv) => sum + inv.taxAmount, 0));
const thisMonthCount = computed(() => {
  const thisMonth = new Date().toISOString().substring(0, 7);
  return invoices.value.filter(inv => inv.issueDate.substring(0, 7) === thisMonth).length;
});

const filteredInvoices = computed(() => {
  let filtered = [...invoices.value];

  // 상태 필터
  if (filters.value.status) {
    filtered = filtered.filter(invoice => invoice.status === filters.value.status);
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
          filtered = filtered.filter(invoice => {
            const issueDate = new Date(invoice.issueDate);
            return issueDate >= start && issueDate <= end;
          });
        }
        break;
    }

    if (filters.value.period !== 'custom') {
      filtered = filtered.filter(invoice => new Date(invoice.issueDate) >= filterDate);
    }
  }

  // 금액 범위 필터
  if (filters.value.amountRange) {
    const [min, max] = filters.value.amountRange.split('-').map(Number);
    filtered = filtered.filter(invoice => {
      if (max) {
        return invoice.totalAmount >= min && invoice.totalAmount < max;
      } else {
        return invoice.totalAmount >= min;
      }
    });
  }

  // 검색 필터
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(search) ||
      invoice.orderNumber.toLowerCase().includes(search)
    );
  }

  return filtered.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
});

const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPage.value));

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredInvoices.value.slice(start, end);
});

const hasActiveFilters = computed(() => {
  return filters.value.status ||
    filters.value.period !== 'all' ||
    filters.value.amountRange ||
    filters.value.search;
});

// 메서드
const goBack = () => {
  router.go(-1);
};

const refreshInvoices = async () => {
  isRefreshing.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    $q.notify({
      type: 'positive',
      message: '세금계산서 목록이 업데이트되었습니다',
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

const bulkDownload = () => {
  $q.notify({
    type: 'info',
    message: '전체 세금계산서 다운로드를 시작합니다',
    icon: 'cloud_download'
  });
};

const filterInvoices = () => {
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
  filterInvoices();
};

const clearAllFilters = () => {
  filters.value = {
    status: '',
    period: 'all',
    startDate: '',
    endDate: '',
    amountRange: '',
    search: ''
  };
  filterInvoices();
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'orange',
    issued: 'green',
    cancelled: 'red'
  };
  return colors[status] || 'grey';
};

const getStatusIcon = (status: string) => {
  const icons = {
    pending: 'schedule',
    issued: 'check_circle',
    cancelled: 'cancel'
  };
  return icons[status] || 'help';
};

const getStatusLabel = (status: string) => {
  const labels = {
    pending: '발행 대기',
    issued: '발행 완료',
    cancelled: '발행 취소'
  };
  return labels[status] || status;
};

const getPeriodLabel = (period: string) => {
  const option = periodOptions.find(opt => opt.value === period);
  return option ? option.label : period;
};

const getAmountRangeLabel = (range: string) => {
  const option = amountRangeOptions.find(opt => opt.value === range);
  return option ? option.label : range;
};

const canCancelInvoice = (status: string) => {
  return status === 'pending';
};

const viewInvoiceDetail = (invoiceId: number) => {
  selectedInvoice.value = invoices.value.find(invoice => invoice.id === invoiceId);
  showDetailDialog.value = true;
};

const downloadInvoice = (invoiceId: number) => {
  const invoice = invoices.value.find(inv => inv.id === invoiceId);
  $q.notify({
    type: 'positive',
    message: `${invoice.invoiceNumber} PDF 다운로드를 시작합니다`,
    icon: 'download'
  });
};

const emailInvoice = (invoiceId: number) => {
  const invoice = invoices.value.find(inv => inv.id === invoiceId);
  $q.dialog({
    title: '이메일 발송',
    message: `${invoice.invoiceNumber} 세금계산서를 이메일로 발송하시겠습니까?`,
    prompt: {
      model: invoice.buyer.representative + '@example.com',
      type: 'email'
    },
    cancel: true
  }).onOk((email) => {
    $q.notify({
      type: 'positive',
      message: `${email}로 세금계산서가 발송되었습니다`,
      icon: 'email'
    });
  });
};

const printInvoice = (invoiceId: number) => {
  const invoice = invoices.value.find(inv => inv.id === invoiceId);
  $q.notify({
    type: 'info',
    message: `${invoice.invoiceNumber} 인쇄를 시작합니다`,
    icon: 'print'
  });
  window.print();
};

const copyInvoiceNumber = (invoiceNumber: string) => {
  navigator.clipboard.writeText(invoiceNumber);
  $q.notify({
    type: 'positive',
    message: '계산서 번호가 복사되었습니다',
    icon: 'content_copy'
  });
};

const cancelInvoice = (invoiceId: number) => {
  const invoice = invoices.value.find(inv => inv.id === invoiceId);
  $q.dialog({
    title: '발행 취소',
    message: `${invoice.invoiceNumber} 세금계산서 발행을 취소하시겠습니까?`,
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(() => {
    invoice.status = 'cancelled';
    $q.notify({
      type: 'positive',
      message: '세금계산서 발행이 취소되었습니다',
      icon: 'cancel'
    });
  });
};

const issueInvoice = async () => {
  isIssuing.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newInvoice = {
      id: Date.now(),
      invoiceNumber: `YK-2024-${String(invoices.value.length + 1).padStart(3, '0')}`,
      orderNumber: availableOrders.value.find(order => order.id === issueForm.value.selectedOrder)?.orderNumber,
      status: 'issued',
      isElectronic: true,
      issueDate: issueForm.value.issueDate + 'T00:00:00Z',
      createdAt: new Date().toISOString(),
      supplyAmount: 909091,
      taxAmount: 90909,
      totalAmount: 1000000,
      note: issueForm.value.note,
      // ... 실제로는 주문 정보에서 생성
    };

    // invoices.value.unshift(newInvoice);

    showIssueDialog.value = false;
    issueForm.value = {
      selectedOrder: null,
      issueDate: new Date().toISOString().split('T')[0],
      deliveryMethod: ['download'],
      email: '',
      note: ''
    };

    $q.notify({
      type: 'positive',
      message: '세금계산서가 성공적으로 발행되었습니다',
      icon: 'receipt'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '세금계산서 발행 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isIssuing.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('ko-KR');
};

// 와처
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 생명주기
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth/login');
    return;
  }

  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '세금계산서를 불러오는 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.invoices-page {
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

.stats-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.invoice-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.invoice-header {
  border-bottom: 1px solid #e0e0e0;
}

.invoice-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.business-info {
  border-bottom: 1px solid #f0f0f0;
}

.info-section {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.items-section {
  border-bottom: 1px solid #f0f0f0;
}

.invoice-items-table :deep(.q-table) {
  border-radius: 8px;
}

.invoice-items-table :deep(.q-table th) {
  font-weight: bold;
  background: #f5f5f5;
}

.amount-summary {
  border-top: 1px solid #e0e0e0;
}

.invoice-actions-section {
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

.invoice-detail-dialog :deep(.q-dialog__inner) {
  padding: 0;
}

.invoice-preview {
  max-width: 800px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.4;
}

.invoice-preview table {
  font-size: 12px;
}

.invoice-detail-content {
  background: #f5f5f5;
  padding: 2rem;
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

  .invoice-actions {
    flex-direction: column;
    align-items: flex-end;
  }

  .text-h4 {
    font-size: 1.5rem;
  }

  .stats-icon {
    width: 50px;
    height: 50px;
  }
}

/* 인쇄 스타일 */
@media print {
  .invoice-preview {
    box-shadow: none !important;
    border: none !important;
  }

  .q-bar,
  .invoice-actions {
    display: none !important;
  }
}

/* 로딩 애니메이션 */
.invoice-card {
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
.status-issued { color: #4caf50; }
.status-cancelled { color: #f44336; }
</style>
