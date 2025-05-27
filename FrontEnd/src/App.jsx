import React, { useState } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";

const App = () => {
  const [user, setUser] = useState(false); // وضعیت ورود کاربر
  const [selectedContact, setSelectedContact] = useState(null); // کاربر انتخاب‌شده

  return (
    <div className="App">
      <header className="container">
        {user ? (
          <>
            <List setSelectedContact={setSelectedContact} />
            <Chat selectedContact={selectedContact} />
          </>
        ) : (
          <Login setUser={setUser} />
        )}
        <Notification />
      </header>
    </div>
  );
};

export default App;
