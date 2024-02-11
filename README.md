# Javascript client for OSCAR

This project uses Node.js as the runtime environment, Express as the web application framework and TypeScript to add static typing to the code. This client connects to an OSCAR cluster (https://oscar.grycap.net) to interact with the cluster and its services.

## Project Setup
Clone and download the repository to your local machine. Make sure you have Node.js installed on the machine. If not, you can install it by following the instructions [install node js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).

```bash
git clone https://github.com/grycap/oscar-js.git
cd oscar-js
npm install
```

### Development environment setup. Compilation and hot reloading for developers
```bash
npm run start:dev
```
### Production environment setup
```shell
npm run build
npm run start:prod
```

## Running on docker
Use the Dockerfile file that is in the root of the project, I leaft the [link](./Dockerfile) for you to check it out. We continue with the compilation of the docker image, use the following command.
```bash
docker build . -t <image_name:tag>
``` 
Obtain the correct name of the previously compiled image using the following command.

```bash
docker ps 
```

Now continue to prepare the execution of the docker container from the terminal, make sure to set the correct environment variables for authentication type of OSCAR cluster.  

```bash
docker run -e AUTH_TYPE=oidc OSCAR_ENDPOINT=<your_cluster_oscar> <docker_image:tag>
```

To use basic authorization, remember to add the environment variables username and password.
```bash
docker run -e AUTH_TYPE=basicauth OSCAR_ENDPOINT=<your_oscar_cluster> -e PASSWORD=<oscar_password> -e USERNAME=<oscar_username> <docker_image:tag>
```

If the project has been successfully executed, you will see the output as shown below  
<img src="./assets/images/out.png" alt="output" width="600"/> 

## Client methods
### Cluster methods
### Services methods
### Logs methods
