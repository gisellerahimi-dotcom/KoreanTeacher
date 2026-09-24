import { useState } from 'react'

import './App.css'


function App() {
    const [input, setInput] = useState('')
    const [message, setMessage] = useState('')

    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    //////////
    const [word, setWord] = useState('')
    const [entries, setEntries] = useState([])
    const [dictionaryStatus, setDictionaryStatus] = useState('')
    const [searching, setSearching] = useState(false)

    async function searchDictionary(event) {
    event.preventDefault()
    if (!word.trim() || searching) return

    setSearching(true)
    setEntries([])
    setDictionaryStatus('Searching...')

        try {
        const result = await fetch(
        `/api/dictionary?q=${encodeURIComponent(word.trim())}`
        )
        const data = await result.json()

        if (!result.ok) {
        throw new Error(data.error || 'Dictionary search failed.')
        }

        setEntries(data.results)
        setDictionaryStatus(
        data.results.length ? '' : 'No matches found.'
        )
    } catch (err) {
        setDictionaryStatus(err.message)
    } finally {
        setSearching(false)
    }
    }

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

            <section>
                <h2>Dictionary</h2>

                <form onSubmit={searchDictionary}>
                    <label htmlFor="dictionary-word">Korean word</label>
                    <input
                    id="dictionary-word"
                    value={word}
                    onChange={(event) => setWord(event.target.value)}
                    placeholder="학교"
                    />
                    <button type="submit" disabled={searching}>
                    Search
                    </button>
                </form>

                <p role="status">{dictionaryStatus}</p>

                {entries.map((entry) => (
                    <article key={entry.id}>
                    <h3>{entry.word}</h3>
                    <ol>
                        {entry.meanings.map((meaning, index) => (
                        <li key={index}>
                            <p>{meaning.korean}</p>
                            <p>{meaning.english}</p>
                        </li>
                        ))}
                    </ol>
                    </article>
                ))}
                </section>
        </main>
    )

}

export default App
