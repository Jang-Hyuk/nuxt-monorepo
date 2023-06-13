const CmDeviceUtil = require('../CmDeviceUtil')

describe('CmDeviceUtil', () => {
  const ua = {
    ios: {
      iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      ipad: 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1',
    },
    windows: {
      desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      surface: 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1',
    },
    aos: {
      galaxy: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36',
      nest: 'Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.109 Safari/537.36 CrKey/1.54.248666',
    },
    browsers: {
      ucBrowser: 'Mozilla/5.0 (Linux; U; Android 12; en-US; PDKM00 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.108 UCBrowser/13.4.2.1307 Mobile Safari/537.36',
      edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/113.0.1774.57',
      googleBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/113.0.5672.127 Safari/537.36',
      chromium: 'Mozilla/5.0 (X11: Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/2019.04 Iridium/2019.04 Safari/537.36 Chrome/73.0.0.0',
      firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0',
      opera: 'Opera/9.80 (Android; Opera Mini/69.0.2254/191.303; U; en) Presto/2.12.423 Version/12.16',
    },
  }

  const SUFFIX = {
    appName: 'CLUB5678',
    appVer: '1.23.456',
    appOs: '15.0.1',
    store: {
      app: '_AppStore',
      play: '_PlayStore',
      one: '_OneStore',
    },
  }

  const appSuffix = {
    appStore: `${SUFFIX.appName}/${SUFFIX.appVer}/${SUFFIX.appOs}/_AppStore`,
    playStore: `${SUFFIX.appName}/${SUFFIX.appVer}/${SUFFIX.appOs}/_PlayStore`,
    oneStore: `${SUFFIX.appName}/${SUFFIX.appVer}/${SUFFIX.appOs}/_OneStore`,
  }

  describe('iOS', () => {
    const cmDeviceUtil = new CmDeviceUtil({ userAgent: ua.ios.iphone })
    it('iphone', () => {
      expect(cmDeviceUtil.browsers).toEqual({
        isChrome: false,
        isEdge: false,
        isFirefox: false,
        isIE: false,
        isSafari: true,
        isSamsung: false,
      })

      expect(cmDeviceUtil.browser).toBe('Safari/604.1')

      expect(cmDeviceUtil.os).toEqual({
        isAos: false,
        isIos: true,
        isMac: true,
        isWindows: false,
      })

      expect(cmDeviceUtil.platform).toEqual({
        isCrawler: false,
        isDesktop: false,
        isDesktopOrTablet: false,
        isMobile: true,
        isMobileOrTablet: true,
        isTablet: false,
      })

      expect(cmDeviceUtil.store).toEqual({ isAppStore: false, isPlayStore: false, isOneStore: false })

      expect(cmDeviceUtil.services.isNothing).toBeTruthy()

      expect(cmDeviceUtil.isApp()).toBeFalsy()
      expect(cmDeviceUtil.isMobile()).toBeTruthy()
      expect(cmDeviceUtil.isPc()).toBeFalsy()
    })

    it('iphone add suffix', () => {
      cmDeviceUtil.init(`${ua.ios.iphone} ${appSuffix.appStore}`)

      expect(cmDeviceUtil.appInfo).toEqual({
        appName: SUFFIX.appName,
        appVer: SUFFIX.appVer,
        osVer: SUFFIX.appOs,
        store: SUFFIX.store.app,
      })

      expect(cmDeviceUtil.store).toEqual({ isAppStore: true, isPlayStore: false, isOneStore: false })
      expect(cmDeviceUtil.services.isEarthArcade).toBeTruthy()
    })

    it('ipad', () => {
      cmDeviceUtil.init(ua.ios.ipad)

      // ipad는 criOs 덕분에 크롬이 활성화 되네.. 이게 맞나
      expect(cmDeviceUtil.browsers).toEqual({
        isChrome: true,
        isEdge: false,
        isFirefox: false,
        isIE: false,
        isSafari: false,
        isSamsung: false,
      })

      expect(cmDeviceUtil.browser).toBe('Chrome/87.0.4280.77')

      expect(cmDeviceUtil.os).toEqual({
        isAos: false,
        isIos: true,
        isMac: true,
        isWindows: false,
      })

      expect(cmDeviceUtil.platform).toEqual({
        isCrawler: false,
        isDesktop: false,
        isDesktopOrTablet: true,
        isMobile: false,
        isMobileOrTablet: true,
        isTablet: true,
      })

      expect(cmDeviceUtil.services.isNothing).toBeTruthy()

      expect(cmDeviceUtil.isApp()).toBeFalsy()
      expect(cmDeviceUtil.isMobile()).toBeTruthy()
      expect(cmDeviceUtil.isPc()).toBeFalsy()
    })
  })

  describe('AOS', () => {
    const cmDeviceUtil = new CmDeviceUtil({ userAgent: ua.aos.galaxy })
    it('galaxy', () => {
      expect(cmDeviceUtil.browsers).toEqual({
        isChrome: true,
        isEdge: false,
        isFirefox: false,
        isIE: false,
        isSafari: false,
        isSamsung: false,
      })

      expect(cmDeviceUtil.browser).toBe('Chrome/87.0.4280.141')

      expect(cmDeviceUtil.os).toEqual({
        isAos: true,
        isIos: false,
        isMac: false,
        isWindows: false,
      })

      expect(cmDeviceUtil.platform).toEqual({
        isCrawler: false,
        isDesktop: false,
        isDesktopOrTablet: false,
        isMobile: true,
        isMobileOrTablet: true,
        isTablet: false,
      })

      expect(cmDeviceUtil.services.isNothing).toBeTruthy()

      expect(cmDeviceUtil.isApp()).toBeFalsy()
      expect(cmDeviceUtil.isMobile()).toBeTruthy()
      expect(cmDeviceUtil.isPc()).toBeFalsy()
    })

    it('galaxy add suffix PlayStore', () => {
      cmDeviceUtil.init(`${ua.aos.galaxy} ${appSuffix.playStore}`)

      expect(cmDeviceUtil.appInfo).toEqual({
        appName: SUFFIX.appName,
        appVer: SUFFIX.appVer,
        osVer: SUFFIX.appOs,
        store: SUFFIX.store.play,
      })

      expect(cmDeviceUtil.store).toEqual({ isAppStore: false, isPlayStore: true, isOneStore: false })
      expect(cmDeviceUtil.services.isEarthArcade).toBeTruthy()
    })

    it('galaxy add suffix OneStore', () => {
      cmDeviceUtil.init(`${ua.aos.galaxy} ${appSuffix.oneStore}`)

      expect(cmDeviceUtil.appInfo).toEqual({
        appName: SUFFIX.appName,
        appVer: SUFFIX.appVer,
        osVer: SUFFIX.appOs,
        store: SUFFIX.store.one,
      })

      expect(cmDeviceUtil.store).toEqual({ isAppStore: false, isPlayStore: false, isOneStore: true })
      expect(cmDeviceUtil.services.isEarthArcade).toBeTruthy()
    })

    it('nest', () => {
      cmDeviceUtil.init(ua.aos.nest)

      // ipad는 criOs 덕분에 크롬이 활성화 되네.. 이게 맞나
      expect(cmDeviceUtil.browsers).toEqual({
        isChrome: true,
        isEdge: false,
        isFirefox: false,
        isIE: false,
        isSafari: false,
        isSamsung: false,
      })

      expect(cmDeviceUtil.browser).toBe('Chrome/88.0.4324.109')

      expect(cmDeviceUtil.os).toEqual({
        isAos: true,
        isIos: false,
        isMac: false,
        isWindows: false,
      })

      expect(cmDeviceUtil.platform).toEqual({
        isCrawler: false,
        isDesktop: false,
        isDesktopOrTablet: true,
        isMobile: false,
        isMobileOrTablet: true,
        isTablet: true,
      })

      expect(cmDeviceUtil.services.isNothing).toBeTruthy()

      expect(cmDeviceUtil.isApp()).toBeFalsy()
      expect(cmDeviceUtil.isMobile()).toBeTruthy()
      expect(cmDeviceUtil.isPc()).toBeFalsy()
    })
  })

  describe('Windows', () => {
    const cmDeviceUtil = new CmDeviceUtil({ userAgent: ua.windows.desktop })
    it('desktop', () => {
      expect(cmDeviceUtil.browsers).toEqual({
        isChrome: true,
        isEdge: false,
        isFirefox: false,
        isIE: false,
        isSafari: false,
        isSamsung: false,
      })

      expect(cmDeviceUtil.browser).toBe('Chrome/113.0.0.0')

      expect(cmDeviceUtil.os).toEqual({
        isAos: false,
        isIos: false,
        isMac: false,
        isWindows: true,
      })

      expect(cmDeviceUtil.platform).toEqual({
        isCrawler: false,
        isDesktop: true,
        isDesktopOrTablet: true,
        isMobile: false,
        isMobileOrTablet: false,
        isTablet: false,
      })

      expect(cmDeviceUtil.storeLink).toBe('')
      expect(cmDeviceUtil.services.isNothing).toBeTruthy()

      expect(cmDeviceUtil.isApp()).toBeFalsy()
      expect(cmDeviceUtil.isMobile()).toBeFalsy()
      expect(cmDeviceUtil.isPc()).toBeTruthy()
    })

    it('surface', () => {
      cmDeviceUtil.init(ua.windows.surface)

      // ipad는 criOs 덕분에 크롬이 활성화 되네.. 이게 맞나
      expect(cmDeviceUtil.browsers).toEqual({
        isChrome: true,
        isEdge: false,
        isFirefox: false,
        isIE: false,
        isSafari: false,
        isSamsung: false,
      })

      expect(cmDeviceUtil.browser).toBe('Chrome/87.0.4280.77')

      expect(cmDeviceUtil.os).toEqual({
        isAos: false,
        isIos: true,
        isMac: true,
        isWindows: false,
      })

      expect(cmDeviceUtil.platform).toEqual({
        isCrawler: false,
        isDesktop: false,
        isDesktopOrTablet: true,
        isMobile: false,
        isMobileOrTablet: true,
        isTablet: true,
      })

      expect(cmDeviceUtil.services.isNothing).toBeTruthy()

      expect(cmDeviceUtil.isApp()).toBeFalsy()
      expect(cmDeviceUtil.isMobile()).toBeTruthy()
      expect(cmDeviceUtil.isPc()).toBeFalsy()
    })
  })

  it('browsers', () => {
    const cmDeviceUtil = new CmDeviceUtil({ userAgent: ua.browsers.ucBrowser })
    expect(cmDeviceUtil.browser).toBe('UCBrowser/13.4.2.1307')

    cmDeviceUtil.init(ua.browsers.edge)
    expect(cmDeviceUtil.browser).toBe('Edge/113.0.1774.57')

    cmDeviceUtil.init(ua.browsers.googleBot)
    expect(cmDeviceUtil.browser).toBe('GoogleBot/2.1')

    cmDeviceUtil.init(ua.browsers.chromium)
    expect(cmDeviceUtil.browser).toBe('Chromium/2019.04')

    cmDeviceUtil.init(ua.browsers.firefox)
    expect(cmDeviceUtil.browser).toBe('Firefox/113.0')

    cmDeviceUtil.init(ua.browsers.opera)
    expect(cmDeviceUtil.browser).toBe('Opera/9.80')
  })

  // 예외 사항 체킹
  it('Throw', () => {
    const cmDeviceUtil = new CmDeviceUtil()
    // 이상한 UA가 들어오면 리셋 처리
    expect(cmDeviceUtil.appInfo).toEqual({ appName: '', appVer: '', osVer: '', store: '' })

    expect(cmDeviceUtil.browsers).toEqual({
      isChrome: false,
      isEdge: false,
      isFirefox: false,
      isIE: false,
      isSafari: false,
      isSamsung: false,
    })

    expect(cmDeviceUtil.browser).toBe('unknown/0.0.0.0')

    expect(cmDeviceUtil.os).toEqual({
      isAos: false,
      isIos: false,
      isMac: false,
      isWindows: false,
    })
    // 플랫폼은 Desktop 이라고 처리
    expect(cmDeviceUtil.platform).toEqual({
      isCrawler: false,
      isDesktop: true,
      isDesktopOrTablet: true,
      isMobile: false,
      isMobileOrTablet: false,
      isTablet: false,
    })

    expect(cmDeviceUtil.storeLink).toBe('')
    expect(cmDeviceUtil.services.isNothing).toBeTruthy()

    expect(cmDeviceUtil.isApp()).toBeFalsy()
    expect(cmDeviceUtil.isMobile()).toBeFalsy()
    // 플랫폼은 Desktop 이라고 처리
    expect(cmDeviceUtil.isPc()).toBeTruthy()

    // 딸려오는 정보가 이상할 경우 appInfo는 초기화 처리 한다.
    cmDeviceUtil.init(`${ua.aos.galaxy} EarthArcade/2.11.36`)
    expect(cmDeviceUtil.appInfo).toEqual({ appName: '', appVer: '', osVer: '', store: '' })
  })
})
