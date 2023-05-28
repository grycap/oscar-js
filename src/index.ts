import { PostRequest } from './requests/PostRequest';
import express from "express";
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
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------
// -------- HTTP GET METHODS -----------
// -------------------------------------

app.get("/info", async (req, res) => {
  const getRequest = new GetRequest<Info>();
  const rta = await getRequest.getRequest(pathInfo);
  res.send(rta);
});

app.get("/config", async (req, res) => {
  const getRequest = new GetRequest<Config>();
  const rta = await getRequest.getRequest(pathConfig);
  res.send(rta);
});

app.get("/health", async (req, res) => {
  const getRequest = new GetRequest<String>();
  const rta = await getRequest.getRequest(pathHealth, true);
  res.send(rta);
});

app.get("/services", async (req, res) => {
  const getRequest = new GetRequest<Service[]>();
  const services: Service[] = await getRequest.getRequest(pathServices);
  res.send(services);
});

app.get("/services/:serviceName", async (req, res) => {
  try {
    const getRequest = new GetRequest<Service[]>();
    const services: Service[] = await getRequest.getRequest(pathServices + req.params.serviceName);
    res.send(services);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/logs/:serviceName", async (req, res) => {
  try {
    const getRequest = new GetRequest<JobInfo[]>();
    const jobs: JobInfo[] = await getRequest.getRequest(pathLogs + req.params.serviceName);
    res.send(jobs);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/logs/:serviceName/:jobName", async (req, res) => {
  try {
    const getRequest = new GetRequest<JobInfo[]>();
    const jobs: JobInfo[] = await getRequest.getRequest(pathLogs + req.params.serviceName + "/" + req.params.jobName, true);
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
    const postRequest = new PostRequest<Service>()
    const requestBody = req.body;
    const service: Service = await postRequest.postRequest(pathServices, requestBody);
    res.send(service);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.post("/run/:serviceName", async (req, res) => {

});

app.post("/job/:serviceName", async (req, res) => {

});


// -------------------------------------
// -------- HTTP PUT METHODS -----------
// -------------------------------------
app.put("/services", async (req, res) => {
  try {
    const putRequest = new PutRequest<Service>()
    const requestBody = req.body;
    const service: Service = await putRequest.putRequest(pathServices, requestBody);
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
    const deleteRequest = new DeleteRequest<String>()
    await deleteRequest.deleteRequest(pathServices + req.params.serviceName);
    res.send("Service " +  req.params.serviceName + " has been successfully removed" );
  } catch (error) {
    res.status(404).send(error);
  }
});

app.delete("/logs/:serviceName", async (req, res) => {
  try {
    const deleteRequest = new DeleteRequest<String>()
    await deleteRequest.deleteRequest(pathLogs + req.params.serviceName);
    res.send("Logs in the service " +  req.params.serviceName + " has been successfully removed");
  } catch (error) {
    res.status(404).send(error);
  }
});

app.delete("/logs/:serviceName/:jobName", async (req, res) => {
  try {
    const deleteRequest = new DeleteRequest<String>()
    await deleteRequest.deleteRequest(pathLogs + req.params.serviceName + "/" + req.params.jobName);
    res.send("Logs in the service " + req.params.serviceName + " with job name " + req.params.jobName + " has been successfully removed");
  } catch (error) {
    res.status(404).send(error);
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});