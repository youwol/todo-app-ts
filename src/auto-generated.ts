
const runTimeDependencies = {
    "externals": {
        "@youwol/http-clients": "^3.0.0",
        "@youwol/http-primitives": "^0.2.0",
        "@youwol/rx-vdom": "^1.0.1",
        "@youwol/webpm-client": "^3.0.0",
        "rxjs": "^7.5.6"
    },
    "includedInBundle": {}
}
const externals = {
    "@youwol/http-clients": "window['@youwol/http-clients_APIv3']",
    "@youwol/http-primitives": "window['@youwol/http-primitives_APIv02']",
    "@youwol/rx-vdom": "window['@youwol/rx-vdom_APIv1']",
    "@youwol/webpm-client": "window['@youwol/webpm-client_APIv3']",
    "rxjs": "window['rxjs_APIv7']"
}
const exportedSymbols = {
    "@youwol/http-clients": {
        "apiKey": "3",
        "exportedSymbol": "@youwol/http-clients"
    },
    "@youwol/http-primitives": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/http-primitives"
    },
    "@youwol/rx-vdom": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/rx-vdom"
    },
    "@youwol/webpm-client": {
        "apiKey": "3",
        "exportedSymbol": "@youwol/webpm-client"
    },
    "rxjs": {
        "apiKey": "7",
        "exportedSymbol": "rxjs"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./index.ts",
    "loadDependencies": [
        "rxjs",
        "@youwol/rx-vdom",
        "@youwol/http-clients",
        "@youwol/http-primitives",
        "@youwol/webpm-client"
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
    version:'0.0.5-wip',
    shortDescription:"todo app in typescript using flux-view",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/todo-app-ts&tab=doc',
    npmPackage:'https://www.npmjs.com/package/@youwol/todo-app-ts',
    sourceGithub:'https://github.com/youwol/todo-app-ts',
    userGuide:'https://l.youwol.com/doc/@youwol/todo-app-ts',
    apiVersion:'005',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
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
            return window[`@youwol/todo-app-ts_APIv005`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/todo-app-ts#0.0.5-wip~dist/@youwol/todo-app-ts/${entry.name}.js`
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
            return window[`@youwol/todo-app-ts/${entry.name}_APIv005`]
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
