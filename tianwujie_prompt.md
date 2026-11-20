# 开发指令记录

2026-11-20 | 在当前项目根目录创建 AGENTS.md，写入项目规则（项目结构与技术栈：frontend/ 原生 HTML/CSS/JS、backend/ Node.js+Express 端口 8205、MySQL root/root、凭据写入 backend/.env；命名以 twj_ 开头；文件头部注释块：姓名：田武杰 | 学号：24002120205；记录文件 tianwujie_prompt.md、backend/twj_interface.md、backend/twj_database.md 追加写入；统一 JSON 响应格式 { code, msg, data }；前端约定 console 输出与 index.html 入口链接） | 大模型：GLM-5.3-Flash

2026-11-20 | 好的，开始创建后端项目结构（搭建 backend/ Express MVC 结构：app.js、config/twj_db.js、models/、controllers/、routes/；创建 frontend/ 静态目录骨架；安装依赖 express/cors/mysql2/dotenv；创建 twj_db 库与 twj_users 表并插入 8 条测试数据；实现并验证 /api/users 增删改查接口） | 大模型：GLM-5.3-Flash

2026-11-20 | `https://spontaneous-valkyrie-4e4229.netlify.app/fullstack-init-lesson`按照这里的做完（按课程文档完成：git init + .gitignore + 首次提交；重做首页 index.html 含姓名学号、项目名称类别、canvas 背景动画与页面导航；创建 readme.md 与 start.bat；新增 /api/health；创建 database.html + POST /api/db-test 数据库连接测试页；建 twj_news 表插入 8 条科技新闻并实现 GET /api/news + news.html；建 twj_gallery 表插入 8 条图文并实现 GET /api/gallery + gallery.html；记录追加写入三个记录文件） | 大模型：GLM-5.3-Flash
