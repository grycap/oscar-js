import { ApiClient } from "../ApiRequest";

export class PostRequest<T> {

  private client: ApiClient<T>;

  constructor() {
    this.client = new ApiClient( );
  }

  async postRequest(path: string, body: any, authorization? : string): Promise<T> {
    try {
      const response = await this.client.post(path, body, authorization);
      return response;
      
    } catch (err) {
      console.error("Error: Using " + path, err);
      throw err;
    }
  }
}