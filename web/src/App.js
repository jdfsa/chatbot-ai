import { ChatBotProvider } from 'react-chatbotify';
import './App.scss';
import ChatWrapper from "./components/ChatWrapper";
import Chat from './components/Chat';
import logo from './logo.svg';

export default function App() {
  return (
    <>
      <Chat />
      {/* <ChatBotProvider>
        <ChatWrapper />
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </ChatBotProvider> */}
    </>
  );
}
