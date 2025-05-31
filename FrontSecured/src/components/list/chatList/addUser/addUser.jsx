import React, { useState } from "react";
import axios from "axios";
import "./addUser.css";

const AddUser = () => {
    const [username, setUsername] = useState(""); // ذخیره مقدار ورودی
    const [user, setUser] = useState(null); // ذخیره اطلاعات کاربر
    const [error, setError] = useState(null); // ذخیره پیام خطا
    axios.defaults.withCredentials = true;

    const getCSRFToken = () => {
        const csrfToken = document.cookie
            .split(';')
            .find((cookie) => cookie.trim().startsWith('csrftoken='))
            ?.split('=')[1];
        return csrfToken;
    };

    // جستجو کاربر
    const handleSearch = async (e) => {
        e.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه
        setError(null); // پاک کردن خطاهای قبلی
        setUser(null); // پاک کردن اطلاعات کاربر قبلی

        try {
            const response = await axios.get(`http://127.0.0.1:8000/accounts/user/${username}/`);
            setUser(response.data); // ذخیره اطلاعات کاربر
        } catch (err) {
            setError(err.response?.data?.error || "User Not Found");
        }
    };

    // افزودن کاربر به فهرست مخاطبین
    const handleAddUser = async () => {
        if (!user) return; // در صورتی که کاربری وجود نداشته باشد

        const csrfToken = getCSRFToken(); // گرفتن CSRF token از کوکی‌ها

        if (!csrfToken) {
            setError("CSRF token not found!");
            return;
        }

        try {
            // اطمینان از ارسال کوکی‌ها
            axios.defaults.withCredentials = true;

            // ارسال درخواست برای افزودن کاربر به فهرست مخاطبین
            const token = localStorage.getItem("access_token"); // یا هرجایی که توکن JWT ذخیره شده

            const response = await axios.post(
                `http://localhost:8000/api/add-contact/${user.username}/`,
                {},
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        Authorization: `Bearer ${token}`,  // اضافه کردن هدر توکن
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                alert('User added successfully!');
            }
        } catch (err) {
            setError(err.response?.data?.error || "User Not Found");
        }
    };

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // به‌روزرسانی ورودی
                />
                <button type="submit">Search</button>
            </form>
            {error && <div className="error">{error}</div>}
            {user && (
                <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleAddUser}>Add User</button>
                </div>
            )}
        </div>
    );
};

export default AddUser;