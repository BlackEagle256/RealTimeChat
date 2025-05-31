import { useState, useEffect } from "react";
import axios from "axios";
import "./chatList.css"
import AddUser from "./addUser/addUser"

const ChatList = ({ setSelectedContact }) => {
    const [addMode, setAddMode] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const accessToken = localStorage.getItem("access_token");
  
      if (accessToken) {
        const fetchContacts = async () => {
          try {
            const response = await axios.get("http://127.0.0.1:8000/api/contacts/", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            setContacts(response.data);
          } catch (error) {
            console.error(
              "Error fetching contacts:",
              error.response ? error.response.data : error.message
            );
          } finally {
            setLoading(false);
          }
        };
  
        fetchContacts();
      } else {
        console.log("User is not authenticated.");
        setLoading(false);
      }
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="chatList">
        <div className="search">
          <div className="searchbar">
            <img src="./search.png" alt="" />
            <input type="text" placeholder="Search" />
          </div>
          <img
            src={addMode ? "./minus.png" : "./plus.png"}
            alt=""
            className="add"
            onClick={() => setAddMode((prev) => !prev)}
          />
        </div>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div
              className="item"
              key={contact.id}
              onClick={() => setSelectedContact(contact)} // ارسال اطلاعات کاربر انتخاب‌شده
            >
              <img src={contact.avatar || "./avatar.png"} alt="Avatar" />
              <div className="texts">
                <span>{contact.username}</span>
                <p>{contact.last_message || "No status available"}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No contacts available.</p>
        )}
        {addMode && <AddUser />}
      </div>
    );
  };
  
  export default ChatList;
  
