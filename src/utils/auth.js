// src/utils/auth.js
export function setAuthUser(user) {
  localStorage.setItem("attnUser", JSON.stringify(user));
}

export function getAuthUser() {
  try {
    return JSON.parse(localStorage.getItem("attnUser") || "null");
  } catch {
    return null;
  }
}

export function isAuthed() {
  const u = getAuthUser();
  return !!(u && u.userId && u.code);
}

export function clearAuth() {
  localStorage.removeItem("attnUser");
}
