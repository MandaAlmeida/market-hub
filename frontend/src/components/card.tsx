import { useNavigate } from 'react-router-dom';
import type { Ads, Order } from '../pages/marketplace';

interface CartProps {
    cart: Order[];
    removeFromCart: (orderId: string, adId: string, quantity: number) => void;
    increaseQuantity: (ad: Ads) => void;
    decreaseQuantity: (orderId: string, adId: string, quantify: number) => void;
    getImageUrl: (fileName: string) => string
}

const Cart = ({ cart, removeFromCart, increaseQuantity, decreaseQuantity, getImageUrl }: CartProps) => {
    const navigate = useNavigate();

    if (cart.length === 0 || !cart.some(item => item.status === "PENDING"))
        return (
            <div className="absolute top-0 right-0 w-[300px] mt-12 p-6 border rounded bg-yellow-50 text-yellow-700 max-w-md mx-auto text-center">
                Seu carrinho está vazio.
            </div>
        );

    const handleCheckout = (orderId: string) => {
        navigate(`/payment/${orderId}`);
    };

    return (
        <div className="absolute top-0 right-0 w-[500px] mt-12 max-w-md mx-auto border rounded p-6 bg-white shadow-md">
            <h3 className="text-xl font-bold mb-4 text-blue-950">Seu Carrinho</h3>

            {cart
                .filter(order => order.status === "PENDING")
                .map((order) => (
                    <div key={order.id}>
                        {order.itensOrder.map(({ ads, quantify }) => (
                            <div
                                key={ads.id}
                                className="flex items-center mb-4 border-b pb-3 last:border-b-0"
                            >
                                <img
                                    src={ads.image[0] ? getImageUrl(ads.image[0].url) : ''}
                                    alt={ads.title}
                                    className="w-16 h-16 object-cover rounded mr-4"
                                />
                                {ads.stock <= 0 ? <p className="warning flex-1 text-center">⚠ Produto esgotado</p> : <div className="flex-grow">
                                    <h4 className="font-semibold">{ads.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        {quantify > 0 && <button
                                            onClick={() => decreaseQuantity(order.id, ads.id, 1)}
                                            className="bg-gray-200 px-2 rounded hover:bg-gray-300 cursor-pointer"
                                            aria-label={`Diminuir quantidade de ${ads.title}`}
                                        >
                                            -
                                        </button>}
                                        <span className="text-sm text-gray-600">{quantify}</span>
                                        {ads.stock > quantify && <button
                                            onClick={() => increaseQuantity(ads)}
                                            className="bg-gray-200 px-2 rounded hover:bg-gray-300 cursor-pointer"
                                            aria-label={`Aumentar quantidade de ${ads.title}`}
                                        >
                                            +
                                        </button>}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">
                                        <span className="font-semibold">Preço: </span>R$ {ads.price}
                                    </p>
                                </div>}


                                <button
                                    onClick={() => removeFromCart(order.id, ads.id, quantify)}
                                    className="text-red-600 hover:text-red-800 font-semibold ml-4 cursor-pointer"
                                    aria-label={`Remover ${ads.title} do carrinho`}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}

                        <div className="flex justify-between items-center mt-6">
                            <p className="text-2xl text-gray-800 mb-3">
                                <span className="font-bold">Preço: </span>R$ {order.priceTotal}
                            </p>
                            {order.priceTotal !== 0.00 && <button
                                onClick={() => handleCheckout(order.id)}
                                className="bg-blue-950 text-white py-3 px-6 rounded hover:bg-blue-900 transition cursor-pointer"
                            >
                                Finalizar Pedido
                            </button>}
                        </div>
                    </div>
                ))}

        </div>

    );
};

export default Cart;
