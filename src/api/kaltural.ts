import { iKaltura } from "../interface";

const kalturaRouter = (routerInfo: iKaltura.iApiKaltura) => {
  const { router, controller } = routerInfo;
  router.use("/ingest", async (req, res) => {
    const asset = req.query.asset;
    const ass: string = String(asset);
    const assets: Array<string> = ass.split(",");
    try {
      const keyInfo = await controller?.ingestAssets(assets);
      res.status(200).json(keyInfo);
    }
    catch(err) {
      res.status(500).end();
    }
  })
}

export default kalturaRouter;