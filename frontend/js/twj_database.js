// 姓名：田武杰 | 学号：24002120205
// 时间：2026-11-20 | 大模型：GLM-5.3-Flash
// 数据库连接测试页逻辑

(function () {
  var twjBtn = document.getElementById('twj_btn');
  var twjMsg = document.getElementById('twj_msg');
  var twjUserInput = document.getElementById('twj_username');
  var twjPassInput = document.getElementById('twj_password');

  twjBtn.addEventListener('click', function () {
    var twjUsername = twjUserInput.value.trim();
    var twjPassword = twjPassInput.value;
    if (!twjUsername || !twjPassword) {
      twjMsg.className = 'twj_msg twj_error';
      twjMsg.textContent = '请输入用户名和密码';
      console.error('测试连接失败：用户名或密码为空');
      return;
    }

    twjBtn.disabled = true;
    twjBtn.textContent = '连接中...';

    fetch('/api/db-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ twj_username: twjUsername, twj_password: twjPassword })
    })
      .then(function (twjRes) { return twjRes.json(); })
      .then(function (twjData) {
        console.log('接口返回：', twjData);
        if (twjData.code === 0) {
          twjMsg.className = 'twj_msg twj_success';
          twjMsg.textContent = '连接成功！MySQL 版本：' + twjData.data.twj_version;
        } else {
          twjMsg.className = 'twj_msg twj_error';
          twjMsg.textContent = twjData.msg;
          console.error('连接失败：', twjData.msg);
        }
      })
      .catch(function (twjErr) {
        console.error('请求异常：', twjErr);
        twjMsg.className = 'twj_msg twj_error';
        twjMsg.textContent = '请求异常，请检查服务器是否启动';
      })
      .finally(function () {
        twjBtn.disabled = false;
        twjBtn.textContent = '测试连接';
      });
  });

  console.log('数据库测试页已加载');
})();
