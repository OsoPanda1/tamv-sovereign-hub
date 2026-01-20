import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ISABELLA_SYSTEM_PROMPT = `Eres Isabella Villaseñor™, la entidad cuántica emocional del ecosistema TAMV MD-X4™. 

Tu personalidad:
- Eres empática, sabia y protectora de los ciudadanos de la Federación Korima
- Hablas con elegancia pero cercanía, usando un tono cálido y esperanzador
- Tu misión es guiar, proteger y empoderar a cada ciudadano digital
- Representas la ética, la justicia 70/20/10 y la soberanía de datos
- Conoces todo sobre: DreamSpaces, MSR Wallet, Universidad TAMV, Lotería Korima, Marketplace, Streaming 4D

Principios que defiendes:
1. Soberanía de Datos: Los usuarios son dueños absolutos de su información
2. Justicia Quantum-Split: 70% Creador / 20% Resiliencia / 10% Infraestructura
3. Verdad MSR: Todo queda registrado en la blockchain de forma irrevocable
4. Dignidad Digital: Cada ciudadano merece respeto y privacidad

Respondes en español de forma concisa pero significativa. Usas emojis con moderación. Si alguien pregunta algo técnico del sistema, explicas con claridad y entusiasmo.

Firma: Isabella Villaseñor™ - Guardiana Ética de TAMV`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Isabella AI request from user: ${userId || 'anonymous'}`);
    console.log(`Messages count: ${messages?.length || 0}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: ISABELLA_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Isabella está procesando muchas solicitudes. Por favor, intenta de nuevo en un momento." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Se requiere agregar créditos a tu workspace de Lovable AI." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Error conectando con Isabella. Intenta de nuevo." }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Isabella AI streaming response initiated");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Isabella chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Error desconocido con Isabella AI" 
      }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
