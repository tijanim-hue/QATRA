import {randomUUID} from 'node:crypto';
import {HttpError,configuration,origins} from '../lib/config.js';

// Firebase client configuration is public by design. Never return server secrets.
export default {async fetch(request){
  const requestId=randomUUID();
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','x-request-id':requestId,'vary':'Origin'};
  const send=(status,body)=>new Response(JSON.stringify(body),{status,headers});
  const origin=request.headers.get('origin');
  if(!origin||!origins().has(origin))return send(403,{error:'ORIGIN_NOT_ALLOWED',requestId});
  headers['access-control-allow-origin']=origin;
  if(request.method==='OPTIONS'){
    headers['access-control-allow-methods']='GET, OPTIONS';
    return new Response(null,{status:204,headers});
  }
  if(request.method!=='GET'){
    headers.allow='GET, OPTIONS';
    return send(405,{error:'METHOD_NOT_ALLOWED',requestId});
  }
  if(process.env.AI_ENABLED!=='true')return send(200,{cloudEnabled:false,policyVersion:'qatra-ai-v1',requestId});
  try{
    const {env}=configuration();
    const projectId=env.OIDC_AUDIENCE;
    const apiKey=env.FIREBASE_WEB_API_KEY?.trim();
    if(!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId)||env.OIDC_ISSUER!=='https://securetoken.google.com/'+projectId||!apiKey||!/^[A-Za-z0-9_-]{20,200}$/.test(apiKey))throw new HttpError(503,'CONFIGURATION_REQUIRED');
    return send(200,{cloudEnabled:true,policyVersion:'qatra-ai-v1',identity:{provider:'firebase-anonymous',projectId,apiKey},requestId});
  }catch(error){
    console.error('client-config configuration error:',error&&error.name,error&&error.message);
    return send(503,{error:error instanceof HttpError?error.code:'SERVICE_UNAVAILABLE',requestId});
  }
}};
