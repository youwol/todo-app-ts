import { ChildrenLike, RxChildren, VirtualDOM } from '@youwol/rx-vdom'
import { BehaviorSubject, combineLatest, Observable, timer, map } from 'rxjs'
import { AppState, Item } from './app.state'

type FilterMode = 'All' | 'Active' | 'Completed'

/**
 * @category View
 */
export class TitleView implements VirtualDOM<'div'> {
    static ClassName = 'title-view'
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'

    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `${TitleView.ClassName} text-center w-100 border rounded p-2 my-3`

    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    /**
     * @group Observable
     */
    public readonly date$ = timer(0, 1000).pipe(map(() => new Date()))

    constructor() {
        this.children = [
            {
                tag: 'h1',
                class: 'fv-text-focus',
                innerText: 'Todo',
            },
            {
                tag: 'div',
                class: 'fas fa-clock',
                innerText: {
                    source$: this.date$,
                    vdomMap: (date: Date) => `${date.toTimeString()}`,
                },
            },
        ]
    }
}

/**
 * @category View
 */
export class ItemView implements VirtualDOM<'span'> {
    /**
     * @group Immutable Static Constants
     */
    static ClassName = 'item-view'
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'span'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `${ItemView.ClassName} d-flex align-items-center my-1 justify-content-between fv-pointer`
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
    /**
     * @group States
     */
    public readonly state: AppState
    /**
     * @group Immutable Constants
     */
    public readonly item: Item
    /**
     * @group Observables
     */
    private readonly editing$ = new BehaviorSubject<boolean>(false)

    constructor(
        item: { id: number; name: string; done: boolean },
        state: AppState,
    ) {
        Object.assign(this, { item, state })

        const baseClass =
            'item-view-toggle fv-color-primary fv-hover-color-focus p-2 rounded-circle fv-text-success'
        this.children = [
            {
                tag: 'div',
                class: baseClass + (item.done ? ' fas fa-check' : ''),
                style: { width: '35px', height: '35px' },
                onclick: () => state.toggleItem(item.id),
            },
            {
                source$: this.editing$,
                vdomMap: (editing: boolean) =>
                    editing ? this.editionView() : this.presentationView(),
                sideEffects: (rxElem) => rxElem.element.focus(),
            },
            {
                tag: 'div',
                class: 'item-view-remove fas fa-times fv-text-error mx-2 p-1 fv-hover-opacity',
                onclick: () => state.deleteItem(item.id),
            },
        ]
    }

    presentationView(): VirtualDOM<'span'> {
        return {
            tag: 'span',
            class: `presentation-view px-2 user-select-none ${
                this.item.done ? 'fv-text-disabled' : 'fv-text-focus'
            }`,
            style: { textDecoration: this.item.done ? 'line-through' : '' },
            innerText: this.item.name,
            ondblclick: () => this.editing$.next(true),
        }
    }

    editionView(): VirtualDOM<'input'> {
        return {
            tag: 'input',
            type: 'text',
            class: 'edition-view',
            value: this.item.name,
            onclick: (ev) => ev.stopPropagation(),
            onkeypress: (ev) => {
                if (ev.key == 'Enter') {
                    this.state.setName(this.item.id, ev.target['value'])
                }
            },
            onblur: (ev) =>
                this.state.setName(this.item.id, ev.target['value']),
        }
    }
}

/**
 * @category View
 */
export class ItemsView implements VirtualDOM<'div'> {
    /**
     * @group Immutable Static Constants
     */
    static ClassName = 'items-view'
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `${ItemsView.ClassName} border rounded p-2 m-2 flex-grow-1 overflow-auto`
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        minHeight: '200px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: RxChildren<'replace', Item[]>

    private filters: Record<FilterMode, (item: Item) => boolean> = {
        All: () => true,
        Active: (item) => !item.done,
        Completed: (item) => item.done,
    }

    constructor(state: AppState, filterMode$: Observable<FilterMode>) {
        const selectedItems$ = combineLatest([state.items$, filterMode$]).pipe(
            map(([items, mode]) =>
                items.filter((item) => this.filters[mode](item)),
            ),
        )

        this.children = {
            policy: 'replace',
            source$: selectedItems$,
            vdomMap: (items) => items.map((item) => new ItemView(item, state)),
        }
    }
}

/**
 * @category View
 */
export class NewItemView implements VirtualDOM<'header'> {
    static ClassName = 'new-item-view'
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'header'

    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `${NewItemView.ClassName} d-flex align-items-center my-3 justify-content-around`

    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        fontSize: 'x-large',
    }

    constructor(state: AppState) {
        this.children = [
            {
                tag: 'i',
                class: {
                    source$: state.completed$,
                    vdomMap: (completed): string =>
                        completed ? 'fv-text-disable' : 'fv-text-focus',
                    wrapper: (d) =>
                        `${d} new-item-view-toggle-all fas fa-chevron-down p-2 fv-pointer fv-color-primary rounded-circle`,
                },
                onclick: () => state.toggleAll(),
            },
            {
                tag: 'input',
                autofocus: true,
                autocomplete: 'off',
                placeholder: 'What needs to be done?',
                class: 'new-todo px-2',
                onkeypress: (ev) => {
                    ev.key == 'Enter' &&
                        state.addItem(ev.target['value']) &&
                        (ev.target['value'] = '')
                },
            },
        ]
    }
}

/**
 * @category View
 */
export class FooterView implements VirtualDOM<'div'> {
    /**
     * @group Immutable Static Constants
     */
    static ClassName = 'footer-item-view'

    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'

    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `${FooterView.ClassName} d-flex align-items-center px-3 border-top py-2 text-secondary`

    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor(state: AppState, filterMode$: BehaviorSubject<FilterMode>) {
        const class$ = (target) => ({
            source$: filterMode$,
            vdomMap: (mode): string =>
                mode == target
                    ? 'fv-text-focus fv-color-primary rounded px-1'
                    : 'fv-text-disabled',
            wrapper: (d) =>
                `${target} ${d} fv-pointer mx-2 fv-hover-text-enabled`,
        })

        this.children = [
            {
                tag: 'span',
                innerText: {
                    source$: state.remaining$,
                    vdomMap: (items: Item[]): string => `${items.length}`,
                    wrapper: (d) => `${d} items left`,
                },
            },
            {
                tag: 'div',
                class: 'd-flex align-items-center mx-auto',
                children: [
                    {
                        tag: 'i',
                        class: 'fas fa-filter px-2',
                    },
                    {
                        tag: 'i',
                        innerText: 'All',
                        class: class$('All'),
                        onclick: () => filterMode$.next('All'),
                    },
                    {
                        tag: 'i',
                        innerText: 'Active',
                        class: class$('Active'),
                        onclick: () => filterMode$.next('Active'),
                    },
                    {
                        tag: 'i',
                        innerText: 'Completed',
                        class: class$('Completed'),
                        onclick: () => filterMode$.next('Completed'),
                    },
                ],
            },
        ]
    }
}

/**
 * @category View
 * @category Entry Point
 */
export class AppView implements VirtualDOM<'div'> {
    static ClassName = 'app-view'
    public readonly tag = 'div'
    public readonly class = `${AppView.ClassName} p-3 w-100 h-100 fv-bg-background fv-text-primary d-flex flex-column rounded`
    public readonly children: ChildrenLike
    public readonly filterMode$ = new BehaviorSubject<FilterMode>('All')
    public readonly state: AppState
    constructor(params: { state: AppState }) {
        Object.assign(this, params)
        this.children = [
            new TitleView(),
            new NewItemView(this.state),
            new ItemsView(this.state, this.filterMode$),
            new FooterView(this.state, this.filterMode$),
        ]
    }
}
