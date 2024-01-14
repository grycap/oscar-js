import { RequestProps } from "../types";
import { setAuthParams } from "../utils/utils";
import { UnauthorizedError } from "./UnauthorizedError";

export class DeleteRequest<T> {

  constructor() { }

  async deleteRequest(props: RequestProps, baseUrl?: string): Promise<any> {

    const { textResponse, path, client, authorization, authType} = props;
    let url;
    let auth;

    // Set authorization parameters according to configuration
    if (client) { 
      url = new URL(path, client.getOscarEndpoint()).toString();
      auth = setAuthParams(props);
    } else {
      url = new URL(path, baseUrl).toString();
      auth = setAuthParams(props);
    }
    
    const headers = new Headers();
    headers.append('Authorization', auth);
    console.log("DELETE Request in url:", url.toString());

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers
    });

    // Verify if response have an error (4xx or 5xx)
    if (!response.ok) {
      if(response.status == 401) {
        throw new UnauthorizedError("Unauthorized");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const status = response.status;
    return status;
  }
}