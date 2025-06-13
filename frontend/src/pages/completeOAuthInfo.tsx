import { useNavigate } from 'react-router-dom';
import api from '../api';

const CompleteOAuthInfo = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        try {
            const res = await api.post(
                '/user/register-oauth',
                {
                    address: form.address.value,
                    type: form.type.value,
                }
            );
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch {
            alert('Erro ao completar cadastro.');
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Complete seu cadastro</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input name="address" placeholder="Endereço" className="border p-2 rounded" required />
                <select name="type" className="border p-2 rounded" required>
                    <option value="">Tipo de usuário</option>
                    <option value="BUYER">Comprador</option>
                    <option value="SELLER">Vendedor</option>
                </select>
                <button className="bg-blue-500 text-white p-2 rounded">Finalizar</button>
            </form>
        </div>
    );
};

export default CompleteOAuthInfo;
