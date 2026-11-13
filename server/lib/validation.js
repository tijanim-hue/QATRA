import {HttpError} from './config.js';
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function only(value,allowed){if(!object(value)||Object.keys(value).some(k=>!allowed.includes(k)))throw new HttpError(400,'INVALID_REQUEST');}
function text(value,max,empty=false){if(typeof value!=='string'||value.length>max||(!empty&&!value.trim()))throw new HttpError(400,'INVALID_TEXT');return value;}
export function validateInput(value){
  only(value,['activity','text','feeling','intensity','turns','records','consent']);
  if(!['feelings','thought'].includes(value.activity))throw new HttpError(400,'INVALID_ACTIVITY');
  only(value.consent,['cloud','history','policyVersion']);
  if(value.consent.cloud!==true||typeof value.consent.history!=='boolean'||value.consent.policyVersion!=='qatra-ai-v1')throw new HttpError(403,'EXPLICIT_CONSENT_REQUIRED');
  const current=text(value.text,6000),feeling=value.feeling===undefined?'':text(value.feeling,60,true);
  const intensity=value.intensity??null;if(intensity!==null&&(!Number.isInteger(intensity)||intensity<1||intensity>10))throw new HttpError(400,'INVALID_INTENSITY');
  const turns=value.turns??[],records=value.records??[];
  if(!Array.isArray(turns)||turns.length>6||!Array.isArray(records)||records.length>3)throw new HttpError(400,'CONTEXT_TOO_LARGE');
  if(records.length&&!value.consent.history)throw new HttpError(403,'HISTORY_CONSENT_REQUIRED');
  const cleanTurns=turns.map(t=>{only(t,['role','text']);if(!['user','assistant'].includes(t.role))throw new HttpError(400,'INVALID_ROLE');return {role:t.role,text:text(t.text,1000)};});
  const cleanRecords=records.map(r=>{only(r,['kind','text']);if(!['feeling','thought','session','gratitude','intention','note'].includes(r.kind))throw new HttpError(400,'INVALID_RECORD_KIND');return {kind:r.kind,text:text(r.text,1000)};});
  if(current.length+cleanTurns.reduce((s,x)=>s+x.text.length,0)+cleanRecords.reduce((s,x)=>s+x.text.length,0)>14000)throw new HttpError(400,'CONTEXT_TOO_LARGE');
  return {activity:value.activity,text:current,feeling,intensity,turns:cleanTurns,records:cleanRecords};
}
export const replySchema={type:'object',additionalProperties:false,properties:{
 understanding:{type:'string'},question:{type:'string'},facts:{type:'array',items:{type:'string'}},assumptions:{type:'array',items:{type:'string'}},perspectives:{type:'array',items:{type:'string'}},reframe:{type:'string'},step:{type:'string'},needsClarification:{type:'boolean'},safety:{type:'string',enum:['routine','support']}
},required:['understanding','question','facts','assumptions','perspectives','reframe','step','needsClarification','safety']};
export function validateReply(value){
  try{
    only(value,Object.keys(replySchema.properties));
    text(value.understanding,1200);
    for(const [key,max] of Object.entries({question:400,reframe:1200,step:600}))text(value[key],max,true);
    for(const key of ['facts','assumptions','perspectives']){if(!Array.isArray(value[key])||value[key].length>4)throw Error('array');value[key].forEach(v=>text(v,500));}
    if(typeof value.needsClarification!=='boolean'||!['routine','support'].includes(value.safety))throw Error('shape');
    if(value.needsClarification&&!value.question.trim())throw Error('missing question');
    return value;
  }catch(error){throw new HttpError(502,'INVALID_MODEL_RESPONSE');}
}
