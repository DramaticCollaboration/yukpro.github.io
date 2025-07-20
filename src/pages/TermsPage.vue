<template>
  <q-page class="terms-page">
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
          <div>
            <div class="text-h4 text-weight-bold">이용약관</div>
            <div class="text-subtitle1 opacity-80">
              Yukpro 서비스 이용약관
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 목차 네비게이션 -->
    <div class="bg-grey-1 q-py-md sticky-toc">
      <div class="container">
        <div class="text-subtitle2 text-weight-bold q-mb-sm">목차</div>
        <div class="row q-gutter-xs">
          <q-btn
            v-for="(section, index) in sections"
            :key="section.id"
            dense
            outline
            size="sm"
            :color="activeSection === section.id ? 'primary' : 'grey-7'"
            :label="`${index + 1}. ${section.title}`"
            @click="scrollToSection(section.id)"
          />
        </div>
      </div>
    </div>

    <!-- 약관 내용 -->
    <div class="container q-py-lg">
      <div class="row">
        <!-- 메인 컨텐츠 -->
        <div class="col-12 col-md-8 q-pr-lg">
          <!-- 약관 개요 -->
          <div class="terms-overview q-mb-xl">
            <q-card class="bg-blue-1">
              <q-card-section>
                <div class="row items-center">
                  <q-icon name="info" size="40px" color="primary" />
                  <div class="q-ml-md">
                    <div class="text-h6 text-weight-bold text-primary">
                      약관 안내
                    </div>
                    <div class="text-body2 text-grey-7 q-mt-xs">
                      본 약관은 <strong>2024년 1월 1일</strong>부터 시행되며,
                      Yukpro 서비스 이용 시 동의가 필요합니다.
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 제1조: 목적 -->
          <section id="purpose" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제1조 (목적)
              </h2>
            </div>
            <div class="section-content">
              <p>
                본 약관은 주식회사 Yukpro(이하 "회사")가 운영하는 B2B 축산물 유통 플랫폼
                "Yukpro"(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및
                책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </div>
          </section>

          <!-- 제2조: 정의 -->
          <section id="definitions" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제2조 (정의)
              </h2>
            </div>
            <div class="section-content">
              <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
              <ol class="definition-list">
                <li>
                  <strong>"서비스"</strong>란 회사가 운영하는 B2B 축산물 유통 플랫폼으로,
                  사업자 간 축산물 거래를 중개하는 온라인 서비스를 말합니다.
                </li>
                <li>
                  <strong>"이용자"</strong>란 본 약관에 따라 회사와 서비스 이용계약을 체결하고
                  서비스를 이용하는 사업자를 말합니다.
                </li>
                <li>
                  <strong>"회원"</strong>이란 회사에 개인정보를 제공하여 회원등록을 한 자로서,
                  서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                </li>
                <li>
                  <strong>"사업자등록번호"</strong>란 사업자등록법에 따라 사업자에게 부여되는
                  고유번호로, 서비스 이용을 위한 필수 인증정보를 말합니다.
                </li>
                <li>
                  <strong>"축산물"</strong>이란 축산법에서 정하는 소, 돼지, 닭 등의
                  가축으로부터 얻어지는 식육 및 식육가공품을 말합니다.
                </li>
              </ol>
            </div>
          </section>

          <!-- 제3조: 약관의 효력 및 변경 -->
          <section id="effectiveness" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제3조 (약관의 효력 및 변경)
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게
                  공지함으로써 효력을 발생합니다.
                </li>
                <li>
                  회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며,
                  변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력을 발생합니다.
                </li>
                <li>
                  이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고
                  회원탈퇴를 할 수 있습니다.
                </li>
              </ol>
            </div>
          </section>

          <!-- 제4조: 회원가입 -->
          <section id="membership" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제4조 (회원가입)
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  회원가입은 사업자등록번호 인증을 통해서만 가능하며,
                  개인 소비자는 가입할 수 없습니다.
                </li>
                <li>
                  회원가입 신청자가 다음 각 호에 해당하는 경우 회사는 가입을 거부할 수 있습니다.
                  <ul class="sub-list">
                    <li>유효하지 않은 사업자등록번호를 제출한 경우</li>
                    <li>폐업 또는 휴업신고된 사업자인 경우</li>
                    <li>이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>허위정보를 기재하거나 기재누락이 있는 경우</li>
                  </ul>
                </li>
                <li>
                  회원은 회원정보에 변경사항이 있을 경우 즉시 수정해야 합니다.
                </li>
              </ol>
            </div>
          </section>

          <!-- 제5조: 서비스 이용 -->
          <section id="service-usage" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제5조 (서비스 이용)
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.
                  다만, 시스템 점검 등의 사유로 서비스를 일시 중단할 수 있습니다.
                </li>
                <li>
                  축산물 주문은 최소 5kg 이상부터 가능하며,
                  배송 가능 지역 내에서만 주문할 수 있습니다.
                </li>
                <li>
                  회원은 다음 각 호의 행위를 해서는 안 됩니다.
                  <ul class="sub-list">
                    <li>타인의 정보를 도용하거나 허위정보를 등록하는 행위</li>
                    <li>서비스의 정상적인 운영을 방해하는 행위</li>
                    <li>축산물 안전 관련 법령을 위반하는 거래행위</li>
                    <li>기타 관련 법령이나 공서양속에 반하는 행위</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <!-- 제6조: 주문 및 결제 -->
          <section id="order-payment" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제6조 (주문 및 결제)
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  주문은 회원이 서비스 내에서 상품을 선택하고 결제를 완료함으로써 성립됩니다.
                </li>
                <li>
                  결제 수단은 계좌이체, 신용카드, 현금 등을 제공하며,
                  모든 거래에 대해 세금계산서가 발행됩니다.
                </li>
                <li>
                  주문 취소는 상품 준비 전까지만 가능하며,
                  배송이 시작된 후에는 취소할 수 없습니다.
                </li>
                <li>
                  대량 주문 시 수량에 따른 할인 혜택이 적용될 수 있습니다.
                  <ul class="discount-list">
                    <li>50kg 이상: 3% 할인</li>
                    <li>100kg 이상: 5% 할인</li>
                    <li>200kg 이상: 7% 할인</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <!-- 제7조: 배송 -->
          <section id="delivery" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제7조 (배송)
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  배송은 콜드체인 시스템을 통해 신선도를 유지하여 진행됩니다.
                </li>
                <li>
                  배송기간은 주문일로부터 영업일 기준 1~3일 내이며,
                  지역에 따라 차이가 있을 수 있습니다.
                </li>
                <li>
                  천재지변, 교통사정 등 불가피한 사유로 인한 배송지연에 대해서는
                  회사가 책임지지 않습니다.
                </li>
                <li>
                  배송지 변경은 배송 시작 전까지만 가능합니다.
                </li>
              </ol>
            </div>
          </section>

          <!-- 제8조: 반품 및 교환 -->
          <section id="return-exchange" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제8조 (반품 및 교환)
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  축산물의 특성상 단순 변심에 의한 반품 및 교환은 원칙적으로 불가능합니다.
                </li>
                <li>
                  다음의 경우에 한하여 반품 및 교환이 가능합니다.
                  <ul class="sub-list">
                    <li>배송된 상품이 주문내용과 다른 경우</li>
                    <li>상품에 결함이나 손상이 있는 경우</li>
                    <li>유통기한이 임박하거나 경과한 경우</li>
                  </ul>
                </li>
                <li>
                  반품 및 교환 신청은 상품 수령 후 24시간 이내에 고객센터로 연락해야 합니다.
                </li>
              </ol>
            </div>
          </section>

          <!-- 제9조: 개인정보 보호 -->
          <section id="privacy" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제9조 (개인정보 보호)
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  회사는 이용자의 개인정보를 중요시하며,
                  개인정보보호법 등 관련 법령을 준수합니다.
                </li>
                <li>
                  회사의 개인정보 처리방침은 별도로 정하며,
                  서비스 화면에서 확인할 수 있습니다.
                </li>
                <li>
                  회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
                </li>
              </ol>
            </div>
          </section>

          <!-- 제10조: 책임 제한 -->
          <section id="liability" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제10조 (책임 제한)
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  회사는 천재지변, 전쟁, 테러 등 불가항력으로 인하여
                  서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.
                </li>
                <li>
                  회사는 이용자의 귀책사유로 인한 서비스 이용장애에 대해 책임을 지지 않습니다.
                </li>
                <li>
                  회사는 이용자가 서비스를 통해 얻은 정보로 인한 손해에 대해 책임을 지지 않습니다.
                </li>
              </ol>
            </div>
          </section>

          <!-- 제11조: 분쟁 해결 -->
          <section id="dispute" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제11조 (분쟁 해결)
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  본 약관에 관한 분쟁은 회사의 본사 소재지를 관할하는 법원에서 해결합니다.
                </li>
                <li>
                  본 약관 및 서비스 이용과 관련된 분쟁에는 대한민국 법을 적용합니다.
                </li>
              </ol>
            </div>
          </section>

          <!-- 부칙 -->
          <section id="addendum" class="terms-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                부칙
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>본 약관은 2024년 1월 1일부터 시행됩니다.</li>
                <li>
                  이전 약관은 본 약관으로 대체되며,
                  본 약관에서 정하지 아니한 사항과 본 약관의 해석에 관하여는
                  전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률,
                  공정거래위원회가 정하는 전자상거래등에서의 소비자보호지침 및 관계법령
                  또는 상관례에 따릅니다.
                </li>
              </ol>
            </div>
          </section>

          <!-- 연락처 정보 -->
          <div class="contact-info q-mt-xl">
            <q-card class="bg-grey-1">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">
                  📞 문의 및 고객지원
                </div>
                <div class="text-body1">
                  <div class="q-mb-sm">
                    <strong>고객센터:</strong> 1588-0000 (평일 09:00~18:00)
                  </div>
                  <div class="q-mb-sm">
                    <strong>이메일:</strong> support@yukpro.com
                  </div>
                  <div class="q-mb-sm">
                    <strong>주소:</strong> 서울특별시 강남구 테헤란로 123, Yukpro 빌딩
                  </div>
                  <div>
                    <strong>사업자등록번호:</strong> 123-45-67890
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- 사이드바 -->
        <div class="col-md-4 gt-sm">
          <q-card class="sticky-sidebar">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">
                📋 주요 안내사항
              </div>

              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="business" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">B2B 전용</q-item-label>
                    <q-item-label caption>사업자등록번호 인증 필수</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="scale" color="orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">최소주문량</q-item-label>
                    <q-item-label caption>5kg 이상부터 주문 가능</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="local_shipping" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">콜드체인 배송</q-item-label>
                    <q-item-label caption>신선도 보장 배송시스템</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="receipt" color="purple" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">세금계산서</q-item-label>
                    <q-item-label caption>모든 거래 자동 발행</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-separator class="q-my-md" />

              <q-btn
                color="primary"
                label="동의하고 가입하기"
                icon="check_circle"
                class="full-width"
                @click="agreeAndSignUp"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- 플로팅 도구 -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        color="primary"
        icon="menu"
        direction="up"
      >
        <q-fab-action
          color="orange"
          icon="print"
          @click="printTerms"
          label="인쇄"
        />
        <q-fab-action
          color="green"
          icon="download"
          @click="downloadPDF"
          label="PDF"
        />
        <q-fab-action
          color="blue"
          icon="share"
          @click="shareTerms"
          label="공유"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const activeSection = ref('purpose');

const sections = [
  { id: 'purpose', title: '목적' },
  { id: 'definitions', title: '정의' },
  { id: 'effectiveness', title: '약관의 효력' },
  { id: 'membership', title: '회원가입' },
  { id: 'service-usage', title: '서비스 이용' },
  { id: 'order-payment', title: '주문 및 결제' },
  { id: 'delivery', title: '배송' },
  { id: 'return-exchange', title: '반품 및 교환' },
  { id: 'privacy', title: '개인정보 보호' },
  { id: 'liability', title: '책임 제한' },
  { id: 'dispute', title: '분쟁 해결' },
  { id: 'addendum', title: '부칙' }
];

const goBack = () => {
  router.go(-1);
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeSection.value = sectionId;
  }
};

const agreeAndSignUp = () => {
  $q.dialog({
    title: '이용약관 동의',
    message: '이용약관에 동의하시고 회원가입을 진행하시겠습니까?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    router.push('/auth/register?terms=agreed');
  });
};

const printTerms = () => {
  window.print();
};

const downloadPDF = () => {
  $q.notify({
    type: 'info',
    message: 'PDF 다운로드 기능은 준비 중입니다',
    icon: 'download'
  });
};

const shareTerms = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Yukpro 이용약관',
      text: 'Yukpro B2B 축산물 유통 플랫폼 이용약관',
      url: window.location.href
    });
  } else {
    $q.notify({
      type: 'positive',
      message: 'URL이 클립보드에 복사되었습니다',
      icon: 'content_copy'
    });
    navigator.clipboard.writeText(window.location.href);
  }
};

// 스크롤 감지로 활성 섹션 업데이트
const handleScroll = () => {
  const sections = document.querySelectorAll('.terms-section');
  let current = '';

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 200 && rect.bottom >= 200) {
      current = section.id;
    }
  });

  if (current) {
    activeSection.value = current;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.terms-page {
  background: #fafafa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.sticky-toc {
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #e0e0e0;
}

.sticky-sidebar {
  position: sticky;
  top: 120px;
}

.terms-section {
  margin-bottom: 3rem;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e3f2fd;
}

.section-content {
  line-height: 1.7;
}

.section-content ol {
  padding-left: 1.5rem;
}

.section-content ol li {
  margin-bottom: 1rem;
}

.sub-list {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.sub-list li {
  margin-bottom: 0.5rem;
  list-style-type: disc;
}

.definition-list li {
  margin-bottom: 1rem;
}

.discount-list {
  background: #f3e5f5;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.discount-list li {
  color: #7b1fa2;
  font-weight: 500;
}

.terms-overview {
  margin-bottom: 2rem;
}

.contact-info {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 인쇄 스타일 */
@media print {
  .sticky-toc,
  .sticky-sidebar,
  .q-page-sticky {
    display: none !important;
  }

  .terms-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .section-header {
    page-break-after: avoid;
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 0 8px;
  }

  .terms-section {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .sticky-toc {
    padding: 0.5rem 0;
  }

  .sticky-toc .row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .text-h4 {
    font-size: 1.5rem;
  }

  .text-h5 {
    font-size: 1.25rem;
  }
}

/* 스크롤 부드럽게 */
html {
  scroll-behavior: smooth;
}

/* 활성 섹션 하이라이트 */
.terms-section:target {
  background: #f3e5f5;
  transition: background-color 0.3s ease;
}
</style>
