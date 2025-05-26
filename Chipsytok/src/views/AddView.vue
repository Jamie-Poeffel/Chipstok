<template>
  <div class="overlay">
    <div class="add-page">
      <div v-if="tempImage" class="preview-container">
        <div class="video-container">
          <video
            v-if="isVideo"
            :src="tempImage"
            ref="video"
            controls
            class="preview-image"
            :currentTime="startTime"
            :duration="endTime"
          ></video>
          <img
            v-else
            :src="tempImage"
            alt="Selected content"
            class="preview-image"
            :style="{ objectPosition: `${startTime}% 0` }"
          />
        </div>

        <div v-if="isVideo">
          <label for="start-time">Start Time:</label>
          <input type="range" v-model="startTime" min="0" :max="videoDuration" step="0.1" />
          <span>{{ startTime }}s</span>
        </div>
        <div v-if="isVideo">
          <label for="end-time">End Time:</label>
          <input type="range" v-model="endTime" min="startTime" :max="videoDuration" step="0.1" />
          <span>{{ endTime }}s</span>
        </div>

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

const tempImage = ref(null);
const startTime = ref(0);
const endTime = ref(30);
const videoDuration = ref(0);
const router = useRouter();

const isVideo = computed(() => tempImage.value?.match(/^data:video\/(mp4|webm|ogg);base64,/i));

const post = async () => {
  const form = new FormData();

  let mimeType = isVideo.value ? 'video/mp4' : 'image/jpeg';
  const blob = base64ToBlob(tempImage.value, mimeType);
  const filename = isVideo.value ? 'video.mp4' : 'image.jpg';

  form.append('video', blob, filename);

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

  if (isVideo.value) {
    const videoElement = document.querySelector('video');
    videoElement.onloadedmetadata = () => {
      videoDuration.value = videoElement.duration;
    };
  }
});

const cancel = async () => {
  await clearIndexedDB();
  router.push('/');
};
</script>
<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Grayish background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.add-page {
  position: relative;
  background-color: white;
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
  gap: 16px;
}

.video-container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

input[type='range'] {
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
  background-color: #ff1a44;
}

button:active {
  transform: scale(0.98);
}

.button-container {
  display: flex;
  gap: 16px;
  justify-content: center;
  width: 100%;
}
</style>
