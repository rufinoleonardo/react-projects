import "./signin.css";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/auth";

export default function SignIn() {
  const [email, setEmail] = useState("leo@server.com");
  const [password, setPassword] = useState("121234");

  const { signIn, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    if (email != "" && password != "") {
      await signIn(email, password);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="img-container">
          <img src="logo.png" alt="" />
        </div>

        <div className="form-container">
          <h1>Entrar</h1>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@email.com"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*********"
            />
            <button type="submit">
              {loadingAuth ? "Carregando..." : "Entrar"}
            </button>
          </form>
          <Link to="/register" className="link">
            Criar uma conta
          </Link>
        </div>
      </div>
    </div>
  );
}
