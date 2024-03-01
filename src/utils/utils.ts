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
    return auth;
  }

  if (authType == AuthType.Oidc || authorization != undefined) {
    
    if (isServiceToken(authorization)) {
      auth = 'Bearer ' + authorization?.split(' ')[1];
    }
    else {
      auth = 'Bearer ' + authorization;
    }
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


function base64ToHex(base64String: string) {
  const binaryString = atob(base64String);
  const blockSize = 4096; // Tamaño del bloque en bytes
  let hexResult = '';
  let offset = 0;

  while (offset < binaryString.length) {
      const block = binaryString.substr(offset, blockSize);
      let blockHex = '';

      for (let i = 0; i < block.length; i++) {
          const hexChar = block.charCodeAt(i).toString(16);
          blockHex += (hexChar.length === 1 ? '0' : '') + hexChar;
      }

      hexResult += blockHex;
      offset += blockSize;
  }

  return hexResult;
}

export function getMimeType(base64String: string): string {

  const decodedString = base64ToHex(base64String);
  const signature = decodedString.substring(0, 16).toUpperCase(); 
  console.info("Signature: ", signature);

  const signatures: { [signature: string]: string } = {
    'EFBBBF': 'text/plain',           // TXT
    '89504E470D0A1A0A': 'image/png',  // PNG
    '47494638': 'image/gif',          // GIF
    'FFD8FF': 'image/jpeg',           // JPEG
    '504B0304': 'application/zip',    // ZIP
    '667479704D534E56': 'video/mp4',  // MP4
    '52494646': 'audio/wav',          // WAV
    '494433': 'audio/mpeg',           // MP3
    // Añadir más firmas según sea necesario
  };

  for (const [signatureBytes, mimeType] of Object.entries(signatures)) {
    if (signature.startsWith(signatureBytes)) {
      return mimeType;
    }
  }

  // Tipo MIME por defecto para datos binarios
  return 'application/octet-stream';
}

export function decodeFromBase64(stringBase64: string) {
  return atob(stringBase64);
}
