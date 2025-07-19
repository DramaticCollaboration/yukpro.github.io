// FILE: vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: { transformAssetUrls }
        }),

        quasar({
            autoImportComponentCase: 'pascal',
            sassVariables: path.resolve(__dirname, 'src/quasar-variables.sass')
        }),
        basicSsl(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],

            // PWA Manifest 설정
            manifest: {
                name: '육프로 - B2B 축산물 유통 플랫폼',
                short_name: '육프로',
                description: 'B2B 축산물 유통 디지털 플랫폼으로 소량 주문이 가능한 육류 도매 서비스입니다.',
                theme_color: '#FF6B00',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait-primary',
                scope: '/',
                start_url: '/',
                id: 'yukpro-b2b',

                icons: [
                    {
                        src: '/icons/pwa-64x64.png',
                        sizes: '64x64',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/icons/maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ],

                // 앱 카테고리
                categories: ['business', 'food', 'shopping'],

                // 단축키 설정
                shortcuts: [
                    {
                        name: '상품 검색',
                        short_name: '검색',
                        description: '육류 상품을 검색합니다',
                        url: '/search',
                        icons: [
                            {
                                src: '/icons/search-96x96.png',
                                sizes: '96x96'
                            }
                        ]
                    },
                    {
                        name: '카테고리',
                        short_name: '카테고리',
                        description: '카테고리별 상품을 확인합니다',
                        url: '/categories',
                        icons: [
                            {
                                src: '/icons/category-96x96.png',
                                sizes: '96x96'
                            }
                        ]
                    }
                ],

                // 스크린샷 (앱스토어용)
                screenshots: [
                    {
                        src: '/screenshots/mobile-home.png',
                        sizes: '390x844',
                        type: 'image/png',
                        form_factor: 'narrow',
                        label: '육프로 메인 화면'
                    },
                    {
                        src: '/screenshots/mobile-products.png',
                        sizes: '390x844',
                        type: 'image/png',
                        form_factor: 'narrow',
                        label: '상품 목록 화면'
                    }
                ]
            },

            // 서비스 워커 설정
            workbox: {
                cleanupOutdatedCaches: true,
                skipWaiting: true,
                clientsClaim: true,

                // 캐싱 전략
                runtimeCaching: [
                    // API 응답 캐싱
                    {
                        urlPattern: /^https:\/\/api\.yukpro\.com\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 // 24시간
                            },
                            cacheKeyWillBeUsed: async ({ request }) => {
                                return `${request.url}?v=${Date.now()}`
                            },
                            networkTimeoutSeconds: 10
                        }
                    },

                    // 이미지 캐싱
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images-cache',
                            expiration: {
                                maxEntries: 200,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30일
                            }
                        }
                    },

                    // 구글 폰트 캐싱
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1년
                            }
                        }
                    },

                    // 외부 CDN 리소스 캐싱
                    {
                        urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'cdn-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1년
                            }
                        }
                    }
                ],

                // 네비게이션 요청 처리
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],

                // 오프라인 페이지
                offlineGoogleAnalytics: true,

                // 프리캐싱 설정
                globPatterns: [
                    '**/*.{js,css,html,ico,png,svg,woff2}'
                ],

                // 제외할 파일들
                globIgnores: [
                    '**/node_modules/**/*',
                    'sw.js',
                    'workbox-*.js'
                ]
            },

            // 개발 모드 설정
            devOptions: {
                enabled: true,
                type: 'module',
                navigateFallback: '/index.html',
                suppressWarnings: true
            }
        })

    ],

    // 빌드 최적화
    build: {
        target: 'esnext',
        minify: 'terser',

        // 청크 분할 최적화
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'vue-router', 'pinia'],
                    quasar: ['quasar'],
                    utils: ['lodash', 'axios']
                }
            }
        },

        // PWA를 위한 추가 설정
        sourcemap: false,
        cssCodeSplit: true
    },

    // 개발 서버 설정 (HTTPS - PWA 테스트 필수)
    server: {
        host: '0.0.0.0',
        port: 5173,
        https: true
    },

    // 프리뷰 서버 설정
    preview: {
        host: '0.0.0.0',
        port: 4173,
        https: true
    },

    // 에셋 경로 설정
    base: './',

    // 환경 변수 설정
    define: {
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }

})
