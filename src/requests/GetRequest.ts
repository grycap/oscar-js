import { Client } from "../Client";
import { RequestProps } from "../types";
import { UnauthorizedError } from "./UnauthorizedError";
import { setAuthParams } from "../utils/utils";

export class GetRequest<T> {

  constructor() { }

  async getRequest(props: RequestProps, baseUrl?: string ): Promise<any>  {
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
    console.log("GET Request in url:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    // Verify if response have an error (4xx or 5xx)
    if (!response.ok) {
      if(response.status == 401) {
        throw new UnauthorizedError("Unauthorized!!");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (textResponse) {
      return await response.text();
    }

    const data = await response.json();
    return data;
  }
}