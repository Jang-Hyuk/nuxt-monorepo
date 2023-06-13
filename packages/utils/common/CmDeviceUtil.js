import _ from 'lodash'

/**
 * userAgent를 활용하여 GLOBAL_CHAT 서비스와 액세스 장치 판별
 * @summary per User
 * @see {@link https://www.npmjs.com/package/@nuxtjs/device/v/2.1.0} This module is written with reference to nuxtjs/device v2.1.0
 */
export default class CmDeviceUtil {
  /** @type {{ANDROID: 'a', IOS: 'i', MOBILE: 'w'}} OS flag */
  #OS_TYPE = {
    ANDROID: 'a',
    IOS: 'i',
    MOBILE: 'w',
  }

  #REGEX_MOBILE = /android|iphone|ipad/i

  #REGEX_MOBILE1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|FBAN|FBAV|fennec|hiptop|iemobile|ip(hone|od)|Instagram|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i

  #REGEX_MOBILE2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i

  #REGEX_MOBILE_OR_TABLET1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|FBAN|FBAV|fennec|hiptop|iemobile|ip(hone|od)|Instagram|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i

  #REGEX_MOBILE_OR_TABLET2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i

  #REGEX_CRAWLER = /Googlebot\/|Googlebot-Mobile|Googlebot-Image|Googlebot-News|Googlebot-Video|AdsBot-Google([^-]|$)|AdsBot-Google-Mobile|Feedfetcher-Google|Mediapartners-Google|Mediapartners \(Googlebot\)|APIs-Google|bingbot|Slurp|[wW]get|LinkedInBot|Python-urllib|python-requests|aiohttp|httpx|libwww-perl|httpunit|nutch|Go-http-client|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|BIGLOTRON|Teoma|convera|seekbot|Gigabot|Gigablast|exabot|ia_archiver|GingerCrawler|webmon |HTTrack|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|findlink|msrbot|panscient|yacybot|AISearchBot|ips-agent|tagoobot|MJ12bot|woriobot|yanga|buzzbot|mlbot|YandexBot|YandexImages|YandexAccessibilityBot|YandexMobileBot|YandexMetrika|YandexTurbo|YandexImageResizer|YandexVideo|YandexAdNet|YandexBlogs|YandexCalendar|YandexDirect|YandexFavicons|YaDirectFetcher|YandexForDomain|YandexMarket|YandexMedia|YandexMobileScreenShotBot|YandexNews|YandexOntoDB|YandexPagechecker|YandexPartner|YandexRCA|YandexSearchShop|YandexSitelinks|YandexSpravBot|YandexTracker|YandexVertis|YandexVerticals|YandexWebmaster|YandexScreenshotBot|purebot|Linguee Bot|CyberPatrol|voilabot|Baiduspider|citeseerxbot|spbot|twengabot|postrank|TurnitinBot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|Ahrefs(Bot|SiteAudit)|fuelbot|CrunchBot|IndeedBot|mappydata|woobot|ZoominfoBot|PrivacyAwareBot|Multiviewbot|SWIMGBot|Grobbot|eright|Apercite|semanticbot|Aboundex|domaincrawler|wbsearchbot|summify|CCBot|edisterbot|seznambot|ec2linkfinder|gslfbot|aiHitBot|intelium_bot|facebookexternalhit|Yeti|RetrevoPageAnalyzer|lb-spider|Sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|OrangeBot\/|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|S[eE][mM]rushBot|yoozBot|lipperhey|Y!J|Domain Re-Animator Bot|AddThis|Screaming Frog SEO Spider|MetaURI|Scrapy|Livelap[bB]ot|OpenHoseBot|CapsuleChecker|collection@infegy.com|IstellaBot|DeuSu\/|betaBot|Cliqzbot\/|MojeekBot\/|netEstate NE Crawler|SafeSearch microdata crawler|Gluten Free Crawler\/|Sonic|Sysomos|Trove|deadlinkchecker|Slack-ImgProxy|Embedly|RankActiveLinkBot|iskanie|SafeDNSBot|SkypeUriPreview|Veoozbot|Slackbot|redditbot|datagnionbot|Google-Adwords-Instant|adbeat_bot|WhatsApp|contxbot|pinterest.com.bot|electricmonk|GarlikCrawler|BingPreview\/|vebidoobot|FemtosearchBot|Yahoo Link Preview|MetaJobBot|DomainStatsBot|mindUpBot|Daum\/|Jugendschutzprogramm-Crawler|Xenu Link Sleuth|Pcore-HTTP|moatbot|KosmioBot|pingdom|AppInsights|PhantomJS|Gowikibot|PiplBot|Discordbot|TelegramBot|Jetslide|newsharecounts|James BOT|Bark[rR]owler|TinEye|SocialRankIOBot|trendictionbot|Ocarinabot|epicbot|Primalbot|DuckDuckGo-Favicons-Bot|GnowitNewsbot|Leikibot|LinkArchiver|YaK\/|PaperLiBot|Digg Deeper|dcrawl|Snacktory|AndersPinkBot|Fyrebot|EveryoneSocialBot|Mediatoolkitbot|Luminator-robots|ExtLinksBot|SurveyBot|NING\/|okhttp|Nuzzel|omgili|PocketParser|YisouSpider|um-LN|ToutiaoSpider|MuckRack|Jamie's Spider|AHC\/|NetcraftSurveyAgent|Laserlikebot|^Apache-HttpClient|AppEngine-Google|Jetty|Upflow|Thinklab|Traackr.com|Twurly|Mastodon|http_get|DnyzBot|botify|007ac9 Crawler|BehloolBot|BrandVerity|check_http|BDCbot|ZumBot|EZID|ICC-Crawler|ArchiveBot|^LCC |filterdb.iss.net\/crawler|BLP_bbot|BomboraBot|Buck\/|Companybook-Crawler|Genieo|magpie-crawler|MeltwaterNews|Moreover|newspaper\/|ScoutJet|(^| )sentry\/|StorygizeBot|UptimeRobot|OutclicksBot|seoscanners|Hatena|Google Web Preview|MauiBot|AlphaBot|SBL-BOT|IAS crawler|adscanner|Netvibes|acapbot|Baidu-YunGuanCe|bitlybot|blogmuraBot|Bot.AraTurka.com|bot-pge.chlooe.com|BoxcarBot|BTWebClient|ContextAd Bot|Digincore bot|Disqus|Feedly|Fetch\/|Fever|Flamingo_SearchEngine|FlipboardProxy|g2reader-bot|G2 Web Services|imrbot|K7MLWCBot|Kemvibot|Landau-Media-Spider|linkapediabot|vkShare|Siteimprove.com|BLEXBot\/|DareBoost|ZuperlistBot\/|Miniflux\/|Feedspot|Diffbot\/|SEOkicks|tracemyfile|Nimbostratus-Bot|zgrab|PR-CY.RU|AdsTxtCrawler|Datafeedwatch|Zabbix|TangibleeBot|google-xrawler|axios|Amazon CloudFront|Pulsepoint|CloudFlare-AlwaysOnline|Google-Structured-Data-Testing-Tool|WordupInfoSearch|WebDataStats|HttpUrlConnection|Seekport Crawler|ZoomBot|VelenPublicWebCrawler|MoodleBot|jpg-newsbot|outbrain|W3C_Validator|Validator\.nu|W3C-checklink|W3C-mobileOK|W3C_I18n-Checker|FeedValidator|W3C_CSS_Validator|W3C_Unicorn|Google-PhysicalWeb|Blackboard|ICBot\/|BazQux|Twingly|Rivva|Experibot|awesomecrawler|Dataprovider.com|GroupHigh\/|theoldreader.com|AnyEvent|Uptimebot\.org|Nmap Scripting Engine|2ip.ru|Clickagy|Caliperbot|MBCrawler|online-webceo-bot|B2B Bot|AddSearchBot|Google Favicon|HubSpot|Chrome-Lighthouse|HeadlessChrome|CheckMarkNetwork\/|www\.uptime\.com|Streamline3Bot\/|serpstatbot\/|MixnodeCache\/|^curl|SimpleScraper|RSSingBot|Jooblebot|fedoraplanet|Friendica|NextCloud|Tiny Tiny RSS|RegionStuttgartBot|Bytespider|Datanyze|Google-Site-Verification|TrendsmapResolver|tweetedtimes|NTENTbot|Gwene|SimplePie|SearchAtlas|Superfeedr|feedbot|UT-Dorkbot|Amazonbot|SerendeputyBot|Eyeotabot|officestorebot|Neticle Crawler|SurdotlyBot|LinkisBot|AwarioSmartBot|AwarioRssBot|RyteBot|FreeWebMonitoring SiteChecker|AspiegelBot|NAVER Blog Rssbot|zenback bot|SentiBot|Domains Project\/|Pandalytics|VKRobot|bidswitchbot|tigerbot|NIXStatsbot|Atom Feed Robot|Curebot|PagePeeker\/|Vigil\/|rssbot\/|startmebot\/|JobboerseBot|seewithkids|NINJA bot|Cutbot|BublupBot|BrandONbot|RidderBot|Taboolabot|Dubbotbot|FindITAnswersbot|infoobot|Refindbot|BlogTraffic\/\d\.\d+ Feed-Fetcher|SeobilityBot|Cincraw|Dragonbot|VoluumDSP-content-bot|FreshRSS|BitBot|^PHP-Curl-Class|Google-Certificates-Bridge/

  // FIXME
  #serverNameReg = /CLUB5678|CMS|ADMIN/i

  /** GLOBAL App Info */
  appInfo = {
    /** CLUB5678|CMS|ADMIN */
    appName: '',
    /** App Version */
    appVer: '',
    /** OS Version */
    osVer: '',
    /** @type {DeviceUtilStore}  Store  */
    store: '',
  }

  /** 브라우저 버젼 포함 ('UCBrowser', 'Edge', 'GoogleBot', 'Chromium', 'Firefox', 'Chrome', 'Safari', 'Opera') */
  browser = ''
  /** isSafari, isFirefox, isEdge, isChrome, isSamsung */
  browsers = {
    isSafari: false,
    isFirefox: false,
    isEdge: false,
    isChrome: false,
    isSamsung: false,
    isIE: false,
  }

  /** @type {'s' | 'x' | 'w'} (GLOBAL flag) s: App, x: mobile, w: web */
  appMedia = 'w'
  /** @type {'a' | 'i' | 'w'} (GLOBAL flag) Android or iOS or Mobile */
  appOs = 'w'
  /** @type {{APP: 's', MOBILE: 'x', PC_WEB: 'w'}} GLOBAL Media flag */
  MEDEA_TYPE = {
    APP: 's',
    MOBILE: 'x',
    PC_WEB: 'w',
  }

  /** isAos, isIos, isWindows, isMacOS */
  os = {
    isAos: false,
    isIos: false,
    isWindows: false,
    isMac: false,
  }

  /** isApp, isMobile, isDesktop, ... */
  platform = {
    isMobile: false,
    isMobileOrTablet: false,
    isTablet: false,
    isDesktop: false,
    isDesktopOrTablet: false,
    isCrawler: false,
  }

  /** GLOBAL, CMS, Admin, isNothing(회사 Service) */
  services = {
    isEarthArcade: false,
    isCms: false,
    isAdmin: false,
    isNothing: false,
  }

  /**
     * app 에서는 userAgent 뒤에 쓰이는 정보를 추가로 붙여 보내줌
     * @param {Object} opt
     * @param {string} [opt.userAgent = ''] Server: req['user-agent'], Client: navigator.userAgent
     */
  constructor(opt = {}) {
    const { userAgent = '' } = opt

    this.userAgent = userAgent
    const { qsUtil, stringUtil } = opt
    this.init()
  }

  /** 설치 스토어 */
  get store() {
    return {
      isAppStore: this.appInfo.store === '_AppStore',
      isPlayStore: this.appInfo.store === '_PlayStore',
      isOneStore: this.appInfo.store === '_OneStore',
    }
  }

  /**
     * 데이터 초기화
     * @param {Object} opt
     * @param {import('http').IncomingHttpHeaders['user-agent'] | Navigator['userAgent']} opt.userAgent Server: req['user-agent'], Client: navigator.userAgent
     */
  init(userAgent = this.userAgent) {
    this.userAgent = userAgent
    this.#updatePlatform()
    this.#updateBrowser()
    this.#updateOs()

    // Update CLUB5678 App Info(appName, smtpSlct, smtpId, appVer, phoneVer)
    this.#updateAppInfo()
    // Update CLUB5678 Os after updateOs is done
    this.#updateAppOs()

    if (this.#serverNameReg.test(this.appInfo.appName)) {
      this.appMedia = this.MEDEA_TYPE.APP
    }
    else {
      this.appMedia = this.#REGEX_MOBILE.test(this.userAgent)
        ? this.MEDEA_TYPE.MOBILE
        : this.MEDEA_TYPE.PC_WEB
    }

    // Service update when appInfo is updated
    this.#updateServices()
  }

  /** TODO 접속 디바이스의 앱 유무와 해당 앱의 최신 버전 */
  getLastestVersion() {

  }

  #browserVersion(userAgent, regex) {
    return userAgent.match(regex) ? userAgent.match(regex)[2] : null
  }

  /** 브라우저 버젼 포함 https://the-average-developer.medium.com/browser-detection-using-javascript-9fe59fee23b0 */
  #getBrowser() {
    // const browserVersion = this.#browserVersion;
    const userAgent = this.userAgent
    let browser = 'unkown'
    // Detect browser name
    browser = (/ucbrowser/i).test(userAgent) ? 'UCBrowser' : browser
    browser = (/edg/i).test(userAgent) ? 'Edge' : browser
    browser = (/googlebot/i).test(userAgent) ? 'GoogleBot' : browser
    browser = (/chromium/i).test(userAgent) ? 'Chromium' : browser
    browser = (/firefox|fxios/i).test(userAgent) && !(/seamonkey/i).test(userAgent) ? 'Firefox' : browser
    browser = (/; msie|trident/i).test(userAgent) && !(/ucbrowser/i).test(userAgent) ? 'IE' : browser
    browser = (/chrome|crios/i).test(userAgent) && !(/opr|opera|chromium|edg|ucbrowser|googlebot/i).test(userAgent) ? 'Chrome' : browser
    browser = (/safari/i).test(userAgent) && !(/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i).test(userAgent) ? 'Safari' : browser
    browser = (/opr|opera/i).test(userAgent) ? 'Opera' : browser

    // detect browser version
    switch (browser) {
      case 'UCBrowser': return `${browser}/${this.#browserVersion(userAgent, /(ucbrowser)\/([\d\\.]+)/i)}`
      case 'Edge': return `${browser}/${this.#browserVersion(userAgent, /(edge|edga|edgios|edg)\/([\d\\.]+)/i)}`
      case 'GoogleBot': return `${browser}/${this.#browserVersion(userAgent, /(googlebot)\/([\d\\.]+)/i)}`
      case 'Chromium': return `${browser}/${this.#browserVersion(userAgent, /(chromium)\/([\d\\.]+)/i)}`
      case 'Firefox': return `${browser}/${this.#browserVersion(userAgent, /(firefox|fxios)\/([\d\\.]+)/i)}`
      case 'Chrome': return `${browser}/${this.#browserVersion(userAgent, /(chrome|crios)\/([\d\\.]+)/i)}`
      case 'Safari': return `${browser}/${this.#browserVersion(userAgent, /(safari)\/([\d\\.]+)/i)}`
      case 'Opera': return `${browser}/${this.#browserVersion(userAgent, /(opera|opr)\/([\d\\.]+)/i)}`
      default: return 'unknown/0.0.0.0'
    }
  }

  /** browser Name */
  #getBrowserName() {
    // https://github.com/lancedikson/bowser/blob/master/LICENSE
    const browsers = [
      { name: 'Samsung', test: /SamsungBrowser/i },
      { name: 'Edge', test: /edg([ea]|ios|)\//i },
      { name: 'Firefox', test: /firefox|iceweasel|fxios/i },
      { name: 'Chrome', test: /chrome|crios|crmo/i },
      { name: 'Safari', test: /safari|applewebkit/i },
      { name: 'IE', test: /MSIE|Trident/i },
    ]

    return _.chain(browsers)
      .find(option => option.test.test(this.userAgent))
      .get('name')
      .value()
  }

  #resetAppInfo() {
    this.appInfo = _.mapValues(this.appInfo, () => '')
  }

  /** GLOBAL App 에서 보내오는 AppInfo 정제처리 */
  #setAppInfo() {
    // ex) ['CLUB5678/1.23.456/10/_AppStore', 'CLUB5678', '1.23.456', '10', '_AppStore']
    const pattern = /(CLUB5678)\/([^/]*)\/([^/]*)\/(_[a-zA-z]+Store)/ // 정확히 이 패턴이 있으면 잡는다. 여러번 같은 패턴이 붙어도 잡는다.(그러면 안되지만)
    const parseResult = this.userAgent.match(pattern) // 패턴에 부합하는 최초 부분만 뽑아낸다.

    if (parseResult === null)
      return this.#resetAppInfo()

    this.appInfo = {
      appName: parseResult[1],
      appVer: parseResult[2],
      osVer: parseResult[3],
      store: parseResult[4],
    }
  }

  /** App 에서 보내오는 AppInfo 정제처리 */
  #updateAppInfo() {
    if (/CLUB5678/i.test(this.userAgent))
      this.#setAppInfo()

    else
      this.#resetAppInfo()
  }

  #updateBrowser() {
    const browserName = this.#getBrowserName()
    this.browsers = {
      isSafari: browserName === 'Safari',
      isFirefox: browserName === 'Firefox',
      isEdge: browserName === 'Edge',
      isChrome: browserName === 'Chrome',
      isSamsung: browserName === 'Samsung',
      isIE: browserName === 'IE',
    }

    this.browser = this.#getBrowser()
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  #isAos(userAgentValue = this.userAgent) {
    return /Android/i.test(userAgentValue)
  }

  /** (GLOBAL) platform App */
  isApp() {
    return this.appMedia === this.MEDEA_TYPE.APP
  }

  #updateAppOs() {
    const osInfo = this.os
    if (osInfo.isAos)
      this.appOs = this.#OS_TYPE.ANDROID

    else if (osInfo.isIos)
      this.appOs = this.#OS_TYPE.IOS

    else
      this.appOs = this.#OS_TYPE.MOBILE
  }

  /** (GLOBAL) platform Mobile */
  isMobile() {
    return this.appMedia === this.MEDEA_TYPE.MOBILE
  }

  /** (GLOBAL) platform Desktop */
  isPc() {
    return this.appMedia === this.MEDEA_TYPE.PC_WEB
  }

  #updateOs() {
    this.os = {
      isAos: this.#isAos(),
      isIos: this.#isIos(),
      isWindows: this.#isWindows(),
      isMac: this.#isMac(),
    }
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  #isIos(userAgentValue = this.userAgent) {
    return /iPad|iPhone|iPod/i.test(userAgentValue)
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  #isMac(userAgentValue = this.userAgent) {
    return /Mac OS X/.test(userAgentValue)
  }

  #updatePlatform() {
    this.platform = {
      isMobile: this.#isMobile(),
      isMobileOrTablet: this.#isMobileOrTablet(),
      isTablet: this.#isMobile() === false && this.#isMobileOrTablet(),
      isDesktop: this.#isMobileOrTablet() === false,
      isDesktopOrTablet: this.#isMobile() === false,
      isCrawler: this.#REGEX_CRAWLER.test(this.userAgent),
    }
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  #isMobile(userAgentValue = this.userAgent) {
    return this.#REGEX_MOBILE1.test(userAgentValue) || this.#REGEX_MOBILE2.test(userAgentValue.slice(0, 4))
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  #isMobileOrTablet(userAgentValue = this.userAgent) {
    return this.#REGEX_MOBILE_OR_TABLET1.test(userAgentValue) || this.#REGEX_MOBILE_OR_TABLET2.test(userAgentValue.slice(0, 4))
  }

  // FIXME
  #updateServices() {
    this.services = {
      isEarthArcade: /CLUB5678/i.test(this.appInfo.appName),
      isCms: /CMS/i.test(this.appInfo.appName),
      isAdmin: /ADMIN/i.test(this.appInfo.appName),
      isNothing: !this.#serverNameReg.test(this.appInfo.appName),
    }
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  #isWindows(userAgentValue = this.userAgent) {
    return /Windows NT/.test(userAgentValue)
  }
}

/** @typedef {'' | '_AppStore' | '_PlayStore' | '_OneStore'} DeviceUtilStore */
