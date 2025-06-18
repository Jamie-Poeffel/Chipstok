<template>
    <transition name="slide-up">
        <div v-if="isOpen" ref="panelRef"
            class="fixed bottom-0 left-0 right-0 h-[85vh] bg-gray-900 bg-opacity-95 backdrop-blur-xl rounded-t-2xl z-50 flex flex-col touch-none"
            :style="{ transform: `translateY(${dragOffset}px)` }" @touchstart="startDrag" @mousedown="startDrag"
            @touchmove="handleDrag" @mousemove="handleDrag" @touchend="endDrag" @mouseup="endDrag"
            @mouseleave="endDrag">
            <!-- Drag handle -->
            <div class="w-9 h-1 bg-gray-500 rounded-full mx-auto my-2 cursor-grab active:cursor-grabbing" />

            <!-- Header -->
            <div class="flex justify-between items-center p-4 border-b border-gray-800">
                <h3 class="text-white font-bold">
                    Comments <span class="text-gray-400 text-sm ml-1">{{ totalComments }}</span>
                </h3>
                <button @click="closePanel" class="text-gray-400 hover:text-white">
                    <i class="fas fa-times" />
                </button>
            </div>

            <!-- Comments list -->
            <div ref="scrollContainer" class="flex-1 overflow-y-auto p-4" @scroll="handleScroll">
                <div v-for="comment in comments" :key="comment.id" class="flex gap-3 py-4 border-b border-gray-800">
                    <!-- Avatar -->
                    <div
                        class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-white font-bold">
                        {{ comment.user.name.charAt(0) }}
                    </div>

                    <!-- Content -->
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-white font-semibold text-sm">{{ comment.user.name }}</span>
                            <span class="text-gray-400 text-xs">{{ formatTime(comment.createdAt) }}</span>
                        </div>
                        <p class="text-white text-sm mb-2">{{ comment.text }}</p>
                        <div class="flex gap-4">
                            <button @click="toggleLike(comment)"
                                class="flex items-center gap-1 text-gray-400 hover:text-white text-xs"
                                :class="{ 'text-red-500': comment.isLiked }">
                                <i class="fas fa-heart" :class="{ 'animate-pulse': comment.likeAnimation }" />
                                <span>{{ comment.likes }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Loading indicator -->
                <div v-if="loading" class="text-center py-4 text-gray-400 text-sm">
                    <i class="fas fa-spinner fa-spin mr-2" /> Loading...
                </div>

                <!-- End of comments -->
                <div v-if="!hasMore && !loading" class="text-center py-4 text-gray-400 text-sm">
                    No more comments
                </div>
            </div>

            <!-- Comment input -->
            <div class="flex gap-3 p-4 border-t border-gray-800">
                <input v-model="newComment" placeholder="Add a comment..."
                    class="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    @keyup.enter="postComment" />
                <button @click="postComment" :disabled="!newComment.trim()"
                    class="bg-pink-500 text-white rounded-full px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition">
                    Post
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    videoId: {
        type: String,
        required: true
    },
    isOpen: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close'])

// Configuration
const LIMIT = 100

// State
const comments = ref([])
const newComment = ref('')
const loading = ref(false)
const hasMore = ref(true)
const offset = ref(0)
const scrollContainer = ref(null)
const panelRef = ref(null)

// Drag state
const isDragging = ref(false)
const startY = ref(0)
const dragOffset = ref(0)
const panelHeight = ref(0)

// Computed
const totalComments = computed(() => comments.value.length)

// API Functions (same as before)
const fetchComments = async () => {
    if (loading.value || !hasMore.value) return

    loading.value = true

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/posts/comment/${props.videoId}?offset=${offset.value}&limit=${LIMIT}`)
        const data = await response.json()

        if (data.length === 0) {
            hasMore.value = false
        } else {
            // Check if we got fewer comments than requested (means no more available)
            if (data.length < LIMIT) {
                hasMore.value = false
            }

            comments.value = [...comments.value, ...data]
            offset.value += data.length
        }
    } catch (error) {
        console.error('Error fetching comments:', error)
    } finally {
        loading.value = false
    }
}

const postComment = async () => {
    if (!newComment.value.trim()) return

    try {
        const response = await fetch(`/posts/comment/${props.videoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: newComment.value
            })
        })

        const comment = await response.json()
        comments.value.unshift({
            ...comment,
            likeAnimation: false
        })
        newComment.value = ''
    } catch (error) {
        console.error('Error posting comment:', error)
    }
}

const toggleLike = async (comment) => {
    try {
        // Optimistic UI update
        const wasLiked = comment.isLiked
        comment.isLiked = !wasLiked
        comment.likes += wasLiked ? -1 : 1
        comment.likeAnimation = true

        const response = await fetch(`/comments/${comment.id}/like`, {
            method: 'POST'
        })

        const updated = await response.json()

        // Update local state with actual values
        const index = comments.value.findIndex(c => c.id === comment.id)
        if (index !== -1) {
            comments.value[index] = {
                ...updated,
                likeAnimation: false
            }
        }

        setTimeout(() => {
            comment.likeAnimation = false
        }, 1000)
    } catch (error) {
        console.error('Error toggling like:', error)
        // Revert optimistic update on error
        comment.isLiked = !comment.isLiked
        comment.likes += comment.isLiked ? 1 : -1
        comment.likeAnimation = false
    }
}

// Helpers
const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleScroll = () => {
    if (!scrollContainer.value || loading.value || !hasMore.value) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchComments()
    }
}

// Drag implementation
const startDrag = (e) => {
    isDragging.value = true
    startY.value = e.clientY || e.touches[0].clientY
    panelHeight.value = panelRef.value.getBoundingClientRect().height
}

const handleDrag = (e) => {
    if (!isDragging.value) return

    const clientY = e.clientY || e.touches[0].clientY
    const deltaY = clientY - startY.value

    // Only allow dragging downward
    if (deltaY > 0) {
        dragOffset.value = deltaY
    }
}

const endDrag = () => {
    if (!isDragging.value) return

    isDragging.value = false

    // If dragged more than 30% of panel height, close it
    if (dragOffset.value > panelHeight.value * 0.3) {
        closePanel()
    } else {
        // Return to original position
        dragOffset.value = 0
    }
}

const closePanel = () => {
    emit('close')
    setTimeout(() => {
        if (!props.isOpen) {
            comments.value = []
            offset.value = 0
            hasMore.value = true
            dragOffset.value = 0
        }
    }, 300)
}

// Watchers
watch(() => props.isOpen, (open) => {
    if (open && comments.value.length === 0) {
        fetchComments()
    }

    // Reset position when opening
    if (open) {
        dragOffset.value = 0
    }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

/* Prevent text selection during drag */
div[dragging] {
    user-select: none;
    -webkit-user-select: none;
}
</style>