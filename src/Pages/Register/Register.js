import styles from "./Register.module.css"

import { useAuthentication } from "../../hooks/useAuthentication.js";

import { useEffect, useState } from 'react'

import { useNavigate } from "react-router-dom";

import logo from '../../assets/logoFelipe.svg'

export default function () {

    const navigate = useNavigate()

    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const { createUser, error: authError, loading } = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("")


        const user = {
            displayName,
            email,
            password
        }

        if (password !== confirmPassword) {
            setError("A senhas precisam ser iguais")
            return
        }

        const res = await createUser(user);

        navigate("/")

        console.log(res);
    }

    useEffect(() => {
        if (authError) {
            setError(authError)
        }
    }, [authError])

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <img src={logo} />
                <input
                    type='text'
                    name='DisplayName'
                    required
                    placeholder='Seu nome completo'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />


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


                <input
                    type='password'
                    name='password'
                    required
                    placeholder='Confirme a sua senha'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />


                {!loading && <button className={styles.btn}>Entrar</button>}
                {loading && (
                    <button className={styles.btn} disabled>
                        Aguarde...
                    </button>
                )}

                {error && <p className='error'>{error}</p>}

                <p className={styles.cadastrar}>Já tem uma conta? <a href='/login'>Entre na conta</a></p>
            </form>
        </div>
    )
}