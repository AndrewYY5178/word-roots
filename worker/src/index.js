/**
 * word-roots-annot — annotation sync Worker
 *
 * Backs the "annotation" feature of https://andrewyy5178.github.io/word-roots/.
 * Stores a single blob in KV under key "annotations":
 *   { words: { "<word_lowercase>": { cn: "中文", ts: <ms>, del?: 1 } } }
 *
 * Reads are public. Writes require the `X-Annot-Key` header to match the
 * ANNOT_SECRET Worker secret. Writes are merged server-side per word by
 * timestamp (newer ts wins), so multiple devices never clobber each other.
 *
 * Style mirrors ../../ielts-beach/worker (hand-written router, jsonSuccess/
 * jsonError, withCORS).
 */

const KV_KEY = 'annotations';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // Landing page
    if (path === '/' && method === 'GET') {
      return withCORS(jsonSuccess({ service: 'word-roots-annot', ok: true }));
    }

    try {
      if (path === '/annotations' && method === 'GET') {
        return withCORS(await getAnnotations(env));
      }
      if (path === '/annotations' && method === 'POST') {
        return withCORS(await postAnnotations(request, env));
      }
      return withCORS(jsonError(404, 'NOT_FOUND', 'Endpoint not found'));
    } catch (e) {
      return withCORS(jsonError(500, 'INTERNAL_ERROR', 'An unexpected error occurred'));
    }
  },
};

// ── Handlers ──────────────────────────────────────────────

async function getAnnotations(env) {
  const words = await readWords(env);
  return jsonSuccess({ words });
}

async function postAnnotations(request, env) {
  // Write protection
  const key = request.headers.get('X-Annot-Key') || '';
  if (!env.ANNOT_SECRET || key !== env.ANNOT_SECRET) {
    return jsonError(401, 'UNAUTHORIZED', 'Invalid or missing passphrase');
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonError(400, 'BAD_REQUEST', 'Body must be valid JSON');
  }
  const incoming = body && body.words;
  if (!incoming || typeof incoming !== 'object') {
    return jsonError(400, 'BAD_REQUEST', 'Expected { words: { ... } }');
  }

  const stored = await readWords(env);
  const merged = mergeWords(stored, incoming);
  await env.ANNOT.put(KV_KEY, JSON.stringify({ words: merged }));
  return jsonSuccess({ words: merged });
}

// ── Storage + merge ───────────────────────────────────────

async function readWords(env) {
  const raw = await env.ANNOT.get(KV_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return (parsed && parsed.words) || {};
  } catch (e) {
    return {};
  }
}

// Per-word last-writer-wins by timestamp. Tombstones (del:1) merge the same way.
function mergeWords(stored, incoming) {
  const out = { ...stored };
  for (const [word, v] of Object.entries(incoming)) {
    if (!v || typeof v !== 'object') continue;
    const its = Number(v.ts) || 0;
    const existing = out[word];
    if (!existing || its >= (Number(existing.ts) || 0)) {
      const entry = { cn: String(v.cn == null ? '' : v.cn), ts: its };
      if (v.del) entry.del = 1;
      if (v.mark) entry.mark = 1;
      out[word] = entry;
    }
  }
  return out;
}

// ── Response helpers ──────────────────────────────────────

function jsonSuccess(data) {
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(status, code, message) {
  return new Response(JSON.stringify({ success: false, error: { code, message } }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Annot-Key',
    'Access-Control-Max-Age': '86400',
  };
}

function withCORS(response) {
  const out = new Response(response.body, response);
  for (const [k, v] of Object.entries(corsHeaders())) out.headers.set(k, v);
  return out;
}
