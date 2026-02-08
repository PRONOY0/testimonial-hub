"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUser } from "@/hooks/useUser";

export default function GoogleAuthButton() {
    const { user, loading } = useUser();

    // 1. Wait until Firebase tells us the auth state
    if (loading) return null;

    // 2. If user exists → already signed in → show nothing
    if (user) return null;

    // 3. Otherwise show Google button
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    return (
        <button
            onClick={signInWithGoogle}
            className="rounded-lg bg-black px-6 py-3 text-white"
        >
            Continue with Google
        </button>
    );
}