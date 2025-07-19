<template>
  <q-dialog v-model="showUpdate" persistent>
    <q-card class="pwa-update-card">
      <q-card-section class="row items-center">
        <q-icon name="system_update" size="md" class="text-primary q-mr-sm" />
        <div class="text-h6">새 버전이 있습니다</div>
      </q-card-section>

      <q-card-section>
        <p>더 나은 서비스를 위해 새로운 버전으로 업데이트해주세요.</p>
        <ul class="q-pl-md">
          <li>성능 개선</li>
          <li>새로운 기능 추가</li>
          <li>보안 강화</li>
        </ul>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
            flat
            label="나중에"
            @click="dismissUpdate"
            :disable="updating"
        />
        <q-btn
            color="primary"
            label="업데이트"
            @click="updateApp"
            :loading="updating"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const showUpdate = ref(false)
const updating = ref(false)

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  onRegisteredSW(swUrl, r) {
    console.log('SW Registered: ' + swUrl)
  },
  onRegisterError(error) {
    console.log('SW registration error', error)
  },
  onNeedRefresh() {
    showUpdate.value = true
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

const updateApp = async () => {
  updating.value = true
  try {
    await updateServiceWorker(true)
    showUpdate.value = false
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    updating.value = false
  }
}

const dismissUpdate = () => {
  showUpdate.value = false
  // 1시간 후 다시 표시
  setTimeout(() => {
    if (needRefresh.value) {
      showUpdate.value = true
    }
  }, 60 * 60 * 1000)
}
</script>

<style scoped>
.pwa-update-card {
  min-width: 320px;
  max-width: 400px;
}
</style>
