<!-- 欢迎提示词 -->
<script setup lang="ts">
import { Typewriter } from 'vue-element-plus-x';
import aiZhizhiImg from '@/assets/images/AI小智.png';
// import { useUserStore } from '@/stores';
</script>

<template>
  <div class="welcome-wrap">
    <div class="welcome-logo-wrap">
      <div class="welcome-logo-bg" />
      <img :src="aiZhizhiImg" alt="AI小智" class="welcome-logo">
    </div>
    <div class="welcome-title">
      <Typewriter
        content="Hi! 我是<span class='highlight'>AI小智</span>，你的专属<span class='highlight'>智能助手</span>"
        :typing="{ step: 2, interval: 45 }"
        :is-fog="{ bgColor: '#fff' }"
      />
    </div>
    <div class="welcome-desc">
      AI小智可为您提供高效的知识管理服务，提供多模式、多平台知识的导入、处理与问答支持。
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcome-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 0;
}
.welcome-logo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 22px;
  margin-top: 0;
  object-fit: contain;
  background: #fff;
  box-shadow: none;
  position: relative;
  z-index: 1;
}
.welcome-logo-bg {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 148px;
  height: 148px;
  border-radius: 50%;
  background: transparent;
  z-index: 0;
}
.welcome-logo-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 148px;
  height: 148px;
  margin-bottom: 18px;
}
.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 14px;
  text-align: center;
  line-height: 1.3;
  padding: 0 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.welcome-title :deep(.highlight) {
  color: #e9435a;
}
.welcome-desc {
  font-size: 1.1rem;
  color: #888;
  margin-bottom: 0;
  text-align: center;
  max-width: 100vw;
  line-height: 1.9;
  padding: 0 16px;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}
:deep(.typer-container) {
  overflow: initial;
  display: inline-block;
}
</style>
