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

  let shouldRedirectToApp = false
  let shouldRedirectToLogin = false

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      shouldRedirectToApp = true
    } else {
      shouldRedirectToLogin = true
    }
  } catch (error) {
    // If auth check fails, redirect to app anyway
    console.error("Auth check failed:", error)
    shouldRedirectToApp = true
  }

  // Call redirect outside of try-catch since redirect() throws internally
  if (shouldRedirectToApp) {
    redirect("/app")
  }
  if (shouldRedirectToLogin) {
    redirect("/auth/login")
  }
}
