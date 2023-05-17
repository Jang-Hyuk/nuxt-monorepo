module.exports = (req, res) => {
  // SSR, SPA 사
  const cookies = Cookie(req, res)

  // 쿠키세팅함수.
  // opts = {
  //   maxAge: 쿠키가유지될시간,   // 지금으로부터 몇초간 유지할건가?
  //   expires: 쿠키가종료될시간,  // 언제(Date object) 까지 유효할건가?
  //   httpOnly: true or false,
  //   sameSite: true, false, lax, none, strice
  //   secure: true or false
  // }
    	function set(name, value, opts) {
    return cookies.set(name, value, { ...cookieDefaultOptions, ...opts })
  }

  // gCCV 를 디코딩/파싱하여 JSON 형턔로 리턴한따.
  function getGCCV() {
    const strgCCV = cookies.get('gCCV')
    	if (!strgCCV)
      return {}
    return parsegCCV(strgCCV)
  }

  // gCCV JSON 를 쿠키로 만드는 함수다.
  // 서버사이드에만 노출된다.
  function setGCCV(obj) {
    let strgCCV = Object.entries(obj)
      .map(item => `${item[0]}=${item[1]}`)
      .join('|')
    strgCCV = simpleEnc.enc(strgCCV)
    return cookies.set('gCCV', strgCCV, { ...cookieDefaultOptions })
  }

  // 인코딩된 gENC 를 파싱하는 함수다.
  function parsegENC(str, seed) {
    const result = {}

    for (const item of enhancedEnc.dec(str, seed).split('|')) {
      let [key, value] = item.split('=')
      if (value) {
        if (key == 'ID')
          value = value.toLowerCase()
        result[key] = value
      }
    }

    return result
  }

  // gENC 를 디코딩후 파싱해서 리턴하는 함수다.
  // 서버사이드에서만 노출되며, httpOnly 옵션을 추가로 넣어서 만든다.
  function getGENC() {
    const seed = getGCCV()?.SESS_KEY
    const strgENC = cookies.get('gENC')
    if (!seed || !strgENC)
      return {}

    return parsegENC(strgENC, seed)
  }

  // gENC JSON 를 쿠키로 만뜨는 함수다.
  // 서버사이드에서만 노출되며, httpOnly 옵션을 추가로 넣어서 만든다.
  function setGENC(obj, seed) {
    let strgENC = Object.entries(obj)
      .map(item => `${item[0]}=${item[1]}`)
      .join('|')
    strgENC = enhancedEnc.enc(strgENC, seed)
    const options = { ...cookieDefaultOptions, httpOnly: true }
    return cookies.set('gENC', strgENC, options)
  }

  // gENC, gCCV 를 비교하여 쿠키가 정상인지 검증하는 프로그램이다.
  // 서버사이드에서만 노출된다.
  function isValid() {
    const gCCV = getGCCV()
    const gENC = getGENC()
    const checkKeys = ['ID', 'LEVEL', 'SEX', 'AGE', 'NO']
    let isValid = true

    // 모든 값이 있어야 하고, 각각의 값은 같아야 한다.
    for (const key of checkKeys) {
      if (gCCV[key] == undefined || gENC[key] == undefined || gCCV[key] != gENC[key])
        isValid = false
    }

    return isValid
  }

  // setAutoLogin JSON 을 쿠키로 만드는 함수다.
  // 서버사이드에만 노출된다.
  function setAutoLogin(obj) {
    let str = Object.entries(obj)
      .map(item => `${item[0]}=${item[1]}`)
      .join('|')
    str = enhancedEnc.registEnc(str)
    return cookies.set('setAutoLogin', str, { ...cookieDefaultOptions })
  }

  // setAutoLogin 쿠키를 파싱해서 리턴한다.
  function getAutoLogin() {
    const result = {}
    let str = cookies.get('setAutoLogin')
    if (!str)
      return result

    // 디코딩 & 파싱.
    str = enhancedEnc.registDec(str)
    for (const item of str.split('|')) {
      const [key, value] = item.split('=')
      result[key] = value
    }

    return result
  }

  // 쿠키 가져오기.
  function get(name, opts) {
    return cookies.get(name, { ...cookieDefaultOptions, ...opts })
  }
  // 쿠키 전부 가져오기.
  function getAll(opts) {
    return cookies.getAll({ ...cookieDefaultOptions, ...opts })
  }
  // 쿠키 삭제하기.
  function remove(name, opts) {
    return cookies.remove(name, { ...cookieDefaultOptions, ...opts })
  }

  // 리턴 오브젝트.
  return {
    get,
    getAll,
    remove,
    set,
    getGCCV,

    setGCCV,
    getGENC,
    setGENC,
    isValid,

    setAutoLogin,
    getAutoLogin,
  }
}
