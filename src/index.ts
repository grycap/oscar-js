import { PostRequest } from './requests/PostRequest';
import { Request, Response } from 'express';
import express from "express";
import { GetRequest } from "./requests/GetRequest";
import { Config, Info, JobInfo, Service } from "./models/Models";

const app = express();
const pathConfig = 'system/config/'
const pathInfo = 'system/getRequest/'
const pathHealth = 'health'
const pathServices = 'system/services'
const pathLogs = 'system/logs/'

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------
// -------- HTTP GET METHODS -----------
// -------------------------------------

app.get("/getRequest", async (req, res) => {
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
  const rta = await getRequest.getRequest(pathHealth);
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
    const jobs: JobInfo[] = await getRequest.getRequest(pathLogs + req.params.serviceName + "/" + req.params.jobName);
    res.send(jobs);
  } catch (error) {
    res.status(404).send(error);
  }
});

// -------------------------------------
// -------- HTTP POST METHODS -----------
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


// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor en ejecución en el puerto 3000");
});