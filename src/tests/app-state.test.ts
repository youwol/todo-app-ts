import { AppState } from '../app'
import { combineLatest } from 'rxjs'
import { shareReplay, take, tap } from 'rxjs/operators'
import { MockClient } from './common'

test('AppState test', () => {
    const client = new MockClient({
        items: [{ id: 0, name: 'test-item-0', done: false }],
    })

    const state = new AppState({ client })
    const tested_items$ = state.items$.pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
    )
    const tested_completed$ = state.completed$.pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
    )
    const tested_remaining$ = state.remaining$.pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
    )
    function expectCurrentState(expectCallback) {
        return combineLatest([
            tested_items$,
            tested_completed$,
            tested_remaining$,
        ])
            .pipe(
                take(1),
                tap(([items, completed, remaining]) => {
                    expectCallback({ items, completed, remaining })
                }),
            )
            .subscribe()
    }
    expectCurrentState(({ items, completed, remaining }) => {
        expect(items).toHaveLength(1)
        expect(completed).toBeFalsy()
        expect(remaining).toHaveLength(1)
    })

    const addedItem = state.addItem('item 2')

    expectCurrentState(({ items, completed, remaining }) => {
        expect(items).toHaveLength(2)
        expect(completed).toBeFalsy()
        expect(remaining).toHaveLength(2)
    })

    state.toggleItem(addedItem.id)
    expectCurrentState(({ completed, remaining }) => {
        expect(completed).toBeFalsy()
        expect(remaining).toHaveLength(1)
    })

    state.toggleItem(0)
    expectCurrentState(({ completed, remaining }) => {
        expect(completed).toBeTruthy()
        expect(remaining).toHaveLength(0)
    })
})
