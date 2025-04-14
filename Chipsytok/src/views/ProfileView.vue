<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="header-top">
        <div class="flex flex-col">
          <div class="flex flex-row">
            <div class="avatar-wrapper">
              <img
                class="avatar"
                src="https://randomuser.me/api/portraits/men/3.jpg"
                alt="avatar"
              />
            </div>
            <div class="user-meta">
              <p class="handle">@{{ username || 'error' }}</p>
              <p class="bio">
                {{
                  useAuthStore().user.profile.bio === '' ? '\n' : useAuthStore().user.profile.bio
                }}
              </p>
              <div class="stats">
                <div>
                  <strong
                    >{{ formatNumber(useAuthStore().user.profile.followers) }} Following</strong
                  >
                </div>
                <div>
                  <strong
                    >{{ formatNumber(useAuthStore().user.profile.following) }} Followers</strong
                  >
                </div>
                <div>
                  <strong>{{ formatNumber(useAuthStore().user.profile.likeCount) }} Likes</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1 w-full h-[24px] mt-3">
            <button
              class="flex-1 py-1 px-3 rounded-md text-sm font-medium text-gray-700 border hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-100"
            >
              Profil bearbeiten
            </button>
            <button
              @click="share"
              class="flex-1 py-1 px-3 rounded-md text-sm font-medium text-gray-700 border hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-100"
            >
              Profil Teilen
            </button>
            <button
              class="h-[30px] w-[30px] flex justify-center items-center rounded-md text-sm font-medium text-gray-700 border hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Settings class="w-4 h-4" @click="openSettings = true" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="tabs">
      <span class="tab" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'"
        >Posts</span
      >
      <span
        class="tab"
        :class="{ active: activeTab === 'followers' }"
        @click="activeTab = 'followers'"
        >Saved</span
      >
      <span
        class="tab"
        :class="{ active: activeTab === 'following' }"
        @click="activeTab = 'following'"
        >Tagged</span
      >
    </div>

    <div class="posts-grid">
      <div v-for="n in 9" :key="n" class="post-thumb"></div>
    </div>

    <div v-if="openSettings" class="modal-overlay" @click.self="openSettings = false">
      <div class="modal">
        <h3>Settings</h3>
        <ul class="settings-list">
          <li>Change Password</li>
          <li>Settings and Privacy</li>
          <li @click="logout">Log Out</li>
          <li class="cancel-btn" @click="openSettings = false">Cancel</li>
        </ul>
      </div>
    </div>

    <div v-if="Share" class="modal-overlay" @click.self="Share = false">
      <div class="modal">
        <h3>Share Profile</h3>
        <div class="mt-4 w-full flex justify-center items-center">
          <div ref="qrCodeContainer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { Settings } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import QRCodeStyling from 'qr-code-styling';

const activeTab = ref('posts');
const openSettings = ref(false);
const username = ref(useAuthStore().username);
const Share = ref(false);
const qrCodeContainer = ref(null);
const qrCode = ref(null);

function logout() {
  alert('Logged out!');
  openSettings.value = false;
}

function share() {
  Share.value = true;
}

const initQRCode = () => {
  qrCode.value = new QRCodeStyling({
    width: 300,
    height: 300,
    data: 'Hello World',
    dotsOptions: {
      color: '#6a1a4c',
      type: 'dots',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
  });
};

watchEffect(() => {
  if (Share.value && qrCodeContainer.value) {
    initQRCode();
    qrCode.value.append(qrCodeContainer.value);
  }
});

function formatNumber(value) {
  return value > 9999 ? (value / 1000).toFixed(0) + 'k' : value;
}
</script>

<style scoped>
/* ... [Same CSS as you already have] ... (I kept it clean) */

/* Smooth tab animations */
.tab {
  transition: all 0.3s ease;
  transform-origin: center;
}
.tab:hover {
  color: #ff2d55;
  transform: scale(1.05);
}
.tab.active {
  color: #ff2d55;
  transform: scale(1.05);
}

/* Smooth post thumb hover */
.post-thumb {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.post-thumb:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Smooth cancel button in modal */
.settings-list .cancel-btn {
  background-color: #ff2d55;
  color: white;
  border-radius: 8px;
  margin-top: 10px;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
}
.settings-list .cancel-btn:hover {
  background-color: #e60039;
  transform: scale(1.05);
}
</style>
