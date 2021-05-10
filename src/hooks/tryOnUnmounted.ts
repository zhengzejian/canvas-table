import { getCurrentInstance, onUnmounted } from 'vue'
import { Fn } from '../types'

export function tryOnUnmounted(fn: Fn): void {
    if (getCurrentInstance())
        onUnmounted(fn)
}