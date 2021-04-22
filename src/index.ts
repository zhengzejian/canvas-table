import { App } from 'vue'
import CanvasTable from './components/index.vue'

const plugin = {
    install(app: App) {
        app.component('CanvasTable', CanvasTable)
    }
}

export default plugin