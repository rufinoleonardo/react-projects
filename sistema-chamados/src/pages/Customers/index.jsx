import { useState } from "react";
import { db } from "../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";

import Header from "../../components/Header";
import Title from "../../components/Title";

import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Customers() {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (name != "" && cnpj != "" && address != "") {
      await addDoc(collection(db, "customers"), {
        nomeFantasia: name,
        cnpj: cnpj,
        endereco: address,
      })
        .then(() => {
          setName("");
          setCnpj("");
          setAddress("");
          toast.success("Cliente cadastrado com sucesso.");
        })
        .catch((err) => {
          toast.error("Algo deu errado. Cliente não cadastrado.");
          console.log(err);
        });
    } else {
      toast.error("Por favor, preencha todos os campos.");
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title title="Clientes">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className="form-profile">
            <label>Nome fantasia</label>
            <input
              type="text"
              className="input"
              placeholder="Nome da empresa"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>CNPJ</label>
            <input
              type="text"
              className="input"
              placeholder="Digite o CNPJ da empresa"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label>Endereço</label>
            <input
              type="text"
              className="input"
              placeholder="Endereço completo"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button type="submit" onClick={handleSubmit}>
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
