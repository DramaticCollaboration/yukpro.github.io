
<template>
  <q-page class="about-page">
    <!-- 히어로 섹션 -->
    <section class="hero-section bg-primary text-white">
      <div class="container q-py-xl text-center">
        <div class="text-h2 text-weight-bold q-mb-md">
          🥩 Yukpro
        </div>
        <div class="text-h5 q-mb-lg opacity-90">
          B2B 축산물 유통의 새로운 표준
        </div>
        <div class="text-subtitle1 q-mb-xl max-width-600 text-center opacity-80">
          사업자와 사업자를 연결하는 전문 축산물 유통 플랫폼으로<br>
          신선하고 품질 좋은 축산물을 합리적인 가격에 공급합니다
        </div>
        <q-btn
          size="lg"
          color="white"
          text-color="primary"
          label="서비스 시작하기"
          @click="goToRegister"
          class="text-weight-bold"
        />
      </div>
    </section>

    <!-- 서비스 특징 -->
    <section class="features-section q-py-xl">
      <div class="container">
        <div class="text-h4 text-center text-weight-bold q-mb-xl">
          왜 Yukpro를 선택해야 할까요?
        </div>

        <div class="row q-gutter-lg">
          <!-- B2B 전문 -->
          <div class="col-12 col-md-4 text-center">
            <q-icon name="business" size="80px" color="primary" />
            <div class="text-h6 text-weight-bold q-mt-md q-mb-sm">
              B2B 전문 플랫폼
            </div>
            <div class="text-body1 text-grey-7">
              사업자등록증 인증을 통한<br>
              검증된 B2B 거래만 지원하여<br>
              안전하고 신뢰할 수 있는 거래
            </div>
          </div>

          <!-- 최소주문량 -->
          <div class="col-12 col-md-4 text-center">
            <q-icon name="scale" size="80px" color="orange" />
            <div class="text-h6 text-weight-bold q-mt-md q-mb-sm">
              대량 주문 특화
            </div>
            <div class="text-body1 text-grey-7">
              최소 5kg 이상 주문으로<br>
              대량 구매 할인과<br>
              효율적인 물류 시스템 제공
            </div>
          </div>

          <!-- 품질 보증 -->
          <div class="col-12 col-md-4 text-center">
            <q-icon name="verified" size="80px" color="green" />
            <div class="text-h6 text-weight-bold q-mt-md q-mb-sm">
              품질 보증 시스템
            </div>
            <div class="text-body1 text-grey-7">
              엄격한 품질 관리와<br>
              콜드체인 물류 시스템으로<br>
              신선함과 품질을 보장
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 주요 상품 카테고리 -->
    <section class="categories-section bg-grey-1 q-py-xl">
      <div class="container">
        <div class="text-h4 text-center text-weight-bold q-mb-xl">
          주요 취급 상품
        </div>

        <div class="row q-gutter-lg justify-center">
          <!-- 소고기 -->
          <q-card
            class="category-card cursor-pointer"
            @click="goToProducts('beef')"
          >
            <q-card-section class="text-center q-pa-xl">
              <div class="text-h1 q-mb-md">🐄</div>
              <div class="text-h5 text-weight-bold q-mb-sm">소고기</div>
              <div class="text-body1 text-grey-7 q-mb-md">
                1++등급 한우부터<br>
                수입 육우까지
              </div>
              <div class="text-caption text-primary">
                • 한우 등심, 갈비, 불고기<br>
                • 수입 척아이롤, 채끝살<br>
                • 등급별 다양한 부위
              </div>
            </q-card-section>
          </q-card>

          <!-- 돼지고기 -->
          <q-card
            class="category-card cursor-pointer"
            @click="goToProducts('pork')"
          >
            <q-card-section class="text-center q-pa-xl">
              <div class="text-h1 q-mb-md">🐷</div>
              <div class="text-h5 text-weight-bold q-mb-sm">돼지고기</div>
              <div class="text-body1 text-grey-7 q-mb-md">
                국내산 신선한<br>
                돼지고기
              </div>
              <div class="text-caption text-primary">
                • 삼겹살, 목살, 앞다리살<br>
                • 등심, 안심, 갈비<br>
                • 냉장·냉동 선택 가능
              </div>
            </q-card-section>
          </q-card>

          <!-- 닭고기 -->
          <q-card
            class="category-card cursor-pointer"
            @click="goToProducts('chicken')"
          >
            <q-card-section class="text-center q-pa-xl">
              <div class="text-h1 q-mb-md">🐔</div>
              <div class="text-h5 text-weight-bold q-mb-sm">닭고기</div>
              <div class="text-body1 text-grey-7 q-mb-md">
                건강한 국내산<br>
                닭고기
              </div>
              <div class="text-caption text-primary">
                • 통닭, 닭다리, 닭가슴살<br>
                • 손질닭, 부분육<br>
                • 1등급 인증 제품
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- 서비스 프로세스 -->
    <section class="process-section q-py-xl">
      <div class="container">
        <div class="text-h4 text-center text-weight-bold q-mb-xl">
          간편한 주문 프로세스
        </div>

        <div class="row items-start q-gutter-xl justify-center">
          <!-- 1단계 -->
          <div class="col-12 col-md-2 text-center">
            <div class="process-step">
              <q-icon name="person_add" size="60px" color="white" />
            </div>
            <div class="text-h6 text-weight-bold q-mt-md">1. 사업자 인증</div>
            <div class="text-body2 text-grey-7 q-mt-sm">
              사업자등록증으로<br>간편한 인증 절차
            </div>
          </div>

          <q-icon name="arrow_forward" size="40px" color="grey-4" class="gt-sm" />

          <!-- 2단계 -->
          <div class="col-12 col-md-2 text-center">
            <div class="process-step">
              <q-icon name="search" size="60px" color="white" />
            </div>
            <div class="text-h6 text-weight-bold q-mt-md">2. 상품 검색</div>
            <div class="text-body2 text-grey-7 q-mt-sm">
              카테고리별 상품<br>비교 및 선택
            </div>
          </div>

          <q-icon name="arrow_forward" size="40px" color="grey-4" class="gt-sm" />

          <!-- 3단계 -->
          <div class="col-12 col-md-2 text-center">
            <div class="process-step">
              <q-icon name="shopping_cart" size="60px" color="white" />
            </div>
            <div class="text-h6 text-weight-bold q-mt-md">3. 주문 및 결제</div>
            <div class="text-body2 text-grey-7 q-mt-sm">
              최소 5kg 단위<br>간편 주문
            </div>
          </div>

          <q-icon name="arrow_forward" size="40px" color="grey-4" class="gt-sm" />

          <!-- 4단계 -->
          <div class="col-12 col-md-2 text-center">
            <div class="process-step">
              <q-icon name="local_shipping" size="60px" color="white" />
            </div>
            <div class="text-h6 text-weight-bold q-mt-md">4. 배송 및 수령</div>
            <div class="text-body2 text-grey-7 q-mt-sm">
              콜드체인 시스템<br>신선 배송
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 통계 섹션 -->
    <section class="stats-section bg-primary text-white q-py-xl">
      <div class="container">
        <div class="row text-center q-gutter-lg">
          <div class="col-12 col-md-3">
            <div class="text-h3 text-weight-bold">1,200+</div>
            <div class="text-subtitle1">등록 사업자</div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-h3 text-weight-bold">500+</div>
            <div class="text-subtitle1">취급 상품</div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-h3 text-weight-bold">99.8%</div>
            <div class="text-subtitle1">고객 만족도</div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-h3 text-weight-bold">24시간</div>
            <div class="text-subtitle1">배송 서비스</div>
          </div>
        </div>
      </div>
    </section>

    <!-- B2B 특화 서비스 -->
    <section class="b2b-services q-py-xl">
      <div class="container">
        <div class="text-h4 text-center text-weight-bold q-mb-xl">
          B2B 전용 서비스
        </div>

        <div class="row q-gutter-lg">
          <!-- 세금계산서 -->
          <div class="col-12 col-md-6">
            <q-card class="full-height">
              <q-card-section class="q-pa-lg">
                <div class="row items-center q-mb-md">
                  <q-icon name="receipt_long" size="40px" color="primary" />
                  <div class="text-h6 text-weight-bold q-ml-md">
                    세금계산서 자동 발행
                  </div>
                </div>
                <div class="text-body1 text-grey-7">
                  주문 즉시 세금계산서가 자동 발행되어<br>
                  사업자 회계 처리가 간편합니다
                </div>
                <q-list class="q-mt-md">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="check_circle" color="green" />
                    </q-item-section>
                    <q-item-section>즉시 발행 및 이메일 전송</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="check_circle" color="green" />
                    </q-item-section>
                    <q-item-section>PDF 다운로드 가능</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="check_circle" color="green" />
                    </q-item-section>
                    <q-item-section>국세청 전자신고 연동</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- 대량 할인 -->
          <div class="col-12 col-md-6">
            <q-card class="full-height">
              <q-card-section class="q-pa-lg">
                <div class="row items-center q-mb-md">
                  <q-icon name="local_offer" size="40px" color="orange" />
                  <div class="text-h6 text-weight-bold q-ml-md">
                    대량 구매 할인
                  </div>
                </div>
                <div class="text-body1 text-grey-7">
                  구매량에 따른 단계별 할인으로<br>
                  더욱 경제적인 구매가 가능합니다
                </div>
                <q-list class="q-mt-md">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="trending_up" color="primary" />
                    </q-item-section>
                    <q-item-section>50kg 이상: 3% 할인</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="trending_up" color="primary" />
                    </q-item-section>
                    <q-item-section>100kg 이상: 5% 할인</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="trending_up" color="primary" />
                    </q-item-section>
                    <q-item-section>200kg 이상: 7% 할인</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- 전담 CS -->
          <div class="col-12 col-md-6">
            <q-card class="full-height">
              <q-card-section class="q-pa-lg">
                <div class="row items-center q-mb-md">
                  <q-icon name="support_agent" size="40px" color="green" />
                  <div class="text-h6 text-weight-bold q-ml-md">
                    전담 고객지원
                  </div>
                </div>
                <div class="text-body1 text-grey-7">
                  B2B 전문 상담사가 주문부터 배송까지<br>
                  전 과정을 책임지고 지원합니다
                </div>
                <q-list class="q-mt-md">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="schedule" color="blue" />
                    </q-item-section>
                    <q-item-section>평일 09:00~18:00 전화상담</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="chat" color="blue" />
                    </q-item-section>
                    <q-item-section>실시간 채팅 지원</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="email" color="blue" />
                    </q-item-section>
                    <q-item-section>이메일 문의 24시간 접수</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- 맞춤 서비스 -->
          <div class="col-12 col-md-6">
            <q-card class="full-height">
              <q-card-section class="q-pa-lg">
                <div class="row items-center q-mb-md">
                  <q-icon name="tune" size="40px" color="purple" />
                  <div class="text-h6 text-weight-bold q-ml-md">
                    맞춤형 서비스
                  </div>
                </div>
                <div class="text-body1 text-grey-7">
                  사업체 규모와 요구사항에 맞는<br>
                  개인화된 서비스를 제공합니다
                </div>
                <q-list class="q-mt-md">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="calendar_today" color="purple" />
                    </q-item-section>
                    <q-item-section>정기 주문 자동화</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="analytics" color="purple" />
                    </q-item-section>
                    <q-item-section>구매 패턴 분석 리포트</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="inventory" color="purple" />
                    </q-item-section>
                    <q-item-section>재고 알림 서비스</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- 고객 후기 -->
    <section class="testimonials-section bg-grey-1 q-py-xl">
      <div class="container">
        <div class="text-h4 text-center text-weight-bold q-mb-xl">
          고객 후기
        </div>

        <div class="row q-gutter-lg">
          <q-card class="col-12 col-md-4 testimonial-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center q-mb-md">
                <q-avatar size="50px" color="primary" text-color="white">
                  김
                </q-avatar>
                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bold">김○○ 사장님</div>
                  <div class="text-caption text-grey-6">한식당 운영</div>
                </div>
              </div>
              <div class="text-body1 q-mb-md">
                "세금계산서 자동 발행이 정말 편리해요.
                회계 처리 시간이 많이 단축되었습니다."
              </div>
              <q-rating
                v-model="rating"
                size="sm"
                color="amber"
                readonly
              />
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-md-4 testimonial-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center q-mb-md">
                <q-avatar size="50px" color="green" text-color="white">
                  이
                </q-avatar>
                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bold">이○○ 대표님</div>
                  <div class="text-caption text-grey-6">정육점 운영</div>
                </div>
              </div>
              <div class="text-body1 q-mb-md">
                "품질이 일정하고 배송도 빨라서
                고객들이 만족해해요. 재주문률이 높아졌습니다."
              </div>
              <q-rating
                v-model="rating"
                size="sm"
                color="amber"
                readonly
              />
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-md-4 testimonial-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center q-mb-md">
                <q-avatar size="50px" color="orange" text-color="white">
                  박
                </q-avatar>
                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bold">박○○ 사장님</div>
                  <div class="text-caption text-grey-6">BBQ 전문점</div>
                </div>
              </div>
              <div class="text-body1 q-mb-md">
                "대량 할인 혜택이 좋아서 원가 절감에
                큰 도움이 됩니다. 추천해요!"
              </div>
              <q-rating
                v-model="rating"
                size="sm"
                color="amber"
                readonly
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- CTA 섹션 -->
    <section class="cta-section bg-primary text-white q-py-xl">
      <div class="container text-center">
        <div class="text-h4 text-weight-bold q-mb-md">
          지금 Yukpro와 함께하세요
        </div>
        <div class="text-subtitle1 q-mb-xl opacity-90">
          사업자등록증만 있으면 바로 시작할 수 있습니다
        </div>
        <div class="row justify-center q-gutter-md">
          <q-btn
            size="lg"
            color="white"
            text-color="primary"
            label="사업자 인증하기"
            icon="business"
            @click="goToRegister"
            class="text-weight-bold"
          />
          <q-btn
            size="lg"
            outline
            color="white"
            label="고객센터 문의"
            icon="support_agent"
            @click="goToSupport"
            class="text-weight-bold"
          />
        </div>
      </div>
    </section>

    <!-- 플로팅 고객센터 버튼 -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="support_agent"
        color="orange"
        @click="goToSupport"
      >
        <q-tooltip>고객센터</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const rating = ref(5);
const router = useRouter();

const goToRegister = () => {
  router.push('/auth/register');
};

const goToProducts = (category: string) => {
  router.push(`/products?category=${category}`);
};

const goToSupport = () => {
  router.push('/support');
};
</script>

<style scoped>
.about-page {
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.max-width-600 {
  max-width: 600px;
  margin: 0 auto;
}

.category-card {
  width: 300px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.process-step {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
}

.testimonial-card {
  transition: transform 0.2s ease;
}

.testimonial-card:hover {
  transform: translateY(-4px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .text-h2 {
    font-size: 2.5rem;
  }

  .text-h4 {
    font-size: 1.75rem;
  }

  .category-card {
    width: 100%;
  }

  .process-step {
    width: 80px;
    height: 80px;
  }

  .hero-section .text-subtitle1 {
    font-size: 1rem;
    line-height: 1.4;
  }
}

/* 애니메이션 */
.hero-section,
.features-section,
.categories-section,
.process-section,
.stats-section,
.b2b-services,
.testimonials-section,
.cta-section {
  opacity: 1;
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

/* 그라데이션 배경 */
.hero-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.stats-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.cta-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}
</style>
