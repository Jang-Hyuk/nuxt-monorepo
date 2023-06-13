import _ from 'lodash'

export default class FeStorageUtil {
  #baseUtil
  #dateUtil

  /**
     * @param {object} opt
     * @param {import('../common/CmBaseUtil').default} opt.baseUtil
     * @param {import('../common/CmDateUtil')} opt.dateUtil
     */
  constructor(opt) {
    const { baseUtil, dateUtil } = opt

    this.#baseUtil = baseUtil
    this.#dateUtil = dateUtil
  }

  /**
     * storage 파람값이 flag(string) 일 경우 대응하는 스토리지로 변환하여 반환
     * @param {StorageFlag} storage localStorage or sessionStorage. 'l': localStorage, 's': sessionStorage
     * @returns {Storage}
     * @example
     * #getStorage('l'): localStorage
     * #getStorage('s'): sessionStorage
     * #getStorage(localStorage): localStorage
     */
  #getStorage(storage) {
    if (typeof storage === 'string')
      storage = storage === 'l' ? localStorage : sessionStorage

    return storage
  }

  /**
     * 스토리지 키에 해당하는 값을 dayjs로 변환 ('.' 연산자를 통해서 deep value 추출 지원)
     * @param {StorageFlag} storage localStorage or sessionStorage. 'l': localStorage, 's': sessionStorage
     * @param {string} [key = ''] 'key' or 'key.subKey'
     * @param {boolean} [isNumeric = false] 해당 문자열 값이 timestamp or unix일 경우 true로 입력
     * @example
     * setValue('s', 'layer_date', {"pause": "20220617000000","expire": "20901231"})
     * getDate('s', 'layer_date.pause'); // Dayjs '2022-06-17 00:00:00'
     * getDate('s', 'layer_date.expire'); // Dayjs '2090-12-31'
     */
  getDate(storage, key = '', isNumeric = false) {
    let storageValue = this.getValue(storage, key)

    if (isNumeric) {
      storageValue = this.#baseUtil.isNumberic(storageValue)
        ? parseInt(storageValue, 10)
        : ''
    }

    return this.#dateUtil.toDayjs(storageValue)
  }

  /**
     * 스토리지에 설정된 값 로드 ('.' 연산자를 통해서 deep value 추출 지원)
     * @param {StorageFlag} storage 'l': localStorage, 's': sessionStorage
     * @param {string} key 'key' or 'key.subKey'
     * @param {any} [defaultValue] 값이 없을 경우 설정할 초기 값. 'key' 일 경우 null, 'key.subKey'일 경우 undefined를 defaultValue로 대체
     * @returns {string | number | object | null} 키가 없을 경우 null
     * @example
     * setValue('s', 'user', { age: 25, name: 'tester' });
     * getValue('s', 'user'); // => {age: 25, name:'tester'}
     * getValue('s', 'user.age'); // => 25
     * getValue('s', 'user.hi', '123'); // => '123'
     */
  getValue(storage, key = '', defaultValue) {
    storage = this.#getStorage(storage)
    const keys = key.split('.')
    let storageValue = storage.getItem(keys[0])
    if (storageValue === null)
      return defaultValue
    storageValue = this.#baseUtil.isJsonParse(storageValue)
      ? JSON.parse(storageValue)
      : storageValue
    // key => 'key.subKey'일 경우 undefined를 defaultValue로 대체
    if (keys.length > 1)
      return _.get(storageValue, _.tail(keys).join('.'), defaultValue)

    // key => 'key' 일 경우 null을 defaultValue로 대체
    return storageValue === null ? defaultValue : storageValue
  }

  /**
     * 스토리지 remove & deep Remove
     * @param {StorageFlag} storage 'l': localStorage, 's': sessionStorage
     * @param {string} key storage key
     * @param {string | string[] | number | number[]} propertyNameInValue storage value안의 property name
     * @example
     * setValue('l', 'joinInfo', { x: { ex: 1 }, y: { ex: 2 } });
     * removeValue('l', 'joinInfo'); // => joinInfo :: deleted
     * removeValue('l', 'joinInfo', 'x'); // => joinInfo :: {"y": {"ex":2}}
     * removeValue('l', 'joinInfo', ['x', 'y']); // => joinInfo :: removed
     */
  removeValue(storage, key, propertyNameInValue) {
    storage = this.#getStorage(storage)
    let value = this.getValue(storage, key)

    // 스토리지 또는 해당 데이터가 존재하지 않거나 deepKey가 존재하지 않을경우 저장소 삭제
    if (_.isEmpty(value) || !propertyNameInValue)
      return storage.removeItem(key)

    value = _.isArray(propertyNameInValue)
      ? _.omit(value, propertyNameInValue)
      : _.omit(value, [propertyNameInValue])

    if (_.isEmpty(value))
      return storage.removeItem(key)

    this.setValue(storage, key, value)
  }

  /**
     * 스토리지에 값 설정. setValue와 유사하나 동일 키 값으로 다중 id를 관리할 때 사용
     * @param {StorageFlag} storage 'l': localStorage, 's': sessionStorage
     * @param {string} key storage key
     * @param {string | number} valueId storage value id
     * @param {any} value storage value
     * @example
     * setDeepValue('s', 'user', 'one', 25);
     * getValue('s', 'user'); // => {one: 25}
     * setDeepValue('s', 'user', 'two', { age: 25 });
     * getValue('s', 'user'); // => {one: 25, two: {age: 25}}
     */
  setDeepValue(storage, key, valueId, value) {
    storage = this.#getStorage(storage)
    let storageValue = this.getValue(storage, key)
    // 값이 존재하지않거나 object 형태가 아니라면 초기화 시켜버림
    storageValue = _.isEmpty(storageValue) || !_.isObject(storageValue) ? {} : storageValue
    // 값 설정. 기존 값이 존재 시 덮어씀
    const realValue = _.set(storageValue, valueId, value)

    storage.setItem(key, JSON.stringify(realValue))
  }

  /**
     * 스토리지에 값 설정. 저장값의 형태가 object 라면 변환처리하여 저장
     * @param {StorageFlag} storage 'l': localStorage, 's': sessionStorage
     * @param {string} key storage key
     * @param {any} value storage value
     * @example
     * setValue('s', 'user', 25);
     * setValue('s', 'user', { age: 25, name: 'tester' });
     */
  setValue(storage, key, value) {
    storage = this.#getStorage(storage)
    value = typeof value === 'object' ? JSON.stringify(value) : value
    storage.setItem(key, value)
  }
}

/** @typedef {'l' | 's' | Storage} StorageFlag localStorage or sessionStorage. 'l': localStorage, 's': sessionStorage */
