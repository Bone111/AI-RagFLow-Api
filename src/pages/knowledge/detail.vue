<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { deleteKnowledgeFile, downloadKnowledgeFile, fetchKnowledgeFiles, parseKnowledgeDocs, uploadKnowledgeFiles } from '@/api/knowledge';
import pdfLogo from '@/assets/images/pdflogo.png';

const route = useRoute();
const router = useRouter();
const knowledgeId = route.params.id as string;
const knowledgeName = route.query.name ? decodeURIComponent(route.query.name as string) : '';

const knowledgeInfo = ref<any>({
  id: knowledgeId,
  name: knowledgeName || `知识库 ${knowledgeId}`,
});

// mock文件列表
const fileList = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(10);

// 全局API基础地址
const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:9380';
const BASE_IMAGE_URL = 'http://127.0.0.1:9380/v1/document/image/';

const showUploadDialog = ref(false);
const uploadType = ref('local');
const fileTab = ref('file');
const uploadFileList = ref<any[]>([]);

function handleUploadSuccess(response: any, file: any, fileList: any[]) {
  ElMessage.success('上传成功');
  showUploadDialog.value = false;
  // 自动解析上传的文件
  const ids: string[] = [];
  if (response?.data) {
    if (Array.isArray(response.data)) {
      response.data.forEach((item: any) => ids.push(item.id || item.doc_id));
    }
    else if (response.data.id || response.data.doc_id) {
      ids.push(response.data.id || response.data.doc_id);
    }
  }
  if (ids.length) {
    parseKnowledgeDocs(knowledgeId, ids).then(() => {
      ElMessage.success('解析已提交');
      getFileList();
    }).catch(() => {
      // ElMessage.error('解析失败');
      getFileList();
    });
  }
  else {
    getFileList();
  }
}
function handleUploadError(err: any, file: any, fileList: any[]) {
  ElMessage.error('上传失败');
}
function beforeUpload(file: any) {
  // 限制文件大小、类型等
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('单文件不能超过10MB');
    return false;
  }
  return true;
}
function handleFolderUpload(event: Event) {
  // 文件夹上传逻辑（可扩展）
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length) {
    // 可将 files 推入 uploadFileList 或直接上传
    ElMessage.info('文件夹上传功能待完善');
  }
}
function handleUploadConfirm() {
  showUploadDialog.value = false;
  getFileList();
}

function goBackToList() {
  router.push('/knowledge');
}

// 获取文件列表
async function getFileList() {
  try {
    const res = await fetchKnowledgeFiles(knowledgeId, page.value, pageSize.value);
    fileList.value = res?.data?.docs || [];
    console.log('fileList:', fileList.value);
  }
  catch {
    fileList.value = [];
    console.log('fileList: [] (catch)');
  }
}

function handleFileMenuCommand(command: string, file: any) {
  if (command === 'download') {
    downloadFile(file);
  }
  else if (command === 'delete') {
    deleteFile(file);
  }
}

async function downloadFile(file: any) {
  try {
    // 优先用 file.dataset_id，否则用当前 knowledgeId
    const datasetId = file.dataset_id || knowledgeId;
    const res = await downloadKnowledgeFile(datasetId, file.id);

    // 确保 res.headers 存在
    if (res && res.headers) {
      const contentType = res.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        // 解析错误信息
        const reader = new FileReader();
        reader.onload = function () {
          ElMessage.error(`下载失败: ${reader.result}`);
        };
        reader.readAsText(res.data);
        return;
      }
    }

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name || 'downloaded_file');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
  catch (e) {
    ElMessage.error('下载失败');
  }
}

function deleteFile(file: any) {
  ElMessageBox.confirm(`确定要删除文件：${file.name} 吗？`, '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteKnowledgeFile(file.dataset_id || knowledgeId, [file.id]);
        ElMessage.success('文件已删除');
        getFileList();
      }
      catch {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {
      // 用户取消删除
    });
}

function handleHttpRequest(options: UploadRequestOptions) {
  return uploadKnowledgeFiles(knowledgeId, [options.file]);
}

onMounted(() => {
  getFileList();
});
</script>

<template>
  <div class="knowledge-detail-page">
    <el-button type="danger" class="upload-btn" plain @click="showUploadDialog = true">
      <el-icon style="margin-right: 6px">
        <Plus />
      </el-icon>上传文件
    </el-button>
    <el-dialog v-model="showUploadDialog" title="上传文件" width="600px">
      <el-tabs v-model="uploadType">
        <el-tab-pane label="本地上传" name="local">
          <el-tabs v-model="fileTab" class="mt-2">
            <el-tab-pane label="文件" name="file">
              <el-upload
                drag
                multiple
                :http-request="handleHttpRequest"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :before-upload="beforeUpload"
                :file-list="uploadFileList"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  点击或拖拽文件至此区域即可上传
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持单次或批量上传。单次最大1GB，单文件最大10MB，最多32个文件。
                  </div>
                </template>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="文件夹" name="folder">
              <input
                ref="folderInput"
                type="file"
                webkitdirectory
                multiple
                style="display:none"
                @change="handleFolderUpload"
              >
              <el-button @click="($refs.folderInput as HTMLInputElement)?.click()">
                选择文件夹
              </el-button>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <!-- <el-tab-pane label="S3上传" name="s3">
          <div>暂未实现</div>
        </el-tab-pane> -->
      </el-tabs>
      <template #footer>
        <el-button @click="showUploadDialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleUploadConfirm">
          确定
        </el-button>
      </template>
    </el-dialog>
    <div class="detail-title">
      <span class="breadcrumb-link" @click="goBackToList">全部</span>
      <span class="gt">&gt;</span>
      {{ knowledgeInfo.name }}
    </div>
    <div class="file-list">
      <div v-for="file in fileList" :key="file.id" class="file-card">
        <div class="file-thumb">
          <img
            v-if="file.type === 'pdf'"
            :src="pdfLogo"
            class="file-icon"
            alt="PDF图标"
          >
          <img
            v-else-if="file.thumbnail && file.dataset_id"
            :src="`${BASE_IMAGE_URL}${file.dataset_id}-${file.thumbnail}`"
            class="file-icon"
            alt="缩略图"
          >
          <img
            v-else
            :src="pdfLogo"
            class="file-icon"
            alt="文件"
          >
        </div>
        <div class="file-info">
          <div class="file-name">
            {{ file.name || '未命名文件' }}
          </div>
          <div class="file-meta">
            <el-icon class="file-type">
              <Document />
            </el-icon>
            <span>{{ file.type || '未知类型' }}</span>
          </div>
          <div class="file-time-bottom">
            {{ file.update_date || file.create_date || '' }}
          </div>
        </div>
        <el-dropdown trigger="click" @command="handleFileMenuCommand($event, file)">
          <el-icon class="file-more">
            <MoreFilled />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="download">
                下载
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div v-if="fileList.length === 0" class="empty-list">
        暂无文件
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.knowledge-detail-page {
  padding: 32px;
}
.upload-btn {
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: 600;
}
.detail-title {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: bold;
  .gt {
    font-weight: normal;
    color: #e9435a;
  }
}
.breadcrumb-link {
  font-weight: 600;
  color: #e9435a;
  cursor: pointer;
  transition: text-decoration 0.2s;
}
.breadcrumb-link:hover {
  text-decoration: underline;
}
.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  max-height: 60vh;
  overflow-y: auto;
}
.file-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 360px;
  min-height: 120px;
  padding: 20px 0 0;
  margin-bottom: 24px;
  overflow: hidden;
  background: #fafbfc;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);
}
.file-thumb {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}
.file-icon {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}
.file-info {
  position: relative;
  min-height: 60px;
  padding: 0 20px 12px 80px;
}
.file-name {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  word-break: break-all;
}
.file-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 15px;
  color: #e9435a;
}
.file-type {
  font-size: 18px;
}
.file-time-bottom {
  margin-top: 18px;
  margin-bottom: 2px;
  font-size: 13px;
  color: #888888;
  text-align: left;
  word-break: break-all;
}
.file-more {
  position: absolute;
  right: 16px;
  bottom: 16px;
  font-size: 22px;
  color: #bbbbbb;
  cursor: pointer;
}
</style>
