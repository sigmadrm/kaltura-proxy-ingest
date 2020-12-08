import { Application, Router } from "express";
import { iKaltura } from "../interface";
import kalturaRouter from "./kaltural";

const createApi = (controller: {} | any, handler: (routerInfo: iKaltura.iApiKaltura) => void) => {
  const router = Router();
  handler({
    router,
    controller
  });
  return router;
}
const initRouter = (server: Application | null, controller: {} | any) => {
  server?.use("/kaltura", createApi(controller.kaltura, kalturaRouter));
}

export default initRouter;