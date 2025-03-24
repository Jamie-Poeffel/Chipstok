<template>
    <div class="bottom-nav">
        <router-link to="/" class="nav-item exact-active-class='active'">
            <HomeIcon />
        </router-link>

        <div class="nav-item plus">
            <label for="file-upload">
                <PlusCircleIcon />
                <input id="file-upload" type="file" accept="image/*" class="file-input" @change="handleFileUpload" />
            </label>
        </div>

        <router-link to="/profile" class="nav-item">
            <UserIcon />
        </router-link>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { HomeIcon, PlusCircleIcon, UserIcon } from 'lucide-vue-next';

const router = useRouter();

const handleFileUpload = (event) => {
    try {
        sessionStorage.removeItem('tempUpload');
    } catch (error) {
        console.log(error);
    }
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        sessionStorage.setItem('tempUpload', e.target.result);
        router.push('/add');
    };
    reader.readAsDataURL(file);

    event.target.value = '';
};
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

.file-input {
    display: none;
    width: 50px;
    height: 50px;
}

.file-input:active {
    transform: scale(0.9);
}
</style>