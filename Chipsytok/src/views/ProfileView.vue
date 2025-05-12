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
              <p class="handle">@{{ useAuthStore().username }}</p>
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
    <Transition name="fade">
      <div
        v-if="openSettings"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="openSettings = false"
      >
        <div
          class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6 transform transition-all duration-300 scale-100"
        >
          <h3 class="text-xl font-semibold text-center mb-4">Settings</h3>
          <ul class="settings-list space-y-3 text-gray-800">
            <li @click="openChangePassword = true" class="cursor-pointer hover:text-pink-600">
              Change Password
            </li>
            <li class="cursor-pointer hover:text-pink-600">Settings and Privacy</li>
            <li @click="logout" class="cursor-pointer hover:text-pink-600">Log Out</li>
          </ul>
          <button
            class="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition-transform hover:scale-105"
            @click="openSettings = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </Transition>

    <!-- Change Password Modal -->
    <Transition name="fade">
      <div
        v-if="openChangePassword"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="openChangePassword = false"
      >
        <div class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6">
          <h3 class="text-xl font-semibold text-center mb-4">Change Password</h3>
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
          <p
            v-if="passwordMessage"
            :class="{ error: passwordError, success: !passwordError }"
            class="mt-2 text-center"
          >
            {{ passwordMessage }}
          </p>
          <button class="button w-full mt-4" @click="changePassword">Change</button>
          <button class="cancel-btn w-full mt-2" @click="openChangePassword = false">Cancel</button>
        </div>
      </div>
    </Transition>

    <!-- Share Modal -->
    <Transition name="fade">
      <div
        v-if="shareModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="shareModal = false"
      >
        <div class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6">
          <h3 class="text-xl font-semibold text-center mb-4">Share Profile</h3>
          <div class="w-full flex justify-center items-center">
            <div ref="qrCodeContainer"></div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { Settings } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import QRCodeStyling from 'qr-code-styling';

// Tabs & modals
const activeTab = ref('posts');
const openSettings = ref(false);
const openChangePassword = ref(false);
const shareModal = ref(false);

// Password change state
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordMessage = ref('');
const passwordError = ref(false);

// Router
const router = useRouter();

// QR code
const qrCodeContainer = ref(null);
const qrCode = ref(null);

function logout() {
  openSettings.value = false;
  router.push('/login');
}

function share() {
  shareModal.value = true;
}

const initQRCode = () => {
  qrCode.value = new QRCodeStyling({
    width: 300,
    height: 300,
    data: window.location.href,
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
  if (shareModal.value && qrCodeContainer.value) {
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

.popup,
.modal,
.dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.button {
  padding: 0.25rem 0.75rem;
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
.button:hover {
  background: #e5e7eb;
}
.button:active {
  transform: scale(0.95);
}

.icon-button {
  height: 30px;
  width: 30px;
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #4b5563;
  background: transparent;
  transition:
    transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
    background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.icon-button:hover {
  background: #e5e7eb;
}
.icon-button:active {
  transform: scale(0.95);
}

.input {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font: inherit;
  color: inherit;
  box-sizing: border-box;
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
}
.success {
  color: #16a34a;
  font-size: 0.875rem;
}

.tab {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}
.tab:hover,
.tab.active {
  color: #ef4444;
  transform: scale(1.05);
}

.post-thumb {
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

.cancel-btn {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition:
    transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
    background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.cancel-btn:hover {
  background: #dc2626;
}
.cancel-btn:focus {
  outline: none;
}
.cancel-btn:active {
  transform: scale(1.05);
}

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
