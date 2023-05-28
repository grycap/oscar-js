import { ApiClient } from "../ApiRequest";

export class PutRequest<T> {

  private client: ApiClient<T>;

  constructor() {
    this.client = new ApiClient();
  }

  async putRequest(path: string, body: any): Promise<T> {
    try {
      const response = await this.client.put(path, body);
      return response;
    } catch (err) {
      console.error("Error: Using " + path, err);
      throw err;
    }
  }
}