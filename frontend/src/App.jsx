import { useState } from 'react'

import './App.css'


function App() {
    const [input, setInput] = useState('')
    const [message, setMessage] = useState('')

    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    async function handleSubmit(event){
        event.preventDefault()

        const text = input.trim()
        if (!text || loading) return

        setMessage(text)
        setInput('')
        setResponse('')
        setError('')
        setLoading(true)

        try {
            const result = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text}),
            })

            if (!result.ok) {
                throw new Error(`Request failed (${result.status})`)
            }

            const data = await result.json()
            setResponse(data.response)

        }   catch (err) {
            setError(err.message)
        }   finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <h1>Korean Teacher</h1>

            <form onSubmit = {handleSubmit}>
                <label htmlFor="message">Your message</label>
                <input
                    id = "message"
                    value = {input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask a question..."
                    
                    />
                <button type="submit" disabled = {loading}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>

            {message && <p>You: {message}</p>}
            {response && <p>Teacher: {response}</p>}
            {error && <p role = "alert">{error}</p>}
        </main>
    )

}

export default App
