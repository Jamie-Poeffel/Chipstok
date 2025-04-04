<script setup>
import { useRoute } from 'vue-router'
import { useFetch } from '@/composables/useFetch'

const route = useRoute()
const { redirect_uri, client_id } = route.query

const { res, data } = await useFetch('/auth/auto', { credentials: 'include' });

if (res.ok) {
    window.location.href = `${redirect_uri}?code=${data.token}&state=complete`;
} else {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/login?client_id=${client_id}&redirect_uri=${redirect_uri}&state=authorize`;
}

</script>