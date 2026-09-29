import { env } from 'cloudflare:workers';
import { getCatalogEditor } from '../../../catalog-access';
import { ownerPrefix } from '../route';
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){try{
const {id}=await params;
if(!/^[a-f0-9]{64}-[a-f0-9-]{36}$/.test(id))return new Response(null,{status:404});
const published=await env.DB?.prepare('SELECT id FROM entries WHERE image = ? LIMIT 1').bind('/api/images/'+id).first();
if(!published){const editor=await getCatalogEditor();if(!editor||!id.startsWith(await ownerPrefix(editor.userId)+'-'))return new Response(null,{status:404});}
const object=await env.BUCKET?.get(id);if(!object)return new Response(null,{status:404});
return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'application/octet-stream','Cache-Control':'private, no-cache','X-Content-Type-Options':'nosniff'}});
}catch{return new Response(null,{status:503});}}
