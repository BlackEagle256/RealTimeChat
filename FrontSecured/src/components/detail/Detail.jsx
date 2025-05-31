import "./Detail.css";

const Detail = ({ setUser }) => {  // دریافت setUser از props

    const handleLogout = () => {
        setUser(false);  // تغییر وضعیت کاربر به false
    };

    return (
        <div className="detail">
            <div className="user">
                <img src="./avatar.png" alt="" />
                <h2>MR.MH</h2>
                <p>Lorem ipsum dolor </p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Helps</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Share Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>

                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./test (1).jpg" alt="" />
                                <span>photos Selected</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleLogout}>Block User</button>
                <button className="logout" onClick={handleLogout}>LogOut</button> {/* اضافه کردن onClick به Logout */}
            </div>
        </div>
    );
}

export default Detail;
