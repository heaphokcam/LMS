import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import Logo from "../components/common/Logo";
import LoginThreeScene from "../components/three/LoginThreeScene";
import { useAppContext } from "../contexts/AppContext";
import { useLogin } from "../hooks/useAuthQueries";

const MotionSection = motion.section;

const ROLE_ORDER = ["CUSTOMER", "OFFICER", "MANAGER", "ADMIN"];

function pickWorkspaceRole(apiRoles) {
  if (!apiRoles?.length) {
    return "CUSTOMER";
  }
  const found = ROLE_ORDER.find((r) => apiRoles.includes(r));
  return found ?? apiRoles[0] ?? "CUSTOMER";
}

function LoginPage() {
  const router = useRouter();
  const { setRoles, setRole, t, theme, toggleTheme, language, setLanguage } =
    useAppContext();
  const loginMutation = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError(t("pages.login.fieldsRequired"));
      return;
    }

    loginMutation.mutate(
      { username: username.trim(), password },
      {
        onSuccess: (response) => {
          const roles = Array.isArray(response.data.roles)
            ? response.data.roles
            : response.data.role
              ? [response.data.role]
              : ["CUSTOMER"];
          setRoles(roles);
          const workspaceRole = pickWorkspaceRole(roles);
          setRole(workspaceRole);
          router.navigate({ to: "/dashboard" });
        },
        onError: (err) => {
          setError(
            err.response?.data?.message || t("pages.login.genericError"),
          );
        },
      },
    );
  };

  return (
    <div className="login-neon-bg min-h-screen overflow-hidden px-4 py-6 sm:px-6">
      <LoginThreeScene />
      <div className="login-scene-vignette" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
          <MotionSection
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="neon-card relative w-full max-w-md p-6 sm:p-8"
          >
            <span className="neon-card-glow" aria-hidden="true" />

            <div className="relative z-10">
              <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className="login-lang-wrap">
                  <span>{t("common.theme")}</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="login-inline-btn"
                  >
                    {theme === "dark" ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M18.5 12.7A7 7 0 1 1 11.3 5.5a6 6 0 1 0 7.2 7.2Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M12 2.5V5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    <span>
                      {theme === "dark"
                        ? t("common.darkMode")
                        : t("common.lightMode")}
                    </span>
                  </button>
                </label>

                <label className="login-lang-wrap">
                  <span>{t("common.language")}</span>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="login-inline-select"
                  >
                    <option value="en">English</option>
                    <option value="kh">ខ្មែរ</option>
                  </select>
                </label>
              </div>

              <div className="mb-5 flex justify-center">
                <div className="login-logo-shell inline-flex rounded-xl p-2.5">
                  <Logo className="h-14 w-14" />
                </div>
              </div>

              <h1 className="login-title text-center">
                {t("pages.login.title")}
              </h1>
              <p className="login-subtitle mt-2 text-center">
                {t("pages.login.subtitle")}
              </p>

              <form onSubmit={submit} className="mt-6 space-y-3">
                {error ? (
                  <div className="neon-login-alert flex items-center gap-2" role="alert">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                    <span>{error}</span>
                  </div>
                ) : null}

                <label className="block">
                  <span className="sr-only">{t("pages.login.username")}</span>
                  <div className="neon-input-wrap">
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="neon-input"
                      placeholder={t("pages.login.username")}
                    />
                    <svg
                      viewBox="0 0 24 24"
                      className="neon-input-icon"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>

                <label className="block">
                  <span className="sr-only">{t("pages.login.password")}</span>
                  <div className="neon-input-wrap">
                    <input
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="neon-input"
                      placeholder={t("pages.login.password")}
                    />
                    <svg
                      viewBox="0 0 24 24"
                      className="neon-input-icon"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="6"
                        y="11"
                        width="12"
                        height="9"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.9"
                      />
                      <path
                        d="M9 11V8a3 3 0 1 1 6 0v3"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </label>

                <div className="login-form-meta flex items-center justify-between gap-3 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="login-checkbox h-4 w-4 rounded"
                    />
                    {t("pages.login.rememberMe")}
                  </label>
                  <button type="button" className="neon-helper-link text-sm">
                    {t("pages.login.forgotPassword")}
                  </button>
                </div>

                <button
                  type="submit"
                  className="neon-login-btn text-base flex items-center justify-center gap-2"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  )}
                  {loginMutation.isPending
                    ? t("pages.login.submitting")
                    : t("pages.login.signIn")}
                </button>
              </form>

              <p className="login-register-text mt-4 text-center text-sm">
                {t("pages.login.noAccount")}{" "}
                <button
                  type="button"
                  className="neon-helper-link font-semibold"
                  onClick={() => router.navigate({ to: "/register" })}
                >
                  {t("pages.login.register")}
                </button>
              </p>
            </div>
          </MotionSection>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
