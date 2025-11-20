import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  // If Supabase is not configured, redirect directly to app
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // No Supabase configuration - skip auth and go to app
    redirect("/app")
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      redirect("/app")
    } else {
      redirect("/auth/login")
    }
  } catch (error) {
    // If auth check fails, redirect to app anyway
    console.error("Auth check failed:", error)
    redirect("/app")
  }
}
