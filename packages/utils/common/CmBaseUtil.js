/** 기본 클래스. 다른 유틸에서도 사용될만한 함수 모음 */
export default class CmBaseUtil {
  /**
   * 2개의 Semantic Version 비교. sorting 활용 가능
   * @param {number | string} leftVer (좌항) 비교 할려는 버젼
   * @param {number | string} leftVer (좌항) 비교 할려는 버젼
   * @param {number | string} rightVer (우항 ) 비교 당하는 버젼
   * @param {boolean} [shouldMinLength = false] 버젼 비교 자릿수 Math.min vs Math.max 여부
   * @returns {number} LessThan: -1, EqualTo: 0, GreaterThan: 1
   * @example
   * // compare
   * cu.base.compareVersion('1.5', '2.1'); // => -1
   * cu.base.compareVersion('1.5', '1.5.7'); // => -1
   * cu.base.compareVersion('1.5', '1.5.7', true); // => 0
   * // sorting
   * ['1.1', '2', '1.0'].sort(compareVersion); // => ['1.0', '1.1', '2']
   */
  compareVersion(leftVer, rightVer, shouldMinLength) {
    const VersionIs = { LessThan: -1, EqualTo: 0, GreaterThan: 1 }
    const cp = String(leftVer).split('.')
    const op = String(rightVer).split('.')
    const len = shouldMinLength
      ? Math.min(cp.length, op.length)
      : Math.max(cp.length, op.length)

    for (let depth = 0; depth < len; depth++) {
      const cn = Number(cp[depth])
      const on = Number(op[depth])
      if (cn > on)
        return VersionIs.GreaterThan
      if (on > cn)
        return VersionIs.LessThan
      if (!Number.isNaN(cn) && Number.isNaN(on))
        return VersionIs.GreaterThan
      if (Number.isNaN(cn) && !Number.isNaN(on))
        return VersionIs.LessThan
    }

    return VersionIs.EqualTo
  }

  /**
   * 지연 시간 대기 후 resolve 반환
   * @param {number} ms millisecond
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * JSON.parse 성공 유무 반환
   * @param {any} item
   * @example
   * cu.base.isJsonParse(123); // => true
   * cu.base.isJsonParse('[1,2]'); // => true
   */
  isJsonParse(item) {
    try {
      JSON.parse(item)
      return true
    }
    catch (e) {
      return false
    }
  }

  /**
   * 시작부터 끝(포함하지 않음)까지 진행되는 숫자 배열(양수 및/또는 음수)을 만듭니다.
   * 끝이나 단계 없이 음수 시작이 지정된 경우 -1 단계가 사용됩니다.
   * end를 지정하지 않으면 start로 시작한 다음 0으로 설정됩니다.
   * @param {number} start
   * @param {number} [end]
   * @param {number} [increment]
   */
  range(start, end, increment) {
    // if the end is not defined...
    const isEndDef = typeof end !== 'undefined'
    // ...the first argument should be the end of the range...
    end = end ?? start
    // ...and 0 should be the start
    start = isEndDef ? start : 0

    // if the increment is not defined, we could need a +1 or -1
    // depending on whether we are going up or down
    if (typeof increment === 'undefined')
      increment = Math.sign(end - start)

    // calculating the lenght of the array, which has always to be positive
    const length = Math.abs((end - start) / (increment || 1))

    // In order to return the right result, we need to create a new array
    // with the calculated length and fill it with the items starting from
    // the start value + the value of increment.
    const { result } = Array.from({ length }).reduce(
      ({ result, current }) => ({
      // append the current value to the result array
        result: [...result, current],
        // adding the increment to the current item
        // to be used in the next iteration
        current: current + increment,
      }),
      { current: start, result: [] },
    )

    return result
  }

  /**
   * JSON.parse 결과 값이 object 타입인지 체크
   * @example
   * cu.base.isJsonParseObject(123); // => false
   * cu.base.isJsonParseObject('[1,2]'); // => true
   * cu.base.isJsonParseObject('{"a": 1}'); // => true
   */
  isJsonParseObject(item) {
    let jsonItem

    try {
      const strItem = typeof item !== 'string' ? item.toString() : item
      jsonItem = JSON.parse(strItem)
    }
    catch (e) {
      return false
    }

    return typeof jsonItem === 'object' && jsonItem !== null
  }

  /**
   * 현재 값이 숫자형으로 변환 가능한지 여부. parseFloat Base
   * @param {*} [value] 체크할려는 값
   * @example
   * cu.base.isNumberic('1.23'); // => true
   * cu.base.isNumberic('1.2.3'); // => false
   * cu.base.isNumberic(); // => false
   * cu.base.isNumberic(''); // => false
   */
  isNumberic(value) {
    return !isNaN(parseFloat(value)) && isFinite(value)
  }

  /**
   * 페이지네이션을 생성하기 위한 변수 값 계산
   * @param {number} totalItems 페이지네이션을 구성하는 총 행 수
   * @param {number} [currentPage = 1] 현재 보고 있는 페이지 번호
   * @param {number} [pageSize = 20] 페이지에 표시할 행 수
   * @param {number} [maxPages = 10] 페이지네이션 ◀ [1] ~ [10] ▶ 작성 시 사용
   * @example
   * cu.base.paginate(2340, 2, 50, 10);
   * // => {
   *  totalItems: 2340, // 총 아이템 수
   *  currentPage: 2, // 현재 페이지
   *  pageSize: 50, // 페이지당 노출 건수
   *  totalPages: 47, // 총 페이지 수
   *  startPage: 1, // 시작 페이지. ◀ [11] ~ [20] ▶ 이런식일 경우 11
   *  endPage: 10, // 종료 페이지. ◀ [11] ~ [20] ▶ 이런식일 경우 20
   *  startIndex: 50, // (currentPage - 1) * pageSize
   *  endIndex: 99, // Math.min(startIndex + pageSize - 1, totalItems - 1)
   *  pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // this.range(startPage, endPage + 1)
   * };
   */
  paginate(totalItems, currentPage = 1, pageSize = 20, maxPages = 10) {
    totalItems = typeof totalItems === 'string' ? parseInt(totalItems, 10) : totalItems
    currentPage = typeof currentPage === 'string' ? parseInt(currentPage, 10) : currentPage
    pageSize = typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize
    maxPages = typeof maxPages === 'string' ? parseInt(maxPages, 10) : maxPages

    const totalPages = Math.ceil(totalItems / pageSize) // ensure current page isn't out of range

    if (currentPage < 1)
      currentPage = 1

    else if (currentPage > totalPages)
      currentPage = totalPages

    let startPage = 0
    let endPage = 0

    startPage = Math.round((currentPage - 1) / maxPages) * maxPages + 1
    endPage = startPage + maxPages - 1
    endPage = endPage > totalPages ? totalPages : endPage

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1) // create an array of pages to ng-repeat in the pager control

    const pages = this.range(startPage, endPage + 1) // return object with all pager properties required by the view

    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
      isLastPage: currentPage === endPage,
    }
  }

  /**
   * (포맷 변경) pairStr -> Dictionary
   * @see {@link CmBaseUtil.fromDict} opposite
   * @param {string} pairStr (string) ex) 'NO=21540000|ID=wkd123'
   * @param {string} [outerSep = '|'] 프로퍼티 구분자
   * @param {string} [innerSep = '='] key value 구분자
   * @example
   * cu.base.toDict('NO=21540000|ID=wkd123'); // => {NO:'21540000', ID: 'wkd123'}
   */
  toDict(pairStr, outerSep = '|', innerSep = '=') {
    return pairStr
      .split(outerSep)
      .filter(str => str)
      .map(str => str.split(innerSep))
      .reduce((dict, [key, value]) => {
        dict[key.trim()] = value
        return dict
      }, {})
  }

  /**
   * (포맷 변경) Dictionary -> pairStr
   * @see {@link CmBaseUtil.toDict} opposite
   * @param {Object} dict (object) {NO: 21540000, ID: 'wkd123'}
   * @param {string} [outerSep = '|'] 프로퍼티 구분자
   * @param {string} [innerSep = '='] key value 구분자
   * @example
   * cu.base.fromDict({NO: 21540000, ID: 'wkd123'}); // => 'NO=21540000|ID=wkd123'
   */
  fromDict(dict, outerSep = '|', innerSep = '=') {
    return Object
      .entries(dict)
      .reduce((store, [key, value]) => {
        store.push(`${key}${innerSep}${value}`)
        return store
      }, [])
      .join(outerSep)
  }

  /**
   * 천단위 숫자 추가 후 반환(콤마 구분)
   * @param {string | number} value
   * @example
   * cu.base.toNumberFormat('12345.678'); // => '12,345.678'
   * cu.base.toNumberFormat(12345.678); // => '12,345.678'
   * cu.base.toNumberFormat('abc'); // => NaN
   */
  toNumberFormat(value) {
    value = typeof value === 'string' ? parseFloat(value) : value
    return Number.isNaN(value) ? NaN : new Intl.NumberFormat().format(value)
  }

  /**
   * 범용고유식별자(Universal Unique Identifier, UUID) 생성. 버전 4 (랜덤)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues}
   * @example
   * cu.base.uuid(); // => '56a7dc4b-9f8e-45a3-b53b-527e1daab0d3'
   */
  uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16))
  }
}
