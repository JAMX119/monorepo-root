import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(express.json());

// 健康检查端点
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});