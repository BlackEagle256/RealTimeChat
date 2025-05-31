import { useState } from "react";
import "./login.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";

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

    const [loading, setLoading] = useState(false);  // Track loading state
    const [error, setError] = useState(null);  // Track error state

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
        setLoading(true); // Set loading to true when submitting

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
            toast.success("Account created successfully!"); // Show success toast
        } catch (error) {
            toast.error(error.response ? error.response.data : "Something went wrong!"); // Show error toast
            setError(error.response ? error.response.data : "Something went wrong!");  // Set error state
        } finally {
            setLoading(false); // Reset loading state after operation
        }
    };

    // ارسال اطلاعات ورود به سرور
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submitting

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
                toast.success("Login successful!");  // Show success toast
            }
        } catch (error) {
            toast.error("Login failed! Please check your credentials.");  // Show error toast
            setError(error.response ? error.response.data : "Login failed!"); // Set error state
        } finally {
            setLoading(false); // Reset loading state after operation
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
                    <button disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
                </form>
            </div>

            <div className="seprator"></div>

            {/* فرم ثبت‌نام */}
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleSignup}>
                    {/* <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="avatar" />
                        Upload an image
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handleAvatar}
                    /> */}
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
                    <button disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;