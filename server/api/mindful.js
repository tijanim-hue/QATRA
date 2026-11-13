import {randomUUID} from 'node:crypto';
import {HttpError,configuration,origins,boundedJSON} from '../lib/config.js';
import {authenticate} from '../lib/auth.js';
import {reserveQuota} from '../lib/quota.js';
import {validateInput} from '../lib/validation.js';
import {generate} from '../lib/providers/groq.js';
export default {async fetch(request){
  const requestId=randomUUID(),headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','x-request-id':requestId,'vary':'Origin'};
  const origin=request.headers.get('origin');
  const send=(status,body)=>new Response(JSON.stringify(body),{status,headers});
  if(origin){if(!origins().has(origin))return send(403,{error:'ORIGIN_NOT_ALLOWED',requestId});headers['access-control-allow-origin']=origin;}
  if(request.method==='OPTIONS'){
    if(!origin)return send(403,{error:'ORIGIN_REQUIRED',requestId});
    headers['access-control-allow-methods']='POST, OPTIONS';headers['access-control-allow-headers']='Authorization, Content-Type';return new Response(null,{status:204,headers});
  }
  if(request.method!=='POST'){headers.allow='POST, OPTIONS';return send(405,{error:'METHOD_NOT_ALLOWED',requestId});}
  try{
    const config=configuration();
    if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))throw new HttpError(415,'JSON_REQUIRED');
    const subject=await authenticate(request,config);
    const input=validateInput(await boundedJSON(request,32768));
    await reserveQuota(request,subject,config);
    const data=await generate(input,config);
    return send(200,{requestId,data,provider:'remote',policyVersion:'qatra-ai-v1'});
  }catch(error){const status=error instanceof HttpError?error.status:503;if(status===429)headers['retry-after']='60';return send(status,{error:error instanceof HttpError?error.code:'SERVICE_UNAVAILABLE',requestId});}
}};
