<template>
  <div class="overlay">
    <div class="add-page">
      <div v-if="tempImage" class="preview-container">
        <div class="media-side-by-side">
          <!-- Image/Video -->
          <div class="media-container">
            <video
              v-if="isVideo"
              :src="tempImage"
              ref="video"
              controls
              class="preview-media"
              :currentTime="startTime"
            ></video>
            <img
              v-else
              :src="tempImage"
              alt="Selected content"
              class="preview-media"
              :style="imageStyle"
            />
          </div>

          <!-- Text Inputs -->
          <div class="text-inputs">
            <textarea
              v-model="caption"
              maxlength="200"
              placeholder="Write a caption (max 200 characters)"
              class="caption-input"
            ></textarea>

            <input
              v-model="hashtags"
              type="text"
              placeholder="#hashtags (max 15, separated by space)"
              class="hashtag-input"
            />
            <p class="char-counter">{{ caption.length }}/200 characters</p>
          </div>
        </div>

        <!-- Buttons -->
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
const caption = ref('');
const hashtags = ref('');
const router = useRouter();

const isVideo = computed(() => tempImage.value?.match(/^data:video\/(mp4|webm|ogg);base64,/i));

const post = async () => {
  if (!caption.value.trim()) {
    console.error('Caption cannot be empty.');
    return;
  }

  const hashtagArray = hashtags.value
    .trim()
    .split(/\s+/)
    .filter((h) => h.startsWith('#'));

  if (hashtagArray.length > 15) {
    console.error('Maximum 15 hashtags allowed.');
    return;
  }

  const form = new FormData();

  let mimeType = isVideo.value ? 'video/mp4' : 'image/jpeg';
  const blob = base64ToBlob(tempImage.value, mimeType);
  const filename = isVideo.value ? 'video.mp4' : 'image.jpg';

  form.append('video', blob, filename);
  form.append('caption', caption.value);
  form.append('hashtags', hashtagArray.join(' '));

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
    objectFit: 'cover',
    width: '100%',
    height: '100%',
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.add-page {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}

.preview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.media-side-by-side {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  max-height: 60vh;
}

.media-container {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.text-inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.caption-input,
.hashtag-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: none;
  box-sizing: border-box;
}

.char-counter {
  font-size: 12px;
  color: #666;
  text-align: right;
}

.button-container {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;
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

.cancel-button {
  background-color: #ff2d55;
}

.post-button {
  background-color: #ff2d55;
}

@media (max-width: 768px) {
  .media-side-by-side {
    flex-direction: column;
    max-height: none;
  }

  .text-inputs {
    width: 100%;
  }
}
</style>
