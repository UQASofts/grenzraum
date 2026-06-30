import { useState } from "react";
import { Compass, X } from "lucide-react";
import { MainLogo } from "./icons";
import { AppLanguage, tr } from "../i18n/language";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onOpenLogin: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  language,
  onOpenLogin,
}: RegisterModalProps) {
  const txt = (en: string, de: string, cs: string) => tr(language, en, de, cs);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setRegistered(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(txt("Password must be at least 6 characters.", "Passwort muss mindestens 6 Zeichen haben.", "Heslo musí mít alespoň 6 znaků."));
      return;
    }

    if (password !== confirmPassword) {
      setError(txt("Passwords do not match.", "Passwörter stimmen nicht überein.", "Hesla se neshodují."));
      return;
    }

    setRegistered(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={resetAndClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md animate-fade-in overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
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
          {registered ? (
            <>
              <div className="space-y-1.5 text-center">
                <Compass className="mx-auto h-8 w-8 text-emerald-600" />
                <h2 className="font-display text-xl font-bold uppercase tracking-wider text-slate-900">
                  {txt("Welcome, Adventurer!", "Willkommen, Abenteurer!", "Vítejte, dobrodruhu!")}
                </h2>
                <p className="text-xs text-slate-400">
                  {txt(
                    `Your account for ${email} has been created. Sign in to start collecting stamps.`,
                    `Ihr Konto für ${email} wurde erstellt. Melden Sie sich an, um Stempel zu sammeln.`,
                    `Váš účet pro ${email} byl vytvořen. Přihlaste se a začněte sbírat razítka.`
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetAndClose();
                  onOpenLogin();
                }}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500"
              >
                {txt("Sign In Now", "Jetzt anmelden", "Přihlásit se")}
              </button>
            </>
          ) : (
            <>
              <div className="space-y-1.5 text-center">
                <MainLogo className="mx-auto h-8 w-8" />
                <h2 className="font-display text-xl font-bold uppercase tracking-wider text-slate-900">
                  {txt("Create Your Account", "Konto erstellen", "Vytvořit účet")}
                </h2>
                <p className="text-xs font-light text-slate-400">
                  {txt(
                    "Join the cross-border adventure and start your digital stamp collection.",
                    "Starten Sie Ihr grenzüberschreitendes Abenteuer und sammeln Sie digitale Stempel.",
                    "Připojte se k přeshraničnímu dobrodružství a začněte sbírat digitální razítka."
                  )}
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {txt("Full Name", "Vollständiger Name", "Celé jméno")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={txt("e.g. Lukas Müller", "z. B. Lukas Müller", "např. Lukas Müller")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {txt("Email Address", "E-Mail-Adresse", "E-mailová adresa")}
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
                    {txt("Password", "Passwort", "Heslo")}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {txt("Confirm Password", "Passwort bestätigen", "Potvrzení hesla")}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500"
                >
                  {txt("Create Account", "Konto erstellen", "Vytvořit účet")}
                </button>
              </form>

              <p className="text-center text-[11px] text-slate-500">
                {txt("Already have an account? ", "Bereits ein Konto? ", "Již máte účet? ")}
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setRegistered(false);
                    onOpenLogin();
                  }}
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  {txt("Sign In", "Anmelden", "Přihlásit se")}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
