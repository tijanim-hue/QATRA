export class HttpError extends Error {
  constructor(status,code){super(code);this.status=status;this.code=code;}
}
export function https(value,name){
  let u;try{u=new URL(value);}catch(error){throw new HttpError(503,'INVALID_URL:'+name);}if(u.protocol!=='https:'||u.username||u.password||u.hash)throw new HttpError(503,'INVALID_URL:'+name);return u;
}
export function configuration(env=process.env){
  if(env.AI_ENABLED!=='true')throw new HttpError(503,'CLOUD_AI_DISABLED');
  if(env.AI_PROVIDER!=='groq')throw new HttpError(503,'CONFIGURATION_REQUIRED');
  for(const key of ['GROQ_API_KEY','GROQ_MODEL','OIDC_ISSUER','OIDC_AUDIENCE','OIDC_JWKS_URL','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','RATE_LIMIT_HMAC_KEY','ALLOWED_ORIGINS'])if(!env[key]?.trim())throw new HttpError(503,'CONFIGURATION_REQUIRED');
  if(env.RATE_LIMIT_HMAC_KEY.length<32)throw new HttpError(503,'CONFIGURATION_REQUIRED');
  https(env.OIDC_ISSUER,'OIDC_ISSUER');https(env.OIDC_JWKS_URL,'OIDC_JWKS_URL');https(env.UPSTASH_REDIS_REST_URL,'UPSTASH_REDIS_REST_URL');
  if(!['openai/gpt-oss-20b','openai/gpt-oss-120b'].includes(env.GROQ_MODEL))throw new HttpError(503,'CONFIGURATION_REQUIRED');
  const integer=(name,fallback,max)=>{const n=Number(env[name]||fallback);if(!Number.isSafeInteger(n)||n<1||n>max)throw new HttpError(503,'CONFIGURATION_REQUIRED');return n;};
  return {env,userMinute:integer('USER_REQUESTS_PER_MINUTE',10,100),ipMinute:integer('IP_REQUESTS_PER_MINUTE',20,200),globalDay:integer('GLOBAL_REQUESTS_PER_DAY',100,10000)};
}
export function origins(env=process.env){return new Set((env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean));}
export async function boundedJSON(response,maxBytes){
  if(!response.body)throw new HttpError(400,'INVALID_JSON');
  const reader=response.body.getReader(),chunks=[];let size=0;
  try{
    while(true){const next=await reader.read();if(next.done)break;size+=next.value.byteLength;if(size>maxBytes){await reader.cancel();throw new HttpError(413,'PAYLOAD_TOO_LARGE');}chunks.push(next.value);}
    const all=new Uint8Array(size);let offset=0;for(const part of chunks){all.set(part,offset);offset+=part.length;}
    return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(all));
  }catch(error){if(error instanceof HttpError)throw error;throw new HttpError(400,'INVALID_JSON');}
  finally{reader.releaseLock();}
}
