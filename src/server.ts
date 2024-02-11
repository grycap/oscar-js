import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { GetRequest } from './requests/GetRequest';
import { PostRequest } from './requests/PostRequest';
import { PutRequest } from './requests/PutRequest';
import { DeleteRequest } from './requests/DeleteRequest';
import { Config, Info, JobInfo, Service } from './types';
import { UnauthorizedError } from './requests/UnauthorizedError';
import { AuthType, RequestProps } from './types';

const app = express();
const baseUrl = 'http://localhost';
const authType = AuthType.Oidc; 
const pathConfig = '/system/config/';
const pathInfo = '/system/info/';
const pathHealth = '/health';
const pathServices = '/system/services/';
const pathLogs = '/system/logs/';
const runSync = '/run/';
const port = 3000;

//middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Habilitar solicitudes CORS para todas las rutas
app.use(cors());

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------------------------
// -------- HTTP GET METHODS -----------
// -------------------------------------

app.get('/info', async (req, res) => {
  const props: RequestProps = {
    path: pathInfo,
    authorization: req.headers.authorization,
    textResponse: false,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const infoRequest = new GetRequest<Info>();
    const rta = await infoRequest.getRequest(props, baseUrl);
    res.send(rta);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.get('/config', async (req, res) => {
  const props: RequestProps = {
    path: pathConfig,
    authorization: req.headers.authorization,
    textResponse: false,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const configRequest = new GetRequest<Config>();
    const rta = await configRequest.getRequest(props, baseUrl);
    res.send(rta);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.get('/health', async (req, res) => {
  const props: RequestProps = {
    path: pathHealth,
    authorization: req.headers.authorization,
    textResponse: false,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const healthRequest = new GetRequest<String>();
    const rta = await healthRequest.getRequest(props, baseUrl);
    res.send(rta);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.get('/services', async (req, res) => {
  const props: RequestProps = {
    path: pathServices,
    authorization: req.headers.authorization,
    textResponse: false,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const serviceRequest = new GetRequest<Service[]>();
    const services: Service[] = await serviceRequest.getRequest(props, baseUrl);
    res.send(services);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.get('/services/:serviceName', async (req, res) => {
  const props: RequestProps = {
    path: pathServices + req.params.serviceName,
    authorization: req.headers.authorization,
    textResponse: false,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const serviceRequest = new GetRequest<Service>();
    const service: Service = await serviceRequest.getRequest(props, baseUrl);
    res.send(service);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.get('/logs/:serviceName', async (req, res) => {
  const props: RequestProps = {
    path: pathLogs + req.params.serviceName,
    authorization: req.headers.authorization,
    textResponse: false,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const logsRequest = new GetRequest<JobInfo[]>();
    const jobs: JobInfo[] = await logsRequest.getRequest(props, baseUrl);
    res.send(jobs);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.get('/logs/:serviceName/:jobName', async (req, res) => {
  const props: RequestProps = {
    path: pathLogs + req.params.serviceName + '/' + req.params.jobName,
    authorization: req.headers.authorization,
    textResponse: true,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const getRequest = new GetRequest<JobInfo[]>();
    const jobs: JobInfo[] = await getRequest.getRequest(props, baseUrl);
    res.send(jobs);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

// -------------------------------------
// -------- HTTP POST METHODS ----------
// -------------------------------------

app.post('/services', async (req, res) => {
  const props: RequestProps = {
    path: pathServices,
    authorization: req.headers.authorization,
    textResponse: true,
    authType
  }

  try {
    const postRequest = new PostRequest<Service>();
    const requestBody = req.body;
    const service: Service = await postRequest.postRequest(props, requestBody, baseUrl);
    res.send(service);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.post('/run/:serviceName', upload.single('file'), async (req, res) => {
  const props: RequestProps = {
    path: pathServices + req.params.serviceName,
    authorization: req.headers.authorization,
    textResponse: false,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const file = req.file; // Archivo cargado

    if (!file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' });
    }

    // Leer el contenido del archivo y codificarlo en base64
    const fileData = file.buffer.toString('base64');

    const getServiceRequest = new GetRequest<Service>();
    const service: Service = await getServiceRequest.getRequest(props, baseUrl);
    var service_token = service.token;

    const postRunRequest = new PostRequest<JSON>();
    props.authorization = 'ServiceToken ' + service_token
    const response = await postRunRequest.postRequest(props, fileData, baseUrl);

    const decodedResponse = Buffer.from(JSON.stringify(response), 'base64').toString('utf-8');
    const parsedResponse = JSON.parse(decodedResponse.replace(/'/g, '"'));
    res.send(parsedResponse);

  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.post('/job/:serviceName', async (req, res) => {});

// -------------------------------------
// -------- HTTP PUT METHODS -----------
// -------------------------------------
app.put('/services', async (req, res) => {
  const props: RequestProps = {
      path: pathServices,
      authorization: req.headers.authorization,
      textResponse: false,
      authType,
  };

  try {
      const putRequest = new PutRequest<Service>();
      const requestBody = req.body;
      const service: Service = await putRequest.putRequest(props, requestBody, baseUrl);
      res.send(service);
  } catch (error) {
      if (error instanceof UnauthorizedError) {
          res.status(401).send(error);
      } else {
          res.status(404).send(error);
      }
  }
});

// -------------------------------------
// -------- HTTP DELETE METHODS --------
// -------------------------------------

app.delete('/services/:serviceName', async (req, res) => {
  const props: RequestProps = {
    path: pathServices + req.params.serviceName,
    authorization: req.headers.authorization,
    textResponse: true,
    authType
  }

  try {
    const deleteRequest = new DeleteRequest<String>();
    await deleteRequest.deleteRequest(props, baseUrl);
    res.send('Service ' + req.params.serviceName + ' has been successfully removed');
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.delete('/logs/:serviceName', async (req, res) => {
  const props: RequestProps = {
    path: pathLogs + req.params.serviceName,
    authorization: req.headers.authorization,
    textResponse: true,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const deleteRequest = new DeleteRequest<String>();
    await deleteRequest.deleteRequest(props, baseUrl);
    res.send('Logs in the service ' + req.params.serviceName + ' has been successfully removed');
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

app.delete('/logs/:serviceName/:jobName', async (req, res) => {
  const props: RequestProps = {
    path: pathLogs + req.params.serviceName + '/' + req.params.jobName,
    authorization: req.headers.authorization,
    textResponse: true,
    authType
  }

  try {
    const authorization = req.headers.authorization;
    const deleteRequest = new DeleteRequest<String>();
    await deleteRequest.deleteRequest(props, baseUrl);
    res.send(
      'Logs in the service ' +
        req.params.serviceName +
        ' with job name ' +
        req.params.jobName +
        ' has been successfully removed'
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error);
    } else {
      res.status(404).send(error);
    }
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`OSCAR Endpoint ${process.env.OSCAR_ENDPOINT}`);
  console.log(`OSCAR AuthType ${process.env.AUTH_TYPE}`);
  console.log(`OSCAR username ${process.env.USERNAME}`);
  console.log(`OSCAR password ${process.env.PASSWORD}`);
});
