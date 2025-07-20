
<template>
  <q-page class="settings-page">
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
            <div class="text-h4 text-weight-bold">계정 설정</div>
            <div class="text-subtitle1 opacity-80">
              사업자 정보 및 계정 관리
            </div>
          </div>
          <div class="header-actions">
            <q-btn
              flat
              icon="help_outline"
              color="white"
              @click="showHelp"
            >
              <q-tooltip>도움말</q-tooltip>
            </q-btn>
            <q-btn
              color="white"
              text-color="primary"
              icon="support_agent"
              label="고객지원"
              @click="contactSupport"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 설정 네비게이션 -->
    <div class="bg-white shadow-1">
      <div class="container">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-primary"
          indicator-color="primary"
          align="left"
          no-caps
          mobile-arrows
        >
          <q-tab name="account" icon="person" label="계정 정보" />
          <q-tab name="business" icon="business" label="사업자 정보" />
          <q-tab name="security" icon="security" label="보안 설정" />
          <q-tab name="notifications" icon="notifications" label="알림 설정" />
          <q-tab name="payment" icon="payment" label="결제 설정" />
          <q-tab name="privacy" icon="privacy_tip" label="개인정보" />
          <q-tab name="system" icon="settings" label="시스템" />
        </q-tabs>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="container q-py-lg">
      <div class="row q-gutter-lg">
        <!-- 설정 컨텐츠 -->
        <div class="col-12">
          <q-tab-panels v-model="activeTab" animated>
            <!-- 계정 정보 -->
            <q-tab-panel name="account" class="q-pa-none">
              <div class="row q-gutter-lg">
                <div class="col-12 col-lg-8">
                  <q-card class="settings-card">
                    <q-card-section class="bg-blue-1">
                      <div class="row items-center">
                        <q-avatar size="80px" color="primary" text-color="white" class="q-mr-lg">
                          <q-img
                            v-if="accountData.profileImage"
                            :src="accountData.profileImage"
                          />
                          <q-icon
                            v-else
                            name="person"
                            size="40px"
                          />
                        </q-avatar>
                        <div class="col">
                          <div class="text-h5 text-weight-bold text-primary">
                            {{ accountData.name }}
                          </div>
                          <div class="text-subtitle1 text-grey-7">
                            {{ accountData.email }}
                          </div>
                          <div class="text-caption text-grey-6">
                            가입일: {{ formatDate(accountData.joinDate) }}
                          </div>
                        </div>
                        <div>
                          <q-btn
                            flat
                            icon="camera_alt"
                            label="사진 변경"
                            color="primary"
                            @click="changeProfileImage"
                          />
                        </div>
                      </div>
                    </q-card-section>

                    <q-card-section>
                      <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                        <q-icon name="person" class="q-mr-sm" />
                        기본 정보
                      </div>

                      <form @submit.prevent="saveAccountInfo">
                        <div class="row q-gutter-lg">
                          <div class="col-12 col-md-6">
                            <q-input
                              v-model="accountForm.name"
                              label="이름 *"
                              outlined
                              :rules="[val => !!val || '이름을 입력해주세요']"
                              class="q-mb-md"
                            />

                            <q-input
                              v-model="accountForm.email"
                              label="이메일 주소 *"
                              type="email"
                              outlined
                              :rules="[validateEmail]"
                              class="q-mb-md"
                            />

                            <q-input
                              v-model="accountForm.phone"
                              label="휴대폰 번호 *"
                              outlined
                              mask="###-####-####"
                              :rules="[val => !!val || '휴대폰 번호를 입력해주세요']"
                              class="q-mb-md"
                            >
                              <template v-slot:append>
                                <q-btn
                                  flat
                                  dense
                                  icon="verified"
                                  :color="accountData.phoneVerified ? 'green' : 'grey'"
                                  @click="verifyPhone"
                                >
                                  <q-tooltip>
                                    {{ accountData.phoneVerified ? '인증완료' : '미인증' }}
                                  </q-tooltip>
                                </q-btn>
                              </template>
                            </q-input>
                          </div>

                          <div class="col-12 col-md-6">
                            <q-input
                              v-model="accountForm.position"
                              label="직책"
                              outlined
                              class="q-mb-md"
                            />

                            <q-input
                              v-model="accountForm.department"
                              label="부서"
                              outlined
                              class="q-mb-md"
                            />

                            <q-select
                              v-model="accountForm.language"
                              :options="languageOptions"
                              label="언어 설정"
                              outlined
                              emit-value
                              map-options
                              class="q-mb-md"
                            />
                          </div>
                        </div>

                        <div class="q-mt-lg">
                          <q-btn
                            type="submit"
                            color="primary"
                            label="정보 저장"
                            icon="save"
                            :loading="isSaving"
                            class="q-mr-sm"
                          />
                          <q-btn
                            flat
                            label="취소"
                            @click="resetAccountForm"
                          />
                        </div>
                      </form>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="col-12 col-lg-4">
                  <q-card class="account-status-card">
                    <q-card-section>
                      <div class="text-h6 text-weight-bold q-mb-md">계정 상태</div>

                      <q-list>
                        <q-item>
                          <q-item-section avatar>
                            <q-icon
                              name="verified_user"
                              :color="accountData.isVerified ? 'green' : 'grey'"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>사업자 인증</q-item-label>
                            <q-item-label caption>
                              {{ accountData.isVerified ? '인증완료' : '미인증' }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon
                              name="email"
                              :color="accountData.emailVerified ? 'green' : 'grey'"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>이메일 인증</q-item-label>
                            <q-item-label caption>
                              {{ accountData.emailVerified ? '인증완료' : '미인증' }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon
                              name="smartphone"
                              :color="accountData.phoneVerified ? 'green' : 'grey'"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>휴대폰 인증</q-item-label>
                            <q-item-label caption>
                              {{ accountData.phoneVerified ? '인증완료' : '미인증' }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon
                              name="security"
                              :color="accountData.twoFactorEnabled ? 'green' : 'grey'"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>2단계 인증</q-item-label>
                            <q-item-label caption>
                              {{ accountData.twoFactorEnabled ? '활성화' : '비활성화' }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <q-separator class="q-my-md" />

                      <div class="text-subtitle2 text-weight-bold q-mb-sm">계정 등급</div>
                      <q-chip
                        :color="getGradeColor(accountData.grade)"
                        text-color="white"
                        icon="grade"
                        class="q-mb-md"
                      >
                        {{ accountData.grade }} 등급
                      </q-chip>

                      <div class="text-caption text-grey-6">
                        다음 등급까지: {{ accountData.nextGradeRequirement }}
                      </div>

                      <q-linear-progress
                        :value="accountData.gradeProgress / 100"
                        color="primary"
                        size="8px"
                        class="q-mt-sm"
                      />
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <!-- 사업자 정보 -->
            <q-tab-panel name="business" class="q-pa-none">
              <q-card class="settings-card">
                <q-card-section>
                  <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                    <q-icon name="business" class="q-mr-sm" />
                    사업자 정보
                  </div>

                  <form @submit.prevent="saveBusinessInfo">
                    <div class="row q-gutter-lg">
                      <!-- 기본 사업자 정보 -->
                      <div class="col-12 col-lg-6">
                        <div class="text-subtitle1 text-weight-bold q-mb-md">기본 정보</div>

                        <q-input
                          v-model="businessForm.companyName"
                          label="상호명 (법인명) *"
                          outlined
                          :rules="[val => !!val || '상호명을 입력해주세요']"
                          class="q-mb-md"
                        />

                        <q-input
                          v-model="businessForm.businessNumber"
                          label="사업자등록번호 *"
                          outlined
                          mask="###-##-#####"
                          readonly
                          class="q-mb-md"
                          hint="사업자등록번호는 변경할 수 없습니다"
                        />

                        <q-input
                          v-model="businessForm.representative"
                          label="대표자명 *"
                          outlined
                          :rules="[val => !!val || '대표자명을 입력해주세요']"
                          class="q-mb-md"
                        />

                        <q-select
                          v-model="businessForm.businessType"
                          :options="businessTypeOptions"
                          label="업태 *"
                          outlined
                          emit-value
                          map-options
                          class="q-mb-md"
                        />

                        <q-input
                          v-model="businessForm.businessItems"
                          label="종목 *"
                          outlined
                          :rules="[val => !!val || '종목을 입력해주세요']"
                          class="q-mb-md"
                          hint="예: 축산물 도매, 정육점 등"
                        />
                      </div>

                      <!-- 사업장 주소 -->
                      <div class="col-12 col-lg-6">
                        <div class="text-subtitle1 text-weight-bold q-mb-md">사업장 주소</div>

                        <div class="row q-gutter-sm q-mb-md">
                          <q-input
                            v-model="businessForm.zipCode"
                            label="우편번호 *"
                            outlined
                            class="col-4"
                            mask="#####"
                          />
                          <q-btn
                            label="주소 검색"
                            icon="search"
                            color="primary"
                            @click="searchAddress"
                            class="col"
                          />
                        </div>

                        <q-input
                          v-model="businessForm.address"
                          label="기본 주소 *"
                          outlined
                          :rules="[val => !!val || '주소를 입력해주세요']"
                          class="q-mb-md"
                        />

                        <q-input
                          v-model="businessForm.addressDetail"
                          label="상세 주소"
                          outlined
                          class="q-mb-md"
                        />

                        <q-input
                          v-model="businessForm.businessPhone"
                          label="사업장 전화번호"
                          outlined
                          mask="##-###-####"
                          class="q-mb-md"
                        />

                        <q-input
                          v-model="businessForm.fax"
                          label="팩스 번호"
                          outlined
                          mask="##-###-####"
                          class="q-mb-md"
                        />
                      </div>
                    </div>

                    <!-- 사업자등록증 -->
                    <div class="q-mt-lg">
                      <div class="text-subtitle1 text-weight-bold q-mb-md">사업자등록증</div>

                      <div class="row q-gutter-md">
                        <div v-if="businessForm.businessLicense" class="col-12 col-sm-4">
                          <q-card class="license-card">
                            <q-img
                              :src="businessForm.businessLicense"
                              style="height: 200px"
                              class="rounded-borders"
                            >
                              <div class="absolute-bottom bg-black-transparent text-white q-pa-sm">
                                <div class="text-subtitle2">사업자등록증</div>
                              </div>
                            </q-img>
                            <q-card-actions align="center">
                              <q-btn
                                flat
                                icon="edit"
                                label="변경"
                                color="primary"
                                @click="uploadBusinessLicense"
                              />
                              <q-btn
                                flat
                                icon="delete"
                                label="삭제"
                                color="red"
                                @click="deleteBusinessLicense"
                              />
                            </q-card-actions>
                          </q-card>
                        </div>

                        <div v-else class="col-12 col-sm-4">
                          <q-card
                            class="license-upload-card cursor-pointer"
                            flat
                            bordered
                            @click="uploadBusinessLicense"
                          >
                            <q-card-section class="text-center q-py-xl">
                              <q-icon name="cloud_upload" size="48px" color="primary" />
                              <div class="text-subtitle2 text-primary q-mt-sm">
                                사업자등록증 업로드
                              </div>
                              <div class="text-caption text-grey-6">
                                클릭하여 파일을 업로드하세요
                              </div>
                            </q-card-section>
                          </q-card>
                        </div>
                      </div>
                    </div>

                    <div class="q-mt-lg">
                      <q-btn
                        type="submit"
                        color="primary"
                        label="사업자 정보 저장"
                        icon="save"
                        :loading="isSavingBusiness"
                        class="q-mr-sm"
                      />
                      <q-btn
                        flat
                        label="취소"
                        @click="resetBusinessForm"
                      />
                    </div>
                  </form>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 보안 설정 -->
            <q-tab-panel name="security" class="q-pa-none">
              <div class="row q-gutter-lg">
                <!-- 비밀번호 변경 -->
                <div class="col-12 col-lg-6">
                  <q-card class="settings-card">
                    <q-card-section>
                      <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                        <q-icon name="lock" class="q-mr-sm" />
                        비밀번호 변경
                      </div>

                      <form @submit.prevent="changePassword">
                        <q-input
                          v-model="passwordForm.current"
                          label="현재 비밀번호 *"
                          type="password"
                          outlined
                          class="q-mb-md"
                          :rules="[val => !!val || '현재 비밀번호를 입력해주세요']"
                        />

                        <q-input
                          v-model="passwordForm.new"
                          label="새 비밀번호 *"
                          type="password"
                          outlined
                          class="q-mb-md"
                          :rules="[validatePassword]"
                        >
                          <template v-slot:hint>
                            <div class="text-caption">
                              <div>• 8자 이상</div>
                              <div>• 영문 대소문자, 숫자, 특수문자 조합</div>
                            </div>
                          </template>
                        </q-input>

                        <q-input
                          v-model="passwordForm.confirm"
                          label="새 비밀번호 확인 *"
                          type="password"
                          outlined
                          class="q-mb-md"
                          :rules="[validatePasswordConfirm]"
                        />

                        <q-btn
                          type="submit"
                          color="primary"
                          label="비밀번호 변경"
                          icon="save"
                          :loading="isChangingPassword"
                          :disable="!canChangePassword"
                        />
                      </form>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 보안 설정 -->
                <div class="col-12 col-lg-6">
                  <q-card class="settings-card">
                    <q-card-section>
                      <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                        <q-icon name="security" class="q-mr-sm" />
                        보안 설정
                      </div>

                      <q-list>
                        <!-- 2단계 인증 -->
                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="verified_user" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>2단계 인증 (OTP)</q-item-label>
                            <q-item-label caption>
                              계정 보안을 위한 추가 인증
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="securitySettings.twoFactorEnabled"
                              color="primary"
                              @update:model-value="toggleTwoFactor"
                            />
                          </q-item-section>
                        </q-item>

                        <!-- 로그인 알림 -->
                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="notifications" color="orange" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>로그인 알림</q-item-label>
                            <q-item-label caption>
                              새로운 기기에서 로그인 시 알림
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="securitySettings.loginNotification"
                              color="orange"
                            />
                          </q-item-section>
                        </q-item>

                        <!-- 자동 로그아웃 -->
                        <q-item>
                          <q-item-section avatar>
                            <q-icon name="logout" color="red" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>자동 로그아웃</q-item-label>
                            <q-item-label caption>
                              비활성 상태 시 자동 로그아웃
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-select
                              v-model="securitySettings.autoLogoutTime"
                              :options="autoLogoutOptions"
                              emit-value
                              map-options
                              dense
                              outlined
                              style="width: 120px"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <q-separator class="q-my-md" />

                      <div class="text-subtitle1 text-weight-bold q-mb-md">
                        최근 로그인 기록
                      </div>
                      <q-list dense>
                        <q-item
                          v-for="login in recentLogins.slice(0, 3)"
                          :key="login.id"
                        >
                          <q-item-section avatar>
                            <q-icon
                              :name="getDeviceIcon(login.device)"
                              :color="login.success ? 'green' : 'red'"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>
                              {{ login.location }} - {{ formatDateTime(login.timestamp) }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-chip
                              :color="login.success ? 'green' : 'red'"
                              text-color="white"
                              size="sm"
                            >
                              {{ login.success ? '성공' : '실패' }}
                            </q-chip>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <q-btn
                        flat
                        label="전체 기록 보기"
                        color="primary"
                        @click="showLoginHistory"
                        class="q-mt-sm"
                      />
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <!-- 알림 설정 -->
            <q-tab-panel name="notifications" class="q-pa-none">
              <q-card class="settings-card">
                <q-card-section>
                  <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                    <q-icon name="notifications" class="q-mr-sm" />
                    알림 설정
                  </div>

                  <div class="notification-groups">
                    <div
                      v-for="group in notificationSettings"
                      :key="group.category"
                      class="notification-group q-mb-xl"
                    >
                      <div class="text-subtitle1 text-weight-bold q-mb-md">
                        <q-icon :name="group.icon" class="q-mr-sm" />
                        {{ group.title }}
                      </div>

                      <q-list>
                        <q-item
                          v-for="setting in group.settings"
                          :key="setting.key"
                          class="notification-item"
                        >
                          <q-item-section>
                            <q-item-label>{{ setting.title }}</q-item-label>
                            <q-item-label caption class="text-grey-6">
                              {{ setting.description }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side class="notification-toggles">
                            <div class="row q-gutter-md">
                              <div class="col-auto">
                                <q-toggle
                                  v-model="setting.email"
                                  color="primary"
                                  label="이메일"
                                  left-label
                                  dense
                                />
                              </div>
                              <div class="col-auto">
                                <q-toggle
                                  v-model="setting.sms"
                                  color="orange"
                                  label="SMS"
                                  left-label
                                  dense
                                />
                              </div>
                              <div class="col-auto">
                                <q-toggle
                                  v-model="setting.push"
                                  color="green"
                                  label="앱 알림"
                                  left-label
                                  dense
                                />
                              </div>
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>

                  <!-- 알림 시간 설정 -->
                  <q-separator class="q-my-lg" />

                  <div class="text-subtitle1 text-weight-bold q-mb-md">
                    알림 수신 시간
                  </div>
                  <div class="row q-gutter-md">
                    <q-time
                      v-model="notificationTime.start"
                      mask="HH:mm"
                      format24h
                      class="col-auto"
                    >
                      <div class="text-caption text-center">시작 시간</div>
                    </q-time>
                    <q-time
                      v-model="notificationTime.end"
                      mask="HH:mm"
                      format24h
                      class="col-auto"
                    >
                      <div class="text-caption text-center">종료 시간</div>
                    </q-time>
                  </div>
                  <div class="text-caption text-grey-6 q-mt-sm">
                    설정한 시간 외에는 긴급 알림만 수신됩니다.
                  </div>

                  <div class="q-mt-lg">
                    <q-btn
                      color="primary"
                      label="알림 설정 저장"
                      icon="save"
                      @click="saveNotificationSettings"
                      :loading="isSavingNotifications"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 결제 설정 -->
            <q-tab-panel name="payment" class="q-pa-none">
              <div class="row q-gutter-lg">
                <!-- 결제 수단 관리 -->
                <div class="col-12 col-lg-8">
                  <q-card class="settings-card">
                    <q-card-section>
                      <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                        <q-icon name="payment" class="q-mr-sm" />
                        등록된 결제 수단
                      </div>

                      <div class="payment-methods">
                        <div
                          v-for="method in paymentMethods"
                          :key="method.id"
                          class="payment-method-item q-mb-md"
                        >
                          <q-card flat bordered>
                            <q-card-section class="row items-center">
                              <q-avatar size="48px" class="q-mr-md">
                                <q-icon
                                  :name="getPaymentIcon(method.type)"
                                  :color="getPaymentColor(method.type)"
                                  size="24px"
                                />
                              </q-avatar>
                              <div class="col">
                                <div class="text-subtitle1 text-weight-bold">
                                  {{ method.name }}
                                </div>
                                <div class="text-caption text-grey-6">
                                  {{ method.description }}
                                </div>
                              </div>
                              <div class="row items-center q-gutter-sm">
                                <q-chip
                                  v-if="method.isDefault"
                                  color="primary"
                                  text-color="white"
                                  size="sm"
                                >
                                  기본 결제
                                </q-chip>
                                <q-btn
                                  flat
                                  icon="edit"
                                  color="primary"
                                  @click="editPaymentMethod(method.id)"
                                />
                                <q-btn
                                  flat
                                  icon="delete"
                                  color="red"
                                  @click="deletePaymentMethod(method.id)"
                                />
                              </div>
                            </q-card-section>
                          </q-card>
                        </div>

                        <q-btn
                          color="primary"
                          icon="add"
                          label="새 결제 수단 추가"
                          @click="addPaymentMethod"
                          class="full-width"
                          outlined
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 결제 설정 -->
                <div class="col-12 col-lg-4">
                  <q-card class="settings-card">
                    <q-card-section>
                      <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                        <q-icon name="settings" class="q-mr-sm" />
                        결제 설정
                      </div>

                      <q-list>
                        <!-- 자동 결제 -->
                        <q-item>
                          <q-item-section>
                            <q-item-label>자동 결제</q-item-label>
                            <q-item-label caption>
                              월 정기 결제 자동 처리
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="paymentSettings.autoPayment"
                              color="primary"
                            />
                          </q-item-section>
                        </q-item>

                        <!-- 결제 알림 -->
                        <q-item>
                          <q-item-section>
                            <q-item-label>결제 알림</q-item-label>
                            <q-item-label caption>
                              결제 완료/실패 시 알림
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="paymentSettings.paymentNotification"
                              color="orange"
                            />
                          </q-item-section>
                        </q-item>

                        <!-- 세금계산서 자동 발행 -->
                        <q-item>
                          <q-item-section>
                            <q-item-label>세금계산서 자동 발행</q-item-label>
                            <q-item-label caption>
                              결제 완료 시 자동 발행
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="paymentSettings.autoInvoice"
                              color="green"
                            />
                          </q-item-section>
                        </q-item>

                        <!-- 월별 한도 -->
                        <q-item>
                          <q-item-section>
                            <q-item-label>월별 결제 한도</q-item-label>
                            <q-item-label caption>
                              월간 최대 결제 금액 설정
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-input
                              v-model.number="paymentSettings.monthlyLimit"
                              type="number"
                              suffix="원"
                              dense
                              outlined
                              style="width: 120px"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <q-separator class="q-my-md" />

                      <div class="text-subtitle1 text-weight-bold q-mb-md">
                        이번 달 결제 현황
                      </div>
                      <div class="payment-stats">
                        <div class="stat-item q-mb-sm">
                          <div class="text-caption text-grey-6">결제 횟수</div>
                          <div class="text-h6 text-weight-bold">{{ paymentStats.count }}회</div>
                        </div>
                        <div class="stat-item q-mb-sm">
                          <div class="text-caption text-grey-6">결제 금액</div>
                          <div class="text-h6 text-weight-bold text-primary">
                            {{ formatCurrency(paymentStats.amount) }}
                          </div>
                        </div>
                        <div class="stat-item">
                          <div class="text-caption text-grey-6">남은 한도</div>
                          <div class="text-body2">
                            {{ formatCurrency(paymentSettings.monthlyLimit - paymentStats.amount) }}
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <!-- 개인정보 설정 -->
            <q-tab-panel name="privacy" class="q-pa-none">
              <q-card class="settings-card">
                <q-card-section>
                  <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                    <q-icon name="privacy_tip" class="q-mr-sm" />
                    개인정보 및 데이터 설정
                  </div>

                  <div class="privacy-sections">
                    <!-- 데이터 사용 동의 -->
                    <div class="privacy-section q-mb-xl">
                      <div class="text-subtitle1 text-weight-bold q-mb-md">
                        데이터 사용 동의
                      </div>
                      <q-list>
                        <q-item
                          v-for="consent in privacyConsents"
                          :key="consent.key"
                        >
                          <q-item-section>
                            <q-item-label>{{ consent.title }}</q-item-label>
                            <q-item-label caption>{{ consent.description }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="consent.agreed"
                              :color="consent.required ? 'primary' : 'grey'"
                              :disable="consent.required"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                    <!-- 데이터 관리 -->
                    <div class="privacy-section q-mb-xl">
                      <div class="text-subtitle1 text-weight-bold q-mb-md">
                        데이터 관리
                      </div>
                      <q-list>
                        <q-item clickable @click="downloadData">
                          <q-item-section avatar>
                            <q-icon name="download" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>내 데이터 다운로드</q-item-label>
                            <q-item-label caption>
                              가입 이후 모든 데이터를 다운로드합니다
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-icon name="chevron_right" />
                          </q-item-section>
                        </q-item>

                        <q-item clickable @click="deleteData">
                          <q-item-section avatar>
                            <q-icon name="delete_forever" color="red" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label class="text-red">계정 및 데이터 삭제</q-item-label>
                            <q-item-label caption>
                              계정과 모든 데이터가 영구적으로 삭제됩니다
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-icon name="chevron_right" color="red" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                    <!-- 쿠키 설정 -->
                    <div class="privacy-section">
                      <div class="text-subtitle1 text-weight-bold q-mb-md">
                        쿠키 및 추적 설정
                      </div>
                      <q-list>
                        <q-item
                          v-for="cookie in cookieSettings"
                          :key="cookie.key"
                        >
                          <q-item-section>
                            <q-item-label>{{ cookie.title }}</q-item-label>
                            <q-item-label caption>{{ cookie.description }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="cookie.enabled"
                              :color="cookie.essential ? 'primary' : 'grey'"
                              :disable="cookie.essential"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>

                  <div class="q-mt-lg">
                    <q-btn
                      color="primary"
                      label="개인정보 설정 저장"
                      icon="save"
                      @click="savePrivacySettings"
                      :loading="isSavingPrivacy"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 시스템 설정 -->
            <q-tab-panel name="system" class="q-pa-none">
              <div class="row q-gutter-lg">
                <!-- 앱 설정 -->
                <div class="col-12 col-lg-6">
                  <q-card class="settings-card">
                    <q-card-section>
                      <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                        <q-icon name="settings" class="q-mr-sm" />
                        앱 설정
                      </div>

                      <q-list>
                        <!-- 언어 설정 -->
                        <q-item>
                          <q-item-section>
                            <q-item-label>언어</q-item-label>
                            <q-item-label caption>앱 사용 언어</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-select
                              v-model="systemSettings.language"
                              :options="languageOptions"
                              emit-value
                              map-options
                              dense
                              outlined
                              style="width: 120px"
                            />
                          </q-item-section>
                        </q-item>

                        <!-- 테마 설정 -->
                        <q-item>
                          <q-item-section>
                            <q-item-label>테마</q-item-label>
                            <q-item-label caption>앱 테마 설정</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-select
                              v-model="systemSettings.theme"
                              :options="themeOptions"
                              emit-value
                              map-options
                              dense
                              outlined
                              style="width: 120px"
                            />
                          </q-item-section>
                        </q-item>

                        <!-- 자동 업데이트 -->
                        <q-item>
                          <q-item-section>
                            <q-item-label>자동 업데이트</q-item-label>
                            <q-item-label caption>앱 자동 업데이트</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="systemSettings.autoUpdate"
                              color="primary"
                            />
                          </q-item-section>
                        </q-item>

                        <!-- 오프라인 모드 -->
                        <q-item>
                          <q-item-section>
                            <q-item-label>오프라인 데이터</q-item-label>
                            <q-item-label caption>네트워크 없이도 기본 기능 사용</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="systemSettings.offlineMode"
                              color="orange"
                            />
                          </q-item-section>
                        </q-item>

                        <!-- 분석 데이터 수집 -->
                        <q-item>
                          <q-item-section>
                            <q-item-label>사용 분석</q-item-label>
                            <q-item-label caption>서비스 개선을 위한 사용 데이터 수집</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              v-model="systemSettings.analytics"
                              color="green"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <q-separator class="q-my-md" />

                      <!-- 캐시 관리 -->
                      <div class="text-subtitle1 text-weight-bold q-mb-md">
                        저장소 관리
                      </div>
                      <div class="storage-info q-mb-md">
                        <div class="row items-center justify-between">
                          <div>
                            <div class="text-body2">캐시 데이터</div>
                            <div class="text-caption text-grey-6">
                              {{ formatBytes(systemInfo.cacheSize) }}
                            </div>
                          </div>
                          <q-btn
                            flat
                            label="삭제"
                            color="red"
                            @click="clearCache"
                          />
                        </div>
                        <div class="row items-center justify-between">
                          <div>
                            <div class="text-body2">오프라인 데이터</div>
                            <div class="text-caption text-grey-6">
                              {{ formatBytes(systemInfo.offlineSize) }}
                            </div>
                          </div>
                          <q-btn
                            flat
                            label="삭제"
                            color="red"
                            @click="clearOfflineData"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 시스템 정보 -->
                <div class="col-12 col-lg-6">
                  <q-card class="settings-card">
                    <q-card-section>
                      <div class="text-h6 text-weight-bold q-mb-lg text-primary">
                        <q-icon name="info" class="q-mr-sm" />
                        시스템 정보
                      </div>

                      <q-list>
                        <q-item>
                          <q-item-section>
                            <q-item-label>앱 버전</q-item-label>
                            <q-item-label caption>{{ systemInfo.appVersion }}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section>
                            <q-item-label>빌드 번호</q-item-label>
                            <q-item-label caption>{{ systemInfo.buildNumber }}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section>
                            <q-item-label>플랫폼</q-item-label>
                            <q-item-label caption>{{ systemInfo.platform }}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section>
                            <q-item-label>브라우저</q-item-label>
                            <q-item-label caption>{{ systemInfo.browser }}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section>
                            <q-item-label>마지막 업데이트</q-item-label>
                            <q-item-label caption>{{ formatDateTime(systemInfo.lastUpdate) }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <q-separator class="q-my-md" />

                      <!-- 도구 -->
                      <div class="text-subtitle1 text-weight-bold q-mb-md">
                        도구
                      </div>
                      <div class="row q-gutter-sm">
                        <q-btn
                          outline
                          color="primary"
                          icon="bug_report"
                          label="버그 신고"
                          @click="reportBug"
                        />
                        <q-btn
                          outline
                          color="green"
                          icon="feedback"
                          label="피드백"
                          @click="sendFeedback"
                        />
                        <q-btn
                          outline
                          color="orange"
                          icon="help"
                          label="도움말"
                          @click="showHelp"
                        />
                      </div>

                      <q-separator class="q-my-md" />

                      <!-- 로그아웃 -->
                      <div class="text-subtitle1 text-weight-bold q-mb-md text-red">
                        위험 구역
                      </div>
                      <div class="row q-gutter-sm">
                        <q-btn
                          color="red"
                          icon="logout"
                          label="로그아웃"
                          @click="logout"
                          class="q-mr-sm"
                        />
                        <q-btn
                          outline
                          color="red"
                          icon="delete_forever"
                          label="계정 탈퇴"
                          @click="deleteAccount"
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
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
const activeTab = ref('account');
const isSaving = ref(false);
const isSavingBusiness = ref(false);
const isSavingNotifications = ref(false);
const isSavingPrivacy = ref(false);
const isChangingPassword = ref(false);

// 계정 데이터
const accountData = ref({
  name: '김담당',
  email: 'manager@yukpro.com',
  phone: '010-1234-5678',
  position: '구매팀장',
  department: '구매부',
  language: 'ko',
  profileImage: '',
  joinDate: '2024-01-15T00:00:00Z',
  isVerified: true,
  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: false,
  grade: 'GOLD',
  gradeProgress: 75,
  nextGradeRequirement: '다음 등급까지 3개월 거래'
});

// 폼 데이터
const accountForm = ref({ ...accountData.value });
const businessForm = ref({
  companyName: '육프로 레스토랑',
  businessNumber: '123-45-67890',
  representative: '김사장',
  businessType: 'restaurant',
  businessItems: '한식, 육류요리',
  zipCode: '06234',
  address: '서울특별시 강남구 테헤란로 123',
  addressDetail: '육프로빌딩 2층',
  businessPhone: '02-1234-5678',
  fax: '02-1234-5679',
  businessLicense: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=사업자등록증'
});

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});

// 보안 설정
const securitySettings = ref({
  twoFactorEnabled: false,
  loginNotification: true,
  autoLogoutTime: 60
});

// 결제 설정
const paymentSettings = ref({
  autoPayment: true,
  paymentNotification: true,
  autoInvoice: true,
  monthlyLimit: 10000000
});

// 시스템 설정
const systemSettings = ref({
  language: 'ko',
  theme: 'light',
  autoUpdate: true,
  offlineMode: false,
  analytics: true
});

// 알림 설정
const notificationSettings = ref([
  {
    category: 'order',
    icon: 'shopping_cart',
    title: '주문 관련',
    settings: [
      {
        key: 'order_confirmed',
        title: '주문 확인',
        description: '주문이 확인되었을 때',
        email: true,
        sms: true,
        push: true
      },
      {
        key: 'order_shipped',
        title: '배송 시작',
        description: '상품이 배송 시작되었을 때',
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
    category: 'payment',
    icon: 'payment',
    title: '결제 관련',
    settings: [
      {
        key: 'payment_success',
        title: '결제 완료',
        description: '결제가 성공했을 때',
        email: true,
        sms: true,
        push: true
      },
      {
        key: 'payment_failed',
        title: '결제 실패',
        description: '결제가 실패했을 때',
        email: true,
        sms: true,
        push: true
      },
      {
        key: 'invoice_issued',
        title: '세금계산서 발행',
        description: '세금계산서가 발행되었을 때',
        email: true,
        sms: false,
        push: false
      }
    ]
  },
  {
    category: 'marketing',
    icon: 'campaign',
    title: '마케팅',
    settings: [
      {
        key: 'promotions',
        title: '프로모션 알림',
        description: '할인 및 이벤트 정보',
        email: true,
        sms: false,
        push: false
      },
      {
        key: 'newsletter',
        title: '뉴스레터',
        description: '업계 뉴스 및 정보',
        email: false,
        sms: false,
        push: false
      }
    ]
  }
]);

const notificationTime = ref({
  start: '09:00',
  end: '18:00'
});

// 개인정보 설정
const privacyConsents = ref([
  {
    key: 'required',
    title: '필수 개인정보 처리',
    description: '서비스 이용에 필요한 최소한의 개인정보',
    agreed: true,
    required: true
  },
  {
    key: 'marketing',
    title: '마케팅 정보 수신',
    description: '프로모션 및 이벤트 정보 수신 동의',
    agreed: false,
    required: false
  },
  {
    key: 'analytics',
    title: '서비스 분석 및 개선',
    description: '서비스 품질 향상을 위한 데이터 분석',
    agreed: true,
    required: false
  }
]);

const cookieSettings = ref([
  {
    key: 'essential',
    title: '필수 쿠키',
    description: '웹사이트 기본 기능에 필요한 쿠키',
    enabled: true,
    essential: true
  },
  {
    key: 'analytics',
    title: '분석 쿠키',
    description: '사용자 행동 분석을 위한 쿠키',
    enabled: true,
    essential: false
  },
  {
    key: 'marketing',
    title: '마케팅 쿠키',
    description: '맞춤형 광고 제공을 위한 쿠키',
    enabled: false,
    essential: false
  }
]);

// 옵션 데이터
const languageOptions = [
  { label: '한국어', value: 'ko' },
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'ja' }
];

const businessTypeOptions = [
  { label: '음식점', value: 'restaurant' },
  { label: '정육점', value: 'butcher' },
  { label: '프랜차이즈', value: 'franchise' },
  { label: '도매업', value: 'wholesale' },
  { label: '기타', value: 'other' }
];

const autoLogoutOptions = [
  { label: '15분', value: 15 },
  { label: '30분', value: 30 },
  { label: '1시간', value: 60 },
  { label: '2시간', value: 120 },
  { label: '사용 안함', value: 0 }
];

const themeOptions = [
  { label: '라이트', value: 'light' },
  { label: '다크', value: 'dark' },
  { label: '시스템', value: 'system' }
];

// 결제 수단 데이터
const paymentMethods = ref([
  {
    id: 1,
    type: 'card',
    name: '기업카드',
    description: '하나카드 **** 1234',
    isDefault: true
  },
  {
    id: 2,
    type: 'bank',
    name: '계좌이체',
    description: '신한은행 110-123-456789',
    isDefault: false
  }
]);

// 결제 통계
const paymentStats = ref({
  count: 12,
  amount: 8500000
});

// 로그인 기록
const recentLogins = ref([
  {
    id: 1,
    device: 'Chrome on Windows',
    location: '서울, 대한민국',
    timestamp: '2024-07-20T10:30:00Z',
    success: true
  },
  {
    id: 2,
    device: 'Safari on iPhone',
    location: '서울, 대한민국',
    timestamp: '2024-07-19T16:45:00Z',
    success: true
  },
  {
    id: 3,
    device: 'Chrome on Android',
    location: '부산, 대한민국',
    timestamp: '2024-07-18T14:20:00Z',
    success: false
  }
]);

// 시스템 정보
const systemInfo = ref({
  appVersion: '1.2.3',
  buildNumber: '20240720.1',
  platform: 'Web (PWA)',
  browser: 'Chrome 126.0.6478.127',
  lastUpdate: '2024-07-20T00:00:00Z',
  cacheSize: 25600000, // 25MB
  offlineSize: 10240000 // 10MB
});

// 계산된 속성
const canChangePassword = computed(() => {
  return passwordForm.value.current &&
    passwordForm.value.new &&
    passwordForm.value.confirm &&
    passwordForm.value.new === passwordForm.value.confirm;
});

// 메서드
const goBack = () => {
  router.go(-1);
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) || '올바른 이메일 형식이 아닙니다';
};

const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!minLength) return '비밀번호는 8자 이상이어야 합니다';
  if (!hasLetter) return '영문자를 포함해야 합니다';
  if (!hasNumber) return '숫자를 포함해야 합니다';
  if (!hasSpecial) return '특수문자를 포함해야 합니다';

  return true;
};

const validatePasswordConfirm = (confirm: string) => {
  return confirm === passwordForm.value.new || '새 비밀번호와 일치하지 않습니다';
};

const getGradeColor = (grade: string) => {
  const colors = {
    BRONZE: 'brown',
    SILVER: 'grey',
    GOLD: 'amber',
    PLATINUM: 'blue',
    DIAMOND: 'purple'
  };
  return colors[grade] || 'grey';
};

const getDeviceIcon = (device: string) => {
  if (device.includes('iPhone') || device.includes('Android')) {
    return 'smartphone';
  }
  return 'computer';
};

const getPaymentIcon = (type: string) => {
  const icons = {
    card: 'credit_card',
    bank: 'account_balance',
    virtual: 'account_balance_wallet'
  };
  return icons[type] || 'payment';
};

const getPaymentColor = (type: string) => {
  const colors = {
    card: 'blue',
    bank: 'green',
    virtual: 'orange'
  };
  return colors[type] || 'grey';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR');
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('ko-KR') + '원';
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 이벤트 핸들러
const saveAccountInfo = async () => {
  isSaving.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    Object.assign(accountData.value, accountForm.value);
    $q.notify({
      type: 'positive',
      message: '계정 정보가 저장되었습니다',
      icon: 'check'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '저장 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isSaving.value = false;
  }
};

const resetAccountForm = () => {
  accountForm.value = { ...accountData.value };
};

const changeProfileImage = () => {
  $q.notify({
    type: 'info',
    message: '프로필 사진 변경 기능을 준비 중입니다',
    icon: 'camera_alt'
  });
};

const verifyPhone = () => {
  $q.dialog({
    title: '휴대폰 인증',
    message: '휴대폰 번호로 인증번호를 발송하시겠습니까?',
    cancel: true
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: '인증번호가 발송되었습니다',
      icon: 'sms'
    });
  });
};

const saveBusinessInfo = async () => {
  isSavingBusiness.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    $q.notify({
      type: 'positive',
      message: '사업자 정보가 저장되었습니다',
      icon: 'check'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '저장 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isSavingBusiness.value = false;
  }
};

const resetBusinessForm = () => {
  // 원본 데이터로 리셋
};

const searchAddress = () => {
  $q.notify({
    type: 'info',
    message: '주소 검색 기능을 준비 중입니다',
    icon: 'search'
  });
};

const uploadBusinessLicense = () => {
  $q.notify({
    type: 'info',
    message: '사업자등록증 업로드 기능을 준비 중입니다',
    icon: 'upload'
  });
};

const deleteBusinessLicense = () => {
  $q.dialog({
    title: '사업자등록증 삭제',
    message: '사업자등록증을 삭제하시겠습니까?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    businessForm.value.businessLicense = '';
    $q.notify({
      type: 'positive',
      message: '사업자등록증이 삭제되었습니다',
      icon: 'delete'
    });
  });
};

const changePassword = async () => {
  isChangingPassword.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    passwordForm.value = { current: '', new: '', confirm: '' };
    $q.notify({
      type: 'positive',
      message: '비밀번호가 변경되었습니다',
      icon: 'check'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '비밀번호 변경 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isChangingPassword.value = false;
  }
};

const toggleTwoFactor = (enabled: boolean) => {
  if (enabled) {
    $q.dialog({
      title: '2단계 인증 설정',
      message: '2단계 인증을 활성화하시겠습니까?',
      cancel: true
    }).onOk(() => {
      $q.notify({
        type: 'positive',
        message: '2단계 인증이 활성화되었습니다',
        icon: 'security'
      });
    }).onCancel(() => {
      securitySettings.value.twoFactorEnabled = false;
    });
  }
};

const showLoginHistory = () => {
  router.push('/account/login-history');
};

const saveNotificationSettings = async () => {
  isSavingNotifications.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    $q.notify({
      type: 'positive',
      message: '알림 설정이 저장되었습니다',
      icon: 'notifications'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '저장 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isSavingNotifications.value = false;
  }
};

const addPaymentMethod = () => {
  router.push('/account/payment-methods/add');
};

const editPaymentMethod = (methodId: number) => {
  router.push(`/account/payment-methods/edit/${methodId}`);
};

const deletePaymentMethod = (methodId: number) => {
  $q.dialog({
    title: '결제 수단 삭제',
    message: '선택한 결제 수단을 삭제하시겠습니까?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    const index = paymentMethods.value.findIndex(method => method.id === methodId);
    if (index > -1) {
      paymentMethods.value.splice(index, 1);
    }
    $q.notify({
      type: 'positive',
      message: '결제 수단이 삭제되었습니다',
      icon: 'delete'
    });
  });
};

const downloadData = () => {
  $q.dialog({
    title: '데이터 다운로드',
    message: '모든 개인 데이터를 다운로드하시겠습니까? 준비하는 데 시간이 걸릴 수 있습니다.',
    cancel: true
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: '데이터 다운로드 요청이 접수되었습니다. 완료 시 이메일로 안내드립니다.',
      icon: 'download'
    });
  });
};

const deleteData = () => {
  $q.dialog({
    title: '계정 삭제',
    message: '정말로 계정과 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(() => {
    $q.dialog({
      title: '최종 확인',
      message: '계정 삭제를 위해 "삭제"를 입력해주세요.',
      prompt: {
        model: '',
        type: 'text'
      },
      cancel: true,
      persistent: true
    }).onOk((data) => {
      if (data === '삭제') {
        $q.notify({
          type: 'positive',
          message: '계정 삭제 요청이 접수되었습니다',
          icon: 'delete_forever'
        });
        setTimeout(() => {
          authStore.logout();
          router.push('/');
        }, 2000);
      } else {
        $q.notify({
          type: 'negative',
          message: '입력이 올바르지 않습니다',
          icon: 'error'
        });
      }
    });
  });
};

const savePrivacySettings = async () => {
  isSavingPrivacy.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    $q.notify({
      type: 'positive',
      message: '개인정보 설정이 저장되었습니다',
      icon: 'privacy_tip'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '저장 중 오류가 발생했습니다',
      icon: 'error'
    });
  } finally {
    isSavingPrivacy.value = false;
  }
};

const clearCache = () => {
  $q.dialog({
    title: '캐시 삭제',
    message: '캐시를 삭제하시겠습니까? 앱 로딩이 느려질 수 있습니다.',
    cancel: true
  }).onOk(() => {
    systemInfo.value.cacheSize = 0;
    $q.notify({
      type: 'positive',
      message: '캐시가 삭제되었습니다',
      icon: 'cleaning_services'
    });
  });
};

const clearOfflineData = () => {
  $q.dialog({
    title: '오프라인 데이터 삭제',
    message: '오프라인 데이터를 삭제하시겠습니까?',
    cancel: true
  }).onOk(() => {
    systemInfo.value.offlineSize = 0;
    $q.notify({
      type: 'positive',
      message: '오프라인 데이터가 삭제되었습니다',
      icon: 'cloud_off'
    });
  });
};

const reportBug = () => {
  router.push('/support/bug-report');
};

const sendFeedback = () => {
  router.push('/support/feedback');
};

const showHelp = () => {
  router.push('/help');
};

const contactSupport = () => {
  router.push('/support');
};

const logout = () => {
  $q.dialog({
    title: '로그아웃',
    message: '정말 로그아웃하시겠습니까?',
    cancel: true
  }).onOk(() => {
    authStore.logout();
    router.push('/');
  });
};

const deleteAccount = () => {
  deleteData();
};

// 생명주기
onMounted(() => {
  // URL 파라미터에 따른 탭 설정
  const tab = router.currentRoute.value.query.tab;
  if (tab && typeof tab === 'string') {
    activeTab.value = tab;
  }
});
</script>

<style scoped>
.settings-page {
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
  align-items: center;
}

.settings-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.account-status-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  height: fit-content;
}

.license-card {
  border-radius: 8px;
  overflow: hidden;
}

.license-upload-card {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.license-upload-card:hover {
  border-color: var(--q-primary);
  background: rgba(25, 118, 210, 0.04);
}

.notification-groups {
  max-width: 100%;
}

.notification-group {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.notification-item {
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
}

.notification-toggles {
  min-width: 300px;
}

.payment-method-item {
  transition: all 0.3s ease;
}

.payment-method-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.payment-stats {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.privacy-section {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.storage-info {
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

  .text-h4 {
    font-size: 1.5rem;
  }

  .notification-toggles {
    min-width: auto;
  }

  .notification-toggles .row {
    flex-direction: column;
    gap: 8px;
  }
}

/* 다크 테마 지원 */
.body--dark .settings-card {
  background: #2d2d2d;
  border-color: #404040;
}

.body--dark .notification-group,
.body--dark .privacy-section {
  background: #353535;
  border-color: #404040;
}

.body--dark .payment-stats,
.body--dark .storage-info {
  background: #353535;
}

/* 애니메이션 */
.settings-card {
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

/* 탭 전환 애니메이션 */
.q-tab-panel {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 상태 표시 */
.verified-icon {
  color: #4caf50;
}

.unverified-icon {
  color: #ff9800;
}

/* 폼 스타일링 */
.q-field {
  margin-bottom: 16px;
}

.q-btn {
  text-transform: none;
}

/* 위험 구역 스타일 */
.text-red {
  color: #f44336 !important;
}

/* 토글 그룹 */
.notification-toggles .q-toggle {
  margin-right: 16px;
}

/* 등급 진행률 */
.q-linear-progress {
  border-radius: 4px;
}

/* 결제 수단 카드 */
.payment-method-item .q-card {
  border-left: 4px solid var(--q-primary);
}

/* 시스템 정보 */
.q-list .q-item {
  padding: 8px 0;
}

/* 로딩 상태 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
