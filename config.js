// 汇率网站配置文件
// 您可以修改这些设置来自定义网站行为

window.CurrencyConfig = {
    // API设置
    api: {
        // 主要API端点
        primary: 'https://api.exchangerate-api.com/v4/latest/USD',
        
        // 备用API端点（如果有的话）
        backup: null,
        
        // 请求超时时间（毫秒）
        timeout: 10000,
        
        // 重试次数
        retryCount: 3
    },
    
    // 更新设置
    update: {
        // 自动更新间隔（毫秒）- 默认5分钟
        interval: 5 * 60 * 1000,
        
        // 是否启用自动更新
        enabled: true,
        
        // 页面可见性检测（页面不可见时暂停更新）
        pauseWhenHidden: true
    },
    
    // 显示设置
    display: {
        // 默认基准货币
        baseCurrency: 'USD',
        
        // 默认转换货币对
        defaultFrom: 'USD',
        defaultTo: 'CNY',
        
        // 小数位数设置
        decimals: {
            default: 2,
            JPY: 0,  // 日元不显示小数
            KRW: 0   // 韩元不显示小数
        },
        
        // 动画设置
        animations: {
            enabled: true,
            duration: 300
        }
    },
    
    // 支持的货币列表
    currencies: {
        'USD': { name: '美元', flag: '🇺🇸', fullName: 'US Dollar', priority: 1 },
        'EUR': { name: '欧元', flag: '🇪🇺', fullName: 'Euro', priority: 2 },
        'GBP': { name: '英镑', flag: '🇬🇧', fullName: 'British Pound', priority: 3 },
        'JPY': { name: '日元', flag: '🇯🇵', fullName: 'Japanese Yen', priority: 4 },
        'CNY': { name: '人民币', flag: '🇨🇳', fullName: 'Chinese Yuan', priority: 5 },
        'KRW': { name: '韩元', flag: '🇰🇷', fullName: 'South Korean Won', priority: 6 },
        'HKD': { name: '港币', flag: '🇭🇰', fullName: 'Hong Kong Dollar', priority: 7 },
        'CAD': { name: '加元', flag: '🇨🇦', fullName: 'Canadian Dollar', priority: 8 },
        'AUD': { name: '澳元', flag: '🇦🇺', fullName: 'Australian Dollar', priority: 9 },
        'CHF': { name: '瑞士法郎', flag: '🇨🇭', fullName: 'Swiss Franc', priority: 10 }
    },
    
    // 图表设置
    chart: {
        // 历史数据天数
        historyDays: 7,
        
        // 图表颜色
        colors: [
            '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
            '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
        ],
        
        // 图表类型
        type: 'line',
        
        // 是否显示图表
        enabled: true
    },
    
    // 通知设置
    notifications: {
        // 是否启用通知
        enabled: true,
        
        // 通知显示时间（毫秒）
        duration: 3000,
        
        // 通知位置
        position: 'top-right'
    },
    
    // 缓存设置
    cache: {
        // 是否启用缓存
        enabled: true,
        
        // 缓存过期时间（毫秒）
        expiry: 10 * 60 * 1000, // 10分钟
        
        // 缓存键前缀
        prefix: 'currency_'
    },
    
    // 调试设置
    debug: {
        // 是否启用调试模式
        enabled: false,
        
        // 是否在控制台输出日志
        console: false,
        
        // 是否使用模拟数据
        useMockData: false
    },
    
    // 主题设置
    theme: {
        // 默认主题
        default: 'auto', // 'light', 'dark', 'auto'
        
        // 是否允许用户切换主题
        allowToggle: true
    },
    
    // 语言设置
    language: {
        // 默认语言
        default: 'zh-CN',
        
        // 支持的语言
        supported: ['zh-CN', 'en-US']
    }
};

// 如果您想添加新的货币，请在currencies对象中添加：
/*
'SGD': { name: '新加坡元', flag: '🇸🇬', fullName: 'Singapore Dollar', priority: 11 },
'THB': { name: '泰铢', flag: '🇹🇭', fullName: 'Thai Baht', priority: 12 },
*/

// 如果您想修改API端点，请更新api.primary：
/*
window.CurrencyConfig.api.primary = 'https://your-api-endpoint.com/latest/USD';
*/

// 如果您想修改更新频率，请更新update.interval：
/*
window.CurrencyConfig.update.interval = 10 * 60 * 1000; // 10分钟
*/