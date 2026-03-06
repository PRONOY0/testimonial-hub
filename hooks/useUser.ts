"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import axios from "axios";
import { authentiCateUrl } from "@/lib/api";

interface DbUser {
  id: string;
  name: string;
  avatarUrl: string;
  userName: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        // User is logged in
        try {
          const token = await u.getIdToken();

          await axios.post(
            authentiCateUrl,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const res = await axios.get("/api/user");
          setDbUser(res.data.user);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setDbUser(null); // Reset on error
        }
      } else {
        // User is NOT logged in
        setDbUser(null); // Clear DB user data
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, dbUser, loading };
}
