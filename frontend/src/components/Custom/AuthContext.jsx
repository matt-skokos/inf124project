// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { isTokenExpired, msUntilExpiration } from "../../utils/jwt";
import API from "../../api"; // your Axios or fetch wrapper

/**
 * AuthContext provides:
 *  - isAuthenticated  (boolean)
 *  - logout()          (function to sign out + clear tokens + redirect)
 */
const AuthContext = createContext({
  isAuthenticated: false,
  logout: () => {},
});

/**
 * Custom hook for components to read auth status and call logout().
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * <AuthProvider> wraps <Routes> (or your entire App).
 * It:
 *  1) On mount, immediately checks if stored ID_TOKEN is expired. If so → logout.
 *  2) If not expired, schedules a setTimeout to run logout() exactly when the token hits exp.
 *  3) Hooks into API’s response interceptor: if a 401 / “id-token-expired” error comes back, do logout().
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Keep track of the timer so we can clear it if the user logs out manually
  let logoutTimer = null;

  /**
   * Call this to clear localStorage, sign out of Firebase, cancel timeout, and navigate to "/".
   */
  const logout = async () => {
    // 1. Clear any scheduled logout
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      logoutTimer = null;
    }

    // 2. Sign out from Firebase Auth (if currently signed in)
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signOut() after token expiration: ", e);
    }

    // 3. Remove tokens from localStorage
    localStorage.removeItem("ID_TOKEN");
    localStorage.removeItem("UID");

    // 4. Update state & redirect
    setIsAuthenticated(false);
    navigate("/"); // or your login route
  };

  /**
   * On first mount, run this effect once:
   *  - Check localStorage.getItem("ID_TOKEN"): if expired → logout()
   *  - Otherwise, schedule a timeout for msUntilExpiration(token),
   *    so that the user is auto-logged out exactly when the token’s exp passes.
   */
  useEffect(() => {
    const token = localStorage.getItem("ID_TOKEN");
    if (!token || isTokenExpired(token)) {
      // If there’s no token or it’s already expired, just log out immediately.
      logout();
      return;
    }

    // Token is valid right now → mark user as authenticated
    setIsAuthenticated(true);

    // Set up “auto-logout” at token expiry time:
    const delay = msUntilExpiration(token);
    if (delay > 0) {
      logoutTimer = setTimeout(() => {
        console.log("Token has expired; auto-logging out.");
        logout();
      }, delay);
    }

    // Clean up on unmount
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  /**
   * Attach a response interceptor to our API client. If any response returns
   *  a 401 or explicitly an “id-token-expired” code, we know we need to logout().
   */
  useEffect(() => {
    // Assuming API is an Axios instance; adapt if you use fetch.
    const requestInterceptor = API.interceptors.request.use((config) => {
      // Attach the ID_TOKEN to every request’s Authorization header
      const token = localStorage.getItem("ID_TOKEN");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      (error) => {
        // If backend returns 401, or FirebaseAdmin says “id-token-expired,” then logout
        const status = error.response?.status;
        const errorCode = error.response?.data?.code;

        if (
          status === 401 ||
          errorCode === "auth/id-token-expired" ||
          (error.message && error.message.includes("id-token-expired"))
        ) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Eject interceptors on unmount
      API.interceptors.request.eject(requestInterceptor);
      API.interceptors.response.eject(responseInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
