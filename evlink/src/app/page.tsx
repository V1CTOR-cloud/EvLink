import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  return (
    <main>
      <h1>EvLink</h1>

      <pre>
        {JSON.stringify(
          {
            user: data.user,
            error: error?.message,
          },
          null,
          2,
        )}
      </pre>
    </main>
  );
}