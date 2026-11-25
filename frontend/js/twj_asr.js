// 姓名：田武杰 | 学号：24002120205
// 时间：2026-11-25 | 大模型：GLM-5.3-Flash
// 语音识别页面逻辑：上传语音或麦克风录音，调用 POST /api/asr/upload 转文字

(function () {
  var twjUploadBox = document.getElementById('twj_upload_box');
  var twjFileInput = document.getElementById('twj_file_input');
  var twjStatus = document.getElementById('twj_upload_status');
  var twjRecordBtn = document.getElementById('twj_record_btn');
  var twjRecordTime = document.getElementById('twj_record_time');
  var twjAudioPlayer = document.getElementById('twj_audio_player');
  var twjBtn = document.getElementById('twj_recognize_btn');
  var twjResultBox = document.getElementById('twj_result_box');

  var twjAudioFile = null;      // 待识别的音频 File
  var twjRecorder = null;       // MediaRecorder 实例
  var twjRecordChunks = [];     // 录音数据块
  var twjRecordTimer = null;    // 计时器
  var twjRecordSeconds = 0;
  var twjRecognizing = false;

  // 设置待识别音频
  function twjSetAudio(twjFile) {
    if (!twjFile) { return; }
    if (!/^audio\//.test(twjFile.type) && !/\.(wav|mp3|m4a|aac|ogg|webm|flac)$/i.test(twjFile.name)) {
      twjStatus.className = 'twj_upload_status twj_err';
      twjStatus.textContent = '请选择音频文件（wav/mp3/m4a/aac/ogg/webm/flac）';
      console.error('文件类型不符：', twjFile.type);
      return;
    }
    twjAudioFile = twjFile;
    twjAudioPlayer.src = URL.createObjectURL(twjFile);
    twjAudioPlayer.classList.add('twj_show');
    twjBtn.disabled = false;
    twjStatus.className = 'twj_upload_status';
    twjStatus.textContent = '已选择：' + twjFile.name + '（' + (twjFile.size / 1024).toFixed(1) + ' KB）';
    console.log('已选择音频：', twjFile.name, twjFile.size, '字节');
  }

  // ===== 录音 =====
  function twjFormatTime(twjSec) {
    var twjM = Math.floor(twjSec / 60);
    var twjS = twjSec % 60;
    return (twjM < 10 ? '0' + twjM : twjM) + ':' + (twjS < 10 ? '0' + twjS : twjS);
  }

  async function twjToggleRecord() {
    if (twjRecorder && twjRecorder.state === 'recording') {
      twjRecorder.stop();
      return;
    }
    try {
      var twjStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      twjRecorder = new MediaRecorder(twjStream);
      twjRecordChunks = [];
      twjRecorder.ondataavailable = function (twjEv) {
        if (twjEv.data.size > 0) { twjRecordChunks.push(twjEv.data); }
      };
      twjRecorder.onstop = function () {
        clearInterval(twjRecordTimer);
        twjStream.getTracks().forEach(function (twjTrack) { twjTrack.stop(); });
        var twjBlob = new Blob(twjRecordChunks, { type: twjRecorder.mimeType || 'audio/webm' });
        var twjFile = new File([twjBlob], 'twj_record_' + Date.now() + '.webm', { type: twjBlob.type });
        console.log('录音完成：', twjFile.size, '字节，格式：', twjBlob.type);
        twjSetAudio(twjFile);
        twjRecordBtn.textContent = '开始录音';
        twjRecordBtn.classList.remove('twj_recording');
      };
      twjRecorder.start();
      twjRecordSeconds = 0;
      twjRecordTime.textContent = '00:00';
      twjRecordTimer = setInterval(function () {
        twjRecordSeconds++;
        twjRecordTime.textContent = twjFormatTime(twjRecordSeconds);
      }, 1000);
      twjRecordBtn.textContent = '停止录音';
      twjRecordBtn.classList.add('twj_recording');
      console.log('录音开始');
    } catch (twjErr) {
      console.error('无法访问麦克风：', twjErr);
      twjStatus.className = 'twj_upload_status twj_err';
      twjStatus.textContent = '无法访问麦克风，请检查浏览器权限';
    }
  }

  // ===== 识别 =====
  function twjRecognize() {
    if (twjRecognizing || !twjAudioFile) { return; }
    twjRecognizing = true;
    twjBtn.disabled = true;
    twjResultBox.className = 'twj_result_box twj_loading';
    twjResultBox.textContent = 'AI 正在识别语音';

    var twjForm = new FormData();
    twjForm.append('twj_file', twjAudioFile);
    fetch('/api/asr/upload', { method: 'POST', body: twjForm })
      .then(function (twjRes) { return twjRes.json(); })
      .then(function (twjData) {
        console.log('识别返回：', twjData);
        if (twjData.code === 0 && twjData.data && twjData.data.twj_text) {
          twjResultBox.className = 'twj_result_box';
          twjResultBox.textContent = twjData.data.twj_text;
        } else {
          console.error('识别失败：', twjData.msg);
          twjResultBox.className = 'twj_result_box twj_err';
          twjResultBox.textContent = twjData.msg;
        }
      })
      .catch(function (twjErr) {
        console.error('请求异常：', twjErr);
        twjResultBox.className = 'twj_result_box twj_err';
        twjResultBox.textContent = '网络异常，请检查服务器是否启动';
      })
      .finally(function () {
        twjRecognizing = false;
        twjBtn.disabled = false;
      });
  }

  twjUploadBox.addEventListener('click', function () { twjFileInput.click(); });
  twjFileInput.addEventListener('change', function () {
    twjSetAudio(twjFileInput.files[0]);
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
    twjSetAudio(twjEv.dataTransfer.files[0]);
  });
  twjRecordBtn.addEventListener('click', twjToggleRecord);
  twjBtn.addEventListener('click', twjRecognize);

  console.log('语音识别页面已加载');
})();
