<script lang="ts" setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getUserDetail, getUserPlaylist, getUserRecord } from "@/api/user";
import type { IUserDetail } from "@/type/user";
import { computed, ref } from "vue";
import { setAnimationClass, setAnimationDelay, getImgUrl } from "@/utils";
import { getListDetail } from '@/api/list'
import SongItem from "@/components/common/SongItem.vue";



const store = useStore()
const router = useRouter()


const userDetail = ref<IUserDetail>()
const playList = ref<any[]>([])
const recordList = ref()
const user = store.state.user

const loadPage = async () => {
  if (!user) {
    router.push("/login")
    return
  }

  const { data: userData } = await getUserDetail(user.userId)
  userDetail.value = userData

  const { data: playlistData } = await getUserPlaylist(user.userId)
  playList.value = playlistData.playlist

  const { data: recordData } = await getUserRecord(user.userId)
  recordList.value = recordData.allData


}
loadPage()


const isShowList = ref(false)
const list = ref()
// 展示歌单
const showPlaylist = async (id: number) => {
  const { data } = await getListDetail(id)
  isShowList.value = true
  list.value = data.playlist
}

// 格式化歌曲列表项
const formatDetail = computed(() => (detail: any) => {
  let song = {
    artists: detail.ar,
    name: detail.al.name,
    id: detail.al.id,
  }

  detail.song = song
  detail.picUrl = detail.al.picUrl
  return detail
})

const musicFullClass = computed(() => {
  if (isShowList.value) {
    return setAnimationClass('animate__fadeInUp')
  } else {
    return setAnimationClass('animate__fadeOutDown')
  }
})

const handlePlay = (item: any) => {
  const tracks = list.value?.tracks || []
  const musicIndex = (tracks.findIndex((music: any) => music.id == item.id) || 0)
  store.commit('setPlayList', tracks.slice(musicIndex))
}


</script>

<template>
  <div class="user-page" @click.stop="isShowList = false">
    <div
      class="left"
      v-if="userDetail"
      :class="setAnimationClass('animate__fadeInLeft')"
      :style="{ backgroundImage: `url(${user.backgroundUrl})` }"
    >
      <div class="page">
        <div class="user-name">{{ user.nickname }}</div>
        <div class="user-info">
          <n-avatar round :size="50" :src="user.avatarUrl" />
          <div class="user-info-list">
            <div class="user-info-item">
              <div class="label">{{ userDetail.profile.followeds }}</div>
              <div>粉丝</div>
            </div>
            <div class="user-info-item">
              <div class="label">{{ userDetail.profile.follows }}</div>
              <div>关注</div>
            </div>
            <div class="user-info-item">
              <div class="label">{{ userDetail.level }}</div>
              <div>等级</div>
            </div>
          </div>
        </div>
        <div class="uesr-signature">{{ userDetail.profile.signature }}</div>

        <div class="play-list" :class="setAnimationClass('animate__fadeInLeft')">
          <div class="play-list-title">创建的歌单</div>
          <div
            class="play-list-item"
            v-for="(item,index) in playList"
            :key="index"
            @click="showPlaylist(item.id)"
          >
            <n-image
              :src="getImgUrl( item.coverImgUrl, '')"
              class="play-list-item-img"
              lazy
              preview-disabled
            />
            <div class="play-list-item-info">
              <div class="play-list-item-name">{{ item.name }}</div>
              <div class="play-list-item-count">{{ item.trackCount }}首，播放{{ item.playCount }}次</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right" :class="setAnimationClass('animate__fadeInRight')">
      <n-layout class="record-list" :native-scrollbar="false">
        <div class="title">听歌排行</div>
        <div
          class="record-item"
          v-for="(item, index) in recordList"
          :key="item.song.id"
          :class="setAnimationClass('animate__bounceInUp')"
          :style="setAnimationDelay(index, 50)"
        >
          <SongItem class="song-item" :item="formatDetail(item.song)" />
          <div class="play-count">{{ item.playCount }}次</div>
        </div>
      </n-layout>
    </div>
    <transition name="musicPage">
      <div class="music-page" v-if="isShowList">
        <i class="iconfont icon-icon_error music-close" @click="isShowList = false"></i>
        <div class="music-title">{{ list?.name }}</div>
        <!-- 歌单歌曲列表 -->
        <n-layout class="music-list" :native-scrollbar="false">
          <div
            v-for="(item, index) in list?.tracks"
            :key="item.id"
            :class="setAnimationClass('animate__bounceInUp')"
            :style="setAnimationDelay(index, 100)"
          >
            <SongItem :item="formatDetail(item)" @play="handlePlay"/>
          </div>
        </n-layout>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.musicPage-enter-active {
  animation: fadeInUp 0.8s ease-in-out;
}

.musicPage-leave-active {
  animation: fadeOutDown 0.8s ease-in-out;
}
.user-page {
  @apply flex;
  .left {
    max-width: 600px;
    background-color: #0d0d0d;
    background-size: 100%;
    @apply flex-1 rounded-2xl  overflow-hidden relative bg-no-repeat;
    .page {
      @apply p-4  w-full z-10;
      background-color: #0d0d0d66;
    }
    .user-name {
      @apply text-xl text-white font-bold  opacity-70 mb-4;
    }

    .uesr-signature {
      @apply text-white opacity-70 mt-4;
    }
    .user-info {
      @apply flex items-center;
      &-list {
        @apply flex justify-around  w-2/5 text-center opacity-70;
        .label {
          @apply text-xl text-white font-bold;
        }
      }
    }
  }

  .right {
    @apply flex-1 ml-4;
    .record-list {
      height: 750px;
      background-color: #0d0d0d;
      @apply rounded-2xl;
      .record-item {
        @apply flex items-center px-4;
      }

      .song-item {
        @apply flex-1;
      }

      .play-count {
        @apply text-white opacity-70 ml-4;
      }
    }
    .title {
      @apply text-xl text-white font-bold  opacity-70 m-4;
    }
  }
}

.play-list {
  @apply mt-4 py-4 px-2 rounded-xl;
  background-color: #000000;
  &-title {
    @apply text-lg text-white opacity-70;
  }
  &-item {
    @apply flex items-center hover:bg-gray-800 transition-all duration-200 px-2 py-1 rounded-xl cursor-pointer;
    &-img {
      width: 60px;
      height: 60px;
      @apply rounded-xl;
    }
    &-info {
      @apply ml-2;
    }
    &-name {
      @apply text-white;
    }
  }
}

.music {
  &-page {
    width: 100%;
    height: 734px;
    position: absolute;
    background-color: #000000f0;
    top: 100px;
    left: 0;
    border-radius: 30px 30px 0 0;
    animation-duration: 300ms;
  }
  &-title {
    @apply text-lg font-bold text-white p-4;
  }

  &-close {
    @apply absolute top-4 right-4 cursor-pointer text-white text-3xl;
  }

  &-list {
    height: 594px;
    background-color: #00000000;
  }
}
</style>