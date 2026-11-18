// Cloudflare Worker API proxy for Nebula AI.
// Add secrets: OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const json=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{...cors,"Content-Type":"application/json"}});
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(request.method==="OPTIONS")return new Response(null,{headers:cors});
  if(url.pathname!=="/chat")return json({error:"Not found"},404);
  if(request.method!=="POST")return json({error:"POST required"},405);
  try{
   const body=await request.json();
   const {provider,model,messages,system=""}=body;
   if(!Array.isArray(messages)||!messages.length)return json({error:"messages are required"},400);
   let response;
   if(provider==="openai"){
    if(!env.OPENAI_API_KEY)return json({error:"OPENAI_API_KEY secret is not configured"},500);
    response=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":`Bearer ${env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:model||"gpt-4o-mini",messages:[{role:"system",content:system},...messages],temperature:.7})});
    const d=await response.json();if(!response.ok)return json({error:d.error?.message||"OpenAI request failed"},response.status);
    return json({text:d.choices?.[0]?.message?.content||""});
   }
   if(provider==="anthropic"){
    if(!env.ANTHROPIC_API_KEY)return json({error:"ANTHROPIC_API_KEY secret is not configured"},500);
    response=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"x-api-key":env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","Content-Type":"application/json"},body:JSON.stringify({model:model||"claude-3-5-haiku-latest",max_tokens:2048,system,messages:messages.map(m=>({role:m.role,content:m.content}))})});
    const d=await response.json();if(!response.ok)return json({error:d.error?.message||"Claude request failed"},response.status);
    return json({text:(d.content||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n")});
   }
   if(provider==="gemini"){
    if(!env.GEMINI_API_KEY)return json({error:"GEMINI_API_KEY secret is not configured"},500);
    const contents=messages.map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:m.content}]}));
    response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model||"gemini-2.0-flash")}:generateContent?key=${env.GEMINI_API_KEY}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:.7}})});
    const d=await response.json();if(!response.ok)return json({error:d.error?.message||"Gemini request failed"},response.status);
    return json({text:d.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("\n")||""});
   }
   return json({error:"Unsupported provider"},400);
  }catch(e){return json({error:e.message||"Unexpected server error"},500)}
 }
};