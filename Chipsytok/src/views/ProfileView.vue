<template>
  <div class="profile-container">
    <!-- Profile header and user meta -->
    <div class="profile-header">
      <div class="header-top flex flex-col lg:flex-row lg:items-start lg:justify-between w-full">
        <!-- Left: avatar + meta -->
        <div class="flex flex-col w-full">
          <div class="flex flex-row">
            <div class="avatar-wrapper">
              <img
                class="avatar"
                src="https://randomuser.me/api/portraits/men/3.jpg"
                alt="avatar"
              />
            </div>
            <div class="user-meta">
              <p class="handle">@{{ user?.username }}</p>
              <p class="bio">{{ user?.profile?.bio || '\n' }}</p>

              <div class="stats">
                <div>
                  <strong>{{ formatNumber(user?.profile?.following) }} Gefolgt</strong>
                </div>
                <div>
                  <strong>{{ formatNumber(user?.profile?.followers) }} Follower*innen</strong>
                </div>
                <div>
                  <strong>{{ formatNumber(user?.profile?.likeCount) }} Likes</strong>
                </div>
              </div>

              <!-- Action buttons -->
            </div>
          </div>
          <div class="flex gap-2 mt-3 w-full">
            <button
              v-if="!isFollowing"
              @click="followOrUnfollow"
              class="flex-1 bg-[#ff2d55] hover:bg-[#ff1a44] text-white font-semibold rounded-lg px-6 py-2 transition-all duration-150 shadow-md active:scale-95"
            >
              {{ t('follow') }}
            </button>
            <button
              v-else
              @click="followOrUnfollow"
              class="flex-1 bg-[#ff2d55] hover:bg-[#ff1a44] text-white font-semibold rounded-lg px-6 py-2 transition-all duration-150 shadow-md active:scale-95"
            >
              {{ t('unfollow') }}
            </button>
            <button
              class="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 font-semibold rounded-lg px-6 py-2 transition-all duration-150 shadow-md active:scale-95"
            >
              {{ t('message') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <span class="tab" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'"
        >Posts</span
      >
      <span class="tab" :class="{ active: activeTab === 'saved' }" @click="activeTab = 'saved'"
        >Saved</span
      >
      <span class="tab" :class="{ active: activeTab === 'tagged' }" @click="activeTab = 'tagged'"
        >Tagged</span
      >
    </div>

    <!-- Profile grid section -->
    <section class="profile-grid-section w-full">
      <!-- Posts grid (infinite scroll) -->
      <div v-if="activeTab === 'posts'" class="posts-grid">
        <div
          v-for="(video, index) in importedVideos"
          :key="index"
          class="video-thumb relative w-full pt-[100%] overflow-hidden bg-gray-100"
        >
          <video
            :src="video.src"
            class="absolute inset-0 w-full h-full object-cover"
            muted
            playsinline
          ></video>
        </div>
      </div>

      <!-- Placeholders for Saved & Tagged -->
      <div v-if="activeTab === 'saved'" class="posts-grid">
        <div v-for="n in 6" :key="n" class="post-thumb bg-gray-200" />
      </div>
      <div v-if="activeTab === 'tagged'" class="posts-grid">
        <div v-for="n in 6" :key="n" class="post-thumb bg-gray-200" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { t } from '../composables/useLanguage';
const route = useRoute();

const user = ref(null);
const isFollowing = ref(false);

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true });

  let res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/${route.query.username}`, {
    credentials: 'include',
  });
  user.value = await res.json();
  res = null;
  res = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/users/${route.query.username}/isFollowing`,
    { credentials: 'include' },
  );
  isFollowing.value = await res.json();
});

async function followOrUnfollow() {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/users/${route.query.username}/follow`,
    {
      method: 'POST',
      credentials: 'include',
    },
  );
  if (res.ok) {
    isFollowing.value = !isFollowing.value;
  } else {
    console.error('Error following/unfollowing user');
  }
}

// Tabs & modals
const activeTab = ref('posts');

// Infinite‑scroll post grid
const INITIAL_POSTS = 30;
const BATCH_SIZE = 15;
const posts = ref(Array.from({ length: INITIAL_POSTS }));

function addMorePosts() {
  posts.value.push(...Array.from({ length: BATCH_SIZE }));
}

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    addMorePosts();
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Imported videos placeholder
const importedVideos = ref([]);

function formatNumber(value) {
  return value > 9999 ? (value / 1000).toFixed(0) + 'k' : value;
}
</script>

<style scoped>
/* Container & header */
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}

.profile-header {
  padding: 2rem;
  width: 100%;
}

/* Avatar */
.avatar-wrapper {
  margin-right: 1rem;
  flex-shrink: 0;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  object-fit: cover;
}

/* User meta */
.user-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.handle {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  word-break: break-word;
}

.bio {
  font-size: 0.95rem;
  color: #6b7280;
  white-space: pre-line;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.stats strong {
  font-weight: 600;
}

/* Buttons */
.button,
.icon-button {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: #4b5563;
  background: transparent;
  transition:
    transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
    background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.button {
  padding: 0.25rem 0.75rem;
}

.icon-button {
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button:hover,
.icon-button:hover {
  background: #e5e7eb;
}

.button:active,
.icon-button:active {
  transform: scale(0.95);
}

/* Inputs */
.input {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-sizing: border-box;
}

/* Validation text */
.error {
  color: #dc2626;
  font-size: 0.875rem;
}

.success {
  color: #16a34a;
  font-size: 0.875rem;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: space-around;
  width: 100%;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  margin-top: 1rem;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 0.75rem 0;
  font-weight: 600;
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.tab:hover,
.tab.active {
  color: #ef4444;
  transform: scale(1.05);
}

/* Grid section */
.profile-grid-section {
  width: 100%;
}

/* Posts grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.25rem;
  max-width: 640px;
  width: 100%;
  margin: 2rem auto 0;
}

.post-thumb {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  transition:
    transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.post-thumb:hover {
  transform: scale(1.05);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Video thumbnails share hover style */
.video-thumb {
  transition:
    transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.video-thumb:hover {
  transform: scale(1.05);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Misc buttons */
.cancel-btn {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition:
    transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
    background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.cancel-btn:hover {
  background: #dc2626;
}

.cancel-btn:active {
  transform: scale(1.05);
}

/* Fade transitions */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
