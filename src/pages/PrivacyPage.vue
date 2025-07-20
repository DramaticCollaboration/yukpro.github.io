
<template>
  <q-page class="privacy-page">
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
            <div class="text-h4 text-weight-bold">개인정보처리방침</div>
            <div class="text-subtitle1 opacity-80">
              Yukpro 개인정보 보호 및 처리방침
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

    <!-- 방침 내용 -->
    <div class="container q-py-lg">
      <div class="row">
        <!-- 메인 컨텐츠 -->
        <div class="col-12 col-md-8 q-pr-lg">
          <!-- 방침 개요 -->
          <div class="privacy-overview q-mb-xl">
            <q-card class="bg-blue-1">
              <q-card-section>
                <div class="row items-center">
                  <q-icon name="security" size="40px" color="primary" />
                  <div class="q-ml-md">
                    <div class="text-h6 text-weight-bold text-primary">
                      개인정보 보호 안내
                    </div>
                    <div class="text-body2 text-grey-7 q-mt-xs">
                      본 방침은 <strong>2024년 1월 1일</strong>부터 시행되며,
                      개인정보보호법에 따라 이용자의 개인정보를 안전하게 보호합니다.
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 제1조: 개인정보의 처리 목적 -->
          <section id="purpose" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제1조 개인정보의 처리 목적
              </h2>
            </div>
            <div class="section-content">
              <p>
                주식회사 Yukpro(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다.
                처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등
                필요한 조치를 이행할 예정입니다.
              </p>

              <div class="purpose-grid q-mt-lg">
                <q-card v-for="purpose in processingPurposes" :key="purpose.title" class="purpose-card">
                  <q-card-section>
                    <div class="row items-center q-mb-sm">
                      <q-icon :name="purpose.icon" size="24px" :color="purpose.color" />
                      <div class="text-subtitle1 text-weight-bold q-ml-sm">
                        {{ purpose.title }}
                      </div>
                    </div>
                    <ul class="purpose-list">
                      <li v-for="item in purpose.items" :key="item">{{ item }}</li>
                    </ul>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </section>

          <!-- 제2조: 개인정보의 처리 및 보유기간 -->
          <section id="retention" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제2조 개인정보의 처리 및 보유기간
              </h2>
            </div>
            <div class="section-content">
              <p>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>

              <q-table
                :rows="retentionPeriods"
                :columns="retentionColumns"
                row-key="category"
                flat
                bordered
                class="retention-table q-mt-lg"
              >
                <template v-slot:body-cell-icon="props">
                  <q-td :props="props">
                    <q-icon :name="props.row.icon" size="24px" :color="props.row.color" />
                  </q-td>
                </template>
                <template v-slot:body-cell-legal="props">
                  <q-td :props="props">
                    <q-chip
                      v-if="props.row.legal"
                      dense
                      color="orange"
                      text-color="white"
                      icon="gavel"
                    >
                      {{ props.row.legal }}
                    </q-chip>
                  </q-td>
                </template>
              </q-table>
            </div>
          </section>

          <!-- 제3조: 처리하는 개인정보 항목 -->
          <section id="items" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제3조 처리하는 개인정보 항목
              </h2>
            </div>
            <div class="section-content">
              <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>

              <div class="items-grid q-mt-lg">
                <q-card
                  v-for="category in personalInfoItems"
                  :key="category.title"
                  class="info-category-card"
                >
                  <q-card-section>
                    <div class="row items-center q-mb-md">
                      <q-icon :name="category.icon" size="28px" :color="category.color" />
                      <div class="text-h6 text-weight-bold q-ml-sm">
                        {{ category.title }}
                      </div>
                      <q-space />
                      <q-chip
                        :color="category.required ? 'red' : 'grey-5'"
                        text-color="white"
                        dense
                      >
                        {{ category.required ? '필수' : '선택' }}
                      </q-chip>
                    </div>

                    <div class="info-items">
                      <q-chip
                        v-for="item in category.items"
                        :key="item"
                        outline
                        color="primary"
                        size="sm"
                        class="q-ma-xs"
                      >
                        {{ item }}
                      </q-chip>
                    </div>

                    <div v-if="category.description" class="text-caption text-grey-6 q-mt-sm">
                      {{ category.description }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </section>

          <!-- 제4조: 개인정보의 제3자 제공 -->
          <section id="third-party" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제4조 개인정보의 제3자 제공
              </h2>
            </div>
            <div class="section-content">
              <div class="q-mb-lg">
                <q-banner class="bg-green-1 text-green-8">
                  <template v-slot:avatar>
                    <q-icon name="verified_user" color="green" />
                  </template>
                  <div class="text-weight-bold">
                    회사는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다.
                  </div>
                </q-banner>
              </div>

              <p>
                다만, 다음의 경우에는 예외적으로 개인정보를 제3자에게 제공할 수 있습니다.
              </p>

              <q-list bordered class="q-mt-md">
                <q-item v-for="exception in thirdPartyExceptions" :key="exception.title">
                  <q-item-section avatar>
                    <q-icon :name="exception.icon" :color="exception.color" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ exception.title }}</q-item-label>
                    <q-item-label caption>{{ exception.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="q-mt-lg">
                <div class="text-subtitle1 text-weight-bold q-mb-md">📋 제3자 제공 현황</div>
                <q-table
                  :rows="thirdPartyProvisions"
                  :columns="thirdPartyColumns"
                  row-key="recipient"
                  flat
                  bordered
                  class="third-party-table"
                >
                  <template v-slot:body-cell-status="props">
                    <q-td :props="props">
                      <q-chip
                        :color="props.row.status === '동의' ? 'green' : 'blue'"
                        text-color="white"
                        dense
                      >
                        {{ props.row.status }}
                      </q-chip>
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
          </section>

          <!-- 제5조: 개인정보처리의 위탁 -->
          <section id="outsourcing" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제5조 개인정보처리의 위탁
              </h2>
            </div>
            <div class="section-content">
              <p>
                회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
              </p>

              <q-table
                :rows="outsourcingList"
                :columns="outsourcingColumns"
                row-key="company"
                flat
                bordered
                class="outsourcing-table q-mt-lg"
              >
                <template v-slot:body-cell-security="props">
                  <q-td :props="props">
                    <q-chip
                      color="blue"
                      text-color="white"
                      dense
                      icon="security"
                    >
                      {{ props.row.security }}
                    </q-chip>
                  </q-td>
                </template>
              </q-table>

              <div class="q-mt-md">
                <q-banner class="bg-blue-1 text-blue-8">
                  <template v-slot:avatar>
                    <q-icon name="shield" color="blue" />
                  </template>
                  <div class="text-body2">
                    <strong>위탁업체 관리:</strong> 모든 위탁업체는 개인정보보호법에 따른
                    보안조치 의무를 준수하며, 정기적인 보안점검을 실시합니다.
                  </div>
                </q-banner>
              </div>
            </div>
          </section>

          <!-- 제6조: 정보주체의 권리 -->
          <section id="rights" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제6조 정보주체의 권리·의무 및 행사방법
              </h2>
            </div>
            <div class="section-content">
              <p>
                정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
              </p>

              <div class="rights-grid q-mt-lg">
                <q-card v-for="right in userRights" :key="right.title" class="rights-card">
                  <q-card-section>
                    <div class="row items-center q-mb-sm">
                      <q-icon :name="right.icon" size="32px" :color="right.color" />
                      <div class="text-h6 text-weight-bold q-ml-sm">
                        {{ right.title }}
                      </div>
                    </div>
                    <div class="text-body2 text-grey-7 q-mb-md">
                      {{ right.description }}
                    </div>
                    <div class="text-caption text-primary">
                      <strong>행사방법:</strong> {{ right.method }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <div class="q-mt-lg">
                <q-banner class="bg-amber-1 text-amber-8">
                  <template v-slot:avatar>
                    <q-icon name="schedule" color="amber" />
                  </template>
                  <div class="text-body2">
                    <strong>처리기한:</strong> 개인정보 보호법 제35조에 따라
                    정보주체의 요청에 대해 지체없이, 늦어도 10일 이내에 처리결과를 알려드립니다.
                  </div>
                </q-banner>
              </div>
            </div>
          </section>

          <!-- 제7조: 개인정보의 파기 -->
          <section id="destruction" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제7조 개인정보의 파기
              </h2>
            </div>
            <div class="section-content">
              <p>
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                지체없이 해당 개인정보를 파기합니다.
              </p>

              <div class="destruction-process q-mt-lg">
                <div class="text-subtitle1 text-weight-bold q-mb-md">🔄 파기 절차</div>

                <q-stepper
                  v-model="destructionStep"
                  color="primary"
                  animated
                  flat
                  bordered
                >
                  <q-step
                    :name="1"
                    title="파기 사유 발생"
                    icon="event_available"
                    :done="destructionStep > 1"
                  >
                    보유기간 만료 또는 처리목적 달성 시
                  </q-step>

                  <q-step
                    :name="2"
                    title="파기 계획 수립"
                    icon="assignment"
                    :done="destructionStep > 2"
                  >
                    파기 대상, 방법, 일정 등을 포함한 계획 수립
                  </q-step>

                  <q-step
                    :name="3"
                    title="파기 승인"
                    icon="verified"
                    :done="destructionStep > 3"
                  >
                    개인정보보호책임자 승인 후 파기 실시
                  </q-step>

                  <q-step
                    :name="4"
                    title="파기 완료"
                    icon="delete_forever"
                  >
                    복구 불가능한 방법으로 완전 파기 및 기록 보관
                  </q-step>
                </q-stepper>
              </div>

              <div class="destruction-methods q-mt-lg">
                <div class="text-subtitle1 text-weight-bold q-mb-md">🛡️ 파기 방법</div>
                <div class="row q-gutter-md">
                  <q-card class="col-12 col-md-6">
                    <q-card-section>
                      <div class="row items-center q-mb-sm">
                        <q-icon name="computer" size="24px" color="blue" />
                        <div class="text-subtitle2 text-weight-bold q-ml-sm">
                          전자파일
                        </div>
                      </div>
                      <div class="text-body2">
                        복구 불가능한 방법으로 영구삭제<br>
                        (저장매체 물리적 파기 포함)
                      </div>
                    </q-card-section>
                  </q-card>

                  <q-card class="col-12 col-md-6">
                    <q-card-section>
                      <div class="row items-center q-mb-sm">
                        <q-icon name="description" size="24px" color="green" />
                        <div class="text-subtitle2 text-weight-bold q-ml-sm">
                          종이문서
                        </div>
                      </div>
                      <div class="text-body2">
                        분쇄기로 분쇄하거나<br>
                        소각을 통한 완전 파기
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </section>

          <!-- 제8조: 개인정보의 안전성 확보조치 -->
          <section id="security" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제8조 개인정보의 안전성 확보조치
              </h2>
            </div>
            <div class="section-content">
              <p>
                회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보조치를 하고 있습니다.
              </p>

              <div class="security-measures q-mt-lg">
                <q-card v-for="measure in securityMeasures" :key="measure.title" class="security-card q-mb-md">
                  <q-card-section>
                    <div class="row items-start">
                      <q-icon :name="measure.icon" size="40px" :color="measure.color" class="q-mr-md" />
                      <div class="col">
                        <div class="text-h6 text-weight-bold q-mb-sm">
                          {{ measure.title }}
                        </div>
                        <div class="text-body2 text-grey-7 q-mb-md">
                          {{ measure.description }}
                        </div>
                        <div class="security-details">
                          <q-chip
                            v-for="detail in measure.details"
                            :key="detail"
                            outline
                            :color="measure.color"
                            size="sm"
                            class="q-ma-xs"
                          >
                            {{ detail }}
                          </q-chip>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </section>

          <!-- 제9조: 개인정보 보호책임자 -->
          <section id="officer" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제9조 개인정보 보호책임자
              </h2>
            </div>
            <div class="section-content">
              <p>
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
                아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>

              <div class="row q-gutter-lg q-mt-lg">
                <!-- 개인정보 보호책임자 -->
                <q-card class="col-12 col-md-6 officer-card">
                  <q-card-section>
                    <div class="text-center q-mb-md">
                      <q-avatar size="80px" color="primary" text-color="white">
                        <q-icon name="shield" size="40px" />
                      </q-avatar>
                      <div class="text-h6 text-weight-bold q-mt-md">
                        개인정보 보호책임자
                      </div>
                    </div>

                    <q-list>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="person" color="primary" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>이름: 김○○</q-item-label>
                          <q-item-label caption>직책: 정보보호팀장</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="phone" color="green" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>연락처: 02-1234-5678</q-item-label>
                          <q-item-label caption>근무시간: 평일 09:00~18:00</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="email" color="blue" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>이메일: privacy@yukpro.com</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>

                <!-- 개인정보 보호담당자 -->
                <q-card class="col-12 col-md-6 officer-card">
                  <q-card-section>
                    <div class="text-center q-mb-md">
                      <q-avatar size="80px" color="orange" text-color="white">
                        <q-icon name="support_agent" size="40px" />
                      </q-avatar>
                      <div class="text-h6 text-weight-bold q-mt-md">
                        개인정보 보호담당자
                      </div>
                    </div>

                    <q-list>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="person" color="orange" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>이름: 박○○</q-item-label>
                          <q-item-label caption>직책: 고객지원팀 대리</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="phone" color="green" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>연락처: 1588-0000</q-item-label>
                          <q-item-label caption>상담시간: 평일 09:00~18:00</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="email" color="blue" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>이메일: support@yukpro.com</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </section>

          <!-- 제10조: 개인정보 처리방침 변경 -->
          <section id="changes" class="privacy-section">
            <div class="section-header">
              <h2 class="text-h5 text-weight-bold text-primary">
                제10조 개인정보 처리방침의 변경
              </h2>
            </div>
            <div class="section-content">
              <ol>
                <li>
                  이 개인정보 처리방침은 시행일로부터 적용되며,
                  법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
                  변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </li>
                <li>
                  중요한 변경사항이 있을 경우에는 개별 통지를 실시합니다.
                </li>
              </ol>

              <div class="version-history q-mt-lg">
                <div class="text-subtitle1 text-weight-bold q-mb-md">📅 변경 이력</div>
                <q-timeline color="primary">
                  <q-timeline-entry
                    title="v1.0 시행"
                    subtitle="2024년 1월 1일"
                    icon="launch"
                  >
                    <div>개인정보처리방침 최초 제정</div>
                  </q-timeline-entry>
                  <q-timeline-entry
                    title="v1.1 개정"
                    subtitle="2024년 3월 15일"
                    icon="update"
                  >
                    <div>제3자 제공 현황 추가, 보안조치 강화</div>
                  </q-timeline-entry>
                </q-timeline>
              </div>
            </div>
          </section>

          <!-- 개인정보 침해신고센터 -->
          <div class="privacy-center-info q-mt-xl">
            <q-card class="bg-red-1">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-red-8 q-mb-md">
                  🚨 개인정보 침해신고센터
                </div>
                <div class="text-body2 text-grey-8">
                  개인정보 침해로 인한 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다.
                </div>

                <div class="row q-gutter-md q-mt-md">
                  <div class="col-12 col-md-4">
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="security" color="red" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold">개인정보침해신고센터</q-item-label>
                        <q-item-label caption>privacy.go.kr / 국번없이 182</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>

                  <div class="col-12 col-md-4">
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="gavel" color="blue" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold">대검찰청</q-item-label>
                        <q-item-label caption>www.spo.go.kr / 1301</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>

                  <div class="col-12 col-md-4">
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="local_police" color="green" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold">경찰청</q-item-label>
                        <q-item-label caption>cyberbureau.police.go.kr / 182</q-item-label>
                      </q-item-section>
                    </q-item>
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
                🔒 개인정보 보호 현황
              </div>

              <!-- 보안 인증 -->
              <div class="security-badges q-mb-lg">
                <q-chip
                  v-for="badge in securityBadges"
                  :key="badge.name"
                  :color="badge.color"
                  text-color="white"
                  icon="verified"
                  class="full-width q-mb-xs"
                >
                  {{ badge.name }}
                </q-chip>
              </div>

              <!-- 개인정보 처리 통계 -->
              <div class="privacy-stats q-mb-lg">
                <div class="text-subtitle2 text-weight-bold q-mb-sm">📊 처리 현황</div>
                <q-linear-progress
                  size="20px"
                  :value="0.95"
                  color="green"
                  class="q-mb-xs"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="primary" label="95% 보안 준수" />
                  </div>
                </q-linear-progress>
                <div class="text-caption text-center text-grey-6">
                  개인정보보호법 준수율
                </div>
              </div>

              <q-separator />

              <!-- 빠른 문의 -->
              <div class="q-mt-md">
                <q-btn
                  color="primary"
                  icon="support_agent"
                  label="개인정보 문의하기"
                  class="full-width q-mb-sm"
                  @click="contactPrivacyOfficer"
                />
                <q-btn
                  outline
                  color="orange"
                  icon="warning"
                  label="침해신고하기"
                  class="full-width"
                  @click="reportPrivacyBreach"
                />
              </div>
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
          @click="printPolicy"
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
          @click="sharePolicy"
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
const destructionStep = ref(1);

const sections = [
  { id: 'purpose', title: '처리 목적' },
  { id: 'retention', title: '보유기간' },
  { id: 'items', title: '처리 항목' },
  { id: 'third-party', title: '제3자 제공' },
  { id: 'outsourcing', title: '처리 위탁' },
  { id: 'rights', title: '정보주체 권리' },
  { id: 'destruction', title: '파기' },
  { id: 'security', title: '안전성 확보' },
  { id: 'officer', title: '보호책임자' },
  { id: 'changes', title: '방침 변경' }
];

const processingPurposes = [
  {
    title: '회원 가입 및 관리',
    icon: 'person_add',
    color: 'blue',
    items: [
      '회원가입 의사 확인',
      '회원 식별 및 본인인증',
      '사업자등록번호 인증',
      '회원탈퇴 의사 확인'
    ]
  },
  {
    title: '상품 및 서비스 제공',
    icon: 'shopping_cart',
    color: 'green',
    items: [
      '축산물 주문 및 배송',
      '결제 및 정산 서비스',
      '세금계산서 발행',
      '고객 상담 및 A/S'
    ]
  },
  {
    title: '마케팅 및 광고 활용',
    icon: 'campaign',
    color: 'orange',
    items: [
      '맞춤형 상품 추천',
      '이벤트 및 혜택 안내',
      '신상품 정보 제공',
      '만족도 조사 실시'
    ]
  }
];

const retentionColumns = [
  { name: 'icon', label: '', field: 'icon', align: 'center' },
  { name: 'category', label: '구분', field: 'category', align: 'left' },
  { name: 'period', label: '보유기간', field: 'period', align: 'center' },
  { name: 'legal', label: '관련 법령', field: 'legal', align: 'center' }
];

const retentionPeriods = [
  {
    icon: 'person',
    color: 'blue',
    category: '회원가입 및 탈퇴 기록',
    period: '5년',
    legal: '전자상거래법'
  },
  {
    icon: 'receipt',
    color: 'green',
    category: '계약 또는 청약철회 기록',
    period: '5년',
    legal: '전자상거래법'
  },
  {
    icon: 'payment',
    color: 'orange',
    category: '대금결제 및 재화공급 기록',
    period: '5년',
    legal: '전자상거래법'
  },
  {
    icon: 'support',
    color: 'purple',
    category: '소비자 불만 및 분쟁처리 기록',
    period: '3년',
    legal: '전자상거래법'
  },
  {
    icon: 'business',
    color: 'red',
    category: '사업자등록번호 인증 기록',
    period: '회원탈퇴 시까지',
    legal: '개인정보보호법'
  }
];

const personalInfoItems = [
  {
    title: '회원가입 정보',
    icon: 'person',
    color: 'blue',
    required: true,
    items: ['사업자등록번호', '상호명', '대표자명', '연락처', '이메일', '주소'],
    description: '회원 식별 및 서비스 제공을 위한 필수 정보'
  },
  {
    title: '서비스 이용 정보',
    icon: 'shopping_cart',
    color: 'green',
    required: false,
    items: ['주문내역', '결제정보', '배송정보', '상품 평가'],
    description: '서비스 개선 및 맞춤 서비스 제공'
  },
  {
    title: '기술적 정보',
    icon: 'computer',
    color: 'orange',
    required: false,
    items: ['IP주소', '쿠키', '접속로그', '기기정보'],
    description: '보안 및 서비스 최적화를 위한 수집'
  }
];

const thirdPartyExceptions = [
  {
    title: '법률에 특별한 규정이 있는 경우',
    icon: 'gavel',
    color: 'red',
    description: '수사기관의 수사목적으로 법관이 발부한 영장에 따른 경우'
  },
  {
    title: '정보주체의 동의를 받은 경우',
    icon: 'check_circle',
    color: 'green',
    description: '사전에 고지하고 정보주체가 명시적으로 동의한 경우'
  },
  {
    title: '공공기관의 요청이 있는 경우',
    icon: 'account_balance',
    color: 'blue',
    description: '관세청, 식품의약품안전처 등 법적 권한이 있는 경우'
  }
];

const thirdPartyColumns = [
  { name: 'recipient', label: '제공받는자', field: 'recipient', align: 'left' },
  { name: 'items', label: '제공항목', field: 'items', align: 'left' },
  { name: 'purpose', label: '제공목적', field: 'purpose', align: 'left' },
  { name: 'status', label: '제공근거', field: 'status', align: 'center' }
];

const thirdPartyProvisions = [
  {
    recipient: '한국축산물품질평가원',
    items: '사업자등록번호, 상호명',
    purpose: '축산물 품질 검증',
    status: '법정의무'
  },
  {
    recipient: '국세청',
    items: '세금계산서 발행 정보',
    purpose: '세무신고 목적',
    status: '법정의무'
  }
];

const outsourcingColumns = [
  { name: 'company', label: '위탁업체', field: 'company', align: 'left' },
  { name: 'task', label: '위탁업무', field: 'task', align: 'left' },
  { name: 'period', label: '위탁기간', field: 'period', align: 'center' },
  { name: 'security', label: '보안등급', field: 'security', align: 'center' }
];

const outsourcingList = [
  {
    company: 'KG이니시스',
    task: '결제 처리 서비스',
    period: '계약기간 동안',
    security: 'AAA'
  },
  {
    company: 'CJ대한통운',
    task: '배송 서비스',
    period: '배송완료 후 1개월',
    security: 'AA'
  },
  {
    company: 'AWS',
    task: '클라우드 서비스',
    period: '계약기간 동안',
    security: 'AAA'
  }
];

const userRights = [
  {
    title: '개인정보 열람권',
    icon: 'visibility',
    color: 'blue',
    description: '본인의 개인정보 처리 현황을 확인할 수 있는 권리',
    method: '마이페이지 또는 고객센터를 통한 신청'
  },
  {
    title: '개인정보 정정·삭제권',
    icon: 'edit',
    color: 'green',
    description: '잘못된 개인정보의 수정이나 삭제를 요구할 수 있는 권리',
    method: '마이페이지에서 직접 수정 또는 고객센터 문의'
  },
  {
    title: '개인정보 처리정지권',
    icon: 'stop',
    color: 'red',
    description: '개인정보 처리를 중단하도록 요구할 수 있는 권리',
    method: '고객센터 또는 개인정보보호책임자에게 서면 신청'
  },
  {
    title: '손해배상청구권',
    icon: 'gavel',
    color: 'orange',
    description: '개인정보 침해로 인한 손해의 배상을 청구할 수 있는 권리',
    method: '개인정보 침해신고센터 또는 민사소송 제기'
  }
];

const securityMeasures = [
  {
    title: '관리적 보호조치',
    icon: 'admin_panel_settings',
    color: 'blue',
    description: '개인정보보호 조직 구성 및 담당자 지정, 정기적 직원 교육 실시',
    details: ['개인정보보호 전담조직', '접근권한 관리', '정기 교육', '내부관리계획']
  },
  {
    title: '기술적 보호조치',
    icon: 'security',
    color: 'green',
    description: '개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치',
    details: ['접근권한 제한', '암호화', '보안프로그램 설치', '접속기록 보관']
  },
  {
    title: '물리적 보호조치',
    icon: 'lock',
    color: 'red',
    description: '전산실, 자료보관실 등의 접근통제 및 출입통제시스템 구축',
    details: ['출입통제', 'CCTV 설치', '잠금장치', '방화벽 구축']
  }
];

const securityBadges = [
  { name: 'ISO 27001', color: 'blue' },
  { name: 'ISMS-P', color: 'green' },
  { name: 'PCI DSS', color: 'orange' },
  { name: '개인정보보호 인증', color: 'purple' }
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

const contactPrivacyOfficer = () => {
  $q.dialog({
    title: '개인정보 문의',
    message: '개인정보보호책임자에게 문의하시겠습니까?',
    options: {
      type: 'radio',
      model: 'phone',
      items: [
        { label: '전화 문의 (02-1234-5678)', value: 'phone' },
        { label: '이메일 문의 (privacy@yukpro.com)', value: 'email' }
      ]
    },
    cancel: true
  }).onOk((method) => {
    if (method === 'phone') {
      window.open('tel:02-1234-5678');
    } else {
      window.open('mailto:privacy@yukpro.com');
    }
  });
};

const reportPrivacyBreach = () => {
  $q.dialog({
    title: '개인정보 침해신고',
    message: '개인정보 침해신고센터로 연결하시겠습니까?',
    cancel: true
  }).onOk(() => {
    window.open('https://privacy.go.kr', '_blank');
  });
};

const printPolicy = () => {
  window.print();
};

const downloadPDF = () => {
  $q.notify({
    type: 'info',
    message: 'PDF 다운로드 기능은 준비 중입니다',
    icon: 'download'
  });
};

const sharePolicy = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Yukpro 개인정보처리방침',
      text: 'Yukpro B2B 축산물 유통 플랫폼 개인정보처리방침',
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
  const sections = document.querySelectorAll('.privacy-section');
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

// 파기 절차 애니메이션
const animateDestruction = () => {
  const interval = setInterval(() => {
    if (destructionStep.value < 4) {
      destructionStep.value++;
    } else {
      destructionStep.value = 1;
    }
  }, 3000);

  return () => clearInterval(interval);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  const cleanup = animateDestruction();

  return () => {
    cleanup();
  };
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.privacy-page {
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

.privacy-section {
  margin-bottom: 3rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #e3f2fd;
}

.section-content {
  line-height: 1.8;
}

.purpose-grid,
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.purpose-card,
.info-category-card,
.rights-card,
.security-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.purpose-card:hover,
.info-category-card:hover,
.rights-card:hover,
.security-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.purpose-list {
  list-style-type: none;
  padding-left: 0;
}

.purpose-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.purpose-list li:before {
  content: '✓';
  color: #4caf50;
  margin-right: 0.5rem;
  font-weight: bold;
}

.retention-table,
.third-party-table,
.outsourcing-table {
  border-radius: 8px;
  overflow: hidden;
}

.rights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.destruction-process {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.security-measures .security-card {
  border-left: 4px solid #1976d2;
}

.officer-card {
  transition: transform 0.2s ease;
}

.officer-card:hover {
  transform: scale(1.02);
}

.privacy-overview,
.privacy-center-info {
  margin-bottom: 2rem;
}

.security-badges .q-chip {
  margin: 0.25rem;
}

.version-history {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

/* 인쇄 스타일 */
@media print {
  .sticky-toc,
  .sticky-sidebar,
  .q-page-sticky {
    display: none !important;
  }

  .privacy-section {
    break-inside: avoid;
    page-break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
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

  .privacy-section {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .purpose-grid,
  .items-grid,
  .rights-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .text-h4 {
    font-size: 1.5rem;
  }

  .text-h5 {
    font-size: 1.25rem;
  }

  .sticky-toc {
    padding: 0.5rem 0;
  }

  .sticky-toc .row {
    flex-direction: column;
    gap: 0.25rem;
  }
}

/* 애니메이션 */
.privacy-section {
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

/* 스크롤 부드럽게 */
html {
  scroll-behavior: smooth;
}

/* 활성 섹션 하이라이트 */
.privacy-section:target {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  transition: background 0.3s ease;
}

/* 테이블 스타일 개선 */
.q-table tbody tr:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

/* 차트 및 프로그레스 바 */
.q-linear-progress {
  border-radius: 10px;
}

/* 보안 배지 */
.security-badges .q-chip {
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
