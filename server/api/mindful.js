import {randomUUID} from 'node:crypto';
import {HttpError,configuration,origins,boundedJSON} from '../lib/config.js';
import {authenticate} from '../lib/auth.js';
import {reserveQuota} from '../lib/quota.js';
import {validateInput} from '../lib/validation.js';
import {generate} from '../lib/providers/groq.js';
export default {async fetch(request){
  const requestId=randomUUID();
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','x-request-id':requestId,'vary':'Origin'};
  const origin=request.headers.get('origin');
  const send=(status,body)=>new Response(JSON.stringify(body),{status,headers});
  const failure=(status,code,stage)=>{
    console.error(JSON.stringify({event:'qatra_ai_failure',requestId,status,code,stage}));
    return send(status,{error:code,requestId});
  };
  if(origin){
    if(!origins().has(origin))return failure(403,'ORIGIN_NOT_ALLOWED','origin');
    headers['access-control-allow-origin']=origin;
    headers['access-control-expose-headers']='X-Request-Id';
  }
  if(request.method==='OPTIONS'){
    if(!origin)return failure(403,'ORIGIN_REQUIRED','origin');
    headers['access-control-allow-methods']='POST, OPTIONS';
    headers['access-control-allow-headers']='Authorization, Content-Type';
    return new Response(null,{status:204,headers});
  }
  if(request.method!=='POST'){
    headers.allow='POST, OPTIONS';
    return send(405,{error:'METHOD_NOT_ALLOWED',requestId});
  }
  let stage='configuration';
  try{
    const config=configuration();
    if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))throw new HttpError(415,'JSON_REQUIRED');
    stage='authentication';
    const subject=await authenticate(request,config);
    stage='validation';
    const input=validateInput(await boundedJSON(request,32768));
    stage='quota';
    await reserveQuota(request,subject,config);
    stage='provider';
    const data=await generate(input,config);
    return send(200,{requestId,data,provider:'remote',policyVersion:'qatra-ai-v1'});
  }catch(error){
    const status=error instanceof HttpError?error.status:503;
    if(status===429)headers['retry-after']='60';
    return failure(status,error instanceof HttpError?error.code:'SERVICE_UNAVAILABLE',stage);
  }
}};
