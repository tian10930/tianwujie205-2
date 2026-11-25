// 姓名：田武杰 | 学号：24002120205
// 时间：2026-11-25 | 大模型：GLM-5.3-Flash
// 图像识别页面逻辑：上传图片，调用 POST /api/vision/upload 获取描述

(function () {
  var twjUploadBox = document.getElementById('twj_upload_box');
  var twjFileInput = document.getElementById('twj_file_input');
  var twjPreviewWrap = document.getElementById('twj_preview_wrap');
  var twjPreviewImg = document.getElementById('twj_preview_img');
  var twjBtn = document.getElementById('twj_recognize_btn');
  var twjStatus = document.getElementById('twj_upload_status');
  var twjResultBox = document.getElementById('twj_result_box');
  var twjSelectedFile = null;
  var twjRecognizing = false;

  // 选择文件后本地预览
  function twjShowFile(twjFile) {
    if (!twjFile) { return; }
    if (!/^image\//.test(twjFile.type) && !/\.(jpe?g|png|gif|webp|bmp)$/i.test(twjFile.name)) {
      twjStatus.className = 'twj_upload_status twj_err';
      twjStatus.textContent = '请选择图片文件（jpg/png/gif/webp/bmp）';
      console.error('文件类型不符：', twjFile.type);
      return;
    }
    twjSelectedFile = twjFile;
    var twjReader = new FileReader();
    twjReader.onload = function (twjEv) {
      twjPreviewImg.src = twjEv.target.result;
      twjPreviewWrap.classList.add('twj_show');
    };
    twjReader.readAsDataURL(twjFile);
    twjBtn.disabled = false;
    twjStatus.className = 'twj_upload_status';
    twjStatus.textContent = '已选择：' + twjFile.name + '（' + (twjFile.size / 1024).toFixed(1) + ' KB）';
    console.log('已选择图片：', twjFile.name, twjFile.size, '字节');
  }

  // 识别
  function twjRecognize() {
    if (twjRecognizing || !twjSelectedFile) { return; }
    twjRecognizing = true;
    twjBtn.disabled = true;
    twjResultBox.className = 'twj_result_box twj_loading';
    twjResultBox.textContent = 'AI 正在识别图片';

    var twjForm = new FormData();
    twjForm.append('twj_file', twjSelectedFile);
    fetch('/api/vision/upload', { method: 'POST', body: twjForm })
      .then(function (twjRes) { return twjRes.json(); })
      .then(function (twjData) {
        console.log('识别返回：', twjData);
        if (twjData.code === 0 && twjData.data && twjData.data.twj_description) {
          twjResultBox.className = 'twj_result_box';
          twjResultBox.textContent = twjData.data.twj_description;
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
    twjShowFile(twjFileInput.files[0]);
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
    twjShowFile(twjEv.dataTransfer.files[0]);
  });
  twjBtn.addEventListener('click', twjRecognize);

  console.log('图像识别页面已加载');
})();
