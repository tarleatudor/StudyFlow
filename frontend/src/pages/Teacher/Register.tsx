import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Parolele nu coincid!');
        }

        setLoading(true);
        try {
            await axiosInstance.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            // După înregistrare succesivă, trimitem utilizatorul la login
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la crearea contului. Încearcă alt email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
            <div className='max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100'>
                <h2 className='text-3xl font-black text-slate-800 text-center mb-2 uppercase tracking-tight'>
                    Cont Nou
                </h2>
                <p className='text-center text-slate-500 mb-8'>Alătură-te platformei StudyFlow</p>

                <form onSubmit={handleRegister} className='space-y-4'>
                    <div className='relative'>
                        <User className='absolute left-3 top-3.5 text-slate-400' size={20} />
                        <input name="name" type="text" placeholder='Nume Complet' required
                               className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all'
                               onChange={handleChange} />
                    </div>

                    <div className='relative'>
                        <Mail className='absolute left-3 top-3.5 text-slate-400' size={20} />
                        <input name="email" type="email" placeholder='Email' required
                               className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all'
                               onChange={handleChange} />
                    </div>

                    <div className='relative'>
                        <Lock className='absolute left-3 top-3.5 text-slate-400' size={20} />
                        <input name="password" type="password" placeholder='Parolă' required
                               className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all'
                               onChange={handleChange} />
                    </div>

                    <div className='relative'>
                        <Lock className='absolute left-3 top-3.5 text-slate-400' size={20} />
                        <input name="confirmPassword" type="password" placeholder='Confirmă Parola' required
                               className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all'
                               onChange={handleChange} />
                    </div>

                    {error && <p className='text-red-500 text-sm text-center font-medium'>{error}</p>}

                    <button type='submit' disabled={loading}
                            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2'>
                        {loading ? 'Se procesează...' : 'CREEAZĂ CONT'} <ArrowRight size={18} />
                    </button>
                </form>

                <div className='mt-6 text-center text-sm text-slate-600'>
                    Ai deja un cont?{' '}
                    <Link to="/login" className='text-indigo-600 font-bold hover:underline'>
                        Loghează-te aici
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;