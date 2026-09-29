declare namespace Cloudflare {
  interface Env {
    CATALOG_OWNER_EMAIL?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
