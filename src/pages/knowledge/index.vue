<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createKnowledgeApi, deleteKnowledgeApi, fetchKnowledgeList } from '@/api/knowledge';

const showCreateDialog = ref(false);
const knowledgeName = ref('');
const knowledgeDescription = ref('');
const knowledgeList = ref<any[]>([]);

function handleCloseCreateDialog() {
  showCreateDialog.value = false;
  knowledgeName.value = '';
  knowledgeDescription.value = '';
}

async function createKnowledge() {
  if (!knowledgeName.value.trim()) {
    ElMessage.warning('请输入知识库名称');
    return;
  }
  try {
    await createKnowledgeApi({ name: knowledgeName.value });
    ElMessage.success('知识库创建成功');
    handleCloseCreateDialog();
    getKnowledgeList();
  }
  catch {
    ElMessage.error('知识库创建失败');
  }
}

function formatTime(ts: number) {
  if (!ts)
    return '-';
  const d = new Date(Number(ts));
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

async function getKnowledgeList() {
  try {
    const res = await fetchKnowledgeList();
    const kbs = res?.data?.kbs || res?.data || [];
    knowledgeList.value = Array.isArray(kbs) ? kbs : [];
  }
  catch {
    ElMessage.error('获取知识库列表失败');
  }
}

function handleDeleteKnowledge(id: string) {
  ElMessageBox.confirm('确定要删除该知识库吗？', '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteKnowledgeApi(id);
        ElMessage.success('已删除');
        getKnowledgeList();
      }
      catch {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {
      // 用户取消删除
    });
}

const router = useRouter();

function goToKnowledgeDetail(id: string, name: string) {
  console.log('点击知识库卡片，ID:', id, '名称:', name);
  console.log('准备跳转到:', `/knowledge/detail/${id}`);
  router.push({
    path: `/knowledge/detail/${id}`,
    query: { name: encodeURIComponent(name) },
  });
}

onMounted(() => {
  getKnowledgeList();
});
</script>

<template>
  <div class="knowledge-page">
    <!-- 调试输出 -->
    <!-- <pre>{{ knowledgeList }}</pre> -->
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          知识库
        </h1>
        <p class="page-desc">
          知识库系统支持来自RAGFLOW
        </p>
      </div>
    </div>

    <!-- 新建知识库按钮 -->
    <div class="action-section">
      <button class="create-btn" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        + 新建知识库
      </button>
    </div>

    <!-- 新建知识库对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建知识库"
      width="500px"
      :before-close="handleCloseCreateDialog"
    >
      <div class="create-knowledge-container">
        <!-- 图片上传区域 -->
        <div class="image-upload-area">
          <div class="upload-box">
            <el-icon class="upload-icon">
              <Plus />
            </el-icon>
          </div>
        </div>
        <!-- 名称输入 -->
        <div class="input-group">
          <label class="input-label">
            <span class="required">*</span>
            名称
          </label>
          <div class="input-wrapper">
            <el-input
              v-model="knowledgeName"
              placeholder="输入知识库名称"
              maxlength="8"
              show-word-limit
            />
          </div>
        </div>
        <!-- 描述输入 -->
        <div class="input-group">
          <label class="input-label">描述</label>
          <div class="input-wrapper">
            <el-input
              v-model="knowledgeDescription"
              type="textarea"
              :rows="4"
              placeholder="给知识库添加描述"
              maxlength="200"
              show-word-limit
            />
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="createKnowledge">确认创建</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 筛选标签 -->
    <div class="filter-section">
      <span class="filter-tag active" @click="getKnowledgeList">全部</span>
    </div>

    <!-- 知识库卡片列表 -->
    <div class="knowledge-list">
      <template v-if="knowledgeList.length">
        <div v-for="item in knowledgeList" :key="item.id" class="knowledge-card" @click="goToKnowledgeDetail(item.id, item.name || '未命名知识库')">
          <div class="card-header">
            <el-avatar :size="40" :src="item.avatar || ''">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
            <el-icon class="card-more" @click.stop="handleDeleteKnowledge(item.id)">
              <MoreFilled />
            </el-icon>
          </div>
          <div class="card-content">
            <h3 class="card-title">
              {{ item.name || '未命名知识库' }}
            </h3>
          </div>
          <div class="card-footer">
            <div class="footer-item">
              <el-icon><Document /></el-icon>
              <span>{{ item.document_count ?? 0 }} 文档</span>
            </div>
            <div class="footer-item">
              <el-icon><Calendar /></el-icon>
              <span>{{ typeof item.update_time === 'number' ? formatTime(item.update_time) : item.update_time }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="empty-list">
          暂无知识库
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.knowledge-page {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  .header-left {
    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #222;
      margin: 0 0 8px 0;
    }
    .page-desc {
      font-size: 16px;
      color: #666;
      margin: 0;
    }
  }
  .header-right {
    .storage-info {
      text-align: right;
      .storage-text {
        font-size: 14px;
        color: #888;
        margin-bottom: 4px;
        display: block;
      }
      .storage-bar {
        width: 120px;
        height: 4px;
        background: #f0f0f0;
        border-radius: 2px;
        overflow: hidden;
        .storage-progress {
          height: 100%;
          background: #e9435a;
          border-radius: 2px;
        }
      }
    }
  }
}
.action-section {
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  .create-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background: #e9435a;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: #d8132a;
    }
    .el-icon {
      font-size: 16px;
    }
  }
}
.create-knowledge-container {
  .image-upload-area {
    margin-bottom: 24px;
    .upload-box {
      width: 120px;
      height: 120px;
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: border-color 0.2s;
      margin: 0 auto;
      &:hover {
        border-color: #e9435a;
      }
      .upload-icon {
        font-size: 32px;
        color: #999;
      }
    }
  }
  .input-group {
    margin-bottom: 20px;
    .input-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #222;
      margin-bottom: 8px;
      .required {
        color: #e9435a;
        margin-right: 4px;
      }
    }
    .input-wrapper {
      .el-input {
        .el-input__wrapper {
          border-radius: 8px;
        }
      }
      .el-textarea {
        .el-textarea__inner {
          border-radius: 8px;
        }
      }
    }
  }
}
.filter-section {
  margin-bottom: 24px;
  .filter-tag {
    display: inline-block;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    background-color: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    &.active {
      color: #e9435a;
      background: transparent;
      border-color: #e9435a;
    }
    &:hover {
      background: #f7f7f7;
    }
  }
}
.knowledge-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  min-height: 120px;
  max-height: 70vh;
  overflow-y: auto;
}
.knowledge-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  padding: 24px 24px 16px 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 260px;
  cursor: pointer; /* Added cursor pointer for clickability */
  &:hover {
    border-color: #e9435a;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.avatar-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-more {
  color: #bbb;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #e9435a;
    background-color: rgba(233, 67, 90, 0.1);
  }
}
.card-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 32px;
  margin-top: 0;
}
.card-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}
.footer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #444;
  font-size: 15px;
}
.empty-list {
  grid-column: 1/-1;
  text-align: center;
  color: #bbb;
  font-size: 18px;
  padding: 48px 0;
}
.all-fields {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: #444;
  word-break: break-all;
}
.all-fields li {
  margin-bottom: 4px;
}
.all-fields strong {
  color: #888;
  font-weight: 500;
  margin-right: 4px;
}
</style>
