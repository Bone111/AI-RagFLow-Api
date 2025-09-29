<!-- 默认消息列表页 -->
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { chatCompletionWithKnowledge } from '@/api/knowledge';
// import { useSessionStore } from '@/stores/modules/session';
import robotAvatar from '@/assets/images/jiqiren.jpeg';
import FilesSelect from '@/components/FilesSelect/index.vue';
import ModelSelect from '@/components/ModelSelect/index.vue';
import WelecomeText from '@/components/WelecomeText/index.vue';
// import { useUserStore } from '@/stores';
import { useChatStore } from '@/stores/modules/chat'; // 引入
import { useFilesStore } from '@/stores/modules/files';

// const userStore = useUserStore();
// const sessionStore = useSessionStore();
// const filesStore = useFilesStore(); // 移除未使用的filesStore
const chatStore = useChatStore();

const senderValue = ref('');
const senderRef = ref();
const isLoading = ref(false);
const chatMessagesRef = ref<HTMLElement | null>(null);

async function handleSend() {
  const question = senderValue.value.trim();
  if (!question || !chatStore.currentKbChatId) {
    if (!chatStore.currentKbChatId)
      ElMessage.warning('请先选择知识库');
    return;
  }

  senderValue.value = '';
  chatStore.addUserMessage(question);
  isLoading.value = true;
  chatStore.addAssistantMessage('', true, {});

  try {
    const response = await chatCompletionWithKnowledge(
      chatStore.currentKbChatId,
      question,
      chatStore.currentKbSessionId,
    );
    if (!response.ok)
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    if (!response.body)
      throw new Error('响应体为空');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let assistantContent = '';
    let extra: Record<string, any> = {};
    let isStreaming = true;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        // 读取结束，确保最后内容渲染
        chatStore.updateLastAssistantMessage(assistantContent, false, extra);
        console.log('[流式] 读取结束 done=true', { assistantContent });
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const dataStr = line.substring(5).trim();
          if (dataStr === '[DONE]') {
            isStreaming = false;
            chatStore.updateLastAssistantMessage(assistantContent, isStreaming, extra);
            console.log('[流式] 收到 [DONE]', { assistantContent });
            continue; // 不 break，继续处理后续数据
          }
          try {
            const jsonData = JSON.parse(dataStr);
            if (jsonData.code === 0 && jsonData.data) {
              if (jsonData.data.answer) {
                const cleanAnswer = jsonData.data.answer.replace(/<think>|<\/think>/g, '');
                let delta = '';
                if (!assistantContent || cleanAnswer.startsWith(assistantContent)) {
                  delta = cleanAnswer.substring(assistantContent.length);
                  assistantContent = cleanAnswer;
                }
                else {
                  delta = cleanAnswer;
                  assistantContent += cleanAnswer;
                }
                console.log('[流式answer]', { cleanAnswer, assistantContent, delta });
              }
              extra = { ...extra, ...jsonData.data };
              chatStore.updateLastAssistantMessage(assistantContent, isStreaming, extra);
            }
          }
          catch {
            // 忽略解析失败
          }
        }
      }
    }
  }
  catch {
    chatStore.updateLastAssistantMessage('抱歉，出错了，请稍后再试。', false, {});
  }
  finally {
    isLoading.value = false;
  }
}

// 监听知识库选择
watch(() => chatStore.currentKbChatId, (newChatId) => {
  if (newChatId) {
    // 可以在这里显示欢迎语
    // 例如：ElMessage.info(`已进入知识库：${chatStore.selectedKbName}`);
  }
});

watch(
  () => chatStore.chatMessages.length,
  async () => {
    await nextTick();
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
    }
  },
);
</script>

<template>
  <div class="chat-defaul-wrap">
    <!-- 聊天消息列表 -->
    <div v-if="chatStore.chatMessages.length > 0" ref="chatMessagesRef" class="chat-messages">
      <div v-for="message in chatStore.chatMessages" :key="message.id" class="message-row" :class="`role-${message.role}`">
        <div class="avatar">
          <img v-if="message.role === 'user'" src="https://ai.wo.cn/assets/tongtong-D1k72v43.png" alt="用户头像">
          <img v-else :src="robotAvatar" alt="AI头像">
        </div>
        <div class="message-content">
          <div class="message-text" :class="{ loading: isLoading && message === chatStore.chatMessages[chatStore.chatMessages.length - 1] }">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
    <WelecomeText v-else />
    <Sender
      ref="senderRef"
      v-model="senderValue"
      class="chat-defaul-sender"
      :auto-size="{
        maxRows: 9,
        minRows: 3,
      }"
      variant="updown"
      clearable
      allow-speech
      @submit="handleSend"
    >
      <template #header>
        <div class="sender-header">
          <div class="search-btn-group">
            <button class="search-btn">
              <el-icon><i class="ri-global-line" /></el-icon>
              联网搜索
            </button>
            <button class="search-btn">
              <el-icon><i class="ri-lightbulb-line" /></el-icon>
              知识库搜索
            </button>
          </div>
        </div>
      </template>
      <template #prefix>
        <div class="flex-1 flex items-center gap-8px flex-none w-fit overflow-hidden">
          <FilesSelect />
          <ModelSelect />
        </div>
      </template>
    </Sender>
  </div>
</template>

<style scoped lang="scss">
.chat-defaul-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: 100vh; // 占满视口高度
  min-height: 450px;
  margin: 0 auto;
  margin-left: 180px;
  .chat-messages {
    display: flex;
    flex: 1 1 0;
    flex-grow: 1;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    padding: 20px;
    overflow-y: auto;
    .message-row {
      display: flex;
      gap: 12px;
      padding: 0 12px;
      .avatar {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .message-content {
        max-width: 80%;
        .message-text {
          padding: 12px 16px;
          font-size: 15px;
          line-height: 1.5;
          border-radius: 12px;
        }
      }
      &.role-user {
        flex-direction: row-reverse;
        .message-content .message-text {
          color: white;
          background-color: #e9435a;
          border-radius: 12px 2px 12px 12px;
        }
      }
      &.role-assistant {
        .message-content .message-text {
          color: #333333;
          background-color: #f1f2f6;
          border-radius: 2px 12px 12px;
        }
      }
    }
  }
  .chat-defaul-sender {
    width: 100%;
    padding: 0 !important;
    margin-top: 0;
    margin-bottom: 88px;
    background: linear-gradient(90deg, #ffffff 60%, #fff0f6 100%) !important;
    border: 1px solid #e9435a !important;
    border-radius: 24px !important;
    box-shadow: 0 4px 24px 0 rgb(233 67 90 / 4%);
    .el-textarea__inner, textarea {
      min-height: 80px;
      padding: 32px 32px 0 !important;
      font-size: 20px;
      color: #888888;
      resize: none;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }
    .el-sender-footer, .el-sender-actions {
      display: flex;
      gap: 18px;
      align-items: center;
      justify-content: flex-end;
      padding: 0 32px 24px;
    }
    .el-sender-actions .el-icon, .el-sender-actions svg {
      margin-right: 8px;
      font-size: 28px;
      color: #222222;
      cursor: pointer;
      transition: color 0.2s;
      &:hover {
        color: #e9435a;
      }
    }
    .el-sender-actions .el-button, .el-sender-actions .el-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      min-width: 48px;
      height: 48px;
      min-height: 48px;
      margin-left: 8px;
      font-size: 28px;
      color: #ffffff;
      background: #e9435a;
      border: none;
      border-radius: 50%;
      box-shadow: 0 2px 8px 0 rgb(233 67 90 / 8%);
      transition: background 0.2s;
      &:hover {
        background: #d81b3a;
      }
    }
    .el-sender-header {
      padding: 0 32px !important;
    }
    .el-sender-footer {
      border: none !important;
      box-shadow: none !important;
    }
    .sender-header {
      display: flex;
      align-items: flex-start;
      padding: 0 32px !important;
      margin-top: 0;
      margin-bottom: 0;
      .search-btn-group {
        display: flex;
        gap: 18px;
        margin-top: 0;
      }
      .search-btn {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 10px 22px;
        font-size: 14px;
        font-weight: 600;
        color: #222222;
        cursor: pointer;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        box-shadow: none;
        transition: background 0.2s, border 0.2s;
        &:hover {
          background: #f7f7f7;
          border-color: #e9435a;
        }
        .el-icon, svg {
          font-size: 16px;
          color: #222222;
        }
      }
    }
  }
}
.message-text {
  &.loading {
    position: relative;
    &::after {
      display: inline-block;
      width: 4px;
      height: 4px;
      margin-left: 4px;
      content: '';
      background-color: currentColor;
      border-radius: 50%;
      animation: dotPulse 1.5s infinite;
    }
  }
}

@keyframes dotPulse {
  0%, 100% {
    box-shadow: 4px 0 0 -2px currentColor, 8px 0 0 -2px currentColor;
  }
  50% {
    box-shadow: 4px 0 0 currentColor, 8px 0 0 currentColor;
  }
}
</style>
