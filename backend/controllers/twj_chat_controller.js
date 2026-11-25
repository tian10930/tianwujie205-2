/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 在线客服 Controller：处理 /api/chat 相关请求
 */
var twjAiService = require('../services/twj_ai_service');

// POST /api/chat 发送消息，返回 AI 回复
async function twjSend(twjReq, twjRes) {
  try {
    var twjBody = twjReq.body || {};
    var twjMessage = (twjBody.twj_message || '').trim();
    var twjHistory = Array.isArray(twjBody.twj_history) ? twjBody.twj_history : [];

    if (!twjMessage) {
      return twjRes.json({ code: 1, msg: '消息内容不能为空', data: null });
    }
    // 只保留最近 10 条历史，避免请求过长
    var twjTrimmed = twjHistory.slice(-10);

    var twjMsgList = [];
    for (var i = 0; i < twjTrimmed.length; i++) {
      var twjItem = twjTrimmed[i];
      if (twjItem && (twjItem.role === 'user' || twjItem.role === 'assistant') && twjItem.content) {
        twjMsgList.push({ role: twjItem.role, content: String(twjItem.content).slice(0, 1000) });
      }
    }
    twjMsgList.push({ role: 'user', content: twjMessage });

    console.log('客服收到消息：', twjMessage);
    var twjProvider = (twjBody.twj_provider || '').toLowerCase();
    var twjReply;
    try {
      twjReply = await twjAiService.twjChat(twjMsgList, twjProvider);
    } catch (twjLimitErr) {
      // 七牛免费模型限流时，自动降级到硅基流动兜底
      if (twjProvider === 'qiniu' && /429|限流|Too many/i.test(twjLimitErr.message)) {
        console.log('七牛限流，自动降级到硅基流动兜底');
        twjReply = await twjAiService.twjChat(twjMsgList, 'siliconflow');
        twjReply = '（七牛客服繁忙，已由备用客服为您接答）' + twjReply;
      } else {
        throw twjLimitErr;
      }
    }
    console.log('客服回复：', twjReply);

    twjRes.json({ code: 0, msg: '回复成功', data: { twj_reply: twjReply } });
  } catch (twjErr) {
    console.error('客服接口异常：', twjErr.message);
    twjRes.json({ code: 1, msg: '客服暂时无法回复：' + twjErr.message, data: null });
  }
}

module.exports = { twjSend };
