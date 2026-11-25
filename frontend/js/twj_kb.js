// 姓名：田武杰 | 学号：24002120205
// 时间：2026-11-25 | 大模型：GLM-5.3-Flash
// 知识库管理与 RAG 问答页面逻辑

(function () {
  var twjFileList = document.getElementById('twj_file_list');
  var twjUploadBox = document.getElementById('twj_upload_box');
  var twjFileInput = document.getElementById('twj_file_input');
  var twjUploadStatus = document.getElementById('twj_upload_status');
  var twjChatBody = document.getElementById('twj_kb_chat_body');
  var twjInput = document.getElementById('twj_kb_input');
  var twjSendBtn = document.getElementById('twj_kb_send');
  var twjQuickBox = document.getElementById('twj_kb_quick');
  var twjHistory = [];
  var twjSending = false;

  // ===== 知识库文件管理 =====
  function twjLoadFiles() {
    fetch('/api/kb/files')
      .then(function (twjRes) { return twjRes.json(); })
      .then(function (twjData) {
        console.log('文件列表：', twjData);
        if (twjData.code !== 0) {
          twjFileList.innerHTML = '<div class="twj_kb_empty">' + twjData.msg + '</div>';
          return;
        }
        if (!twjData.data.length) {
          twjFileList.innerHTML = '<div class="twj_kb_empty">知识库还没有文件，请先上传</div>';
          return;
        }
        twjFileList.innerHTML = '';
        twjData.data.forEach(function (twjFile) {
          var twjItem = document.createElement('div');
          twjItem.className = 'twj_file_item';
          twjItem.innerHTML =
            '<div class="twj_file_name"></div>' +
            '<div class="twj_file_info"></div>' +
            '<div class="twj_file_ops">' +
            '<button class="twj_file_btn twj_chunk_btn" type="button">查看切片</button>' +
            '<button class="twj_file_btn twj_danger" type="button">删除</button>' +
            '</div>' +
            '<div class="twj_chunk_list"></div>';
          twjItem.querySelector('.twj_file_name').textContent = twjFile.twj_original_name;
          twjItem.querySelector('.twj_file_info').textContent =
            '类型 ' + twjFile.twj_file_type + ' | ' + (twjFile.twj_file_size / 1024).toFixed(1) + ' KB | ' +
            '文本 ' + twjFile.twj_char_count + ' 字 | ' + twjFile.twj_chunk_count + ' 个切片';

          var twjChunkBtn = twjItem.querySelector('.twj_chunk_btn');
          var twjChunkList = twjItem.querySelector('.twj_chunk_list');
          twjChunkBtn.addEventListener('click', function () {
            if (twjChunkList.classList.contains('twj_show')) {
              twjChunkList.classList.remove('twj_show');
              twjChunkBtn.textContent = '查看切片';
              return;
            }
            fetch('/api/kb/files/' + twjFile.twj_id + '/chunks')
              .then(function (twjRes) { return twjRes.json(); })
              .then(function (twjChunkData) {
                console.log('切片数据：', twjChunkData);
                twjChunkList.innerHTML = '';
                (twjChunkData.data.twj_chunks || []).forEach(function (twjChunk) {
                  var twjDiv = document.createElement('div');
                  twjDiv.className = 'twj_chunk_item';
                  twjDiv.textContent = twjChunk.twj_content;
                  twjChunkList.appendChild(twjDiv);
                });
                twjChunkList.classList.add('twj_show');
                twjChunkBtn.textContent = '收起切片';
              });
          });

          twjItem.querySelector('.twj_danger').addEventListener('click', function () {
            if (!confirm('确定删除文件「' + twjFile.twj_original_name + '」及其全部切片？')) { return; }
            fetch('/api/kb/files/' + twjFile.twj_id, { method: 'DELETE' })
              .then(function (twjRes) { return twjRes.json(); })
              .then(function (twjDelData) {
                console.log('删除结果：', twjDelData);
                twjLoadFiles();
              });
          });

          twjFileList.appendChild(twjItem);
        });
      })
      .catch(function (twjErr) { console.error('加载文件列表异常：', twjErr); });
  }

  // 上传文件
  function twjDoUpload(twjFile) {
    if (!twjFile) { return; }
    twjUploadStatus.className = 'twj_upload_status';
    twjUploadStatus.textContent = '正在上传解析：' + twjFile.name;
    var twjForm = new FormData();
    twjForm.append('twj_file', twjFile);
    fetch('/api/kb/upload', { method: 'POST', body: twjForm })
      .then(function (twjRes) { return twjRes.json(); })
      .then(function (twjData) {
        console.log('上传结果：', twjData);
        if (twjData.code === 0) {
          twjUploadStatus.textContent = '上传成功：' + twjData.data.twj_original_name +
            '（解析 ' + twjData.data.twj_char_count + ' 字，' + twjData.data.twj_chunk_count + ' 个切片）';
        } else {
          twjUploadStatus.className = 'twj_upload_status twj_err';
          twjUploadStatus.textContent = twjData.msg;
        }
        twjLoadFiles();
      })
      .catch(function (twjErr) {
        console.error('上传异常：', twjErr);
        twjUploadStatus.className = 'twj_upload_status twj_err';
        twjUploadStatus.textContent = '上传异常，请检查服务器是否启动';
      });
  }

  twjUploadBox.addEventListener('click', function () { twjFileInput.click(); });
  twjFileInput.addEventListener('change', function () {
    twjDoUpload(twjFileInput.files[0]);
    twjFileInput.value = '';
  });
  twjUploadBox.addEventListener('dragover', function (twjEv) {
    twjEv.preventDefault();
    twjUploadBox.classList.add('twj_drag');
  });
  twjUploadBox.addEventListener('dragleave', function () { twjUploadBox.classList.remove('twj_drag'); });
  twjUploadBox.addEventListener('drop', function (twjEv) {
    twjEv.preventDefault();
    twjUploadBox.classList.remove('twj_drag');
    twjDoUpload(twjEv.dataTransfer.files[0]);
  });

  // ===== RAG 问答 =====
  function twjAppendMsg(twjRole, twjText) {
    var twjDiv = document.createElement('div');
    twjDiv.className = 'twj_kb_msg ' + (twjRole === 'user' ? 'twj_kb_msg_user' : 'twj_kb_msg_ai');
    var twjBubble = document.createElement('div');
    twjBubble.className = 'twj_kb_bubble';
    twjBubble.textContent = twjText;
    twjDiv.appendChild(twjBubble);
    twjChatBody.appendChild(twjDiv);
    twjChatBody.scrollTop = twjChatBody.scrollHeight;
    return twjBubble;
  }

  function twjAsk(twjQuestion) {
    if (twjSending) { return; }
    twjQuestion = (twjQuestion || '').trim();
    if (!twjQuestion) {
      console.error('发送失败：问题为空');
      return;
    }
    twjSending = true;
    twjSendBtn.disabled = true;
    twjInput.value = '';

    twjAppendMsg('user', twjQuestion);
    var twjLoadingBubble = twjAppendMsg('ai', '');
    twjLoadingBubble.classList.add('twj_kb_loading');
    twjLoadingBubble.textContent = '正在检索知识库';

    fetch('/api/kb/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ twj_question: twjQuestion, twj_history: twjHistory })
    })
      .then(function (twjRes) { return twjRes.json(); })
      .then(function (twjData) {
        console.log('问答返回：', twjData);
        if (twjData.code === 0 && twjData.data && twjData.data.twj_answer) {
          twjHistory.push({ role: 'user', content: twjQuestion });
          twjHistory.push({ role: 'assistant', content: twjData.data.twj_answer });
          twjLoadingBubble.classList.remove('twj_kb_loading');
          twjLoadingBubble.textContent = twjData.data.twj_answer;
          var twjSources = twjData.data.twj_sources || [];
          if (twjSources.length) {
            var twjSrcDiv = document.createElement('div');
            twjSrcDiv.className = 'twj_kb_sources';
            var twjNames = twjSources.map(function (s) { return s.twj_file_name; });
            twjSrcDiv.textContent = '参考来源：' + twjNames.join('、');
            twjLoadingBubble.parentNode.appendChild(twjSrcDiv);
          }
          twjChatBody.scrollTop = twjChatBody.scrollHeight;
        } else {
          console.error('问答失败：', twjData.msg);
          twjLoadingBubble.classList.remove('twj_kb_loading');
          twjLoadingBubble.textContent = '抱歉，' + twjData.msg;
        }
      })
      .catch(function (twjErr) {
        console.error('请求异常：', twjErr);
        twjLoadingBubble.classList.remove('twj_kb_loading');
        twjLoadingBubble.textContent = '网络异常，请检查服务器是否启动';
      })
      .finally(function () {
        twjSending = false;
        twjSendBtn.disabled = false;
        twjInput.focus();
      });
  }

  twjSendBtn.addEventListener('click', function () { twjAsk(twjInput.value); });
  twjInput.addEventListener('keydown', function (twjEv) {
    if (twjEv.key === 'Enter') { twjAsk(twjInput.value); }
  });
  twjQuickBox.addEventListener('click', function (twjEv) {
    var twjTarget = twjEv.target;
    if (twjTarget.classList.contains('twj_kb_quick_btn') && twjTarget.dataset.twjQ) {
      twjAsk(twjTarget.dataset.twjQ);
    }
  });

  twjLoadFiles();
  console.log('知识库页面已加载');
})();
