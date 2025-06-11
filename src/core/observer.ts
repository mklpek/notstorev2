/**
 * Global IntersectionObserver
 *
 * Her bileşen için ayrı observer oluşturmak yerine,
 * tüm uygulama genelinde paylaşılmış bir observer kullanarak
 * performans optimize edilmiştir.
 */

// Görünürlük değişimini dinleyen fonksiyon tipini tanımla
type VisibilityCallback = (isVisible: boolean, entry: IntersectionObserverEntry) => void;

// Observer callback ve element referansını saklayan Map
const callbackMap = new Map<Element, VisibilityCallback>();

// Tüm gözlemlenen elementler için tek bir callback
const handleIntersections = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
    const callback = callbackMap.get(entry.target);
    if (callback) {
      callback(entry.isIntersecting, entry);
    }
  });
};

// Global tek IntersectionObserver instance'ı
export const viewport$ = new IntersectionObserver(handleIntersections, {
  rootMargin: '200px', // 200px yukarıdan gözlemlemeye başla
  threshold: 0.01, // %1 görünürlükte tetikle
});

/**
 * Bir elementi görünürlük için gözlemler
 * @param element Gözlemlenecek element
 * @param callback Görünürlük değiştiğinde çağrılacak fonksiyon
 */
export const observeElement = (element: Element, callback: VisibilityCallback) => {
  callbackMap.set(element, callback);
  viewport$.observe(element);
};

/**
 * Bir elementi gözlemden çıkarır
 * @param element Gözlemden çıkarılacak element
 */
export const unobserveElement = (element: Element) => {
  callbackMap.delete(element);
  viewport$.unobserve(element);
};

/**
 * Tüm observer'ları temizler
 * Component unmount olduğunda çağrılmalıdır
 */
export const disconnectAll = () => {
  callbackMap.clear();
  viewport$.disconnect();
};

// Uygulama kapanırken observer'ı temizle
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    disconnectAll();
  });
}
