#!/bin/bash

# 检查pnpm是否安装，优先使用pnpm，否则用npm
if command -v pnpm &> /dev/null
then
    echo "检测到pnpm，使用pnpm安装依赖..."
    pnpm install
    echo "启动开发服务..."
    pnpm run dev
else
    echo "未检测到pnpm，使用npm安装依赖..."
    npm install --legacy-peer-deps
    echo "启动开发服务..."
    npm run dev
fi 
