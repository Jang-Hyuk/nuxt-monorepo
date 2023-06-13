export default class BeClientUtil {
  #NATION_CODE = {
    korea: 'KR',
  }

  /**
   * @param {Object} opt
   * @param {import('express').Request} opt.req express req
   * @param {import('express').Response} opt.res express res
   */
  constructor(opt) {
    const { req, res } = opt

    this.req = req
    this.res = res
  }

  get remoteAddress() {
    return this.req.headers['remote-addr']
  }

  /** 접속 브라우저 언어 */
  get accpetLanguage() {
    return this.req.headers['accept-language']
  }

  /**
   * 어드민 여부
   * @param {string} memId
   */
  isAdmin(memId) {}

  /** 개발자 여부 */
  isDeveloper() {}

  /** 로그인 여부 */
  isLogin() {}

  /**
   * 사무실 아이피 여부
   * @param {string} ipAddress
   */
  isOffice(ipAddress) {}

  /**
   * FIXME 로그인 아이디가 테스트아이디인지 검사한다.
   */
  isMarketTestId() {}

  /** 실서버 여부 */
  isProduction() {}
}
module.exports = BeClientUtil
