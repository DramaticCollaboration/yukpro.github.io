<template>
  <q-page class="notification-settings-page">
    <!-- 헤더 -->
    <div class="bg-primary text-white q-py-lg">
      <div class="container">
        <div class="row items-center">
          <q-btn
            flat
            round
            icon="arrow_back"
            color="white"
            @click="$router.back()"
            class="q-mr-md"
          />
          <div class="col">
            <div class="text-h4 text-weight-bold">알림 설정</div>
            <div class="text-subtitle1 opacity-80">
              주문, 배송, 마케팅 알림 관리
            </div>
          </div>
          <q-btn
            flat
            round
            icon="help_outline"
            color="white"
            @click="showHelp = true"
          />
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="container q-py-lg">
      <div class="row q-gutter-lg">
        <!-- 설정 내용 -->
        <div class="col-12 col-md-8">
          <!-- 알림 권한 상태 -->
          <q-card class="notification-card q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md text-primary">
                <q-icon name="notifications_active" class="q-mr-sm" />
                알림 권한 상태
              </div>

              <div class="permission-status">
                <div class="row items-center q-gutter-md">
                  <div class="col">
                    <div class="row items-center">
                      <q-icon
                        :name="notificationPermission === 'granted' ? 'check_circle' : 'error'"
                        :color="notificationPermission === 'granted' ? 'green' : 'red'"
                        size="md"
                        class="q-mr-sm"
                      />
                      <div>
                        <div class="text-subtitle1 text-weight-bold">
                          브라우저 푸시 알림
                        </div>
                        <div class="text-caption text-grey-6">
                          {{ getPermissionText() }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="notificationPermission !== 'granted'">
                    <q-btn
                      color="primary"
                      label="권한 요청"
                      icon="notifications"
                      @click="requestNotificationPermission"
                      :loading="isRequestingPermission"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- 알림 설정 그룹들 -->
          <div class="notification-groups">
            <q-card
              v-for="group in notificationGroups"
              :key="group.category"
              class="notification-card q-mb-lg"
            >
              <q-card-section>
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-h6 text-weight-bold text-primary">
                    <q-icon :name="group.icon" class="q-mr-sm" />
                    {{ group.title }}
                  </div>
                  <q-toggle
                    :model-value="isGroupEnabled(group.category)"
                    @update:model-value="(val) => toggleGroup(group.category, val)"
                    color="primary"
                    size="lg"
                  />
                </div>

                <div class="text-body2 text-grey-6 q-mb-lg">
                  {{ group.description }}
                </div>

                <q-list :class="{ 'disabled': !isGroupEnabled(group.category) }">
                  <q-item
                    v-for="setting in group.settings"
                    :key="setting.key"
                    class="notification-item"
                  >
                    <q-item-section>
                      <q-item-label class="text-weight-medium">
                        {{ setting.title }}
                      </q-item-label>
                      <q-item-label caption lines="2">
                        {{ setting.description }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="notification-methods">
                        <!-- 이메일 -->
                        <div class="method-row">
                          <q-icon name="email" color="blue" size="sm" class="q-mr-sm" />
                          <span class="method-label">이메일</span>
                          <q-toggle
                            v-model="setting.email"
                            color="blue"
                            size="sm"
                            :disable="!isGroupEnabled(group.category)"
                            @update:model-value="saveSettings"
                          />
                        </div>
                        <!-- SMS -->
                        <div class="method-row">
                          <q-icon name="sms" color="orange" size="sm" class="q-mr-sm" />
                          <span class="method-label">SMS</span>
                          <q-toggle
                            v-model="setting.sms"
                            color="orange"
                            size="sm"
                            :disable="!isGroupEnabled(group.category)"
                            @update:model-value="saveSettings"
                          />
                        </div>
                        <!-- 앱 푸시 -->
                        <div class="method-row">
                          <q-icon name="notifications" color="green" size="sm" class="q-mr-sm" />
                          <span class="method-label">앱 알림</span>
                          <q-toggle
                            v-model="setting.push"
                            color="green"
                            size="sm"
                            :disable="!isGroupEnabled(group.category) || notificationPermission !== 'granted'"
                            @update:model-value="saveSettings"
                          />
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- 알림 시간 설정 -->
          <q-card class="notification-card q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md text-primary">
                <q-icon name="schedule" class="q-mr-sm" />
                알림 시간 설정
              </div>

              <div class="time-settings">
                <div class="row q-gutter-md q-mb-md">
                  <div class="col-12 col-sm-6">
                    <q-toggle
                      v-model="timeSettings.doNotDisturb"
                      label="방해 금지 시간 사용"
                      color="primary"
                      class="q-mb-md"
                    />

                    <div v-if="timeSettings.doNotDisturb" class="dnd-settings">
                      <div class="row q-gutter-sm items-center">
                        <q-input
                          v-model="timeSettings.dndStart"
                          label="시작 시간"
                          type="time"
                          outlined
                          dense
                          class="col"
                        />
                        <span class="text-grey-6">~</span>
                        <q-input
                          v-model="timeSettings.dndEnd"
                          label="종료 시간"
                          type="time"
                          outlined
                          dense
                          class="col"
                        />
                      </div>
                      <div class="text-caption text-grey-6 q-mt-sm">
                        설정된 시간 동안은 앱 푸시 알림이 전송되지 않습니다
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-sm-6">
                    <div class="text-subtitle2 text-weight-medium q-mb-sm">
                      주간 알림 요일
                    </div>
                    <div class="weekday-settings">
                      <q-btn-toggle
                        v-model="timeSettings.weekdays"
                        multiple
                        :options="weekdayOptions"
                        color="primary"
                        text-color="white"
                        toggle-color="grey-4"
                        toggle-text-color="grey-8"
                        size="sm"
                        class="full-width"
                      />
                    </div>
                    <div class="text-caption text-grey-6 q-mt-sm">
                      선택된 요일에만 마케팅 알림을 받습니다
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- 알림 히스토리 -->
          <q-card class="notification-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6 text-weight-bold text-primary">
                  <q-icon name="history" class="q-mr-sm" />
                  최근 알림 기록
                </div>
                <q-btn
                  flat
                  label="전체 보기"
                  color="primary"
                  @click="showAllNotifications"
                  size="sm"
                />
              </div>

              <q-list>
                <q-item
                  v-for="notification in recentNotifications"
                  :key="notification.id"
                  class="notification-history-item"
                >
                  <q-item-section avatar>
                    <q-avatar
                      :icon="getNotificationIcon(notification.type)"
                      :color="getNotificationColor(notification.type)"
                      text-color="white"
                      size="40px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ notification.title }}
                    </q-item-label>
                    <q-item-label caption lines="2">
                      {{ notification.message }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-right">
                      <div class="text-caption text-grey-6">
                        {{ formatDateTime(notification.timestamp) }}
                      </div>
                      <div class="notification-methods-sent q-mt-xs">
                        <q-icon
                          v-if="notification.sentVia.includes('email')"
                          name="email"
                          size="xs"
                          color="blue"
                          class="q-mr-xs"
                        />
                        <q-icon
                          v-if="notification.sentVia.includes('sms')"
                          name="sms"
                          size="xs"
                          color="orange"
                          class="q-mr-xs"
                        />
                        <q-icon
                          v-if="notification.sentVia.includes('push')"
                          name="notifications"
                          size="xs"
                          color="green"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>

              <div v-if="recentNotifications.length === 0" class="text-center q-py-lg">
                <q-icon name="notifications_none" size="48px" color="grey-4" />
                <div class="text-body2 text-grey-6 q-mt-sm">
                  최근 알림 기록이 없습니다
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 사이드바 -->
        <div class="col-12 col-md-4">
          <!-- 알림 테스트 -->
          <q-card class="test-card q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md text-primary">
                <q-icon name="bug_report" class="q-mr-sm" />
                알림 테스트
              </div>

              <div class="test-buttons">
                <q-btn
                  outline
                  color="blue"
                  label="이메일 테스트"
                  icon="email"
                  class="full-width q-mb-sm"
                  @click="testNotification('email')"
                  :loading="testingNotifications.email"
                />
                <q-btn
                  outline
                  color="orange"
                  label="SMS 테스트"
                  icon="sms"
                  class="full-width q-mb-sm"
                  @click="testNotification('sms')"
                  :loading="testingNotifications.sms"
                />
                <q-btn
                  outline
                  color="green"
                  label="푸시 테스트"
                  icon="notifications"
                  class="full-width"
                  @click="testNotification('push')"
                  :loading="testingNotifications.push"
                  :disable="notificationPermission !== 'granted'"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- 통계 -->
          <q-card class="stats-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md text-primary">
                <q-icon name="analytics" class="q-mr-sm" />
                알림 통계
              </div>

              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number text-primary">{{ stats.totalSent }}</div>
                  <div class="stat-label">이번 달 발송</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number text-green">{{ stats.delivered }}</div>
                  <div class="stat-label">정상 도달</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number text-orange">{{ stats.opened }}</div>
                  <div class="stat-label">열람</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number text-red">{{ stats.failed }}</div>
                  <div class="stat-label">실패</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- 도움말 다이얼로그 -->
    <q-dialog v-model="showHelp">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">알림 설정 도움말</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="help-content">
            <div class="help-item q-mb-md">
              <div class="text-weight-bold text-blue q-mb-xs">
                <q-icon name="email" class="q-mr-xs" />
                이메일 알림
              </div>
              <div class="text-body2">
                등록된 이메일 주소로 알림을 발송합니다. 스팸함을 확인해 주세요.
              </div>
            </div>

            <div class="help-item q-mb-md">
              <div class="text-weight-bold text-orange q-mb-xs">
                <q-icon name="sms" class="q-mr-xs" />
                SMS 알림
              </div>
              <div class="text-body2">
                휴대폰 번호로 문자 메시지를 발송합니다. 추가 요금이 발생할 수 있습니다.
              </div>
            </div>

            <div class="help-item">
              <div class="text-weight-bold text-green q-mb-xs">
                <q-icon name="notifications" class="q-mr-xs" />
                앱 푸시 알림
              </div>
              <div class="text-body2">
                브라우저 또는 앱에서 즉시 알림을 받습니다. 브라우저 권한 허용이 필요합니다.
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="확인" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 저장 완료 스낵바 -->
    <q-inner-loading :showing="isSaving">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// 반응형 데이터
const showHelp = ref(false)
const isSaving = ref(false)
const isRequestingPermission = ref(false)
const notificationPermission = ref<NotificationPermission>('default')

const testingNotifications = reactive({
  email: false,
  sms: false,
  push: false
})

const timeSettings = reactive({
  doNotDisturb: false,
  dndStart: '22:00',
  dndEnd: '08:00',
  weekdays: ['mon', 'tue', 'wed', 'thu', 'fri']
})

const weekdayOptions = [
  { label: '월', value: 'mon' },
  { label: '화', value: 'tue' },
  { label: '수', value: 'wed' },
  { label: '목', value: 'thu' },
  { label: '금', value: 'fri' },
  { label: '토', value: 'sat' },
  { label: '일', value: 'sun' }
]

// 알림 설정 그룹
const notificationGroups = reactive([
  {
    category: 'orders',
    title: '주문 및 결제',
    description: '주문 상태 변경, 결제 완료, 취소 등 주문 관련 알림',
    icon: 'shopping_cart',
    settings: [
      {
        key: 'order_confirmed',
        title: '주문 확인',
        description: '주문이 접수되어 확인되었을 때',
        email: true,
        sms: true,
        push: true
      },
      {
        key: 'payment_completed',
        title: '결제 완료',
        description: '결제가 성공적으로 완료되었을 때',
        email: true,
        sms: false,
        push: true
      },
      {
        key: 'order_cancelled',
        title: '주문 취소',
        description: '주문이 취소되었을 때',
        email: true,
        sms: true,
        push: true
      },
      {
        key: 'refund_processed',
        title: '환불 처리',
        description: '환불이 완료되었을 때',
        email: true,
        sms: true,
        push: false
      }
    ]
  },
  {
    category: 'shipping',
    title: '배송 정보',
    description: '상품 발송, 배송 중, 배송 완료 등 배송 관련 알림',
    icon: 'local_shipping',
    settings: [
      {
        key: 'shipping_started',
        title: '배송 시작',
        description: '상품이 발송되어 배송이 시작되었을 때',
        email: true,
        sms: true,
        push: true
      },
      {
        key: 'out_for_delivery',
        title: '배송 중',
        description: '상품이 배송 중일 때',
        email: false,
        sms: true,
        push: true
      },
      {
        key: 'delivered',
        title: '배송 완료',
        description: '상품이 배송 완료되었을 때',
        email: true,
        sms: true,
        push: true
      },
      {
        key: 'delivery_failed',
        title: '배송 실패',
        description: '배송이 실패했을 때',
        email: true,
        sms: true,
        push: true
      }
    ]
  },
  {
    category: 'inventory',
    title: '재고 및 상품',
    description: '재입고, 가격 변동, 할인 등 상품 관련 알림',
    icon: 'inventory',
    settings: [
      {
        key: 'restock_alert',
        title: '재입고 알림',
        description: '관심 상품이 재입고되었을 때',
        email: true,
        sms: false,
        push: true
      },
      {
        key: 'price_drop',
        title: '가격 인하',
        description: '관심 상품의 가격이 인하되었을 때',
        email: true,
        sms: false,
        push: true
      },
      {
        key: 'special_offer',
        title: '특가 혜택',
        description: '특별 할인이나 프로모션 시작 시',
        email: true,
        sms: false,
        push: false
      }
    ]
  },
  {
    category: 'account',
    title: '계정 보안',
    description: '로그인, 비밀번호 변경 등 계정 보안 관련 알림',
    icon: 'security',
    settings: [
      {
        key: 'login_alert',
        title: '새로운 로그인',
        description: '새 기기에서 로그인했을 때',
        email: true,
        sms: true,
        push: false
      },
      {
        key: 'password_changed',
        title: '비밀번호 변경',
        description: '비밀번호가 변경되었을 때',
        email: true,
        sms: true,
        push: true
      },
      {
        key: 'suspicious_activity',
        title: '의심스러운 활동',
        description: '계정에서 의심스러운 활동이 감지되었을 때',
        email: true,
        sms: true,
        push: true
      }
    ]
  },
  {
    category: 'marketing',
    title: '마케팅 및 혜택',
    description: '신상품, 이벤트, 쿠폰 등 마케팅 관련 알림',
    icon: 'campaign',
    settings: [
      {
        key: 'new_products',
        title: '신상품 소식',
        description: '새로운 상품이 등록되었을 때',
        email: true,
        sms: false,
        push: false
      },
      {
        key: 'events',
        title: '이벤트 및 프로모션',
        description: '특별 이벤트나 프로모션 정보',
        email: true,
        sms: false,
        push: false
      },
      {
        key: 'coupons',
        title: '쿠폰 및 할인',
        description: '새로운 쿠폰이 발급되었을 때',
        email: true,
        sms: false,
        push: false
      },
      {
        key: 'newsletter',
        title: '뉴스레터',
        description: '주간/월간 뉴스레터',
        email: true,
        sms: false,
        push: false
      }
    ]
  }
])

// 최근 알림 기록
const recentNotifications = ref([
  {
    id: 1,
    type: 'order',
    title: '주문이 확인되었습니다',
    message: '주문번호 YK20240120001이 성공적으로 접수되었습니다.',
    timestamp: new Date('2024-01-20T10:30:00'),
    sentVia: ['email', 'push']
  },
  {
    id: 2,
    type: 'shipping',
    title: '상품이 발송되었습니다',
    message: '주문하신 소고기가 발송되어 내일 도착 예정입니다.',
    timestamp: new Date('2024-01-19T15:45:00'),
    sentVia: ['email', 'sms', 'push']
  },
  {
    id: 3,
    type: 'marketing',
    title: '신선한 돼지고기 특가 행사',
    message: '프리미엄 돼지고기 20% 할인! 오늘만 특가 제공',
    timestamp: new Date('2024-01-18T09:00:00'),
    sentVia: ['email']
  }
])

// 통계 데이터
const stats = reactive({
  totalSent: 145,
  delivered: 142,
  opened: 98,
  failed: 3
})

// computed
const getPermissionText = () => {
  switch (notificationPermission.value) {
    case 'granted':
      return '알림 권한이 허용되어 있습니다'
    case 'denied':
      return '알림 권한이 거부되어 있습니다'
    default:
      return '알림 권한을 요청해 주세요'
  }
}

// 그룹 활성화 상태 확인
const isGroupEnabled = (category: string) => {
  const group = notificationGroups.find(g => g.category === category)
  if (!group) return false
  return group.settings.some(s => s.email || s.sms || s.push)
}

// 메소드
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    $q.notify({
      type: 'negative',
      message: '이 브라우저는 알림 기능을 지원하지 않습니다'
    })
    return
  }

  isRequestingPermission.value = true
  try {
    const permission = await Notification.requestPermission()
    notificationPermission.value = permission

    if (permission === 'granted') {
      $q.notify({
        type: 'positive',
        message: '알림 권한이 허용되었습니다'
      })
    } else {
      $q.notify({
        type: 'negative',
        message: '알림 권한이 거부되었습니다'
      })
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '권한 요청 중 오류가 발생했습니다'
    })
  } finally {
    isRequestingPermission.value = false
  }
}

const toggleGroup = (category: string, enabled: boolean) => {
  const group = notificationGroups.find(g => g.category === category)
  if (!group) return

  group.settings.forEach(setting => {
    if (!enabled) {
      setting.email = false
      setting.sms = false
      setting.push = false
    } else {
      // 기본값으로 이메일만 활성화
      setting.email = true
      setting.sms = false
      setting.push = notificationPermission.value === 'granted'
    }
  })

  saveSettings()
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000))

    $q.notify({
      type: 'positive',
      message: '알림 설정이 저장되었습니다'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '설정 저장 중 오류가 발생했습니다'
    })
  } finally {
    isSaving.value = false
  }
}

const testNotification = async (type: 'email' | 'sms' | 'push') => {
  testingNotifications[type] = true

  try {
    if (type === 'push' && notificationPermission.value === 'granted') {
      new Notification('육프로 테스트 알림', {
        body: '푸시 알림이 정상적으로 작동합니다!',
        icon: '/icons/icon-192x192.png'
      })
    }

    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000))

    $q.notify({
      type: 'positive',
      message: `${getMethodName(type)} 테스트 알림이 발송되었습니다`
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '테스트 알림 발송에 실패했습니다'
    })
  } finally {
    testingNotifications[type] = false
  }
}

const getMethodName = (type: string) => {
  switch (type) {
    case 'email': return '이메일'
    case 'sms': return 'SMS'
    case 'push': return '푸시'
    default: return ''
  }
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order': return 'shopping_cart'
    case 'shipping': return 'local_shipping'
    case 'marketing': return 'campaign'
    case 'account': return 'security'
    default: return 'notifications'
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'order': return 'blue'
    case 'shipping': return 'green'
    case 'marketing': return 'orange'
    case 'account': return 'red'
    default: return 'grey'
  }
}

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const showAllNotifications = () => {
  // 전체 알림 기록 페이지로 이동
  router.push('/notifications/history')
}

// 생명주기
onMounted(() => {
  if ('Notification' in window) {
    notificationPermission.value = Notification.permission
  }
})
</script>

<style lang="scss" scoped>
.notification-settings-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.notification-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.permission-status {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.notification-item {
  border-radius: 8px;
  margin-bottom: 8px;

  &:hover {
    background: rgba(25, 118, 210, 0.04);
  }
}

.notification-methods {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.method-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.02);
}

.method-label {
  font-size: 12px;
  color: #666;
  margin-left: auto;
  margin-right: 8px;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.time-settings {
  .dnd-settings {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 8px;
  }
}

.weekday-settings {
  .q-btn-toggle {
    .q-btn {
      min-width: 32px;
      font-size: 12px;
    }
  }
}

.notification-history-item {
  border-left: 3px solid transparent;
  margin-bottom: 8px;

  &:hover {
    border-left-color: var(--q-primary);
    background: rgba(25, 118, 210, 0.04);
  }
}

.notification-methods-sent {
  display: flex;
  gap: 4px;
}

.test-card {
  .test-buttons {
    .q-btn {
      justify-content: flex-start;
    }
  }
}

.stats-card {
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .stat-item {
    text-align: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .stat-number {
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
  }

  .stat-label {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }
}

.help-content {
  .help-item {
    padding: 12px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.02);
  }
}

@media (max-width: 600px) {
  .notification-methods {
    min-width: 100px;
  }

  .method-row {
    padding: 2px 4px;
  }

  .method-label {
    font-size: 10px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
