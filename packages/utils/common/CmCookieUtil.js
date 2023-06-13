import Cookies from 'cookie-universal'

/**
 * Per User
 */
export default class CmCookieUtil {
  /** @type {Cookies.ICookie} */
  #cookies

  #baseUtil

  /**
   * @param {object} opt
   * @param {import('http').IncomingMessage} opt.req
   * @param {import('http').ServerResponse} opt.res
   * @param {import('./CmBaseUtil').default} opt.baseUtil
   * @param {import('./CmStringUtil').default} opt.stringUtil
   */
  constructor(opt) {
    const { req, res, baseUtil, stringUtil } = opt

    /** @type {Cookies.ICookie} */
    this.#cookies = Cookies(req, res)
    this.#baseUtil = baseUtil
    this.#stringUtil = stringUtil
  }

  /**
   * 쿠키에 설정된 값 가져오기
   * @param {string} name cookie name
   * @param {import('cookie-universal').ICookieGetOpts} [option]
   */
  get(name, option) {
    return this.#cookies.get(name, option)
  }

  /**
   * 쿠키에 설정된 값 모두 가져오기
   * @param {import('cookie-universal').ICookieGetOpts} [option]
   */
  getAll(option) {
    return this.#cookies.getAll(option)
  }

  /**
   * 쿠키에 설정된 값 가져온 후 복원하여 반환
   * pairsKey 가 존재할 경우 Dictionary 형식으로 판단하고 해당 dictionary key값으로 추출
   * @param {string} name cookie name
   * @param {string} [pairsKey]
   * @param {import('cookie-universal').ICookieGetOpts} [option]
   * @returns {string|undefined}
   * @example
   * Step1: cookieName만 설정할 경우 (ex getDecode('gCCV'))
   *  -> return this.toDecode(this.get(cookieName))
   *    => NO=21540000|ID=wkd123...
   * Step2: pairsKey를 설정할 경우 (ex getDecode('gCCV', 'NO'))
   *  -> Step1 단계를 거친 후 객체로 변환하고 해당 pairsKey 값 반환
   *    => 21540000
   */
  getDecode(name, pairsKey = '', option) {
    const cookieValue = this.get(name, option)
    if (cookieValue === undefined)
      return cookieValue

    const rawData = this.toDecode(cookieValue)

    // 추출하고자 하는 값이 있다면 rawData가 pairs 형식으로 판단하고 변환하여 반환
    return pairsKey.length ? this.#baseUtil.toDict(rawData)[pairsKey] : rawData
  }

  /**
   * @param {keyof iUser.CookieUser} pairsKey gCCV 쿠키에서 가져올 데이터
   */
  getGccv(pairsKey) {
    return this.getDecode('gCCV', pairsKey)
  }

  /**
   * @param {Array<keyof iUser.CookieUser>} pairsKeys gCCV 쿠키에서 가져올 데이터 목록
   */
  getGccvList(pairsKeys = []) {
    return pairsKeys.map(pairsKey => this.getGccv(pairsKey))
  }

  /**
   * 해당 쿠키 삭제
   * @param {string} name cookie name
   * @param {import('cookie').CookieSerializeOptions} [option]
   */
  remove(name, option) {}

  /**
   * 모든 쿠키 삭제
   */
  removeAll() {}

  /**
   * 쿠키에 값 설정하기
   * @param {string} name cookie name
   * @param {any} value 어떤 타입이 오더라도 string으로 변환하여 사용
   * @param {import('cookie').CookieSerializeOptions} [option]
   */
  set(name, value, option) {}

  /**
   * 쿠키 값을 클럽 인코딩 처리 후 쿠키에 인코딩 쿠키값 설정하기
   * @param {string} name cookie name
   * @param {any} value 어떤 타입이 오더라도 string으로 변환하여 사용
   * @param {import('cookie').CookieSerializeOptions} [option]
   */
  setEncode(name, value, option) {}
}
