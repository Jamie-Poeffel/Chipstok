<template>
    <div class="bottom-nav">
        <router-link to="/" class="nav-item">
            <HomeIcon />
        </router-link>

        <label for="file-upload" class="nav-item plus">
            <PlusCircleIcon />
            <input id="file-upload" type="file" class="file-input" />
        </label>

        <router-link to="/profile" class="nav-item">
            <UserIcon />
        </router-link>

    </div>
</template>

<script setup>
import { HomeIcon, PlusCircleIcon, UserIcon } from 'lucide-vue-next'
</script>

<style scoped>
.bottom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 10px 20px;
    border-top: 1px solid #ddd;
    z-index: 1000;
}

.nav-item {
    font-size: 24px;
    color: #333;
    text-align: center;
    flex-grow: 1;
    position: relative;
    transition: transform 0.1s ease, color 0.1s ease;
}

.nav-item::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 50px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    transition: transform 0.2s ease;
    z-index: 0;
}

.nav-item:hover::before {
    transform: translate(-50%, -50%) scale(0.825);
}

.nav-item svg {
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.nav-item:hover {
    color: #ff2d55;
}

.nav-item.active {
    color: #ff2d55;
}

.nav-item:active {
    transform: scale(0.9);
}

label[for="file-upload"]:hover {
    cursor: pointer;
}

.file-input {
    display: none;
    width: 50px;
    height: 50px;
}

.file-input:active {
    transform: scale(0.9);
}
</style>
