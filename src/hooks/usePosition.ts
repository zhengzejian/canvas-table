import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { State } from '../types'
import { tryOnMounted } from './tryOnMounted'
import { tryOnUnmounted } from './tryOnUnmounted'

interface UsePosition {
    x: Ref<number>;
    y: Ref<number>;
}

export function usePosition(ele: HTMLElement): UsePosition {
    const x = ref<number>(0)
    const y = ref<number>(0)

    function update(e: MouseEvent): void {
        x.value = e.offsetX
        y.value = e.offsetY
    }

    ele.addEventListener('mousemove', update)

    onUnmounted(() => {
        ele.removeEventListener('mousemove', update)
    })
    // tryOnUnmounted(() => {
    //     canvasEle?.removeEventListener('mousemove', update)
    // })

    return {
        x,
        y
    }
}