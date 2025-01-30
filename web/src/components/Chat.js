import React, { useEffect, useRef, useState } from "react";
import ReactMarkDown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighligher } from "react-syntax-highlighter"
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import './Chat.scss'

export default function Chat() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "hello, how can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [darkTheme, setDarkTheme] = useState(false);
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessages = {
            sender: "user",
            text: input
        };
        setMessages((prevMessages) => [...prevMessages, userMessages]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "text/event-stream"
                },
                body: JSON.stringify({
                    message: input
                })
            });

            setIsTyping(false);

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            let botResponse = "";
            while (true) {
                const {value, done} = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');
                console.log(chunk);
                
                for (let line of lines) {
                    if (!line) continue;
                    line = line.replace('data: ', '')
                    const data = JSON.parse(line);
                    if (data['end']) {
                        break;
                    }
                    botResponse += data["message"];
                    setMessages(prevMessages => {
                        const newMessage = [...prevMessages];
                        if (newMessage[newMessage.length - 1].sender === "bot") {
                            newMessage[newMessage.length - 1].text = botResponse;
                        } else {
                            newMessage.push({
                                sender: "bot",
                                text: botResponse
                            });
                        }
                        return newMessage;
                    })
                };
            }
        }
        catch (e) {
            console.error("Error sending message", e);
        }
    };

    return (
        <div className={`chat-container ${darkTheme ? "dark-theme" : ""}`}>
            <div className="glassy-transparent">
                <button className="darkBtn" onClick={() => setDarkTheme(!darkTheme)}>
                    {!darkTheme ? "🌙" : "☀️"}
                </button>
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-container ${msg.sender}`}>
                        <div className={`message ${msg.sender}`}>
                            <ReactMarkDown
                                children={msg.text}
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || "")
                                        return !inline && match ? (
                                            <SyntaxHighligher
                                                children={String(children).replace(/\n$/, "")}
                                                style={materialDark}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            />
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        )
                                    }
                                }}
                            />
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="message-container bot">
                        <div className="message bot">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messageEndRef} />
            </div>

            <div className="input-container">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type a message..."
                />
                <button className="button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}