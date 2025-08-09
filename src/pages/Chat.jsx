import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from '../utils/axios';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
  withCredentials: true,
});

const Chat = () => {
  const { gigId } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    socket.emit('join', user._id);
  }, [user._id]);

  useEffect(() => {
    // Fetch past messages + gig data to get receiver
    const fetchData = async () => {
      try {
        const res = await axios.get(`/messages/${gigId}`, { withCredentials: true });
        setMessages(res.data.messages);
        setReceiverId(res.data.receiverId);
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };
    fetchData();
  }, [gigId]);

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const msg = {
      sender: user._id,
      receiver: receiverId,
      content,
    };

    socket.emit('sendMessage', msg);
    setMessages((prev) => [...prev, msg]);
    setContent('');

    // Save to DB
    await axios.post('/messages/send', msg, { withCredentials: true });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Chat</h1>

      <div className="bg-white border rounded-md h-[500px] overflow-y-scroll p-4 mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md max-w-sm ${
              msg.sender === user._id
                ? 'bg-blue-100 ml-auto text-right'
                : 'bg-gray-200'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-md"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
