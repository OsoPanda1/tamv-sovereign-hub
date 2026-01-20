import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// TAMV Justice 70/20/10 Distribution
const CREATOR_SHARE = 0.70;
const RESILIENCE_SHARE = 0.20;
const KERNEL_SHARE = 0.10;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, ...params } = await req.json();

    switch (action) {
      case "tip": {
        const { creator_id, amount, reference_id } = params;
        
        if (!creator_id || !amount || amount <= 0) {
          return new Response(
            JSON.stringify({ error: "Invalid tip parameters" }), 
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check user balance
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("msr_balance")
          .eq("id", user.id)
          .single();

        if (!userProfile || (userProfile.msr_balance || 0) < amount) {
          return new Response(
            JSON.stringify({ error: "Insufficient MSR balance" }), 
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Calculate distribution
        const creatorAmount = amount * CREATOR_SHARE;
        const resilienceAmount = amount * RESILIENCE_SHARE;
        const kernelAmount = amount * KERNEL_SHARE;

        // Execute distribution using the database function
        const { data: txId, error: txError } = await supabase.rpc("execute_msr_distribution", {
          p_amount: amount,
          p_creator_id: creator_id,
          p_description: `Tip from ${user.id}`,
          p_reference_id: reference_id,
          p_transaction_type: "tip"
        });

        if (txError) throw txError;

        // Deduct from sender
        await supabase
          .from("profiles")
          .update({ msr_balance: (userProfile.msr_balance || 0) - amount })
          .eq("id", user.id);

        console.log(`MSR Tip: ${amount} from ${user.id} to ${creator_id} (70/20/10 applied)`);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            transaction_id: txId,
            distribution: {
              creator: creatorAmount,
              resilience: resilienceAmount,
              kernel: kernelAmount
            }
          }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "purchase": {
        const { seller_id, amount, item_id, item_type } = params;
        
        // Execute distribution
        const { data: txId, error: txError } = await supabase.rpc("execute_msr_distribution", {
          p_amount: amount,
          p_creator_id: seller_id,
          p_description: `Purchase: ${item_type}`,
          p_reference_id: item_id,
          p_transaction_type: "purchase"
        });

        if (txError) throw txError;

        console.log(`MSR Purchase: ${amount} for ${item_type} (ID: ${item_id})`);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            transaction_id: txId
          }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_balance": {
        const { data: profile } = await supabase
          .from("profiles")
          .select("msr_balance")
          .eq("id", user.id)
          .single();

        return new Response(
          JSON.stringify({ balance: profile?.msr_balance || 0 }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_transactions": {
        const { limit = 20 } = params;
        
        const { data, error } = await supabase
          .from("msr_ledger")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;

        return new Response(
          JSON.stringify({ transactions: data || [] }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }), 
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("MSR transaction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Transaction failed" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
