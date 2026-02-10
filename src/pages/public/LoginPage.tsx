import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/app", { replace: true });
  };

  return (
    <section className="card">
      <h2>Acesso rapido</h2>
      <p>faça login para acessar o site.</p>
      <button type="button" className="primary-button" onClick={handleLogin}>
        Entrar
      </button>
    </section>
  );
}
