// FILE: main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/mdi-v6'

// Import icon libraries; you can choose different ones!
// See: https://quasar.dev/start/vite-plugin#using-quasar
import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css'
import '@quasar/extras/mdi-v6/mdi-v6.css'

// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css

// Import Quasar css
import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'

// PWA 등록
import { registerSW } from 'virtual:pwa-register'


// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'
import router from './router'

const myApp = createApp(App)

myApp.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
    iconSet: quasarIconSet,
    /*
    config: {
      brand: {
        // primary: '#e46262',
        // ... or all other brand colors
      },
      notify: {...}, // default set of options for Notify Quasar plugin
      loading: {...}, // default set of options for Loading Quasar plugin
      loadingBar: { ... }, // settings for LoadingBar Quasar plugin
      // ..and many more (check Installation card on each Quasar component/directive/plugin)
    }
    */
})

// Connect Pinia
myApp.use(createPinia());

// Connect Vue Router
myApp.use(router);

const updateSW = registerSW({
    onNeedRefresh() {
        // 업데이트 알림 표시
        console.log('New version available')
    },
    onOfflineReady() {
        console.log('App ready to work offline')
    },
})


// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
