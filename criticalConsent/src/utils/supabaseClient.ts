import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with the database

const supabaseUrl = "https://xosmxsbqnzyquowigbth.supabase.co";
const supabaseAnonKey =
  /* cspell: disable-next-line */
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvc214c2Jxbnp5cXVvd2lnYnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM1MjA1MjcsImV4cCI6MTk3OTA5NjUyN30.CKzOLEsKlNHeA729xlMqC0gx_KOi3zd95G7268ndH68";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
