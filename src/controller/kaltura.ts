import crypto from 'crypto';
import Axios from "axios";
import { v4 } from 'uuid';
import { iApiConfig, iKaltura } from "../interface";

export default class KalturaController implements iKaltura.iControllerKaltura {
  authenToken: string | null = null;
  config: iApiConfig | null
  constructor(config: iApiConfig | null) {
    this.config = config;
  }
  async ingestAssets(assets: string[]): Promise<iKaltura.iKeyInfo[]> {
    const keys = await Promise.all(assets.map(asset => {
      return this.ingestAsset(asset);
    }));
    return keys
  }

  async getAuthenToken(): Promise<string | null> {
    if (this.authenToken) {
      // return new Promise<string | null>((resolve) => {
      //   resolve(this.authenToken);
      // });
      return this.authenToken;
    }
    else {
      const { data: { accessToken } } = await Axios.post(`${this.config?.baseUrl}/user/login`, {
        email: this.config?.email,
        password: this.config?.password
      })
        .catch(err => {
          console.log('Login error ', err);
          return { data: {} }
        });
      console.log('Login: ', accessToken);
      this.authenToken = accessToken;
      return this.authenToken;
    }
  }

  async ingestAsset(asset: string): Promise<iKaltura.iKeyInfo> {
    const assetId = this.asset2Id(asset);
    try {
      const authenToken = await this.getAuthenToken();
      const keyInfo = await this.ingestKey(assetId, authenToken);
      return keyInfo;
    }
    catch(ex) {
      this.authenToken = null;
      const authenToken = await this.getAuthenToken();
      return this.ingestKey(assetId, authenToken);
    }
  }

  async ingestKey(assetId: string, authenToken: string | null): Promise<iKaltura.iKeyInfo> {
    const {
      data: {
        data: {
          keyId, key, cencResponse: {
            systemId: {
              sigma: { uri }
            }
          }
        }
      }
    } = await Axios.post(`${this.config?.baseUrl}/assets/ingest/transcode/v2/${this.config?.merchantId}/${this.config?.appId}/${assetId}`, {
      keyType: "SEED",
      drmScheme: "SIGMA_DRM",
      keySeed: crypto.randomBytes(24).toString('hex'),
      keyId: v4(),
      mode: "VOD"
    }, {
      headers: {
        "x-access-token": authenToken
      }
    })
    return {
      key: Buffer.from(key, "hex").toString("base64"),
      key_Id: Buffer.from(keyId.replace(/-/g, ""), "hex").toString('base64'),
      uri: uri
    }
  }

  asset2Id(asset: string): string {
    let path = asset;
    try {
      const assetUrl = new URL(asset);
      path = assetUrl.pathname;
    }
    catch (err) { }
    if (path[0] === '/') {
      path = path.replace("/", "");
    }
    return path.replace(/\//g, "_");
  }

}