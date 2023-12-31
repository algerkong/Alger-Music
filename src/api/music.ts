import { IPlayMusicUrl } from "@/type/music"
import { ILyric } from "@/type/lyric"
import request from "@/utils/request"
import requestMusic from "@/utils/request_music"
// 根据音乐Id获取音乐播放URl
export const getMusicUrl = (id: number) => {
  return request.get<IPlayMusicUrl>("/song/url", { params: { id: id } })
}

// 根据音乐Id获取音乐歌词
export const getMusicLrc = (id: number) => {
  return request.get<ILyric>("/lyric", { params: { id: id } })
}

export const getParsingMusicUrl = (id: number) => {
  return requestMusic.get<any>("/music", { params: { id: id } })
}
