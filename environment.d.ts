declare global {
    namespace NodeJS {
        interface ProcessEnv {
            token: string;
            database: string;
            environment: 'dev' | 'prod' | 'debug';
        }
    }
}

export {};