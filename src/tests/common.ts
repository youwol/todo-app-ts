import { ClientInterface, Item } from '../app'
import { Observable, of } from 'rxjs'
import { Json } from '@youwol/http-primitives'

export class MockClient implements ClientInterface {
    items: Item[] = []

    constructor(params: { items: Item[] }) {
        Object.assign(this, params)
    }

    getData$(): Observable<{ items: Item[] }> {
        return of({
            items: this.items,
        })
    }

    postData$({ body }: { body: Json }): Observable<Record<string, never>> {
        this.items = body['items']
        return of({})
    }
}
