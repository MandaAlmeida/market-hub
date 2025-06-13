// GoogleCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoogleCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const isNewUser = params.get('isNewUser') === 'true';

        console.log(params)

        if (token) {
            localStorage.setItem('token', token);
            if (isNewUser) {
                navigate('/complete-register');
            } else {
                navigate('/');
            }
        } else {
            navigate('/login');
        }
    }, [location.search, navigate]);

    return <p>Redirecionando...</p>;
}
