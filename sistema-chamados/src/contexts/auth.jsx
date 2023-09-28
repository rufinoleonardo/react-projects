import { useState, createContext, useEffect } from "react";
import { db, auth } from "../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const storageUser = await localStorage.getItem("@userData");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function signIn(email, password) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        const uid = res.user.uid;

        const docRef = doc(db, "users", uid);
        await getDoc(docRef)
          .then((snap) => {
            const data = {
              uid: uid,
              name: snap.data().name,
              avatarUrl: snap.data().avatarUrl,
              email: res.user.email,
            };

            setUser(data);
            storageUser(data);

            setLoadingAuth(false);
            setLoading(false);

            toast.success("Bem vindo de volta!");
            navigate("/dashboard");
          })
          .catch((err) => {
            console.log(err);
            setLoadingAuth(false);
            toast.error("Algo deu errado.");
          });
      })
      .catch((err) => {
        console.log(err);
        setLoadingAuth(false);
        toast.error("Algo deu errado.");
      });
  }

  async function signUp(name, email, password) {
    setLoadingAuth(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        let uid = res.user.uid;

        await setDoc(doc(db, "users", uid), {
          name: name,
          avatarUrl: null,
          email: email,
          uid: uid,
        })
          .then(() => {
            const data = {
              uid: uid,
              name: name,
              avatarUrl: null,
              email: res.user.email,
            };

            setUser(data);
            storageUser(data);

            setLoadingAuth(false);
            setLoading(false);

            toast.success("Seja bem-vindo ao sistema!");

            navigate("/dashboard");
          })
          .catch((err) => {
            //console.log(err);
            setLoadingAuth(false);
          });
      })
      .catch((err) => {
        //console.log(err);
        setLoadingAuth(false);
      });
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@userData");
    setUser(null);
  }

  function storageUser(data) {
    localStorage.setItem("@userData", JSON.stringify(data));
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
