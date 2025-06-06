you see this and understand it? answer with three words

<template>
  <div class="overlay">
    <div class="add-page">
      <div v-if="tempImage" class="preview-container">
        <!-- Image/Video Display -->
        <div class="media-container">
          <video v-if="isVideo" :src="tempImage" ref="video" controls class="preview-media"
            :currentTime="startTime"></video>
          <img v-else :src="tempImage" alt="Selected content" class="preview-media" :style="imageStyle" />
        </div>

        <!-- Buttons Container -->
        <div class="button-container">
          <button @click="cancel" class="cancel-button">Cancel</button>
          <button @click="post" class="post-button">Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { base64ToBlob, clearIndexedDB, getLastUploadFromIndexedDB } from './../composables/Uploads';
import { useFetch } from '@/composables/useFetch';

const tempImage = ref(null);
const startTime = ref(0);
const router = useRouter();

const isVideo = computed(() => tempImage.value?.match(/^data:video\/(mp4|webm|ogg);base64,/i));

const post = async () => {
  const form = new FormData();

  let mimeType = isVideo.value ? 'video/mp4' : 'image/jpeg';
  const blob = base64ToBlob(tempImage.value, mimeType);
  const filename = isVideo.value ? 'video.mp4' : 'image.jpg';

  form.append('video', blob, filename);

  const { res, data, error } = await useFetch(`/upload/post`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });

  if (error || !res.ok) {
    console.error('Upload failed:', error || res.statusText);
    return;
  }

  console.log('Upload successful:', data);
  await clearIndexedDB();

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

const cancel = async () => {
  await clearIndexedDB();
  router.push('/');
};

const imageStyle = computed(() => {
  return {
    objectPosition: `${startTime.value}% 0`,
    objectFit: 'contain',
    width: '100%',
    maxHeight: '60vh',
  };
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Grayish background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.add-page {
  position: relative;
  background-color: transparent;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow: hidden;
}

.preview-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.media-container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
}

.preview-media {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

.input-range {
  width: 100%;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #ff2d55;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #f70f3a;
}

button:active {
  transform: scale(0.98);
}

.button-container {
  display: flex;
  gap: 16px;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  /* Space between the image/video and buttons */
}

.cancel-button {
  background-color: #ff2d55;
  /* Red color for Cancel */
}

.post-button {
  background-color: #ff2d55;
  /* Red color for Post */
}
</style>
