import _ from 'lodash'

function main() {
  // --->var x = 5,
  // --->....y = 7;

  const x = 5
  const y = 7
}

/**
 * userAgent를 활용하여 클럽 서비스와 액세스 장치 판별
 * @summary This module is written with reference to nuxtjs/device v2.1.0
 * @example
 * (default) new CmDeviceUtil()
 * (mobile) new CmDeviceUtil("Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36")
 * (club5678 Android userAgent) ~ CLUB5678/2.11.364a_12
 * (club5678 iPhone userAgent)
 * Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 CLUB5678/4.9.59b_5_iOS_chatRadar
 *  => appName, appVer, ~영어(1) -> smtpSlct, phoneVer, (X) smtpid 부재
 * (tongtong app) new CmDeviceUtil("android: Mozilla/5.0 (Linux; Android 10; SM-G960N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36 CLUBTONG|a|4596e586c2355918|2.14.327|10")
 */
class CmDeviceUtil {
  /** @type {{ANDROID: 'a', IOS: 'i', MOBILE: 'w'}} Club5678 OS flag */
  #OS_TYPE = {
    ANDROID: 'a',
    IOS: 'i',
    MOBILE: 'w',
  }

  #REGEX_CLUB_MOBILE = /android|iphone|ipad/i

  #REGEX_CRAWLER
    = /Googlebot\/|Googlebot-Mobile|Googlebot-Image|Googlebot-News|Googlebot-Video|AdsBot-Google([^-]|$)|AdsBot-Google-Mobile|Feedfetcher-Google|Mediapartners-Google|Mediapartners \(Googlebot\)|APIs-Google|bingbot|Slurp|[wW]get|LinkedInBot|Python-urllib|python-requests|aiohttp|httpx|libwww-perl|httpunit|nutch|Go-http-client|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|BIGLOTRON|Teoma|convera|seekbot|Gigabot|Gigablast|exabot|ia_archiver|GingerCrawler|webmon |HTTrack|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|findlink|msrbot|panscient|yacybot|AISearchBot|ips-agent|tagoobot|MJ12bot|woriobot|yanga|buzzbot|mlbot|YandexBot|YandexImages|YandexAccessibilityBot|YandexMobileBot|YandexMetrika|YandexTurbo|YandexImageResizer|YandexVideo|YandexAdNet|YandexBlogs|YandexCalendar|YandexDirect|YandexFavicons|YaDirectFetcher|YandexForDomain|YandexMarket|YandexMedia|YandexMobileScreenShotBot|YandexNews|YandexOntoDB|YandexPagechecker|YandexPartner|YandexRCA|YandexSearchShop|YandexSitelinks|YandexSpravBot|YandexTracker|YandexVertis|YandexVerticals|YandexWebmaster|YandexScreenshotBot|purebot|Linguee Bot|CyberPatrol|voilabot|Baiduspider|citeseerxbot|spbot|twengabot|postrank|TurnitinBot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|Ahrefs(Bot|SiteAudit)|fuelbot|CrunchBot|IndeedBot|mappydata|woobot|ZoominfoBot|PrivacyAwareBot|Multiviewbot|SWIMGBot|Grobbot|eright|Apercite|semanticbot|Aboundex|domaincrawler|wbsearchbot|summify|CCBot|edisterbot|seznambot|ec2linkfinder|gslfbot|aiHitBot|intelium_bot|facebookexternalhit|Yeti|RetrevoPageAnalyzer|lb-spider|Sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|OrangeBot\/|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|S[eE][mM]rushBot|yoozBot|lipperhey|Y!J|Domain Re-Animator Bot|AddThis|Screaming Frog SEO Spider|MetaURI|Scrapy|Livelap[bB]ot|OpenHoseBot|CapsuleChecker|collection@infegy.com|IstellaBot|DeuSu\/|betaBot|Cliqzbot\/|MojeekBot\/|netEstate NE Crawler|SafeSearch microdata crawler|Gluten Free Crawler\/|Sonic|Sysomos|Trove|deadlinkchecker|Slack-ImgProxy|Embedly|RankActiveLinkBot|iskanie|SafeDNSBot|SkypeUriPreview|Veoozbot|Slackbot|redditbot|datagnionbot|Google-Adwords-Instant|adbeat_bot|WhatsApp|contxbot|pinterest.com.bot|electricmonk|GarlikCrawler|BingPreview\/|vebidoobot|FemtosearchBot|Yahoo Link Preview|MetaJobBot|DomainStatsBot|mindUpBot|Daum\/|Jugendschutzprogramm-Crawler|Xenu Link Sleuth|Pcore-HTTP|moatbot|KosmioBot|pingdom|AppInsights|PhantomJS|Gowikibot|PiplBot|Discordbot|TelegramBot|Jetslide|newsharecounts|James BOT|Bark[rR]owler|TinEye|SocialRankIOBot|trendictionbot|Ocarinabot|epicbot|Primalbot|DuckDuckGo-Favicons-Bot|GnowitNewsbot|Leikibot|LinkArchiver|YaK\/|PaperLiBot|Digg Deeper|dcrawl|Snacktory|AndersPinkBot|Fyrebot|EveryoneSocialBot|Mediatoolkitbot|Luminator-robots|ExtLinksBot|SurveyBot|NING\/|okhttp|Nuzzel|omgili|PocketParser|YisouSpider|um-LN|ToutiaoSpider|MuckRack|Jamie's Spider|AHC\/|NetcraftSurveyAgent|Laserlikebot|^Apache-HttpClient|AppEngine-Google|Jetty|Upflow|Thinklab|Traackr.com|Twurly|Mastodon|http_get|DnyzBot|botify|007ac9 Crawler|BehloolBot|BrandVerity|check_http|BDCbot|ZumBot|EZID|ICC-Crawler|ArchiveBot|^LCC |filterdb.iss.net\/crawler|BLP_bbot|BomboraBot|Buck\/|Companybook-Crawler|Genieo|magpie-crawler|MeltwaterNews|Moreover|newspaper\/|ScoutJet|(^| )sentry\/|StorygizeBot|UptimeRobot|OutclicksBot|seoscanners|Hatena|Google Web Preview|MauiBot|AlphaBot|SBL-BOT|IAS crawler|adscanner|Netvibes|acapbot|Baidu-YunGuanCe|bitlybot|blogmuraBot|Bot.AraTurka.com|bot-pge.chlooe.com|BoxcarBot|BTWebClient|ContextAd Bot|Digincore bot|Disqus|Feedly|Fetch\/|Fever|Flamingo_SearchEngine|FlipboardProxy|g2reader-bot|G2 Web Services|imrbot|K7MLWCBot|Kemvibot|Landau-Media-Spider|linkapediabot|vkShare|Siteimprove.com|BLEXBot\/|DareBoost|ZuperlistBot\/|Miniflux\/|Feedspot|Diffbot\/|SEOkicks|tracemyfile|Nimbostratus-Bot|zgrab|PR-CY.RU|AdsTxtCrawler|Datafeedwatch|Zabbix|TangibleeBot|google-xrawler|axios|Amazon CloudFront|Pulsepoint|CloudFlare-AlwaysOnline|Google-Structured-Data-Testing-Tool|WordupInfoSearch|WebDataStats|HttpUrlConnection|Seekport Crawler|ZoomBot|VelenPublicWebCrawler|MoodleBot|jpg-newsbot|outbrain|W3C_Validator|Validator\.nu|W3C-checklink|W3C-mobileOK|W3C_I18n-Checker|FeedValidator|W3C_CSS_Validator|W3C_Unicorn|Google-PhysicalWeb|Blackboard|ICBot\/|BazQux|Twingly|Rivva|Experibot|awesomecrawler|Dataprovider.com|GroupHigh\/|theoldreader.com|AnyEvent|Uptimebot\.org|Nmap Scripting Engine|2ip.ru|Clickagy|Caliperbot|MBCrawler|online-webceo-bot|B2B Bot|AddSearchBot|Google Favicon|HubSpot|Chrome-Lighthouse|HeadlessChrome|CheckMarkNetwork\/|www\.uptime\.com|Streamline3Bot\/|serpstatbot\/|MixnodeCache\/|^curl|SimpleScraper|RSSingBot|Jooblebot|fedoraplanet|Friendica|NextCloud|Tiny Tiny RSS|RegionStuttgartBot|Bytespider|Datanyze|Google-Site-Verification|TrendsmapResolver|tweetedtimes|NTENTbot|Gwene|SimplePie|SearchAtlas|Superfeedr|feedbot|UT-Dorkbot|Amazonbot|SerendeputyBot|Eyeotabot|officestorebot|Neticle Crawler|SurdotlyBot|LinkisBot|AwarioSmartBot|AwarioRssBot|RyteBot|FreeWebMonitoring SiteChecker|AspiegelBot|NAVER Blog Rssbot|zenback bot|SentiBot|Domains Project\/|Pandalytics|VKRobot|bidswitchbot|tigerbot|NIXStatsbot|Atom Feed Robot|Curebot|PagePeeker\/|Vigil\/|rssbot\/|startmebot\/|JobboerseBot|seewithkids|NINJA bot|Cutbot|BublupBot|BrandONbot|RidderBot|Taboolabot|Dubbotbot|FindITAnswersbot|infoobot|Refindbot|BlogTraffic\/\d\.\d+ Feed-Fetcher|SeobilityBot|Cincraw|Dragonbot|VoluumDSP-content-bot|FreshRSS|BitBot|^PHP-Curl-Class|Google-Certificates-Bridge/

  #REGEX_MOBILE_OR_TABLET1
    = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|FBAN|FBAV|fennec|hiptop|iemobile|ip(hone|od)|Instagram|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i

  #REGEX_MOBILE_OR_TABLET2

    = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i

  #REGEX_MOBILE1
    = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|FBAN|FBAV|fennec|hiptop|iemobile|ip(hone|od)|Instagram|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i

  #REGEX_MOBILE2

    = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i

  #serverNameReg = /CLUB5678|CLUBVC|CLUBTONG|CLUBRADIO|CLUBLIVE/i

  /** Club5678 App Info */
  appInfo = {
    /** CLUB5678 | CLUBVC | CLUBTONG | CLUBRADIO | CLUBLIVE */
    appName: '',
    /** 스마트폰구분 (a:안드로이드,b:아이폰) */
    smtpSlct: '',
    /** 디바이스 ID */
    smtpId: '',
    /**
         * App Version
         * @example
         * --- Play Store
         * 클럽5678: 2.6
         * 빠른톡: 2.8
         * 빠른톡S: 2.11
         * 연인톡: 2.10
         * 영상통통: 2.14
         * --- One Store
         * 클럽5678: 3.6
         * 영상통통: 2.13
         * 빠른대화: 2.12
         * --- App Store
         * 클럽5678: 4.9
         * 영상통통: 3.0
         * 빠른대화: 2.1
         */
    appVer: '',
    /** (deprecated) ex) 10 */
    phoneVer: '',
  }

  /** isSafari, isFirefox, isEdge, isChrome, isSamsung */
  browsers = {
    isSafari: false,
    isFirefox: false,
    isEdge: false,
    isChrome: false,
    isSamsung: false,
    isIE: false,
  }

  /** @type {'s' | 'x' | 'w'} (Club5678 flag) s: App, x: mobile, w: web */
  clubMedia = 'w'

  /** @type {'a' | 'i' | 'w'} (Club5678 flag) Android or iOS or Mobile */
  clubOs = 'w'

  /** @type {{APP: 's', MOBILE: 'x', PC_WEB: 'w'}} Club5678 Media flag */
  MEDEA_TYPE = {
    APP: 's',
    MOBILE: 'x',
    PC_WEB: 'w',
  }

  /** isAndroid, isIos, isWindows, isMacOS */
  os = {
    isAndroid: false,
    isIos: false,
    isWindows: false,
    isMacOS: false,
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

  /** (Club5678) isTong, isPartner, isClub5678, isNothing(회사 Service) */
  services = {
    isClub5678: false,
    isPartner: false,
    isTong: false,
    isClubRadio: false,
    isClubLive: false,
    isNothing: false,
  }

  /**
     * club app 에서는 userAgent 뒤에 club에서 쓰이는 정보를 추가로 붙여 보내줌
     * @param {object} opt
     * @param {import('http').IncomingHttpHeaders['user-agent'] | Navigator['userAgent']} opt.userAgent Server: req['user-agent'], Client: navigator.userAgent
     */
  constructor(opt) {
    const { userAgent = '' } = opt

    this.userAgent = userAgent

    this.init()
  }

  /**
     * 데이터 초기화
     * @param {object} opt
     * @param {import('http').IncomingHttpHeaders['user-agent'] | Navigator['userAgent']} opt.userAgent Server: req['user-agent'], Client: navigator.userAgent
     */
  init(userAgent = this.userAgent) {
    this.userAgent = userAgent
    this.#updatePlatform()
    this.#updateBrowser()
    this.#updateOs()

    // Update Club App Info(appName, smtpSlct, smtpId, appVer, phoneVer)
    this.#updateAppInfo()
    // Update Club Os after updateOs is done
    this.#updateClubOs()

    if (this.#serverNameReg.test(this.appInfo.appName)) {
      this.clubMedia = this.MEDEA_TYPE.APP
    }
    else {
      this.clubMedia = this.#REGEX_CLUB_MOBILE.test(this.userAgent)
        ? this.MEDEA_TYPE.MOBILE
        : this.MEDEA_TYPE.PC_WEB
    }

    // Service update when appInfo is updated
    this.#updateServices()
  }

  /**
     * 사용자의 브라우저가 실행 중인 플랫폼을 식별하는 문자열을 반환
     * @returns {string} 'MacIntel', 'Win32', 'Linux x86_64', 'Linux x86_64'
     */
  getNaviPlatform() {
    return navigator.platform
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  isAndroid(userAgentValue = this.userAgent) {
    return /Android/i.test(userAgentValue)
  }

  /** (Club5678) platform App */
  isClubApp() {
    return this.clubMedia === this.MEDEA_TYPE.APP
  }

  /** (Club5678) platform Mobile */
  isClubMobile() {
    return this.clubMedia === this.MEDEA_TYPE.MOBILE
  }

  /** (Club5678) platform Desktop */
  isClubPc() {
    return this.clubMedia === this.MEDEA_TYPE.PC_WEB
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  isIos(userAgentValue = this.userAgent) {
    return /iPad|iPhone|iPod/i.test(userAgentValue)
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  isMacOS(userAgentValue = this.userAgent) {
    return /Mac OS X/.test(userAgentValue)
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  isMobile(userAgentValue = this.userAgent) {
    return this.#REGEX_MOBILE1.test(userAgentValue) || this.#REGEX_MOBILE2.test(userAgentValue.slice(0, 4))
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  isMobileOrTablet(userAgentValue = this.userAgent) {
    return this.#REGEX_MOBILE_OR_TABLET1.test(userAgentValue) || this.#REGEX_MOBILE_OR_TABLET2.test(userAgentValue.slice(0, 4))
  }

  /** @param {string} [userAgentValue=this.userAgent] */
  isWindows(userAgentValue = this.userAgent) {
    return /Windows NT/.test(userAgentValue)
  }

  /**
     * 클럽 미디어 서비스를 한글로 변환
     * @param {'s' | 'x' | 'w'} clubMedia (Club5678 flag) s: App, x: mobile, w: web
     */
  toClubMediaName(clubMedia = this.clubMedia) {
    switch (clubMedia) {
      case 'w':
        return 'PC 웹'
      case 's':
        return '어플'
      case 'x':
        return '모바일웹'
      default:
        return ''
    }
  }

  /**
     * 클럽 미디어 서비스를 한글로 변환
     * @param {'a' | 'i' | 'w'} clubOs (Club5678 flag) Android or iOS or Mobile
     */
  toClubOsName(clubOs = this.clubOs) {
    switch (clubOs) {
      case 'a':
        return '안드로이드'
      case 'i':
        return '아이폰'
      case 'w':
        return '모바일'
      default:
        return ''
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

  /** Club5678 App 에서 보내오는 AppInfo 정제처리 */
  #toClubInfoByClub() {
    // ex) ['CLUB5678/2.11.364a_12', 'CLUB5678', '2.11.364', 'a', '12']
    const regExpExecArray = /(CLUB5678)\/([\d.]+)(a|b)_([\d]+)/i.exec(this.userAgent)

    if (regExpExecArray === null) {
      this.#resetAppInfo()
      return this.appInfo
    }

    return {
      appName: regExpExecArray[1],
      appVer: regExpExecArray[2],
      phoneVer: regExpExecArray[4],
      smtpId: '', // club5678 App 에서는 없음
      smtpSlct: regExpExecArray[3],
    }
  }

  /** TongTong App 에서 보내오는 AppInfo 정제처리 */
  #toClubInfoByTong() {
    const appInfoList = this.userAgent.split(' ').pop()?.split('|') || []
    if (appInfoList.length !== 5) {
      this.#resetAppInfo()
      return this.appInfo
    }

    return {
      appName: appInfoList[0],
      appVer: appInfoList[3],
      phoneVer: appInfoList[4],
      smtpId: appInfoList[2],
      smtpSlct: appInfoList[1],
    }
  }

  /** App 에서 보내오는 AppInfo 정제처리 */
  #updateAppInfo() {
    if (/CLUB5678/i.test(this.userAgent))
      this.appInfo = this.#toClubInfoByClub()

    else if (/CLUBTONG|CLUBVC/i.test(this.userAgent))
      this.appInfo = this.#toClubInfoByTong()

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
  }

  #updateClubOs() {
    const osInfo = this.os
    if (osInfo.isAndroid)
      this.clubOs = this.#OS_TYPE.ANDROID

    else if (osInfo.isIos)
      this.clubOs = this.#OS_TYPE.IOS

    else
      this.clubOs = this.#OS_TYPE.MOBILE
  }

  #updateOs() {
    this.os = {
      isAndroid: this.isAndroid(),
      isIos: this.isIos(),
      isWindows: this.isWindows(),
      isMacOS: this.isMacOS(),
    }
  }

  #updatePlatform() {
    this.platform = {
      isMobile: this.isMobile(),
      isMobileOrTablet: this.isMobileOrTablet(),
      isTablet: this.isMobile() === false && this.isMobileOrTablet(),
      isDesktop: this.isMobileOrTablet() === false,
      isDesktopOrTablet: this.isMobile() === false,
      isCrawler: this.#REGEX_CRAWLER.test(this.userAgent),
    }
  }

  #updateServices() {
    this.services = {
      isClub5678: /CLUB5678/i.test(this.appInfo.appName),
      isPartner: /CLUBVC/i.test(this.appInfo.appName),
      isTong: /CLUBTONG/i.test(this.appInfo.appName),
      isClubRadio: /CLUBRADIO/i.test(this.appInfo.appName),
      isClubLive: /CLUBLIVE/i.test(this.appInfo.appName),
      isNothing: !this.#serverNameReg.test(this.appInfo.appName),
    }
  }
}

export default CmDeviceUtil
