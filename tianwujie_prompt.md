# 开发指令记录

2026-11-20 | 在当前项目根目录创建 AGENTS.md，写入项目规则（项目结构与技术栈：frontend/ 原生 HTML/CSS/JS、backend/ Node.js+Express 端口 8205、MySQL root/root、凭据写入 backend/.env；命名以 twj_ 开头；文件头部注释块：姓名：田武杰 | 学号：24002120205；记录文件 tianwujie_prompt.md、backend/twj_interface.md、backend/twj_database.md 追加写入；统一 JSON 响应格式 { code, msg, data }；前端约定 console 输出与 index.html 入口链接） | 大模型：GLM-5.3-Flash

2026-11-20 | 好的，开始创建后端项目结构（搭建 backend/ Express MVC 结构：app.js、config/twj_db.js、models/、controllers/、routes/；创建 frontend/ 静态目录骨架；安装依赖 express/cors/mysql2/dotenv；创建 twj_db 库与 twj_users 表并插入 8 条测试数据；实现并验证 /api/users 增删改查接口） | 大模型：GLM-5.3-Flash

2026-11-20 | `https://spontaneous-valkyrie-4e4229.netlify.app/fullstack-init-lesson`按照这里的做完（按课程文档完成：git init + .gitignore + 首次提交；重做首页 index.html 含姓名学号、项目名称类别、canvas 背景动画与页面导航；创建 readme.md 与 start.bat；新增 /api/health；创建 database.html + POST /api/db-test 数据库连接测试页；建 twj_news 表插入 8 条科技新闻并实现 GET /api/news + news.html；建 twj_gallery 表插入 8 条图文并实现 GET /api/gallery + gallery.html；记录追加写入三个记录文件） | 大模型：GLM-5.3-Flash

2026-11-25 | 向 .env 写入硅基流动与七牛 AI 服务商配置（SILICONFLOW_*、QINIU_CUSTOMER_SERVICE_*、AI_PROVIDER=siliconflow） | 大模型：GLM-5.3-Flash

2026-11-25 | 使用硅基流动 完成在线客服页面（后端新增 services/twj_ai_service.js 调用硅基流动 OpenAI 兼容接口、controllers/twj_chat_controller.js、routes/twj_chat_routes.js，挂载 POST /api/chat；前端新增 customer-service.html + css/twj_chat.css + js/twj_chat.js 聊天界面，支持历史上下文、快捷提问、回车发送；首页增加在线客服导航卡片；记录追加写入 twj_interface.md 与 tianwujie_prompt.md） | 大模型：GLM-5.3-Flash

2026-11-25 | 完成知识库文件上传功能，构建2个知识库文件，完成基于知识库的问答，支持doc和docx，ppt，完成知识库管理（RAG）：基于本地文件（如 PDF/TXT）上传、解析，构建专属自动客服或问答系统，包括知识库文件上传模块。在控制台输出发送给大模型的数据和接受自大模型的数据。（实现：安装 multer/mammoth/adm-zip/pdf-parse/word-extractor；建 twj_kb_files 与 twj_kb_chunks 表；新增文件解析器与 RAG 检索服务，接口 POST /api/kb/upload、GET /api/kb/files、GET /api/kb/files/:id/chunks、DELETE /api/kb/files/:id、POST /api/kb/ask；上传 2 个知识库文件：网站使用说明与常见问题.txt（5 切片）+ 科技资讯全栈站产品介绍.docx（3 切片）；前端新增 knowledge-base.html 支持拖拽上传、切片预览、删除管理与知识库问答（含参考来源展示）；AI 服务在控制台输出收发数据） | 大模型：GLM-5.3-Flash

2026-11-25 | 使用七牛 完成在线客服页面（AI 服务层 twj_ai_service.js 支持按请求切换服务商：qiniu 用 QINIU_CUSTOMER_SERVICE_* 配置的 qiniu/conatus-free 模型，siliconflow 用 Qwen2.5-7B-Instruct；POST /api/chat 新增可选参数 twj_provider；遇到 429 限流自动重试 2 次，仍失败自动降级到硅基流动兜底；前端 customer-service.html 头部新增服务商下拉框，默认七牛客服；控制台输出每次请求的服务商/模型与收发数据；验证：七牛直连对话成功、硅基流动切换成功、限流降级兜底成功） | 大模型：GLM-5.3-Flash

2026-11-25 | 完成图像识别功能，上传图片，返回该图片的描述，使用已有的api-key和模型（后端 twj_ai_service.js 新增 twjVision 函数调用硅基流动视觉模型 Qwen/Qwen3-VL-8B-Instruct（SILICONFLOW_VISION_MODEL），新增 controllers/twj_vision_controller.js + routes/twj_vision_routes.js，挂载 POST /api/vision/upload：multer 接收 jpg/png/gif/webp/bmp（10MB 以内），图片转 base64 dataURL 发送给视觉模型，返回中文描述；控制台输出发送数据（base64 截断显示）与接收数据；前端新增 image-recognition.html + css/twj_vision.css + js/twj_vision.js：点击/拖拽上传、本地预览、开始识别按钮、结果面板；首页新增图像识别导航卡片；验证：几何图形测试图识别精确命中红圆/黄倒三角/蓝底白框） | 大模型：GLM-5.3-Flash

2026-11-25 | 实现一个语音识别的功能，使用七牛的Qwen-Audio-3.0-ASR-Flash模型，输入语音，输出文字。（实现过程：先探测七牛网关——chat/completions 与 /audio/transcriptions 两个端点对 Qwen-Audio-3.0-ASR-Flash 均返回 no available channels/model_not_found，且 /models 列表 91 个模型中无任何音频模型；硅基流动 /audio/transcriptions 端点验证 Qwen/Qwen3-ASR-1.7B 与 FunAudioLLM/SenseVoiceSmall 转录完美。最终实现：.env 新增 QINIU_ASR_MODEL=Qwen-Audio-3.0-ASR-Flash 与 SILICONFLOW_ASR_MODEL=Qwen/Qwen3-ASR-1.7B；twj_ai_service.js 新增 twjAsr 函数——优先尝试七牛 QINIU_ASR_MODEL，模型通道不可用时自动降级到硅基流动 Qwen3-ASR-1.7B；新增 controllers/twj_asr_controller.js + routes/twj_asr_routes.js，挂载 POST /api/asr/upload：multer 接收 wav/mp3/m4a/aac/ogg/webm/flac（15MB 以内），multipart 调用转录端点返回文字；控制台输出服务商/模型/文件信息与接收数据；前端新增 voice-recognition.html + css/twj_asr.css + js/twj_asr.js：上传语音文件、MediaRecorder 麦克风录音（计时、回放）、开始识别按钮、结果面板；首页新增语音识别导航卡片；验证：Windows TTS 生成的测试语音"大家好，我是田武杰，今天是二零二五年十一月二十五日……"完整准确转为文字，控制台确认先试七牛后降级硅基流动） | 大模型：GLM-5.3-Flash
