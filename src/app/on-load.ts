import { AppState } from './app.state'
import { AppView } from './views'
import { render } from '@youwol/rx-vdom'

const vDOM = new AppView({
    state: new AppState(),
})
document.body.appendChild(render(vDOM))

export {}
