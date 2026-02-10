import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <section className="card">
      <h2>teste</h2>
      <p>
        veremos se vai precisar disso .
      </p>
      <Link className="primary-button" to="/login">
        Entrar no sistema
      </Link>
    </section>
  );
}
