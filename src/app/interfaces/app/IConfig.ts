interface IConfig {
    data: any;
    server: string;
    logonUrlPath: string;
    protocol: string;
    debug: boolean;
    baseUrl: string;
    language: string;
    availableLanguages: string[];
    logon: any;
    insertLogonData: boolean;
    translations: string;
    translationApi: string;
    helpUrl: string;
    traceRoutes: boolean;
    useHashRouting: boolean;
    useHttpExService: boolean;
}

export {
    IConfig
}
