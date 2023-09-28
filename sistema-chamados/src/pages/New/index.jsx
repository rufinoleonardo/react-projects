import "./new.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import {
  getDocs,
  getDoc,
  doc,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Title from "../../components/Title";

import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

export default function New() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(0);
  const [assunto, setAssunto] = useState("suporte");
  const [status, setStatus] = useState("Aberto");
  const [complemento, setComplemento] = useState("");
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [thereIsId, setThereisId] = useState(false);

  const collectionRef = collection(db, "customers");

  useEffect(() => {
    console.log(id);
    async function loadAllClients() {
      let lista = [];

      await getDocs(collectionRef)
        .then((snaps) => {
          snaps.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia,
            });
          });

          if (snaps.docs.size === 0) {
            console.log("Nenhuma empresa encontrada");
            setClientes([{ id: 1, nomeFantasia: "FREELA" }]);
            setLoadingCustomers(false);
            return;
          }

          setClientes(lista);
          setLoadingCustomers(false);
        })
        .catch((err) => {
          console.log("Erro ao obter clientes", err);
          setClientes([{ id: 1, nomeFantasia: "FREELA" }]);
          setLoadingCustomers(false);
        });

      if (id) {
        loadId(lista);
      }
    }

    loadAllClients();
  }, [id]);

  async function loadId(lista) {
    const docRef = doc(db, "chamados", id);

    await getDoc(docRef)
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        let index = lista.findIndex((el) => el.id == snapshot.data().clienteId);
        setClienteSelecionado(index);
        setThereisId(true);
      })
      .catch((err) => {
        console.log(err);
        setThereisId(false);
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (thereIsId) {
      //Atualizando chamado
      let docRef = doc(db, "chamados", id);
      await updateDoc(docRef, {
        cliente: clientes[clienteSelecionado].nomeFantasia,
        clienteId: clientes[clienteSelecionado].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
      })
        .then(() => {
          setComplemento("");
          setClienteSelecionado(0);
          toast.success(`Chamado atualizado.`);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log(err);
          toast.error(`Ocorreu um erro durante a atualização.`);
        });
      return;
    }

    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: clientes[clienteSelecionado].nomeFantasia,
      clienteId: clientes[clienteSelecionado].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid,
    })
      .then(() => {
        setComplemento("");
        setClienteSelecionado(0);
        toast.success("Chamado registrado com sucesso.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Algo deu errado. Tente novamente em alguns instantes.");
      });
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
    console.log(e.target.value);
  }

  function handleAssuntoChange(e) {
    setAssunto(e.target.value);
    //console.log(e.target.value);
  }

  function handleClienteChange(e) {
    console.log(e.target.value);
    setClienteSelecionado(e.target.value);
  }

  return (
    <div>
      <Header />
      <div className="content">
        {thereIsId ? (
          <Title title="Editando Chamado">
            <FiEdit size={25} />
          </Title>
        ) : (
          <Title title="Novo Chamado">
            <FiPlusCircle size={25} />
          </Title>
        )}

        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label>Cliente</label>
            {loadingCustomers ? (
              <input
                type="text"
                className="input"
                disabled={true}
                value="Carregando..."
              />
            ) : (
              <select value={clienteSelecionado} onChange={handleClienteChange}>
                {clientes.map((cliente, index) => {
                  return (
                    <option key={index} value={index}>
                      {cliente.nomeFantasia}
                    </option>
                  );
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleAssuntoChange}>
              <option value="suporte">Suporte</option>
              <option value="visita tecnica">Visita técnica</option>
              <option value="financeiro">Financeiro</option>
            </select>

            <label className="status-label">Status</label>
            <div className="status">
              <input
                type="radio"
                name="status"
                id="vlAberto"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              />
              <label htmlFor="vlAberto">Em aberto</label>

              <input
                type="radio"
                name="status"
                value="Progresso"
                id="vlProgresso"
                onChange={handleOptionChange}
                checked={status === "Progresso"}
              />
              <label htmlFor="vlProgresso">Em Progresso</label>

              <input
                type="radio"
                name="status"
                value="Atendido"
                id="vlAtendido"
                onChange={handleOptionChange}
                checked={status === "Atendido"}
              />
              <label htmlFor="vlAtendido">Atendido</label>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva o seu problema (opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type="submit">
              {thereIsId ? "Atualizar" : "Registrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
