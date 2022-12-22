import { AppState } from '../app'
import { combineLatest, of } from 'rxjs'
import { map, mergeMap, take, tap } from 'rxjs/operators'
import { MockClient } from './common'

function extractCurrentState(state: AppState) {
    return (obs) => {
        return obs.pipe(
            mergeMap(({ context }) => {
                return combineLatest([
                    state.items$,
                    state.completed$,
                    state.remaining$,
                ]).pipe(
                    take(1),
                    map(([items, completed, remaining]) => ({
                        items,
                        completed,
                        remaining,
                        context,
                    })),
                )
            }),
        )
    }
}

// eslint-disable-next-line jest/no-done-callback -- more readable that way
test('AppState test', (done) => {
    const client = new MockClient({
        items: [{ id: 0, name: 'test-item-0', done: false }],
    })

    const state = new AppState({ client })

    of({ context: {} })
        .pipe(
            extractCurrentState(state),
            tap(({ items, completed, remaining, context }) => {
                expect(items).toHaveLength(1)
                expect(completed).toBeFalsy()
                expect(remaining).toHaveLength(1)

                context['item'] = state.addItem('item 2')
            }),
            extractCurrentState(state),
            tap(({ items, completed, remaining, context }) => {
                expect(items).toHaveLength(2)
                expect(completed).toBeFalsy()
                expect(remaining).toHaveLength(2)

                state.toggleItem(context['item'].id)
            }),
            extractCurrentState(state),
            tap(({ completed, remaining }) => {
                expect(completed).toBeFalsy()
                expect(remaining).toHaveLength(1)

                state.toggleItem(0)
            }),
            extractCurrentState(state),
            tap(({ completed, remaining }) => {
                expect(completed).toBeTruthy()
                expect(remaining).toHaveLength(0)
            }),
        )
        .subscribe(() => done())
})
