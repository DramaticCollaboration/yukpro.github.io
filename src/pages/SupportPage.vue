<template>
  <q-page class="support-page">
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
            <div class="text-h4 text-weight-bold">고객센터</div>
            <div class="text-subtitle1 opacity-80">
              24시간 전문 상담 서비스
            </div>
          </div>
          <div class="support-status">
            <q-chip
              :color="supportStatus.color"
              text-color="white"
              :icon="supportStatus.icon"
              size="md"
            >
              {{ supportStatus.text }}
            </q-chip>
          </div>
        </div>
      </div>
    </div>

    <!-- 빠른 액션 -->
    <div class="bg-grey-1 q-py-md">
      <div class="container">
        <div class="row q-gutter-sm">
          <q-btn
            :class="activeTab === 'chat' ? 'bg-primary text-white' : 'bg-white text-primary'"
            icon="chat"
            label="실시간 채팅"
            no-caps
            @click="activeTab = 'chat'"
          />
          <q-btn
            :class="activeTab === 'faq' ? 'bg-primary text-white' : 'bg-white text-primary'"
            icon="help"
            label="자주 묻는 질문"
            no-caps
            @click="activeTab = 'faq'"
          />
          <q-btn
            :class="activeTab === 'contact' ? 'bg-primary text-white' : 'bg-white text-primary'"
            icon="contact_support"
            label="문의하기"
            no-caps
            @click="activeTab = 'contact'"
          />
          <q-btn
            :class="activeTab === 'history' ? 'bg-primary text-white' : 'bg-white text-primary'"
            icon="history"
            label="문의 내역"
            no-caps
            @click="activeTab = 'history'"
          />
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="container q-py-lg">
      <div class="row q-gutter-lg">
        <!-- 메인 영역 -->
        <div class="col-12 col-md-8">
          <!-- 실시간 채팅 -->
          <div v-if="activeTab === 'chat'" class="chat-section">
            <q-card class="chat-card">
              <q-card-section class="bg-blue-1">
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-h6 text-weight-bold text-primary">
                      <q-icon name="chat" class="q-mr-sm" />
                      실시간 상담
                    </div>
                    <div class="text-caption text-grey-7">
                      평균 응답시간: {{ avgResponseTime }}
                    </div>
                  </div>
                  <div>
                    <q-chip
                      :color="chatStatus.color"
                      text-color="white"
                      :icon="chatStatus.icon"
                    >
                      {{ chatStatus.text }}
                    </q-chip>
                  </div>
                </div>
              </q-card-section>

              <!-- 채팅 메시지 영역 -->
              <q-card-section class="chat-messages" ref="chatContainer">
                <div
                  v-for="message in chatMessages"
                  :key="message.id"
                  :class="['message-item', message.sender === 'user' ? 'user-message' : 'agent-message']"
                >
                  <div class="message-header">
                    <q-avatar size="32px" :color="message.sender === 'user' ? 'primary' : 'green'">
                      <q-icon :name="message.sender === 'user' ? 'person' : 'support_agent'" />
                    </q-avatar>
                    <div class="message-info">
                      <div class="message-sender">{{ message.senderName }}</div>
                      <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                    </div>
                  </div>
                  <div class="message-content">
                    <div v-if="message.type === 'text'" class="message-text">
                      {{ message.content }}
                    </div>
                    <div v-else-if="message.type === 'file'" class="message-file">
                      <q-icon name="attachment" class="q-mr-sm" />
                      <a :href="message.fileUrl" target="_blank">{{ message.fileName }}</a>
                    </div>
                    <div v-else-if="message.type === 'image'" class="message-image">
                      <q-img
                        :src="message.imageUrl"
                        style="max-width: 200px"
                        class="rounded-borders"
                        @click="showImageDialog(message.imageUrl)"
                      />
                    </div>
                  </div>
                  <div v-if="message.sender === 'user'" class="message-status">
                    <q-icon
                      :name="message.status === 'read' ? 'done_all' : 'done'"
                      :color="message.status === 'read' ? 'blue' : 'grey'"
                      size="sm"
                    />
                  </div>
                </div>

                <!-- 타이핑 인디케이터 -->
                <div v-if="isAgentTyping" class="typing-indicator">
                  <q-avatar size="32px" color="green">
                    <q-icon name="support_agent" />
                  </q-avatar>
                  <div class="typing-bubble">
                    <div class="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </q-card-section>

              <!-- 메시지 입력 -->
              <q-card-section class="chat-input">
                <div class="row q-gutter-sm">
                  <q-input
                    v-model="newMessage"
                    placeholder="메시지를 입력하세요..."
                    outlined
                    dense
                    class="col"
                    @keydown.enter.prevent="sendMessage"
                    :disable="!isChatActive"
                  >
                    <template v-slot:prepend>
                      <q-btn
                        flat
                        round
                        icon="attach_file"
                        size="sm"
                        @click="$refs.fileInput.click()"
                        :disable="!isChatActive"
                      />
                      <input
                        ref="fileInput"
                        type="file"
                        hidden
                        @change="uploadFile"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                    </template>
                  </q-input>
                  <q-btn
                    color="primary"
                    icon="send"
                    round
                    @click="sendMessage"
                    :disable="!newMessage.trim() || !isChatActive"
                  />
                </div>

                <!-- 파일 업로드 프리뷰 -->
                <div v-if="uploadingFiles.length > 0" class="upload-preview q-mt-sm">
                  <q-chip
                    v-for="file in uploadingFiles"
                    :key="file.name"
                    :label="file.name"
                    removable
                    @remove="removeUploadFile(file)"
                    color="blue"
                    text-color="white"
                    icon="attachment"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 자주 묻는 질문 -->
          <div v-else-if="activeTab === 'faq'" class="faq-section">
            <q-card class="faq-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-primary q-mb-md">
                  <q-icon name="help" class="q-mr-sm" />
                  자주 묻는 질문
                </div>

                <!-- FAQ 검색 -->
                <q-input
                  v-model="faqSearch"
                  placeholder="질문을 검색해보세요..."
                  outlined
                  dense
                  class="q-mb-lg"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>

                <!-- FAQ 카테고리 -->
                <div class="faq-categories q-mb-lg">
                  <q-chip
                    v-for="category in faqCategories"
                    :key="category.key"
                    :label="category.name"
                    :color="selectedFaqCategory === category.key ? 'primary' : 'grey-4'"
                    :text-color="selectedFaqCategory === category.key ? 'white' : 'grey-8'"
                    clickable
                    @click="selectedFaqCategory = category.key"
                    class="q-mr-sm q-mb-sm"
                  />
                </div>

                <!-- FAQ 리스트 -->
                <q-list>
                  <q-expansion-item
                    v-for="faq in filteredFaqs"
                    :key="faq.id"
                    :label="faq.question"
                    :caption="faq.category"
                    :icon="faq.icon"
                    class="faq-item q-mb-sm"
                  >
                    <q-card flat>
                      <q-card-section>
                        <div class="text-body2" v-html="faq.answer"></div>

                        <!-- 관련 링크 -->
                        <div v-if="faq.relatedLinks?.length" class="q-mt-md">
                          <div class="text-caption text-grey-6 q-mb-sm">관련 링크:</div>
                          <div class="row q-gutter-sm">
                            <q-btn
                              v-for="link in faq.relatedLinks"
                              :key="link.url"
                              flat
                              size="sm"
                              :label="link.title"
                              :to="link.url"
                              color="primary"
                              icon="open_in_new"
                            />
                          </div>
                        </div>

                        <!-- 도움이 되었나요? -->
                        <div class="faq-feedback q-mt-lg">
                          <div class="text-caption text-grey-6 q-mb-sm">이 답변이 도움이 되었나요?</div>
                          <div class="row q-gutter-sm">
                            <q-btn
                              flat
                              size="sm"
                              icon="thumb_up"
                              label="도움됨"
                              color="green"
                              @click="faqFeedback(faq.id, 'helpful')"
                            />
                            <q-btn
                              flat
                              size="sm"
                              icon="thumb_down"
                              label="도움안됨"
                              color="red"
                              @click="faqFeedback(faq.id, 'not_helpful')"
                            />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>

                <div v-if="filteredFaqs.length === 0" class="text-center q-py-xl">
                  <q-icon name="search_off" size="64px" color="grey-4" />
                  <div class="text-h6 text-grey-6 q-mt-md">검색 결과가 없습니다</div>
                  <div class="text-body2 text-grey-6">
                    다른 키워드로 검색하거나 직접 문의해 주세요
                  </div>
                  <q-btn
                    color="primary"
                    label="문의하기"
                    class="q-mt-md"
                    @click="activeTab = 'contact'"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 문의하기 -->
          <div v-else-if="activeTab === 'contact'" class="contact-section">
            <q-card class="contact-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-primary q-mb-md">
                  <q-icon name="contact_support" class="q-mr-sm" />
                  문의하기
                </div>

                <q-form @submit.prevent="submitInquiry" class="inquiry-form">
                  <div class="row q-gutter-md">
                    <!-- 문의 유형 -->
                    <div class="col-12 col-md-6">
                      <q-select
                        v-model="inquiryForm.category"
                        :options="inquiryCategories"
                        label="문의 유형 *"
                        outlined
                        emit-value
                        map-options
                        :rules="[val => !!val || '문의 유형을 선택해주세요']"
                      />
                    </div>

                    <!-- 긴급도 -->
                    <div class="col-12 col-md-6">
                      <q-select
                        v-model="inquiryForm.priority"
                        :options="priorityOptions"
                        label="긴급도 *"
                        outlined
                        emit-value
                        map-options
                        :rules="[val => !!val || '긴급도를 선택해주세요']"
                      />
                    </div>

                    <!-- 주문번호 (선택사항) -->
                    <div class="col-12 col-md-6">
                      <q-input
                        v-model="inquiryForm.orderNumber"
                        label="주문번호 (선택사항)"
                        outlined
                        hint="주문 관련 문의시 입력"
                      />
                    </div>

                    <!-- 연락처 -->
                    <div class="col-12 col-md-6">
                      <q-input
                        v-model="inquiryForm.phone"
                        label="연락처 *"
                        outlined
                        mask="###-####-####"
                        :rules="[val => !!val || '연락처를 입력해주세요']"
                      />
                    </div>

                    <!-- 제목 -->
                    <div class="col-12">
                      <q-input
                        v-model="inquiryForm.title"
                        label="제목 *"
                        outlined
                        :rules="[val => !!val || '제목을 입력해주세요']"
                      />
                    </div>

                    <!-- 내용 -->
                    <div class="col-12">
                      <q-input
                        v-model="inquiryForm.content"
                        label="문의 내용 *"
                        type="textarea"
                        outlined
                        rows="6"
                        :rules="[val => !!val || '문의 내용을 입력해주세요']"
                        hint="상황을 자세히 설명해 주시면 더 정확한 답변을 드릴 수 있습니다"
                      />
                    </div>

                    <!-- 파일 첨부 -->
                    <div class="col-12">
                      <div class="text-subtitle2 q-mb-sm">첨부 파일 (최대 5개, 10MB 이하)</div>
                      <q-file
                        v-model="inquiryForm.attachments"
                        multiple
                        outlined
                        accept="image/*,.pdf,.doc,.docx,.txt,.xlsx"
                        max-files="5"
                        max-file-size="10485760"
                        @rejected="onRejected"
                      >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </div>

                    <!-- 개인정보 동의 -->
                    <div class="col-12">
                      <q-checkbox
                        v-model="inquiryForm.privacyAgreed"
                        label="개인정보 수집 및 이용에 동의합니다"
                        :rules="[val => val || '개인정보 처리방침에 동의해주세요']"
                      />
                      <q-btn
                        flat
                        size="sm"
                        label="내용 보기"
                        color="primary"
                        @click="showPrivacyDialog = true"
                        class="q-ml-sm"
                      />
                    </div>
                  </div>

                  <div class="text-right q-mt-lg">
                    <q-btn
                      type="submit"
                      color="primary"
                      label="문의 접수"
                      icon="send"
                      :loading="isSubmittingInquiry"
                      size="lg"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>

          <!-- 문의 내역 -->
          <div v-else-if="activeTab === 'history'" class="history-section">
            <q-card class="history-card">
              <q-card-section>
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-h6 text-weight-bold text-primary">
                    <q-icon name="history" class="q-mr-sm" />
                    문의 내역
                  </div>
                  <q-select
                    v-model="historyFilter"
                    :options="historyFilterOptions"
                    label="상태 필터"
                    outlined
                    dense
                    style="min-width: 150px"
                    emit-value
                    map-options
                  />
                </div>

                <!-- 문의 리스트 -->
                <q-list>
                  <q-item
                    v-for="inquiry in filteredInquiries"
                    :key="inquiry.id"
                    class="inquiry-item"
                    clickable
                    @click="showInquiryDetail(inquiry)"
                  >
                    <q-item-section avatar>
                      <q-avatar
                        :color="getStatusColor(inquiry.status)"
                        text-color="white"
                        :icon="getStatusIcon(inquiry.status)"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">
                        {{ inquiry.title }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ inquiry.category }} | {{ formatDateTime(inquiry.createdAt) }}
                      </q-item-label>
                      <q-item-label caption class="text-grey-6">
                        문의번호: {{ inquiry.ticketNumber }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-right">
                        <q-chip
                          :color="getStatusColor(inquiry.status)"
                          text-color="white"
                          size="sm"
                        >
                          {{ getStatusText(inquiry.status) }}
                        </q-chip>
                        <div class="text-caption text-grey-6 q-mt-xs">
                          {{ inquiry.priority === 'urgent' ? '긴급' : inquiry.priority === 'high' ? '높음' : '보통' }}
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div v-if="filteredInquiries.length === 0" class="text-center q-py-xl">
                  <q-icon name="inbox" size="64px" color="grey-4" />
                  <div class="text-h6 text-grey-6 q-mt-md">문의 내역이 없습니다</div>
                  <div class="text-body2 text-grey-6">
                    궁금한 점이 있으시면 언제든 문의해 주세요
                  </div>
                  <q-btn
                    color="primary"
                    label="새 문의하기"
                    class="q-mt-md"
                    @click="activeTab = 'contact'"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- 사이드바 -->
        <div class="col-12 col-md-4">
          <!-- 연락처 정보 -->
          <q-card class="contact-info-card q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold text-primary q-mb-md">
                <q-icon name="contact_phone" class="q-mr-sm" />
                연락처 안내
              </div>

              <div class="contact-methods">
                <div class="contact-method q-mb-md">
                  <div class="method-header">
                    <q-icon name="phone" color="green" size="md" class="q-mr-sm" />
                    <div class="method-info">
                      <div class="method-title">전화 상담</div>
                      <div class="method-time">평일 09:00 - 18:00</div>
                    </div>
                  </div>
                  <div class="method-content">
                    <div class="phone-number">1588-1234</div>
                    <q-btn
                      flat
                      size="sm"
                      label="전화걸기"
                      color="green"
                      icon="call"
                      @click="makePhoneCall('1588-1234')"
                    />
                  </div>
                </div>

                <div class="contact-method q-mb-md">
                  <div class="method-header">
                    <q-icon name="email" color="blue" size="md" class="q-mr-sm" />
                    <div class="method-info">
                      <div class="method-title">이메일 문의</div>
                      <div class="method-time">24시간 접수</div>
                    </div>
                  </div>
                  <div class="method-content">
                    <div class="email-address">support@yukpro.kr</div>
                    <q-btn
                      flat
                      size="sm"
                      label="메일보내기"
                      color="blue"
                      icon="mail"
                      @click="sendEmail('support@yukpro.kr')"
                    />
                  </div>
                </div>

                <div class="contact-method">
                  <div class="method-header">
                    <q-icon name="location_on" color="red" size="md" class="q-mr-sm" />
                    <div class="method-info">
                      <div class="method-title">방문 상담</div>
                      <div class="method-time">사전 예약 필수</div>
                    </div>
                  </div>
                  <div class="method-content">
                    <div class="address">서울시 강남구 테헤란로 123</div>
                    <q-btn
                      flat
                      size="sm"
                      label="위치보기"
                      color="red"
                      icon="map"
                      @click="showMap"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- 운영 시간 -->
          <q-card class="hours-card q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold text-primary q-mb-md">
                <q-icon name="schedule" class="q-mr-sm" />
                운영 시간
              </div>

              <div class="hours-list">
                <div
                  v-for="schedule in operatingHours"
                  :key="schedule.day"
                  class="hour-item"
                >
                  <div class="day">{{ schedule.day }}</div>
                  <div class="time" :class="{ 'closed': schedule.closed }">
                    {{ schedule.closed ? '휴무' : schedule.time }}
                  </div>
                </div>
              </div>

              <q-banner class="q-mt-md" :class="currentStatus.class">
                <template v-slot:avatar>
                  <q-icon :name="currentStatus.icon" :color="currentStatus.iconColor" />
                </template>
                {{ currentStatus.message }}
              </q-banner>
            </q-card-section>
          </q-card>

          <!-- 빠른 링크 -->
          <q-card class="quick-links-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold text-primary q-mb-md">
                <q-icon name="link" class="q-mr-sm" />
                빠른 링크
              </div>

              <div class="quick-links">
                <q-btn
                  v-for="link in quickLinks"
                  :key="link.path"
                  :to="link.path"
                  flat
                  class="full-width text-left q-mb-sm"
                  :icon="link.icon"
                  :label="link.title"
                  color="primary"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- 이미지 확대 다이얼로그 -->
    <q-dialog v-model="showImageModal">
      <q-card style="min-width: 300px">
        <q-img :src="selectedImage" fit="contain" />
        <q-card-actions align="right">
          <q-btn flat label="닫기" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 개인정보처리방침 다이얼로그 -->
    <q-dialog v-model="showPrivacyDialog" position="bottom">
      <q-card style="max-width: 600px; width: 100%">
        <q-card-section>
          <div class="text-h6">개인정보 수집 및 이용 동의</div>
        </q-card-section>
        <q-card-section class="q-pt-none" style="max-height: 400px; overflow-y: auto">
          <div class="privacy-content">
            <h4>1. 개인정보 수집 목적</h4>
            <p>고객 문의 처리 및 서비스 개선을 위해 개인정보를 수집합니다.</p>

            <h4>2. 수집하는 개인정보 항목</h4>
            <p>성명, 연락처, 이메일 주소, 문의 내용</p>

            <h4>3. 개인정보 보유 및 이용 기간</h4>
            <p>문의 처리 완료 후 3년간 보관하며, 이후 즉시 파기합니다.</p>

            <h4>4. 개인정보 제공 거부 권리</h4>
            <p>위 개인정보 수집에 대한 동의를 거부할 수 있으나, 이 경우 문의 처리가 제한될 수 있습니다.</p>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="닫기" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 문의 상세 다이얼로그 -->
    <q-dialog v-model="showInquiryDetailModal" :maximized="$q.screen.lt.sm">
      <q-card style="min-width: 600px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">문의 상세</div>
        </q-card-section>

        <q-card-section v-if="selectedInquiry">
          <div class="inquiry-detail">
            <div class="detail-header q-mb-md">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h6">{{ selectedInquiry.title }}</div>
                  <div class="text-caption text-grey-6">
                    문의번호: {{ selectedInquiry.ticketNumber }}
                  </div>
                </div>
                <q-chip
                  :color="getStatusColor(selectedInquiry.status)"
                  text-color="white"
                >
                  {{ getStatusText(selectedInquiry.status) }}
                </q-chip>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="detail-content">
              <div class="content-section q-mb-md">
                <div class="section-title">문의 내용</div>
                <div class="section-content">{{ selectedInquiry.content }}</div>
              </div>

              <div v-if="selectedInquiry.response" class="content-section q-mb-md">
                <div class="section-title">답변</div>
                <div class="section-content response-content">{{ selectedInquiry.response }}</div>
              </div>

              <div class="content-section">
                <div class="section-title">문의 정보</div>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">카테고리:</span>
                    <span class="info-value">{{ selectedInquiry.category }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">접수일:</span>
                    <span class="info-value">{{ formatDateTime(selectedInquiry.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">연락처:</span>
                    <span class="info-value">{{ selectedInquiry.phone }}</span>
                  </div>
                  <div v-if="selectedInquiry.orderNumber" class="info-item">
                    <span class="info-label">주문번호:</span>
                    <span class="info-value">{{ selectedInquiry.orderNumber }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="닫기" color="primary" v-close-popup />
        </q-card-actions>
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
const activeTab = ref('chat')
const newMessage = ref('')
const faqSearch = ref('')
const selectedFaqCategory = ref('all')
const historyFilter = ref('all')
const showImageModal = ref(false)
const selectedImage = ref('')
const showPrivacyDialog = ref(false)
const showInquiryDetailModal = ref(false)
const selectedInquiry = ref<any>(null)
const isAgentTyping = ref(false)
const isChatActive = ref(true)
const uploadingFiles = ref<File[]>([])
const isSubmittingInquiry = ref(false)

const chatContainer = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

// 지원 상태
const supportStatus = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay() // 0: 일요일, 6: 토요일

  if (day === 0 || day === 6) {
    return {
      color: 'orange',
      icon: 'schedule',
      text: '주말 (제한 운영)'
    }
  }

  if (hour >= 9 && hour < 18) {
    return {
      color: 'green',
      icon: 'support_agent',
      text: '상담원 연결 가능'
    }
  }

  return {
    color: 'red',
    icon: 'schedule',
    text: '운영시간 외'
  }
})

const avgResponseTime = ref('2분 30초')

const chatStatus = computed(() => {
  if (isChatActive.value) {
    return {
      color: 'green',
      icon: 'circle',
      text: '연결됨'
    }
  }
  return {
    color: 'red',
    icon: 'circle',
    text: '연결 끊김'
  }
})

// 채팅 메시지
const chatMessages = reactive([
  {
    id: 1,
    sender: 'agent',
    senderName: '상담원 김민지',
    type: 'text',
    content: '안녕하세요! 육프로 고객센터입니다. 무엇을 도와드릴까요?',
    timestamp: new Date(Date.now() - 300000),
    status: 'sent'
  },
  {
    id: 2,
    sender: 'user',
    senderName: '고객님',
    type: 'text',
    content: '주문한 상품의 배송일정을 확인하고 싶습니다.',
    timestamp: new Date(Date.now() - 240000),
    status: 'read'
  },
  {
    id: 3,
    sender: 'agent',
    senderName: '상담원 김민지',
    type: 'text',
    content: '네, 주문번호를 알려주시면 바로 확인해드리겠습니다.',
    timestamp: new Date(Date.now() - 180000),
    status: 'sent'
  }
])

// 문의 양식
const inquiryForm = reactive({
  category: '',
  priority: '',
  orderNumber: '',
  phone: '',
  title: '',
  content: '',
  attachments: null,
  privacyAgreed: false
})

// FAQ 관련
const faqCategories = [
  { key: 'all', name: '전체' },
  { key: 'order', name: '주문/결제' },
  { key: 'shipping', name: '배송' },
  { key: 'product', name: '상품' },
  { key: 'account', name: '계정' },
  { key: 'refund', name: '취소/환불' }
]

const faqs = reactive([
  {
    id: 1,
    category: '주문/결제',
    question: '최소 주문 수량이 어떻게 되나요?',
    answer: '육프로는 <strong>5kg 단위</strong>로 주문이 가능합니다. 소량 주문도 부담 없이 이용하실 수 있어요!',
    icon: 'shopping_cart',
    relatedLinks: [
      { title: '상품 보기', url: '/products' },
      { title: '주문 가이드', url: '/help/order-guide' }
    ]
  },
  {
    id: 2,
    category: '배송',
    question: '배송은 언제 가능한가요?',
    answer: '평일 오전 10시 이전 주문시 <strong>당일 발송</strong>됩니다. 새벽배송은 서울/경기 일부 지역만 가능합니다.',
    icon: 'local_shipping',
    relatedLinks: [
      { title: '배송 조회', url: '/orders' }
    ]
  },
  {
    id: 3,
    category: '상품',
    question: '상품의 신선도는 어떻게 보장하나요?',
    answer: '콜드체인 시스템을 통해 <strong>4℃ 이하</strong>를 유지하며, 도축일로부터 최대 3일 이내 상품만 판매합니다.',
    icon: 'thermostat',
    relatedLinks: []
  },
  {
    id: 4,
    category: '계정',
    question: '사업자 인증은 어떻게 하나요?',
    answer: '사업자등록번호 입력 → 국세청 자동 검증 → 담당자 본인인증 순으로 진행됩니다. 평균 <strong>5분</strong> 소요됩니다.',
    icon: 'verified_user',
    relatedLinks: [
      { title: '회원가입', url: '/auth/register' }
    ]
  },
  {
    id: 5,
    category: '취소/환불',
    question: '주문 취소는 언제까지 가능한가요?',
    answer: '발송 전까지 <strong>무료 취소</strong> 가능합니다. 발송 후에는 상품 상태에 따라 반품비가 발생할 수 있습니다.',
    icon: 'cancel',
    relatedLinks: [
      { title: '취소/환불 정책', url: '/help/refund-policy' }
    ]
  }
])

// 문의 내역
const inquiries = reactive([
  {
    id: 1,
    ticketNumber: 'YK2024012001',
    title: '배송지 변경 요청',
    category: '배송',
    content: '주문한 상품의 배송지를 변경하고 싶습니다.',
    response: '배송지 변경이 완료되었습니다. 새로운 주소로 발송될 예정입니다.',
    status: 'completed',
    priority: 'normal',
    phone: '010-1234-5678',
    orderNumber: 'YK20240120001',
    createdAt: new Date('2024-01-20T10:30:00'),
    completedAt: new Date('2024-01-20T11:15:00')
  },
  {
    id: 2,
    ticketNumber: 'YK2024012002',
    title: '상품 품질 문의',
    category: '상품',
    content: '받은 상품의 상태가 사진과 다른 것 같습니다.',
    response: null,
    status: 'in_progress',
    priority: 'high',
    phone: '010-1234-5678',
    orderNumber: 'YK20240119002',
    createdAt: new Date('2024-01-19T15:45:00')
  },
  {
    id: 3,
    ticketNumber: 'YK2024012003',
    title: '세금계산서 발급 요청',
    category: '주문/결제',
    content: '세금계산서를 추가로 발급받고 싶습니다.',
    response: null,
    status: 'pending',
    priority: 'normal',
    phone: '010-1234-5678',
    orderNumber: 'YK20240118003',
    createdAt: new Date('2024-01-18T09:20:00')
  }
])

// 옵션들
const inquiryCategories = [
  { label: '주문/결제', value: 'order' },
  { label: '배송', value: 'shipping' },
  { label: '상품 품질', value: 'product' },
  { label: '계정/인증', value: 'account' },
  { label: '취소/환불', value: 'refund' },
  { label: '기타', value: 'etc' }
]

const priorityOptions = [
  { label: '긴급', value: 'urgent' },
  { label: '높음', value: 'high' },
  { label: '보통', value: 'normal' },
  { label: '낮음', value: 'low' }
]

const historyFilterOptions = [
  { label: '전체', value: 'all' },
  { label: '처리 완료', value: 'completed' },
  { label: '처리 중', value: 'in_progress' },
  { label: '대기 중', value: 'pending' }
]

// 운영시간
const operatingHours = [
  { day: '월요일', time: '09:00 - 18:00', closed: false },
  { day: '화요일', time: '09:00 - 18:00', closed: false },
  { day: '수요일', time: '09:00 - 18:00', closed: false },
  { day: '목요일', time: '09:00 - 18:00', closed: false },
  { day: '금요일', time: '09:00 - 18:00', closed: false },
  { day: '토요일', time: '10:00 - 15:00', closed: false },
  { day: '일요일', time: '', closed: true }
]

const currentStatus = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()

  if (day === 0) {
    return {
      class: 'bg-red-1 text-red-8',
      icon: 'schedule',
      iconColor: 'red',
      message: '현재 휴무일입니다'
    }
  }

  if (day === 6) {
    if (hour >= 10 && hour < 15) {
      return {
        class: 'bg-green-1 text-green-8',
        icon: 'support_agent',
        iconColor: 'green',
        message: '현재 상담 가능합니다'
      }
    } else {
      return {
        class: 'bg-orange-1 text-orange-8',
        icon: 'schedule',
        iconColor: 'orange',
        message: '토요일 상담시간: 10:00-15:00'
      }
    }
  }

  if (hour >= 9 && hour < 18) {
    return {
      class: 'bg-green-1 text-green-8',
      icon: 'support_agent',
      iconColor: 'green',
      message: '현재 상담 가능합니다'
    }
  }

  return {
    class: 'bg-orange-1 text-orange-8',
    icon: 'schedule',
    iconColor: 'orange',
    message: '상담시간: 평일 09:00-18:00'
  }
})

// 빠른 링크
const quickLinks = [
  { title: '주문 조회', icon: 'list_alt', path: '/orders' },
  { title: '상품 카탈로그', icon: 'inventory_2', path: '/products' },
  { title: '회원정보 수정', icon: 'person', path: '/profile' },
  { title: '이용약관', icon: 'description', path: '/terms' },
  { title: '개인정보처리방침', icon: 'privacy_tip', path: '/privacy' }
]

// computed
const filteredFaqs = computed(() => {
  let filtered = faqs

  if (selectedFaqCategory.value !== 'all') {
    const categoryName = faqCategories.find(c => c.key === selectedFaqCategory.value)?.name
    filtered = filtered.filter(faq => faq.category === categoryName)
  }

  if (faqSearch.value.trim()) {
    const searchLower = faqSearch.value.toLowerCase()
    filtered = filtered.filter(faq =>
      faq.question.toLowerCase().includes(searchLower) ||
      faq.answer.toLowerCase().includes(searchLower)
    )
  }

  return filtered
})

const filteredInquiries = computed(() => {
  if (historyFilter.value === 'all') {
    return inquiries
  }
  return inquiries.filter(inquiry => inquiry.status === historyFilter.value)
})

// 메소드
const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const message = {
    id: Date.now(),
    sender: 'user',
    senderName: '고객님',
    type: 'text',
    content: newMessage.value,
    timestamp: new Date(),
    status: 'sent'
  }

  chatMessages.push(message)
  newMessage.value = ''

  // 스크롤을 아래로
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })

  // 상담원 응답 시뮬레이션
  isAgentTyping.value = true
  setTimeout(() => {
    isAgentTyping.value = false
    const response = {
      id: Date.now() + 1,
      sender: 'agent',
      senderName: '상담원 김민지',
      type: 'text',
      content: '네, 확인해보겠습니다. 잠시만 기다려주세요.',
      timestamp: new Date(),
      status: 'sent'
    }
    chatMessages.push(response)

    // 읽음 처리
    message.status = 'read'

    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  }, 2000)
}

const uploadFile = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    uploadingFiles.value = Array.from(files)
    // 실제로는 여기서 파일 업로드 처리
  }
}

const removeUploadFile = (file: File) => {
  const index = uploadingFiles.value.indexOf(file)
  if (index > -1) {
    uploadingFiles.value.splice(index, 1)
  }
}

const showImageDialog = (imageUrl: string) => {
  selectedImage.value = imageUrl
  showImageModal.value = true
}

const faqFeedback = (faqId: number, type: 'helpful' | 'not_helpful') => {
  $q.notify({
    type: 'positive',
    message: '피드백 감사합니다!'
  })
}

const submitInquiry = async () => {
  isSubmittingInquiry.value = true

  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newInquiry = {
      id: Date.now(),
      ticketNumber: `YK${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Date.now()).slice(-4)}`,
      title: inquiryForm.title,
      category: inquiryCategories.find(c => c.value === inquiryForm.category)?.label || '',
      content: inquiryForm.content,
      response: null,
      status: 'pending',
      priority: inquiryForm.priority,
      phone: inquiryForm.phone,
      orderNumber: inquiryForm.orderNumber,
      createdAt: new Date()
    }

    inquiries.unshift(newInquiry)

    $q.notify({
      type: 'positive',
      message: `문의가 접수되었습니다. 문의번호: ${newInquiry.ticketNumber}`
    })

    // 폼 초기화
    Object.keys(inquiryForm).forEach(key => {
      if (key === 'privacyAgreed') {
        inquiryForm[key] = false
      } else {
        inquiryForm[key] = ''
      }
    })

    // 문의 내역 탭으로 이동
    activeTab.value = 'history'

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '문의 접수에 실패했습니다. 다시 시도해주세요.'
    })
  } finally {
    isSubmittingInquiry.value = false
  }
}

const onRejected = (rejectedEntries: any[]) => {
  rejectedEntries.forEach(entry => {
    $q.notify({
      type: 'negative',
      message: `${entry.file.name}: ${entry.failedPropValidation}`
    })
  })
}

const showInquiryDetail = (inquiry: any) => {
  selectedInquiry.value = inquiry
  showInquiryDetailModal.value = true
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'green'
    case 'in_progress': return 'blue'
    case 'pending': return 'orange'
    default: return 'grey'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return 'check_circle'
    case 'in_progress': return 'sync'
    case 'pending': return 'schedule'
    default: return 'help'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return '처리완료'
    case 'in_progress': return '처리중'
    case 'pending': return '대기중'
    default: return '알수없음'
  }
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
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

const makePhoneCall = (number: string) => {
  window.open(`tel:${number}`)
}

const sendEmail = (email: string) => {
  window.open(`mailto:${email}`)
}

const showMap = () => {
  window.open('https://maps.google.com/?q=서울시+강남구+테헤란로+123')
}

// 생명주기
onMounted(() => {
  // 채팅 영역을 맨 아래로 스크롤
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>

<style lang="scss" scoped>
.support-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

// 채팅 관련 스타일
.chat-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chat-messages {
  height: 500px;
  overflow-y: auto;
  background: #fafafa;
}

.message-item {
  margin-bottom: 16px;

  &.user-message {
    .message-header {
      flex-direction: row-reverse;
      text-align: right;
    }

    .message-content {
      margin-left: auto;
      margin-right: 0;
      background: var(--q-primary);
      color: white;
      max-width: 70%;
    }
  }

  &.agent-message {
    .message-content {
      background: white;
      color: #333;
      max-width: 70%;
    }
  }
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.message-info {
  margin-left: 8px;
}

.message-sender {
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.message-time {
  font-size: 11px;
  color: #999;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message-text {
  line-height: 1.4;
}

.message-file,
.message-image {
  cursor: pointer;
}

.message-status {
  text-align: right;
  margin-top: 4px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.typing-bubble {
  background: white;
  border-radius: 18px;
  padding: 12px 16px;
  margin-left: 8px;
}

.typing-dots {
  display: flex;
  gap: 4px;

  span {
    width: 6px;
    height: 6px;
    background: #999;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  30% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input {
  background: white;
  border-top: 1px solid #eee;
}

.upload-preview {
  .q-chip {
    margin-right: 8px;
  }
}

// FAQ 관련 스타일
.faq-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.faq-categories {
  .q-chip {
    transition: all 0.2s ease;
  }
}

.faq-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;

  &:hover {
    border-color: var(--q-primary);
  }
}

.faq-feedback {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

// 문의하기 관련 스타일
.contact-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.inquiry-form {
  .q-field {
    margin-bottom: 16px;
  }
}

// 문의내역 관련 스타일
.history-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.inquiry-item {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--q-primary);
    background: rgba(25, 118, 210, 0.04);
  }
}

// 문의 상세 다이얼로그
.inquiry-detail {
  .detail-header {
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }

  .content-section {
    .section-title {
      font-weight: bold;
      color: #666;
      margin-bottom: 8px;
    }

    .section-content {
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      line-height: 1.6;

      &.response-content {
        background: #e3f2fd;
        border-left: 4px solid var(--q-primary);
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
  }

  .info-label {
    color: #666;
    font-weight: 500;
  }

  .info-value {
    color: #333;
  }
}

// 사이드바 스타일
.contact-info-card,
.hours-card,
.quick-links-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contact-methods {
  .contact-method {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
    background: white;
  }

  .method-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .method-info {
    margin-left: 8px;
  }

  .method-title {
    font-weight: bold;
    color: #333;
  }

  .method-time {
    font-size: 12px;
    color: #666;
  }

  .method-content {
    padding-left: 32px;
  }

  .phone-number,
  .email-address,
  .address {
    font-weight: bold;
    color: var(--q-primary);
    margin-bottom: 8px;
  }
}

.hours-list {
  .hour-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .day {
    font-weight: 500;
    color: #333;
  }

  .time {
    color: #666;

    &.closed {
      color: #f56565;
      font-weight: bold;
    }
  }
}

.quick-links {
  .q-btn {
    justify-content: flex-start;
  }
}

.privacy-content {
  h4 {
    color: var(--q-primary);
    margin: 16px 0 8px 0;
    font-size: 16px;
  }

  p {
    margin-bottom: 12px;
    line-height: 1.6;
    color: #666;
  }
}

@media (max-width: 600px) {
  .chat-messages {
    height: 400px;
  }

  .message-content {
    max-width: 85% !important;
  }

  .method-content {
    padding-left: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
