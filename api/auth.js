import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, type } = req.body;

    if (type === "register") {
      // Register user baru
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json({ message: "User registered", data });
    }

    if (type === "login") {
      // Login user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: "User logged in", data });
    }

    return res.status(400).json({ error: "Invalid type" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
