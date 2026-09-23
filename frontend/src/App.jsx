import { useState } from 'react'

import './App.css'

/*
Use fetch() inside your submit handler to send the 
message to Flask, then save the reply in React state.

JSON.stringify({ message: text }) creates the JSON your Flask code reads 
with request.get_json(). 
Your backend returns { "response": ... }, so data.response 
contains the reply.
*/


function App() {
    const [input, setInput] = useState('')
    const [message, setMessage] = useState('')

    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = userState('')

    /*
    function handleSubmit(event){
        event.preventDefault()
        if(!input.trim()) return

        setMessage(input.trim())
        setInput('')
    }
        */
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
                throw new Error('Request failed (${result.status})')
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
