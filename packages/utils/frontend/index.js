import Vue from 'vue'

import BaseUtil from '../common/CmBaseUtil'
import DateUtil from '../common/CmDateUtil'
import DeviceUtil from '../common/CmDeviceUtil'
import StringUtil from '../common/CmStringUtil'
import MediaUtil from '../common/CmMediaUtil'
import QsUtil from '../common/CmQsUtil'
import StorageUtil from './FeStorageUtil'
import DomUtil from './FeDomUtil'

/** @type {import('@nuxt/types').Plugin} */
export default (ctx, inject) => {
  /** server & client 에 따라 userAgent 반환 */
  function getUserAgent() {
    let userAgent = ''
    if (typeof ctx.req !== 'undefined')
      userAgent = ctx.req.headers['user-agent'] || ''

    else if (typeof navigator !== 'undefined')
      userAgent = navigator.userAgent

    return userAgent
  }

  const makeFlags = () => {
    const userAgent = getUserAgent()
    const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions()

    const baseUtil = new BaseUtil()
    const dateUtil = new DateUtil({ locale, timeZone })
    const stringUtil = new StringUtil()
    const qsUtil = new QsUtil()
    const mediaUtil = new MediaUtil({ qsUtil, stringUtil })
    const deviceUtil = new DeviceUtil({ userAgent })

    const domUtil = new DomUtil()
    const storageUtil = new StorageUtil({ baseUtil, dateUtil })

    return {
      baseUtil,
      dateUtil,
      deviceUtil,
      domUtil,
      storageUtil,
      stringUtil,
      qsUtil,
      mediaUtil,
    }
  }

  const createResizeFlags = () => {
    const userAgent = getUserAgent()

    const deviceUtil = new DeviceUtil({ userAgent })
    return {
      deviceUtil,
    }
  }

  const flags = makeFlags()
  const {
    baseUtil,
    dateUtil,
    deviceUtil,
    domUtil,
    storageUtil,
    stringUtil,
    qsUtil,
    mediaUtil,
  } = flags

  inject('base', baseUtil)

  if (typeof window !== 'undefined') {
    inject('device', Vue.observable(deviceUtil))

    inject('util', {
      // 동기가 필요한 유틸
      device: Vue.observable(deviceUtil),
      // 동기가 필요없는 유틸
      base: baseUtil,
      date: dateUtil,
      dom: domUtil,
      storage: storageUtil,
      str: stringUtil,
      qs: qsUtil,
      media: mediaUtil,
    })

    window.addEventListener('resize', () => {
      setTimeout(() => {
        const { deviceUtil: newDeviceUtil } = createResizeFlags()
        for (const key in newDeviceUtil)
          ctx.$device[key] = newDeviceUtil[key]
      }, 50)
    })
  }
  else {
    inject('device', deviceUtil)

    inject('util', {
      device: deviceUtil,
      base: baseUtil,
      date: dateUtil,
      dom: domUtil,
      storage: storageUtil,
      str: stringUtil,
      qs: qsUtil,
      media: mediaUtil,
    })
  }
}
