type AllTags = keyof HTMLElementTagNameMap
export type Configuration = {
    TypeCheck: 'strict'
    SupportedHTMLTags: 'Prod' extends 'Prod' ? AllTags : DevTags
    WithFluxView: true
}

type DevTags = 'div' | 'span' | 'header' | 'h1' | 'h3' | 'h5' | 'input' | 'i'
