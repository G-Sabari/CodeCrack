// Scheduled: scans ended contests with auto_generate rules and not yet finalized,
// then issues certificates automatically.
import { finalizeContest, adminClient } from "../_shared/finalize.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const admin = adminClient();
  const nowIso = new Date().toISOString();

  // Find contests that ended and aren't finalized yet AND have auto_generate rules enabled
  const { data: ended } = await admin
    .from("contests")
    .select("id, end_time, finalized_at, certificate_rules!inner(enabled, auto_generate)")
    .lte("end_time", nowIso)
    .is("finalized_at", null);

  const targets = (ended ?? []).filter((c: any) =>
    c.certificate_rules?.enabled && c.certificate_rules?.auto_generate
  );

  const results: any[] = [];
  for (const c of targets) {
    try {
      results.push(await finalizeContest(admin, c.id, null));
    } catch (e) {
      results.push({ contest_id: c.id, error: (e as Error).message });
    }
  }

  return new Response(JSON.stringify({ checked: targets.length, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
