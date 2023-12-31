import { createStore } from "vuex";
import { SongResult } from "@/type/music";
import { getMusicUrl } from "@/api/music";
import homeRouter from "@/router/home";

interface State {
  menus: any[]
  play: boolean
  isPlay: boolean
  playMusic: SongResult
  playMusicUrl: string
  user: any
  playList: SongResult[]
  playListIndex: number
}

const state: State = {
  menus: homeRouter,
  play: false,
  isPlay: false,
  playMusic: {} as SongResult,
  playMusicUrl: '',
  user: null,
  playList: [],
  playListIndex: 0,
}

const mutations = {
  setMenus(state: State, menus: any[]) {
    state.menus = menus
  },
  async setPlay(state: State, playMusic: SongResult) {
    state.playMusic = playMusic
    state.playMusicUrl = await getSongUrl(playMusic.id)
    state.play = true
  },
  setIsPlay(state: State, isPlay: boolean) {
    state.isPlay = isPlay
  },
  setPlayMusic(state: State, play: boolean) {
    state.play = play
  },
  setPlayList(state: State, playList: SongResult[]) {
    state.playListIndex = 0
    state.playList = playList
  },
  async nextPlay(state: State) {
    state.playListIndex = (state.playListIndex + 1) % state.playList.length
    await updatePlayMusic(state)
  },
  async prevPlay(state: State) {
    state.playListIndex =
      (state.playListIndex - 1 + state.playList.length) % state.playList.length
    await updatePlayMusic(state)
  },
}

const getSongUrl = async (id: number) => {
  const { data } = await getMusicUrl(id);
  console.log(data.data[0].url);

  return data.data[0].url;
};

const updatePlayMusic = async (state: State) => {
  state.playMusic = state.playList[state.playListIndex]
  state.playMusicUrl = await getSongUrl(state.playMusic.id)
  state.play = true
}

const store = createStore({
  state: state,
  mutations: mutations,
});

export default store;
