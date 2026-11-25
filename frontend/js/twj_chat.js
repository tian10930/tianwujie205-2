// 姓名：田武杰 | 学号：24002120205
// 时间：2026-11-25 | 大模型：GLM-5.3-Flash
// 在线客服页面逻辑：调用 POST /api/chat，与 AI 对话

(function () {
  var twjBody = document.getElementById('twj_chat_body');
  var twjInput = document.getElementById('twj_chat_input');
  var twjSendBtn = document.getElementById('twj_chat_send');
  var twjQuickBox = document.getElementById('twj_quick');
  var twjProviderSelect = document.getElementById('twj_provider_select');
  var twjHistory = []; // 对话历史 [{role, content}]
  var twjSending = false;

  // 追加一条消息气泡，返回气泡元素
  function twjAppendMsg(twjRole, twjText) {
    var twjDiv = document.createElement('div');
    twjDiv.className = 'twj_msg ' + (twjRole === 'user' ? 'twj_msg_user' : 'twj_msg_ai');
    var twjBubble = document.createElement('div');
    twjBubble.className = 'twj_bubble';
    twjBubble.textContent = twjText;
    twjDiv.appendChild(twjBubble);
    twjBody.appendChild(twjDiv);
    twjBody.scrollTop = twjBody.scrollHeight;
    return twjBubble;
  }

  // 发送消息到后端 AI 接口
  function twjSendMsg(twjText) {
    if (twjSending) { return; }
    twjText = (twjText || '').trim();
    if (!twjText) {
      console.error('发送失败：消息为空');
      return;
    }
    twjSending = true;
    twjSendBtn.disabled = true;
    twjInput.value = '';

    twjAppendMsg('user', twjText);
    var twjLoadingBubble = twjAppendMsg('ai', '');
    twjLoadingBubble.classList.add('twj_bubble_twj_loading');
    twjLoadingBubble.textContent = '客服正在思考';

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twj_message: twjText,
        twj_history: twjHistory,
        twj_provider: twjProviderSelect ? twjProviderSelect.value : undefined
      })
    })
      .then(function (twjRes) { return twjRes.json(); })
      .then(function (twjData) {
        console.log('接口返回：', twjData);
        if (twjData.code === 0 && twjData.data && twjData.data.twj_reply) {
          twjHistory.push({ role: 'user', content: twjText });
          twjHistory.push({ role: 'assistant', content: twjData.data.twj_reply });
          twjLoadingBubble.classList.remove('twj_bubble_twj_loading');
          twjLoadingBubble.textContent = twjData.data.twj_reply;
          twjBody.scrollTop = twjBody.scrollHeight;
        } else {
          console.error('客服回复失败：', twjData.msg);
          twjLoadingBubble.classList.remove('twj_bubble_twj_loading');
          twjLoadingBubble.textContent = '抱歉，' + twjData.msg;
        }
      })
      .catch(function (twjErr) {
        console.error('请求异常：', twjErr);
        twjLoadingBubble.classList.remove('twj_bubble_twj_loading');
        twjLoadingBubble.textContent = '网络异常，请检查服务器是否启动';
      })
      .finally(function () {
        twjSending = false;
        twjSendBtn.disabled = false;
        twjInput.focus();
      });
  }

  twjSendBtn.addEventListener('click', function () { twjSendMsg(twjInput.value); });
  twjInput.addEventListener('keydown', function (twjEv) {
    if (twjEv.key === 'Enter') { twjSendMsg(twjInput.value); }
  });
  twjQuickBox.addEventListener('click', function (twjEv) {
    var twjTarget = twjEv.target;
    if (twjTarget.classList.contains('twj_quick_btn') && twjTarget.dataset.twjQ) {
      twjSendMsg(twjTarget.dataset.twjQ);
    }
  });

  console.log('在线客服页面已加载');
})();
