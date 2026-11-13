import {createRemoteJWKSet,jwtVerify} from 'jose';
import {HttpError,https} from './config.js';
let cachedURL='',cachedResolver=null;
export async function authenticate(request,config){
  const authorization=request.headers.get('authorization')||'';
  if(authorization.length>8192||!/^Bearer [A-Za-z0-9_.-]+$/.test(authorization))throw new HttpError(401,'AUTHENTICATION_REQUIRED');
  const env=config.env;
  if(cachedURL!==env.OIDC_JWKS_URL){cachedURL=env.OIDC_JWKS_URL;cachedResolver=createRemoteJWKSet(https(cachedURL),{timeoutDuration:4000,cooldownDuration:30000,cacheMaxAge:300000});}
  try{
    const {payload}=await jwtVerify(authorization.slice(7),cachedResolver,{issuer:env.OIDC_ISSUER,audience:env.OIDC_AUDIENCE,algorithms:['RS256'],requiredClaims:['exp','iat','sub'],maxTokenAge:'1h',clockTolerance:15});
    if(typeof payload.sub!=='string'||!payload.sub||payload.sub.length>128)throw Error('subject');
    return payload.sub;
  }catch(error){throw new HttpError(401,'INVALID_OR_EXPIRED_IDENTITY');}
}
