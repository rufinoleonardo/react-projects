import { useContext, useState } from "react";
import "./profile.css";
import avatar from "../../assets/avatar.png";

import { db, storage } from "../../services/firebaseConnection";
import { updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { toast } from "react-toastify";

import { AuthContext } from "../../contexts/auth";

import Header from "../../components/Header";
import Title from "../../components/Title";

import { FiSettings, FiUpload } from "react-icons/fi";

export default function Profile() {
  const { user, logout, storageUser, setUser } = useContext(AuthContext);

  const [imageAvatar, setImageAvatar] = useState(null);
  const [name, setName] = useState(user && user.name);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

  function handleFile(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (
        image.type == "image/jpeg" ||
        image.type == "image/jpg" ||
        image.type == "image/png"
      ) {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        alert("Envie uma imagem nos seguintes formatos: JPG, JPEG ou PNG");
        setImageAvatar(null);
        return;
      }
    }
  }

  async function handleUpload(e) {
    e.preventDefault();

    if (user.name != "") {
      const docRef = doc(db, `users`, user.uid);
      let data = {
        ...user,
        name: name,
      };

      if (imageAvatar == null) {
        await updateDoc(docRef, {
          name: name,
        })
          .then((snap) => {
            setUser(data);
            storageUser(data);
            toast.success("Alteração do nome bem sucedida.");
          })
          .catch((err) => {
            console.log(err);
            toast.error(`Algo deu errado ao atualizar o nome.`);
          });
      } else if (imageAvatar != null) {
        const imgRef = ref(storage, `images/${user.uid}/${imageAvatar.name}`);

        await uploadBytes(imgRef, imageAvatar).then(async (res) => {
          await getDownloadURL(imgRef).then(async (url) => {
            await updateDoc(docRef, {
              avatarUrl: url,
            })
              .then(async (snap) => {
                let res = { ...data, avatarUrl: url };
                setUser(res);
                storageUser(res);
                toast.success("Alteração do nome/avatar bem sucedida.");
              })
              .catch((err) => {
                console.log(err);
                toast.error(`Erro ao atualizar nome/avatar.`);
              });
          });

          console.log("Upload da imagem realizado");
        });
      }
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title title={"Meu perfil"}>
          <FiSettings size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleUpload}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>
              <input
                type="file"
                name=""
                id=""
                accept="image/*"
                onChange={handleFile}
              />
              <img
                src={avatarUrl === null ? avatar : avatarUrl}
                alt="Imagem de perfil"
                width={250}
                height={250}
              />
            </label>

            <label>Nome</label>
            <input
              type="text"
              className="input"
              name=""
              placeholder="Seu nome."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>E-mail</label>
            <input
              type="email"
              className="input"
              name=""
              placeholder="Seu email."
              disabled={true}
              value={user.email}
            />

            <button type="submit">Salvar</button>
          </form>
        </div>

        <div className="container">
          <button className="logout-btn" onClick={() => logout()}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
