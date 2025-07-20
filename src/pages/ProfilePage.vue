<template>
  <q-page class="profile-page">
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
            <div class="text-h4 text-weight-bold">프로필 관리</div>
            <div class="text-subtitle1 opacity-80">
              사업자 정보 및 계정 설정
            </div>
          </div>
          <div class="profile-actions">
            <q-btn
              v-if="!isEditing"
              flat
              icon="edit"
              label="편집"
              color="white"
              @click="toggleEdit"
            />
            <div v-else class="q-gutter-sm">
              <q-btn
                flat
                icon="close"
                label="취소"
                color="white"
                @click="cancelEdit"
              />
              <q-btn
                unelevated
                icon="save"
                label="저장"
                color="white"
                text-color="primary"
                @click="saveProfile"
                :loading="isSaving"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 탭 네비게이션 -->
    <div class="bg-grey-1 q-py-sm">
      <div class="container">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-primary"
          indicator-color="primary"
          align="left"
          no-caps
        >
          <q-tab name="profile" icon="business" label="사업자 정보" />
          <q-tab name="contact" icon="person" label="담당자 정보" />
          <q-tab name="security" icon="security" label="보안 설정" />
          <q-tab name="notifications" icon="notifications" label="알림 설정" />
          <q-tab name="billing" icon="receipt" label="결제 정보" />
        </q-tabs>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="container q-py-lg">
      <div class="row q-gutter-lg">
        <!-- 메인 정보 -->
        <div class="col-12 col-md-8">
          <q-tab-panels v-model="activeTab" animated class="bg-transparent">
            <!-- 사업자 정보 -->
            <q-tab-panel name="profile" class="q-pa-none">
              <q-card class="profile-card">
                <q-card-section class="bg-blue-1">
                  <div class="row items-center">
                    <q-avatar size="80px" color="primary" text-color="white" class="q-mr-md">
                      <q-icon name="business" size="40px" />
                    </q-avatar>
                    <div class="col">
                      <div class="text-h5 text-weight-bold text-primary">
                        {{ profileData.businessName }}
                      </div>
                      <div class="text-subtitle1 text-grey-7">
                        사업자등록번호: {{ profileData.businessNumber }}
                      </div>
                      <div class="q-mt-sm">
                        <q-chip
                          :color="profileData.isVerified ? 'green' : 'orange'"
                          text-color="white"
                          :icon="profileData.isVerified ? 'verified' : 'pending'"
                        >
                          {{ profileData.isVerified ? '인증완료' : '인증대기' }}
                        </q-chip>
                        <q-chip
                          color="blue"
                          text-color="white"
                          icon="grade"
                        >
                          {{ profileData.grade }} 등급
                        </q-chip>
                      </div>
                    </div>
                    <div v-if="!profileData.isVerified">
                      <q-btn
                        color="primary"
                        label="인증 요청"
                        icon="verified_user"
                        @click="requestVerification"
                      />
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-lg">
                    <!-- 기본 정보 -->
                    <div class="col-12 col-md-6">
                      <div class="text-h6 text-weight-bold q-mb-md text-primary">
                        <q-icon name="info" class="q-mr-sm" />
                        기본 정보
                      </div>

                      <q-input
                        v-model="profileData.businessName"
                        label="상호명 *"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        class="q-mb-md"
                        :rules="[val => !!val || '상호명을 입력해주세요']"
                      />

                      <q-input
                        v-model="profileData.businessNumber"
                        label="사업자등록번호 *"
                        mask="###-##-#####"
                        readonly
                        filled
                        class="q-mb-md"
                        hint="사업자등록번호는 변경할 수 없습니다"
                      />

                      <q-select
                        v-model="profileData.businessType"
                        :options="businessTypeOptions"
                        label="업종 *"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        class="q-mb-md"
                        emit-value
                        map-options
                      />

                      <q-input
                        v-model="profileData.establishedDate"
                        label="설립일"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        type="date"
                        class="q-mb-md"
                      />
                    </div>

                    <!-- 주소 정보 -->
                    <div class="col-12 col-md-6">
                      <div class="text-h6 text-weight-bold q-mb-md text-primary">
                        <q-icon name="location_on" class="q-mr-sm" />
                        사업장 주소
                      </div>

                      <div class="row q-gutter-sm q-mb-md">
                        <q-input
                          v-model="profileData.zipCode"
                          label="우편번호 *"
                          :readonly="!isEditing"
                          :outlined="isEditing"
                          :filled="!isEditing"
                          class="col-4"
                          mask="#####"
                        />
                        <q-btn
                          v-if="isEditing"
                          label="주소 검색"
                          icon="search"
                          color="primary"
                          @click="searchAddress"
                          class="col"
                        />
                      </div>

                      <q-input
                        v-model="profileData.address"
                        label="기본 주소 *"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        class="q-mb-md"
                      />

                      <q-input
                        v-model="profileData.addressDetail"
                        label="상세 주소"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        class="q-mb-md"
                      />

                      <q-input
                        v-model="profileData.businessPhone"
                        label="사업장 전화번호"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        mask="##-###-####"
                        class="q-mb-md"
                      />
                    </div>
                  </div>

                  <!-- 사업자등록증 -->
                  <div class="q-mt-lg">
                    <div class="text-h6 text-weight-bold q-mb-md text-primary">
                      <q-icon name="description" class="q-mr-sm" />
                      사업자등록증
                    </div>

                    <div class="row q-gutter-md">
                      <div v-if="profileData.businessLicense" class="col-12 col-sm-4">
                        <q-card class="license-card">
                          <q-img
                            :src="profileData.businessLicense"
                            style="height: 200px"
                            class="rounded-borders"
                            spinner-color="primary"
                          >
                            <div class="absolute-bottom bg-transparent">
                              <div class="text-subtitle2">사업자등록증</div>
                            </div>
                          </q-img>
                          <q-card-actions v-if="isEditing" align="center">
                            <q-btn
                              flat
                              icon="edit"
                              label="변경"
                              color="primary"
                              @click="uploadLicense"
                            />
                            <q-btn
                              flat
                              icon="delete"
                              label="삭제"
                              color="red"
                              @click="deleteLicense"
                            />
                          </q-card-actions>
                        </q-card>
                      </div>

                      <div v-else class="col-12 col-sm-4">
                        <q-card class="license-upload-card" flat bordered>
                          <q-card-section class="text-center">
                            <q-icon name="cloud_upload" size="48px" color="grey-5" />
                            <div class="text-subtitle2 text-grey-6 q-mt-sm">
                              사업자등록증 미등록
                            </div>
                            <q-btn
                              v-if="isEditing"
                              label="업로드"
                              color="primary"
                              class="q-mt-sm"
                              @click="uploadLicense"
                            />
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 담당자 정보 -->
            <q-tab-panel name="contact" class="q-pa-none">
              <q-card class="profile-card">
                <q-card-section>
                  <div class="text-h6 text-weight-bold q-mb-md text-primary">
                    <q-icon name="person" class="q-mr-sm" />
                    담당자 정보
                  </div>

                  <div class="row q-gutter-lg">
                    <div class="col-12 col-md-6">
                      <q-input
                        v-model="profileData.contactName"
                        label="담당자 이름 *"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        class="q-mb-md"
                        :rules="[val => !!val || '담당자 이름을 입력해주세요']"
                      />

                      <q-input
                        v-model="profileData.email"
                        label="이메일 주소 *"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        type="email"
                        class="q-mb-md"
                        :rules="[val => !!val || '이메일을 입력해주세요']"
                      />

                      <q-input
                        v-model="profileData.contactPhone"
                        label="휴대폰 번호 *"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        mask="###-####-####"
                        class="q-mb-md"
                      />
                    </div>

                    <div class="col-12 col-md-6">
                      <q-input
                        v-model="profileData.position"
                        label="직책"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        class="q-mb-md"
                      />

                      <q-input
                        v-model="profileData.department"
                        label="부서"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        class="q-mb-md"
                      />

                      <q-input
                        v-model="profileData.fax"
                        label="팩스 번호"
                        :readonly="!isEditing"
                        :outlined="isEditing"
                        :filled="!isEditing"
                        mask="##-###-####"
                        class="q-mb-md"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 보안 설정 -->
            <q-tab-panel name="security" class="q-pa-none">
              <q-card class="profile-card">
                <q-card-section>
                  <div class="text-h6 text-weight-bold q-mb-md text-primary">
                    <q-icon name="security" class="q-mr-sm" />
                    보안 설정
                  </div>

                  <!-- 비밀번호 변경 -->
                  <div class="security-section q-mb-xl">
                    <div class="text-subtitle1 text-weight-bold q-mb-md">
                      비밀번호 변경
                    </div>
                    <div class="row q-gutter-md">
                      <q-input
                        v-model="passwordData.current"
                        label="현재 비밀번호"
                        type="password"
                        outlined
                        class="col-12 col-md-4"
                      />
                      <q-input
                        v-model="passwordData.new"
                        label="새 비밀번호"
                        type="password"
                        outlined
                        class="col-12 col-md-4"
                        :rules="[validatePassword]"
                        hint="8자 이상, 영문+숫자+특수문자"
                      />
                      <q-input
                        v-model="passwordData.confirm"
                        label="비밀번호 확인"
                        type="password"
                        outlined
                        class="col-12 col-md-4"
                        :rules="[validatePasswordConfirm]"
                      />
                    </div>
                    <div class="q-mt-md">
                      <q-btn
                        color="primary"
                        label="비밀번호 변경"
                        @click="changePassword"
                        :disable="!canChangePassword"
                      />
                    </div>
                  </div>

                  <!-- 2단계 인증 -->
                  <div class="security-section q-mb-xl">
                    <div class="row items-center justify-between">
                      <div>
                        <div class="text-subtitle1 text-weight-bold">
                          2단계 인증 (OTP)
                        </div>
                        <div class="text-caption text-grey-6">
                          계정 보안을 위한 추가 인증 단계
                        </div>
                      </div>
                      <q-toggle
                        v-model="securitySettings.twoFactorEnabled"
                        color="primary"
                        @update:model-value="toggleTwoFactor"
                      />
                    </div>
                    <div v-if="securitySettings.twoFactorEnabled" class="q-mt-md">
                      <q-banner class="bg-green-1 text-green-8">
                        <template v-slot:avatar>
                          <q-icon name="verified_user" color="green" />
                        </template>
                        2단계 인증이 활성화되어 있습니다.
                      </q-banner>
                    </div>
                  </div>

                  <!-- 로그인 기록 -->
                  <div class="security-section">
                    <div class="text-subtitle1 text-weight-bold q-mb-md">
                      최근 로그인 기록
                    </div>
                    <q-list bordered>
                      <q-item
                        v-for="login in loginHistory"
                        :key="login.id"
                      >
                        <q-item-section avatar>
                          <q-icon
                            :name="login.deviceType === 'mobile' ? 'smartphone' : 'computer'"
                            :color="login.isSuccess ? 'green' : 'red'"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            {{ login.location }} - {{ login.device }}
                          </q-item-label>
                          <q-item-label caption>
                            IP: {{ login.ipAddress }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>
                            {{ formatDateTime(login.timestamp) }}
                          </q-item-label>
                          <q-chip
                            :color="login.isSuccess ? 'green' : 'red'"
                            text-color="white"
                            size="sm"
                          >
                            {{ login.isSuccess ? '성공' : '실패' }}
                          </q-chip>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 알림 설정 -->
            <q-tab-panel name="notifications" class="q-pa-none">
              <q-card class="profile-card">
                <q-card-section>
                  <div class="text-h6 text-weight-bold q-mb-md text-primary">
                    <q-icon name="notifications" class="q-mr-sm" />
                    알림 설정
                  </div>

                  <div class="notification-groups">
                    <div
                      v-for="group in notificationSettings"
                      :key="group.category"
                      class="notification-group q-mb-lg"
                    >
                      <div class="text-subtitle1 text-weight-bold q-mb-md">
                        <q-icon :name="group.icon" class="q-mr-sm" />
                        {{ group.title }}
                      </div>
                      <q-list>
                        <q-item
                          v-for="setting in group.settings"
                          :key="setting.key"
                        >
                          <q-item-section>
                            <q-item-label>{{ setting.title }}</q-item-label>
                            <q-item-label caption>{{ setting.description }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <div class="row q-gutter-sm">
                              <q-toggle
                                v-model="setting.email"
                                color="primary"
                                label="이메일"
                                left-label
                              />
                              <q-toggle
                                v-model="setting.sms"
                                color="orange"
                                label="SMS"
                                left-label
                              />
                              <q-toggle
                                v-model="setting.push"
                                color="green"
                                label="앱 알림"
                                left-label
                              />
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>

                  <div class="q-mt-lg">
                    <q-btn
                      color="primary"
                      label="알림 설정 저장"
                      @click="saveNotificationSettings"
                      :loading="isSavingNotifications"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 결제 정보 -->
            <q-tab-panel name="billing" class="q-pa-none">
              <q-card class="profile-card">
                <q-card-section>
                  <div class="text-h6 text-weight-bold q-mb-md text-primary">
                    <q-icon name="receipt" class="q-mr-sm" />
                    결제 정보
                  </div>

                  <!-- 등록된 결제 수단 -->
                  <div class="payment-methods q-mb-xl">
                    <div class="text-subtitle1 text-weight-bold q-mb-md">
                      등록된 결제 수단
                    </div>
                    <div class="row q-gutter-md">
                      <q-card
                        v-for="method in paymentMethods"
                        :key="method.id"
                        class="payment-card col-12 col-sm-6 col-md-4"
                        :class="{ 'primary-payment': method.isDefault }"
                      >
                        <q-card-section class="relative">
                          <div class="row items-center">
                            <q-icon
                              :name="method.type === 'card' ? 'credit_card' : 'account_balance'"
                              size="24px"
                              :color="method.type === 'card' ? 'blue' : 'green'"
                            />
                            <div class="q-ml-sm">
                              <div class="text-weight-bold">{{ method.name }}</div>
                              <div class="text-caption text-grey-6">
                                {{ method.number }}
                              </div>
                            </div>
                          </div>
                          <div v-if="method.isDefault" class="absolute-top-right q-pa-sm">
                            <q-chip color="primary" text-color="white" size="sm">
                              기본
                            </q-chip>
                          </div>
                        </q-card-section>
                        <q-card-actions>
                          <q-btn
                            v-if="!method.isDefault"
                            flat
                            size="sm"
                            label="기본으로 설정"
                            @click="setDefaultPayment(method.id)"
                          />
                          <q-space />
                          <q-btn
                            flat
                            icon="edit"
                            size="sm"
                            @click="editPaymentMethod(method)"
                          />
                          <q-btn
                            flat
                            icon="delete"
                            color="red"
                            size="sm"
                            @click="deletePaymentMethod(method.id)"
                          />
                        </q-card-actions>
                      </q-card>

                      <!-- 결제 수단 추가 카드 -->
                      <q-card class="add-payment-card col-12 col-sm-6 col-md-4" flat bordered>
                        <q-card-section class="text-center">
                          <q-icon name="add" size="48px" color="grey-5" />
                          <div class="text-subtitle2 text-grey-6 q-mt-sm">
                            새 결제 수단 추가
                          </div>
                          <q-btn
                            color="primary"
                            label="추가"
                            class="q-mt-sm"
                            @click="addPaymentMethod"
                          />
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>

                  <!-- 세금계산서 정보 -->
                  <div class="invoice-info">
                    <div class="text-subtitle1 text-weight-bold q-mb-md">
                      세금계산서 발행 정보
                    </div>
                    <div class="row q-gutter-md">
                      <q-input
                        v-model="invoiceInfo.email"
                        label="세금계산서 이메일"
                        outlined
                        type="email"
                        class="col-12 col-md-6"
                        hint="세금계산서를 받을 이메일 주소"
                      />
                      <q-select
                        v-model="invoiceInfo.type"
                        :options="invoiceTypeOptions"
                        label="발행 방식"
                        outlined
                        class="col-12 col-md-6"
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="q-mt-md">
                      <q-btn
                        color="primary"
                        label="세금계산서 설정 저장"
                        @click="saveInvoiceSettings"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <!-- 사이드바 -->
        <div class="col-12 col-md-4">
          <!-- 계정 상태 -->
          <q-card class="account-status-card q-mb-lg">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">
                <q-icon name="account_circle" class="q-mr-sm" />
                계정 상태
              </div>

              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon
                      :name="profileData.isVerified ? 'verified' : 'pending'"
                      :color="profileData.isVerified ? 'green' : 'orange'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>사업자 인증</q-item-label>
                    <q-item-label caption>
                      {{ profileData.isVerified ? '인증완료' : '인증대기' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="grade" color="blue" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>등급</q-item-label>
                    <q-item-label caption>{{ profileData.grade }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="purple" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>가입일</q-item-label>
                    <q-item-label caption>
                      {{ formatDate(profileData.createdAt) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- 이용 통계 -->
          <q-card class="usage-stats-card q-mb-lg">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">
                <q-icon name="analytics" class="q-mr-sm" />
                이용 통계
              </div>

              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ stats.totalOrders }}</div>
                  <div class="stat-label">총 주문 건수</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ formatCurrency(stats.totalAmount) }}</div>
                  <div class="stat-label">총 거래 금액</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ stats.thisMonthOrders }}</div>
                  <div class="stat-label">이번 달 주문</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ stats.loyaltyPoints }}</div>
                  <div class="stat-label">적립 포인트</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- 빠른 액션 -->
          <q-card class="quick-actions-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">
                <q-icon name="flash_on" class="q-mr-sm" />
                빠른 액션
              </div>

              <q-list>
                <q-item clickable @click="goToOrders">
                  <q-item-section avatar>
                    <q-icon name="list_alt" color="blue" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>주문 내역</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" />
                  </q-item-section>
                </q-item>

                <q-item clickable @click="goToInvoices">
                  <q-item-section avatar>
                    <q-icon name="receipt_long" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>세금계산서</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" />
                  </q-item-section>
                </q-item>

                <q-item clickable @click="goToSupport">
                  <q-item-section avatar>
                    <q-icon name="support_agent" color="orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>고객지원</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" />
                  </q-item-section>
                </q-item>

                <q-item clickable @click="downloadBusinessCert">
                  <q-item-section avatar>
                    <q-icon name="download" color="purple" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>사업자등록증 다운로드</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- 파일 업로드 다이얼로그 -->
    <q-dialog v-model="showUploadDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">사업자등록증 업로드</div>
        </q-card-section>

        <q-card-section>
          <q-file
            v-model="uploadFile"
            label="파일 선택"
            outlined
            accept="image/*,.pdf"
            max-file-size="5242880"
            @rejected="onRejected"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <div class="text-caption text-grey-6 q-mt-sm">
            이미지 파일 또는 PDF (최대 5MB)
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="취소" v-close-popup />
          <q-btn
            color="primary"
            label="업로드"
            :disable="!uploadFile"
            @click="handleFileUpload"
            :loading="isUploading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

// 반응형 데이터
const activeTab = ref('profile');
const isEditing = ref(false);
const isSaving = ref(false);
const isSavingNotifications = ref(false);
const isUploading = ref(false);
const showUploadDialog = ref(false);
const uploadFile = ref<File | null>(null);

// 프로필 데이터
const profileData = ref({
  businessName: '육프로 테스트 업체',
  businessNumber: '123-45-67890',
  businessType: 'meat_wholesale',
  establishedDate: '2020-01-01',
  zipCode: '06292',
  address: '서울특별시 강남구 테헤란로 123',
  addressDetail: '육프로 빌딩 5층',
  businessPhone: '02-1234-5678',
  contactName: '김사장',
  email: 'kim@yukpro.com',
  contactPhone: '010-1234-5678',
  position: '대표',
  department: '경영지원팀',
  fax: '02-1234-5679',
  businessLicense: '/images/business-license-sample.jpg',
  isVerified: true,
  grade: 'VIP',
  createdAt: '2023-01-15T09:00:00Z'
});

// 원본 데이터 (편집 취소용)
const originalData = ref({ ...profileData.value });

// 비밀번호 변경 데이터
const passwordData = ref({
  current: '',
  new: '',
  confirm: ''
});

// 보안 설정
const securitySettings = ref({
  twoFactorEnabled: false
});

// 로그인 기록
const loginHistory = ref([
  {
    id: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    location: '서울, 한국',
    device: 'Chrome 브라우저',
    deviceType: 'desktop',
    ipAddress: '192.168.1.1',
    isSuccess: true
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    location: '서울, 한국',
    device: 'iPhone Safari',
    deviceType: 'mobile',
    ipAddress: '192.168.1.2',
    isSuccess: true
  }
]);

// 알림 설정
const notificationSettings = ref([
  {
    category: 'orders',
    title: '주문 알림',
    icon: 'shopping_cart',
    settings: [
      {
        key: 'order_confirmed',
        title: '주문 접수',
        description: '주문이 접수되었을 때',
        email: true,
        sms: true,
        push: true
      },
      {
        key: 'order_shipped',
        title: '배송 시작',
        description: '상품 배송이 시작되었을 때',
        email: true,
        sms: false,
        push: true
      },
      {
        key: 'order_delivered',
        title: '배송 완료',
        description: '상품이 배송 완료되었을 때',
        email: false,
        sms: true,
        push: true
      }
    ]
  },
  {
    category: 'promotions',
    title: '프로모션',
    icon: 'local_offer',
    settings: [
      {
        key: 'special_offers',
        title: '특가 혜택',
        description: '할인 및 특가 상품 정보',
        email: true,
        sms: false,
        push: false
      },
      {
        key: 'new_products',
        title: '신상품 알림',
        description: '새로운 상품 출시 정보',
        email: false,
        sms: false,
        push: true
      }
    ]
  }
]);

// 결제 수단
const paymentMethods = ref([
  {
    id: 1,
    type: 'card',
    name: '기업 신용카드',
    number: '**** **** **** 1234',
    isDefault: true
  },
  {
    id: 2,
    type: 'account',
    name: '기업 계좌',
    number: '국민은행 123-456-789',
    isDefault: false
  }
]);

// 세금계산서 정보
const invoiceInfo = ref({
  email: 'accounting@yukpro.com',
  type: 'auto'
});

// 이용 통계
const stats = ref({
  totalOrders: 156,
  totalAmount: 45670000,
  thisMonthOrders: 12,
  loyaltyPoints: 15600
});

// 옵션 데이터
const businessTypeOptions = [
  { label: '축산물 도매업', value: 'meat_wholesale' },
  { label: '축산물 소매업', value: 'meat_retail' },
  { label: '식당업', value: 'restaurant' },
  { label: '정육점', value: 'butcher' },
  { label: '기타', value: 'other' }
];

const invoiceTypeOptions = [
  { label: '자동 발행', value: 'auto' },
  { label: '수동 발행', value: 'manual' }
];

// 계산된 속성
const canChangePassword = computed(() => {
  return passwordData.value.current &&
    passwordData.value.new &&
    passwordData.value.confirm &&
    passwordData.value.new === passwordData.value.confirm;
});

// 메서드
const goBack = () => {
  router.go(-1);
};

const toggleEdit = () => {
  isEditing.value = true;
  originalData.value = { ...profileData.value };
};

const cancelEdit = () => {
  isEditing.value = false;
  profileData.value = { ...originalData.value };
};

const saveProfile = async () => {
  isSaving.value = true;
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    isEditing.value = false;
    $q.notify({
      type: 'positive',
      message: '프로필이 성공적으로 저장되었습니다',
      icon: 'check_circle'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '프로필 저장 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isSaving.value = false;
  }
};

const validatePassword = (val: string) => {
  if (!val) return '새 비밀번호를 입력해주세요';
  if (val.length < 8) return '최소 8자 이상이어야 합니다';
  if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(val)) {
    return '영문, 숫자, 특수문자를 모두 포함해야 합니다';
  }
  return true;
};

const validatePasswordConfirm = (val: string) => {
  if (!val) return '비밀번호 확인을 입력해주세요';
  if (val !== passwordData.value.new) return '비밀번호가 일치하지 않습니다';
  return true;
};

const changePassword = async () => {
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    passwordData.value = { current: '', new: '', confirm: '' };
    $q.notify({
      type: 'positive',
      message: '비밀번호가 성공적으로 변경되었습니다',
      icon: 'check_circle'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '비밀번호 변경 중 오류가 발생했습니다',
      icon: 'error'
    });
  }
};

const toggleTwoFactor = (enabled: boolean) => {
  if (enabled) {
    $q.dialog({
      title: '2단계 인증 설정',
      message: 'OTP 앱을 통해 2단계 인증을 설정하시겠습니까?',
      cancel: true
    }).onOk(() => {
      $q.notify({
        type: 'positive',
        message: '2단계 인증이 활성화되었습니다',
        icon: 'verified_user'
      });
    }).onCancel(() => {
      securitySettings.value.twoFactorEnabled = false;
    });
  } else {
    $q.notify({
      type: 'info',
      message: '2단계 인증이 비활성화되었습니다',
      icon: 'info'
    });
  }
};

const saveNotificationSettings = async () => {
  isSavingNotifications.value = true;
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    $q.notify({
      type: 'positive',
      message: '알림 설정이 저장되었습니다',
      icon: 'notifications'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '알림 설정 저장 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isSavingNotifications.value = false;
  }
};

const searchAddress = () => {
  $q.notify({
    type: 'info',
    message: '주소 검색 기능은 준비 중입니다',
    icon: 'search'
  });
};

const uploadLicense = () => {
  showUploadDialog.value = true;
};

const deleteLicense = () => {
  $q.dialog({
    title: '사업자등록증 삭제',
    message: '사업자등록증을 삭제하시겠습니까?',
    cancel: true,
    color: 'negative'
  }).onOk(() => {
    profileData.value.businessLicense = '';
    $q.notify({
      type: 'positive',
      message: '사업자등록증이 삭제되었습니다',
      icon: 'delete'
    });
  });
};

const handleFileUpload = async () => {
  if (!uploadFile.value) return;

  isUploading.value = true;
  try {
    // 파일 업로드 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 실제로는 서버 업로드 후 URL을 받아옴
    profileData.value.businessLicense = URL.createObjectURL(uploadFile.value);

    showUploadDialog.value = false;
    uploadFile.value = null;

    $q.notify({
      type: 'positive',
      message: '사업자등록증이 업로드되었습니다',
      icon: 'cloud_done'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '파일 업로드 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isUploading.value = false;
  }
};

const onRejected = () => {
  $q.notify({
    type: 'negative',
    message: '파일 크기가 너무 크거나 지원하지 않는 형식입니다',
    icon: 'warning'
  });
};

const requestVerification = () => {
  $q.dialog({
    title: '사업자 인증 요청',
    message: '사업자등록증과 함께 인증을 요청하시겠습니까?',
    cancel: true
  }).onOk(() => {
    $q.notify({
      type: 'info',
      message: '인증 요청이 접수되었습니다. 영업일 기준 1-2일 내 처리됩니다',
      icon: 'pending'
    });
  });
};

const setDefaultPayment = (id: number) => {
  paymentMethods.value.forEach(method => {
    method.isDefault = method.id === id;
  });
  $q.notify({
    type: 'positive',
    message: '기본 결제 수단이 변경되었습니다',
    icon: 'payment'
  });
};

const editPaymentMethod = (method: any) => {
  $q.notify({
    type: 'info',
    message: '결제 수단 편집 기능은 준비 중입니다',
    icon: 'edit'
  });
};

const deletePaymentMethod = (id: number) => {
  const method = paymentMethods.value.find(m => m.id === id);
  if (method?.isDefault) {
    $q.notify({
      type: 'negative',
      message: '기본 결제 수단은 삭제할 수 없습니다',
      icon: 'error'
    });
    return;
  }

  $q.dialog({
    title: '결제 수단 삭제',
    message: '이 결제 수단을 삭제하시겠습니까?',
    cancel: true,
    color: 'negative'
  }).onOk(() => {
    const index = paymentMethods.value.findIndex(m => m.id === id);
    if (index > -1) {
      paymentMethods.value.splice(index, 1);
      $q.notify({
        type: 'positive',
        message: '결제 수단이 삭제되었습니다',
        icon: 'delete'
      });
    }
  });
};

const addPaymentMethod = () => {
  $q.notify({
    type: 'info',
    message: '결제 수단 추가 기능은 준비 중입니다',
    icon: 'add'
  });
};

const saveInvoiceSettings = () => {
  $q.notify({
    type: 'positive',
    message: '세금계산서 설정이 저장되었습니다',
    icon: 'receipt'
  });
};

const goToOrders = () => {
  router.push('/orders');
};

const goToInvoices = () => {
  router.push('/invoices');
};

const goToSupport = () => {
  router.push('/support');
};

const downloadBusinessCert = () => {
  $q.notify({
    type: 'info',
    message: '사업자등록증 다운로드를 시작합니다',
    icon: 'download'
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

const formatDateTime = (date: Date) => {
  return date.toLocaleString('ko-KR');
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('ko-KR') + '원';
};

// 생명주기
onMounted(() => {
  // 인증 상태 확인
  if (!authStore.isAuthenticated) {
    router.push('/auth/login');
    return;
  }

  // 사용자 정보로 프로필 초기화
  if (authStore.user) {
    profileData.value = {
      ...profileData.value,
      businessName: authStore.user.businessName,
      businessNumber: authStore.user.businessNumber,
      contactName: authStore.user.contactName,
      email: authStore.user.email,
      contactPhone: authStore.user.contactPhone
    };
  }
});
</script>

<style scoped>
.profile-page {
  background: #fafafa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.profile-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.security-section {
  padding: 1.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.security-section:last-child {
  border-bottom: none;
}

.notification-groups .notification-group {
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.notification-groups .notification-group:last-child {
  border-bottom: none;
}

.payment-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.payment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.primary-payment {
  border: 2px solid #1976d2;
}

.add-payment-card {
  border: 2px dashed #ccc;
  transition: border-color 0.2s ease;
}

.add-payment-card:hover {
  border-color: #1976d2;
}

.license-card,
.license-upload-card {
  height: 240px;
}

.account-status-card,
.usage-stats-card,
.quick-actions-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1976d2;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 0 8px;
  }

  .profile-actions {
    flex-direction: column;
    gap: 4px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .text-h4 {
    font-size: 1.5rem;
  }
}

/* 탭 스타일 */
:deep(.q-tab-panels) {
  background: transparent;
}

:deep(.q-tab-panel) {
  padding: 0;
}

/* 애니메이션 */
.profile-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 인증 상태 색상 */
.verification-chip.verified {
  background: #4caf50;
}

.verification-chip.pending {
  background: #ff9800;
}

/* 입력 필드 스타일 */
:deep(.q-field--filled .q-field__control) {
  background: rgba(0, 0, 0, 0.04);
}

:deep(.q-field--readonly) {
  opacity: 0.8;
}
</style>
