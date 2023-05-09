import { ApiClient } from "../ApiRequest";

export class GetRequest<T> {

  private client: ApiClient<T>;

  constructor() {
    this.client = new ApiClient( );
  }

  async getRequest(path: string): Promise<T> {
    try {
      const response = await this.client.get(path);
      return response;
    } catch (err) {
      console.error("Error: Using " + path, err);
      throw err;
    }
  }
}