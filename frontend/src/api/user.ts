// src/api/user.ts
import { API_URLS } from "@/config/api";

export async function fetchUserProfile() {
  try {
    const response = await fetch(API_URLS.USER.ME, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function logoutUser() {
  try {
    const response = await fetch(API_URLS.AUTH.LOGOUT, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to log out");
    }

    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    return false;
  }
}
