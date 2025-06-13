import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Cart from '../components/card';
import { ShoppingCartSimpleIcon } from '@phosphor-icons/react';
import AdImageSlider from '../components/sliderImage';

interface SubCategory {
    id: string;
    name: string;
}

type Image = {
    id: string;
    title: string;
    url: string;
    type: string;
    createdAt: string;
    updatedAt: string;
};

export type Ads = {
    id: string;
    title: string;
    description: string;
    price: string;
    stock: number;
    active: boolean;
    outOfStock: boolean;
    image: Image[];
    subCategory: SubCategory;
    user: User;
    createdAt: string;
    updatedAt: string;
};

type ItemOrder = {
    id: string;
    ads: Ads;
    quantify: number;
    status: string;
    unitPrice: string;
    createdAt: string;
    updatedAt: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    address: string;
    type: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
};

export type Order = {
    id: string;
    user: User;
    status: string;
    priceTotal: number;
    itensOrder: ItemOrder[];
    pay: any[]; // como no seu exemplo está vazio, pode deixar any[] ou criar tipo específico se souber
    createdAt: string;
    updatedAt: string;
};

const getImageUrl = (fileName: string) =>
    `https://pub-d80eaa42b9024ddc8acae9c3f125f5d9.r2.dev/${fileName}`;


const Marketplace = () => {
    const [ads, setAds] = useState<Ads[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [cart, setCart] = useState<Order[]>([]);
    const [openCart, setOpenCart] = useState(false);
    const [seller, setSeller] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchAds = useCallback(async () => {
        try {
            const res = await api.get('/ads', {
                params: {
                    c: selectedSubCategory || undefined,
                    p: page,
                    l: 10,
                },
            });
            setAds(res.data.data);
            setTotalPages(res.data.totalPages);
            if (res.data.warnings && res.data.warnings.length > 0) {
                res.data.warnings.forEach((msg: string) => {
                    alert(msg);
                });
            }
        } catch (err) {
            console.error('Erro ao carregar anúncios', err);
        }
    }, [selectedSubCategory, page]);

    const fetchSubCategories = useCallback(async () => {
        try {
            const res = await api.get('/subcategory');
            setSubCategories(res.data);
        } catch (err) {
            console.error('Erro ao carregar subcategorias', err);
        }
    }, []);

    const fetchCart = useCallback(async () => {
        try {
            const res = await api.get('/orders');
            setCart(res.data.data);
        } catch (err) {
            console.error('Erro ao carregar carrinho', err);
        }
    }, [])

    const user = async () => {
        const user = await api.get("/user");
        if (user.data.type === 'SELLER') setSeller(true);
    }

    useEffect(() => {
        fetchAds();

    }, [fetchAds]);

    useEffect(() => {
        fetchSubCategories();
    }, [fetchSubCategories]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        user();
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchCart();
            fetchAds();
        }, 10000);

        return () => clearInterval(interval);
    }, []);


    // Função para adicionar item no carrinho, chamando backend
    const handleSaveItem = async (ad: Ads) => {
        if (!token) {
            alert('Você precisa estar logado para salvar itens!');
            navigate('/login');
            return;
        }

        try {
            // Chamada ao backend para adicionar no carrinho
            await api.post(
                '/itensOrder',
                [{
                    adsId: ad.id,
                    quantify: 1,
                },]
            );

            fetchCart();
            alert(`Item "${ad.title}" salvo no carrinho!`);
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || 'Erro ao adicionar item no carrinho.';
            alert(errorMessage);
            console.error(error);
        }
    };

    // Remove item do carrinho local (idealmente sincronizar com backend)
    const removeFromCart = async (orderId: string, adId: string, quantify: number) => {
        if (!token) {
            alert('Você precisa estar logado!');
            navigate('/login');
            return;
        }

        try {
            await api.delete(`/itensOrder/removeItem/${orderId}`, {
                data: {
                    adsId: adId,
                    quantify: quantify,
                }
            })
            fetchCart();
            alert('Item removido do carrinho');
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || 'Erro ao remover item do carrinho';
            alert(errorMessage);
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-950">Market-Hub</h1>

            <div className="mb-6 flex justify-between">
                <select
                    className="border border-blue-950 rounded p-3 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                    value={selectedSubCategory}
                    onChange={(e) => {
                        setPage(1);
                        setSelectedSubCategory(e.target.value);
                    }}
                >
                    <option value="">Todas as Subcategorias</option>
                    {subCategories.map((sc) => (
                        <option key={sc.id} value={sc.id}>
                            {sc.name}
                        </option>
                    ))}
                </select>
                <div className='relative flex items-center gap-5'>

                    {seller && <Link to="/createAd">
                        <button className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-900 cursor-pointer">
                            Criar Anúncio
                        </button>
                    </Link>}
                    <Link to="/login">
                        <button className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-900 cursor-pointer">
                            Fazer Login
                        </button>
                    </Link>
                    <button className='cursor-pointer' onClick={() => setOpenCart(!openCart)}><ShoppingCartSimpleIcon size={32} /></button>
                    {openCart && <Cart cart={cart} removeFromCart={removeFromCart} getImageUrl={getImageUrl} increaseQuantity={handleSaveItem} decreaseQuantity={removeFromCart} />}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {ads.map((ad) => (
                    <div
                        key={ad.id}
                        className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col h-[500px] max-w-80"
                    >
                        {ad.image.length <= 1 ? (
                            <img
                                src={getImageUrl(ad.image[0].url)}
                                alt={ad.title}
                                className="h-48 w-full object-cover rounded-md mb-4"
                            />
                        ) : <AdImageSlider ads={ad} getImageUrl={getImageUrl} />}
                        <h2 className="text-xl font-semibold mb-2 line-clamp-2">{ad.title}</h2>
                        <p className="text-gray-700 text-sm mb-2 line-clamp-3">{ad.description}</p>

                        <div className="mt-auto">
                            <p className="text-sm text-gray-500 mb-1">
                                <span className="font-semibold">Categoria:</span> {ad.subCategory.name}
                            </p>
                            <p className="text-sm text-gray-500 mb-1">
                                <span className="font-semibold">Vendedor:</span> {ad.user.name}
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                                <span className="font-semibold">Preço:</span> {ad.price}
                            </p>
                            {ad.stock <= 0 ? <p className="warning flex-1 text-center">⚠ Produto esgotado</p> : <button
                                onClick={() => handleSaveItem(ad)}
                                className="w-full bg-blue-950 text-white rounded py-2 hover:bg-blue-900 transition-colors cursor-pointer "
                            >
                                Salvar para Comprar
                            </button>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center gap-6 mt-8">
                <button
                    className="px-5 py-2 bg-green-200 rounded disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                >
                    &lt; Anterior
                </button>
                <span className="font-semibold">
                    Página {page} de {totalPages}
                </span>
                <button
                    className="px-5 py-2 bg-green-200 rounded disabled:opacity-50"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                >
                    Próxima &gt;
                </button>
            </div>

        </div>
    );
};

export default Marketplace;
