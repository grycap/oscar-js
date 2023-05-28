import { ApiClient } from "../ApiRequest";

export class DeleteRequest<T> {

  private client: ApiClient<T>;
  constructor() {
    this.client = new ApiClient();
  }

  async deleteRequest(path: string): Promise<T> {
    try {
      const response = await this.client.delete(path);
      return response;
    } catch (err) {
      console.error("Error: Using " + path, err);
      throw err;
    }
  }
}