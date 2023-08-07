import fetch, { Headers } from 'node-fetch';
import { AuthType, ClientConfig } from "./models/Models"
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { UnauthorizedError } from './requests/UnauthorizedError';


export class ApiClient<T> {
  private readonly clientConfig: ClientConfig;
  private readonly oscar_endpoint: string;
  private auth: string = "";

  constructor() {
    const config: any = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
    this.clientConfig = config.client;
    this.oscar_endpoint = this.clientConfig.oscar_endpoint;
  }

  setAuthParams(authorization?: any): string {
    if (this.clientConfig.auth_type == AuthType.BasicAuth) {
      this.auth = "Basic " + Buffer.from(this.clientConfig.username + ":" + this.clientConfig.password).toString("base64");
      
      if (this.isServiceToken(authorization)) {
        this.auth = 'Bearer ' + authorization.split(' ')[1];
      }

      return this.auth;
  
    }

    if (this.clientConfig.auth_type == AuthType.Oidc || authorization != undefined) {

      if (this.isServiceToken(authorization)) {
        this.auth = 'Bearer ' + authorization.split(' ')[1];
      }
      return this.auth;
    }

    return this.auth;
  }

  isServiceToken(authorization: any): boolean {
    const isServiceToken = authorization.split(' ')[0] == "ServiceToken" ? true : false;
    return isServiceToken;
  }

  tokenValidation(authorization?: string): string {

      if(!authorization) {
        throw new UnauthorizedError(`Authorization Error! Token not found`);
      }

      const isBearer = authorization.split(' ')[0] == "Bearer" ? true : false;
      const token = authorization.split(' ')[1];
  
      if (!isBearer) {
        throw new UnauthorizedError(`Authorization Error! Not a valid bearer token`);
      }

      if (token == null) {
        throw new UnauthorizedError(`Authorization Error! Not a valid bearer token`);
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new UnauthorizedError(`Authorization Error! Not a valid token`);
      }
  
      return authorization.split(' ')[1];

  }

  async get(path: string, isText = false, authorization?: string): Promise<any> {
    const url = new URL(path, this.oscar_endpoint);
    // Set authorization parameters according to configuration
    this.setAuthParams(authorization);

    const headers = new Headers();
    headers.append('Authorization', this.auth);
    console.log("GET Request in url:", url.toString());

    const response = await fetch(url.toString(), {
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

    if (isText) {
      return await response.text();
    }

    const data = await response.json();
    return data;
  }

  async post(path: string, body: any, authorization?: string): Promise<T> {
    // Convert buffer to string
    const url = new URL(path, this.oscar_endpoint);
    const headers = new Headers();

    // Set authorization parameters according to configuration
    this.setAuthParams(authorization);
    headers.append('Authorization', this.auth);
    headers.append('Content-Type', 'application/json');
    console.log("POST Request in url:", url.toString());

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    // Verify if response have an error (4xx or 5xx)
    if (!response.ok) {
      if(response.status == 401) {
        throw new UnauthorizedError("Unauthorized!!");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 200) {
      return new Promise((resolve, reject) => {
        body = response.text();
        resolve(body);
      });
    }
    if (response.status === 201) {
      return new Promise((resolve, reject) => {
        resolve(body);
      });
    }
    else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  }

  async put(path: string, body: any, authorization?: string): Promise<T> {
    const url = new URL(path, this.oscar_endpoint);
    const headers = new Headers();

    // Set authorization parameters according to configuration
    this.setAuthParams(authorization);
    headers.append('Authorization', this.auth);
    headers.append('Content-Type', 'application/json');
    console.log("PUT Request in url:", url.toString());

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    // Verify if response have an error (4xx or 5xx)
    if (!response.ok) {
      if(response.status == 401) {
        throw new UnauthorizedError("Unauthorized");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 201) {
      return new Promise((resolve, reject) => {
        resolve(body);
      });
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  }


  async delete(path: string, authorization?: string): Promise<any> {
    const url = new URL(path, this.oscar_endpoint);
    const headers = new Headers();

    // Set authorization parameters according to configuration
    this.setAuthParams(authorization);
    headers.append('Authorization', this.auth);
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