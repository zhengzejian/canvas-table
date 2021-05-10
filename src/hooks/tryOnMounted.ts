import { getCurrentInstance, onMounted, nextTick } from 'vue'
import { Fn } from '../types'

export function tryOnMounted(fn: Fn, sync = true): void {
    if (getCurrentInstance())
        fn()
    else if (sync)
        fn()
    else
        nextTick(fn)
}