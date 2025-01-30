import ChatBot from 'react-chatbotify';

export default function ChatWrapper() {
  let hasError = false;
  const send = async (params) => {
    console.log('send prompt: ', params.userInput);
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': "text/event-stream",
      },
      body: JSON.stringify({
        'message': params.userInput.trim()
      })
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');
      console.log(chunk);
      
      for (let line of lines) {
        if (!line) continue;
        line = line.replace('data: ', '')
        const content = JSON.parse(line);
        if (content['end']) {
          continue;
        }
        await params.streamMessage(content['message']);
        await new Promise(resolve => setTimeout(resolve, 120));
      };

      await params.endStreamMessage();
    }
  }

  const chatFlow = {
    'start': {
      'message': 'hello, how can I help?',
      'path': 'loop'
    },
    'loop': {
      message: async (params) => {
        try {
          hasError = false;
          await send(params);
        }
        catch (e) {
          console.error('integration error: ', e);
          await params.injectMessage("Unable to integrate with backend.");
          hasError = true;
        }
      },
      'path': () => {
        if (hasError) {
          return 'start';
        }
        return 'loop';
      }
    }
  };

  const chatSettings = {
    general: {
      embedded: true
    },
    botBubble: {
      showAvatar: true,
      simStream: true
    },
    chatHistory: {
      storageKey: 'real_time_stream'
    }
  };
  
  return (
    <ChatBot settings={chatSettings} flow={chatFlow} />
  );
}
