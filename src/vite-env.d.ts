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

// Telegram WebApp tiplerini genişletiyoruz
interface WebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface WebAppInitData {
  user?: WebAppUser;
  chat_type?: string;
  hash?: string;
  // Diğer initData alanları
}

// Telegram WebApp için genişletilmiş tipler
interface TelegramWebAppButton {
  show?: () => void;
  hide?: () => void;
  onClick?: (callback: () => void) => void;
  offClick?: (callback: () => void) => void;
  setText?: (text: string) => void;
  enable?: () => void;
  disable?: () => void;
  showProgress?: (leaveActive?: boolean) => void;
  hideProgress?: () => void;
}

// Popup button tipi
interface PopupButton {
  id: string;
  type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text: string;
}

// Popup parametreleri
interface PopupParams {
  title?: string;
  message: string;
  buttons?: PopupButton[];
}

// Story paylaşım parametreleri
interface StoryShareParams {
  text?: string;
  widget_link?: {
    url: string;
    name?: string;
  };
}

// HapticFeedback tipi
interface TelegramHapticFeedback {
  impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged?: () => void;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initDataUnsafe: WebAppInitData;
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    button_color?: string;
    button_text_color?: string;
    [key: string]: string | undefined;
  };
  // Yeni metodlar - opsiyonel çünkü eski versiyonlarda olmayabilir
  requestFullscreen?: () => void;
  setHeaderColor?: (color: string) => void;
  openLink?: (url: string) => void;
  openTelegramLink?: (url: string) => void;
  showPopup?: (params: PopupParams, callback?: (buttonId: string) => void) => void;
  shareToStory?: (mediaUrl: string, params?: StoryShareParams) => void;
  HapticFeedback?: TelegramHapticFeedback;
  BackButton?: TelegramWebAppButton;
  SettingsButton?: TelegramWebAppButton;
  onEvent?: (eventType: string, handler: (...args: unknown[]) => void) => void;
  offEvent?: (eventType: string, handler: (...args: unknown[]) => void) => void;
  safeAreaInset?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  // Diğer WebApp metodları
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}
