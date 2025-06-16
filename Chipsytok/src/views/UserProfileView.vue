<template>
  <div class="profile-container">
    <!-- Profile header and user meta -->
    <div class="profile-header">
      <div class="header-top flex flex-col lg:flex-row lg:items-start lg:justify-between w-full">
        <!-- Left: avatar + meta -->
        <div class="flex flex-col w-full">
          <div class="flex flex-row">
            <div class="avatar-wrapper">
              <img class="avatar" :src="userAvatar" alt="avatar" />
            </div>
            <div class="user-meta">
              <p class="handle">@{{ useAuthStore().username }}</p>
              <p class="bio">{{ useAuthStore().user.profile.bio || '\n' }}</p>

              <div class="stats">
                <div>
                  <strong>{{ formatNumber(useAuthStore().user.profile.following) }} Gefolgt</strong>
                </div>
                <div>
                  <strong>{{
                    formatNumber(useAuthStore().user.profile.followers)
                  }}
                    Follower*innen</strong>
                </div>
                <div>
                  <strong>{{ formatNumber(useAuthStore().user.profile.likeCount) }} Likes</strong>
                </div>
              </div>

              <!-- Action buttons -->
            </div>
          </div>
          <div class="flex items-center gap-1 w-full h-[24px] mt-3">
            <button @click="openEditProfile = true" class="flex-1 button">Profil bearbeiten</button>
            <button @click="share" class="flex-1 button">Profil Teilen</button>
            <button class="icon-button" @click="openSettings = true">
              <Settings class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="openEditProfile"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="openEditProfile = false">
        <div class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6">
          <h3 class="text-xl font-semibold text-center mb-4">Profil bearbeiten</h3>
          <input v-model="editUsername" placeholder="Username" type="text" class="input" />
          <textarea v-model="editBio" placeholder="Bio" rows="3" class="input resize-none"></textarea>
          <p v-if="profileMessage" :class="{ error: profileError, success: !profileError }" class="mt-2 text-center">
            {{ profileMessage }}
          </p>
          <button class="button w-full mt-4" @click="saveProfile">Speichern</button>
          <button class="cancel-btn w-full mt-2" @click="openEditProfile = false">Abbrechen</button>
        </div>
      </div>
    </Transition>

    <!-- Tabs -->
    <div class="tabs">
      <span class="tab" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Posts</span>
      <span class="tab" :class="{ active: activeTab === 'saved' }" @click="activeTab = 'saved'">Saved</span>
      <span class="tab" :class="{ active: activeTab === 'tagged' }" @click="activeTab = 'tagged'">Tagged</span>
    </div>

    <!-- Profile grid section -->
    <section class="profile-grid-section w-full">
      <div v-if="activeTab === 'posts'" class="posts-grid">
        <div v-for="(post, index) in posts" :key="index" class="post-thumb">
          <img :src="post.url" alt="alt text" />
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

    <!-- Settings drawer -->
    <Transition name="fade">
      <div v-if="openSettings" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40"
        @click.self="openSettings = false">
        <div class="bg-white w-80 max-w-[90%] p-6 overflow-y-auto shadow-xl rounded-2xl">
          <h3 class="text-xl font-semibold text-center mb-4">Settings & Privacy</h3>
          <ul class="settings-list space-y-3 text-center text-gray-800">
            <li @click="openChangePassword = true" class="cursor-pointer hover:text-red-600">
              Change Password
            </li>
            <li @click="openAccountSettings = true" class="cursor-pointer hover:text-red-600">
              Account Settings
            </li>
            <li @click="openPrivacySettings = true" class="cursor-pointer hover:text-red-600">
              Privacy Settings
            </li>
            <li @click="logout" class="cursor-pointer hover:text-red-600">Log Out</li>
          </ul>
          <button
            class="w-full mt-6 text-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition-transform hover:scale-105"
            @click="openSettings = false">
            Close
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="openAccountSettings"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="handleAccountSettingsClose">
        <div class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6">
          <h3 class="text-xl font-semibold text-center mb-4">Account Settings</h3>
          <input v-model="accountEmail" placeholder="Neue E-Mail" type="email" class="input" />
          <input v-model="accountUsername" placeholder="Neuer Username" type="text" class="input mt-2" />
          <p v-if="accountMessage" :class="{ error: accountError, success: !accountError }" class="mt-2 text-center">
            {{ accountMessage }}
          </p>
          <button class="button w-full mt-4" @click="saveAccountSettings">Speichern</button>
          <button class="cancel-btn w-full mt-2" @click="handleAccountSettingsClose">
            Abbrechen
          </button>
        </div>
      </div>
    </Transition>

    <!-- 3. Privacy Policy Modal -->
    <Transition name="fade">
      <div v-if="openPrivacySettings"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="openPrivacySettings = false">
        <div class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6">
          <h3 class="text-xl font-semibold text-center mb-4">{{ t('privacyPolicy') }}</h3>
          <p class="text-sm text-gray-600">
            {{ t('privacyText') }}
          </p>
          <button
            class="w-full mt-6 text-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition-transform hover:scale-105"
            @click="openPrivacySettings = false">
            {{ t('close') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Change Password Modal -->
    <Transition name="fade">
      <div v-if="openChangePassword"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="openChangePassword = false">
        <div class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6">
          <h3 class="text-xl font-semibold text-center mb-4">Change Password</h3>
          <input v-model="currentPassword" placeholder="Current Password" type="password" class="input" />
          <input v-model="newPassword" placeholder="New Password" type="password" class="input" />
          <input v-model="confirmPassword" placeholder="Confirm New Password" type="password" class="input" />
          <p v-if="passwordMessage" :class="{ error: passwordError, success: !passwordError }" class="mt-2 text-center">
            {{ passwordMessage }}
          </p>
          <button class="button w-full mt-4" @click="changePassword">Change</button>
          <button class="cancel-btn w-full mt-2" @click="openChangePassword = false">Cancel</button>
        </div>
      </div>
    </Transition>

    <!-- Share profile modal -->
    <Transition name="fade">
      <div v-if="shareModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="shareModal = false">
        <div class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6">
          <h3 class="text-xl font-semibold text-center mb-4">Share Profile</h3>
          <div class="w-full flex justify-center items-center">
            <div ref="qrCodeContainer"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Account Settings Modal -->
    <Transition name="fade">
      <div v-if="openAccountSettings"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="handleAccountSettingsClose">
        <div class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6">
          <h3 class="text-xl font-semibold text-center mb-4">Account Settings</h3>
          <input v-model="accountEmail" placeholder="Change Email" type="email" class="input" />
          <input v-model="accountUsername" placeholder="Change Username" type="text" class="input" />
          <p v-if="accountMessage" :class="{ error: accountError, success: !accountError }" class="mt-2 text-center">
            {{ accountMessage }}
          </p>
          <button class="button w-full mt-4" @click="saveAccountSettings">Save</button>
          <button class="cancel-btn w-full mt-2" @click="handleAccountSettingsClose">Cancel</button>
        </div>
      </div>
    </Transition>
  </div>

  <!-- NEU: Modal zum Bearbeiten von Bio, Username und Avatar -->
  <Transition name="fade">
    <div v-if="openEditProfile" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="openEditProfile = false">
      <div class="bg-white rounded-2xl shadow-xl w-80 max-w-[90%] p-6">
        <h3 class="text-xl font-semibold text-center mb-4">Profil bearbeiten</h3>

        <!-- Avatar-Vorschau + Upload -->
        <div class="flex flex-col items-center mb-4">
          <img :src="editAvatarUrl" class="w-24 h-24 rounded-full mb-2" />
          <input type="file" @change="onAvatarChange" accept="image/*" class="w-full" />
        </div>

        <!-- Username-Feld -->
        <input v-model="editUsername" placeholder="Username" type="text" class="input mb-2" />

        <!-- Bio-Feld -->
        <textarea v-model="editBio" placeholder="Bio" rows="3" class="input resize-none"></textarea>

        <!-- Fehlermeldung / Erfolgsmeldung -->
        <p v-if="profileMessage" :class="{ error: profileError, success: !profileError }" class="mt-2 text-center">
          {{ profileMessage }}
        </p>

        <!-- Speichern-Button -->
        <button class="button w-full mt-4" @click="saveProfile">Speichern</button>

        <!-- Abbrechen-Button -->
        <button class="cancel-btn w-full mt-2" @click="openEditProfile = false">Abbrechen</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue';
import { getThumbnails } from '../helpers/getThumbnails.js';
import { useRouter } from 'vue-router';
import { useLanguage } from '@/composables/useLanguage.js';
import { Settings } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import QRCodeStyling from 'qr-code-styling';

const { t } = useLanguage();

// Tabs & modals
const activeTab = ref('posts');
const openSettings = ref(false);
const openChangePassword = ref(false);
const shareModal = ref(false);
const accountEmail = ref(''); // für neue E-Mail
const accountUsername = ref(''); // für neuen Username
const accountMessage = ref('');
const accountError = ref(false);

// Password change state
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordMessage = ref('');
const passwordError = ref(false);

// Infinite‑scroll post grid
const BATCH_SIZE = 15;
const posts = ref([]);

function addMorePosts() {
  posts.value.push(...Array.from({ length: BATCH_SIZE }));
}

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    addMorePosts();
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true });

  posts.value = await getThumbnails();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Imported videos placeholder

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
    data: 'https://www.chipsytok.bbzwinf.ch/profile?username=' + useAuthStore().username,
    dotsOptions: { color: '#6a1a4c', type: 'dots' },
    backgroundOptions: { color: '#ffffff' },
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
  const simulatedCorrectPassword = '123456';
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
  setTimeout(() => {
    openChangePassword.value = false;
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    passwordMessage.value = '';
  }, 1500);
}

const openAccountSettings = ref(false);
// Handle Account Settings Modal close
const handleAccountSettingsClose = () => {
  if (accountEmail.value || accountUsername.value) {
    if (confirm('Are you sure you want to discard changes?')) {
      openAccountSettings.value = false;
      accountEmail.value = '';
      accountUsername.value = '';
    }
  } else {
    openAccountSettings.value = false;
  }
};

const saveAccountSettings = () => {
  accountMessage.value = 'Account updated successfully!';
  accountError.value = false;
  setTimeout(() => {
    openAccountSettings.value = false;
    accountEmail.value = '';
    accountUsername.value = '';
  }, 1500);
};

const profileMessage = ref('');
const profileError = ref(false);
const editUsername = ref('');
const openEditProfile = ref(false);
const editBio = ref('');

// ==== Methode zum Speichern ====
function saveProfile() {
  const store = useAuthStore();
  if (!editUsername.value.trim()) {
    profileMessage.value = 'Username darf nicht leer sein.';
    profileError.value = true;
    return;
  }
  // Hier tatsächlich im Store updaten:
  store.username = editUsername.value.trim();
  store.user.profile.bio = editBio.value.trim();

  profileMessage.value = 'Profil aktualisiert!';
  profileError.value = false;
  // Modal nach kurzer Verzögerung schließen:
  setTimeout(() => {
    openEditProfile.value = false;
    profileMessage.value = '';
  }, 1500);
}

const openPrivacySettings = ref(false);

// ==== Methode zum Schließen (mit Abfrage) ====
// ==== Neue Reactive-Variablen für Edit-Modal ====
const store = useAuthStore();
// Zeigt den aktuellen Avatar, aus dem Store oder Fallback
const userAvatar = ref(
  store.user.profile.avatar || 'https://randomuser.me/api/portraits/men/3.jpg',
);


const editAvatarUrl = ref(userAvatar.value);

function onAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    editAvatarUrl.value = e.target.result; // Base64-String für Vorschau
  };
  reader.readAsDataURL(file);
}

// ==== Funktion: Speichern der Änderungen ====
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
  margin: 10px auto 0;
}

.post-thumb {
  position: relative;
  width: 100%;
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
