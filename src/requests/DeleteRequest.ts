import { ApiClient } from "../ApiRequest";

export class DeleteRequest<T> {

  private client: ApiClient<T>;
  constructor() {
    this.client = new ApiClient();
  }

  async deleteRequest(path: string, authorization? : string): Promise<T> {
    try {
      const response = await this.client.delete(path, authorization);
      return response;
    } catch (err) {
      console.error("Error: Using " + path, err);
      throw err;
    }
  }
}