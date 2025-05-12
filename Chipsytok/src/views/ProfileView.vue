<template>
  <div class="profile-container">
    <!-- Profile header and user meta -->
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
              <p class="bio">{{ useAuthStore().user.profile.bio || '\n' }}</p>
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

          <!-- Buttons -->
          <div class="flex items-center gap-1 w-full h-[24px] mt-3">
            <button class="flex-1 button">Profil bearbeiten</button>
            <button @click="share" class="flex-1 button">Profil Teilen</button>
            <button class="icon-button" @click="openSettings = true">
              <Settings class="w-4 h-4" />
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

    <!-- Posts Grid -->
    <div class="posts-grid">
      <div v-for="n in 9" :key="n" class="post-thumb"></div>
    </div>

    <!-- Settings Modal -->
    <div v-if="openSettings" class="modal-overlay" @click.self="openSettings = false">
      <div class="modal">
        <h3>Settings</h3>
        <ul class="settings-list">
          <li @click="openChangePassword = true">Change Password</li>
          <li>Settings and Privacy</li>
          <li @click="logout">Log Out</li>
          <li class="cancel-btn" @click="openSettings = false">Cancel</li>
        </ul>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="openChangePassword" class="modal-overlay" @click.self="openChangePassword = false">
      <div class="modal">
        <h3>Change Password</h3>
        <input
          v-model="currentPassword"
          placeholder="Current Password"
          type="password"
          class="input"
        />
        <input v-model="newPassword" placeholder="New Password" type="password" class="input" />
        <input
          v-model="confirmPassword"
          placeholder="Confirm New Password"
          type="password"
          class="input"
        />
        <p v-if="passwordMessage" :class="{ error: passwordError, success: !passwordError }">
          {{ passwordMessage }}
        </p>
        <button class="button w-full mt-2" @click="changePassword">Change</button>
        <button class="cancel-btn w-full mt-2" @click="openChangePassword = false">Cancel</button>
      </div>
    </div>

    <!-- Share Modal -->
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
import { useRouter } from 'vue-router';
import { Settings } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import QRCodeStyling from 'qr-code-styling';

const activeTab = ref('posts');
const openSettings = ref(false);
const openChangePassword = ref(false);
const username = ref(useAuthStore().username);
const Share = ref(false);
const qrCodeContainer = ref(null);
const qrCode = ref(null);
const router = useRouter();

// Password change state
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordMessage = ref('');
const passwordError = ref(false);

function logout() {
  // Simulate logout and go to login page
  openSettings.value = false;
  router.push('/login');
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

function changePassword() {
  const simulatedCorrectPassword = '123456'; // Simulate correct password check

  if (currentPassword.value !== simulatedCorrectPassword) {
    passwordMessage.value = 'Current password is incorrect.';
    passwordError.value = true;
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordMessage.value = 'New passwords do not match.';
    passwordError.value = true;
    return;
  }

  passwordMessage.value = 'Password changed successfully!';
  passwordError.value = false;

  // Reset form after success
  setTimeout(() => {
    openChangePassword.value = false;
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    passwordMessage.value = '';
  }, 1500);
}
</script>

<style scoped>

/* Header */
.profile-header {
  padding: 2rem;
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

/* User Meta */
.flex-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

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

/* Simplified button styles */
.button {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  border: 1px solid #d1d5db;
  transition: all 0.3s ease-in-out;
  transform: scale(1);
}

.button:hover {
  background-color: #d1d5db;
  transform: scale(1);
}

.icon-button {
  height: 32.5px !important;
  width: 32.5px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  border: 1px solid #d1d5db;
  transition: all 0.3s ease-in-out;
  transform: scale(1);
}

.icon-button:hover {
  background-color: #d1d5db;
  transform: scale(1.05);
}

.input {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 0.875rem;
}

.success {
  color: green;
  font-size: 0.875rem;
}

/* Tabs and posts */
.tab {
  transition: all 0.3s ease;
  transform-origin: center;
}
.tab:hover,
.tab.active {
  color: #ff2d55;
  transform: scale(1.05);
}

.post-thumb {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.post-thumb:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background-color: #ff2d55;
  color: white;
  border-radius: 8px;
  margin-top: 10px;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
}
.cancel-btn:hover {
  background-color: #e60039;
  transform: scale(1.05);
}
</style>
