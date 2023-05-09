export interface ClientConfig {
  baseUri: string,
  username: string,
  password: string
}

export interface Config {
  minio_provider: MiniIOProvider,
  name: string,
  namespace: string,
  gpu_available: boolean,
  serverless_backend: string,
  yunikorn_enable: boolean
}

export interface Info {
  version:	string,
  git_commit: string,
  architecture:	string,
  kubernetes_version:	string,
  serverless_backend:	{
    name:	string,
    version:	string
  }
}

export interface Service {
  name:	string,
  cluster_id: string,
  memory: string
  cpu: string,
  enable_gpu: boolean,  
  total_mem: string
  synchronous : {
    min_scale: number,
    max_scale: number
  }
  replicas: Array<Replica>,
  rescheduler_threshold: number
  token: string,
  log_level: string,
  image: string,
  alpine: boolean,
  script: string,
  image_pull_secrets: Array<String>,
  environment: {
    Variables : {
      [key: string]: string;
    }
  },
  annotations: {
    [key: string]: string;
  },
  labels: {
    [key: string]: string;
  },
  input: Array<StorageIOConfig>,
  output: Array<StorageIOConfig> ,
  storage_providers: StorageProviders,
  clusters: Clusters
}

interface Clusters {
  id: {
    endpoint: string,
    auth_user: string,
    auth_password: string,
    ssl_verify: boolean
  }
}

interface Replica {
  type: string,
  cluster_id: string,
  service_name: string,
  url: string,
  ssl_verify: boolean,
  priority: number, 
  headers: {
    [key: string]: string;
  },
}

interface StorageIOConfig {
  storage_provider: string,
  path: string
  suffix: Array<String>,
  prefix: Array<String>
}

interface StorageProviders {
  s3: {
    id: {
      access_key: string,
      secret_key: string,
      region: string
    }
  },
  minio: {
    id: MiniIOProvider
  },
  onedata: {
    id: {
      oneprovider_host: string,
      token: string,
      space: string
    }
  },
  webdav: {
    id:{
      hostname: string,
      login: string,
      password: string
    }
  }
}

interface MiniIOProvider {
  endpoint: string,
  region: string,
  access_key: string,
  secret_key: string,
  verify: boolean
}

export interface JobInfo {
  status: string,
  creation_time: string,
  start_time: string,
  finish_time: string
}