// GoogleCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoogleCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/complete-register'); // ou vá para o dashboard, por exemplo
        } else {
            navigate('/login'); // se algo der errado
        }
    }, [location.search, navigate]);

    return <p>Redirecionando...</p>;
}
