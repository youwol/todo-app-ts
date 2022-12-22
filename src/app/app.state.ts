import { BehaviorSubject, Observable } from 'rxjs'
import { map, mergeMap, skip } from 'rxjs/operators'
import { CdnSessionsStorage } from '@youwol/http-clients'
import {
    Json,
    raiseHTTPErrors,
    CallerRequestOptions,
} from '@youwol/http-primitives'
import { setup } from '../auto-generated'

export interface Item {
    id: number
    name: string
    done: boolean
}

export class AppState {
    static STORAGE_KEY = 'todos'
    public readonly client = new CdnSessionsStorage.Client()
    public readonly items$: BehaviorSubject<Item[]>
    public readonly completed$: Observable<boolean>
    public readonly remaining$: Observable<Item[]>

    constructor(defaultItems?: Array<Item>) {
        this.items$ = defaultItems
            ? new BehaviorSubject<Item[]>(defaultItems)
            : new BehaviorSubject<Item[]>(
                  JSON.parse(
                      localStorage.getItem(AppState.STORAGE_KEY) || '[]',
                  ),
              )

        this.client
            .getData$({
                packageName: setup.name,
                dataName: AppState.STORAGE_KEY,
            })
            .pipe(
                raiseHTTPErrors(),
                map((d) => d as unknown as { items: Item[] }),
            )
            .subscribe((d) => {
                this.items$.next(d.items ? d.items : [])
            })

        this.items$
            .pipe(
                skip(1),
                mergeMap((items) =>
                    this.client.postData$({
                        packageName: setup.name,
                        dataName: AppState.STORAGE_KEY,
                        body: { items } as unknown as Json,
                    }),
                ),
            )
            .subscribe(() => {
                console.log('data saved')
            })

        this.items$.subscribe((items) => {
            localStorage.setItem(AppState.STORAGE_KEY, JSON.stringify(items))
        })
        this.completed$ = this.items$.pipe(
            map((items) => items.reduce((acc, item) => acc && item.done, true)),
        )
        this.remaining$ = this.items$.pipe(
            map((items) => items.filter((item) => !item.done)),
        )
    }

    toggleAll() {
        const completed = this.getItems().reduce(
            (acc, item) => acc && item.done,
            true,
        )
        this.items$.next(
            this.getItems().map((item) => ({
                id: item.id,
                name: item.name,
                done: !completed,
            })),
        )
    }

    addItem(name) {
        const item = { id: Date.now(), name, done: false }
        this.items$.next([...this.getItems(), item])
        return item
    }

    deleteItem(id) {
        this.items$.next(this.getItems().filter((item) => item.id != id))
    }

    toggleItem(id) {
        const items = this.getItems().map((item) =>
            item.id == id
                ? { id: item.id, name: item.name, done: !item.done }
                : item,
        )
        this.items$.next(items)
    }

    setName(id, name) {
        const items = this.getItems().map((item) =>
            item.id == id ? { id: item.id, name, done: item.done } : item,
        )
        this.items$.next(items)
    }

    private getItems() {
        return this.items$.getValue()
    }
}
