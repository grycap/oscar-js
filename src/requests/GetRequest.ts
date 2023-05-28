import { ApiClient } from "../ApiRequest";

export class GetRequest<T> {

  private client: ApiClient<T>;

  constructor() {
    this.client = new ApiClient();
  }

  async getRequest(path: string, isTextRequest?: boolean): Promise<T> {
    try {
      const response = await this.client.get(path, isTextRequest);
      return response;
    } catch (err) {
      console.error("Error: Using " + path, err);
      throw err;
    }
  }
}