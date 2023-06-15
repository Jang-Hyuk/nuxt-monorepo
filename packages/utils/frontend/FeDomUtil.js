export default class FeDomUtil {
  /**
   * 포커스 위치 변경 (Start or End)
   * @param {HTMLElement} element
   * @param {boolean} [isStart=false] 기본값은 뒤
   */
  focusElementEdge(element, isStart) {
    try {
      if (element.innerText.length === 0) {
        element.focus()
        return false
      }

      const selection = window.getSelection()
      const newRange = document.createRange()
      if (selection === null)
        return false
      newRange.selectNodeContents(element)
      newRange.collapse(isStart)
      selection.removeAllRanges()
      selection.addRange(newRange)
    }
    catch (error) {
      console.error(error)
    }
  }

  /**
   * 마우스 이벤트에서 마우스 위치 가져오기
   * relatveElement 매개변수가 제공된 경우 요소를 기반으로 상대 위치를 반환
   * @param {MouseEvent|number[]} position 마우스 위치 개체
   * @param {HTMLElement} [relativeElement] 상대 위치를 계산하는 HTML 요소
   * @returns {number[]} mouse position [x, y]
   */
  getMousePosition(position, relativeElement) {
    const isPositionArray = Array.isArray(position)
    const clientX = isPositionArray ? position[0] : position.clientX
    const clientY = isPositionArray ? position[1] : position.clientY

    if (!relativeElement)
      return [clientX, clientY]

    const rect = relativeElement.getBoundingClientRect()

    return [
      clientX - rect.left - relativeElement.clientLeft,
      clientY - rect.top - relativeElement.clientTop,
    ]
  }

  /**
   * 팝업창 띄울 위치계산(브라우저 기준)
   * @param {number} popupWidth 팝업창 가로 크기
   * @param {number} popupHeight 팝업창 세로 크기
   */
  getWinPosition(popupWidth, popupHeight) {
    const popupX = Math.round(window.screenX + window.outerWidth / 2 - popupWidth / 2)
    const popupY = Math.round(window.screenY + window.outerHeight / 2 - popupHeight / 2)

    return { x: popupX, y: popupY }
  }

  /**
   * 현재 커서의 위치에 HTML Element 객체를 삽입
   * @param {{tagName: string, id?: string}} elementOption 생성할 Element 옵션
   * @param {string} textNode Element 안에 넣을 text
   */
  insertHTML(elementOption, textNode) {
    let sel
    let range
    if (window.getSelection) {
      sel = window.getSelection()
      if (sel === null)
        return false
      if (!sel.rangeCount)
        return false

      range = sel.getRangeAt(0)
      range.collapse(true)
      const element = document.createElement(elementOption.tagName)
      if (elementOption.id)
        element.id = elementOption.id

      if (textNode)
        element.appendChild(document.createTextNode(textNode))

      range.insertNode(element)

      // Move the caret immediately after the inserted element
      range.setStartAfter(element)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  /**
   * 모바일에서 브라우저 주소창을 고려한 css height 설정
   * @summary Mobile Web
   * @see {@link https://css-tricks.com/the-trick-to-viewport-units-on-mobile}
   * @example
   * css 변경 및 setViewportUnitsOnMobile 호출
   * .my-element {
   *   height: 100vh;
   *   height: calc(var(--vh, 1vh) * 100);
   * }
   */
  setViewportUnitsOnMobile() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
}
