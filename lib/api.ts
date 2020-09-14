import { util } from "./util";
import logger from "./logger";

export class API {
  constructor(private readonly _options: any) { }

  private _buildUrl(method: string): string {
    const protocol = this._options.secure ? "https://" : "http://";
    let url =
      protocol +
      this._options.host +
      ":" +
      this._options.port +
      this._options.path +
      this._options.key +
      "/" +
      method;
    const queryString = "?ts=" + new Date().getTime() + "" + Math.random();
    url += queryString;

    return url;
  }

  private _buildUrlWithRoomName(method: string, roomName: string): string {
    const baseUrl = this._buildUrl(method);
    return baseUrl + "&roomName=" + roomName;
  }

  /** Get a unique ID from the server via XHR and initialize with it. */
  async retrieveId(): Promise<string> {
    const url = this._buildUrl("id");

    try {
      const response = await fetch(url);

      if (response.status !== 200) {
        throw new Error(`Error. Status:${response.status}`);
      }

      return response.text();
    } catch (error) {
      logger.error("Error retrieving ID", error);

      let pathError = "";

      if (
        this._options.path === "/" &&
        this._options.host !== util.CLOUD_HOST
      ) {
        pathError =
          " If you passed in a `path` to your self-hosted PeerServer, " +
          "you'll also need to pass in that same path when creating a new " +
          "Peer.";
      }

      throw new Error("Could not get an ID from the server." + pathError);
    }
  }
}
