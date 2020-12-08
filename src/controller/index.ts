import { iApiConfig } from "../interface";
import KalturaController from "./kaltura";

const initController = (config: iApiConfig | null) => {
  return {
    kaltura: new KalturaController(config)
  }
}

export default initController;