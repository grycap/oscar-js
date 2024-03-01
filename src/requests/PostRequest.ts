import { RequestProps } from "../types";
import { setAuthParams } from "../utils/utils";
import { UnauthorizedError } from "./UnauthorizedError";

export class PostRequest<T> {
    constructor() {}

    async postRequest(props: RequestProps, body: any, baseUrl?: string): Promise<T> {
        const { textResponse, path, client, authorization, authType } = props;
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
        headers.append("Authorization", auth);
        headers.append("Content-Type", "application/octet-stream");
        console.log("POST Request in url:", url);

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        // Verify if response have an error (4xx or 5xx)
        if (!response.ok) {
            if (response.status == 401) {
                throw new UnauthorizedError("Unauthorized!!");
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        //console.log("Response text --->", await response.text())
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
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    }
}
