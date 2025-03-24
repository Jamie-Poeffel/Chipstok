<template>
    <div class="h-screen overflow-y-scroll snap-y snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]">
        <!-- Video Pages --> <!-- Page Content -->
        <div v-for="img in imgs" :key="`${img.id}`" class=" snap-start h-screen max-w-[450px] mx-auto relative">
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
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Heart, MessageCircle, RefreshCcw, Send, Plus } from 'lucide-vue-next';

const imgs = ref([
    {
        _id: 1, url: `https://placehold.co/1080x1920?text=Video1`,
        username: 'user1',
        profilePicture: `https://randomuser.me/portraits/men/3.jpg`,
        caption: 'Check out this awesome content! 🚀',
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200)
    },
    {
        _id: 2, url: `https://placehold.co/1080x1920?text=Video2`,
        username: 'user2',
        profilePicture: `https://randomuser.me/portraits/men/4.jpg`,
        caption: 'Check out this awesome content! 🚀',
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200)
    }
]);

</script>

<style>
::-webkit-scrollbar {
    display: none;
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