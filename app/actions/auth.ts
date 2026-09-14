"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// Initialisation du client Supabase côté serveur
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Tous les champs sont requis." };
  }

  // 1. Authentification via Supabase (génère le JWT)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return { success: false, error: "Identifiants invalides." };
  }

  // 2. Création du Cookie HTTP-Only ultra sécurisé (comme ton ancien AuthController)
  const cookieStore = await cookies();
  cookieStore.set("k_access_token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });

  return { success: true };
}
