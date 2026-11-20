// 姓名：田武杰 | 学号：24002120205
// 时间：2026-11-20 | 大模型：GLM-5.3-Flash
// 图文列表页逻辑：fetch 获取 /api/gallery，上图下文卡片，图片加载失败显示占位

(function () {
  var twjGrid = document.getElementById('twj_grid');

  fetch('/api/gallery')
    .then(function (twjRes) { return twjRes.json(); })
    .then(function (twjData) {
      console.log('接口返回数据：', twjData);
      if (twjData.code !== 0 || !Array.isArray(twjData.data)) {
        console.error('接口返回异常：', twjData.msg);
        twjGrid.className = 'twj_grid twj_error';
        twjGrid.textContent = '数据加载失败：' + twjData.msg;
        return;
      }
      if (twjData.data.length === 0) {
        twjGrid.className = 'twj_grid twj_loading';
        twjGrid.textContent = '暂无图文数据';
        return;
      }
      twjGrid.innerHTML = '';
      twjData.data.forEach(function (twjItem) {
        var twjCard = document.createElement('div');
        twjCard.className = 'twj_card';
        twjCard.innerHTML =
          '<img class="twj_card_img" alt="">' +
          '<div class="twj_card_body">' +
          '<h2 class="twj_card_title"></h2>' +
          '<p class="twj_card_desc"></p>' +
          '<div class="twj_card_foot"><span class="twj_card_cat"></span><span class="twj_card_time"></span></div>' +
          '</div>';
        twjCard.querySelector('.twj_card_title').textContent = twjItem.twj_title;
        twjCard.querySelector('.twj_card_desc').textContent = twjItem.twj_description;
        twjCard.querySelector('.twj_card_cat').textContent = '分类：' + twjItem.twj_category;
        twjCard.querySelector('.twj_card_time').textContent = String(twjItem.twj_create_time).replace('T', ' ').slice(0, 10);
        var twjImg = twjCard.querySelector('.twj_card_img');
        twjImg.src = twjItem.twj_img_url;
        // 图片加载失败时隐藏图片，显示渐变占位色块
        twjImg.onerror = function () {
          console.error('图片加载失败：', twjItem.twj_img_url);
          twjImg.style.visibility = 'hidden';
        };
        twjGrid.appendChild(twjCard);
      });
    })
    .catch(function (twjErr) {
      console.error('请求异常：', twjErr);
      twjGrid.className = 'twj_grid twj_error';
      twjGrid.textContent = '请求异常，请检查服务器是否启动';
    });

  console.log('图文列表页已加载');
})();
