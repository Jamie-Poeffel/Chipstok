<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { Plus, Heart, MessageCircle, Send } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useFetch } from '@/composables/useFetch';
import { useRoute } from 'vue-router';

const route = useRoute();

async function img() {
    const list = [];

    const postId = route.query.id;
    if (postId && postId !== "") {
        const { data } = await useFetch(`/posts/${postId}`, { credentials: 'include' });

        if (data && data.post._id) {
            list.push({
                _id: data.post._id,
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/posts/stream/${data.post._id}`,
                type: data.post.URL?.endsWith('.mp4') ? 'video' : 'image',
                username: data.username,
                profilePicture: `https://randomuser.me/portraits/men/${(124 % 100) + 1}.jpg`,
                caption: data.post.caption || 'Check out this awesome content! 🚀',
                likes: data.post.likeCount,
                comments: data.post.commentCount,
            });

            likesCountMap.set(data._id, data.likeCount);

            const { data: likeData } = await useFetch(`/posts/${data._id}/isLiked`, { credentials: 'include' });
            isLikedMap.set(data._id, likeData?.isLiked ?? false);
        }
    }

    const { data } = await useFetch('/posts?limit=4', { credentials: 'include' });

    if (data && data.message !== "no posts posted" && Array.isArray(data.sortedPosts)) {
        await Promise.all(data.sortedPosts.map(async (e) => {
            list.push({
                _id: e._id,
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/posts/stream/${e._id}`,
                type: e.URL?.endsWith('.mp4') ? 'video' : 'image',
                username: data.username,
                profilePicture: `https://randomuser.me/portraits/men/${(124 % 100) + 1}.jpg`,
                caption: e.caption || 'Check out this awesome content! 🚀',
                likes: e.likeCount,
                comments: e.commentCount,
            });

            likesCountMap.set(e._id, e.likeCount);

            const { data: likeData } = await useFetch(`/posts/${e._id}/isLiked`, { credentials: 'include' });
            isLikedMap.set(e._id, likeData?.isLiked ?? false);
        }));
    }

    return list;
}
const imgs = ref([]);

onMounted(async () => {
    imgs.value = (await img())
})

const showFull = ref(false);
const authStore = useAuthStore();


const showBanner = () => {
    loginCorrect.value = true;

    setTimeout(() => {
        showFull.value = true;
    }, 1500);

    setTimeout(() => {
        loginCorrect.value = false;
        showFull.value = false;
    }, 4000);
};
// Reactive flag to show the loader
const isLoading = ref(false);
const username = ref(authStore.username);

// Ref for the last element (set via a callback)
const lastItemRef = ref(null);
let observer = null;

// Function to load two new videos (simulate network delay)
const loadMore = async () => {
    const { data } = await useFetch('/posts?limit=2', { credentials: 'include' });
    let dt = data
    let ddata = data.sortedPosts;

    if (data.message !== "no posts posted") {
        ddata.forEach(async (e) => {
            imgs.value.push({
                _id: `${e._id}`,
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/posts/stream/${e._id}`,
                type: `${(e.URL).split('.')[(e.URL).split('.').length - 1] === "mp4" ? "video" : "image"}`,
                username: `${dt.username}`,
                profilePicture: `https://randomuser.me/portraits/men/${(124 % 100) + 1}.jpg`,
                caption: 'Check out this awesome content! 🚀',
                likes: `${e.likeCount}`,
                comments: `${e.commentCount}`,
            });

            likesCountMap.set(e._id, e.likeCount)
            const { data } = await useFetch(`/posts/${e._id}/isLiked`, { credentials: 'include' })
            isLikedMap.set(e._id, data.isLiked);
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
    if (authStore.isAuthenticated) {
        showBanner();
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isLoading.value) {
                        isLoading.value = true;
                        setTimeout(async () => {
                            await loadMore();
                            isLoading.value = false;
                        }, 1000);
                    }
                });
            },
            { threshold: 0.3 }
        );
        if (lastItemRef.value) {
            observer.observe(lastItemRef.value);
        }
    }
});

onUnmounted(() => {
    if (observer && lastItemRef.value) {
        observer.unobserve(lastItemRef.value);
    }
});


const toggleLike = async (postID) => {
    try {
        if (isLikedMap.get(postID)) {
            // Unlike
            await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/posts/${postID}/unlike`, { method: 'POST', credentials: 'include' })
            isLikedMap.set(postID, false)
            likesCountMap.set(postID, likesCountMap.get(postID) - 1)
        } else {
            // Like
            await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/posts/${postID}/like`, { method: 'POST', credentials: 'include' })
            isLikedMap.set(postID, true)
            likesCountMap.set(postID, likesCountMap.get(postID) + 1)
        }
    } catch (err) {
        console.error('Error toggling like:', err)
    }
}

const isLikedMap = reactive(new Map())
const likesCountMap = reactive(new Map());


async function shareVideoFile(videoId) {
    const shareData = {
        title: 'Shared Video',
        text: 'Here is the video!',
        url: `https://chipsytok.bbzwinf.ch/?id=${videoId}`
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            console.log('Shared successfully');
        } catch (err) {
            console.error('Error sharing:', err);
        }
    } else {
        alert('Sharing is not supported on this device.');
    }
}





</script>

<template>
    <div class="h-full overflow-y-scroll snap-y snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]">
        <transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 scale-0"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-500 ease-in"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-0">
            <div v-if="loginCorrect" class="fixed top-12 left-1/2 -translate-x-1/2 z-40 flex items-center bg-gray-800 rounded-full 
             w-12 h-12 transition-all duration-500 overflow-hidden" :class="{ 'w-28': showFull }">
                <div
                    class="absolut !w-[40px] !h-[40px] bg-gradient-to-b ml-1 from-blue-500 to-slate-400 rounded-full flex justify-center items-center">
                    <p class="text-white">{{ username[0].toUpperCase() }}</p>
                </div>

                <!-- Text Content (Hidden at Start) -->
                <div v-if="showFull" class="justify-center items-center ml-2 transition-opacity w-0 duration-500">
                    <p class="text-stone-400 text-xs font-semibold -translate-x-1 translate-y-3">Welcome</p><br />
                    <p class="text-stone-500 text-xs font-semibold -translate-x-1 -translate-y-3">{{ username }}</p>
                </div>
            </div>
        </transition>

        <div v-for="(img, index) in imgs" :key="img._id"
            class="snap-start h-full max-w-[450px] mx-auto relative flex-shrink-0"
            :ref="index === imgs.length - 2 ? setLastItemRef : null">
            <div class="relative h-full w-full">
                <template v-if="img.type === 'image'">
                    <img :src="img.url" :alt="'Image posted by ' + img.username" class="w-full h-full object-cover"
                        loading="lazy" />
                </template>
                <template v-else-if="img.type === 'video'">
                    <video :src="img.url" :aria-label="'Video posted by ' + img.username"
                        class="w-full h-full object-cover" autoplay muted playsinline preload="auto"></video>
                </template>

                <div class="absolute bottom-10 left-3 text-white max-w-[75%] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                    <p class="font-semibold text-base mb-1">@{{ img.username }}</p>
                    <p class="text-sm leading-tight">{{ img.caption }}</p>
                </div>

                <div class="absolute right-3 bottom-10 flex flex-col items-center justify-center gap-5">
                    <div class="mb-2 flex flex-col gap-5 justify-center items-center">
                        <div class="flex flex-col justify-center items-center">
                            <img :src="img.profilePicture" :alt="'Profile of ' + img.username"
                                class="w-12 h-12 rounded-full object-cover hover:cursor-pointer active:scale-90"
                                loading="lazy" />
                            <button aria-label="Follow user"
                                class="flex flex-col items-center w-4 h-4 -translate-y-1 text-white text-2xl bg-[#ff2d55]/90 rounded-full hover:cursor-pointer active:scale-90">
                                <Plus />
                            </button>
                        </div>
                        <button aria-label="Like post"
                            class="flex flex-col items-center gap-1 text-white text-2xl hover:cursor-pointer active:scale-90"
                            @click="toggleLike(img._id)">
                            <Heart :fill="isLikedMap.get(img._id) ? 'red' : 'transparent'"
                                :class="isLikedMap.get(img._id) ? 'text-[#ff0000]' : 'text-white'" />
                            <span class="text-xs font-medium">{{ likesCountMap.get(img._id) }}</span>
                        </button>
                        <button aria-label="Comment on post"
                            class="flex flex-col items-center gap-1 text-white text-2xl hover:cursor-pointer active:scale-90">
                            <MessageCircle /><span class="text-xs font-medium">{{ img.comments }}</span>
                        </button>
                        <button @click="shareVideoFile(img._id, `Video_von_${img.username}.mp4`)"
                            aria-label="Share post"
                            class="flex flex-col items-center gap-1 text-white text-2xl hover:cursor-pointer active:scale-90">
                            <Send />
                        </button>
                    </div>
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
    background-color: #fff;
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
