import request from '@/utils/request';

interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

// 获取知识库列表
// export function fetchKnowledgeList() {
//   return request.post('/api/v1/list?page=1&page_size=30&keywords=', { owner_ids: [] });
// }

// // 创建知识库
// export function createKnowledgeApi(data: any) {
//   return request.post('/api/v1/create', data);
// }

// 获取知识库详情
// export function fetchKnowledgeDetail(id: string) {
//   return request.get(`/api/v1/detail/${id}`);
// }

// // 获取知识库下的文件列表
// // knowledgeId: 知识库ID，page: 页码，pageSize: 每页数量
// export function fetchKnowledgeFiles(knowledgeId: string, page = 1, pageSize = 10) {
//   return request.post(
//     `/api/v1/document/list?kb_id=${knowledgeId}&page=${page}&page_size=${pageSize}`,
//     {},
//   );
// }

// 删除知识库
// kb_id: 知识库ID
// export function deleteKnowledgeApi(kb_id: string) {
//   return request.post('/api/v1/rm', { kb_id });
// }

// 上传文件到知识库，支持多文件
// kb_id: 知识库ID，files: 文件数组
// export function uploadKnowledgeFiles(kb_id: string, files: File[]) {
//   const formData = new FormData();
//   formData.append('kb_id', kb_id);
//   files.forEach((file) => {
//     formData.append('file', file);
//   });
//   return request.post('/api/v1/document/upload', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// }

// 解析知识库文件
// doc_ids: 文件ID数组，run: 解析动作（如'1'），delete: 是否删除原文件
// export function parseKnowledgeDocs(doc_ids: string[], run: string = '1') {
//   return request.post('/api/v1/document/run', {
//     doc_ids,
//     run,
//     delete: true,
//   });
// }

// // 删除知识库文件
// // doc_id: 文件ID
// export function deleteKnowledgeFile(doc_id: string) {
//   return request.post('/api/v1/document/rm', { doc_id });
// }

// 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

// 统一token
// 获取数据集列表
export function fetchKnowledgeList() {
  return request.get('/api/v1/datasets?page=1&page_size=100');
}

// 创建知识库 数据集
export function createKnowledgeApi(data: any) {
  return request.post('/api/v1/datasets', data);
}

// 删除知识库
// ids: 知识库ID数组或单个id
export function deleteKnowledgeApi(ids: string[] | string) {
  const idList = Array.isArray(ids) ? ids : [ids];
  return request.delete('/api/v1/datasets', {
    data: { ids: idList },
  });
}

// 上传文件到指定数据集（支持多文件）
// datasetId: 数据集ID，files: 文件数组
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

// 下载指定数据集下的文件
export function downloadKnowledgeFile(datasetId: string, documentId: string) {
  return request.get(`/api/v1/datasets/${datasetId}/documents/${documentId}`, {
    responseType: 'blob',
  });
}

// 获取知识库下的文件列表
// knowledgeId: 知识库ID，page: 页码，pageSize: 每页数量
export function fetchKnowledgeFiles(knowledgeId: string, page = 1, pageSize = 10) {
  return request.get(`/api/v1/datasets/${knowledgeId}/documents?page=${page}&page_size=${pageSize}`);
}
// 批量删除知识库文件
// datasetId: 数据集ID，ids: 文件ID数组
export function deleteKnowledgeFile(datasetId: string, ids: string[]) {
  return request.delete(`/api/v1/datasets/${datasetId}/documents`, {
    data: { ids },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 创建聊天会话，传入数据集ID数组和会话名称
export function createChatWithDatasets(dataset_ids: string[], name: string) {
  return request.post('/api/v1/chats', {
    dataset_ids,
    name,
  });
}

// 流式对话接口，支持知识库
// chatId: 聊天ID，question: 问题，sessionId: 会话ID
export function chatCompletionWithKnowledge(chatId: string, question: string, sessionId: string, stream = true): Promise<Response> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  const url = `${baseUrl}/api/v1/chats/${chatId}/completions`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ragflow-RkYzIzOWJjOWNmZDExZjA4OTJkMzJiZj', // 注意：Token硬编码在此
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

// 批量删除聊天会话
// ids: 聊天ID数组
export function deleteChats(ids: string[]) {
  return request.delete('/api/v1/chats', {
    data: { ids },
  });
}

// 创建指定聊天下的新会话
// chatId: 聊天ID，name: 会话名称
export function createChatSession(chatId: string, name: string) {
  return request.post(`/api/v1/chats/${chatId}/sessions`, { name });
}

// 获取聊天列表
export function getChatList(page = 1, pageSize = 100) {
  return request.get(`/api/v1/chats?page=${page}&page_size=${pageSize}`);
}

/**
 * @description 解析知识库文档并获取数据块
 * @param {string} dataset_id - 数据集ID
 * @param {string[]} document_ids - 文档ID数组
 */
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
    // 处理成功响应
    if (data.code === 0) {
      return data;
    }
    // 处理权限错误
    if (data.code === 102) {
      throw new Error('您没有权限访问该数据集');
    }
    // 处理其他错误
    throw new Error(data.message || '解析文档失败');
  }).catch((error) => {
    // 如果是我们自定义的错误，直接抛出
    if (error.message) {
      throw error;
    }
    // 处理网络错误等其他错误
    throw new Error('网络错误，请稍后重试');
  });
}
