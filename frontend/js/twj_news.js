// 姓名：田武杰 | 学号：24002120205
// 时间：2026-11-20 | 大模型：GLM-5.3-Flash
// 科技新闻列表页逻辑：fetch 获取 /api/news 并渲染

(function () {
  var twjList = document.getElementById('twj_list');

  fetch('/api/news')
    .then(function (twjRes) { return twjRes.json(); })
    .then(function (twjData) {
      console.log('接口返回数据：', twjData);
      if (twjData.code !== 0 || !Array.isArray(twjData.data)) {
        console.error('接口返回异常：', twjData.msg);
        twjList.className = 'twj_list twj_error';
        twjList.textContent = '数据加载失败：' + twjData.msg;
        return;
      }
      if (twjData.data.length === 0) {
        twjList.className = 'twj_list twj_loading';
        twjList.textContent = '暂无新闻数据';
        return;
      }
      twjList.innerHTML = '';
      twjData.data.forEach(function (twjItem) {
        var twjDiv = document.createElement('div');
        twjDiv.className = 'twj_item';
        twjDiv.innerHTML =
          '<h2 class="twj_item_title"></h2>' +
          '<p class="twj_item_summary"></p>' +
          '<div class="twj_item_foot"><span class="twj_item_source"></span><span class="twj_item_time"></span></div>';
        twjDiv.querySelector('.twj_item_title').textContent = twjItem.twj_title;
        twjDiv.querySelector('.twj_item_summary').textContent = twjItem.twj_summary;
        twjDiv.querySelector('.twj_item_source').textContent = '来源：' + twjItem.twj_source;
        twjDiv.querySelector('.twj_item_time').textContent = '发布时间：' + String(twjItem.twj_publish_time).replace('T', ' ').slice(0, 19);
        twjList.appendChild(twjDiv);
      });
    })
    .catch(function (twjErr) {
      console.error('请求异常：', twjErr);
      twjList.className = 'twj_list twj_error';
      twjList.textContent = '请求异常，请检查服务器是否启动';
    });

  console.log('新闻列表页已加载');
})();
