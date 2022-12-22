import { AppState, AppView, ItemsView, ItemView } from '../app'
import { MockClient } from './common'
import { render } from '@youwol/flux-view'

test('AppView test', () => {
    const client = new MockClient({
        items: [
            { id: 0, name: 'test-item-0', done: false },
            { id: 1, name: 'test-item-1', done: true },
        ],
    })

    const state = new AppState({ client })
    const view = new AppView({ state })
    const div = render(view)
    document.body.textContent = ''
    document.body.appendChild(div)
    const appView: AppView & HTMLElement = document.querySelector(
        `.${AppView.ClassName}`,
    )

    expect(appView).toBeTruthy()
    expect(appView.filterMode$.value).toBe('All')
    const itemsViewContainer: ItemsView & HTMLElement = document.querySelector(
        `.${ItemsView.ClassName}`,
    )

    expect(itemsViewContainer).toBeTruthy()
    expect([...itemsViewContainer.children]).toHaveLength(2)

    let itemsView: NodeListOf<ItemView & HTMLElement> =
        document.querySelectorAll(`.${ItemView.ClassName}`)
    expect([...itemsView]).toHaveLength(2)
    expect(itemsView[0].item).toEqual({
        id: 0,
        name: 'test-item-0',
        done: false,
    })

    state.toggleItem(0)
    itemsView = document.querySelectorAll(`.${ItemView.ClassName}`)
    expect([...itemsView]).toHaveLength(2)
    expect(itemsView[0].item.done).toBeTruthy()

    const item = itemsView[0]
    const innerItemView = item.querySelector('.presentation-view')
    expect(innerItemView).toBeTruthy()
    innerItemView.dispatchEvent(new Event('dblclick', { bubbles: true }))
    const editionView = item.querySelector('input')
    expect(editionView).toBeTruthy()
})
