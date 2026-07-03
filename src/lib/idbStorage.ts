import { MediaItem } from '../types';

const DB_NAME = "tb_resurs_db";
const STORE_NAME = "media_store";
const KEY_NAME = "media_list";
const KV_STORE_NAME = "kv_store";

export const saveToIDB = (key: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, 2);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
        if (!db.objectStoreNames.contains(KV_STORE_NAME)) {
          db.createObjectStore(KV_STORE_NAME);
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(KV_STORE_NAME)) {
          // If store doesn't exist on this version, upgrade
          db.close();
          const req2 = indexedDB.open(DB_NAME, db.version + 1);
          req2.onupgradeneeded = (ev: any) => {
            const db2 = ev.target.result;
            if (!db2.objectStoreNames.contains(KV_STORE_NAME)) {
              db2.createObjectStore(KV_STORE_NAME);
            }
          };
          req2.onsuccess = (ev: any) => {
            const db2 = ev.target.result;
            const tx = db2.transaction(KV_STORE_NAME, "readwrite");
            tx.objectStore(KV_STORE_NAME).put(data, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
          };
          return;
        }
        const tx = db.transaction(KV_STORE_NAME, "readwrite");
        tx.objectStore(KV_STORE_NAME).put(data, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
};

export const loadFromIDB = <T>(key: string): Promise<T | null> => {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 2);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
        if (!db.objectStoreNames.contains(KV_STORE_NAME)) {
          db.createObjectStore(KV_STORE_NAME);
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(KV_STORE_NAME)) {
          resolve(null);
          return;
        }
        const tx = db.transaction(KV_STORE_NAME, "readonly");
        const store = tx.objectStore(KV_STORE_NAME);
        const getReq = store.get(key);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    } catch (err) {
      resolve(null);
    }
  });
};

export const saveMediaToIDB = (items: MediaItem[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, 2);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
        if (!db.objectStoreNames.contains(KV_STORE_NAME)) {
          db.createObjectStore(KV_STORE_NAME);
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(items, KEY_NAME);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
};

export const loadMediaFromIDB = (): Promise<MediaItem[] | null> => {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 2);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
        if (!db.objectStoreNames.contains(KV_STORE_NAME)) {
          db.createObjectStore(KV_STORE_NAME);
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(KEY_NAME);
        getReq.onsuccess = () => {
          if (Array.isArray(getReq.result) && getReq.result.length > 0) {
            resolve(getReq.result);
          } else {
            resolve(null);
          }
        };
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    } catch (err) {
      resolve(null);
    }
  });
};
