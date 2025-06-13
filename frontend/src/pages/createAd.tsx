import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

type SubCategory = {
    id: string;
    name: string;
};

export default function CreateAdPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(1);
    const [subCategory, setSubCategory] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSubCategories() {
            try {
                const res = await api.get<SubCategory[]>("/subcategory");
                setSubCategories(res.data);
            } catch {
                setError("Erro ao carregar subcategorias.");
            }
        }
        fetchSubCategories();
        user();
    }, []);

    const user = async () => {
        const user = await api.get("/user");
        if (user.data.type !== 'SELLER') navigate('/');
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const selectedFiles = Array.from(files);
        if (selectedFiles.length + images.length > 5) {
            return setError("Você pode enviar no máximo 5 imagens.");
        }

        setError(null);
        setImages((prev) => [...prev, ...selectedFiles]);

        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...previews]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price.toString());
        formData.append("stock", stock.toString());
        formData.append("subCategory", subCategory);
        images.forEach((img) => formData.append("imagens", img));

        try {
            await api.post("/ads", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao criar anúncio.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...images];
        const updatedPreviews = [...imagePreviews];
        updatedImages.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setImages(updatedImages);
        setImagePreviews(updatedPreviews);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
            <h1 className="text-2xl font-bold mb-4">Criar Novo Anúncio</h1>
            {error && <p className="text-red-600 mb-3">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Título:
                    <input
                        className="w-full border rounded p-2 mt-1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>

                <label className="block mb-2">
                    Descrição:
                    <textarea
                        className="w-full border rounded p-2 mt-1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>

                <label className="block mb-2">
                    Preço:
                    <input
                        type="number"
                        className="w-full border rounded p-2 mt-1"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                        step="0.01"
                    />
                </label>

                <label className="block mb-2">
                    Estoque:
                    <input
                        type="number"
                        className="w-full border rounded p-2 mt-1"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        required
                    />
                </label>

                <label className="block mb-2">
                    Subcategoria:
                    <select
                        className="w-full border rounded p-2 mt-1"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        required
                    >
                        <option value="">Selecione</option>
                        {subCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Imagens (máx. 5):</label>
                    <div
                        className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${images.length >= 5 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                            }`}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={images.length >= 5}
                            onChange={handleImageChange}
                            className="hidden"
                            id="imageUpload"
                        />
                        <label htmlFor="imageUpload" className="cursor-pointer text-gray-500">
                            {images.length >= 5
                                ? "Limite de imagens atingido"
                                : "Clique ou arraste para selecionar imagens"}
                        </label>
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={src}
                                        alt={`preview-${index}`}
                                        className="w-full h-24 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
                                        title="Remover"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
                >
                    {loading ? "Enviando..." : "Criar Anúncio"}
                </button>
            </form>
        </div>
    );
}
