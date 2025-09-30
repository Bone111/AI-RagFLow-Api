# OpenMemory API 接口文档

## 基本信息
- 标题：OpenMemory API
- 版本：0.1.0

---

## 目录
- [MCP SSE 接口](#mcp-相关接口)
- [记忆（Memories）相关接口](#记忆memories相关接口)
- [应用（Apps）相关接口](#应用apps相关接口)
- [统计（Stats）相关接口](#统计stats相关接口)
- [配置（Config）相关接口](#配置config相关接口)

---

## MCP 相关接口

### 1. SSE 连接
- **接口路径**：`/mcp/{client_name}/sse/{user_id}`
- **方法**：GET
- **描述**：为指定用户和客户端处理 SSE（Server-Sent Events）连接。
- **路径参数**：
  - `client_name` (string)：客户端名称
  - `user_id` (string)：用户ID
- **响应**：
  - 200：成功，返回 JSON 对象
- **接口使用示例**：
~~~python
def init_config(user_id: str, client_name: str):
    """初始化配置信息"""
    llm_cfg = {
        'model': 'qwen-plus',
        "openai_base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        'api_key': 'sk-***'
    }
    tools = [{
        "mcpServers": {
            "openmemory": {
                "url": f"http://localhost:3010/mcp/{client_name}/sse/{user_id}"
            }
        }
    }]

    return llm_cfg, tools

def chat(user_id='user_000', client_name='app_000', query:Optional[str] = None):
    """主函数，程序入口"""
    llm_cfg, tools = init_config(user_id)

    agent = Assistant(
        llm=llm_cfg,
        function_list=tools,
    )
~~~

---

## 记忆（Memories）相关接口

### 1. 创建记忆
- **接口路径**：`/api/v1/memories/`
- **方法**：POST
- **描述**：创建新的记忆。
- **请求体**（JSON）：
  - `user_id` (string, 必填)：用户ID
  - `text` (string, 必填)：记忆内容
  - `metadata` (object, 可选)：元数据，默认为空对象
  - `infer` (boolean, 可选, 默认true)：是否推理
  - `app` (string, 可选, 默认"openmemory")：应用名
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/memories/' \
  -H 'Content-Type: application/json' \
  --data-raw '{"user_id":"user001","text":"爱吃瓜子","infer":false,"app":"openmemory"}'
~~~
~~~json
{
    "id": "ad7d48ac-9f0d-419c-888f-c41b30b46035",
    "user_id": "78804477-ef5c-474f-8352-1398a7d8daf2",
    "content": "爱吃瓜子",
    "state": "active",
    "updated_at": "2025-07-11T09:09:44.690111",
    "deleted_at": null,
    "app_id": "30e92abc-b381-4a17-a4a2-18b24ce1f568",
    "vector": null,
    "metadata_": {},
    "created_at": "2025-07-11T09:09:44.690108",
    "archived_at": null
}
~~~

### 2. 批量删除记忆
- **接口路径**：`/api/v1/memories/`
- **方法**：DELETE
- **描述**：批量删除记忆。
- **请求体**（JSON）：
  - `memory_ids` (array[string], 必填)：记忆ID列表
  - `user_id` (string, 必填)：用户ID
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/memories/' \
  -X 'DELETE' \
  --data-raw '{"memory_ids":["539b9dba-059d-4fd4-9706-ffe3494df420","875d3ee4-ad2b-433b-8d6f-e3b965733449"],"user_id":"user001"}'
~~~
~~~json
{"message":"Successfully deleted 2 memories"}
~~~

### 3. 获取记忆详情
- **接口路径**：`/api/v1/memories/{memory_id}`
- **方法**：GET
- **描述**：获取指定记忆的详细信息。
- **路径参数**：
  - `memory_id` (string, uuid, 必填)：记忆ID
- **响应**：
  - 200：成功，返回记忆详情
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/memories/7f3e525b-cd80-40b0-b1c8-176b73e71499?user_id=user001'
~~~
~~~json
{
    "id": "7f3e525b-cd80-40b0-b1c8-176b73e71499",
    "text": "爱吃西瓜",
    "created_at": 1752111295,
    "state": "active",
    "app_id": "8bfae13e-3eee-4845-8cc5-d2339f96a4d6",
    "app_name": "openmemory",
    "categories": [
        "preferences"
    ],
    "metadata_": {}
}
~~~


### 4. 更新记忆
- **接口路径**：`/api/v1/memories/{memory_id}`
- **方法**：PUT
- **描述**：更新指定记忆内容。
- **路径参数**：
  - `memory_id` (string, uuid, 必填)：记忆ID
- **请求体**（JSON）：
  - `memory_content` (string, 必填)：新的记忆内容
  - `user_id` (string, 必填)：用户ID
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/memories/7f3e525b-cd80-40b0-b1c8-176b73e71499' \
  -X 'PUT' \
  -H 'Content-Type: application/json' \
  --data-raw '{"memory_id":"7f3e525b-cd80-40b0-b1c8-176b73e71499","memory_content":"喜欢吃香蕉","user_id":"user001"}'
~~~
~~~json
{
    "user_id": "986181fb-0fbd-46d3-9e05-0a5e8787835f",
    "id": "7f3e525b-cd80-40b0-b1c8-176b73e71499",
    "content": "喜欢吃香蕉",
    "state": "active",
    "updated_at": "2025-07-10T09:47:17.829526",
    "deleted_at": null,
    "app_id": "8bfae13e-3eee-4845-8cc5-d2339f96a4d6",
    "vector": null,
    "metadata_": {},
    "created_at": "2025-07-10T09:34:55.790043",
    "archived_at": null
}
~~~



### 5. 获取记忆访问日志
- **接口路径**：`/api/v1/memories/{memory_id}/access-log`
- **方法**：GET
- **描述**：获取指定记忆的访问日志。
- **路径参数**：
  - `memory_id` (string, uuid, 必填)：记忆ID
- **查询参数**：
  - `page` (integer, 可选, 默认1)：页码
  - `page_size` (integer, 可选, 默认10, 最大100)：每页数量
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/memories/fdc123df-3085-4078-a060-7d36ddc5e59e/access-log?page=1&page_size=10'
~~~
~~~json
{
    "total": 1,
    "page": 1,
    "page_size": 10,
    "logs": [
        {
            "id": "0868042a-4903-44f0-9f4a-290b74288d44",
            "memory_id": "fdc123df-3085-4078-a060-7d36ddc5e59e",
            "accessed_at": "2025-07-10T09:59:18.353011",
            "app_id": "02616c5b-ddea-4ee8-87f5-4491940da6c0",
            "access_type": "search",
            "metadata_": {
                "query": "西瓜",
                "score": 0.70272774,
                "hash": "ba7387c2007b8ed62bdc1224e762cc78"
            },
            "app_name": "openmemory"
        }
    ]
}
~~~


### 6. 获取相关记忆
- **接口路径**：`/api/v1/memories/{memory_id}/related`
- **方法**：GET
- **描述**：获取与指定记忆相关的记忆。
- **路径参数**：
  - `memory_id` (string, uuid, 必填)：记忆ID
- **查询参数**：
  - `user_id` (string, 必填)：用户ID
  - `page` (integer, 可选, 默认1)：页码
  - `size` (integer, 可选, 默认50, 最大100)：每页数量
- **响应**：
  - 200：成功，返回相关记忆
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/memories/e04f3901-736b-43d3-8034-9af560e6d8ab/related?user_id=user001'
~~~
~~~json
{
    "items": [
        {
            "id": "fdc123df-3085-4078-a060-7d36ddc5e59e",
            "content": "爱吃西瓜",
            "created_at": 1752112489,
            "state": "active",
            "app_id": "30e92abc-b381-4a17-a4a2-18b24ce1f568",
            "app_name": "openmemory",
            "categories": [
                "preferences"
            ],
            "metadata_": {}
        }
    ],
    "total": 1,
    "page": 1,
    "size": 5,
    "pages": 1
}
~~~

### 7. 获取记忆类别
- **接口路径**：`/api/v1/memories/categories`
- **方法**：GET
- **描述**：获取指定用户的记忆类别。
- **查询参数**：
  - `user_id` (string, 必填)：用户ID
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/memories/categories?user_id=user001'
~~~
~~~json
{
    "categories": [
        {
            "name": "personal",
            "description": "Automatically created category for personal",
            "updated_at": "2025-07-11T02:54:55.851583",
            "id": "10eb0e0a-16ba-4967-93cb-cce58041ecca",
            "created_at": "2025-07-11T02:43:27.762444"
        },
        {
            "name": "preferences",
            "description": "Automatically created category for preferences",
            "updated_at": "2025-07-10T09:54:50.041474",
            "id": "77cda957-c28d-4981-8490-0d95e426d19b",
            "created_at": "2025-07-10T09:54:26.252014"
        },
        {
            "name": "health",
            "description": "Automatically created category for health",
            "updated_at": "2025-07-11T02:54:48.186276",
            "id": "be9875f2-ceda-4bc6-b3a9-a82f0d69bf39",
            "created_at": "2025-07-11T02:43:27.762444"
        }
    ],
    "total": 3
}
~~~

### 8. 暂停记忆
- **接口路径**：`/api/v1/memories/actions/pause`
- **方法**：POST
- **描述**：暂停指定记忆。
- **请求体**（JSON）：
  - `user_id` (string, 必填)：用户ID
  - `state` (string, 必填)：状态 code active，paused，archived，deleted
  - 其他可选参数：memory_ids, category_ids, app_id, all_for_app, global_pause, state
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/memories/actions/pause' \
  --data-raw '{"memory_ids":["539b9dba-059d-4fd4-9706-ffe3494df420","875d3ee4-ad2b-433b-8d6f-e3b965733449","3294ae31-6e68-4090-835a-432b8158f52f"],"all_for_app":true,"state":"paused","user_id":"user001"}'
~~~
~~~json
{"message":"Successfully paused all memories"}
~~~

### 9. 记忆列表
- **接口路径**：`/api/v1/memories/filter`
- **方法**：POST
- **描述**：根据条件过滤记忆。
- **查询参数**：
  - `page` (integer, 可选, 默认1)：页码
  - `size` (integer, 可选, 默认50, 最大100)：每页数量
- **请求体**（JSON）：
  - 详见 FilterMemoriesRequest 结构
- **响应**：
  - 200：成功，返回分页的记忆对象
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/memories/filter' \
  --data-raw '{"user_id":"user001","page":1,"size":10,"app_ids":["30e92abc-b381-4a17-a4a2-18b24ce1f568"],"category_ids":[],"sort_column":"memory","sort_direction":"asc","search_query":"西瓜"}'
~~~
~~~json
{
    "items": [
        {
            "id": "7f3e525b-cd80-40b0-b1c8-176b73e71499",
            "content": "爱吃西瓜",
            "created_at": 1752111295,
            "state": "active",
            "app_id": "8bfae13e-3eee-4845-8cc5-d2339f96a4d6",
            "app_name": "openmemory",
            "categories": [
                "preferences"
            ],
            "metadata_": {}
        }
    ],
    "total": 1,
    "page": 1,
    "size": 10,
    "pages": 1
}
~~~

---

## 应用（Apps）相关接口

### 1. 应用列表
- **接口路径**：`/api/v1/apps/`
- **方法**：GET
- **描述**：获取应用列表，支持筛选、排序和分页。
- **查询参数**：
  - `name` (string, 可选)：应用名称
  - `is_active` (boolean, 可选)：是否激活
  - `sort_by` (string, 可选, 默认"name")：排序字段
  - `sort_direction` (string, 可选, 默认"asc")：排序方向
  - `page` (integer, 可选, 默认1)：页码
  - `page_size` (integer, 可选, 默认10, 最大100)：每页数量
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/apps/?page=1&page_size=10&sort_by=name&sort_direction=asc'
~~~
~~~json
{
    "total": 2,
    "page": 1,
    "page_size": 10,
    "apps": [
        {
            "id": "30e92abc-b381-4a17-a4a2-18b24ce1f568",
            "name": "openmemory",
            "is_active": true,
            "total_memories_created": 5,
            "total_memories_accessed": 0
        },
        {
            "id": "02616c5b-ddea-4ee8-87f5-4491940da6c0",
            "name": "openmemory",
            "is_active": true,
            "total_memories_created": 0,
            "total_memories_accessed": 1
        }
    ]
}
~~~


### 2. 获取应用详情
- **接口路径**：`/api/v1/apps/{app_id}`
- **方法**：GET
- **描述**：获取指定应用的详细信息。
- **路径参数**：
  - `app_id` (string, uuid, 必填)：应用ID
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/apps/30e92abc-b381-4a17-a4a2-18b24ce1f568'
~~~
~~~json
{
    "is_active": true,
    "total_memories_created": 5,
    "total_memories_accessed": 0,
    "first_accessed": null,
    "last_accessed": null
}
~~~

### 3. 更新应用详情
- **接口路径**：`/api/v1/apps/{app_id}`
- **方法**：PUT
- **描述**：更新指定应用的激活状态。
- **路径参数**：
  - `app_id` (string, uuid, 必填)：应用ID
- **查询参数**：
  - `is_active` (boolean, 必填)：是否激活
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/apps/02616c5b-ddea-4ee8-87f5-4491940da6c0?is_active=false' \
  -X 'PUT'
~~~json
{"status":"success","message":"Updated app details successfully"}
~~~

### 4. 获取应用下的记忆
- **接口路径**：`/api/v1/apps/{app_id}/memories`
- **方法**：GET
- **描述**：获取指定应用下的记忆列表。
- **路径参数**：
  - `app_id` (string, uuid, 必填)：应用ID
- **查询参数**：
  - `page` (integer, 可选, 默认1)：页码
  - `page_size` (integer, 可选, 默认10, 最大100)：每页数量
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/apps/30e92abc-b381-4a17-a4a2-18b24ce1f568/memories?page=1&page_size=10'
~~~
~~~json
{
    "total": 2,
    "page": 1,
    "page_size": 10,
    "memories": [
        {
            "id": "e04f3901-736b-43d3-8034-9af560e6d8ab",
            "content": "爱吃香蕉",
            "created_at": "2025-07-10T10:01:30.493960",
            "state": "active",
            "app_id": "30e92abc-b381-4a17-a4a2-18b24ce1f568",
            "categories": [
                "preferences"
            ],
            "metadata_": {}
        },
        {
            "id": "fdc123df-3085-4078-a060-7d36ddc5e59e",
            "content": "爱吃西瓜",
            "created_at": "2025-07-10T09:54:49.506548",
            "state": "active",
            "app_id": "30e92abc-b381-4a17-a4a2-18b24ce1f568",
            "categories": [
                "personal",
                "preferences"
            ],
            "metadata_": {}
        }
    ]
}
~~~

### 5. 获取应用访问过的记忆
- **接口路径**：`/api/v1/apps/{app_id}/accessed`
- **方法**：GET
- **描述**：获取指定应用访问过的记忆。
- **路径参数**：
  - `app_id` (string, uuid, 必填)：应用ID
- **查询参数**：
  - `page` (integer, 可选, 默认1)：页码
  - `page_size` (integer, 可选, 默认10, 最大100)：每页数量
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/apps/30e92abc-b381-4a17-a4a2-18b24ce1f568/accessed?page=1&page_size=10'
~~~json
{
    "total": 1,
    "page": 1,
    "page_size": 10,
    "memories": [
        {
            "memory": {
                "id": "fdc123df-3085-4078-a060-7d36ddc5e59e",
                "content": "爱吃西瓜",
                "created_at": "2025-07-10T09:54:49.506548",
                "state": "active",
                "app_id": "30e92abc-b381-4a17-a4a2-18b24ce1f568",
                "app_name": "openmemory",
                "categories": [
                    "personal",
                    "preferences"
                ],
                "metadata_": {}
            },
            "access_count": 1
        }
    ]
}
~~~

---

## 统计（Stats）相关接口

### 获取用户统计信息
- **接口路径**：`/api/v1/stats/`
- **方法**：GET
- **描述**：获取指定用户的统计信息。
- **查询参数**：
  - `user_id` (string, 必填)：用户ID
- **响应**：
  - 200：成功
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/stats/?user_id=user001'
~~~
~~~json
{
    "total_memories": 5,
    "total_apps": 1,
    "apps": [
        {
            "name": "openmemory",
            "metadata_": {},
            "is_active": true,
            "updated_at": "2025-07-11T06:28:15.876635",
            "owner_id": "78804477-ef5c-474f-8352-1398a7d8daf2",
            "id": "02616c5b-ddea-4ee8-87f5-4491940da6c0",
            "description": null,
            "created_at": "2025-07-10T09:59:18.063088"
        }
    ]
}
~~~

---

## 配置（Config）相关接口

### 1. 获取/更新配置
- **接口路径**：`/api/v1/config/`
- **方法**：GET
- **描述**：获取或更新当前配置。
- **请求体**（PUT）：
  - 详见 ConfigSchema-Input 结构
- **响应**：
  - 200：成功，返回配置内容
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/config/'
~~~json
{
    "openmemory": {
        "custom_instructions": null
    },
    "mem0": {
        "llm": {
            "provider": "openai",
            "config": {
                "model": "gpt-4o-mini",
                "temperature": 0.1,
                "max_tokens": 2000,
                "api_key": "env:OPENAI_API_KEY",
                "ollama_base_url": null
            }
        },
        "embedder": {
            "provider": "openai",
            "config": {
                "model": "text-embedding-3-small",
                "api_key": "env:OPENAI_API_KEY",
                "ollama_base_url": null
            }
        }
    }
}
~~~

### 2. 获取/更新配置（当前不可用）
- **接口路径**：`/api/v1/config/`
- **方法**：PUT
- **描述**：获取或更新当前配置。
- **请求体**（PUT）：
  - 详见 ConfigSchema-Input 结构
- **响应**：
  - 200：成功，返回配置内容
  - 422：参数校验失败
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/config/' \
  -X 'PUT' \
  --data-raw '{"openmemory":{"custom_instructions":null},"mem0":{"vector_store":{"provider":"qdrant","config":{"collection_name":"openmemory-api","host":"localhost","port":6333,"embedding_model_dims":1024}},"llm":{"provider":"openai","config":{"model":"qwen3-235b-a22b","openai_base_url":"https://maas-api.ai-yuanjing.com/openapi/compatible-mode/v1","api_key":"env:MAAS_KEY"}},"embedder":{"provider":"openai","config":{"model":"text-embedding-v4","openai_base_url":"https://dashscope.aliyuncs.com/compatible-mode/v1","embedding_dims":1024,"api_key":"sk-f96ae24934fd4a3fa8ce96d56fed7e00"}}}}'
~~~
~~~json
~~~

### 3. 重置配置
- **接口路径**：`/api/v1/config/reset`
- **方法**：POST
- **描述**：重置配置为默认值。
- **响应**：
  - 200：成功，返回配置内容
- **接口使用示例**：
~~~shell
curl 'http://localhost:3010/api/v1/config/reset' \
  -X 'POST' \
~~~
~~~json
{
    "openmemory": {
        "custom_instructions": null
    },
    "mem0": {
        "llm": {
            "provider": "openai",
            "config": {
                "model": "gpt-4o-mini",
                "temperature": 0.1,
                "max_tokens": 2000,
                "api_key": "env:OPENAI_API_KEY",
                "ollama_base_url": null
            }
        },
        "embedder": {
            "provider": "openai",
            "config": {
                "model": "text-embedding-3-small",
                "api_key": "env:OPENAI_API_KEY",
                "ollama_base_url": null
            }
        }
    }
}
~~~

---
