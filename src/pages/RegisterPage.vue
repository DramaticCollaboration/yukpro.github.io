<template>
  <q-page class="business-detail-page">
    <!-- 헤더 -->
    <div class="bg-primary text-white q-py-xl">
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
            <div class="text-h3 text-weight-bold">🥩 Yukpro</div>
            <div class="text-h5 q-mt-sm">담당자 정보 입력</div>
            <div class="text-subtitle1 opacity-80 q-mt-xs">
              본인인증 후 담당자 정보를 입력해주세요
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 진행 상황 표시 -->
    <div class="bg-grey-1 q-py-md">
      <div class="container">
        <q-stepper
          v-model="currentStep"
          color="primary"
          flat
          class="bg-transparent"
        >
          <q-step
            :name="1"
            title="사업자등록증"
            caption="OCR 또는 수동 입력"
            icon="document_scanner"
            done
            :header-nav="false"
          />
          <q-step
            :name="2"
            title="담당자 정보"
            caption="본인인증 및 기본정보"
            icon="person_add"
            :done="currentStep > 2"
            :header-nav="false"
          />
          <q-step
            :name="3"
            title="완료"
            caption="가입 완료"
            icon="check_circle"
            :done="currentStep > 3"
            :header-nav="false"
          />
        </q-stepper>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="container q-py-xl">
      <div class="row justify-center">
        <div class="col-12 col-md-8 col-lg-6">
          <!-- 사업자 정보 확인 -->
          <q-card class="business-info-card q-mb-lg" flat bordered>
            <q-card-section class="bg-green-1">
              <div class="text-center">
                <q-icon name="check_circle" size="48px" color="green" class="q-mb-md" />
                <div class="text-h5 text-weight-bold text-green-8">사업자 인증 완료</div>
                <div class="text-body1 text-grey-7 q-mt-sm">
                  인증된 사업자 정보입니다
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row q-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    :model-value="businessInfo.businessNumber"
                    label="사업자등록번호"
                    readonly
                    filled
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    :model-value="businessInfo.businessName"
                    label="상호명"
                    readonly
                    filled
                  />
                </div>
                <div class="col-12">
                  <q-input
                    :model-value="businessInfo.representativeName"
                    label="대표자명"
                    readonly
                    filled
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- 담당자 정보 입력 -->
          <q-card class="contact-info-card" flat bordered>
            <q-card-section class="bg-blue-1">
              <div class="text-center">
                <q-icon name="person_add" size="48px" color="primary" class="q-mb-md" />
                <div class="text-h5 text-weight-bold text-primary">담당자 정보</div>
                <div class="text-body1 text-grey-7 q-mt-sm">
                  서비스 이용을 위한 담당자 정보를 입력해주세요
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <form @submit.prevent="submitContactInfo">
                <!-- 본인인증 -->
                <div class="phone-verification-section q-mb-xl">
                  <div class="text-h6 text-weight-bold q-mb-md">
                    <q-icon name="verified_user" class="q-mr-sm" />
                    본인인증 (필수)
                  </div>

                  <q-banner class="bg-orange-1 text-orange-8 q-mb-md">
                    <template v-slot:avatar>
                      <q-icon name="security" />
                    </template>
                    안전한 서비스 이용을 위해 휴대폰 본인인증이 필요합니다.
                  </q-banner>

                  <div class="row q-gutter-md">
                    <q-input
                      v-model="contactForm.phone"
                      label="휴대폰 번호 *"
                      mask="###-####-####"
                      outlined
                      :rules="[val => !!val || '휴대폰 번호를 입력해주세요']"
                      :readonly="phoneVerified"
                      class="col"
                    >
                      <template v-slot:prepend>
                        <q-icon name="smartphone" />
                      </template>
                    </q-input>
                    <q-btn
                      v-if="!phoneVerified"
                      color="primary"
                      :label="verificationSent ? '재전송' : '인증번호 발송'"
                      :icon="verificationSent ? 'refresh' : 'send'"
                      @click="sendVerificationCode"
                      :loading="isSendingCode"
                      :disable="!contactForm.phone || contactForm.phone.length !== 13"
                    />
                    <q-chip
                      v-else
                      color="green"
                      text-color="white"
                      icon="check_circle"
                    >
                      인증완료
                    </q-chip>
                  </div>

                  <!-- 인증번호 입력 -->
                  <div v-if="verificationSent && !phoneVerified" class="verification-input q-mt-md">
                    <div class="row q-gutter-md">
                      <q-input
                        v-model="verificationCode"
                        label="인증번호 *"
                        outlined
                        maxlength="6"
                        :rules="[val => !!val || '인증번호를 입력해주세요']"
                        class="col"
                        ref="verificationInput"
                      >
                        <template v-slot:prepend>
                          <q-icon name="key" />
                        </template>
                        <template v-slot:hint>
                          <div class="row items-center">
                            <span class="q-mr-sm">남은시간:</span>
                            <span class="text-red text-weight-bold">{{ formatTime(remainingTime) }}</span>
                          </div>
                        </template>
                      </q-input>
                      <q-btn
                        color="primary"
                        label="인증 확인"
                        icon="check"
                        @click="verifyCode"
                        :loading="isVerifyingCode"
                        :disable="!verificationCode || verificationCode.length !== 6"
                      />
                    </div>
                  </div>
                </div>

                <!-- 기본 정보 -->
                <div class="basic-info-section q-mb-xl">
                  <div class="text-h6 text-weight-bold q-mb-md">
                    <q-icon name="person" class="q-mr-sm" />
                    기본 정보
                  </div>

                  <div class="row q-gutter-md">
                    <q-input
                      v-model="contactForm.name"
                      label="담당자명 *"
                      outlined
                      :rules="[val => !!val || '담당자명을 입력해주세요']"
                      class="col-12 col-md-6"
                    />
                    <q-select
                      v-model="contactForm.position"
                      :options="positionOptions"
                      label="직책 *"
                      outlined
                      :rules="[val => !!val || '직책을 선택해주세요']"
                      class="col-12 col-md-6"
                      emit-value
                      map-options
                    />
                    <q-input
                      v-model="contactForm.department"
                      label="부서"
                      outlined
                      class="col-12 col-md-6"
                    />
                    <q-input
                      v-model="contactForm.workPhone"
                      label="직장 전화번호"
                      outlined
                      mask="##-###-####"
                      class="col-12 col-md-6"
                    />
                  </div>
                </div>

                <!-- 계정 정보 -->
                <div class="account-info-section q-mb-xl">
                  <div class="text-h6 text-weight-bold q-mb-md">
                    <q-icon name="email" class="q-mr-sm" />
                    계정 정보
                  </div>

                  <div class="row q-gutter-md">
                    <q-input
                      v-model="contactForm.email"
                      label="이메일 주소 *"
                      type="email"
                      outlined
                      :rules="[validateEmail]"
                      class="col-12"
                    >
                      <template v-slot:hint>
                        로그인 ID로 사용됩니다
                      </template>
                    </q-input>
                    <q-input
                      v-model="contactForm.password"
                      label="비밀번호 *"
                      :type="showPassword ? 'text' : 'password'"
                      outlined
                      :rules="[validatePassword]"
                      class="col-12 col-md-6"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="showPassword ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="showPassword = !showPassword"
                        />
                      </template>
                      <template v-slot:hint>
                        8자 이상, 영문/숫자/특수문자 포함
                      </template>
                    </q-input>
                    <q-input
                      v-model="contactForm.confirmPassword"
                      label="비밀번호 확인 *"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      outlined
                      :rules="[validateConfirmPassword]"
                      class="col-12 col-md-6"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="showConfirmPassword = !showConfirmPassword"
                        />
                      </template>
                    </q-input>
                  </div>
                </div>

                <!-- 마케팅 수신 동의 -->
                <div class="marketing-section q-mb-xl">
                  <div class="text-h6 text-weight-bold q-mb-md">
                    <q-icon name="notifications" class="q-mr-sm" />
                    알림 설정
                  </div>

                  <q-list>
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox v-model="contactForm.orderNotification" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>주문/배송 알림</q-item-label>
                        <q-item-label caption>
                          주문 접수, 배송 상태 변경시 SMS/이메일로 알림
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox v-model="contactForm.marketingEmail" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>이메일 마케팅 수신 동의 (선택)</q-item-label>
                        <q-item-label caption>
                          신상품 정보, 할인 혜택, 이벤트 소식을 이메일로 받아보세요
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox v-model="contactForm.marketingSms" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>SMS 마케팅 수신 동의 (선택)</q-item-label>
                        <q-item-label caption>
                          긴급 할인, 재입고 알림 등을 SMS로 받아보세요
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <!-- 약관 동의 -->
                <div class="terms-section q-mb-xl">
                  <div class="text-h6 text-weight-bold q-mb-md">
                    <q-icon name="description" class="q-mr-sm" />
                    약관 동의
                  </div>

                  <q-list>
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          v-model="contactForm.allTermsAgreed"
                          @update:model-value="toggleAllTerms"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold">전체 약관에 동의합니다</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator class="q-my-md" />

                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          v-model="contactForm.serviceTerms"
                          :rules="[val => val || '서비스 이용약관에 동의해주세요']"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>서비스 이용약관 동의 (필수)</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          icon="open_in_new"
                          @click="showTermsDialog('service')"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          v-model="contactForm.privacyTerms"
                          :rules="[val => val || '개인정보처리방침에 동의해주세요']"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>개인정보처리방침 동의 (필수)</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          icon="open_in_new"
                          @click="showTermsDialog('privacy')"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox v-model="contactForm.locationTerms" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>위치기반서비스 이용약관 동의 (선택)</q-item-label>
                        <q-item-label caption>
                          배송지 주변 매장 정보 제공
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          icon="open_in_new"
                          @click="showTermsDialog('location')"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <!-- 가입 완료 버튼 -->
                <div class="text-center">
                  <q-btn
                    type="submit"
                    color="primary"
                    label="가입 완료"
                    icon="check_circle"
                    size="xl"
                    :loading="isSubmitting"
                    :disable="!canSubmit"
                    class="q-px-xl"
                  />
                </div>
              </form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- 약관 다이얼로그 -->
    <q-dialog v-model="showTermsModal" :maximized="$q.screen.lt.sm">
      <q-card style="min-width: 600px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ currentTermsTitle }}</div>
        </q-card-section>

        <q-card-section style="max-height: 500px; overflow-y: auto">
          <div v-html="currentTermsContent"></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="닫기" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 가입 완료 다이얼로그 -->
    <q-dialog v-model="showSuccessModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="text-center q-py-xl">
          <q-icon name="celebration" size="80px" color="green" class="q-mb-md" />
          <div class="text-h4 text-weight-bold text-green-8 q-mb-md">가입 완료!</div>
          <div class="text-h6 q-mb-sm">Yukpro에 오신 것을 환영합니다</div>
          <div class="text-body1 text-grey-7">
            이제 5kg 단위로 신선한 축산물을 주문하실 수 있습니다
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-xl">
          <q-btn
            color="primary"
            label="메인으로 이동"
            icon="home"
            size="lg"
            @click="goToMain"
            class="q-px-xl"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// 반응형 데이터
const currentStep = ref(2)
const phoneVerified = ref(false)
const verificationSent = ref(false)
const verificationCode = ref('')
const remainingTime = ref(180) // 3분
const isSendingCode = ref(false)
const isVerifyingCode = ref(false)
const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showTermsModal = ref(false)
const showSuccessModal = ref(false)
const currentTermsType = ref('')

let verificationTimer: NodeJS.Timeout | null = null

// 사업자 정보 (이전 단계에서 가져옴)
const businessInfo = reactive({
  businessNumber: '',
  businessName: '',
  representativeName: '',
  businessAddress: ''
})

// 담당자 정보 폼
const contactForm = reactive({
  phone: '',
  name: '',
  position: '',
  department: '',
  workPhone: '',
  email: '',
  password: '',
  confirmPassword: '',
  orderNotification: true,
  marketingEmail: false,
  marketingSms: false,
  allTermsAgreed: false,
  serviceTerms: false,
  privacyTerms: false,
  locationTerms: false
})

// 옵션들
const positionOptions = [
  { label: '대표', value: 'ceo' },
  { label: '사장', value: 'owner' },
  { label: '점장', value: 'manager' },
  { label: '팀장', value: 'team_leader' },
  { label: '주임', value: 'supervisor' },
  { label: '직원', value: 'staff' },
  { label: '기타', value: 'other' }
]

// computed
const canSubmit = computed(() => {
  return phoneVerified.value &&
    contactForm.name &&
    contactForm.position &&
    contactForm.email &&
    contactForm.password &&
    contactForm.confirmPassword &&
    contactForm.password === contactForm.confirmPassword &&
    contactForm.serviceTerms &&
    contactForm.privacyTerms
})

const currentTermsTitle = computed(() => {
  switch (currentTermsType.value) {
    case 'service': return '서비스 이용약관'
    case 'privacy': return '개인정보처리방침'
    case 'location': return '위치기반서비스 이용약관'
    default: return ''
  }
})

const currentTermsContent = computed(() => {
  switch (currentTermsType.value) {
    case 'service':
      return `
        <h3>제1조 (목적)</h3>
        <p>이 약관은 Yukpro가 제공하는 B2B 축산물 유통 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>

        <h3>제2조 (정의)</h3>
        <p>1. "서비스"라 함은 Yukpro가 제공하는 모든 서비스를 의미합니다.</p>
        <p>2. "회원"이라 함은 이 약관에 따라 회사와 이용계약을 체결한 자를 의미합니다.</p>

        <h3>제3조 (약관의 게시와 개정)</h3>
        <p>회사는 약관을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
      `
    case 'privacy':
      return `
        <h3>개인정보 수집 및 이용</h3>
        <p><strong>수집 목적:</strong> 서비스 제공, 회원관리, 고객지원</p>
        <p><strong>수집 항목:</strong> 사업자등록번호, 상호명, 담당자 정보, 연락처</p>
        <p><strong>보유 기간:</strong> 회원탈퇴 후 5년 (관련 법령에 따라)</p>

        <h3>개인정보 제공</h3>
        <p>회사는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다.</p>
      `
    case 'location':
      return `
        <h3>위치정보 이용 및 보호</h3>
        <p>배송지 주변 매장 정보 제공을 위해 위치정보를 수집할 수 있습니다.</p>
        <p>위치정보는 서비스 제공 목적으로만 이용되며, 동의 철회 시 즉시 파기됩니다.</p>
      `
    default:
      return ''
  }
})

// 메소드
const goBack = () => {
  router.push('/auth/register')
}

const sendVerificationCode = async () => {
  if (!contactForm.phone) return

  isSendingCode.value = true

  try {
    // SMS 발송 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))

    verificationSent.value = true
    remainingTime.value = 180

    // 타이머 시작
    startTimer()

    $q.notify({
      type: 'positive',
      message: '인증번호가 발송되었습니다',
      caption: `${contactForm.phone}로 전송된 6자리 번호를 입력해주세요`
    })

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '인증번호 발송에 실패했습니다'
    })
  } finally {
    isSendingCode.value = false
  }
}

const verifyCode = async () => {
  if (!verificationCode.value) return

  isVerifyingCode.value = true

  try {
    // 인증 확인 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 실제로는 서버에서 인증번호 검증
    if (verificationCode.value === '123456') {
      phoneVerified.value = true
      stopTimer()

      $q.notify({
        type: 'positive',
        message: '본인인증이 완료되었습니다'
      })
    } else {
      $q.notify({
        type: 'negative',
        message: '잘못된 인증번호입니다'
      })
    }

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '인증 확인에 실패했습니다'
    })
  } finally {
    isVerifyingCode.value = false
  }
}

const startTimer = () => {
  verificationTimer = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      stopTimer()
      verificationSent.value = false
      $q.notify({
        type: 'warning',
        message: '인증시간이 만료되었습니다. 다시 요청해주세요.'
      })
    }
  }, 1000)
}

const stopTimer = () => {
  if (verificationTimer) {
    clearInterval(verificationTimer)
    verificationTimer = null
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const validateEmail = (val: string) => {
  if (!val) return '이메일 주소를 입력해주세요'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(val)) return '올바른 이메일 형식을 입력해주세요'
  return true
}

const validatePassword = (val: string) => {
  if (!val) return '비밀번호를 입력해주세요'
  if (val.length < 8) return '비밀번호는 8자 이상이어야 합니다'

  const hasLetter = /[a-zA-Z]/.test(val)
  const hasNumber = /\d/.test(val)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val)

  if (!hasLetter || !hasNumber || !hasSpecial) {
    return '영문, 숫자, 특수문자를 모두 포함해야 합니다'
  }

  return true
}

const validateConfirmPassword = (val: string) => {
  if (!val) return '비밀번호 확인을 입력해주세요'
  if (val !== contactForm.password) return '비밀번호가 일치하지 않습니다'
  return true
}

const toggleAllTerms = (value: boolean) => {
  contactForm.serviceTerms = value
  contactForm.privacyTerms = value
  contactForm.locationTerms = value
}

const showTermsDialog = (type: string) => {
  currentTermsType.value = type
  showTermsModal.value = true
}

const submitContactInfo = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true

  try {
    // 회원가입 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 실제로는 서버에 사업자 정보와 담당자 정보를 함께 전송
    const registrationData = {
      business: businessInfo,
      contact: contactForm
    }

    console.log('Registration data:', registrationData)

    // 가입 완료
    currentStep.value = 3
    showSuccessModal.value = true

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '회원가입에 실패했습니다. 다시 시도해주세요.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const goToMain = () => {
  router.push('/')
}

// 생명주기
onMounted(() => {
  // 이전 단계에서 저장된 사업자 정보 불러오기
  const savedBusinessInfo = sessionStorage.getItem('businessInfo')
  if (savedBusinessInfo) {
    Object.assign(businessInfo, JSON.parse(savedBusinessInfo))
  } else {
    // 사업자 정보가 없으면 첫 페이지로 리다이렉트
    router.push('/auth/register')
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style lang="scss" scoped>
.business-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.business-info-card,
.contact-info-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.phone-verification-section {
  .verification-input {
    animation: slideDown 0.3s ease-out;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.basic-info-section,
.account-info-section,
.marketing-section,
.terms-section {
  .q-input,
  .q-select {
    margin-bottom: 16px;
  }
}

.terms-section {
  .q-item {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    background: rgba(255, 255, 255, 0.7);
    transition: background-color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 1);
    }
  }
}

@media (max-width: 600px) {
  .container {
    padding: 0 8px;
  }

  .row.q-gutter-md > * {
    margin-bottom: 16px;
  }
}
</style>
