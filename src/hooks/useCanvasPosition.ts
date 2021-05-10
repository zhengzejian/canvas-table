import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { tryOnMounted } from './tryOnMounted'
import { tryOnUnmounted } from './tryOnUnmounted'
import { state } from '../core/store'

interface UseCanvasPosition {
    x: Ref<number>;
    y: Ref<number>;
}

export function useCanvasPosition(): UseCanvasPosition {
    let { canvasEle } = state
    const x = ref<number>(0)
    const y = ref<number>(0)

    function update(e: MouseEvent): void {
        x.value = e.clientX
        y.value = e.clientY
    }
    canvasEle?.addEventListener('mousemove', update)
    // tryOnUnmounted(() => {
    //     canvasEle?.removeEventListener('mousemove', update)
    // })

    return {
        x,
        y
    }
}