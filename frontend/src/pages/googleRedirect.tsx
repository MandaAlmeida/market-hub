import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleGoogleRedirect = async () => {
            try {
                const res = await fetch('http://localhost:3333/user/google/redirect', {
                    credentials: 'include',
                });
                const data = await res.json();
                const user = data.user;

                if (!user?.address || !user?.type) {
                    localStorage.setItem('token', data.user.token); // o token já está no `user` retornado
                    localStorage.setItem('email', user.email);
                    navigate('/complete-oauth');
                } else {
                    localStorage.setItem('token', data.user.token);
                    navigate('/');
                }
            } catch {
                alert('Erro ao finalizar login com Google');
            }
        };

        handleGoogleRedirect();
    }, []);

    return <p className="text-center mt-10">Carregando login do Google...</p>;
};

export default GoogleRedirect;
