// Rotas
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Hooks
import { useState, useEffect } from 'react'

// CSS
import './style.css'

// Contexto
import { onAuthStateChanged } from 'firebase/auth'
import { useAuthentication } from './hooks/useAuthentication.js'
import { AuthProvider } from "./context/AuthContext";


// Pages
import Home from './Pages/Home/Home.js';
import Register from './Pages/Register/Register.js';

// Componentes
import { Header } from './components/Header/index.js';
import { Footer } from './components/Footer/index.js';
import Login from './Pages/Login/Login.js'



function App() {

  const [user, setUser] = useState(undefined);
  const { auth } = useAuthentication();

  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  if (loadingUser) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <AuthProvider value={{user}}>
        <BrowserRouter>
          <div className='Container'>
            <div className='ContainerTop'>
              <Header
                titulo={"Frases Note"}
                descricao={"Anote as melhores frases"}
              />
              <Routes>
                <Route path='/' element={!user ? <Register/> : <Home />} />
                <Route path='/register' element={user ? <Home /> : <Register />} />
                <Route path='/login' element={user ? <Home /> : <Login />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;