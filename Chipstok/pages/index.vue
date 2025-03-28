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
const username = ref('');

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

const loginCorrect = ref(false)

onMounted(async () => {
    const res = await fetch("http://localhost:8080/auth/auto", { credentials: 'include' });

    const usern = await res.json();
    username.value = usern.username;
    if (res.status == 200) {
        loginCorrect.value = true;
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isLoading.value) {
                        isLoading.value = true;
                        setTimeout(() => {
                            loadMore();
                            isLoading.value = false;
                        }, 500);
                    }
                });
            },
            { threshold: 0.4 }
        );
        if (lastItemRef.value) {
            observer.observe(lastItemRef.value);
        }
    } else {
        await navigateTo('/login');
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
        <transition name="fade-slide">
            <div v-if="loginCorrect"
                class="fixed top-12 w-28 h-12 bg-gray-800 rounded-full left-1/2 -translate-x-1/2 z-40 flex flex-row">
                <div class="relative left-[21%] -translate-x-1/2 rounded-full w-10 h-10 top-1/2 -translate-y-1/2 bg-gradient-to-b from-blue-500
                to-slate-400 flex  justify-center items-center">
                    <p class="text-white">K</p>
                </div>
                <div class="p-2 flex flex-col justify-center items-center">
                    <p class=" text-stone-400 text-xs font-semibold">Welcome</p>
                    <p class="text-stone-500 text-xs font-semibold">{{ username }}</p>
                </div>
            </div>
        </transition>

        <div v-for="(img, index) in imgs" :key="img._id" class="snap-start h-dvh max-w-[450px] mx-auto relative"
            :ref="index === imgs.length - 1 ? setLastItemRef : null">

            <div class="relative h-full w-full">
                <img :src="img.url" alt="Video" class="w-full h-full object-cover" />


                <div class="absolute bottom-24 left-3 text-white max-w-[75%] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                    <p class="font-semibold text-base mb-1">@{{ img.username }}</p>
                    <p class="text-sm leading-tight">{{ img.caption }}</p>
                </div>


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
