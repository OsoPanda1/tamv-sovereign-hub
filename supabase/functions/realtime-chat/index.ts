import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
      case "send_message": {
        const { content, channel_id, receiver_id, message_type = "text" } = params;
        
        const { data, error } = await supabase
          .from("messages")
          .insert({
            content,
            sender_id: user.id,
            channel_id,
            receiver_id,
            message_type,
            is_encrypted: true,
          })
          .select()
          .single();

        if (error) throw error;
        
        console.log(`Message sent by ${user.id} to ${channel_id || receiver_id}`);
        return new Response(
          JSON.stringify({ success: true, message: data }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_messages": {
        const { channel_id, receiver_id, limit = 50 } = params;
        
        let query = supabase
          .from("messages")
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url)
          `)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (channel_id) {
          query = query.eq("channel_id", channel_id);
        } else if (receiver_id) {
          query = query.or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${user.id})`);
        }

        const { data, error } = await query;
        if (error) throw error;

        return new Response(
          JSON.stringify({ messages: data?.reverse() || [] }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "create_channel": {
        const { name, description, channel_type = "public" } = params;
        
        const { data: channel, error } = await supabase
          .from("channels")
          .insert({
            name,
            description,
            channel_type,
            owner_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        // Add creator as member
        await supabase
          .from("channel_members")
          .insert({
            channel_id: channel.id,
            user_id: user.id,
            role: "owner",
          });

        console.log(`Channel ${name} created by ${user.id}`);
        return new Response(
          JSON.stringify({ success: true, channel }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "join_channel": {
        const { channel_id } = params;
        
        const { error } = await supabase
          .from("channel_members")
          .insert({
            channel_id,
            user_id: user.id,
            role: "member",
          });

        if (error) throw error;

        // Update member count
        await supabase.rpc("increment_member_count", { channel_id });

        return new Response(
          JSON.stringify({ success: true }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_channels": {
        const { data, error } = await supabase
          .from("channels")
          .select(`
            *,
            owner:profiles!channels_owner_id_fkey(username, display_name, avatar_url),
            members:channel_members(user_id)
          `)
          .eq("channel_type", "public")
          .order("member_count", { ascending: false })
          .limit(20);

        if (error) throw error;

        return new Response(
          JSON.stringify({ channels: data || [] }), 
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
    console.error("Realtime chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Server error" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
