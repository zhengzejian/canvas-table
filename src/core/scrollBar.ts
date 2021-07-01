import { State } from '../types'
import config from '../config'
export let addScrollBarEvent = (el: HTMLElement, state: State) => {
    init(el, state)
    el.addEventListener('mousedown', scrollBarMouseDown)
}

function init(el: HTMLElement, state: State) {
    let { columnLinkList } = state
    let { headerHeight } = config
    let left = columnLinkList.tail!.data.xRight
    el.style.left = left - 10 + 'px'
    el.style.top = headerHeight + 'px'
}

function scrollBarMouseDown(e: MouseEvent) {
    console.log(e.clientY)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseup)
}

function scrollBarMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseup)
}

function mouseMove(e: MouseEvent) {
    console.log(e.clientY)
}

function mouseup() {
    document.removeEventListener('mousemove', mouseMove)
}