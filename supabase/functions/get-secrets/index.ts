import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing or invalid token', value: null }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { 
        global: { 
          headers: { Authorization: authHeader } 
        } 
      }
    )

    // Verify user and check if they have admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token', value: null }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Log the secret access attempt
    console.log(`Secret access attempt by user: ${user.email} at ${new Date().toISOString()}`)

    const { secretName } = await req.json()
    
    // Validate secret name (only allow alphanumeric and underscores)
    if (!secretName || !/^[A-Z0-9_]+$/.test(secretName)) {
      return new Response(
        JSON.stringify({ error: 'Invalid secret name format', value: null }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Get the secret from Deno environment
    const secretValue = Deno.env.get(secretName)
    
    if (!secretValue) {
      console.warn(`Secret not found: ${secretName} requested by ${user.email}`)
      return new Response(
        JSON.stringify({ error: 'Secret not found', value: null }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    // Log successful secret access
    console.log(`Secret accessed: ${secretName} by ${user.email}`)

    return new Response(
      JSON.stringify({ value: secretValue }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in get-secrets function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', value: null }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})