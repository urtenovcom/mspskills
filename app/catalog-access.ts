import { env } from 'cloudflare:workers';
import { getChatGPTUser } from './chatgpt-auth';
export async function getCatalogEditor(){
  const user=await getChatGPTUser();
  const email=env.CATALOG_OWNER_EMAIL;
  return user && email && user.email.trim().toLowerCase()===email.trim().toLowerCase() ? user : null;
}
