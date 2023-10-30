import { Buffer } from 'node:buffer'

/**
 * lodash String API 를 기본으로 사용하고 그외의 사항들에 대한 내용을 담는다
 */
export default class CmStringUtil {
  /**
   * (UTF8 -> Base64) UTF8 문자열(유니코드 포함)을 Base64로 변환
   * @see {@link CmStringUtil.decodeUnicode} opposite
   * @param {string} str ex) '人'
   * @example
   * cu.str.encodeUnicode('人'); // => 5Lq6
   */
  encodeUnicode(str) {
    return Buffer.from(str).toString('base64')
  }

  /**
   * (Base64 -> UTF8) Base64을 UTF8 문자열(유니코드 포함)로 변환
   * @see {@link CmStringUtil.encodeUnicode} opposite
   * @param {string} str ex) '5Lq6'
   * @example
   * cu.str.decodeUnicode('5Lq6'); // => 人
   */
  decodeUnicode(str) {
    return Buffer.from(str, 'base64').toString('utf8')
  }

  /**
   * 문자열을 유니코드 시퀀스로 이스케이프 처리
   * @param {string} str utf8 문자열
   * @param {boolean} [shouldEscapePrintable] 문자열 전부 유니코드로 변환할지 여부
   * @example
   * const utf8 = 'JavaScript is fun 🎉';
   * cu.str.escapeUnicode(utf8);
   * // => 'JavaScript is fun \\ud83c\\udf89'
   * cu.str.escapeUnicode(utf8, true);
   * // => '\\u004a\\u0061\\u0076\\u0061\\u0053\\u0063\\u0072\\u0069\\u0070\\u0074\\u0020\\u0069\\u0073\\u0020\\u0066\\u0075\\u006e\\u0020\\ud83c\\udf89'
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
   * @example
   * cu.str.stripHtmlTags('<div>one  <span>two</span><input type="text" /> three</div>');
   * // => 'one  two three'
   */
  stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '')
  }

  /**
   * 출력할 수 없는 아스키 문자열 제거
   * @link http://en.wikipedia.org/wiki/ASCII#ASCII_printable_characters
   * @param {string} str 문자열 ex) '하one two🎉 three☸ %EC%95%88;^^';
   * @example
   * cu.str.removeNonASCII('하one two🎉 three☸ %EC%95%88;^^');
   * // => 'one two three %EC%95%88;^^'
   */
  removeNonASCII(str) {
    return str.replace(/[^\x20-\x7E]/g, '')
  }

  /**
   * Word가 아닌 문자열 제거
   * @param {string} str ex) '하one two🎉 three☸ %EC%95%88;^^'
   * @example
   * cu.str.removeNonWord('하one two🎉 three☸ %EC%95%88;^^');
   * // => 'one two three EC9588'
   */
  removeNonWord(str) {
    return str.replace(/[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g, '')
  }

  /**
   * 줄 바꿈을 DOS/MAC에서 단일 표준(기본적으로 UNIX)으로 변환
   * @param {string} str 문자열
   * @param {'\r\n' | '\n'} [normalized = '\n'] 개행
   * cu.str.normalizeLineEndings('12\r\n \r 3\n 4');
   * // => '12\n \r 3\n 4'
   */
  normalizeLineEndings(str, normalized = '\n') {
    return str.replace(/\r?\n/g, normalized)
  }

  /**
   * 특정 문자열 사이의 문자열 추출
   * @param {string} str 추출할 대상이 되는 문자열
   * @param {string} sDelimiter 특정 문자열 시작 구분자 정규식으로 변환되므로 특수기호를 사용할 경우 `\\` 붙여서 사용
   * @param {string} eDelimiter 특정 문자열 종료 구분자. 정규식으로 변환되므로 특수기호를 사용할 경우 `\\` 붙여서 사용
   * @param {{shouldTrim?: boolean, shouldLowerCase?: boolean, shouldUppercase?: boolean}} [option] 추가적인 정제처리 여부.
   * @returns {string[]} 추출한 문자열 목록
   * @example
   * cu.str.getBetweens('01234567', '23', '67'); // => ['4']
   * cu.str.getBetweens('hi #a# 여긴 무시  # b# end', '#', '#'); // => ['a', 'b']
   */
  getBetweens(str, sDelimiter, eDelimiter, option = {}) {
    const startRegex = new RegExp(`(${sDelimiter}).*?(${eDelimiter})`, 'g')
    const startReplacer = new RegExp(sDelimiter)
    const endReplacer = new RegExp(eDelimiter)

    const { shouldTrim = true, shouldLowerCase = false, shouldUppercase = false } = option
    const regExpMatchArray = str.match(startRegex)
    const results
      = regExpMatchArray === null
        ? []
        : regExpMatchArray.map((s) => {
          return s.replace(startReplacer, '').replace(endReplacer, '')
        })

    return results.map((str) => {
      str = shouldTrim ? str.trim() : str
      str = shouldLowerCase ? str.toLowerCase() : str
      str = shouldUppercase ? str.toUpperCase() : str
      return str
    })
  }

  /**
   * (개행) newlines -> \<br /> 태그
   * @see {@link CmStringUtil.unreplaceBrTag} opposite
   * @param {string} text 개행이 들어간 text. ex) '12 \n \r\n 34'
   * @example
   * cu.str.replaceBrTag('12 \n \r\n 34');
   */
  replaceBrTag(text) {
    if (typeof text !== 'string')
      return ''

    return text.replace(/(?:\r\n|\r|\n)/gi, '<br />')
  }

  /**
   * \<br /> 태그 -> (개행) newlines
   * @see {@link CmStringUtil.replaceBrTag} opposite
   * @param {string} text br tag가 들어간 text. ex) '12 <br /> <br> 34'
   * @example
   * cu.str.unreplaceBrTag('12 <br /> <br> 34');
   * // => '12 \n \n 34'
   */
  unreplaceBrTag(text) {
    if (typeof text !== 'string')
      return ''

    return text.replace(/<br\s*[\\/]?>/gi, '\n')
  }

  /**
   * (' ' -> \u00A0) space -> NBSP Unicode
   * @see {@link cu.str.unreplaceOnBreakingSpace} opposite
   * @param {string} text '12 4'
   * @example
   * const src = '12 4';
   * const result = cu.str.replaceOnBreakingSpace(src);
   * // => '12 4'
   * src === result; // => false
   * encodeURIComponent(src); // => '12%204'
   * encodeURIComponent(result); // => '12%C2%A04'
   */
  replaceOnBreakingSpace(text) {
    return text.replace(/ /g, '\u00A0')
  }

  /**
   * (\u00A0 -> ' ') NBSP Unicode -> space
   * @summary contenteditable 데이터를 가져올 때 사용
   * @see {@link cu.str.replaceOnBreakingSpace} opposite
   * @param {string} text '12\u00A0\u00A04\u00A0'
   * @example
   * const expect = '12  4 ';
   * const src = '12\u00A0\u00A04\u00A0';
   * const result = cu.str.unreplaceOnBreakingSpace(src);
   * expect === src; // => false
   * expect === result; // => true
   */
  unreplaceOnBreakingSpace(text) {
    return text.replace(/\u00A0/g, ' ')
  }

  /**
   * (' ' -> &nbsp;) space -> NBSP Html Entity
   * @summary 연속된 space는 html에서 spcae 하나로 처리하므로 이를 방지할 때 사용
   * @see {@link cu.str.unreplaceNbsp} opposite
   * @param {string} text '12 4'
   * @example
   * cu.str.replaceNbsp('12  4 ');
   * // => '12&nbsp;&nbsp;4&nbsp;'
   */
  replaceNbsp(text) {
    return text.replace(/ /g, '&nbsp;')
  }

  /**
   * (&nbsp; -> ' ') NBSP Html Entity -> space
   * @see {@link cu.str.replaceNbsp} opposite
   * @param {string} text '12&nbsp;&nbsp;4&nbsp;'
   * @example
   * cu.str.unreplaceNbsp('12&nbsp;&nbsp;4&nbsp;');
   * // => '12  4 '
   */
  unreplaceNbsp(text) {
    return text.replace(/&nbsp;/g, ' ')
  }
}
