import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import moment from "moment-jalaali";

const Chat = ({ selectedContact }) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]); // ذخیره پیام‌ها
    const endRef = useRef(null);
    const socketRef = useRef(null);
    const username = localStorage.getItem("username"); // گرفتن نام کاربری از localStorage

    // گرفتن پیام‌های قبلی از API
    useEffect(() => {
        if (selectedContact) {
            setMessages([]); // پاک کردن پیام‌های قبلی هنگام تغییر مخاطب

            const fetchMessages = async () => {
                try {
                    const response = await axios.post(
                        "http://127.0.0.1:8000/api/messages/",
                        {
                            sender: username, // نام کاربری خود کاربر
                            recipient: selectedContact.username, // نام کاربری مخاطب
                        },
                    );
                    setMessages(response.data); // ذخیره پیام‌های دریافت‌شده
                } catch (error) {
                    console.error(
                        "Error fetching messages:",
                        error.response ? error.response.data : error.message
                    );
                }
            };

            fetchMessages(); // فراخوانی تابع گرفتن پیام‌ها

            // WebSocket اتصال
            if (socketRef.current) {
                socketRef.current.close(); // اطمینان از بسته‌شدن اتصال قبلی
            }

            const socketUrl = `ws://localhost:8000/ws/chat/${selectedContact.username}/`;
            socketRef.current = new WebSocket(socketUrl);

            // دریافت پیام‌های جدید از WebSocket
            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data && data.message) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            content: data.message,
                            sender: data.sender,
                            timestamp: data.timestamp || new Date().toISOString(),
                        },
                    ]);
                }
            };

            // پیام باز شدن اتصال
            socketRef.current.onopen = () => {
                console.log("Connected to WebSocket");
            };

            // مدیریت خطاهای WebSocket
            socketRef.current.onerror = (error) => {
                console.error("WebSocket error: ", error);
            };

            // بستن اتصال هنگام خروج از صفحه
            return () => {
                socketRef.current.close();
            };
        }
    }, [selectedContact]);

    // اسکرول خودکار به آخر پیام‌ها
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (text.trim() && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const timestamp = new Date().toISOString(); // افزودن زمان به پیام
            const messageData = {
                message: text,
                sender: username, // ارسال نام کاربری خود کاربر
                timestamp, // اضافه کردن زمان
            };

            socketRef.current.send(JSON.stringify(messageData)); // ارسال پیام به WebSocket

            // اضافه کردن پیام به حالت پیام‌ها
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    content: text, // متن پیام
                    sender: username, // ارسال‌کننده پیام
                    timestamp, // زمان پیام
                },
            ]);

            setText(""); // پاک کردن متن ورودی
        } else {
            console.log("WebSocket is not open");
        }
    };

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
    };

    if (!selectedContact) {
        return <div className="chat">Please select a contact to start chatting.</div>;
    }

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={selectedContact.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{selectedContact.username}</span>
                        <p>{"Last seen recently"}</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === username ? "own" : ""}`}>
                        <div className="texts">
                            <p>{msg.content}</p>
                            <div className="time">
                                <span>{moment(msg.timestamp).format('HH:mm')}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input
                    type="text"
                    value={text}
                    placeholder="Type a Message..."
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <div className="emoji">
                    <img
                        src="./emoji.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
