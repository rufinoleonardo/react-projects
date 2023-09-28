import "./dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { db } from "../../services/firebaseConnection";
import {
  getDocs,
  collection,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";

import Header from "../../components/Header";
import Title from "../../components/Title";
import Modal from "../../components/Modal";

import { FiMessageSquare, FiPlus, FiInfo, FiEdit } from "react-icons/fi";
import { format } from "date-fns";

const docsRef = collection(db, "chamados");

function Dashboard() {
  const [chamados, setChamados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState();

  useEffect(() => {
    async function obterChamados() {
      const q = query(docsRef, orderBy("created", "desc"), limit(5));

      const querySnapshot = await getDocs(q);
      setChamados([]);
      await updateState(querySnapshot);

      setIsLoading(false);

      return () => {};
    }

    obterChamados();
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; //obtendo o ultimo item

      setLastDocs(lastDoc);

      setChamados((chamados) => [...chamados, ...lista]);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore() {
    setLoadingMore(true);

    const q = query(
      collection(db, "chamados"),
      orderBy("created", "desc"),
      startAfter(lastDocs),
      limit(5)
    );

    let querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
  }

  function toogleModal(item) {
    setDetails(item);
    setIsModalOpen(!isModalOpen);
  }

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title title="Tickets">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title title="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado encontrado.</span>
            <Link to="/new" className="new" id="btn-novoChamado">
              <FiPlus size={17} color="#FFF" /> Novo Chamado
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={17} color="#FFF" /> Novo Chamado
            </Link>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((chamado, index) => {
                  return (
                    <tr key={index}>
                      <td data-label="Cliente">{chamado.cliente}</td>
                      <td data-label="Assunto">{chamado.assunto}</td>
                      <td data-label="Status">
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              chamado.status === "Aberto"
                                ? "#ee005b"
                                : chamado.status === "Progresso"
                                ? "#ff8800"
                                : "#5cb85c",
                          }}
                        >
                          {chamado.status}
                        </span>
                      </td>
                      <td data-label="Cadastrado">{chamado.createdFormated}</td>
                      <td data-label="#">
                        <button
                          className="action"
                          onClick={() => toogleModal(chamado)}
                          style={{ backgroundColor: "#2c8fff" }}
                        >
                          <FiInfo size={17} color="#FFFFFF" />
                        </button>
                        <Link
                          to={`/new/${chamado.id}`}
                          className="action"
                          style={{ backgroundColor: "#ffce2c" }}
                        >
                          <FiEdit size={17} color="#FFFFFF" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {loadingMore && <h3>Carregando mais chamados...</h3>}
            {!loadingMore && !isEmpty && (
              <button onClick={handleMore} className="btn-more">
                Carregar mais
              </button>
            )}
          </>
        )}
      </div>
      {isModalOpen && (
        <Modal details={details} close={() => setIsModalOpen(!isModalOpen)} />
      )}
    </div>
  );
}

export default Dashboard;
