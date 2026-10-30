// Cloudflare Pages Functions entry; the handler lives in api/ and is shared with Vercel.
import { POST } from '../../api/contact.js';

export const onRequestPost = ({ request }) => POST(request);
