import {createHmac} from 'node:crypto';
import {HttpError,https} from './config.js';
const lua=`for i=1,3 do
 local value=tonumber(redis.call('GET',KEYS[i]) or '0')
 if value>=tonumber(ARGV[i]) then return 0 end
end
for i=1,3 do
 local value=redis.call('INCR',KEYS[i])
 if value==1 then redis.call('EXPIRE',KEYS[i],i==3 and 172800 or 120) end
end
return 1`;
export async function reserveQuota(request,subject,config){
  // Trusted only on Vercel, which supplies/normalizes its forwarding headers.
  if(config.env.VERCEL!=='1')throw new HttpError(503,'VERCEL_DEPLOYMENT_REQUIRED');
  const ip=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if(!ip||ip.length>128)throw new HttpError(503,'CLIENT_ADDRESS_UNAVAILABLE');
  const day=new Date().toISOString().slice(0,10),minute=Math.floor(Date.now()/60000);
  const hash=s=>createHmac('sha256',config.env.RATE_LIMIT_HMAC_KEY).update(day+':'+s).digest('hex');
  const keys=['qatra:ai:v1:u:'+hash(subject)+':'+minute,'qatra:ai:v1:i:'+hash(ip)+':'+minute,'qatra:ai:v1:g:'+day];
  try{
    const result=await fetch(https(config.env.UPSTASH_REDIS_REST_URL),{method:'POST',redirect:'error',headers:{authorization:'Bearer '+config.env.UPSTASH_REDIS_REST_TOKEN,'content-type':'application/json'},body:JSON.stringify(['EVAL',lua,'3',...keys,String(config.userMinute),String(config.ipMinute),String(config.globalDay)]),signal:AbortSignal.timeout(3500)});
    if(!result.ok)throw Error('quota unavailable');const data=await result.json();if(data.error||![0,1].includes(data.result))throw Error('quota unavailable');
    if(data.result===0)throw new HttpError(429,'USAGE_LIMIT_REACHED');
  }catch(error){if(error instanceof HttpError)throw error;throw new HttpError(503,'USAGE_GUARD_UNAVAILABLE');}
}
