import { useState } from "react" 

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function confirm() {
    const input = {
      name,
      email,
      document,
      password,
    };

    const response = await fetch("http://localhost:3000/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(input)
    });

    await response.json()
    setMessage("success")
  }

  function fill() {
    setName("Jonh Doe");
    setEmail("jonh.doe@gmail.com");
    setDocument("97456321558");
    setPassword("asdQWE123");
  }

  return (
    <div>
      <div>
        <input className="input-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <input className="input-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <input className="input-document" type="text" value={document} onChange={(e) => setDocument(e.target.value)} />
      </div>

      <div>
        <input className="input-password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <span className="span-message">{message}</span>
      <button onClick={() => fill()}>Fill</button>
      <button className="button-confirm" onClick={confirm}>Confirm</button>
    </div>
  )
}

export default App
