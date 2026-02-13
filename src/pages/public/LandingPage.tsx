import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <section className="card">
      <h2>Landing Page</h2>
      <p>veremos se vai precisar disso .</p>
      <Link className="primary-button" to="/login">
        Entrar no sistema
      </Link>
    </section>
  );
};
