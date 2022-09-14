
const runTimeDependencies = {
    "load": {
        "rxjs": "^6.5.5",
        "@youwol/flux-view": "^1.0.3",
        "@youwol/http-clients": "^1.0.2",
        "@youwol/cdn-client": "^1.0.2"
    },
    "differed": {},
    "includedInBundle": []
}
const externals = {
    "rxjs": "window['rxjs_APIv6']",
    "@youwol/flux-view": "window['@youwol/flux-view_APIv1']",
    "@youwol/http-clients": "window['@youwol/http-clients_APIv1']",
    "@youwol/cdn-client": "window['@youwol/cdn-client_APIv1']",
    "rxjs/operators": "window['rxjs_APIv6']['operators']"
}
const exportedSymbols = {
    "rxjs": {
        "apiKey": "6",
        "exportedSymbol": "rxjs"
    },
    "@youwol/flux-view": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/flux-view"
    },
    "@youwol/http-clients": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/http-clients"
    },
    "@youwol/cdn-client": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/cdn-client"
    }
}
export const setup = {
    name:'@youwol/todo-app-ts',
        assetId:'QHlvdXdvbC90b2RvLWFwcC10cw==',
    version:'0.0.1-wip',
    shortDescription:"todo app in typescript using flux-view",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/todo-app-ts',
    npmPackage:'https://www.npmjs.com/package/@youwol/todo-app-ts',
    sourceGithub:'https://github.com/youwol/todo-app-ts',
    userGuide:'https://l.youwol.com/doc/@youwol/todo-app-ts',
    apiVersion:'001',
    runTimeDependencies,
    externals,
    exportedSymbols,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    }
}
