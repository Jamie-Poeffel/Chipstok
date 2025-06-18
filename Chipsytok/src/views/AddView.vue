<template>
  <div class="fixed inset-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="relative bg-white w-full h-[calc(100dvh-44px)] -top-[22px] p-6 overflow-y-auto flex flex-col gap-6">

      <!-- Content Top -->
      <div class="flex flex-col lg:flex-row gap-6 flex-1">

        <!-- Media Preview -->
        <div class="flex-1 flex flex-col items-center justify-center">
          <video v-if="isVideo" :src="tempImage" ref="video" controls
            class="rounded-xl w-full max-w-full aspect-video shadow-lg"></video>
          <img v-else :src="tempImage" alt="Selected content"
            class="rounded-xl object-cover w-full h-full max-h-[60vh] shadow-lg" />
        </div>

        <!-- Text Inputs -->
        <div class="flex-1 flex flex-col gap-4">
          <textarea v-model="caption" maxlength="200" placeholder="Write a caption..."
            class="w-full h-28 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff2d55]"></textarea>

          <input v-model="hashtagInput" @keydown.enter.prevent="addHashtag" type="text"
            placeholder="Add hashtag and press Enter"
            class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff2d55]" />

          <!-- Hashtags -->
          <div class="flex flex-wrap gap-2">
            <span v-for="(tag, index) in hashtags" :key="index"
              class="bg-[#ff2d55]/10 text-[#ff2d55] font-medium text-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              {{ tag }}
              <button @click="removeHashtag(index)">
                <X class="w-4 h-4 hover:text-red-500" />
              </button>
            </span>
          </div>

          <div class="flex justify-between text-xs text-gray-500">
            <span>{{ hashtags.length }}/15 hashtags</span>
            <span>{{ caption.length }}/200 characters</span>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-4 pt-4 border-t border-gray-100">
        <button @click="cancel" class="px-6 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition">
          Cancel
        </button>
        <button @click="post" class="px-6 py-2 rounded-xl bg-[#ff2d55] text-white hover:bg-pink-600 transition">
          <p v-if="!isLoad">Post</p>
          <Loader2 v-else class="w-4 h-4 animate-spin" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { base64ToBlob, clearIndexedDB, getLastUploadFromIndexedDB } from './../composables/Uploads';
import { useFetch } from '@/composables/useFetch';
import { Loader2, X } from 'lucide-vue-next';

const tempImage = ref(null);
const caption = ref('');
const hashtags = ref([]);
const hashtagInput = ref('');
const video = ref(null);
const router = useRouter();
const isLoad = ref(false);

const isVideo = computed(() =>
  tempImage.value?.match(/^data:video\/(mp4|webm|ogg);base64,/i)
);

const addHashtag = () => {
  let tag = hashtagInput.value.trim();
  if (!tag) return;
  if (!tag.startsWith('#')) tag = '#' + tag;
  if (hashtags.value.includes(tag)) return;
  if (hashtags.value.length >= 15) return;
  hashtags.value.push(tag);
  hashtagInput.value = '';
};

const removeHashtag = (index) => {
  hashtags.value.splice(index, 1);
};

const post = async () => {
  if (!caption.value.trim()) {
    console.error('Caption cannot be empty.');
    return;
  }
  isLoad.value = true

  const form = new FormData();
  let mimeType = isVideo.value ? 'video/mp4' : 'image/jpeg';
  const blob = base64ToBlob(tempImage.value, mimeType);
  const filename = isVideo.value ? 'video.mp4' : 'image.jpg';

  form.append('video', blob, filename);
  form.append('caption', caption.value);
  form.append('Hashtags', JSON.stringify(hashtags.value));


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
  isLoad.value = false
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
</script>

<style scoped>
/* Kein zusätzliches CSS nötig – alles läuft über Tailwind */
</style>
