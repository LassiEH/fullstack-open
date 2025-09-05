/* eslint-disable react/prop-types */

import { useState } from 'react'

const Loginform = ({ handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        handleLogin(username, password)
        setUsername('')
        setPassword('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
            username
                <input
                type="text"
                value={username}
                data-testid="username"
                name='Username'
                onChange={({ target }) => setUsername(target.value)}
            />
            </div>
            <div>
            password
                <input
                type="password"
                value={password}
                data-testid="password"
                name='password'
                onChange={({ target }) => setPassword(target.value)}
            />
            </div>
            <button type='submit'>login</button>
        </form>
    )
}

export default Loginform

