import { useState, useEffect } from "react";
import SellerLayout from "@/components/SellerLayout";
import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { sellerDb } from "@/lib/firebaseSeller";
import { setDoc, updateDoc, deleteDoc, doc, collection, getDocs } from "firebase/firestore";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";
import { ProductUpdatedToast } from "@/components/ProductUpdatedToast";

const SellerInventory = () => {
  const { products: firestoreProducts, loading: productsLoading } = useRealTimeProducts(sellerDb);
  const [items, setItems] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  // Initialize with Firestore products or seed with defaults
  useEffect(() => {
    if (!productsLoading) {
      if (!isInitialized && firestoreProducts.length === 0) {
        // Seed Firestore with default products only once if empty
        const batchSeed = async () => {
          const promises = defaultProducts.map(product =>
            setDoc(doc(sellerDb, "products", product.id), product)
          );
          await Promise.all(promises);
        };
        batchSeed();
        setItems(defaultProducts);
        setIsInitialized(true);
      } else {
        // Sync local state with Firestore
        setItems(firestoreProducts);
        setIsInitialized(true);
      }
    }
  }, [firestoreProducts, productsLoading, isInitialized]);

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
    });
    setIsOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      stock: String(p.stock),
      image: p.image,
    });
    setIsOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to avoid Firestore issues (e.g. 1MB)
    if (file.size > 1024 * 1024) {
      toast.error("Image too large. Please use an image under 1MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((f) => ({
        ...f,
        image: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category || !form.stock) {
      toast.error("Fill all required fields");
      return;
    }

    // Prepare the product object
    const productData: Product = editing
      ? {
        ...editing,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        image: form.image || editing.image,
      }
      : {
        id: crypto.randomUUID(),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: form.image || defaultProducts[0].image, // Fallback image if none
        category: form.category,
        stock: Number(form.stock),
      };

    // Optimistic UI update
    setIsOpen(false);

    // Update local state immediately
    if (editing) {
      setItems(prev => prev.map(i => i.id === productData.id ? productData : i));
    } else {
      setItems(prev => [...prev, productData]);
    }

    // Persist to Firestore (Background)
    try {
      if (editing) {
        await updateDoc(doc(sellerDb, "products", productData.id), { ...productData });
        toast.custom(() => <ProductUpdatedToast type="update" />, { duration: 1500 });
      } else {
        await setDoc(doc(sellerDb, "products", productData.id), productData);
        toast.custom(() => <ProductUpdatedToast type="add" />, { duration: 1500 });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save to cloud. Please check connection.");
      // Revert local change if needed, but for now we assume success or user will retry
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic delete
    setItems(prev => prev.filter(i => i.id !== id));

    try {
      await deleteDoc(doc(sellerDb, "products", id));
      toast.custom(() => <ProductUpdatedToast type="delete" />, { duration: 1500 });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      // Could re-fetch from Firestore to revert
    }
  };

  return (
    <SellerLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product inventory
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₱)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stock: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <Label>Upload Product Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>

              {/* IMAGE PREVIEW */}
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-24 w-24 rounded object-cover"
                />
              )}

              <Button onClick={handleSave} className="w-full">
                {editing ? "Update" : "Add"} Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:hidden pb-20">
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full relative">
            <div className="relative aspect-square w-full bg-slate-100">
              <img
                src={p.image || '/placeholder.svg'}
                alt={p.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
                <button
                  onClick={() => openEdit(p)}
                  className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-slate-100 text-slate-600 hover:text-blue-600 active:scale-95 transition-all"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-slate-100 text-slate-600 hover:text-red-600 active:scale-95 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute top-2 left-2 z-10">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm ${p.stock < 10 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white/90 text-slate-700 border border-slate-200/50'}`}>
                  Qty: {p.stock}
                </span>
              </div>
            </div>

            <div className="p-3 flex flex-col flex-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5 line-clamp-1">
                {p.category}
              </span>
              <h3 className="font-semibold text-xs text-slate-900 leading-tight mb-2 line-clamp-2 min-h-[2rem]">
                {p.name}
              </h3>

              <div className="mt-auto pt-2 border-t border-slate-50">
                <p className="font-bold text-[#4a6b4a] text-sm">₱{p.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-2 py-10 text-center text-muted-foreground bg-slate-50 rounded-xl border border-dashed">
            No products found.
          </div>
        )}
      </div>

      <div className="mt-6 hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">Product</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">Category</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-slate-500">Price</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-slate-500">Stock</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-slate-500">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={p.image || "/placeholder.svg"}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                      {p.category}
                    </span>
                  </td>

                  <td className="p-4 align-middle text-right font-medium text-[#4a6b4a]">
                    ₱{(p.price || 0).toLocaleString()}
                  </td>

                  <td className="p-4 align-middle text-right">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${(p.stock || 0) < 10
                        ? "bg-red-50 text-red-700 ring-red-600/10"
                        : "bg-green-50 text-green-700 ring-green-600/20"
                        }`}
                    >
                      {p.stock || 0} units
                    </span>
                  </td>

                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(p)}
                        className="h-8 w-8 p-0 text-blue-600 bg-blue-50/50 hover:bg-blue-100 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                        className="h-8 w-8 p-0 text-red-600 bg-red-50/50 hover:bg-red-100 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                    No products found. Use "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerInventory;