<template>
    <div class="profile-container">
      <div class="profile-header">
        <div class="header-top">
          <div class="avatar-wrapper">
            <img class="avatar" src="https://randomuser.me/api/portraits/men/3.jpg" alt="avatar" />
            <p class="handle">@johndoe</p>
          </div>
          <div class="user-meta">
            <h2 class="username">John Doe</h2>
            <div class="stats">
              <div><strong>120 Following</strong></div>
              <div><strong>15K Followers</strong></div>
              <div><strong>210K Likes</strong></div>
            </div>
            <p class="bio">Creative Developer | Storyteller | Coffee Lover ☕</p>
            <button class="edit-btn">Profil bearbeiten</button>
          </div>
          <div class="settings-icon" @click="openSettings = true">
            ⚙️
          </div>
        </div>
  
        <div class="tabs">
          <span class="tab" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Posts</span>
          <span class="tab" :class="{ active: activeTab === 'followers' }" @click="activeTab = 'followers'">Saved</span>
          <span class="tab" :class="{ active: activeTab === 'following' }" @click="activeTab = 'following'">Tagged</span>
        </div>
      </div>
  
      <div class="posts-grid">
        <div v-for="n in 9" :key="n" class="post-thumb"></div>
      </div>
  
      <div v-if="openSettings" class="modal-overlay" @click.self="openSettings = false">
        <div class="modal">
          <h3>Settings</h3>
          <ul class="settings-list">
            <li>Change Password</li>
            <li>QR Code / Share</li>
            <li>Settings and Privacy</li>
            <li @click="logout">Log Out</li>
            <li class="cancel-btn" @click="openSettings = false">Cancel</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const activeTab = ref('posts')
  const openSettings = ref(false)
  
  function logout() {
    alert('Logged out!')
    openSettings.value = false
  }
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
    font-size: 14px;
    color: #777;
    margin-top: 8px;
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
  
  .edit-btn {
    margin-top: 10px;
    background-color: transparent;
    color: #ff2d55;
    border: 1px solid #ff2d55;
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .edit-btn:hover {
    background-color: #ff2d55;
    color: #fff;
  }
  
  .settings-icon {
    font-size: 24px;
    cursor: pointer;
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
  </style>
