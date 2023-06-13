import _ from 'lodash'

export default class CmMediaUtil {
  SERVER = {
    AUDIO: 'https://photo.club5678.com/prg/_app/www/club5678/audio.php',
    PHOTO: 'https://photo.club5678.com/prg/simg.php',
    IMG: 'https://photo.club5678.com/prg/_app/www/club5678/image.php',
  }

  #qsUtil
  #stringUtil

  /**
     * @param {Object} opt
     * @param {import('./CmQsUtil').default} opt.qsUtil
     * @param {import('./CmStringUtil').default} opt.stringUtil
     */
  constructor(opt) {
    const { qsUtil, stringUtil } = opt

    this.#qsUtil = qsUtil
    this.#stringUtil = stringUtil
  }

  /**
     * (UTF8 -> Base64) 미디어 인코딩
     * @see {@link CmMediaUtil.decodeMedia} opposite
     * @param {string} fileName 파일명 ex) 21546392_202304110910217107_t.jpg
     */
  encodeMedia(fileName) {
    const command = _.flow(this.#stringUtil.toXor, this.#stringUtil.encodeUnicode)
    return command(fileName)
  }

  /**
     * (Base64 -> UTF8) 미디어 디코딩
     * @see {@link CmMediaUtil.encodeMedia} opposite
     * @param {string} fileName
     */
  decodeMedia(fileName) {
    const command = _.flow(this.#stringUtil.decodeUnicode, this.#stringUtil.toXor)
    return command(fileName)
  }

  /**
     * 음성파일 접근 URL
     * @param {string} fileName 파일명 ex) 21546392_202304110910217107_t.jpg
     * @returns {string}
     */
  toAudioUrl(fileName = '', type = 'clubqmedia') {
    if (!fileName.length)
      return ''

    const qsOption = {
      type,
      viewname: this.encodeMedia(fileName),
    }

    return this.#qsUtil.createLocationSearch(qsOption, this.SERVER.AUDIO)
  }

  /**
     * 이미지파일 접근 URL
     * @param {string} fileName 파일명
     * @param {string} type 저장경로 타입
     * @param {string} thumb 썸네일코드 _c, _b, _m, _c
     * @param {string} parentDir 상위경로
     * @param {string} childDir 하위경로
     * @returns
     */
  toImageUrl(fileName = '', type = 'pmchat', thumb = '', parentDir = '', childDir = '') {
    if (!fileName.length)
      return ''

    const qsOption = {
      type,
      parent: parentDir,
      child: childDir,
      viewname: this.encodeMedia(fileName),
    }

    return this.#qsUtil.createLocationSearch(qsOption, this.SERVER.IMG)
  }

  /**
     * 포토파일 접근 URL
     * @param {string} fileName ex) 21546392_202304110910217107_t.jpg
     */
  toPhotoUrl(fileName = '', type = 'profile') {
    if (!fileName.length)
      return ''

    const qsOption = {
      type,
      viewname: this.encodeMedia(fileName),
    }

    return this.#qsUtil.createLocationSearch(qsOption, this.SERVER.PHOTO)
  }

  /**
     * 기본 이미지 주소 반환
     * @param {'m' | 'f'} memSex
     */
  toNoImageUrl(memSex) {
    const imgName = memSex === 'f' ? 'ico_none_profile_w.png' : 'ico_none_profile_m.png'
    return `https://image.club5678.com/imgs/mobile/main_renewal/ico/${imgName}`
  }

  /**
     * 접속 포토 서버 반환
     * @param {string} type
     */
  getImgServer(type = 'photo') {
    const photoServerList = ['p149', 'p150', 'p151', 'p152']

    switch (type) {
      case 'mobile':
        return 'ppds'
      case 'movie':
        return 'movie'
      default:
        return _.sample(photoServerList)
    }
  }
}
