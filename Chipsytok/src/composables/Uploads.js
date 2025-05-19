function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('UploadDB', 1);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('uploads')) {
        db.createObjectStore('uploads', { keyPath: 'name' });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

export async function saveToIndexedDB(fileData) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['uploads'], 'readwrite');
    const store = transaction.objectStore('uploads');

    const request = store.put(fileData);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getLastUploadFromIndexedDB() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['uploads'], 'readonly');
    const store = transaction.objectStore('uploads');

    // Alle Einträge abrufen
    const request = store.getAll();

    request.onsuccess = () => {
      const all = request.result;
      if (all.length === 0) return resolve(null);
      // Nimm den letzten (du kannst auch per Zeitstempel sortieren)
      resolve(all[all.length - 1]);
    };

    request.onerror = () => reject(request.error);
  });
}

export function base64ToBlob(base64, mimeType) {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}
