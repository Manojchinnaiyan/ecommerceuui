// lib/hooks/use-auth.ts
"use client";

import { useContext } from "react";
import { AuthContext } from "@/lib/providers/auth-provider";

export const useAuth = () => {
  return useContext(AuthContext);
};
