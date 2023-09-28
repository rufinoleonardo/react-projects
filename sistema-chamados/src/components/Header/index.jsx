import "./header.css";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { Link } from "react-router-dom";

import AvatarImg from "../../assets/avatar.png";
import { FiHome, FiSettings, FiUser } from "react-icons/fi";

export default function Header() {
  const { user } = useContext(AuthContext);
  //console.log(user);

  return (
    <div className="sidebar">
      <div>
        <img src={!user.avatarUrl ? AvatarImg : user.avatarUrl} alt="" />
      </div>
      <Link to="/dashboard">
        <FiHome color="#FFF" size={24} />
        Chamados
      </Link>
      <Link to="/customers">
        <FiUser color="#FFF" size={24} />
        Clientes
      </Link>
      <Link to="/profile">
        <FiSettings color="#FFF" size={24} />
        Perfil
      </Link>
    </div>
  );
}
