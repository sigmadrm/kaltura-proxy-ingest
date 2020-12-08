import { config } from 'dotenv';
import Express from 'express';
import cors from 'cors';

import initRouter from './api';
import initController from './controller';
import { iApiConfig } from './interface';

class App {
  server: Express.Application | null = null;
  apiConfig: iApiConfig | null = null;
  loadEnv(): void {
    config();
    this.apiConfig = {
      baseUrl: process.env.API_URL,
      email: process.env.EMAIL,
      password: process.env.PASS,
      merchantId: process.env.MERCHANTID,
      appId: process.env.APPID,
    }
  }
  createWebServer(): void {
    this.server = Express();
    this.server.use(Express.json());
    this.server.use(Express.urlencoded());
    this.server.use(cors())
    this.server.use('/health', (req, res) => {
      res.status(200).json({ ec: 0 });
    });
  }
  createRouter(): void {
    initRouter(this.server, initController(this.apiConfig));
  }

  start(): Promise<number> {
    this.loadEnv();
    this.createWebServer();
    this.createRouter();
    return new Promise<number>((resolve, reject) => {
      this.server?.listen(process.env.PORT, () => {
        resolve(Number(process.env.PORT));
      });
    })
  }
}

const start = (): Promise<number> => {
  const app = new App();
  return app.start();
}

process.setUncaughtExceptionCaptureCallback((err) => {
  console.log("Error: ", err);
})
export default start;