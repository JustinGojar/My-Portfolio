// Cloudflare Pages Functions entry; the handler lives in api/ and is shared with Vercel.
import { GET, POST } from '../../api/views.js';

export const onRequestGet = () => GET();
export const onRequestPost = () => POST();
