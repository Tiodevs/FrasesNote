import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Assets
import styles from './Home.module.css'
import pencil from '../../assets/pencil.svg';
import trash from '../../assets/trash.svg'
import iconeFrase from '../../assets/quote.svg';

// Componentes
import { Modal } from "../../components/Modal/index";
import { Form } from "../../components/Form";

// Rotas
import { useNavigate } from "react-router-dom";

// BD:
// Autenticação
import { useAuthentication } from "../../hooks/useAuthentication";
import { useAuthValue } from "../../context/AuthContext";
// Firestore
import { useInsertDocument } from "../../hooks/useInsertDocument";
import { useFetchDocuments } from "../../hooks/useFetchDocumensts";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

export default function () {

  // Consts useState
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState("")
  const [input2, setInput2] = useState("")
  const [tarefas, setTarefas] = useState([])
  const [open, setOpen] = useState(true)
  const [edit, setEdit] = useState([{
    id: 1,
    name: "a",
    frase: "a"
  }])

  // User context
  const { user } = useAuthValue();
  const uid = user.uid;


  // Pegando e adicionado informações no BD
  const { insertDocument } = useInsertDocument("Frases")
  const { documents: posts } = useFetchDocuments("Frases", uid);
  const { deleteDocument } = useDeleteDocument("Frases")

  const navigate = useNavigate()

  const { logout } = useAuthentication()

  // Alertas com o toastify
  const inpuVazio = () => {
    toast.error(
      "Você precisa preencher com algum valor!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }

  const itemAdicionado = () => {
    toast.success(
      "Novo item adicionado com sucesso", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }


  // Gera o PDF
  const contentDocument = useRef()
  const handlePrint = useReactToPrint({
    content: () => contentDocument.current
  })


  // useEffects

  // Tipo de dispositivo
  useEffect(() => {
    // Função para verificar o tipo de dispositivo
    const checkDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const mobileDevices = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/;

      if (mobileDevices.test(userAgent) || window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Executa a verificação ao montar o componente
    checkDevice();

    // Listener para ajustar em tempo real caso a janela seja redimensionada
    window.addEventListener('resize', checkDevice);

    // Cleanup para remover o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);


  // Salva no banco de dados toda vez que a lista é alterada
  useEffect(() => {
    // Tranforma a lista em uma string usando JSON e salva os itens da lista no localStorage toda vez que a const tarefas for alterado
    localStorage.setItem('@tarefa', JSON.stringify(tarefas))
  }, [tarefas]);


  // Functions

  function sair() {
    logout()
    navigate("/register")
  }

  // Function para o form
  function handleRegister(e) {
    e.preventDefault()

    // Valida se não está vazio o input
    if (!input || !input2) return inpuVazio();

    insertDocument({
      input,
      input2,
      uid: user.uid,
      createBy: user.displayName
    })

    itemAdicionado()

    console.log("fomulario enviado", input, input2)

    setInput('')
    setInput2('')
  }


  // function handleEdit(name, id, frase) {
  //   // Abre o modal

  //   // Pega as props e cria um novo item e armazena na const edit
  //   const editItem = {
  //     id: id,
  //     name: posts.input,
  //     name: posts.input2,
  //     lista: posts
  //   }

  //   setEdit([editItem])

  //   setOpen(!open)
  // }



  return (
    // O ref={contentDocument} define qual elemnto vai aparecer no PDF
    <>

      {/* Dependencia para os alertas */}
      <ToastContainer />

      <Modal
        isOpen={open}
        fecharModal={setOpen}
        id={edit[0].id}
        name={edit[0].name}
        frase={edit[0].frase}
        lista={tarefas}
        mudarLista={setTarefas}
      />

      <Form
        enviar={handleRegister}
        input={input}
        input2={input2}
        setInput={setInput}
        setInput2={setInput2}
        nome={"Adicionar"}
        textInput={"Nome da pessoa"}
        textInput2={"Frase"}
        version={!isMobile ? 1 : 2}
      />



      <div className={styles.itens} ref={contentDocument}>
        {posts && posts.map(tarefa => (
          <div className={styles.item} key={tarefa.id}>
            <div className={styles.fraseItem}>
              <img src={iconeFrase} />
              <div>
                <h2 key={tarefa.id}>{tarefa.input}<br /></h2>
                <p>{tarefa.input2}</p>
              </div>
            </div>
            {/* <div className={styles.btnIcons}>
              <button onClick={() => handleEdit(tarefa.input, tarefa.id, tarefa.input2)}>
                <img src={pencil} className={styles.itensIcon} />
              </button>
            </div> */}
            <div className={styles.btnIcons}>
              <button onClick={() => deleteDocument(tarefa.id)}>
                <img src={trash} className={styles.itensIcon} />
              </button>
            </div>
          </div>
        ))}

        <div className={styles.btnsExport}>
          <button onClick={handlePrint} className={styles.btnCopy}>
            Gerar PDF
          </button>

          {user && (<button onClick={sair} className={styles.btnCopy}>
            Sair
          </button>)}
        </div>
      </div>
    </>

  );
}

