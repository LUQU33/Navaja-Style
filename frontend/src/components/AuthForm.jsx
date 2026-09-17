import { useState } from "react";
import "./AuthForm.css";

export default function AuthForm({ onLogin = () => {}, onRegister = () => {} }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");

  const update = (field) => (e) => {
    const value = field === "terms" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (form.password !== form.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      if (!form.terms) {
        setError("Tenés que aceptar los términos para continuar.");
        return;
      }
      onRegister({ name: form.name, email: form.email, password: form.password });
    } else {
      onLogin({ email: form.email, password: form.password });
    }
  };

  return (
    <div className="navaja-auth">
      <div className="card">
        <div className="brand">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 15 L18 6 C20 5 22 6.5 21 8.5 L13 18 L3 15Z" stroke="#c65a44" strokeWidth="1.4" />
          </svg>
          <span className="brand-word">Navaja</span>
        </div>

        <div className="tabs">
          <button
            type="button"
            className={`tab${mode === "login" ? " active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Ingresar
          </button>
          <button
            type="button"
            className={`tab${mode === "register" ? " active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}

          {mode === "register" && (
            <label>
              Nombre completo
              <input type="text" required value={form.name} onChange={update("name")} placeholder="Tu nombre" />
            </label>
          )}

          <label>
            Email
            <input type="email" required value={form.email} onChange={update("email")} placeholder="vos@email.com" />
          </label>

          <label>
            Contraseña
            <input type="password" required value={form.password} onChange={update("password")} placeholder="••••••••" />
          </label>

          {mode === "register" ? (
            <label>
              Confirmar contraseña
              <input type="password" required value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="••••••••" />
            </label>
          ) : (
            <div className="row-inline">
              <span />
              <a className="forgot" href="#recuperar">¿Olvidaste tu contraseña?</a>
            </div>
          )}

          {mode === "register" && (
            <label className="terms">
              <input type="checkbox" checked={form.terms} onChange={update("terms")} />
              Acepto los términos y condiciones y la política de privacidad.
            </label>
          )}

          <button type="submit" className="submit">
            {mode === "login" ? "Ingresar" : "Crear cuenta"}
          </button>

          <div className="switch-hint">
            {mode === "login" ? (
              <>¿No tenés cuenta? <button type="button" onClick={() => switchMode("register")}>Creá una</button></>
            ) : (
              <>¿Ya tenés cuenta? <button type="button" onClick={() => switchMode("login")}>Ingresá</button></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}