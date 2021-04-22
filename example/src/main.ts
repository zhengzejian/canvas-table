import { createApp } from 'vue'
import App from './app.vue'
import CanvasTable from '../../src/index'

import './reset.css'

const app = createApp(App)
app.use(CanvasTable)

app.mount('#app')