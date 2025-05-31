import "./List.css"
import UserInfo from "./userInfo/UserInfo"
import ChatList from "./chatList/ChatList"


const List = ({ setSelectedContact }) => {
    return (
      <div className="list">
        <UserInfo />
        <ChatList setSelectedContact={setSelectedContact} />
      </div>
    );
  };
  
  export default List;
  