import { PostRequest } from './requests/PostRequest';
import express from "express";
import multer from 'multer';
import { GetRequest } from "./requests/GetRequest";
import { Config, Info, JobInfo, Service } from "./models/Models";
import { PutRequest } from './requests/PutRequest';
import { DeleteRequest } from './requests/DeleteRequest';

const app = express();
const pathConfig = 'system/config/'
const pathInfo = 'system/info/'
const pathHealth = 'health'
const pathServices = 'system/services/'
const pathLogs = 'system/logs/'
const runSync = 'run/'
const port = process.env.PORT || 3000;

//middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------------------------
// -------- HTTP GET METHODS -----------
// -------------------------------------

app.get("/info", async (req, res) => {
  const authorization = req.headers.authorization;
  const getRequest = new GetRequest<Info>();
  const rta = await getRequest.getRequest(pathInfo, false, authorization);
  res.send(rta);
});

app.get("/config", async (req, res) => {
  const authorization = req.headers.authorization;
  const getRequest = new GetRequest<Config>();
  const rta = await getRequest.getRequest(pathConfig, false, authorization);
  res.send(rta);
});

app.get("/health", async (req, res) => {
  const authorization = req.headers.authorization;
  const getRequest = new GetRequest<String>();
  const rta = await getRequest.getRequest(pathHealth, false, authorization);
  res.send(rta);
});

app.get("/services", async (req, res) => {
  const authorization = req.headers.authorization;
  const getRequest = new GetRequest<Service[]>();
  const services: Service[] = await getRequest.getRequest(pathServices, false, authorization);
  res.send(services);
});

app.get("/services/:serviceName", async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const getRequest = new GetRequest<Service>();
    const service: Service = await getRequest.getRequest(pathServices + req.params.serviceName, false, authorization);
    res.send(service);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/logs/:serviceName", async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const getRequest = new GetRequest<JobInfo[]>();
    const jobs: JobInfo[] = await getRequest.getRequest(pathLogs + req.params.serviceName, false, authorization);
    res.send(jobs);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/logs/:serviceName/:jobName", async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const getRequest = new GetRequest<JobInfo[]>();
    const jobs: JobInfo[] = await getRequest.getRequest(pathLogs + req.params.serviceName + "/" + req.params.jobName, true, authorization);
    res.send(jobs);
  } catch (error) {
    res.status(404).send(error);
  }
});

// -------------------------------------
// -------- HTTP POST METHODS ----------
// -------------------------------------

app.post("/services", async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const postRequest = new PostRequest<Service>()
    const requestBody = req.body;
    const service: Service = await postRequest.postRequest(pathServices, requestBody, authorization);
    res.send(service);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.post("/run/:serviceName", upload.single('file'), async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const file = req.file; // Archivo cargado

    if (!file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' });
    }

    // Leer el contenido del archivo y codificarlo en base64
    const fileData = file.buffer.toString('base64');

    const getServiceRequest = new GetRequest<Service>();
    const service: Service = await getServiceRequest.getRequest(pathServices + req.params.serviceName, false, authorization);
    var service_token = service.token;

    const postRunRequest = new PostRequest<JSON>();
    const response = await postRunRequest.postRequest(runSync + req.params.serviceName, fileData, "Bearer " + service_token);

    const decodedResponse = Buffer.from(JSON.stringify(response), 'base64').toString('utf-8');
    const parsedResponse = JSON.parse(decodedResponse.replace(/'/g, '"'));

    res.send(parsedResponse);

  } catch (error) {
    res.status(404).send(error);
  }
});

app.post("/job/:serviceName", async (req, res) => {

});


// -------------------------------------
// -------- HTTP PUT METHODS -----------
// -------------------------------------
app.put("/services", async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const putRequest = new PutRequest<Service>()
    const requestBody = req.body;
    const service: Service = await putRequest.putRequest(pathServices, requestBody, authorization);
    res.send(service);
  } catch (error) {
    res.status(404).send(error);
  }
});

// -------------------------------------
// -------- HTTP DELETE METHODS --------
// -------------------------------------

app.delete("/services/:serviceName", async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const deleteRequest = new DeleteRequest<String>()
    await deleteRequest.deleteRequest(pathServices + req.params.serviceName, authorization);
    res.send("Service " + req.params.serviceName + " has been successfully removed");
  } catch (error) {
    res.status(404).send(error);
  }
});

app.delete("/logs/:serviceName", async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const deleteRequest = new DeleteRequest<String>()
    await deleteRequest.deleteRequest(pathLogs + req.params.serviceName, authorization);
    res.send("Logs in the service " + req.params.serviceName + " has been successfully removed");
  } catch (error) {
    res.status(404).send(error);
  }
});

app.delete("/logs/:serviceName/:jobName", async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const deleteRequest = new DeleteRequest<String>()
    await deleteRequest.deleteRequest(pathLogs + req.params.serviceName + "/" + req.params.jobName, authorization);
    res.send("Logs in the service " + req.params.serviceName + " with job name " + req.params.jobName + " has been successfully removed");
  } catch (error) {
    res.status(404).send(error);
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});