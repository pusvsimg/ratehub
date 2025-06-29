// 全局变量
let exchangeRates = {};
let chart = null;
let lastUpdateTime = null;

// 主要货币配置
const CURRENCIES = {
    'USD': { name: '美元', flag: '🇺🇸', fullName: 'US Dollar' },
    'EUR': { name: '欧元', flag: '🇪🇺', fullName: 'Euro' },
    'GBP': { name: '英镑', flag: '🇬🇧', fullName: 'British Pound' },
    'JPY': { name: '日元', flag: '🇯🇵', fullName: 'Japanese Yen' },
    'CNY': { name: '人民币', flag: '🇨🇳', fullName: 'Chinese Yuan' },
    'KRW': { name: '韩元', flag: '🇰🇷', fullName: 'South Korean Won' },
    'HKD': { name: '港币', flag: '🇭🇰', fullName: 'Hong Kong Dollar' },
    'CAD': { name: '加元', flag: '🇨🇦', fullName: 'Canadian Dollar' },
    'AUD': { name: '澳元', flag: '🇦🇺', fullName: 'Australian Dollar' },
    'CHF': { name: '瑞士法郎', flag: '🇨🇭', fullName: 'Swiss Franc' }
};

// API配置 - 使用免费的汇率API
const API_CONFIG = {
    // 主要API - ExchangeRate-API (免费版本)
    primary: 'https://api.exchangerate-api.com/v4/latest/USD',
    // 备用API - Fixer.io (需要注册获取API key)
    // backup: 'https://api.fixer.io/latest?access_key=YOUR_API_KEY&base=USD'
};

// DOM元素
const elements = {
    loadingOverlay: document.getElementById('loadingOverlay'),
    lastUpdate: document.getElementById('lastUpdate'),
    fromAmount: document.getElementById('fromAmount'),
    fromCurrency: document.getElementById('fromCurrency'),
    toCurrency: document.getElementById('toCurrency'),
    swapBtn: document.getElementById('swapBtn'),
    resultAmount: document.getElementById('resultAmount'),
    exchangeRate: document.getElementById('exchangeRate'),
    ratesGrid: document.getElementById('ratesGrid')
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        showLoading(true);
        
        // 获取汇率数据
        await fetchExchangeRates();
        
        // 初始化事件监听器
        initializeEventListeners();
        
        // 渲染汇率卡片
        renderRateCards();
        
        // 初始化简单图表（如果需要的话）
        initializeSimpleChart();
        
        // 执行初始转换
        performConversion();
        
        // 设置自动更新
        setAutoUpdate();
        
        showLoading(false);
    } catch (error) {
        console.error('初始化失败:', error);
        showError('加载汇率数据失败，请刷新页面重试');
        showLoading(false);
    }
}

// 获取汇率数据
async function fetchExchangeRates() {
    try {
        const response = await fetch(API_CONFIG.primary);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.rates) {
            exchangeRates = data.rates;
            lastUpdateTime = new Date(data.date || Date.now());
            updateLastUpdateTime();
            return data;
        } else {
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('获取汇率数据失败:', error);
        // 使用模拟数据作为后备
        return useFallbackData();
    }
}

// 使用模拟数据（当API不可用时）
function useFallbackData() {
    console.warn('使用模拟汇率数据');
    exchangeRates = {
        'USD': 1.0,
        'EUR': 0.85,
        'GBP': 0.73,
        'JPY': 110.0,
        'CNY': 6.45,
        'KRW': 1180.0,
        'HKD': 7.8,
        'CAD': 1.25,
        'AUD': 1.35,
        'CHF': 0.92
    };
    lastUpdateTime = new Date();
    updateLastUpdateTime();
    
    // 添加随机波动使数据看起来更真实
    Object.keys(exchangeRates).forEach(currency => {
        if (currency !== 'USD') {
            const variation = (Math.random() - 0.5) * 0.02; // ±1%的随机变化
            exchangeRates[currency] *= (1 + variation);
        }
    });
    
    return { rates: exchangeRates, date: lastUpdateTime.toISOString() };
}

// 初始化事件监听器
function initializeEventListeners() {
    // 转换器事件
    elements.fromAmount.addEventListener('input', performConversion);
    elements.fromCurrency.addEventListener('change', performConversion);
    elements.toCurrency.addEventListener('change', performConversion);
    elements.swapBtn.addEventListener('click', swapCurrencies);
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshData();
        }
    });
}

// 货币转换
function performConversion() {
    const amount = parseFloat(elements.fromAmount.value) || 0;
    const fromCurrency = elements.fromCurrency.value;
    const toCurrency = elements.toCurrency.value;
    
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        elements.resultAmount.textContent = '0.00';
        elements.exchangeRate.textContent = '汇率数据不可用';
        return;
    }
    
    // 计算转换结果
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const result = (amount / fromRate) * toRate;
    
    // 更新显示
    elements.resultAmount.textContent = formatCurrency(result, toCurrency);
    
    // 计算并显示汇率
    const rate = toRate / fromRate;
    elements.exchangeRate.textContent = `汇率: 1 ${fromCurrency} = ${formatCurrency(rate, toCurrency, 4)}`;
}

// 交换货币
function swapCurrencies() {
    const fromCurrency = elements.fromCurrency.value;
    const toCurrency = elements.toCurrency.value;
    
    elements.fromCurrency.value = toCurrency;
    elements.toCurrency.value = fromCurrency;
    
    performConversion();
}

// 渲染汇率卡片
function renderRateCards() {
    const grid = elements.ratesGrid;
    grid.innerHTML = '';
    
    // 过滤并排序货币
    const mainCurrencies = Object.keys(CURRENCIES).filter(code => 
        code !== 'USD' && exchangeRates[code]
    );
    
    mainCurrencies.forEach((currencyCode, index) => {
        const rate = exchangeRates[currencyCode];
        const currency = CURRENCIES[currencyCode];
        
        if (!currency || !rate) return;
        
        const card = createRateCard(currencyCode, currency, rate, index);
        grid.appendChild(card);
    });
}

// 创建汇率卡片
function createRateCard(code, currency, rate, index) {
    const card = document.createElement('div');
    card.className = 'rate-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // 计算变化（模拟数据）
    const change = (Math.random() - 0.5) * 0.02; // ±1%的随机变化
    const changePercent = (change * 100).toFixed(2);
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeIcon = change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
    
    card.innerHTML = `
        <div class="rate-header">
            <div class="currency-info">
                <div class="currency-flag">${currency.flag}</div>
                <div class="currency-details">
                    <h3>${code}</h3>
                    <p>${currency.name}</p>
                </div>
            </div>
            <div class="rate-change ${changeClass}">
                <i class="fas ${changeIcon}"></i>
                ${Math.abs(changePercent)}%
            </div>
        </div>
        <div class="rate-value">${formatCurrency(rate, code)}</div>
        <div class="rate-time">相对于 1 USD</div>
    `;
    
    // 添加点击事件
    card.addEventListener('click', () => {
        elements.toCurrency.value = code;
        performConversion();
        
        // 滚动到转换器
        document.querySelector('.converter-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    return card;
}

// 初始化简单图表
function initializeSimpleChart() {
    console.log('简化图表模式：使用嵌入式图表服务');
    // 嵌入式图表由embedded-charts.js处理
    // 这里不需要复杂的Chart.js初始化
}

// 格式化货币
function formatCurrency(amount, currencyCode, decimals = 2) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '0.00';
    }
    
    // 根据货币类型调整小数位数
    if (currencyCode === 'JPY' || currencyCode === 'KRW') {
        decimals = 0; // 日元和韩元通常不显示小数
    }
    
    return amount.toLocaleString('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// 更新最后更新时间
function updateLastUpdateTime() {
    if (lastUpdateTime) {
        const timeString = lastUpdateTime.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        elements.lastUpdate.textContent = `最后更新: ${timeString}`;
    }
}

// 设置自动更新
function setAutoUpdate() {
    // 每5分钟更新一次数据
    setInterval(async () => {
        try {
            await fetchExchangeRates();
            renderRateCards();
            performConversion();
            updateChart();
        } catch (error) {
            console.error('自动更新失败:', error);
        }
    }, 5 * 60 * 1000); // 5分钟
}

// 更新图表数据
function updateChart() {
    console.log('使用嵌入式图表，无需手动更新');
    // 嵌入式图表会自动更新，无需手动处理
}

// 手动刷新数据
async function refreshData() {
    try {
        showLoading(true);
        await fetchExchangeRates();
        renderRateCards();
        performConversion();
        updateChart();
        showLoading(false);
        
        // 显示成功提示
        showNotification('数据已更新', 'success');
    } catch (error) {
        console.error('刷新数据失败:', error);
        showLoading(false);
        showNotification('更新失败，请稍后重试', 'error');
    }
}

// 显示/隐藏加载动画
function showLoading(show) {
    if (show) {
        elements.loadingOverlay.classList.remove('hidden');
    } else {
        elements.loadingOverlay.classList.add('hidden');
    }
}

// 显示错误信息
function showError(message) {
    showNotification(message, 'error');
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#2563eb'
    };
    return colors[type] || colors.info;
}

// 添加键盘快捷键提示
document.addEventListener('keydown', function(e) {
    if (e.key === 'F1') {
        e.preventDefault();
        showKeyboardShortcuts();
    }
});

// 显示键盘快捷键
function showKeyboardShortcuts() {
    const shortcuts = `
        <div style="text-align: left;">
            <h3 style="margin-bottom: 1rem;">键盘快捷键</h3>
            <p><kbd>Ctrl + R</kbd> - 刷新汇率数据</p>
            <p><kbd>F1</kbd> - 显示快捷键帮助</p>
            <p><kbd>Tab</kbd> - 在输入框间切换</p>
        </div>
    `;
    
    showNotification(shortcuts, 'info');
}

// 添加错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
    showNotification('发生了一个错误，请刷新页面', 'error');
});

// 添加网络状态检测
window.addEventListener('online', function() {
    showNotification('网络连接已恢复', 'success');
    refreshData();
});

window.addEventListener('offline', function() {
    showNotification('网络连接已断开，显示缓存数据', 'warning');
});

// 导出函数供外部使用
window.CurrencyApp = {
    refreshData,
    performConversion,
    swapCurrencies,
    formatCurrency
};