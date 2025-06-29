#!/bin/bash

echo "========================================"
echo "    实时汇率查询网站启动器"
echo "========================================"
echo ""
echo "正在启动本地服务器..."
echo ""

# 检查是否安装了Python
if command -v python3 &> /dev/null; then
    echo "使用Python3启动服务器..."
    echo "服务器地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    
    # 在后台打开浏览器
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000 &
    elif command -v open &> /dev/null; then
        open http://localhost:8000 &
    fi
    
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "使用Python启动服务器..."
    echo "服务器地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    
    # 在后台打开浏览器
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000 &
    elif command -v open &> /dev/null; then
        open http://localhost:8000 &
    fi
    
    python -m http.server 8000
elif command -v node &> /dev/null; then
    echo "使用Node.js启动服务器..."
    echo "服务器地址: http://localhost:3000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    
    # 在后台打开浏览器
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000 &
    elif command -v open &> /dev/null; then
        open http://localhost:3000 &
    fi
    
    npx serve . -p 3000
else
    echo "未找到Python或Node.js，请安装其中一个来运行本地服务器"
    echo ""
    echo "或者直接在浏览器中打开 index.html 文件"
    echo "（注意：某些功能可能需要HTTP服务器才能正常工作）"
    echo ""
    
    # 尝试直接打开文件
    if command -v xdg-open &> /dev/null; then
        xdg-open index.html
    elif command -v open &> /dev/null; then
        open index.html
    else
        echo "请手动在浏览器中打开 index.html 文件"
    fi
fi