import { useState } from "react";
import { Compass, X } from "lucide-react";
import { MainLogo } from "./icons";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "cs";
  onLoginSuccess: (user: { name: string; email: string; role: "user" }) => void;
  onGoRegister: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  language,
  onLoginSuccess,
  onGoRegister,
}: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setMode("login");
    setError("");
    setForgotSent(false);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "user@example.com" && password === "password") {
      const user = { name: "User", email, role: "user" as const };
      if (rememberMe) {
        localStorage.setItem("hikerSession", JSON.stringify(user));
      }
      setEmail("");
      setPassword("");
      setMode("login");
      onLoginSuccess(user);
    } else {
      setError(
        language === "en"
          ? "Invalid email or password."
          : "Nesprávný e-mail nebo heslo."
      );
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(
        language === "en" ? "Please enter your email address." : "Zadejte svůj e-mail."
      );
      return;
    }
    setError("");
    setForgotSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/80 p-4 backdrop-blur-sm"
      onClick={resetAndClose}
    >
      <div
        className="relative w-full max-w-md animate-fade-in rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={resetAndClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          <div className="space-y-1.5 text-center">
            <MainLogo className="mx-auto h-8 w-8" />
            <h2 className="font-display text-xl font-bold uppercase tracking-wider text-slate-900">
              {mode === "login"
                ? language === "en"
                  ? "Sign In To Your Adventure"
                  : "Přihlaste se k dobrodružství"
                : language === "en"
                  ? "Reset Password"
                  : "Obnovení hesla"}
            </h2>
            <p className="text-xs font-light text-slate-400">
              {mode === "login"
                ? language === "en"
                  ? "Access your digital stamp pass and saved adventures."
                  : "Získejte přístup k digitálnímu pasu razítek a uloženým výletům."
                : language === "en"
                  ? "Enter your email and we will send you a reset link."
                  : "Zadejte e-mail a pošleme vám odkaz pro obnovení hesla."}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === "en" ? "Email Address" : "E-mailová adresa"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. user@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === "en" ? "Password" : "Heslo"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer select-none items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-200 bg-slate-50 text-emerald-500 focus:ring-0"
                  />
                  <span className="text-[11px] text-slate-400">
                    {language === "en" ? "Remember my session" : "Zapamatovat přihlášení"}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError("");
                    setForgotSent(false);
                  }}
                  className="text-[11px] text-emerald-600 hover:underline"
                >
                  {language === "en" ? "Forgot password?" : "Zapomenuté heslo?"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-emerald-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500"
              >
                {language === "en" ? "Login" : "Přihlásit se"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {forgotSent ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-xs text-emerald-700">
                  {language === "en"
                    ? "If an account exists for that email, a password reset link has been sent."
                    : "Pokud účet s tímto e-mailem existuje, byl odeslán odkaz pro obnovení hesla."}
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {language === "en" ? "Email Address" : "E-mailová adresa"}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. user@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setForgotSent(false);
                  }}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
                >
                  {language === "en" ? "Back to Sign In" : "Zpět na přihlášení"}
                </button>
                {!forgotSent && (
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500"
                  >
                    {language === "en" ? "Send Reset Link" : "Odeslat odkaz"}
                  </button>
                )}
              </div>
            </form>
          )}

          {mode === "login" && (
            <p className="text-center text-[11px] text-slate-500">
              {language === "en" ? "Don't have an account? " : "Nemáte účet? "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setForgotSent(false);
                  onGoRegister();
                }}
                className="font-semibold text-emerald-600 hover:underline"
              >
                {language === "en" ? "Register" : "Registrovat se"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
