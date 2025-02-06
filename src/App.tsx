import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Globe } from 'lucide-react';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('Click the microphone to start');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    try {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setFeedback('Listening... Try saying "Open YouTube" or "Open website example.com"');
        setError(null);
      };

      recognition.onend = () => {
        if (isListening) recognition.start();
      };

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        setTranscript(command);
        processCommand(command);
      };

      recognition.onerror = (event: any) => {
        setError(`Error: ${event.error}. Please try again.`);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      setError('Failed to initialize speech recognition. Please use Chrome browser.');
    }
  }, [isListening]);

  useEffect(() => {
    // Monitor the current URL and stop listening when on YouTube
    const handlePageChange = () => {
      if (window.location.href.includes('youtube.com')) {
        stopListening();
      } else if (!isListening) {
        startListening();
      }
    };

    // Run the check when the component is mounted and on every URL change
    handlePageChange();

    window.addEventListener('hashchange', handlePageChange); // Handles URL fragment changes
    window.addEventListener('popstate', handlePageChange); // Handles normal URL changes

    return () => {
      window.removeEventListener('hashchange', handlePageChange);
      window.removeEventListener('popstate', handlePageChange);
    };
  }, [isListening]);

  const processCommand = (command: string) => {
    console.log('Processing command:', command);
    setFeedback(`Command received: ${command}`);

    if (command.startsWith('open ')) {
      const website = command.replace('open ', '').trim();
      let domain = `https://${website.replace(/\s+/g, '')}.com`;
      openInNewTab(domain);
      setFeedback(`Opening ${website}...`);
    } else {
      setFeedback('Command not recognized. Try saying "Open YouTube" or "Open website example.com"');
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not available. Please use Chrome browser.');
      return;
    }
    try {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
      setIsListening(!isListening);
    } catch (err) {
      setError('Failed to toggle microphone. Please refresh the page.');
    }
  };

  // Start listening
  const startListening = () => {
    recognitionRef.current.start();
    setFeedback('Listening... Try saying "Open YouTube"');
  };

  // Stop listening
  const stopListening = () => {
    recognitionRef.current.stop();
    setFeedback('Microphone turned off');
  };

 return (


    //   <div className="mt-12 text-center p-6 border-t border-gray-700 w-full">
    //     <h2 className="text-xl font-semibold mb-4">Features About This Product</h2>
    //     <p className="text-sm mb-2">1> Voice Command Recognition: Converts voice commands like "Open YouTube" into actions.</p>
    //     <p className="text-sm mb-2">2> Speech-to-Text: Transcribes spoken words into text in real-time.</p>
    //     <p className="text-sm mb-2">3> Real-Time Feedback: Provides feedback on the status of commands or errors.</p>
    //     <p className="text-sm mb-2">4> Responsive UI: Mobile-friendly layout for optimal user experience across devices.</p>
    //     <p className="text-sm mb-2">5> Seamless Experience: A clean, intuitive interface for voice interaction.</p>
    //   </div>

    //   <div className="mt-12 text-center p-6 border-t border-gray-700 w-full">
    //     <h2 className="text-xl font-semibold mb-4">Developer Information</h2>
    //     <p className="text-sm mb-2">This SmartNavigator was created by</p>
    //     <p className="text-sm mb-2">
    //       <span className="font-medium">Bhagya Nitinkumar Patel</span>.
    //     </p>

    //     <div className="mt-4 flex justify-center space-x-4">
    //       <a href="https://bhagya-patel-portfolio.vercel.app/" className="text-white hover:text-gray-300">
    //         Portfolio
    //       </a>
    //       <a href="https://www.linkedin.com/in/bhagyapatel/" className="text-white hover:text-gray-300">
    //         LinkedIn
    //       </a>
    //     </div>
    //   </div>
    // </div>
   <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-1xl font-bold">SmartNavigator - Web Assistant</h1>
      </div>

      <div className="relative">
        <button
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isListening ? 'bg-white' : 'bg-gray-700'
          }`}
        >
          {isListening ? <Mic className="w-10 h-10 text-black" /> : <MicOff className="w-10 h-10 text-white" />}
        </button>
      </div>

      <div className="mt-6 text-center">
        {error ? <p className="text-red-500 font-medium">{error}</p> : <p className="text-lg font-medium">{feedback}</p>}
        {transcript && <p className="text-sm mt-2">Last command: {transcript}</p>}
      </div>

      <div className="mt-12 flex flex-col items-center">
        <Globe className="w-16 h-16 mb-4" />
        <p className="text-sm mt-2 mb-5">Say "Open YouTube" or any website to get started</p>


         <h2 className="text-xl font-semibold mb-4">Features About This Product</h2>
     <p className="text-sm mb-2">1. Voice Command Recognition: Converts voice commands like "Open YouTube" into actions.</p>
         <p className="text-sm mb-2">2. Speech-to-Text: Transcribes spoken words into text in real-time.</p>
         <p className="text-sm mb-2">3. Real-Time Feedback: Provides feedback on the status of commands or errors.</p>
         <p className="text-sm mb-2">4. Responsive UI: Mobile-friendly layout for optimal user experience across devices.</p>
        
      </div>

      <div className="mt-12 text-center p-6 border-t border-gray-700 w-full">
        <h2 className="text-xl font-semibold mb-4">Developer Information</h2>
        <p className="text-sm mb-2">This SmartNavigator - Web Assistant was created by </p>
        <p> <span className="font-medium">Bhagya Nitinkumar Patel</span>.</p>
    
        <div className="mt-4 flex justify-center space-x-4">
          <a href="https://bhagya-patel-portfolio.vercel.app/" className="text-white hover:text-gray-300">
            Portfolio
          </a>
          <a href="https://www.linkedin.com/in/bhagyapatel/" className="text-white hover:text-gray-300">
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
