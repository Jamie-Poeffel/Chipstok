<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Plus, Heart, MessageCircle, Send, RefreshCcw } from 'lucide-vue-next';

const imgs = ref([
    {
        _id: 1,
        url: `https://placehold.co/1080x1920?text=Video1`,
        username: 'user1',
        profilePicture: `https://randomuser.me/portraits/men/3.jpg`,
        caption: 'Check out this awesome content! 🚀',
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200),
    },
    {
        _id: 2,
        url: `https://placehold.co/1080x1920?text=Video2`,
        username: 'user2',
        profilePicture: `https://randomuser.me/portraits/men/4.jpg`,
        caption: 'Check out this awesome content! 🚀',
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200),
    },
]);

// Reactive flag to show the loader
const isLoading = ref(false);

// Ref for the last element (set via a callback)
const lastItemRef = ref(null);
let observer = null;

// Function to load two new videos (simulate network delay)
const loadMore = () => {
    const last = imgs.value[imgs.value.length - 1];
    const baseId = last._id;
    for (let i = 1; i <= 2; i++) {
        const newId = baseId + i;
        imgs.value.push({
            _id: newId,
            url: `https://placehold.co/1080x1920?text=Video${newId}`,
            username: `user${newId}`,
            profilePicture: `https://randomuser.me/portraits/men/${(newId % 100) + 1}.jpg`,
            caption: 'Check out this awesome content! 🚀',
            likes: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 500),
            shares: Math.floor(Math.random() * 200),
        });
    }
};

// Callback ref to assign the last element for observation
const setLastItemRef = (el) => {
    if (lastItemRef.value) {
        observer && observer.unobserve(lastItemRef.value);
    }
    lastItemRef.value = el;
    if (el) {
        observer && observer.observe(el);
    }
};

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isLoading.value) {
                    isLoading.value = true;
                    // TODO: API CALL for Post
                    setTimeout(() => {
                        loadMore();
                        isLoading.value = false;
                    }, 4000);
                }
            });
        },
        { threshold: 0.4 }
    );
    if (lastItemRef.value) {
        observer.observe(lastItemRef.value);
    }
});

onUnmounted(() => {
    if (observer && lastItemRef.value) {
        observer.unobserve(lastItemRef.value);
    }
});
</script>

<template>
    <div class="h-screen overflow-y-scroll snap-y snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]">
        <!-- Video Pages -->
        <div v-for="(img, index) in imgs" :key="img._id" class="snap-start h-screen max-w-[450px] mx-auto relative"
            :ref="index === imgs.length - 1 ? setLastItemRef : null">
            <!-- Video Content -->
            <div class="relative h-full w-full">
                <img :src="img.url" alt="Video" class="w-full h-full object-cover" />

                <!-- Text Overlay -->
                <div class="absolute bottom-24 left-3 text-white max-w-[75%] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                    <p class="font-semibold text-base mb-1">@{{ img.username }}</p>
                    <p class="text-sm leading-tight">{{ img.caption }}</p>
                </div>

                <!-- Right Actions -->
                <div class="absolute right-3 bottom-24 flex flex-col items-center justify-center gap-5">
                    <div class="mb-2 flex flex-col gap-5 justify-center items-center">
                        <div class="flex flex-col justify-center items-center">
                            <img :src="img.profilePicture" alt="Profile"
                                class="w-12 h-12 rounded-full object-cover translate-y-2 hover:cursor-pointer active:scale-90" />
                            <div
                                class="flex flex-col items-center w-4 h-4 text-white text-2xl bg-[#ff2d55]/90 rounded-full z-50 hover:cursor-pointer active:scale-90">
                                <Plus class="z-50" />
                            </div>
                        </div>
                        <button
                            class="flex flex-col items-center gap-1 text-white text-2xl hover:cursor-pointer active:scale-90">
                            <Heart /><span class="text-xs font-medium">{{ img.likes }}</span>
                        </button>
                        <button
                            class="flex flex-col items-center gap-1 text-white text-2xl hover:cursor-pointer active:scale-90">
                            <MessageCircle /><span class="text-xs font-medium">{{ img.comments }}</span>
                        </button>
                        <button
                            class="flex flex-col items-center gap-1 text-white text-2xl hover:cursor-pointer active:scale-90">
                            <Send />
                        </button>
                        <button
                            class="flex flex-col items-center gap-1 text-white text-2xl hover:cursor-pointer active:scale-90">
                            <RefreshCcw /><span class="text-xs font-medium">{{ img.shares }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loader Element: Fixed position while loading -->
        <div v-if="isLoading" class="loader-wrapper mb-8">
            <div class="loader">
                <span></span><span></span><span></span>
            </div>
        </div>
    </div>
</template>

<style>
::-webkit-scrollbar {
    display: none;
}

/* Advanced horizontal dot loader */
.loader {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
}

.loader span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #000;
    border-radius: 50%;
    animation: bounce 1.2s infinite ease-in-out;
}

.loader span:nth-child(1) {
    animation-delay: -0.32s;
}

.loader span:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes bounce {

    0%,
    80%,
    100% {
        transform: scale(0);
    }

    40% {
        transform: scale(1);
    }
}

/* Loader wrapper: fixed at bottom center while loading */
.loader-wrapper {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}

.video-container {
    scrollbar-width: none;
}

@media (min-aspect-ratio: 9/16) {
    .video-wrapper {
        width: calc(100vh * 9 / 16);
    }
}
</style>
