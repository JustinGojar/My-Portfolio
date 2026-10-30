// Cloudflare Pages Functions entry; the handler lives in api/ and is shared with Vercel.
import { DELETE, GET, PATCH } from '../../api/messages.js';

export const onRequestGet = ({ request }) => GET(request);
export const onRequestPatch = ({ request }) => PATCH(request);
export const onRequestDelete = ({ request }) => DELETE(request);
