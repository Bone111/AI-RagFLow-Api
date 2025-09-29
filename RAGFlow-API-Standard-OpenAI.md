# RAGFlow OpenAI兼容API 标准接口文档

---

## 目录
- [OpenAI兼容API（共2个接口）](#openai兼容api)
- [数据集管理（共4个接口）](#数据集管理)
- [文件管理（共7个接口）](#文件管理)
- [块管理（共5个接口）](#块管理)
- [检索（共1个接口）](#检索)
- [聊天助理管理（共4个接口）](#聊天助理管理)
- [会话管理（共10个接口）](#会话管理)
- [代理管理（共4个接口）](#代理管理)
- [错误码](#错误码)

---

**接口总数：37**

## OpenAI兼容API

### 1. 创建聊天完成
- **接口路径**：`/api/v1/chats_openai/{chat_id}/chat/completions`
- **方法**：POST
- **描述**：为给定的聊天对话创建模型响应，兼容OpenAI API格式。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `chat_id` (string, 必填)：聊天ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | model | string | 是 | 用于生成响应的模型 |
  | messages | list[object] | 是 | 聊天消息历史，至少包含一条user消息 |
  | stream | boolean | 否 | 是否流式响应 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/chats_openai/{chat_id}/chat/completions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{
        "model": "model",
        "messages": [{"role": "user", "content": "Say this is a test!"}],
        "stream": true
      }'
~~~
- **响应示例**：
（流式）
~~~json
{"id": "chatcmpl-xxx", "choices": [{"delta": {"content": "This is a test.", "role": "assistant"}}], ...}
~~~
（非流式）
~~~json
{"choices":[{"message":{"content":"This is a test.","role":"assistant"}}], ...}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "The last content of this conversation is not from user."}
~~~

### 2. 创建代理完成
- **接口路径**：`/api/v1/agents_openai/{agent_id}/chat/completions`
- **方法**：POST
- **描述**：为给定代理对话创建模型响应，兼容OpenAI API格式。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `agent_id` (string, 必填)：代理ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | model | string | 是 | 用于生成响应的模型 |
  | messages | list[object] | 是 | 聊天消息历史 |
  | stream | boolean | 否 | 是否流式响应 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/agents_openai/{agent_id}/chat/completions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{
        "model": "model",
        "messages": [{"role": "user", "content": "Say this is a test!"}],
        "stream": true
      }'
~~~
- **响应示例**：同上
- **失败响应**：
~~~json
{"code": 102, "message": "The last content of this conversation is not from user."}
~~~

---

## 数据集管理

### 1. 创建数据集
- **接口路径**：`/api/v1/datasets`
- **方法**：POST
- **描述**：创建数据集。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | name | string | 是 | 数据集名称 |
  | avatar | string | 否 | 头像Base64编码 |
  | description | string | 否 | 数据集描述 |
  | embedding_model | string | 否 | 嵌入模型名称 |
  | permission | string | 否 | 访问权限（me/team）|
  | chunk_method | string | 否 | 分块方法 |
  | parser_config | object | 否 | 解析器配置 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/datasets \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"name": "test_1"}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"id": "xxx", ...}}
~~~
- **失败响应**：
~~~json
{"code": 101, "message": "Dataset name 'RAGFlow example' already exists"}
~~~

### 2. 删除数据集
- **接口路径**：`/api/v1/datasets`
- **方法**：DELETE
- **描述**：按ID删除数据集。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | ids | list[string]或null | 是 | 要删除的数据集ID列表 |
- **接口使用示例**：
~~~shell
curl --request DELETE \
     --url http://{address}/api/v1/datasets \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"ids": ["id1", "id2"]}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "You don't own the dataset."}
~~~

### 3. 更新数据集
- **接口路径**：`/api/v1/datasets/{dataset_id}`
- **方法**：PUT
- **描述**：更新指定数据集的配置。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | name | string | 否 | 数据集名称 |
  | avatar | string | 否 | 头像Base64编码 |
  | description | string | 否 | 数据集描述 |
  | embedding_model | string | 否 | 嵌入模型名称 |
  | permission | string | 否 | 访问权限（me/team）|
  | chunk_method | string | 否 | 分块方法 |
  | pagerank | int | 否 | 页面排名 |
  | parser_config | object | 否 | 解析器配置 |
- **接口使用示例**：
~~~shell
curl --request PUT \
     --url http://{address}/api/v1/datasets/{dataset_id} \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"name": "updated_dataset"}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "Can't change tenant_id."}
~~~

### 4. 列出数据集
- **接口路径**：`/api/v1/datasets`
- **方法**：GET
- **描述**：列出数据集。
- **请求头**：
  - `Authorization: Bearer <YOUR_API_KEY>`
- **查询参数**：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | page | integer | 否 | 页码，默认1 |
  | page_size | integer | 否 | 每页数量，默认30 |
  | orderby | string | 否 | 排序字段 |
  | desc | boolean | 否 | 是否降序 |
  | name | string | 否 | 数据集名称 |
  | id | string | 否 | 数据集ID |
- **接口使用示例**：
~~~shell
curl --request GET \
     --url http://{address}/api/v1/datasets?page=1&page_size=10 \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": [{"id": "xxx", ...}]}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "The dataset doesn't exist"}
~~~

---

## 文件管理

### 1. 上传文件
- **接口路径**：`/api/v1/datasets/{dataset_id}/documents`
- **方法**：POST
- **描述**：将文档上传到指定的数据集。
- **请求头**：
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
- **表单参数**：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | file | file | 是 | 要上传的文档 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/datasets/{dataset_id}/documents \
     --header 'Content-Type: multipart/form-data' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --form 'file=@./test1.txt' \
     --form 'file=@./test2.pdf'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": [{"id": "xxx", ...}]}
~~~
- **失败响应**：
~~~json
{"code": 101, "message": "No file part!"}
~~~

### 2. 更新文档
- **接口路径**：`/api/v1/datasets/{dataset_id}/documents/{document_id}`
- **方法**：PUT
- **描述**：更新指定文档的配置。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
  - `document_id` (string, 必填)：文档ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | name | string | 否 | 文档名称 |
  | meta_fields | object | 否 | 元字段 |
  | chunk_method | string | 否 | 解析方法 |
  | parser_config | object | 否 | 解析器配置 |
- **接口使用示例**：
~~~shell
curl --request PUT \
     --url http://{address}/api/v1/datasets/{dataset_id}/documents/{document_id} \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"name": "manual.txt", "chunk_method": "manual", "parser_config": {"chunk_token_num": 128}}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "The dataset does not have the document."}
~~~

### 3. 下载文档
- **接口路径**：`/api/v1/datasets/{dataset_id}/documents/{document_id}`
- **方法**：GET
- **描述**：从指定数据集中下载文档。
- **请求头**：
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
  - `document_id` (string, 必填)：文档ID
- **接口使用示例**：
~~~shell
curl --request GET \
     --url http://{address}/api/v1/datasets/{dataset_id}/documents/{document_id} \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --output ./ragflow.txt
~~~
- **响应示例**：
~~~text
This is a test to verify the file download feature.
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "You do not own the dataset ..."}
~~~

### 4. 列出文件
- **接口路径**：`/api/v1/datasets/{dataset_id}/documents`
- **方法**：GET
- **描述**：在指定数据集中列出文档。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
- **查询参数**：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | keywords | string | 否 | 匹配文档标题的关键字 |
  | page | integer | 否 | 页码，默认1 |
  | page_size | integer | 否 | 每页数量，默认30 |
  | orderby | string | 否 | 排序字段 |
  | desc | boolean | 否 | 是否降序 |
  | id | string | 否 | 文档ID |
  | name | string | 否 | 文档名称 |
- **接口使用示例**：
~~~shell
curl --request GET \
     --url http://{address}/api/v1/datasets/{dataset_id}/documents?page=1&page_size=10 \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"docs": [{"id": "xxx", ...}], "total": 1}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "You don't own the dataset ..."}
~~~

### 5. 删除文档
- **接口路径**：`/api/v1/datasets/{dataset_id}/documents`
- **方法**：DELETE
- **描述**：按ID删除文档。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | ids | list[string] | 否 | 要删除的文档ID列表 |
- **接口使用示例**：
~~~shell
curl --request DELETE \
     --url http://{address}/api/v1/datasets/{dataset_id}/documents \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"ids": ["id_1", "id_2"]}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "You do not own the dataset ..."}
~~~

### 6. 解析文档
- **接口路径**：`/api/v1/datasets/{dataset_id}/chunks`
- **方法**：POST
- **描述**：解析指定数据集中的文档。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | document_ids | list[string] | 是 | 要解析的文档ID列表 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/datasets/{dataset_id}/chunks \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"document_ids": ["docid1", "docid2"]}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "`document_ids` is required"}
~~~

### 7. 停止解析文档
- **接口路径**：`/api/v1/datasets/{dataset_id}/chunks`
- **方法**：DELETE
- **描述**：停止解析指定文档。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | document_ids | list[string] | 是 | 要停止解析的文档ID列表 |
- **接口使用示例**：
~~~shell
curl --request DELETE \
     --url http://{address}/api/v1/datasets/{dataset_id}/chunks \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"document_ids": ["docid1", "docid2"]}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "`document_ids` is required"}
~~~

---

## 块管理

### 1. 添加块
- **接口路径**：`/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks`
- **方法**：POST
- **描述**：将块添加到指定数据集中的指定文档中。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
  - `document_id` (string, 必填)：文档ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | content | string | 是 | 块的文本内容 |
  | important_keywords | list[string] | 否 | 关键术语 |
  | questions | list[string] | 否 | 相关问题 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"content": "who are you"}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"chunk": {"id": "xxx", ...}}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "`content` is required"}
~~~

### 2. 列表块
- **接口路径**：`/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks`
- **方法**：GET
- **描述**：列出指定文档中的块。
- **请求头**：
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
  - `document_id` (string, 必填)：文档ID
- **查询参数**：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | keywords | string | 否 | 匹配块内容的关键字 |
  | page | integer | 否 | 页码，默认1 |
  | page_size | integer | 否 | 每页数量，默认1024 |
  | id | string | 否 | 块ID |
- **接口使用示例**：
~~~shell
curl --request GET \
     --url http://{address}/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks?page=1&page_size=10 \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"chunks": [{"id": "xxx", ...}], "total": 1}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "You don't own the document ..."}
~~~

### 3. 删除块
- **接口路径**：`/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks`
- **方法**：DELETE
- **描述**：按ID删除块。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
  - `document_id` (string, 必填)：文档ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | chunk_ids | list[string] | 否 | 要删除的块ID列表 |
- **接口使用示例**：
~~~shell
curl --request DELETE \
     --url http://{address}/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"chunk_ids": ["id1", "id2"]}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "`chunk_ids` is required"}
~~~

### 4. 更新块
- **接口路径**：`/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks/{chunk_id}`
- **方法**：PUT
- **描述**：更新指定块的内容或配置。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `dataset_id` (string, 必填)：数据集ID
  - `document_id` (string, 必填)：文档ID
  - `chunk_id` (string, 必填)：块ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | content | string | 否 | 块内容 |
  | important_keywords | list[string] | 否 | 关键术语 |
  | available | boolean | 否 | 可用性 |
- **接口使用示例**：
~~~shell
curl --request PUT \
     --url http://{address}/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks/{chunk_id} \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"content": "ragflow123", "important_keywords": []}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "Can't find this chunk ..."}
~~~

### 5. 检索块
- **接口路径**：`/api/v1/retrieval`
- **方法**：POST
- **描述**：从指定的数据集中检索块。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | question | string | 是 | 用户查询 |
  | dataset_ids | list[string] | 否 | 数据集ID列表 |
  | document_ids | list[string] | 否 | 文档ID列表 |
  | page | integer | 否 | 页码，默认1 |
  | page_size | integer | 否 | 每页数量，默认30 |
  | similarity_threshold | float | 否 | 最低相似度分数，默认0.2 |
  | vector_similarity_weight | float | 否 | 向量相似性权重，默认0.3 |
  | top_k | integer | 否 | 参与向量cosine计算的块数，默认1024 |
  | rerank_id | string | 否 | 重新排名模型ID |
  | keyword | boolean | 否 | 是否启用关键字匹配 |
  | highlight | boolean | 否 | 是否高亮匹配术语 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/retrieval \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"question": "What is advantage of ragflow?", "dataset_ids": ["id1"], "document_ids": ["doc1"]}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"chunks": [{"content": "ragflow content", ...}], "total": 1}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "`datasets` is required."}
~~~

---

## 检索

### 1. 检索块
- **接口路径**：`/api/v1/retrieval`
- **方法**：POST
- **描述**：从指定的数据集中检索块。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | question | string | 是 | 用户查询 |
  | dataset_ids | list[string] | 否 | 数据集ID列表 |
  | document_ids | list[string] | 否 | 文档ID列表 |
  | page | integer | 否 | 页码，默认1 |
  | page_size | integer | 否 | 每页数量，默认30 |
  | similarity_threshold | float | 否 | 最低相似度分数，默认0.2 |
  | vector_similarity_weight | float | 否 | 向量相似性权重，默认0.3 |
  | top_k | integer | 否 | 参与向量cosine计算的块数，默认1024 |
  | rerank_id | string | 否 | 重新排名模型ID |
  | keyword | boolean | 否 | 是否启用关键字匹配 |
  | highlight | boolean | 否 | 是否高亮匹配术语 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/retrieval \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"question": "What is advantage of ragflow?", "dataset_ids": ["id1"], "document_ids": ["doc1"]}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"chunks": [{"content": "ragflow content", ...}], "total": 1}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "`datasets` is required."}
~~~

---

## 聊天助理管理

### 1. 创建聊天助手
- **接口路径**：`/api/v1/chats`
- **方法**：POST
- **描述**：创建聊天助手。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | name | string | 是 | 聊天助手名称 |
  | avatar | string | 否 | 头像Base64编码 |
  | dataset_ids | list[string] | 否 | 关联数据集ID |
  | llm | object | 否 | LLM设置 |
  | prompt | object | 否 | 提示词配置 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/chats \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"dataset_ids": ["id1"], "name": "new_chat_1"}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"id": "xxx", ...}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "Duplicated chat name in creating dataset."}
~~~

### 2. 更新聊天助手
- **接口路径**：`/api/v1/chats/{chat_id}`
- **方法**：PUT
- **描述**：更新指定聊天助理的配置。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `chat_id` (string, 必填)：聊天助手ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | name | string | 否 | 聊天助手名称 |
  | avatar | string | 否 | 头像Base64编码 |
  | dataset_ids | list[string] | 否 | 关联数据集ID |
  | llm | object | 否 | LLM设置 |
  | prompt | object | 否 | 提示词配置 |
- **接口使用示例**：
~~~shell
curl --request PUT \
     --url http://{address}/api/v1/chats/{chat_id} \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"name": "Test"}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "Duplicated chat name in updating dataset."}
~~~

### 3. 删除聊天助手
- **接口路径**：`/api/v1/chats`
- **方法**：DELETE
- **描述**：按ID删除聊天助理。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | ids | list[string] | 否 | 要删除的聊天助手ID列表 |
- **接口使用示例**：
~~~shell
curl --request DELETE \
     --url http://{address}/api/v1/chats \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"ids": ["id1", "id2"]}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "ids are required"}
~~~

### 4. 列出聊天助理
- **接口路径**：`/api/v1/chats`
- **方法**：GET
- **描述**：列出聊天助理。
- **请求头**：
  - `Authorization: Bearer <YOUR_API_KEY>`
- **查询参数**：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | page | integer | 否 | 页码，默认1 |
  | page_size | integer | 否 | 每页数量，默认30 |
  | orderby | string | 否 | 排序字段 |
  | desc | boolean | 否 | 是否降序 |
  | id | string | 否 | 聊天助理ID |
  | name | string | 否 | 聊天助理名称 |
- **接口使用示例**：
~~~shell
curl --request GET \
     --url http://{address}/api/v1/chats?page=1&page_size=10 \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": [{"id": "xxx", ...}]}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "The chat doesn't exist"}
~~~

---

## 会话管理

### 1. 使用聊天助手创建会话
- **接口路径**：`/api/v1/chats/{chat_id}/sessions`
- **方法**：POST
- **描述**：使用聊天助理创建会话。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `chat_id` (string, 必填)：聊天助理ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | name | string | 是 | 会话名称 |
  | user_id | string | 否 | 用户自定义ID |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/chats/{chat_id}/sessions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"name": "new session"}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"id": "xxx", ...}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "Name cannot be empty."}
~~~

### 2. 更新聊天助理的会话
- **接口路径**：`/api/v1/chats/{chat_id}/sessions/{session_id}`
- **方法**：PUT
- **描述**：更新指定聊天助理的会话。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `chat_id` (string, 必填)：聊天助理ID
  - `session_id` (string, 必填)：会话ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | name | string | 否 | 会话名称 |
  | user_id | string | 否 | 用户自定义ID |
- **接口使用示例**：
~~~shell
curl --request PUT \
     --url http://{address}/api/v1/chats/{chat_id}/sessions/{session_id} \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"name": "REVISED_SESSION_NAME"}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "Name cannot be empty."}
~~~

### 3. 列出聊天助理的会话
- **接口路径**：`/api/v1/chats/{chat_id}/sessions`
- **方法**：GET
- **描述**：列出与指定聊天助手关联的会话。
- **请求头**：
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `chat_id` (string, 必填)：聊天助理ID
- **查询参数**：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | page | integer | 否 | 页码，默认1 |
  | page_size | integer | 否 | 每页数量，默认30 |
  | orderby | string | 否 | 排序字段 |
  | desc | boolean | 否 | 是否降序 |
  | name | string | 否 | 会话名称 |
  | id | string | 否 | 会话ID |
  | user_id | string | 否 | 用户自定义ID |
- **接口使用示例**：
~~~shell
curl --request GET \
     --url http://{address}/api/v1/chats/{chat_id}/sessions?page=1&page_size=10 \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": [{"id": "xxx", ...}]}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "The session doesn't exist"}
~~~

### 4. 删除聊天助理的会话
- **接口路径**：`/api/v1/chats/{chat_id}/sessions`
- **方法**：DELETE
- **描述**：按ID删除聊天助理的会话。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `chat_id` (string, 必填)：聊天助理ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | ids | list[string] | 否 | 要删除的会话ID列表 |
- **接口使用示例**：
~~~shell
curl --request DELETE \
     --url http://{address}/api/v1/chats/{chat_id}/sessions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"ids": ["id1", "id2"]}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "The chat doesn't own the session"}
~~~

### 5. 与代理创建会话
- **接口路径**：`/api/v1/agents/{agent_id}/sessions`
- **方法**：POST
- **描述**：与代理创建会话。
- **请求头**：
  - `Content-Type: application/json` 或 `multipart/form-data`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `agent_id` (string, 必填)：代理ID
- **请求体**（JSON 或表单）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | 见代理Begin组件定义 | - | - | 代理自定义参数 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/agents/{agent_id}/sessions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"agent_id": "xxx", ...}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "Agent not found."}
~~~

### 6. 与代理对话
- **接口路径**：`/api/v1/agents/{agent_id}/completions`
- **方法**：POST
- **描述**：向指定代理提问，进行AI对话。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `agent_id` (string, 必填)：代理ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | question | string | 是 | 问题内容 |
  | stream | boolean | 否 | 是否流式输出 |
  | session_id | string | 否 | 会话ID |
  | user_id | string | 否 | 用户自定义ID |
  | sync_dsl | boolean | 否 | 是否同步DSL |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/agents/{agent_id}/completions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"question": "Hello", "stream": true, "session_id": "sessionid"}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"answer": "Hi! ...", "session_id": "xxx", ...}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "`question` is required."}
~~~

### 7. 列表代理会话
- **接口路径**：`/api/v1/agents/{agent_id}/sessions`
- **方法**：GET
- **描述**：列出与指定代理关联的会话。
- **请求头**：
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `agent_id` (string, 必填)：代理ID
- **查询参数**：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | page | integer | 否 | 页码，默认1 |
  | page_size | integer | 否 | 每页数量，默认30 |
  | orderby | string | 否 | 排序字段 |
  | desc | boolean | 否 | 是否降序 |
  | id | string | 否 | 会话ID |
  | user_id | string | 否 | 用户自定义ID |
  | dsl | boolean | 否 | 是否包含dsl字段 |
- **接口使用示例**：
~~~shell
curl --request GET \
     --url http://{address}/api/v1/agents/{agent_id}/sessions?page=1&page_size=10 \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": [{"id": "xxx", ...}]}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "You don't own the agent ..."}
~~~

### 8. 删除代理的会话
- **接口路径**：`/api/v1/agents/{agent_id}/sessions`
- **方法**：DELETE
- **描述**：按ID删除代理的会话。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `agent_id` (string, 必填)：代理ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | ids | list[string] | 否 | 要删除的会话ID列表 |
- **接口使用示例**：
~~~shell
curl --request DELETE \
     --url http://{address}/api/v1/agents/{agent_id}/sessions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"ids": ["id1", "id2"]}'
~~~
- **响应示例**：
~~~json
{"code": 0}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "The agent doesn't own the session ..."}
~~~

### 9. 生成相关问题
- **接口路径**：`/v1/sessions/related_questions`
- **方法**：POST
- **描述**：从用户原始查询生成相关问题。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_LOGIN_TOKEN>`
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | question | string | 是 | 原始用户问题 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/v1/sessions/related_questions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_LOGIN_TOKEN>' \
     --data '{"question": "What are the key advantages of Neovim over Vim?"}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": ["What makes Neovim superior to Vim in terms of features?", ...], "message": "success"}
~~~
- **失败响应**：
~~~json
{"code": 401, "message": "<Unauthorized '401: Unauthorized'>"}
~~~

### 10. 与聊天助手对话
- **接口路径**：`/api/v1/chats/{chat_id}/completions`
- **方法**：POST
- **描述**：向指定的聊天助理提问，以开始人工智能驱动的对话。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `chat_id` (string, 必填)：聊天助理ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | question | string | 是 | 问题内容 |
  | stream | boolean | 否 | 是否流式输出 |
  | session_id | string | 否 | 会话ID |
  | user_id | string | 否 | 用户自定义ID |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/chats/{chat_id}/completions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"question": "Who are you", "stream": true, "session_id": "sessionid"}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": {"answer": "Hi! I'm your assistant...", "session_id": "xxx", ...}}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "Please input your question."}
~~~

---

## 代理管理

### 1. 列表代理
- **接口路径**：`/api/v1/agents`
- **方法**：GET
- **描述**：列出代理。
- **请求头**：
  - `Authorization: Bearer <YOUR_API_KEY>`
- **查询参数**：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | page | integer | 否 | 页码，默认1 |
  | page_size | integer | 否 | 每页数量，默认30 |
  | orderby | string | 否 | 排序字段 |
  | desc | boolean | 否 | 是否降序 |
  | id | string | 否 | 代理ID |
  | name | string | 否 | 代理名称 |
- **接口使用示例**：
~~~shell
curl --request GET \
     --url http://{address}/api/v1/agents?page=1&page_size=10 \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": [{"id": "xxx", ...}]}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "The agent doesn't exist."}
~~~

### 2. 创建代理
- **接口路径**：`/api/v1/agents`
- **方法**：POST
- **描述**：创建一个代理。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | title | string | 是 | 代理标题 |
  | description | string | 否 | 代理描述 |
  | dsl | object | 是 | 代理画布DSL对象 |
- **接口使用示例**：
~~~shell
curl --request POST \
     --url http://{address}/api/v1/agents \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"title": "Test Agent", "description": "A test agent", "dsl": {}}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": true, "message": "success"}
~~~
- **失败响应**：
~~~json
{"code": 102, "message": "Agent with title test already exists."}
~~~

### 3. 更新代理
- **接口路径**：`/api/v1/agents/{agent_id}`
- **方法**：PUT
- **描述**：按ID更新代理。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `agent_id` (string, 必填)：代理ID
- **请求体**（JSON）：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | title | string | 否 | 代理标题 |
  | description | string | 否 | 代理描述 |
  | dsl | object | 否 | 代理画布DSL对象 |
- **接口使用示例**：
~~~shell
curl --request PUT \
     --url http://{address}/api/v1/agents/{agent_id} \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{"title": "Test Agent", "description": "A test agent", "dsl": {}}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": true, "message": "success"}
~~~
- **失败响应**：
~~~json
{"code": 103, "message": "Only owner of canvas authorized for this operation."}
~~~

### 4. 删除代理
- **接口路径**：`/api/v1/agents/{agent_id}`
- **方法**：DELETE
- **描述**：按身份删除代理。
- **请求头**：
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_API_KEY>`
- **路径参数**：
  - `agent_id` (string, 必填)：代理ID
- **接口使用示例**：
~~~shell
curl --request DELETE \
     --url http://{address}/api/v1/agents/{agent_id} \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{}'
~~~
- **响应示例**：
~~~json
{"code": 0, "data": true, "message": "success"}
~~~
- **失败响应**：
~~~json
{"code": 103, "message": "Only owner of canvas authorized for this operation."}
~~~

---

## 错误码

| 代码 | 信息 | 描述 |
|------|------|------|
| 400  | 错误请求         | 请求参数无效         |
| 401  | 未经授权的       | 未经授权的访问       |
| 403  | 禁止的           | 访问被拒绝           |
| 404  | 未找到           | 未找到资源           |
| 500  | 内部服务器错误   | 服务器内部错误       |
| 1001 | 块ID无效         | 块ID无效             |
| 1002 | 块更新失败       | 块更新失败           |
