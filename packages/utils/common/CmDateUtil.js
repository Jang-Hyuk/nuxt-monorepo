import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/** dayjs 기반 Date Util Class */
export default class CmDateUtil {
  /** @type {Intl.DateTimeFormatOptions} 기본 */
  #dtfBase = {
    dateStyle: 'full',
  }

  /** @type {Intl.DateTimeFormatOptions} 시간을 AM/PM 형식으로 보여줄 옵션 */
  #dtfHour12 = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  /** DTF default */
  #dtfOption = {
    base: this.#dtfBase,
    hour12: this.#dtfHour12,
  }

  /** @type {Intl.RelativeTimeFormatOptions} default */
  #rtfBase = {
    numeric: 'always',
  }

  /** RTF default */
  #rtfOption = {
    base: this.#rtfBase,
  }

  /**
   * @param {{ locale?: string; timeZone?: string }} [opt = {}]
   */
  constructor(opt = {}) {
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions()
    const {
      locale = resolvedOptions.locale,
      timeZone = resolvedOptions.timeZone,
    } = opt

    this.locale = locale
    this.timeZone = timeZone

    this.#dtfBase.timeZone = this.timeZone
    this.#dtfHour12.timeZone = this.timeZone
  }

  /**
   * Date 객체로 반환
   * @param {CmDateType} dateValue
   */
  toDate(dateValue) {
    let date
    if (dayjs.isDayjs(dateValue))
      date = dayjs(dateValue).toDate()
    else date = new Date(dateValue)

    if (!isNaN(date.getTime()))
      return date

    throw new Error(`not valid Date:${date}`)
  }

  /**
   * dayjs 객체로 변환. dayjs 객체로 변환 실패시 Throw 발생
   * @param {CmDateType} [dateValue] timestamp, unix number
   * @param {string} [timeZone]
   */
  toDayjs(dateValue, timeZone) {
    let dayjsResult = dateValue || dayjs()

    if (typeof dayjsResult === 'number') {
      const numberLength = dayjsResult.toString().length
      dayjsResult
        = numberLength === 10 ? dayjs.unix(dayjsResult) : dayjs(dayjsResult)
    }
    else if (!dayjs.isDayjs(dayjsResult) || dayjsResult instanceof Date) {
      dayjsResult = dayjs(dayjsResult)
    }

    if (dayjsResult.isValid())
      return dayjsResult.tz(timeZone)

    throw new Error(`not valid dayjs:${dateValue}`)
  }

  /**
   * UTC 반환
   * @param {CmDateType} dateValue
   */
  toUtc(dateValue) {
    const date = this.toDate(dateValue)
    return Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    )
  }

  /**
   * (좌항 - 우항) 두 날짜간의 시간 간격에 해당하는 값을 추출하여 반환
   * @param {CmDateType} activeDate (좌항) 비교할려는 날짜
   * @param {CmDateType} [passiveDate = new Date()] (우항) 비교당하는 날짜
   * @example
   * const prevDate = '2023-06-08';
   * const nextDate = '2023-06-09 10:00:00';
   * getElapsedTime(nextDate, prevDate);
   * // => {diffMonth: 0, diffDay: 1, diffHour: 10, diffMin: 0, diffSec: 0}
   * getElapsedTime(prevDate, nextDate);
   * // => {diffMonth: 0, diffDay: -2, diffHour: 14, diffMin: 0, diffSec: 0}
   */
  getElapsedTime(
    activeDate,
    passiveDate = new Date(),
    timeZone = this.timeZone,
  ) {
    const remainMonth = this.toDayjs(activeDate, timeZone).diff(
      passiveDate,
      'month',
    )
    let diffMonth = 0
    if (remainMonth > 0) {
      diffMonth = remainMonth
      activeDate = this.toDayjs(activeDate, timeZone).subtract(
        diffMonth,
        'month',
      )
    }
    let remainMs = this.toDayjs(activeDate, timeZone).diff(
      passiveDate,
      'millisecond',
    )

    const diffDay = Math.floor(remainMs / (1000 * 60 * 60 * 24))
    remainMs -= diffDay * (1000 * 60 * 60 * 24)
    const diffHour = Math.floor(remainMs / (1000 * 60 * 60))
    remainMs -= diffHour * (1000 * 60 * 60)
    const diffMin = Math.floor(remainMs / (1000 * 60))
    remainMs -= diffMin * (1000 * 60)
    const diffSec = Math.floor(remainMs / 1000)

    return { diffMonth, diffDay, diffHour, diffMin, diffSec }
  }

  /**
   * 언어(locale)에 따라 상대 시간 서식을 지정하여 반환
   * @param {CmDateType} activeDate (좌항) 비교할려는 날짜
   * @param {{passiveDate?: CmDateType, locale?: string, timeZone?: string}} [option]
   * @example
   */
  #getElapsedTimeRtfConfig(activeDate, option = {}) {
    const {
      locale = this.locale,
      passiveDate = new Date(),
      timeZone = this.timeZone,
    } = option

    const isReverse = this.toDayjs(activeDate, timeZone).isBefore(passiveDate)

    const elaspedTime = isReverse
      ? this.getElapsedTime(passiveDate, activeDate)
      : this.getElapsedTime(activeDate, passiveDate)

    let value = 0
    /** @type {Intl.RelativeTimeFormatUnit}  */
    let unit = 'second'
    if (elaspedTime.diffMonth) {
      value = elaspedTime.diffMonth
      unit = 'month'
    }
    else if (elaspedTime.diffDay) {
      value = elaspedTime.diffDay
      unit = 'day'
    }
    else if (elaspedTime.diffHour) {
      value = elaspedTime.diffHour
      unit = 'hour'
    }
    else if (elaspedTime.diffMin) {
      value = elaspedTime.diffMin
      unit = 'minute'
    }
    else if (elaspedTime.diffSec) {
      value = elaspedTime.diffSec
      unit = 'second'
    }
    value = isReverse ? value * -1 : value

    return {
      value,
      unit,
      locale,
    }
  }

  /**
   * 언어(locale)에 따라 상대 시간 서식을 지정하여 반환
   * @param {CmDateType} activeDate (좌항) 비교할려는 날짜
   * @param {{flag?: CmRtfOptionFlag, passiveDate?: CmDateType, locale?: string, timeZone?: string}} [option]
   */
  toFormatRtf(activeDate, option = {}) {
    const { flag = 'base' } = option
    const { locale, unit, value } = this.#getElapsedTimeRtfConfig(
      activeDate,
      option,
    )

    let rtfOption
    switch (flag) {
      case 'base':
        rtfOption = this.#rtfOption.base
        break
      default:
        rtfOption = this.#rtfOption.base
        break
    }

    return new Intl.RelativeTimeFormat(locale, rtfOption).format(value, unit)
  }

  /**
   * 언어(locale)에 따라 상대 시간 서식을 지정하여 반환
   * @param {CmDateType} dateValue (좌항) 비교할려는 날짜
   * @param {{flag?: CmDtfOptionFlag, locale?: string, timeZone?: string}} [option]
   * @example
   */
  toFormatDtf(dateValue, option = {}) {
    const {
      flag = 'base',
      locale = this.locale,
      timeZone = this.timeZone,
    } = option

    let dtfOption
    switch (flag) {
      case 'base':
        dtfOption = this.#dtfOption.base
        break
      case 'hour12':
        dtfOption = this.#dtfOption.hour12
        break
      default:
        dtfOption = this.#dtfOption.base
        break
    }

    return new Intl.DateTimeFormat(locale, {
      ...dtfOption,
      timeZone,
    }).format(this.toDate(dateValue))
  }

  /**
   * FIXME 기획 방향에 따라서 수정 필요
   * @param {CmDateType} activeDate (좌항) 비교할려는 날짜
   * @param {{flag?: CmDateTypeFlag, locale?: string, timeZone?: string}} [option]
   */
  toFormat(activeDate, option = {}) {
    const { locale = this.locale, timeZone = this.timeZone } = option
    const isToday = this.toDayjs(activeDate, timeZone).isSame(
      new Date(),
      'day',
    )

    let dtfOption
    if (isToday)
      dtfOption = this.#dtfOption.hour12
    else dtfOption = this.#dtfOption.base

    return new Intl.DateTimeFormat(locale, {
      ...dtfOption,
      timeZone,
    }).format(this.toDate(activeDate))
  }

  /**
   * UTC Offset 반환. 분단위
   * @param {CmDateType} [dateValue]
   * @param {string} [timeZone=this.timeZone]
   */
  getUtcOffset(dateValue = new Date(), timeZone = this.timeZone) {
    return this.toDayjs(dateValue, timeZone).utcOffset()
  }

  /**
   * 데이터 반환형태를 가져옴. ms는 year 로 처리.
   * @param {dayjs.UnitTypeLong} [unit = 'day'] 보여주고자 하는 범위
   * @param {dayjs.UnitTypeLong} [sliceUnit] 앞에서부터 절삭 범위
   * @example
   * getStrFormat(); // => 'YYYY-MM-DD'
   * getStrFormat('second'); // => 'YYYY-MM-DD HH:mm:ss'
   * getStrFormat('second', 'month'); // => 'HH:mm:ss'
   */
  getStrFormat(unit = 'day', sliceUnit) {
    switch (unit) {
      case 'year':
        return 'YYYY'
      case 'month':
        switch (sliceUnit) {
          case 'year':
            return 'MM'
          default:
            return 'YYYY-MM'
        }
      case 'date':
      case 'day':
        switch (sliceUnit) {
          case 'year':
            return 'MM-DD'
          case 'month':
            return 'DD'
          default:
            return 'YYYY-MM-DD'
        }
      case 'hour':
        switch (sliceUnit) {
          case 'year':
            return 'MM-DD HH'
          case 'month':
            return 'DD HH'
          case 'date':
          case 'day':
            return 'HH'
          default:
            return 'YYYY-MM-DD HH'
        }
      case 'minute':
        switch (sliceUnit) {
          case 'year':
            return 'MM-DD HH:mm'
          case 'month':
            return 'DD HH:mm'
          case 'date':
          case 'day':
            return 'HH:mm'
          case 'hour':
            return 'mm'
          default:
            return 'YYYY-MM-DD HH:mm'
        }
      case 'second':
        switch (sliceUnit) {
          case 'year':
            return 'MM-DD HH:mm:ss'
          case 'month':
            return 'DD HH:mm:ss'
          case 'date':
          case 'day':
            return 'HH:mm:ss'
          case 'hour':
            return 'mm:ss'
          case 'minute':
            return 'ss'
          default:
            return 'YYYY-MM-DD HH:mm:ss'
        }
      default:
        return 'YYYY-MM-DD'
    }
  }

  /**
   * string 형태로 변환하여 반환. unit에 따라 변환
   * @summary Admin 용
   * @see {@link CmDateUtil.getStrFormat}
   * @param {number | string | Date | dayjs.Dayjs} dateValue 날짜
   * @param {dayjs.UnitTypeLong} [unit = 'day'] 보여주고자 하는 범위
   * @param {dayjs.UnitTypeLong} [sliceUnit] 앞에서부터 절삭 범위
   * @example
   * // 현재 시각: '2023-05-27 15:33:19' 일 경우
   * toStrFormat('2023-05-27');
   * // => '2023-05-27' unit 기본값 day
   * toStrFormat(new Date(), 'second');
   * // => '2023-05-27 15:33:19'
   * toStrFormat(dayjs().valueOf(), 'second');
   * // => '2023-05-27 15:33:19' timestamp 처리. unix 처리 가능
   * toStrFormat(dayjs(), 'second', 'month');
   * // => '15:33:19' second 까지 보여주나 앞에서부터 month까지 절삭
   */
  toStrFormat(dateValue, unit = 'day', sliceUnit) {
    const strFormat = this.getStrFormat(unit, sliceUnit)
    const date = this.toDayjs(dateValue)

    return date.format(strFormat)
  }

  /**
   * 날짜를 초기화할경우 검색 범위 반환
   * @param {number | string | Date | dayjs.Dayjs | number[] | string[] | Date[] | dayjs.Dayjs[]} [dateValue] 데이터 없으면 현재시각
   * @param {Exclude<dayjs.UnitTypeLong, 'date'> | 'range'} [resetOf = 'day'] 해당 단위이하 초기화. range는 day로 계산
   * @param {dayjs.UnitTypeLong} [formatUnit = 'day'] 반환하고자 하는 범위 단위
   * @param {boolean} [hasEndDate = false] 마지막 날짜를 포함할지 여부
   * @returns {string[]} [시작날짜, 종료날짜]
   * @example
   * // 현재 시각: '2023-05-27 15:33:19' 일 경우
   * toStrRange();
   * // => ['2023-05-27', '2023-05-27']
   * toStrRange(new Date(), 'day', 'second');
   * // => ['2023-05-27 00:00:00', '2023-05-27 23:59:59']
   * toStrRange(new Date(), 'hour', 'minute');
   * // => ['2023-05-27 15:00', '2023-05-27 15:59']
   * toStrRange(new Date(), 'hour', 'minute', true);
   * // => ['2023-05-27 15:00', '2023-05-27 15:59']
   * toStrRange(new Date(), 'day', 'day', true);
   * // => ['2023-05-27', '2023-05-28']
   * toStrRange(new Date(), 'hour', 'second', true);
   * // => ['2023-05-27 15:00:00', '2023-05-27 16:00:00']
   */
  toStrRange(
    dateValue,
    resetOf = 'day',
    formatUnit = 'day',
    hasEndDate = false,
  ) {
    const allowUnits = [
      'millisecond',
      'second',
      'minute',
      'hour',
      'day',
      'month',
      'year',
    ]
    /** @type {Exclude<dayjs.UnitTypeLong, 'date'>} 날짜를 add 할수 있는 단위로 변경 */
    const realResetOf = allowUnits.includes(resetOf) ? resetOf : 'day'
    formatUnit = allowUnits.includes(formatUnit) ? formatUnit : 'day'
    // 시작 날짜와 종료 날짜를 추출. 배열일 경우 첫인자와 끝인자로 정의
    const startDateValue = Array.isArray(dateValue) ? dateValue[0] : dateValue
    const endDateValue = Array.isArray(dateValue)
      ? dateValue[dateValue.length - 1]
      : dateValue

    // 초기화 할려는 날짜 단위에 따라 각 날짜 초기화
    const startDayjs = this.toDayjs(startDateValue).startOf(realResetOf)
    const endDayjs = hasEndDate
      ? this.toDayjs(endDateValue).startOf(realResetOf).add(1, realResetOf)
      : this.toDayjs(endDateValue).endOf(realResetOf)

    return [
      this.toStrFormat(startDayjs, formatUnit),
      this.toStrFormat(endDayjs, formatUnit),
    ]
  }
}

/** @typedef {number | string | Date | dayjs.Dayjs} CmDateType Util에서 사용하는 Date Type */

/** @typedef {'auto'} CmDateTypeFlag DateTimeFormat 옵션 타입 */

/** @typedef {'base' | 'hour12'} CmDtfOptionFlag DateTimeFormat 옵션 타입 */

/** @typedef {'base'} CmRtfOptionFlag RelativeTimeFormat 옵션 타입 */

/** @typedef {{locale?: string, timeZone?: string}} CmDateBaseParam */
