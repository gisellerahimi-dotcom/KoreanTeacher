import { useState } from 'react'

import './App.css'

/*
chatbot ui
for now just create input box and allow user to send messages
the ui will display the ai model's response.
 */
function App() {
    const [input, setInput] = useState('')
    const [message, setMessage] = useState('')

    function handleSubmit(event){
        event.preventDefault()
        if(!input.trim()) return

        setMessage(input.trim())
        setInput('')
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
                <button type="submit">Send</button>
            </form>

            {message && <p>You: {message}</p>}
        </main>
    )

}

export default App
