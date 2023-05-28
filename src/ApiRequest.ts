import fetch, { Headers } from 'node-fetch';
import { ClientConfig } from "./models/Models"
import * as fs from 'fs';
import * as yaml from 'js-yaml';


export class ApiClient<T> {
  private readonly baseURL: string;
  private readonly auth: string;

  constructor() {
    const config: any = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
    const clientConfig: ClientConfig = config.client;

    this.baseURL = clientConfig.baseUri
    this.auth = "Basic " + Buffer.from(clientConfig.username + ":" + clientConfig.password).toString("base64");
  }

  async get(path: string, isText = false): Promise<any> {
    const url = new URL(path, this.baseURL);
    const headers = new Headers();
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

    const data= await response.json();
    return data;
  }

  async post(path: string, body: any): Promise<T> {
    const url = new URL(path, this.baseURL);
    const headers = new Headers();
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

    if (response.status === 201) {
      return new Promise((resolve, reject) => {
        resolve(body);
      });
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  }

  async put(path: string, body: any): Promise<T> {
    const url = new URL(path, this.baseURL);
    const headers = new Headers();
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


  async delete(path: string): Promise<any> {
    const url = new URL(path, this.baseURL);
    const headers = new Headers();
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