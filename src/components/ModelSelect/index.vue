<!-- 切换模型 -->
<script setup lang="ts">
import type { GetSessionListVO } from '@/api/model/types';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { createChatSession, createChatWithDatasets, deleteChats, fetchKnowledgeList, getChatList } from '@/api/knowledge';
import defaultImg from '@/assets/images/zhishiku.png';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useChatStore } from '@/stores/modules/chat'; // 引入
import { useModelStore } from '@/stores/modules/model';

const modelStore = useModelStore();
const chatStore = useChatStore();
const router = useRouter();

onMounted(async () => {
  await modelStore.requestModelList();
  // 设置默认模型
  if (
    modelStore.modelList.length > 0
    && (!modelStore.currentModelInfo || !modelStore.currentModelInfo.modelName)
  ) {
    modelStore.setCurrentModelInfo(modelStore.modelList[0]);
  }
});

const showKbDialog = ref(false);
const knowledgeList = ref<any[]>([]);
const selectedKbId = ref('');

async function openKbDialog() {
  showKbDialog.value = true;
  // 获取知识库列表
  const res = await fetchKnowledgeList();
  knowledgeList.value = res?.data || [];
}
function selectKb(kb: any) {
  selectedKbId.value = kb.id;
}
async function confirmKb() {
  if (!selectedKbId.value) {
    ElMessage.warning('请选择知识库');
    return;
  }
  const kb = knowledgeList.value.find((k: any) => k.id === selectedKbId.value);
  const kbName = kb?.name || '新会话';

  try {
    // 1. 获取列表
    const res = await getChatList();
    const chatList = res.data || [];
    // 2. 按名称查找
    const oldChat = chatList.find((c: any) => c.name === kbName);

    if (oldChat) {
      // 3. 存在，尝试删除
      let deleteSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          await deleteChats([oldChat.id]);
          deleteSuccess = true;
          break;
        }
        catch {
          ElMessage.warning(`删除旧会话失败，正在重试第 ${i + 1} 次...`);
        }
      }
      if (!deleteSuccess) {
        ElMessage.error('删除旧会话失败，请稍后重试');
        return;
      }
    }

    // 4. 不存在或删除成功后，创建新会话
    const chatRes = await createChatWithDatasets([selectedKbId.value], kbName);
    const chatId = chatRes.data.id;
    const sessionRes = await createChatSession(chatId, '小智新会话');
    const sessionId = sessionRes.data.id;

    // 5. 更新 store
    chatStore.setSelectedKbChat({
      kbId: selectedKbId.value,
      kbName,
      chatId,
      sessionId,
    });

    ElMessage.success('会话创建成功');
    showKbDialog.value = false;

    // 跳转到对话页
    router.push(`/chat/${chatId}`);
  }
  catch (error) {
    ElMessage.error('会话创建/切换失败');
    console.error('会话切换失败:', error);
  }
}
</script>

<template>
  <div class="model-select">
    <div
      class="model-select-box select-none flex items-center gap-4px p-10px rounded-10px cursor-pointer font-size-12px border-[rgba()]"
      @click="openKbDialog"
    >
      <div class="model-select-box-icon">
        <SvgIcon name="models" size="12" />
      </div>
      <div class="model-select-box-text font-size-12px">
        知识库搜索
      </div>
    </div>
    <el-dialog v-model="showKbDialog" title="选择知识库" width="700px" :close-on-click-modal="false">
      <div class="kb-card-list">
        <div
          v-for="kb in knowledgeList"
          :key="kb.id"
          class="kb-card"
          :class="{ selected: kb.id === selectedKbId }"
          @click="selectKb(kb)"
        >
          <img :src="kb.avatar || defaultImg" class="kb-thumb">
          <div class="kb-name">
            {{ kb.name }}
          </div>
          <el-icon v-if="kb.id === selectedKbId" class="kb-selected-icon">
            <Check />
          </el-icon>
        </div>
      </div>
      <template #footer>
        <el-button @click="showKbDialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmKb">
          知识库搜索
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.model-select-box {
  color: var(--el-color-primary, #409eff);
  background: var(--el-color-primary-light-9, rgb(235.9 245.3 255));
  border: 1px solid var(--el-color-primary, #409eff);
  border-radius: 10px;
}
.popover-content-box-item.is-select {
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.popover-content-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 200px;
  overflow: hidden auto;
  .popover-content-box-items {
    :deep() {
      .popover-trigger-item-text {
        width: 100%;
      }
    }
  }
  .popover-content-box-item-text {
    color: white;
    background-color: black;
  }

  // 滚动条样式
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background: #cccccc;
    border-radius: 4px;
  }
}
.kb-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding: 10px 0;
  min-height: 180px;
  max-height: 400px;
  overflow-y: auto;
}
.kb-card {
  width: 180px;
  height: 180px;
  border: 2px solid #eee;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s;
}
.kb-card.selected {
  border-color: #e9435a;
}
.kb-thumb {
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin-bottom: 12px;
}
.kb-name {
  font-size: 18px;
  font-weight: bold;
  color: #222;
  text-align: center;
  word-break: break-all;
}
.kb-selected-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #e9435a;
  font-size: 22px;
}
</style>
