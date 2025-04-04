<template>
    <div class="profile-container">
        <div class="profile-header">
            <div class="header-top">
                <div class="flex flex-col">
                    <div class="flex flex-row">
                        <div class="avatar-wrapper">
                            <img class="avatar" src="https://randomuser.me/api/portraits/men/3.jpg" alt="avatar" />
                        </div>
                        <div class="user-meta">
                            <p class="handle">@{{ username || "error" }}</p>
                            <p class="bio">{{ useAuthStore().user.profile.bio === '' ? '\n' :
                                useAuthStore().user.profile.bio }}
                            </p>
                            <div class="stats">
                                <div><strong>{{ (useAuthStore().user.profile.followers > 9999 ?
                                    (useAuthStore().user.profile.followers / 1000).toFixed(0) + 'k' :
                                    useAuthStore().user.profile.followers)
                                        }} Following</strong></div>
                                <div><strong>{{ (useAuthStore().user.profile.following > 9999 ?
                                    (useAuthStore().user.profile.following / 1000).toFixed(0) + 'k' :
                                    useAuthStore().user.profile.following) }} Followers</strong></div>
                                <div><strong>{{ (useAuthStore().user.profile.likeCount > 9999 ?
                                    (useAuthStore().user.profile.likeCount / 1000).toFixed(0) + 'k' :
                                    useAuthStore().user.profile.likeCount) }} Likes</strong></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 w-full h-[24px] mt-3">
                        <button
                            class="flex-1 py-1 px-3 rounded-md text-sm font-medium text-gray-700 border hover:bg-gray-300 transition-colors duration-200 ease-in-out">
                            Profil bearbeiten
                        </button>
                        <button @click="share()"
                            class="flex-1 py-1 px-3 rounded-md text-sm font-medium text-gray-700 border hover:bg-gray-300 transition-colors duration-200 ease-in-out">
                            Profil Teilen
                        </button>
                        <button
                            class="h-[30px] w-[30px] flex justify-center items-center rounded-md text-sm font-medium text-gray-700 border hover:bg-gray-300 transition-colors duration-200 ease-in-out">
                            <Settings class="w-4 h-4" @click="openSettings = true" />
                        </button>

                    </div>

                </div>
            </div>
        </div>

        <div class="tabs">
            <span class="tab" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Posts</span>
            <span class="tab" :class="{ active: activeTab === 'followers' }"
                @click="activeTab = 'followers'">Saved</span>
            <span class="tab" :class="{ active: activeTab === 'following' }"
                @click="activeTab = 'following'">Tagged</span>
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
import { ref, watchEffect } from 'vue'
import { Settings } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import QRCodeStyling from 'qr-code-styling';


const activeTab = ref('posts')
const openSettings = ref(false)
const username = ref(useAuthStore().username);
const Share = ref(false);
const qrCodeContainer = ref(null);
const qrCode = ref(null);

function logout() {
    alert('Logged out!')
    openSettings.value = false
}


async function share() {
    Share.value = true
}

const initQRCode = () => {
    qrCode.value = new QRCodeStyling({
        "type": "canvas", "shape": "square", "width": 300, "height": 300, "data": "Hello World", "margin": 16, "qrOptions": { "typeNumber": "0", "mode": "Byte", "errorCorrectionLevel": "H" }, "imageOptions": { "saveAsBlob": true, "hideBackgroundDots": true, "imageSize": 0.4, "margin": 0 }, "dotsOptions": { "type": "dots", "color": "#6a1a4c", "roundSize": true, "gradient": { "type": "linear", "rotation": 0.7853981633974483, "colorStops": [{ "offset": 0, "color": "#405de6" }, { "offset": 1, "color": "#190110" }] } }, "backgroundOptions": { "round": 0, "color": "#ffffff", "gradient": { "type": "linear", "rotation": 0.7853981633974483, "colorStops": [{ "offset": 0, "color": "#ffffff" }, { "offset": 1, "color": "#ffffff" }] } }, "image": null, "dotsOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#6a1a4c", "color2": "#6a1a4c", "rotation": "0" } }, "cornersSquareOptions": { "type": "extra-rounded", "color": "#000000", "gradient": { "type": "linear", "rotation": 0.7853981633974483, "colorStops": [{ "offset": 0, "color": "#405def" }, { "offset": 1, "color": "#000000" }] } }, "cornersSquareOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#000000", "color2": "#000000", "rotation": "0" } }, "cornersDotOptions": { "type": "dot", "color": "#000000", "gradient": { "type": "linear", "rotation": 0.7853981633974483, "colorStops": [{ "offset": 0, "color": "#405de6" }, { "offset": 1, "color": "#000000" }] } }, "cornersDotOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#000000", "color2": "#000000", "rotation": "0" } }, "backgroundOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#ffffff", "color2": "#ffffff", "rotation": "0" } }
    });
};
watchEffect(() => {
    if (Share.value && qrCodeContainer.value) {
        initQRCode();
        qrCode.value.append(qrCodeContainer.value);
    }
});
</script>

<style scoped>
.profile-container {
    padding: 20px;
    max-width: 700px;
    margin: 0 auto;
    font-family: 'Segoe UI', sans-serif;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
}

.avatar-wrapper {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ff2d55;
}

.handle {
    font-size: 16px;
    color: #777;
    margin-top: 8px;
    transform: translateY(5px);
}

.user-meta {
    flex-grow: 1;
    margin-left: 20px;
    margin-top: -10px;
}

.username {
    font-size: 20px;
    margin: 0;
    color: #111;
    text-decoration: wavy;
    transform: translateY(12px);
}

.bio {
    font-size: 14px;
    color: #444;
    margin-top: 6px;
}

.stats {
    display: flex;
    gap: 20px;
    font-size: 14px;
    margin-top: 8px;
}

.stats div {
    text-align: center;
}

.stats strong {
    display: block;
    font-size: 16px;
    color: #111;
}

.tabs {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.tab {
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    position: relative;
    transition: color 0.3s ease;
    color: #000;
}

.tab:hover {
    color: #ff2d55;
}

.tab.active::after,
.tab:hover::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #ff2d55;
}

.posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-top: 20px;
}

.post-thumb {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #eee;
    border-radius: 4px;
    transition: transform 0.2s;
}

.post-thumb:hover {
    transform: scale(1.03);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    width: 300px;
}

.modal h3 {
    margin-top: 0;
    font-size: 18px;
    text-align: center;
}

.settings-list {
    list-style: none;
    padding: 0;
    margin-top: 10px;
    text-align: center;
}

.settings-list li {
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    font-size: 14px;
}

.settings-list .cancel-btn {
    background-color: #ff2d55;
    color: white;
    border-radius: 8px;
    margin-top: 10px;
    font-weight: 600;
    border: none;
}

.ig-qr-container {
    background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
    padding: 8px;
    border-radius: 24px;
    display: inline-block;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ig-qr-code {
    background: white;
    padding: 12px;
    border-radius: 16px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.qr-image {
    width: 200px;
    height: 200px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
