import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });

  const waitlist = parseInt(process.env.WAITLIST ?? '0', 10);
  return new Response(JSON.stringify({
    waitlistCount: (count ?? 0) + waitlist
  }), {
    headers: { "content-type": "application/json" }
  });
}
