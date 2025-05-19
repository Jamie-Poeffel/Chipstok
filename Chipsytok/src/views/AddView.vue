<template>
  <div class="add-page">
    <div v-if="tempImage" class="preview-container">
      <img v-if="!isVideo" :src="tempImage" alt="Selected content" class="preview-image" />
      <video v-if="isVideo" :src="tempImage" controls class="preview-image"></video>

      <div>
        <button @click="cancel">Cancel</button>
        <button @click="post">Post</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { base64ToBlob, getLastUploadFromIndexedDB } from './../composables/Uploads';

const tempImage = ref(null);
const router = useRouter();

const isVideo = computed(() => tempImage.value?.match(/^data:video\/(mp4|webm|ogg);base64,/i));

const post = async () => {
  const form = new FormData();

  let mimeType = isVideo.value ? 'video/mp4' : 'image/jpeg';
  const blob = base64ToBlob(tempImage.value, mimeType);
  const filename = isVideo.value ? 'video.mp4' : 'image.jpg';

  form.append('file', blob, filename);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/upload/post`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });

  if (!response.ok) {
    console.error('Upload failed:', response.statusText);
    return;
  }

  const data = await response.json();
  console.log('Upload successful:', data);

  const deleteRequest = indexedDB.open('uploads', 1);
  deleteRequest.onsuccess = () => {
    const db = deleteRequest.result;
    const transaction = db.transaction('uploads', 'readwrite');
    const store = transaction.objectStore('uploads');
    store.delete('lastUpload');
  };
  deleteRequest.onerror = (event) => {
    console.error('Error deleting from IndexedDB:', event.target.error);
  };

  router.push('/');
};

onMounted(async () => {
  const stored = await getLastUploadFromIndexedDB();
  if (stored && stored.content) {
    tempImage.value = stored.content;
    console.log('Datei aus IndexedDB geladen:', stored.name);
  } else {
    router.push('/');
  }
});

// Cancel function to redirect manually
const cancel = () => {
  router.push('/');
};
</script>

<style scoped>
.preview-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.preview-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #ff2d55;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #ff1a44;
}
</style>
