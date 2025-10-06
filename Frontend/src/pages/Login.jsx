import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../utils/api";
import Cookies from 'js-cookie';
import toast, { Toaster } from "react-hot-toast";

const Login = () => {

    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        repassword: ''
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            const fetchData = async () => {
                const res = await api.post("/login", loginData);
                if (res.success) {
                    setAuthToken(res.data.data[0].token);
                    Cookies.set('email', loginData.email);
                    toast.success(res.data.message + '. Redirecting to dashboard in 1 seconds...');
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                } else {
                    toast.error(res.data.message);
                    setLoginData({
                        email: '',
                        password: ''
                    })
                }
            }
            fetchData();        
        } else {
            const fetchData = async () => {
                const res= await api.post("/register", registerData);
                if (res.success) {
                    toast.success(res.data.message + '. Please log in again!');
                    setRegisterData({
                        name: '',
                        email: '',
                        password: '',
                        repassword: ''
                    })
                    setLoginData({
                        email: registerData.email,
                        password: registerData.password
                    })
                    setIsLogin(true);
                } else {
                    setRegisterData({
                        name: '',
                        email: '',
                        password: '',
                        repassword: ''
                    })
                    toast.error(res.data.message);
                }
            }
            fetchData();
        }
    };

    const handleBackToHome = () => {
        navigate("/")
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <Toaster position="top-right" />
            <button
                onClick={handleBackToHome}
                className="absolute top-6 left-6 px-4 py-2 bg-white text-slate-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-slate-50 flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Trang chủ
            </button>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Tabs */}
                <div className="bg-slate-100 p-1 m-4 rounded-xl flex">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${isLogin
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${!isLogin
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        Đăng ký
                    </button>
                </div>

                <div className="p-6 pt-2">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới để nhận thông báo thời tiết hằng ngày'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isLogin ? (
                            <>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white"
                                        placeholder="Nhập email của bạn. Ví dụ: example@gmail.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white"
                                        placeholder="Nhập mật khẩu"
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            /* Form đăng ký */
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={registerData.name}
                                        onChange={handleRegisterChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white"
                                        placeholder="Nhập họ và tên"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="register-email" className="block text-sm font-medium text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="register-email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white"
                                        placeholder="Nhập email. Ví dụ: example@gmail.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="register-password" className="block text-sm font-medium text-slate-700 mb-2">
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        id="register-password"
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white"
                                        placeholder="Nhập mật khẩu"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="repassword" className="block text-sm font-medium text-slate-700 mb-2">
                                        Xác nhận mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        id="repassword"
                                        name="repassword"
                                        value={registerData.repassword}
                                        onChange={handleRegisterChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white"
                                        placeholder="Nhập lại mật khẩu"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
