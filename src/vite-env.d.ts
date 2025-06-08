/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

// SVG plugin için tiplemeler
declare module 'virtual:svg-icons-register' {
  const noop: () => void;
  export default noop;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_VERSION: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Document {
  addEventListener(
    type: string,
    callback: EventListener | EventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
}

interface Window {
  Telegram: {
    WebApp: any;
  };
}
