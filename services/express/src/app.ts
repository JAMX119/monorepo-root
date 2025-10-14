import express, { Express, Request, Response } from 'express';

// 创建 Express 应用实例
const app: Express = express();

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 基本路由示例
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// 健康检查路由
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default app;