import { createContext } from 'react';
import { TonConnectUI } from '@tonconnect/ui';

// Başlangıçta null olarak oluşturup sonra Provider içinde gerçek değeri atayacağız
export const TonConnectUIContext = createContext<TonConnectUI>(null as unknown as TonConnectUI);
