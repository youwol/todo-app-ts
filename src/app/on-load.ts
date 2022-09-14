import { AppState } from './app.state'
import { AppView } from './views'
import { render } from '@youwol/flux-view'

const state = new AppState()
const vDOM = new AppView(state)
document.getElementById('content').appendChild(render(vDOM))

export {}
