import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../src/api/axiosInstance';
import { LogIn } from 'lucide-react';

const JoinSession = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.get(`/activities/${code.toUpperCase()}`);

            if(response.data.success) {
                navigate(`/session/${code.toUpperCase()}`);
            }
        } catch(err: any) {
            setError(err.response?.data?.message || 'Codul introdus este invalid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-indigo-600 to-violet-700 p-6'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-2xl p-8'>
            <div className='flex justify-center mb-6'>
                <div className='bg-indigo-100 p-3 rounded-full text-indigo-600'>
                    <LogIn size={32} />
                </div>
            </div>

            <h1 className='text-3xl font-black text-center text-slate-800 mb-2'>StudyFlow</h1>
            <p className='text-center text-slate-500 mb-8'>Introdu codul pentru a intra in activitate0</p>

            <form onSubmit={handleJoin} className='space-y-4'>
                <div>
                    <input type="text"
                           placeholder='Ex: ABCD3F'
                           value={code}
                           onChange={(e) => setCode(e.target.value)}
                           className='w-full p-4 text-center text-2xl font-bold tracking-widest uppercase border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all outline-none'
                           maxLength={6}
                           required />
                </div>

                {error && (
                    <div className='bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium'>
                        {error}
                    </div>
                )}

                <button type='submit'
                        disabled={loading}
                        className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95'>
                    {loading ? 'Se verifica activitatea...' : 'Conecteaza-te!'}
                </button>
            </form>
            </div>
            <p className="mt-8 text-indigo-100 text-sm opacity-70">
                © 2025 StudyFlow - Real-time Feedback System
            </p>
        </div>
    );
};

export default JoinSession;