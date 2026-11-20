<!--
  姓名：田武杰 | 学号：24002120205
  时间：2026-11-20 | 大模型：GLM-5.3-Flash
  数据库记录文件（一律追加写入，禁止覆盖已有内容）
  仅凭本文件即可在新机器上完整重建数据库：
  在 mysql 客户端中依次执行以下全部 SQL 即可。
-->

## 2026-11-20 建库、建表与测试数据（按执行顺序）

```sql
-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS twj_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 2. 创建用户表
USE twj_db;
CREATE TABLE IF NOT EXISTS twj_users (
  twj_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  twj_username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  twj_password VARCHAR(100) NOT NULL COMMENT '密码',
  twj_nickname VARCHAR(50) NOT NULL DEFAULT '' COMMENT '昵称',
  twj_phone VARCHAR(20) NOT NULL DEFAULT '' COMMENT '手机号',
  twj_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 3. 插入 8 条测试数据
INSERT INTO twj_users (twj_username, twj_password, twj_nickname, twj_phone) VALUES
('zhangsan', '123456', '张三', '13800000001'),
('lisi', '123456', '李四', '13800000002'),
('wangwu', '123456', '王五', '13800000003'),
('zhaoliu', '123456', '赵六', '13800000004'),
('sunqi', '123456', '孙七', '13800000005'),
('zhouba', '123456', '周八', '13800000006'),
('wujiu', '123456', '吴九', '13800000007'),
('zhengshi', '123456', '郑十', '13800000008');
```

补充说明（2026-11-20）：本机调试过程中将 root 密码重置为 root，并切换为
mysql_native_password 认证插件（便于 Node mysql2 非 TLS 连接）：
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
```

## 2026-11-20 建表：科技新闻表与图文表（按执行顺序）

```sql
-- 4. 创建科技新闻表
USE twj_db;
CREATE TABLE IF NOT EXISTS twj_news (
  twj_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '新闻ID',
  twj_title VARCHAR(200) NOT NULL COMMENT '新闻标题',
  twj_summary VARCHAR(500) NOT NULL DEFAULT '' COMMENT '新闻摘要',
  twj_content TEXT COMMENT '新闻正文',
  twj_source VARCHAR(100) NOT NULL DEFAULT '' COMMENT '新闻来源',
  twj_publish_time DATETIME NOT NULL COMMENT '发布时间',
  twj_cover_img VARCHAR(500) NOT NULL DEFAULT '' COMMENT '封面图',
  INDEX twj_idx_publish (twj_publish_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技新闻表';

-- 5. 插入 8 条科技新闻测试数据
INSERT INTO twj_news (twj_title, twj_summary, twj_content, twj_source, twj_publish_time) VALUES
('国产大模型再突破：多模态推理能力对标国际一流水平', '国内研发团队发布新一代多模态大模型，在数学推理、代码生成等基准测试中刷新纪录。', '据官方发布会消息，新一代多模态大模型在数学推理、代码生成、图像理解等基准测试中均取得领先成绩，部分指标首次超过国际主流模型。该模型已开放 API 给开发者试用，并计划推出移动端应用。业内专家表示，这将进一步推动国产大模型在教育和办公场景的落地。', '科技日报', '2026-11-18 09:30:00'),
('全球首款 2nm 芯片量产，手机性能迎来新飞跃', '台积电宣布 2nm 制程工艺进入量产阶段，首批客户包括多家头部手机厂商。', '2nm 制程相比上一代 3nm 工艺，在同等功耗下性能提升约 15%，晶体管密度提升约 23%。首批采用该工艺的旗舰芯片预计明年一季度发布，将率先用于高端智能手机与 AI 服务器。供应链人士称，产能爬坡将持续到明年下半年。', '半导体观察', '2026-11-17 14:20:00'),
('商业航天新里程碑：可回收火箭完成第十次飞行', '国内商业航天公司完成可回收火箭第十次发射与回收，复用技术日趋成熟。', '本次发射将三颗遥感卫星送入预定轨道，一级火箭在海上平台成功回收。这是该型号火箭的第十次飞行，单次发射成本较首次下降约 60%。公司表示明年将启动载人级安全验证飞行。', '航天爱好者', '2026-11-16 11:05:00'),
('新能源车冬季续航难题迎来新解法', '全固态电池开始小批量装车测试，低温环境下续航衰减显著降低。', '多家电池厂商的全固态电池样品进入整车测试阶段。测试数据显示，零下 20 摄氏度环境中续航衰减从行业平均的 35% 降低到 10% 以内，充电速度也提升约一倍。首批搭载车型预计明年发布。', '汽车之家', '2026-11-15 16:40:00'),
('量子计算云平台上线，普通开发者也能用量子算力', '国内首个开放量子计算云平台正式上线，提供可视化编程环境。', '该平台集成了多台超导与离子阱量子计算机，开发者通过网页即可提交量子程序。平台同时提供量子算法教程与仿真器，降低量子计算入门门槛。上线首日注册开发者已突破一万人。', '中国计算机学会', '2026-11-14 10:15:00'),
('脑机接口临床试验取得进展，瘫痪患者用意念打字', '植入式脑机接口帮助瘫痪患者实现每分钟 60 字以上的意念输入。', '研究团队通过柔性电极阵列采集大脑运动皮层信号，结合大语言模型纠错，使瘫痪患者的意念输入速度达到每分钟 60 字以上，准确率超过 90%。这是该技术向实用化迈进的重要一步，相关成果已发表于国际学术期刊。', '生命科学前沿', '2026-11-13 08:50:00'),
('智慧农业无人机集群完成万亩播种作业', '无人机集群自主协作完成水稻直播播种，效率是人工的 30 倍。', '本次作业由 50 台农业无人机集群协作完成，通过北斗定位与 AI 路径规划实现厘米级播撒精度，日均作业面积突破万亩。系统还能根据土壤湿度自动调整播种密度，助力粮食增产。', '农业科技报', '2026-11-12 15:25:00'),
('AR 眼镜消费级新品发布，重量首次降至 50 克以内', '新一代 AR 眼镜兼顾轻量化与显示效果，整机重量仅 48 克。', '该产品采用衍射光波导与微型 Micro-OLED 光机，亮度提升 40% 的同时将整机重量控制在 48 克，支持实时翻译、导航指引与提词功能。首发售价 2999 元，开售当天即告罄。', '数码测评', '2026-11-11 13:10:00');

-- 6. 创建图文表
CREATE TABLE IF NOT EXISTS twj_gallery (
  twj_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '图文ID',
  twj_title VARCHAR(200) NOT NULL COMMENT '标题',
  twj_description VARCHAR(500) NOT NULL DEFAULT '' COMMENT '描述',
  twj_img_url VARCHAR(500) NOT NULL COMMENT '图片地址',
  twj_category VARCHAR(50) NOT NULL DEFAULT '' COMMENT '分类',
  twj_create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图文表';

-- 7. 插入 8 条图文测试数据
INSERT INTO twj_gallery (twj_title, twj_description, twj_img_url, twj_category) VALUES
('未来智慧城市', '霓虹与光影交织的智慧城市夜景，勾勒出科技感十足的都市轮廓。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20smart%20city%20skyline%20at%20night%20with%20neon%20lights%2C%20ultra%20detailed&image_size=landscape_4_3', '科技'),
('芯片制造', '微距镜头下的芯片与电路板，展现半导体的精密之美。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=glowing%20CPU%20chip%20macro%20photography%20on%20circuit%20board&image_size=landscape_4_3', '科技'),
('星空观测', '天文台圆顶与银河同框，记录浩瀚宇宙的静谧时刻。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=observatory%20dome%20under%20starry%20milky%20way%20night%20sky&image_size=landscape_4_3', '天文'),
('智能制造', '自动化装配线上的机械臂，诠释现代工业的效率与精度。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20robotic%20arms%20on%20automated%20assembly%20line&image_size=landscape_4_3', '工业'),
('春日樱语', '樱花盛放的公园步道，粉色花瓣铺满整条小径。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cherry%20blossom%20park%20in%20full%20bloom%20in%20spring&image_size=landscape_4_3', '自然'),
('云海日出', '山巅之上的云海日出，金色阳光洒满层叠云涛。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sunrise%20above%20sea%20of%20clouds%20in%20mountains&image_size=landscape_4_3', '风光'),
('现代书房', '拥有大面积天窗的现代图书馆内景，光线在书架间流淌。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20minimalist%20library%20interior%20with%20large%20skylight&image_size=landscape_4_3', '建筑'),
('太空视角', '从空间站舷窗俯瞰蓝色地球，感受人类航天的浪漫。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=space%20station%20orbiting%20earth%20with%20blue%20planet%20view&image_size=landscape_4_3', '航天');
```
