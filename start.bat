@echo off
echo ========================================
echo    实时汇率查询网站启动器
echo ========================================
echo.
echo 正在启动本地服务器...
echo.

REM 检查是否安装了Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo 使用Python启动服务器...
    echo 服务器地址: http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    start http://localhost:8000
    python -m http.server 8000
) else (
    REM 检查是否安装了Node.js
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo 使用Node.js启动服务器...
        echo 服务器地址: http://localhost:3000
        echo 按 Ctrl+C 停止服务器
        echo.
        start http://localhost:3000
        npx serve . -p 3000
    ) else (
        echo 未找到Python或Node.js，请安装其中一个来运行本地服务器
        echo.
        echo 或者直接双击 index.html 文件在浏览器中打开
        echo （注意：某些功能可能需要HTTP服务器才能正常工作）
        echo.
        pause
    )
)