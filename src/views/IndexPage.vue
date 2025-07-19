<template>
  <q-page class="bg-grey-2">
    <!-- 헤더 영역 -->
    <q-header elevated class="bg-orange-8 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          육프로
        </q-toolbar-title>
        <q-btn flat round icon="search" @click="showSearch = true" />
      </q-toolbar>
    </q-header>

    <!-- 카테고리 탭 -->
    <q-tabs
        v-model="currentTab"
        active-color="orange"
        indicator-color="orange"
        align="justify"
        class="bg-white text-grey-8 shadow-1"
    >
      <q-tab name="beef" icon="img:icons/beef.png" label="소고기" />
      <q-tab name="pork" icon="img:icons/pork.png" label="돼지고기" />
      <q-tab name="chicken" icon="img:icons/chicken.png" label="닭고기" />
    </q-tabs>

    <!-- 상품 목록 -->
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card
          v-for="product in filteredProducts"
          :key="product.id"
          class="my-card col-5"
          flat
          bordered
      >
        <q-img
            :src="product.image"
            basic
            style="height: 120px"
        >
          <div class="absolute-bottom text-subtitle2 text-center">
            {{ product.name }}
          </div>
        </q-img>

        <q-card-section class="q-pt-none">
          <div class="text-orange text-h6 text-center">
            {{ product.price }}원 <small>/5kg</small>
          </div>
          <q-badge color="orange" class="q-mt-sm">
            최소 {{ product.minOrder }}kg
          </q-badge>
        </q-card-section>
      </q-card>
    </div>

    <!-- PWA 설치 배너 -->
    <q-banner v-if="showPwaInstallBanner" class="bg-orange-1 text-orange-8">
      <template v-slot:avatar>
        <q-icon name="install_mobile" color="orange" />
      </template>
      홈 화면에 추가하여 편리하게 이용하세요!
      <template v-slot:action>
        <q-btn flat label="설치" @click="installPWA" />
      </template>
    </q-banner>

    <!-- 검색 다이얼로그 -->
    <q-dialog v-model="showSearch">
      <q-card style="width: 100%">
        <q-input
            v-model="searchKeyword"
            placeholder="'소고기 안심' 검색"
            filled
            dense
            class="q-pa-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'beef',
      showPwaInstallBanner: false,
      showSearch: false,
      searchKeyword: '',
      products: [
        {
          id: 1,
          name: '한우 등심 1++',
          price: '75,000',
          minOrder: 5,
          image: 'https://via.placeholder.com/300?text=Beef',
          category: 'beef'
        },
        // 추가 상품 데이터...
      ]
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter(
          p => p.category === this.currentTab
      )
    }
  },
  methods: {
    installPWA() {
      // PWA 설치 로직 (Quasar PWA 모듈)
      window.deferredPrompt.prompt()
    }
  },
  mounted() {
    // PWA 설치 가능 시 배너 표시
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      window.deferredPrompt = e
      this.showPwaInstallBanner = true
    })
  }
}
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
}
</style>
