import { Buffer } from 'node:buffer'
import _ from 'lodash'

/**
 * lodash String API 를 기본으로 사용하고 그외의 사항들에 대한 내용을 담는다
 */
export default class CmStringUtil {
  /**
     * 하위 문자열이 포함되어 있는지 체크
     * @param {string} str
     * @param {string} substring
     * @param {number} [fromIndex = 0]
     */
  contains(str, substring, fromIndex = 0) {
    return str.includes(substring, fromIndex)
  }

  /**
     * (UTF8 -> Base64) UTF8 문자열(유니코드 포함)을 Base64로 변환
     * @param {string} str ex) '人'
     */
  encodeUnicode(str) {
    return Buffer.from(str).toString('base64')
  }

  /**
     * (Base64 -> UTF8) Base64을 UTF8 문자열(유니코드 포함)로 변환
     * @param {string} str ex) '5Lq6'
     */
  decodeUnicode(str) {
    return Buffer.from(str, 'base64').toString('utf8')
  }

  /**
     * 문자열을 유니코드 시퀀스로 이스케이프 처리
     * @param {string} str utf8 문자열
     * @param {boolean} [shouldEscapePrintable] 문자열 전부 유니코드로 변환할지 여부
     */
  escapeUnicode(str, shouldEscapePrintable) {
    return str.replace(/[\s\S]/g, (ch) => {
      // skip printable ASCII chars if we should not escape them
      if (!shouldEscapePrintable && /[\x20-\x7E]/.test(ch))
        return ch

      // we use "000" and slice(-4) for brevity, need to pad zeros,
      // unicode escape always have 4 chars after "\u"
      return `\\u${(`000${ch.charCodeAt(0).toString(16)}`).slice(-4)}`
    })
  }

  /**
     * 문자열에서 HTML 태그 제거
     * @param {string} str 문자열 ex) <div>one</div>
     */
  stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '')
  }

  /**
     * 출력할 수 없는 아스키 문자열 제거
     * @link http://en.wikipedia.org/wiki/ASCII#ASCII_printable_characters
     * @param {string} str 문자열 ex) '하one two🎉 three☸ %EC%95%88;^^';
     */
  removeNonASCII(str) {
    return str.replace(/[^\x20-\x7E]/g, '')
  }

  /**
     * Word가 아닌 문자열 제거
     * @param {string} str ex) '하one two🎉 three☸ %EC%95%88;^^'
     */
  removeNonWord(str) {
    return str.replace(/[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g, '')
  }

  /**
     * 줄 바꿈을 DOS/MAC에서 단일 표준(기본적으로 UNIX)으로 변환
     * @param {string} str 문자열
     * @param {'\r\n' | '\n'} normalized 개행
     */
  normalizeLineEndings(str, normalized = '\n') {
    return str.replace(/\r?\n/g, normalized)
  }

  /**
     * 특정 문자열 사이의 문자열 추출
     * @param {string} str 추출할 대상이 되는 문자열
     * @param {string} sDelimiter 특정 문자열 시작 구분자
     * @param {string} eDelimiter 특정 문자열 종료 구분자
     * @param {{shouldTrim?: boolean, shouldLowerCase?: boolean, shouldUppercase?: boolean}} [option] 추가적인 정제처리 여부.
     * @returns {string[]} 추출한 문자열 목록
     * @example
     * extractBetweenStrings('01234567', '23', '67'); // => ['4']
     * extractBetweenStrings('hi #a# 여긴 무시  # b# end', '#', '#'); // => ['a', ' b']
     */
  extractBetweenStrings(str, sDelimiter, eDelimiter, option = { shouldTrim: true, shouldLowerCase: false, shouldUppercase: false }) {
    const startRegex = new RegExp(`(${sDelimiter}).*?(${eDelimiter})`, 'g')
    const startReplacer = new RegExp(sDelimiter)
    const endReplacer = new RegExp(eDelimiter)

    const { shouldTrim, shouldLowerCase, shouldUppercase } = option
    const regExpMatchArray = str.match(startRegex)
    let results
            = regExpMatchArray === null
              ? []
              : regExpMatchArray.map((s) => {
                return s.replace(startReplacer, '').replace(endReplacer, '')
              })

    const commnadList = []

    shouldTrim && commnadList.push(_.trim)
    shouldLowerCase && commnadList.push(_.toLower)
    shouldUppercase && commnadList.push(_.toUpper)

    if (commnadList.length) {
      const flowCommand = _.flow(commnadList)
      results = results.map(flowCommand)
    }

    return results
  }

  /**
     * (개행) newlines -> \<br /> 태그
     * @see {@link CmStringUtil.unreplaceBrTag} opposite
     * @param {string} text
     */
  replaceBrTag(text) {
    if (typeof text !== 'string')
      return ''

    return text.replace(/(?:\r\n|\r|\n)/gi, '<br />')
  }

  /**
     * \<br /> 태그 -> (개행) newlines
     * @see {@link CmStringUtil.replaceBrTag} opposite
     * @param {string} text
     */
  unreplaceBrTag(text) {
    if (typeof text !== 'string')
      return ''

    return text.replace(/<br\s*[\\/]?>/gi, '\n')
  }

  /**
     * string을 ascii decimal로 치환 후 각 자리에 xor 연산 후 char로 변환
     * @param {string} source
     */
  toXor(source) {
    return Buffer.from(source)
      .map((decimal, index) => decimal ^ index)
      .toString()
  }
}
