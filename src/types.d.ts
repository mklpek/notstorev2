declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    close: () => void;
    BackButton?: {
      show: () => void;
      hide: () => void;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
      isVisible: boolean;
    };
    SettingsButton?: {
      show: () => void;
      hide: () => void;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
      isVisible: boolean;
    };
    MainButton?: {
      show: () => void;
      hide: () => void;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
      isVisible: boolean;
    };
    version: string;
    viewportHeight?: number;
    viewportStableHeight?: number;
    safeAreaInset?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    contentSafeAreaInset?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    onEvent: (event: string, callback: (...args: any[]) => void) => void;
    offEvent: (event: string, callback: (...args: any[]) => void) => void;
    openLink: (url: string, options?: { tryInstantView?: boolean }) => void;
    openTelegramLink?: (url: string) => void;
    setHeaderColor?: (color: string) => void;
    requestFullscreen?: () => boolean;
    enableClosingConfirmation?: () => void;
    disableClosingConfirmation?: () => void;
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp & WebApp;
    };
  }
}
