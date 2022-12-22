import { AppState } from './app.state'
import { AppView } from './views'
import { render } from '@youwol/flux-view'

const vDOM = new AppView({
    state: new AppState(),
})
document.getElementById('content').appendChild(render(vDOM))

export {}
