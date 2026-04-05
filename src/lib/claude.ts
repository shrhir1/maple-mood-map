import { supabase } from "@/integrations/supabase/client";

export async function getMapleResponse(emotion: string, severity: number): Promise<{
  mapleMessage: string;
  recommendations: { icon: string; title: string; description: string }[];
  escalate: boolean;
  escalateMessage: string | null;
}> {
  const { data, error } = await supabase.functions.invoke("maple-response", {
    body: { emotion, severity },
  });

  if (error) {
    throw new Error(`Edge function error: ${error.message}`);
  }

  return data;
}
