<template>
    <div class="image-container">
        <div v-for="img in imgs" :key="img.id" class="image-wrapper">
            <img :src="img.url" alt="Image" />
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';

const imgs = ref([
    {
        id: 1,
        url: 'https://placehold.co/1080x1920',
        username: 'Hello World',
        profilePicture: `https://randomuser.me/api/portraits/men/${1}`,
    },
    {
        id: 2,
        url: 'https://placehold.co/1080x1920',
        username: 'Second Video',
        profilePicture: `https://randomuser.me/api/portraits/men/${2}`,
    },
]);
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
</style>
<style scoped>
/* Container for the image list */
.image-container {
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    -ms-overflow-style: none;
    /* Hide scrollbar in Internet Explorer */
    scrollbar-width: none;
    /* Hide scrollbar in Firefox */
}

/* Hide scrollbar in Chrome, Safari, Edge */
.image-container::-webkit-scrollbar {
    display: none;
}

/* Each image wrapper to fit the screen and snap correctly */
.image-wrapper {
    scroll-snap-align: start;
    top: 0px;
    height: calc(100vh - 44px);
    /* Adjust for bottom nav height */
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Images to fit the container while keeping aspect ratio */
.image-wrapper img {
    width: 1080px;
    height: 100%;
    object-fit: cover;
}
</style>