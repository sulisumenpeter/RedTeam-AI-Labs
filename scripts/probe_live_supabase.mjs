import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Parse .env.local manually
const envPath = path.resolve(".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function probe() {
  console.log("Connected to Supabase at:", supabaseUrl);

  const { data: frameworks, error: fErr } = await supabase.from("frameworks").select("*");
  if (fErr) console.error("Frameworks error:", fErr);
  else console.log("Frameworks in DB:", frameworks.map(f => ({ id: f.id, code: f.short_code, name: f.name })));

  const { data: versions, error: vErr } = await supabase.from("framework_versions").select("*");
  if (vErr) console.error("Versions error:", vErr);
  else console.log("Versions in DB:", versions);

  const { data: controls, error: cErr } = await supabase.from("framework_controls").select("*");
  if (cErr) console.error("Controls error:", cErr);
  else {
    console.log("Total controls in DB:", controls.length);
    console.log("Sample control columns:", Object.keys(controls[0] || {}));
    console.log("Control codes:", controls.map(c => c.control_code));
  }

  const { data: aiSystems, error: aErr } = await supabase.from("ai_systems").select("id, name, model_name");
  if (aErr) console.error("AI Systems error:", aErr);
  else console.log("AI Systems in DB:", aiSystems);

  const { data: campaigns, error: campErr } = await supabase.from("campaigns").select("id, name, status");
  if (campErr) console.error("Campaigns error:", campErr);
  else console.log("Campaigns in DB:", campaigns);
}

probe().catch(console.error);
