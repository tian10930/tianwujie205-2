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

## 2026-11-25 建表：知识库文件表与切片表（按执行顺序）

```sql
USE twj_db;
CREATE TABLE IF NOT EXISTS twj_kb_files (
  twj_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '知识库文件ID',
  twj_original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
  twj_stored_name VARCHAR(255) NOT NULL COMMENT '磁盘存储文件名',
  twj_file_type VARCHAR(20) NOT NULL COMMENT '文件类型 txt/doc/docx/pptx/pdf',
  twj_file_size INT NOT NULL DEFAULT 0 COMMENT '文件大小(字节)',
  twj_char_count INT NOT NULL DEFAULT 0 COMMENT '解析出的文本字符数',
  twj_chunk_count INT NOT NULL DEFAULT 0 COMMENT '切片数量',
  twj_create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文件表';

CREATE TABLE IF NOT EXISTS twj_kb_chunks (
  twj_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '切片ID',
  twj_file_id INT NOT NULL COMMENT '所属知识库文件ID',
  twj_content TEXT NOT NULL COMMENT '切片文本内容',
  twj_create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX twj_idx_file (twj_file_id),
  CONSTRAINT twj_fk_chunk_file FOREIGN KEY (twj_file_id) REFERENCES twj_kb_files(twj_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文本切片表';

-- 测试数据：2 个知识库文件（通过 POST /api/kb/upload 上传入库），对应 8 个文本切片
INSERT INTO twj_kb_files (twj_id, twj_original_name, twj_stored_name, twj_file_type, twj_file_size, twj_char_count, twj_chunk_count) VALUES (3, '网站使用说明与常见问题.txt', '1795586273129-6ymaan.txt', 'txt', 3479, 1699, 5);
INSERT INTO twj_kb_files (twj_id, twj_original_name, twj_stored_name, twj_file_type, twj_file_size, twj_char_count, twj_chunk_count) VALUES (4, '科技资讯全栈站产品介绍.docx', '1795586273363-e8ldn7.docx', 'docx', 2430, 868, 3);

INSERT INTO twj_kb_chunks (twj_file_id, twj_content) VALUES (3, '科技资讯全栈站 使用说明与常见问题 作者：田武杰（学号 24002120205） 一、网站简介 本网站是高级网页设计课程的全栈作业项目，前端使用原生 HTML、CSS、JavaScript 开发，后端使用 Node.js + Express 框架，采用 RESTful + MVC 架构，所有接口以 /api/ 为前缀，服务端口固定为 8205。数据库使用 MySQL，数据库名为 twj_db。 二、主要功能 1、首页：展示项目信息（姓名、学号、项目名称与类别），包含 canvas 粒子连线背景动画，并提供所有功能页面的导航入口。 2、科技新闻列表页（news.html）：从数据库 twj_news 表读取 8 条科技新闻，按发布时间倒序展示，包含标题、摘要、来源和发布时间。');
INSERT INTO twj_kb_chunks (twj_file_id, twj_content) VALUES (3, '3、图文列表页（gallery.html）：从 twj_gallery 表读取图文数据，以网格卡片形式展示，卡片为上图下文布局，图片加载失败时显示渐变占位色块。 4、数据库连接测试页（database.html）：输入 MySQL 用户名和密码，调用 POST /api/db-test 接口测试数据库连接，成功时显示 MySQL 版本号。 5、在线客服页（customer-service.html）：基于硅基流动大模型接口的 AI 客服，可以回答网站功能相关问题。 6、知识库问答页（knowledge-base.html）：支持上传本地文件构建专属知识库，并基于知识库内容进行智能问答。 三、接口清单 1、GET /api/health：健康检查，返回服务运行时间。 2、GET /api/users：用户列表；POST /api/users：新增用户。');
INSERT INTO twj_kb_chunks (twj_file_id, twj_content) VALUES (3, '3、GET /api/news：获取全部科技新闻。 4、GET /api/gallery：获取全部图文。 5、POST /api/db-test：测试数据库连接，参数为 twj_username 和 twj_password。 6、POST /api/chat：AI 在线客服对话，参数为 twj_message 和可选的 twj_history。 7、POST /api/kb/upload：上传知识库文件，支持 txt、doc、docx、pptx、pdf 五种格式。 8、GET /api/kb/files：获取知识库文件列表。 9、GET /api/kb/files/:id/chunks：查看某个文件的文本切片。 10、DELETE /api/kb/files/:id：删除知识库文件。');
INSERT INTO twj_kb_chunks (twj_file_id, twj_content) VALUES (3, '11、POST /api/kb/ask：基于知识库的智能问答，参数为 twj_question 和可选的 twj_history。 四、常见问题 问：服务器如何启动？ 答：双击项目根目录的 start.bat，或在 backend 目录下执行 npm start 命令，启动后访问 http://localhost:8205。 问：网站页面上看不到数据怎么办？ 答：请确认 MySQL 服务已启动，backend/.env 中的数据库配置正确，并按浏览器控制台 F12 查看 /api 接口是否返回 code 为 0。 问：知识库支持哪些文件格式？ 答：支持 txt、doc、docx、pptx、pdf 五种格式，单个文件大小限制为 10MB，上传后系统会自动解析文本并切片入库。 问：AI 回答与知识库不符怎么办？');
INSERT INTO twj_kb_chunks (twj_file_id, twj_content) VALUES (3, '答：知识库问答严格依据已上传文件的内容作答，如知识库中没有相关内容，客服会诚实说明，请先上传包含该问题的文档。 五、技术特点 1、前后端分离：frontend 目录存放静态页面，backend 目录提供 API 服务，使用 express.static 托管。 2、统一响应格式：所有接口返回 { code, msg, data } 格式的 JSON，code 为 0 表示成功。 3、RAG 检索增强生成：上传的文档会被切成约 400 字的片段，提问时按关键词相似度检索最相关的片段，拼入大模型提示词，让回答有据可依。');
INSERT INTO twj_kb_chunks (twj_file_id, twj_content) VALUES (4, '科技资讯全栈站 产品介绍 作者：田武杰（学号 24002120205） 一、产品定位 科技资讯全栈站是一个面向科技爱好者的一站式资讯网站，集新闻浏览、图文展示、智能客服与知识库问答于一体，是高级网页设计课程的全栈实践作品。 二、核心栏目 1、科技新闻栏目：聚焦人工智能、芯片半导体、商业航天、新能源、量子计算、脑机接口、智慧农业与 AR 眼镜八大热点领域，数据来源于 twj_news 表，共收录 8 条精选新闻。 2、图文栏目：以分类卡片形式展示智慧城市、芯片制造、星空观测、智能制造、春日樱语、云海日出、现代书房与太空视角 8 组图文，图片由 AI 文生图服务生成。 3、在线客服栏目：接入硅基流动提供的 Qwen2.5-7B-Instruct 大模型，通过 POST /api/chat 接口实现多轮对话，可解答网站使用问题。');
INSERT INTO twj_kb_chunks (twj_file_id, twj_content) VALUES (4, '4、知识库问答栏目：支持上传 txt、doc、docx、pptx、pdf 格式的本地文件，系统自动解析文本并切片入库，提问时基于检索到的知识库片段回答，实现专属自动客服。 三、技术架构 前端采用原生 HTML、CSS、JavaScript 三件套开发，不依赖任何第三方库或 CDN；后端采用 Node.js 与 Express 框架，遵循 RESTful 和 MVC 分层规范；数据存储使用 MySQL 关系型数据库，包含用户表 twj_users、新闻表 twj_news、图文表 twj_gallery、知识库文件表 twj_kb_files 与切片表 twj_kb_chunks。 四、特色亮点 1、首页使用 canvas 绘制粒子连线动画背景，视觉效果富有科技感。 2、全部接口返回统一的 JSON 格式：code 为 0 表示成功，非 0 表示失败，便于前端统一处理。');
INSERT INTO twj_kb_chunks (twj_file_id, twj_content) VALUES (4, '3、后端在调用大模型时，会在控制台完整输出发送给大模型的数据与接收自大模型的数据，方便教学演示与调试。 4、系统支持一键启动：双击 start.bat 即可同时启动后端服务并托管前端页面。');
```
