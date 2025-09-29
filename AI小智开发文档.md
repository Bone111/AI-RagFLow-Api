# AI通通开发文档

## 项目概述

本文档记录了AI通通项目的核心功能开发实现，包括知识库管理、文件操作、RAGFlow API集成和聊天功能等模块的详细开发过程和技术实现。

## 已完成功能模块

### 1. AI通通知识库界面开发

#### 1.1 知识库列表页面 (`src/pages/knowledge/index.vue`)

**功能特性：**
- 知识库卡片式展示
- 支持创建、删除、查看详情
- 响应式布局设计
- 实时数据更新

**核心实现：**

```typescript
// 知识库列表获取
async function getKnowledgeList() {
  try {
    const res = await fetchKnowledgeList();
    const kbs = res?.data?.kbs || res?.data || [];
    knowledgeList.value = Array.isArray(kbs) ? kbs : [];
  } catch {
    ElMessage.error('获取知识库列表失败');
  }
}

// 知识库删除确认
function handleDeleteKnowledge(id: string) {
  ElMessageBox.confirm('确定要删除该知识库吗？', '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteKnowledgeApi(id);
      ElMessage.success('已删除');
      getKnowledgeList();
    } catch {
      ElMessage.error('删除失败');
    }
  });
}
```

#### 1.2 知识库创建弹框

**功能特性：**
- 模态弹框设计
- 表单验证
- 图片上传预览
- 字符限制提示

**UI组件结构：**
```vue
<el-dialog v-model="showCreateDialog" title="新建知识库" width="500px">
  <div class="create-knowledge-container">
    <!-- 图片上传区域 -->
    <div class="image-upload-area">
      <div class="upload-box">
        <el-icon class="upload-icon"><Plus /></el-icon>
      </div>
    </div>
    
    <!-- 名称输入 -->
    <div class="input-group">
      <label class="input-label">
        <span class="required">*</span>名称
      </label>
      <el-input v-model="knowledgeName" placeholder="输入知识库名称" 
                maxlength="8" show-word-limit />
    </div>
    
    <!-- 描述输入 -->
    <div class="input-group">
      <label class="input-label">描述</label>
      <el-input v-model="knowledgeDescription" type="textarea" 
                :rows="4" placeholder="给知识库添加描述" 
                maxlength="200" show-word-limit />
    </div>
  </div>
</el-dialog>
```

**创建逻辑：**
```typescript
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
  } catch {
    ElMessage.error('知识库创建失败');
  }
}
```

### 2. 文件管理功能开发

#### 2.1 文件上传功能 (`src/pages/knowledge/detail.vue`)

**功能特性：**
- 拖拽上传支持
- 多文件批量上传
- 文件类型和大小限制
- 上传进度显示
- 自动解析文档

**上传组件实现：**
```vue
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
  <div class="el-upload__text">点击或拖拽文件至此区域即可上传</div>
  <template #tip>
    <div class="el-upload__tip">
      支持单次或批量上传。单次最大1GB，单文件最大10MB，最多32个文件。
    </div>
  </template>
</el-upload>
```

**自定义上传处理：**
```typescript
async function handleHttpRequest(options: UploadRequestOptions) {
  const { file } = options;
  try {
    const res = await uploadKnowledgeFiles(knowledgeId, [file]);
    options.onSuccess?.(res);
  } catch (error) {
    options.onError?.(error as Error);
  }
}

// 上传成功后自动解析
function handleUploadSuccess(response: any, file: any, fileList: any[]) {
  ElMessage.success('上传成功');
  showUploadDialog.value = false;
  
  // 提取文件ID并自动解析
  const ids: string[] = [];
  if (response?.data) {
    if (Array.isArray(response.data)) {
      response.data.forEach((item: any) => ids.push(item.id || item.doc_id));
    } else if (response.data.id || response.data.doc_id) {
      ids.push(response.data.id || response.data.doc_id);
    }
  }
  
  if (ids.length) {
    parseKnowledgeDocs(knowledgeId, ids).then(() => {
      ElMessage.success('解析已提交');
      getFileList();
    });
  }
}
```

#### 2.2 文件列表展示

**功能特性：**
- 卡片式文件展示
- 文件类型图标
- 文件信息显示
- 操作菜单（下载、删除）

**文件卡片组件：**
```vue
<div v-for="file in fileList" :key="file.id" class="file-card">
  <div class="file-thumb">
    <img v-if="file.type === 'pdf'" :src="pdfLogo" class="file-icon" alt="PDF图标">
    <img v-else-if="file.thumbnail && file.dataset_id" 
         :src="`${BASE_IMAGE_URL}${file.dataset_id}-${file.thumbnail}`" 
         class="file-icon" alt="缩略图">
    <img v-else :src="pdfLogo" class="file-icon" alt="文件">
  </div>
  
  <div class="file-info">
    <div class="file-name">{{ file.name || '未命名文件' }}</div>
    <div class="file-meta">
      <el-icon class="file-type"><Document /></el-icon>
      <span>{{ file.type || '未知类型' }}</span>
    </div>
    <div class="file-time-bottom">
      {{ file.update_date || file.create_date || '' }}
    </div>
  </div>
  
  <div class="file-actions">
    <el-dropdown @command="(command) => handleFileMenuCommand(command, file)">
      <el-icon class="file-menu-icon"><MoreFilled /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="download">下载</el-dropdown-item>
          <el-dropdown-item command="delete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</div>
```

#### 2.3 文件下载功能

**实现逻辑：**
```typescript
async function downloadFile(file: any) {
  try {
    const datasetId = file.dataset_id || knowledgeId;
    const res = await downloadKnowledgeFile(datasetId, file.id);
    
    // 检查响应类型
    if (res && res.headers) {
      const contentType = res.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = function () {
          ElMessage.error(`下载失败: ${reader.result}`);
        };
        reader.readAsText(res.data);
        return;
      }
    }
    
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name || 'downloaded_file');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    ElMessage.error('下载失败');
  }
}
```

#### 2.4 文件删除功能

**删除确认逻辑：**
```typescript
function deleteFile(file: any) {
  ElMessageBox.confirm(`确定要删除文件：${file.name} 吗？`, '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteKnowledgeFile(file.dataset_id || knowledgeId, [file.id]);
      ElMessage.success('文件已删除');
      getFileList();
    } catch {
      ElMessage.error('删除失败');
    }
  });
}
```

#### 2.5 文件解析功能

**解析接口实现：**
```typescript
export function parseKnowledgeDocs(dataset_id: string, document_ids: string[]) {
  if (!dataset_id) {
    return Promise.reject(new Error('数据集ID不能为空'));
  }
  
  if (!document_ids || document_ids.length === 0) {
    return Promise.reject(new Error('文档ID不能为空'));
  }
  
  return request.post<ApiResponse>(`/api/v1/datasets/${dataset_id}/chunks`, {
    document_ids,
  }).then((response) => {
    const data = response.data;
    if (data.code === 0) {
      return data;
    }
    if (data.code === 102) {
      throw new Error('您没有权限访问该数据集');
    }
    throw new Error(data.message || '解析文档失败');
  });
}
```

### 3. RAGFlow API接口集成

#### 3.1 知识库相关接口 (`src/api/knowledge.ts`)

**核心API接口：**

```typescript
// 获取数据集列表
export function fetchKnowledgeList() {
  return request.get('/api/v1/datasets?page=1&page_size=100');
}

// 创建知识库数据集
export function createKnowledgeApi(data: any) {
  return request.post('/api/v1/datasets', data);
}

// 删除知识库
export function deleteKnowledgeApi(ids: string[] | string) {
  const idList = Array.isArray(ids) ? ids : [ids];
  return request.delete('/api/v1/datasets', {
    data: { ids: idList },
  });
}

// 上传文件到指定数据集
export function uploadKnowledgeFiles(datasetId: string, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('file', file);
  });
  return request.post(`/api/v1/datasets/${datasetId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 获取知识库下的文件列表
export function fetchKnowledgeFiles(knowledgeId: string, page = 1, pageSize = 10) {
  return request.get(`/api/v1/datasets/${knowledgeId}/documents?page=${page}&page_size=${pageSize}`);
}

// 批量删除知识库文件
export function deleteKnowledgeFile(datasetId: string, ids: string[]) {
  return request.delete(`/api/v1/datasets/${datasetId}/documents`, {
    data: { ids },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
```

#### 3.2 请求拦截器配置 (`src/utils/request.ts`)

**统一Token配置：**
```typescript
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:9380',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动加 RAGFlow API token
request.interceptors.request.use((config: AxiosRequestConfig) => {
  if (config.headers) {
    config.headers.Authorization = 'Bearer ragflow-FhZThkODE4NjFlYjExZjBhMGY1ODJjZW';
  }
  return config;
});

// 响应拦截器：区分 blob 和普通响应
request.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.responseType === 'blob') {
      return response;
    }
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);
```

### 4. RAGFlow聊天功能集成

#### 4.1 聊天助理管理

**创建聊天会话：**
```typescript
// 创建聊天会话，传入数据集ID数组和会话名称
export function createChatWithDatasets(dataset_ids: string[], name: string) {
  return request.post('/api/v1/chats', {
    dataset_ids,
    name,
  });
}

// 获取聊天列表
export function getChatList(page = 1, pageSize = 100) {
  return request.get(`/api/v1/chats?page=${page}&page_size=${pageSize}`);
}

// 批量删除聊天会话
export function deleteChats(ids: string[]) {
  return request.delete('/api/v1/chats', {
    data: { ids },
  });
}
```

#### 4.2 流式对话实现

**核心流式接口：**
```typescript
// 流式对话接口，支持知识库
export function chatCompletionWithKnowledge(
  chatId: string, 
  question: string, 
  sessionId: string, 
  stream = true
): Promise<Response> {
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/chats/${chatId}/completions`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ragflow-FhZThkODE4NjFlYjExZjBhMGY1ODJjZW',
  };
  const body = JSON.stringify({
    question,
    stream,
    session_id: sessionId,
  });
  
  return fetch(url, {
    method: 'POST',
    headers,
    body,
  });
}
```

#### 4.3 聊天状态管理 (`src/stores/modules/chat.ts`)

**状态定义：**
```typescript
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
    setSelectedKbChat(payload: { 
      kbId: string; 
      kbName: string; 
      chatId: string; 
      sessionId: string 
    }) {
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
    
    // 更新最后一条助手消息（流式）
    updateLastAssistantMessage(content: string, isStreaming = true) {
      const last = this.chatMessages[this.chatMessages.length - 1];
      if (last && last.role === 'assistant') {
        last.content = content;
        last.isStreaming = isStreaming;
      }
    },
  }
});
```

#### 4.4 知识库选择组件 (`src/components/ModelSelect/index.vue`)

**知识库选择弹框：**
```vue
<el-dialog v-model="showKbDialog" title="选择知识库" width="700px">
  <div class="kb-card-list">
    <div
      v-for="kb in knowledgeList"
      :key="kb.id"
      class="kb-card"
      :class="{ selected: kb.id === selectedKbId }"
      @click="selectKb(kb)"
    >
      <img :src="kb.avatar || defaultImg" class="kb-thumb">
      <div class="kb-name">{{ kb.name }}</div>
      <el-icon v-if="kb.id === selectedKbId" class="kb-selected-icon">
        <Check />
      </el-icon>
    </div>
  </div>
</el-dialog>
```

**知识库选择逻辑：**
```typescript
async function selectKb(kb: any) {
  try {
    // 1. 创建聊天助理
    const chatRes = await createChatWithDatasets([kb.id], `${kb.name}助理`);
    const chatId = chatRes.data.id;
    
    // 2. 创建会话
    const sessionRes = await createChatSession(chatId, `${kb.name}会话`);
    const sessionId = sessionRes.data.id;
    
    // 3. 更新状态
    chatStore.setSelectedKbChat({
      kbId: kb.id,
      kbName: kb.name,
      chatId,
      sessionId,
    });
    
    selectedKbId.value = kb.id;
    showKbDialog.value = false;
    ElMessage.success(`已选择知识库：${kb.name}`);
  } catch (error) {
    ElMessage.error('选择知识库失败');
  }
}
```

## 技术特点总结

### 1. 模块化设计
- 功能模块清晰分离
- 组件复用性强
- 状态管理统一

### 2. 用户体验优化
- 流式对话实时响应
- 拖拽上传便捷操作
- 加载状态友好提示
- 错误处理完善

### 3. API集成规范
- 统一的请求拦截器
- 标准化错误处理
- 类型安全保障

### 4. 界面设计现代化
- 响应式布局
- 卡片式设计
- 图标化操作
- 暗黑模式支持

## 开发调试要点

### 1. RAGFlow API调试
- 确保API Token正确配置
- 检查网络连接和跨域设置
- 监控API响应状态和错误信息

### 2. 文件上传调试
- 验证文件大小和类型限制
- 检查FormData格式
- 确认上传进度回调

### 3. 流式对话调试
- 检查Server-Sent Events连接
- 验证消息格式和编码
- 监控连接状态和重连机制

### 4. 状态管理调试
- 使用Vue DevTools监控状态变化
- 检查Pinia持久化配置
- 验证组件间状态同步

## 后续优化方向

1. **性能优化**：虚拟滚动、懒加载、缓存策略
2. **功能扩展**：批量操作、高级搜索、文件预览
3. **用户体验**：快捷键支持、拖拽排序、主题定制
4. **安全加固**：Token动态管理、权限控制、数据加密

本文档记录了AI通通项目核心功能的完整开发实现，为后续维护和功能扩展提供了详细的技术参考。
