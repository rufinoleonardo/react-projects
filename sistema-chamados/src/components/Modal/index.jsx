import "./modal.css";

import { FiX } from "react-icons/fi";

export default function Modal({ details, close }) {
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX size={25} color={"#FFF"} /> Fechar
        </button>

        <main>
          <h2>Detalhes do chamado</h2>
          <div className="row">
            <span>
              Cliente: <i>{details.cliente}</i>
            </span>
          </div>
          <div className="row">
            <span>
              Status:{" "}
              <i
                className="badge"
                style={{
                  backgroundColor:
                    details.status === "Aberto"
                      ? "#ee005b"
                      : details.status === "Progresso"
                      ? "#ff8800"
                      : "#5cb85c",
                }}
              >
                {details.status}
              </i>
            </span>
          </div>
          <div className="row">
            <span>
              Assunto: <i>{details.assunto}</i>
            </span>
            <span>
              Data cadastro: <i>{details.createdFormated}</i>
            </span>
          </div>
          {details.complemento != "" && (
            <>
              <h3>Complemento</h3>
              <p>{details.complemento}</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
