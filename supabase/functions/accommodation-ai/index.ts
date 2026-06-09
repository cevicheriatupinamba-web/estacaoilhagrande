// AI helper for accommodations: rewrite descriptions + generate SEO
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

async function callAI(system: string, user: string, json = false) {
  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY missing');
    const { action, name, location, description, amenities } = await req.json();

    if (action === 'rewrite') {
      const sys = 'Você é um redator turístico premium para a Estação Ilha Grande. Reescreva descrições de pousadas em português, com tom comercial, acolhedor e otimizado para SEO. Evite cópia literal. Máximo 4 parágrafos curtos.';
      const usr = `Pousada: ${name ?? ''}\nLocalização: ${location ?? ''}\nDescrição original:\n${description ?? ''}`;
      const out = await callAI(sys, usr);
      return Response.json({ description: out.trim() }, { headers: corsHeaders });
    }

    if (action === 'seo') {
      const sys = 'Você é especialista em SEO turístico. Responda APENAS em JSON com as chaves: title (até 60 chars), meta_description (até 155 chars), slug (kebab-case, sem acentos), keywords (string separada por vírgulas), optimized_text (parágrafo otimizado de 80-120 palavras com palavras-chave naturais).';
      const usr = `Pousada: ${name ?? ''}\nLocalização: ${location ?? 'Ilha Grande, RJ'}\nComodidades: ${(amenities ?? []).join(', ')}\nDescrição: ${description ?? ''}`;
      const out = await callAI(sys, usr, true);
      let parsed: any = {};
      try { parsed = JSON.parse(out); } catch { parsed = { raw: out }; }
      return Response.json(parsed, { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: 'invalid action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
