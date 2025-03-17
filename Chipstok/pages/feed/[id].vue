<template>
    {{ id }}
</template>

<script setup>
const route = useRoute()

const id = ref(route.params.id);
</script>