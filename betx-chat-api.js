// BETX Chat API - Pusher后端
const express = require('express');
const Pusher = require('pusher');
const cors = require('cors');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// Pusher配置
const pusher = new Pusher({
    appId: '2104331',
    key: 'd1be9ccf34959f12c212',
    secret: 'cb2ef4ec8551d004622d',
    cluster: 'ap1',
    useTLS: true
});

console.log('✅ Pusher已配置');

// AI回复函数
function getAIReply(message) {
    const lower = message.toLowerCase();
    
    if (lower.includes('订阅') || lower.includes('价格') || lower.includes('多少钱')) {
        return '📊 BETX年度订阅：$500 AUD/年<br><br>包含：<br>✅ 100+策略维度<br>✅ 实时预测推送<br>✅ 历史数据查看<br>✅ 奖金池分成<br>✅ 24/7客服支持<br><br>点击"复制转账信息"即可获取银行账户！';
    }
    
    if (lower.includes('转账') || lower.includes('支付') || lower.includes('银行')) {
        return '💳 银行转账信息：<br><br>公司：The Newbility PTY LTD<br>银行：Westpac<br>BSB：033-186<br>Account：742168<br>邮箱：contact@betxai.au<br><br>点击"复制转账信息"可快速复制！';
    }
    
    if (lower.includes('策略') || lower.includes('怎么用')) {
        return '⚛️ 策略矩阵使用说明：<br><br>🔺 红色代表正收益策略<br>🔻 绿色代表负收益策略<br><br>颜色深浅代表收益大小，越深收益越高。<br><br>订阅后可查看每个策略的详细分析和推荐！';
    }
    
    if (lower.includes('奖金池') || lower.includes('分成')) {
        return '💰 奖金池说明：<br><br>· 所有订阅用户共享奖金池<br>· 每月根据策略表现分配收益<br>· 当前累计：$45,678.50<br>· 本月增长：+8.6%<br><br>订阅后自动加入！';
    }
    
    if (lower.includes('人工') || lower.includes('客服')) {
        return '正在为您转接人工客服，请稍候...<br><br>工作时间：周一至周日 9:00-21:00 (AEST)<br>非工作时间请发邮件：contact@betxai.au';
    }
    
    if (lower.includes('联系') || lower.includes('邮箱')) {
        return '📞 联系方式：<br><br>📧 Email: contact@betxai.au<br>💬 WeChat: BETX_Support<br>📱 WhatsApp: +61 4XX XXX XXX<br><br>工作时间：周一至周日 9:00-21:00 (AEST)<br><br>需要人工客服？输入"人工客服"！';
    }
    
    return '感谢您的咨询！😊<br><br>我可以帮您了解：<br>· 订阅方案和转账方式<br>· 策略使用方法<br>· 奖金池分成机制<br>· 联系人工客服<br><br>请问还有什么可以帮到您？';
}

// 接收用户消息
app.post('/api/v1/chat/send', async (req, res) => {
    try {
        const { userId, message } = req.body;
        
        console.log('📨 收到消息:', userId, message);
        
        const reply = getAIReply(message);
        
        await pusher.trigger('chat-' + userId, 'new-message', {
            content: reply,
            timestamp: new Date().toISOString(),
            type: 'bot'
        });
        
        console.log('✅ 已推送回复给:', userId);
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('❌ 错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 客服发送消息
app.post('/api/v1/agent/send', async (req, res) => {
    try {
        const { userId, message, agentName } = req.body;
        
        await pusher.trigger('chat-' + userId, 'new-message', {
            content: message,
            timestamp: new Date().toISOString(),
            type: 'agent',
            agentName: agentName || '客服小美'
        });
        
        res.json({ success: true });
        
    } catch (error) {
        res.status(500).json({ error: '发送失败' });
    }
});

// 测试接口
app.get('/api/v1/test', (req, res) => {
    res.json({
        status: 'ok',
        message: 'BETX Chat API运行正常',
        pusher: 'connected',
        timestamp: new Date().toISOString()
    });
});

// 健康检查
app.get('/', (req, res) => {
    res.json({
        name: 'BETX Chat API',
        version: '1.0.0',
        status: 'running'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 BETX Chat API已启动');
    console.log(`📡 服务器运行在端口: ${PORT}`);
});
