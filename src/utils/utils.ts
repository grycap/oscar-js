import { UnauthorizedError } from "../requests/UnauthorizedError";
import { AuthType, RequestProps } from "../types";

export function setAuthParams(props: RequestProps ): string {
  const { textResponse, path, client, authorization, authType } = props;

  let auth = "";
  if (authType == AuthType.BasicAuth) {
    auth = "Basic " + btoa(`${client?.getUsername()}:${client?.getPassword()}`);
    
    if (isServiceToken(authorization)) {
      auth = 'Bearer ' + authorization?.split(' ')[1];
    }
    console.log("BASIC AUTH", auth)
    return auth;
  }

  if (authType == AuthType.Oidc || authorization != undefined) {
    
    if (isServiceToken(authorization)) {
      auth = 'Bearer ' + authorization?.split(' ')[1];
    }
    else {
      auth = 'Bearer ' + authorization;
    }
    console.log("Bearer AUTH", auth)
    return auth;
  }
  return auth;
}

export function isServiceToken(authorization: any): boolean {
  if (!authorization) return false;
  const isServiceToken = authorization.split(' ')[0] == "ServiceToken" ? true : false;
  return isServiceToken;
}

export function tokenValidation(authorization?: string): string {
  if(!authorization) {
    throw new UnauthorizedError(`Authorization Error! Token not found`);
  }

  const isBearer = authorization.split(' ')[0] == "Bearer" ? true : false;
  const token = authorization.split(' ')[1];

  if (!isBearer) {
    throw new UnauthorizedError(`Authorization Error! Not a valid bearer token`);
  }

  if (token == null) {
    throw new UnauthorizedError(`Authorization Error! Not a valid bearer token`);
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new UnauthorizedError(`Authorization Error! Not a valid token`);
  }

  return authorization.split(' ')[1];

}

export function decodeFromBase64(stringBase64: string) {
  return atob(stringBase64);
}
