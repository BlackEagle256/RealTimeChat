import { useState } from "react";
import "./login.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Login = ({ setUser }) => {  // دریافت setUser از props

    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    });

    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    // تنظیم تصویر آواتار
    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    // تنظیم داده‌های ورودی ثبت‌نام
    const handleSignupInputChange = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value
        });
    };

    // تنظیم داده‌های ورودی ورود
    const handleLoginInputChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    // ارسال اطلاعات ثبت‌نام به سرور
    const handleSignup = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", signupData.username);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        if (avatar.file) {
            formData.append("avatar", avatar.file);
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/accounts/signup/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("Account created successfully!");
        } catch (error) {
            console.error(error.response.data);
        }
    };

    // ارسال اطلاعات ورود به سرور
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/chat/signin/", loginData);
            console.log("Login successful!");

            // بررسی وضعیت موفقیت‌آمیز ورود و پردازش داده‌ها
            if (response.status === 200) {
                console.log(response)
                const { access_token, refresh_token, user_info } = response.data.data;
                const { username } = response.data.data.user_info;

                console.log("Access Token:", access_token);
                console.log("Refresh Token:", refresh_token);
                console.log("User Info:", user_info);

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('username', username);

                // همچنین می‌توانی اطلاعات کاربر رو ذخیره کنی، مثلا در context یا state
                setUser({
                    username: user_info.username,
                    email: user_info.email,
                    first_name: user_info.first_name,
                    last_name: user_info.last_name,
                    avatar: user_info.avatar
                });

                setUser(true);  // به روز رسانی وضعیت کاربر در کامپوننت اصلی (App)
            }
        } catch (error) {
            console.error("Login error:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="login">
            {/* فرم ورود */}
            <div className="item">
                <h2>Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleLoginInputChange}
                        autoComplete="off"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleLoginInputChange}
                        autoComplete="off"
                    />
                    <button>Sign In</button>
                </form>
            </div>

            <div className="seprator"></div>

            {/* فرم ثبت‌نام */}
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleSignup}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="avatar" />
                        Upload an image
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handleAvatar}
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleSignupInputChange}
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        onChange={handleSignupInputChange}
                        autoComplete="off"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleSignupInputChange}
                        autoComplete="off"
                    />
                    <button>Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default Login;