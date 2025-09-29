import type { ChatMessageVo } from '@/api/chat/types';
import { defineStore } from 'pinia';
// import { getChatList } from '@/api';
// import { useUserStore } from './user';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id: string; // for key
  isStreaming?: boolean;
  extra?: Record<string, any>;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    // 当前选中的知识库ID
    selectedKbId: '',
    // 当前选中的知识库名称
    selectedKbName: '',
    // 当前知识库对应的chatId
    currentKbChatId: '',
    // 当前知识库对应的sessionId
    currentKbSessionId: '',
    // 聊天消息列表
    chatMessages: [] as ChatMessage[],
  }),
  actions: {
    // 设置当前知识库会话
    setSelectedKbChat(payload: { kbId: string; kbName: string; chatId: string; sessionId: string }) {
      this.selectedKbId = payload.kbId;
      this.selectedKbName = payload.kbName;
      this.currentKbChatId = payload.chatId;
      this.currentKbSessionId = payload.sessionId;
    },

    // 添加用户消息
    addUserMessage(content: string) {
      this.chatMessages.push({
        role: 'user',
        content,
        id: `user_${Date.now()}`,
      });
    },

    // 添加助手消息（流式）
    addAssistantMessage(content = '', isStreaming = true, extra: Record<string, any> = {}) {
      this.chatMessages.push({
        role: 'assistant',
        content,
        id: `assistant_${Date.now()}`,
        isStreaming,
        extra,
      });
    },

    // 更新最后一条助手消息（流式）
    updateLastAssistantMessage(content: string, isStreaming = true, extra: Record<string, any> = {}) {
      const last = this.chatMessages[this.chatMessages.length - 1];
      if (last && last.role === 'assistant') {
        last.content = content;
        last.isStreaming = isStreaming;
        last.extra = extra;
      }
    },

    // 兼容原有方法
    addOrUpdateAssistantMessage(content: string) {
      const lastMessage = this.chatMessages[this.chatMessages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content = content;
      }
      else {
        this.chatMessages.push({
          role: 'assistant',
          content,
          id: `assistant_${Date.now()}`,
        });
      }
    },

    // 移除最后一条消息
    removeLastMessage() {
      if (this.chatMessages.length > 0) {
        this.chatMessages.pop();
      }
    },

    // 清除知识库选择
    clearSelectedKbChat() {
      this.selectedKbId = '';
      this.selectedKbName = '';
      this.currentKbChatId = '';
      this.currentKbSessionId = '';
      this.chatMessages = []; // 清空消息
    },
  },
});
