import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gtpnqtqavnzgyfkwxyqv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0cG5xdHFhdm56Z3lma3d4eXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3ODA4NTUsImV4cCI6MjA2MTM1Njg1NX0.AeuNQ_EW6cFITg4VTlmXiJsoWCcaStA4yi3_89Qj5Ac";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
