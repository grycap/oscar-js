import { DeleteRequest, PostRequest, PutRequest } from "./requests";
import { GetRequest } from "./requests/GetRequest";
import { UnauthorizedError } from "./requests/UnauthorizedError";
import { AuthType, ClusterAuth, Config, Info, JobInfo, RequestProps, Service } from "./types";
import { decodeFromBase64, getMimeType } from "./utils/utils";

const pathConfig = "/system/config/";
const pathInfo = "/system/info/";
const pathHealth = "/health";
const pathServices = "/system/services/";
const pathLogs = "/system/logs/";
const runSync = "/run/";

export class Client {
    private _oscar_endpoint: string;
    private _username: string | undefined;
    private _password: string | undefined;
    private _oidc_token: string | undefined;
    private _auth_type: AuthType;

    public constructor({ clusterId, oscar_endpoint, username, password, oidc_token }: ClusterAuth) {
        this._oscar_endpoint = oscar_endpoint;
        this._username = username;
        this._password = password;
        this._oidc_token = oidc_token;

        // Set auth type looking for input params
        if (username !== undefined && password !== undefined) {
            this._auth_type = AuthType.BasicAuth;
        } else {
            this._auth_type = AuthType.Oidc;
        }
    }

    getOscarEndpoint(): string {
        return this._oscar_endpoint;
    }

    getUsername(): string | undefined {
        return this._username;
    }

    getPassword(): string | undefined {
        return this._password;
    }

    getAuthType(): AuthType {
        return this._auth_type;
    }

    getOidcToken(): string | undefined {
        return this._oidc_token;
    }

    /**
     * Get OSCAR cluster information
     * @returns cluster info
     */
    async getClusterInfo(): Promise<Info> {
        const props: RequestProps = {
            client: this,
            path: pathInfo,
            authorization: this._oidc_token,
            textResponse: false,
            authType: this._auth_type,
        };

        const request = new GetRequest<Info>();
        const rta = await request.getRequest(props);
        return rta;
    }

    /**
     * Get OSCAR cluster configuration
     * @returns configuration params
     */
    async getClusterConfig(): Promise<Config> {
        const props: RequestProps = {
            client: this,
            path: pathConfig,
            authorization: this._oidc_token,
            textResponse: false,
            authType: this._auth_type,
        };

        const request = new GetRequest<Config>();
        const rta = await request.getRequest(props);
        return rta;
    }

    /**
     * Get OSCAR cluster health status
     * @returns configuration params
     */
    async getHealthStatus(): Promise<String> {
        const props: RequestProps = {
            client: this,
            path: pathHealth,
            authorization: this._oidc_token,
            textResponse: true,
            authType: this._auth_type,
        };

        const request = new GetRequest<String>();
        const rta = await request.getRequest(props);
        return rta;
    }

    /**
     * Get list of services in OSCAR cluster
     * @returns services
     */
    async getServices(): Promise<Service[]> {
        const props: RequestProps = {
            client: this,
            path: pathServices,
            authorization: this._oidc_token,
            textResponse: false,
            authType: this._auth_type,
        };

        const request = new GetRequest<Service[]>();
        const rta: Service[] = await request.getRequest(props);
        return rta;
    }

    /**
     * Get service by name
     * @param serviceName servce namer identifier
     * @returns service
     */
    async getServiceByName(serviceName: string): Promise<Service> {
        const props: RequestProps = {
            client: this,
            path: pathServices + serviceName,
            authorization: this._oidc_token,
            textResponse: false,
            authType: this._auth_type,
        };

        const request = new GetRequest<Service>();
        const rta: Service = await request.getRequest(props);
        return rta;
    }

    /**
     * Get logs by service name.
     * @param serviceName service name
     * @returns logs of executed jobs
     */
    async getLogsByService(serviceName: string): Promise<JobInfo[]> {
        const props: RequestProps = {
            client: this,
            path: pathLogs + serviceName,
            authorization: this._oidc_token,
            textResponse: false,
            authType: this._auth_type,
        };

        const request = new GetRequest<JobInfo[]>();
        const rta: JobInfo[] = await request.getRequest(props);
        return rta;
    }

    /**
     * Get logs by service an job id
     * @param serviceName service name
     * @param jobName job id
     * @returns logs of executed job
     */
    async getLogsByJob(serviceName: string, jobName: string): Promise<JobInfo> {
        const props: RequestProps = {
            client: this,
            path: pathLogs + serviceName + "/" + jobName,
            authorization: this._oidc_token,
            textResponse: true,
            authType: this._auth_type,
        };

        const request = new GetRequest<JobInfo>();
        const rta: JobInfo = await request.getRequest(props);
        return rta;
    }

    /**
     * Create a new service into OSCAR cluster.
     * @param body service params
     * @returns created service
     */
    async createService(body: Service): Promise<Service> {
        const props: RequestProps = {
            client: this,
            path: pathServices,
            authorization: this._oidc_token,
            textResponse: false,
            authType: this._auth_type,
        };

        const request = new PostRequest<Service>();
        const response: Service = await request.postRequest(props, body);
        return response;
    }

    /**
     * Update existing service into OSCAR cluster.
     * @param body service params
     * @returns update service
     */
    async updateService(body: Service) {
        const props: RequestProps = {
            client: this,
            path: pathServices,
            authorization: this._oidc_token,
            textResponse: false,
            authType: this._auth_type,
        };

        const request = new PutRequest<Service>();
        const response: Service = await request.putRequest(props, body);
        return response;
    }

    /**
     * Run a service synchronously
     * @param serviceName service you wish to run
     * @param dataEncoded input data encode in base64
     * @returns response inference of the invoked service
     */
    async runService(serviceName: string, dataEncoded: string): Promise<any> {
        const props: RequestProps = {
            client: this,
            path: runSync + serviceName,
            authorization: this._oidc_token,
            textResponse: true,
            authType: this._auth_type,
        };

        const service = await this.getServiceByName(serviceName);
        const serviceToken = service.token;
        props.authorization = "ServiceToken " + serviceToken;

        const request = new PostRequest<JSON>();
        const response: any = await request.postRequest(props, dataEncoded);

        const mimeType = getMimeType(response);
        return { mime: mimeType, data: response };
    }

    async deleteService(serviceName: string): Promise<string> {
        const props: RequestProps = {
            client: this,
            path: pathServices,
            authorization: this._oidc_token,
            textResponse: false,
            authType: this._auth_type,
        };

        const request = new DeleteRequest<Service>();
        const response: Service = await request.deleteRequest(props, serviceName);
        return response.name;
    }
}
