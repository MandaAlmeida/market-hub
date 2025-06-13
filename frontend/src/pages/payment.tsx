import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

type PaymentResponse = {
    id: string;
    message?: string;
};

type VerifyPaymentResponse = {
    message: string;
    status: string;
};

type Order = {
    id: string;
    priceTotal: number;
    // demais campos...
};

type Payment = {
    id: string;
    status: string;
    payMethod: "cartao" | "pix" | "boleto";
};

export default function PaymentPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [payMethod, setPayMethod] = useState<"cartao" | "pix" | "boleto">("cartao");
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [payId, setPayId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrderAndPayment() {
            try {
                setLoading(true);
                setError(null);

                const orderRes = await api.get<Order>(`/orders/${orderId}`);
                setOrder(orderRes.data);

                const paymentsRes = await api.get<Payment[]>(`/pay/${orderId}`);

                const pendingPayment = paymentsRes.data.find((p) => p.status === "PENDING");
                const confirmedPayment = paymentsRes.data.find((p) => p.status === "CONFIRMED");

                if (pendingPayment) {
                    // Só verifica se for pendente
                    setPayId(pendingPayment.id);
                    setPayMethod(pendingPayment.payMethod);
                    await verifyPayment(pendingPayment.id);
                } else if (confirmedPayment) {
                    // Se já está confirmado, só exibe e redireciona
                    setPayId(confirmedPayment.id);
                    setPayMethod(confirmedPayment.payMethod);
                    setPaymentStatus("Pagamento confirmado!");
                    setTimeout(() => navigate("/"), 1000);
                }
                // Caso nenhum pagamento exista, não faz nada.
            } catch (err: any) {
                setError("Erro ao buscar pedido ou pagamento");
            } finally {
                setLoading(false);
            }
        }

        fetchOrderAndPayment();
    }, [orderId, navigate]);

    async function verifyPayment(paymentId: string) {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post<VerifyPaymentResponse>(`/pay/${paymentId}/verify`);
            setPaymentStatus(res.data.message);

            if (res.data.status === "CONFIRMED") {
                setTimeout(() => navigate("/"), 1000);
            } else {
                setPaymentStatus(res.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro na confirmação do pagamento");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreatePayment() {
        if (!orderId) return;
        setLoading(true);
        setError(null);
        setPaymentStatus(null);

        try {
            const res = await api.post<PaymentResponse>(
                `/pay/${orderId}`,
                { payMethod }
            );
            setPayId(res.data.id);
            await verifyPayment(res.data.id); // já verifica depois de criar
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao criar pagamento");
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirmPayment() {
        if (!payId) return;
        await verifyPayment(payId);
    }

    if (error) return <div className="text-red-600">{error}</div>;

    if (!order) return <div>Carregando pedido...</div>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded mt-8">
            <h2 className="text-xl font-bold mb-4">Pagamento do Pedido</h2>
            <p>
                <strong>Valor Total:</strong> R$ {order.priceTotal}
            </p>

            <div className="mt-4">
                <label className="block font-semibold mb-1">Método de Pagamento:</label>
                <select
                    value={payMethod}
                    onChange={(e) =>
                        setPayMethod(e.target.value as "cartao" | "pix" | "boleto")
                    }
                    className="border p-2 rounded w-full"
                    disabled={loading || (!!paymentStatus && paymentStatus.toLowerCase().includes("confirmado")) || !!payId}
                >
                    <option value="cartao">Cartão</option>
                    <option value="pix">Pix</option>
                    <option value="boleto">Boleto</option>
                </select>
            </div>

            {!payId && (
                <button
                    onClick={handleCreatePayment}
                    disabled={loading}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? "Enviando..." : "Confirmar Pagamento"}
                </button>
            )}

            {payId && (
                <>
                    <p className="mt-4 font-semibold">Status do Pagamento: {paymentStatus || "Aguardando confirmação..."}</p>
                    {!paymentStatus?.toLowerCase().includes("confirmado") && (
                        <button
                            onClick={handleConfirmPayment}
                            disabled={loading}
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Processando..." : "Processar Pagamento"}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
