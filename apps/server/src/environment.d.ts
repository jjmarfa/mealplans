declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TYPESENSE_HOST: string;
      TYPESENSE_PORT: number;
      TYPESENSE_PROTOCOL: string;
      TYPESENSE_API_KEY: string;
    }
  }
}

export {};
