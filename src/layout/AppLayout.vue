<template>
    <div class="layout-page">
        <div class="layout-main">
            <div class="flex">
                <!-- 侧边菜单栏 -->
                <app-menu class="menu" :menus="menus" />
                <div class="main">
                    <!-- 搜索栏 -->
                    <search-bar />
                    <!-- 主页面路由 -->
                    <div class="main-content bg-black" :native-scrollbar="false">
                        <n-message-provider>
                            <router-view class="main-page" v-slot="{ Component }">
                                <!-- <keep-alive>
                                    <component :is="Component" v-if="$route.meta.keepAlive" />
                                </keep-alive>
                                <component :is="Component" v-if="!$route.meta.keepAlive" />-->

                                <component :is="Component" />
                            </router-view>
                        </n-message-provider>
                    </div>
                </div>
            </div>
            <!-- 底部音乐播放 -->
            <play-bar v-if="isPlay" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { SongResult } from '@/type/music';
import { computed } from 'vue';
import { useStore } from 'vuex';
// import { AppMenu, PlayBar, SearchBar } from './components';
import { defineAsyncComponent } from 'vue';
const AppMenu = defineAsyncComponent(() => import('./components/AppMenu.vue'));
const PlayBar = defineAsyncComponent(() => import('./components/PlayBar.vue'));
const SearchBar = defineAsyncComponent(() => import('./components/SearchBar.vue'));



const store = useStore();

const isPlay = computed(() => store.state.isPlay as boolean)
const menus = store.state.menus;

</script>

<style lang="scss" scoped>
.layout-page {
    width: 100vw;
    height: 100vh;
    @apply flex justify-center items-center overflow-hidden;
}

.layout-main {
    @apply bg-black rounded-lg  text-white shadow-xl flex-col relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .menu {
        width: 90px;
    }
    .main {
        @apply pt-6 pr-6 flex-1 box-border;
        height: 100vh;
        &-content {
            @apply rounded-2xl;
            height: calc(100vh - 60px);
            margin-bottom: 90px;
        }
        &-page {
            margin: 20px 0;
        }
    }
}
</style>