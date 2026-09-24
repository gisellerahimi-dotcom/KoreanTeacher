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

    const [level, setLevel] = useState('')
    const [focus, setFocus] = useState('vo')

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
                body: JSON.stringify({ message: text, level:level, focus: focus,}),
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
        <main className = "min-h-dvh bg-[#070707] flex items-center justify-center p-4 sm:p-8">
            <div >

            <h1 className = "korean-title">Learn Korean with</h1>

            <form onSubmit = {handleSubmit} className = "flex flex-wrap items-center justify-center gap-3 mb-8">
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
                <label for="cars">My Korean level is:</label>
                
                <select id="level" name="level">
                    <option value="" disabled selected hidden>Select an option...</option>
                    <option value="novice">Novice</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="native">Native</option>
                </select>
                </div>
                <details className="mt-6 rounded-xl border border-gray-600 p-4 text-left">
  <summary className="cursor-pointer font-medium text-[#e8e6f0]">
    Advanced settings
  </summary>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
            <label htmlFor="level" className="mb-2 block">
                My Korean level
            </label>

            <select
                id="level"
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-[#222228] p-3 text-white"
            >
                <option value="" disabled>Select a level</option>
                <option value="novice">Novice</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="native">Native</option>
            </select>
            </div>

            <div>
            <label htmlFor="focus" className="mb-2 block">
                I want to focus on
            </label>

            <select
                id="focus"
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-[#222228] p-3 text-white"
            >
                <option value="vocabulary">Vocabulary</option>
                <option value="grammar">Grammar</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
            </select>
            </div>
        </div>
        </details>
        </main>
    )

}

export default App
