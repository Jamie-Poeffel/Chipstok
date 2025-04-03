<template>
    <div class="add-page">
        <div v-if="tempImage" class="preview-container">
            <img :src="tempImage" alt="Selected content" class="preview-image" />
            <div>
                <button @click="cancel">Cancel</button>
                <button>Post</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const tempImage = ref(null);
const router = useRouter();

// Redirect if no image is found
onMounted(() => {
    const storedImage = sessionStorage.getItem('tempUpload');
    if (storedImage) {
        tempImage.value = storedImage;
        sessionStorage.removeItem('tempUpload');
    } else {
        router.push('/');
    }
});

// Cancel function to redirect manually
const cancel = () => {
    router.push('/');
};
</script>

<style scoped>
.preview-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
}

.preview-image {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
}

button {
    padding: 10px 20px;
    border: none;
    background-color: #ff2d55;
    color: white;
    border-radius: 8px;
    cursor: pointer;
}

button:hover {
    background-color: #ff1a44;
}
</style>