import Express from 'express';
export interface iKeyInfo {
  key: string;
  key_Id: string;
  uri: string;
}
export interface iControllerKaltura {
  ingestAssets(assets: Array<string>) : Promise<Array<iKeyInfo>>;
}
export interface iApiKaltura{
  router: Express.IRouter,
  controller?: iControllerKaltura
}