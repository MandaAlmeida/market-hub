import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { apiUrl } from '../api';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        address: '',
        type: 'BUYER', // ou 'SELLER'
        password: '',
        passwordConfirmation: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.passwordConfirmation) {
            setError('As senhas precisam ser iguais');
            return;
        }

        try {
            await api.post('/user/register', form);
            navigate('/');
        } catch (err: any) {
            const msg = err.response?.data?.message;
            setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Erro no registro');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${apiUrl}/user/google`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4 w-96">
                <h1 className="text-xl font-bold text-center">Registro</h1>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="text"
                    name="address"
                    placeholder="Endereço"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="BUYER">Comprador</option>
                    <option value="SELLER">Vendedor</option>
                </select>

                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="password"
                    name="passwordConfirmation"
                    placeholder="Confirmar senha"
                    value={form.passwordConfirmation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Registrar
                </button>
                <button type="button" onClick={handleGoogleLogin} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
                    Entrar com Google
                </button>
            </form>
        </div>
    );
}
