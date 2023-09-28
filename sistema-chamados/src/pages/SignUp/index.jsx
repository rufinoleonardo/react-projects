import "../SignIn/signin.css";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/auth";

export default function SignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    if (name != "" && email != "" && password != "") {
      await signUp(name, email, password);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="img-container">
          <img src="logo.png" alt="" />
        </div>

        <div className="form-container">
          <h1>Criar conta</h1>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ciclano da Silva"
            />
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
              {loadingAuth ? "Carregando..." : "Registrar"}
            </button>
          </form>
          <Link to="/" className="link">
            Já possuo uma conta. Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
