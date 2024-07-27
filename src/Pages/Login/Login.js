import styles from "./Login.module.css"

import { useAuthentication } from "../../hooks/useAuthentication.js";

import { useEffect, useState } from 'react'

import { useNavigate } from "react-router-dom";

import logo from '../../assets/logoFelipe.svg'

export default function () {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { login, error: authError, loading } = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("")


        const user = {
            email,
            password
        }

        const res = await login(user);

        console.log(res);

        navigate("/")
    }

    useEffect(() => {
        if (authError) {
            setError(authError)
        }
    }, [authError])

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.form}>

                <img src={logo}/>
                <input
                    type='email'
                    name='email'
                    required
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />


                <input
                    type='password'
                    name='password'
                    required
                    placeholder='Senha'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />



                {!loading && <button className={styles.btn}>Entrar</button>}
                {loading && (
                    <button className={styles.btn} disabled>
                        Aguarde...
                    </button>
                )}

                {error && <p className='error'>{error}</p>}

                <p className={styles.cadastrar}>Não tem uma conta? <a href='/register'>Cadastrar-se</a></p>
            </form>
        </div>
    )
}