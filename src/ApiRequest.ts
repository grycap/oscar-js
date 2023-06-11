import fetch, { Headers } from 'node-fetch';
import { AuthType, ClientConfig } from "./models/Models"
import * as fs from 'fs';
import * as yaml from 'js-yaml';


export class ApiClient<T> {
  private readonly clientConfig: ClientConfig;
  private readonly oscar_endpoint: string;
  private auth: string = "";

  constructor() {
    const config: any = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
    this.clientConfig = config.client;
    this.oscar_endpoint = this.clientConfig.oscar_endpoint;
  }

  setAuthParams(token?: String): string {
    if (this.clientConfig.auth_type == AuthType.BasicAuth) {
      this.auth = "Basic " + Buffer.from(this.clientConfig.username + ":" + this.clientConfig.password).toString("base64");
    }

    if (this.clientConfig.auth_type == AuthType.Oidc || token != undefined) {
      this.auth = "Bearer " + token;
    }

    return this.auth;
  }

  async get(path: string, isText = false, token?: string): Promise<any> {
    const url = new URL(path, this.oscar_endpoint);
    const headers = new Headers();

    // Set authorization parameters according to configuration
    this.setAuthParams(token);
    headers.append('Authorization', this.auth);
    console.log("GET Request in url:", url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    // Verify if response have an error (4xx or 5xx)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (isText) {
      return await response.text();
    }

    const data = await response.json();
    return data;
  }

  async post(path: string, body: any, token?: string): Promise<T> {
    // Convert buffer to string
    const url = new URL(path, this.oscar_endpoint);
    const headers = new Headers();

    // Set authorization parameters according to configuration
    this.setAuthParams(token);
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

  async put(path: string, body: any, token?: string): Promise<T> {
    const url = new URL(path, this.oscar_endpoint);
    const headers = new Headers();

    // Set authorization parameters according to configuration
    this.setAuthParams(token);
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


  async delete(path: string, token?: string): Promise<any> {
    const url = new URL(path, this.oscar_endpoint);
    const headers = new Headers();

    // Set authorization parameters according to configuration
    this.setAuthParams(token);
    headers.append('Authorization', this.auth);
    console.log("DELETE Request in url:", url.toString());

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers
    });

    // Verify if response have an error (4xx or 5xx)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const status = response.status;
    return status;
  }
}