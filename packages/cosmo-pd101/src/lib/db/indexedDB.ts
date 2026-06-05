export type StoreSchema = {
	name: string;
	keyPath: string;
};

export type DatabaseConfig = {
	name: string;
	version: number;
	stores: StoreSchema[];
};

let dbPromise: Promise<IDBDatabase> | null = null;
let currentConfig: DatabaseConfig | null = null;

export function defineDatabase(config: DatabaseConfig) {
	if (currentConfig && currentConfig !== config) {
		dbPromise = null;
	}
	currentConfig = config;

	async function getDb(): Promise<IDBDatabase> {
		if (!dbPromise) {
			dbPromise = new Promise((resolve, reject) => {
				const request = indexedDB.open(config.name, config.version);
				request.onupgradeneeded = () => {
					const db = request.result;
					for (const store of config.stores) {
						if (!db.objectStoreNames.contains(store.name)) {
							db.createObjectStore(store.name, { keyPath: store.keyPath });
						}
					}
				};
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => {
					dbPromise = null;
					reject(request.error);
				};
			});
		}
		return dbPromise;
	}

	return {
		getDb,

		/** Close the current connection and reset the cache. */
		close() {
			if (dbPromise) {
				dbPromise.then((d) => d.close());
				dbPromise = null;
			}
		},

		async get<T>(storeName: string, id: string): Promise<T | null> {
			const db = await getDb();
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, "readonly");
				const request = tx.objectStore(storeName).get(id);
				request.onsuccess = () => resolve((request.result as T) ?? null);
				request.onerror = () => reject(request.error);
			});
		},

		async getAll<T>(storeName: string): Promise<T[]> {
			const db = await getDb();
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, "readonly");
				const request = tx.objectStore(storeName).getAll();
				request.onsuccess = () => resolve(request.result as T[]);
				request.onerror = () => reject(request.error);
			});
		},

		async put(storeName: string, value: unknown): Promise<void> {
			const db = await getDb();
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, "readwrite");
				tx.objectStore(storeName).put(value);
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			});
		},

		async delete(storeName: string, id: string): Promise<void> {
			const db = await getDb();
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, "readwrite");
				tx.objectStore(storeName).delete(id);
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			});
		},

		async clear(storeName: string): Promise<void> {
			const db = await getDb();
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, "readwrite");
				tx.objectStore(storeName).clear();
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			});
		},
	};
}
