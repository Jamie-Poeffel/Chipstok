<template>
    <div class="bottom-nav">
        <router-link to="/" class="nav-item">
            <HomeIcon />
        </router-link>

        <!-- Use label to make the image input appear as a button/icon -->
        <label for="file-upload" class="nav-item plus">
            <PlusCircleIcon />
            <!-- Hidden file input -->
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
.no-appearance {
    appearance: none;
    border: none;
    background: none;
}

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
    transition: transform 0.1s ease, color 0.1s ease;
}

.nav-item.plus {
    font-size: 30px;
    color: #ff2d55;
    /* TikTok-style red */
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.nav-item svg {
    display: block;
    margin: 0 auto;
}

.nav-item:hover {
    color: #ff2d55;
}

.nav-item.active {
    color: #ff2d55;
}

.nav-item:active {
    transform: scale(0.9);
    /* Shrink effect on click */
}

label[for="file-upload"]:hover {
    cursor: pointer;
}

/* Hide the file input but still keep it clickable */
.file-input {
    display: none;
    width: 50px;
    /* Adjust the size as needed */
    height: 50px;
    /* Adjust the size as needed */
}

.file-input:active {
    transform: scale(0.9);
    /* Shrink effect for file input */
}
</style>