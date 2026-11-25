/**
 * 姓名：田武杰 | 学号：24002120205
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * AI 在线客服服务模块：调用硅基流动（或七牛）OpenAI 兼容接口
 * 服务商由 .env 中 AI_PROVIDER 决定：siliconflow / qiniu
 */

// 读取服务商配置，twjProvider 可为 'siliconflow' / 'qiniu'，缺省用 .env 的 AI_PROVIDER
function twjGetProviderConfig(twjProvider) {
  var twjName = (twjProvider || process.env.AI_PROVIDER || 'siliconflow').toLowerCase();
  if (twjName === 'qiniu') {
    return {
      twjName: twjName,
      twjBaseUrl: process.env.QINIU_CUSTOMER_SERVICE_BASE_URL,
      twjApiKey: process.env.QINIU_CUSTOMER_SERVICE_API_KEY,
      twjModel: process.env.QINIU_CUSTOMER_SERVICE_MODEL
    };
  }
  return {
    twjName: 'siliconflow',
    twjBaseUrl: process.env.SILICONFLOW_BASE_URL,
    twjApiKey: process.env.SILICONFLOW_API_KEY,
    twjModel: process.env.SILICONFLOW_MODEL
  };
}

// 客服系统提示词
var twjSystemPrompt =
  '你是"科技资讯全栈站"的在线客服小助手，姓名：田武杰（学号 24002120205）的 课程作业项目。' +
  '网站包含：科技新闻列表、图文列表、数据库连接测试等栏目，后端接口以 /api/ 开头，端口 8205。' +
  '请用简体中文回答，语气友好简洁，回答控制在 200 字以内；' +
  '遇到与网站无关的问题时，礼貌引导用户回到网站相关话题。';

// 调用 AI 接口，twjHistory 为 [{role, content}] 数组，twjProvider 可指定服务商
async function twjChat(twjHistory, twjProvider) {
  var twjConfig = twjGetProviderConfig(twjProvider);
  if (!twjConfig.twjApiKey || !twjConfig.twjBaseUrl || !twjConfig.twjModel) {
    throw new Error('AI 服务配置缺失，请检查 backend/.env');
  }

  var twjMessages = [{ role: 'system', content: twjSystemPrompt }].concat(twjHistory || []);

  var twjRequestBody = {
    model: twjConfig.twjModel,
    messages: twjMessages,
    temperature: 0.7,
    max_tokens: 500,
    stream: false
  };

  console.log('本次使用 AI 服务商：', twjConfig.twjName, '，模型：', twjConfig.twjModel);

  // 免费模型可能遇到 429 限流，最多重试 2 次
  var twjMaxTry = 3;
  for (var twjTry = 1; twjTry <= twjMaxTry; twjTry++) {
    var twjController = new AbortController();
    var twjTimer = setTimeout(function () { twjController.abort(); }, 30000);
    try {
      // 控制台输出发送给大模型的数据
      console.log('===== 发送给大模型的数据（第 ' + twjTry + ' 次请求） =====');
      console.log(JSON.stringify(twjRequestBody, null, 2));

      var twjRes = await fetch(twjConfig.twjBaseUrl + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + twjConfig.twjApiKey
        },
        body: JSON.stringify(twjRequestBody),
        signal: twjController.signal
      });

      var twjData = await twjRes.json();

      // 控制台输出接收自大模型的数据
      console.log('===== 接收自大模型的数据 =====');
      console.log(JSON.stringify(twjData, null, 2));

      if (twjRes.status === 429 && twjTry < twjMaxTry) {
        console.log('遇到 429 限流，' + (twjTry * 2) + ' 秒后重试...');
        await new Promise(function (twjResolve) { setTimeout(twjResolve, twjTry * 2000); });
        continue;
      }
      if (!twjRes.ok) {
        var twjErrMsg = (twjData && twjData.error && twjData.error.message) || ('HTTP ' + twjRes.status);
        throw new Error('AI 接口返回错误：' + twjErrMsg);
      }
      var twjReply = twjData.choices && twjData.choices[0] && twjData.choices[0].message && twjData.choices[0].message.content;
      if (!twjReply) {
        throw new Error('AI 接口未返回回复内容');
      }
      return twjReply.trim();
    } finally {
      clearTimeout(twjTimer);
    }
  }
  throw new Error('AI 接口多次限流（429），请稍后再试');
}

module.exports = { twjChat, twjGetProviderConfig, twjVision, twjAsr };

// 语音识别：优先七牛 QINIU_ASR_MODEL，模型不可用时降级到硅基流动 SILICONFLOW_ASR_MODEL
// twjBuffer 为音频文件 Buffer，twjFilename/twjMime 用于 multipart 上传
async function twjAsr(twjBuffer, twjFilename, twjMime) {
  var twjAttempts = [
    { twjName: 'qiniu', twjBaseUrl: process.env.QINIU_CUSTOMER_SERVICE_BASE_URL, twjApiKey: process.env.QINIU_CUSTOMER_SERVICE_API_KEY, twjModel: process.env.QINIU_ASR_MODEL || 'Qwen-Audio-3.0-ASR-Flash' },
    { twjName: 'siliconflow', twjBaseUrl: process.env.SILICONFLOW_BASE_URL, twjApiKey: process.env.SILICONFLOW_API_KEY, twjModel: process.env.SILICONFLOW_ASR_MODEL || 'Qwen/Qwen3-ASR-1.7B' }
  ];

  var twjLastError = null;
  for (var i = 0; i < twjAttempts.length; i++) {
    var twjCfg = twjAttempts[i];
    if (!twjCfg.twjBaseUrl || !twjCfg.twjApiKey) { continue; }

    console.log('===== ASR 尝试服务商：', twjCfg.twjName, '，模型：', twjCfg.twjModel, '=====');
    console.log('===== 发送给大模型的数据 =====');
    console.log(JSON.stringify({ provider: twjCfg.twjName, model: twjCfg.twjModel, audio_file: twjFilename, audio_size: twjBuffer.length, audio_mime: twjMime }, null, 2));

    try {
      var twjForm = new FormData();
      twjForm.append('file', new Blob([twjBuffer], { type: twjMime }), twjFilename);
      twjForm.append('model', twjCfg.twjModel);
      var twjRes = await fetch(twjCfg.twjBaseUrl + '/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + twjCfg.twjApiKey },
        body: twjForm
      });
      var twjData = await twjRes.json();

      console.log('===== 接收自大模型的数据 =====');
      console.log(JSON.stringify(twjData, null, 2));

      var twjErrText = twjData && twjData.error && twjData.error.message;
      if (!twjRes.ok) {
        twjLastError = new Error(twjErrText || ('HTTP ' + twjRes.status));
        // 模型不存在/无可用通道则尝试下一个服务商，其他错误直接抛出
        if (/no available channels|model_not_found|model does not exist/i.test(twjErrText || '')) {
          continue;
        }
        throw twjLastError;
      }
      var twjText = twjData.text;
      if (!twjText) {
        throw new Error('ASR 接口未返回识别文本');
      }
      return twjText.trim();
    } catch (twjErr) {
      twjLastError = twjErr;
      if (/no available channels|model_not_found|model does not exist/i.test(twjErr.message || '')) {
        continue;
      }
      throw twjErr;
    }
  }
  throw new Error('语音识别失败：' + (twjLastError ? twjLastError.message : '无可用服务商'));
}

// 图像识别：调用硅基流动视觉模型，twjImageDataUrl 为 data:image/...;base64,... 格式
async function twjVision(twjImageDataUrl, twjPrompt) {
  var twjBaseUrl = process.env.SILICONFLOW_BASE_URL;
  var twjApiKey = process.env.SILICONFLOW_API_KEY;
  var twjModel = process.env.SILICONFLOW_VISION_MODEL || 'Qwen/Qwen2.5-VL-7B-Instruct';
  if (!twjApiKey || !twjBaseUrl) {
    throw new Error('AI 服务配置缺失，请检查 backend/.env');
  }

  var twjRequestBody = {
    model: twjModel,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: twjPrompt },
          { type: 'image_url', image_url: { url: twjImageDataUrl } }
        ]
      }
    ],
    stream: false,
    max_tokens: 500
  };

  // 控制台输出发送给大模型的数据（base64 过长，截断显示）
  var twjLogBody = JSON.parse(JSON.stringify(twjRequestBody));
  twjLogBody.messages[0].content[1].image_url.url = twjImageDataUrl.slice(0, 60) + '...(base64 共 ' + twjImageDataUrl.length + ' 字符)';
  console.log('本次使用视觉模型：', twjModel);
  console.log('===== 发送给大模型的数据 =====');
  console.log(JSON.stringify(twjLogBody, null, 2));

  var twjController = new AbortController();
  var twjTimer = setTimeout(function () { twjController.abort(); }, 60000);
  try {
    var twjRes = await fetch(twjBaseUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + twjApiKey
      },
      body: JSON.stringify(twjRequestBody),
      signal: twjController.signal
    });
    var twjData = await twjRes.json();

    // 控制台输出接收自大模型的数据
    console.log('===== 接收自大模型的数据 =====');
    console.log(JSON.stringify(twjData, null, 2));

    if (!twjRes.ok) {
      var twjErrMsg = (twjData && twjData.error && twjData.error.message) || ('HTTP ' + twjRes.status);
      throw new Error('视觉模型接口返回错误：' + twjErrMsg);
    }
    var twjText = twjData.choices && twjData.choices[0] && twjData.choices[0].message && twjData.choices[0].message.content;
    if (!twjText) {
      throw new Error('视觉模型未返回描述内容');
    }
    return twjText.trim();
  } finally {
    clearTimeout(twjTimer);
  }
}
