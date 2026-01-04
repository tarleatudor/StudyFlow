import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Am adăugat Link
import axiosInstance from '../../api/axiosInstance';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.post('/auth/login', { email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/teacher');
            } else {
                setError('Eroare: Serverul nu a returnat un token valid.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Email sau parolă incorectă');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
            <div className='max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100'>
                <h2 className='text-3xl font-black text-slate-800 text-center mb-2 uppercase tracking-tight'>
                    Admin Login
                </h2>
                <p className='text-center text-slate-500 mb-8'>Gestionează-ți activitățile în timp real</p>

                <form onSubmit={handleLogin} className='space-y-5'>
                    <div className='relative'>
                        <Mail className='absolute left-3 top-3.5 text-slate-400' size={20} />
                        <input type="email"
                               placeholder='Email profesor'
                               className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all'
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               required />
                    </div>

                    <div className='relative'>
                        <Lock className='absolute left-3 top-3.5 text-slate-400' size={20} />
                        <input type="password"
                                placeholder='Parola'
                                className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                    </div>

                    {error && <p className='text-red-500 text-sm text-center font-medium'>{error}</p>}

                    <button type='submit'
                            disabled={loading}
                            className='w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2'>
                        {loading ? 'SE CONECTEAZĂ...' : 'LOG IN'} <ArrowRight size={18} />
                    </button>
                </form>

                {/* SECȚIUNEA NOUĂ: LINK CĂTRE REGISTER */}
                <div className='mt-8 pt-6 border-t border-slate-100 text-center'>
                    <p className='text-slate-600 text-sm'>
                        Nu ai un cont de profesor?
                    </p>
                    <Link 
                        to="/register" 
                        className='inline-block mt-2 text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all'
                    >
                        Înregistrează-te acum
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;