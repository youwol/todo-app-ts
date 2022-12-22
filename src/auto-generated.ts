
const runTimeDependencies = {
    "externals": {
        "rxjs": "^6.5.5",
        "@youwol/flux-view": "^1.0.3",
        "@youwol/http-clients": "^1.0.2",
        "@youwol/cdn-client": "^1.0.2"
    },
    "includedInBundle": {}
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

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./index.ts",
    "loadDependencies": [
        "rxjs",
        "@youwol/flux-view",
        "@youwol/http-clients",
        "@youwol/cdn-client"
    ]
}

const secondaryEntries : {[k:string]:{entryFile: string, name: string, loadDependencies:string[]}}= {}

const entries = {
     '@youwol/todo-app-ts': './index.ts',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/todo-app-ts/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/todo-app-ts',
        assetId:'QHlvdXdvbC90b2RvLWFwcC10cw==',
    version:'0.0.3-wip',
    shortDescription:"todo app in typescript using flux-view",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/todo-app-ts',
    npmPackage:'https://www.npmjs.com/package/@youwol/todo-app-ts',
    sourceGithub:'https://github.com/youwol/todo-app-ts',
    userGuide:'https://l.youwol.com/doc/@youwol/todo-app-ts',
    apiVersion:'003',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<Window>},
        installParameters?
    }) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/todo-app-ts_APIv003`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<Window>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/todo-app-ts#0.0.3-wip~dist/@youwol/todo-app-ts/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/todo-app-ts/${entry.name}_APIv003`]
        })
    },
    getCdnDependencies(name?: string){
        if(name && !secondaryEntries[name]){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const deps = name ? secondaryEntries[name].loadDependencies : mainEntry.loadDependencies

        return deps.map( d => `${d}#${runTimeDependencies.externals[d]}`)
    }
}
