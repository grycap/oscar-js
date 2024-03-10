# Javascript client for OSCAR

This project has been developed using version 18.12 of Node.js and typed with the Typescript language, oscar-js can be used with a module by adding it as a dependency in the package.json file or by using the command `npm install @grycap/oscar-js`. This package exports a client class which creates a new instance of the oscar-js-client. Once the class is initialized, passing the correct parameters will make it possible to interact with an OSCAR cluster and its services (https://oscar.grycap.net). It is available on GitHub packages wit the name [oscar-js](https://github.com/grycap/oscar-js/pkgs/npm/oscar-js)

## Client

To construct an instance of this class, you must pass an object as an argument. Depending on the fields sent, Basic Auth or OIDC Auth will be used.

### Basic auth

For this type of authentication, you will need to send the object with values in the fields **oscar_endpoint, username, password**.

```typescript
const basic_auth = {
    clusterId: "cluster-id",
    oscar_endpoint: "https://my-oscar-cluster",
    username: "oscar",
    password: "secret",
};

const oscar_client: Client = new Client(basic_auth);
```

### OIDC authentication

For this type of authentication, you should send the object with values in the fields **oscar_endpoint, oidc_token**.

```typescript
const oidc_auth = {
    clusterId: "cluster-id",
    oscar_endpoint: "https://my-oscar-cluster",
    oidc_token: "Bearer token",
};

const oscar_client: Client = new Client(oidc_auth);
```

## Sample usage

-   Basic sample using client to obtain information of the cluster you want to interact with.
    Remember you must put the correct url of your oscar_endpoint. Response is type Info. You may view all the types used in the class [types.ts](src/types.ts)

```typescript
const basic_auth = {
    clusterId: "cluster-id",
    oscar_endpoint: "https://my-oscar-cluster",
    username: "oscar",
    password: "secret",
};

const oscar_client: Client = new Client(basic_auth);

// Get infomation about your oscar cluster
let response = oscar_client.getClusterInfo();
console.log("Cluster Info", response);
```

-   Basic sample using client to create a new service in oscar cluster. This example has the minimum attributes for the creation of a new service. You can see the complete structure of the service in [types.ts](src/types.ts)

```typescript
const basic_auth = {
    clusterId: "cluster-id",
    oscar_endpoint: "https://my-oscar-cluster",
    username: "oscar",
    password: "secret",
};

const oscar_client: Client = new Client(basic_auth);

// Create service object
const service: Service = {
    name: "bird-audio-test",
    memory: "2Gi",
    cpu: "2.0",
    total_memory: "2Gi",
    total_cpu: "2.0",
    enable_gpu: false,
    enable_sgx: false,
    log_level: "CRITICAL",
    image: "deephdc/deep-oc-birds-audio-classification-tf",
    script: "<service-script>",
};

// Show created service info in console.
let response = await oscar_client.createService(service);
console.log("Created service", response);
```

## Services methods

Available methods for interacting with the cluster's services.

**Get Services**

```typescript
// Returns a promise, when resolved contains a list of services
const services = await oscar_client.getServices();
```

**Get Service by name**

```typescript
// Returns a promise, when resolved contains a single service if exists
const service = await oscar_client.getServiceByName("my-service");
```

**Create Service**

```typescript
// Returns a promise, when resolved contains the created service.
const service = { ... };
const createdService = await oscar_client.createService(service);
```

**Update Service**

```typescript
// Returns a promise, when resolved contains the updated service.
const service = { ... };
const updatedService = await oscar_client.updateService(service);
```

**Delete Service**

```typescript
// Returns a promise, when resolved contains name of the deleted service.
const deletedService = await oscar_client.deleteService("my-service");
```

## Cluster methods

Available methods to interact directly with the OSCAR cluster.

**Get cluster info**

```typescript
// Get cluster information
const info = await oscar_client.getClusterInfo();
```

**Get cluster config**

```typescript
// Get cluster information
const config = await oscar_client.getClusterConfig();
```

**Get cluster health status**

```typescript
// Get cluster information
const health = await oscar_client.getHealthStatus();
```
