<script setup lang="ts">
import { useRoute } from 'vue-router';
import ChatDefaul from './layouts/chatDefaul/index.vue';
import ChatWithId from './layouts/chatWithId/index.vue';

const route = useRoute();
const hasChatId = computed(() => !!route.params.id);
</script>

<template>
  <div class="chat-wrap">
    <ChatWithId v-if="hasChatId" :key="route.params.id as string" />
    <ChatDefaul v-else />
  </div>
</template>

<style scoped>
.chat-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
