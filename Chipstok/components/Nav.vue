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
