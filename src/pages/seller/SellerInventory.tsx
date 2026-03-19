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
import { db } from "@/lib/firebase";
import { setDoc, updateDoc, deleteDoc, doc, collection, getDocs } from "firebase/firestore";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";

const SellerInventory = () => {
  const { products: firestoreProducts, loading: productsLoading } = useRealTimeProducts();
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
    if (!productsLoading && !isInitialized) {
      if (firestoreProducts.length === 0) {
        // Seed Firestore with default products on first load
        defaultProducts.forEach(async (product) => {
          await setDoc(doc(db, "products", product.id), product);
        });
        setItems(defaultProducts);
      } else {
        setItems(firestoreProducts);
      }
      setIsInitialized(true);
    } else if (!productsLoading && firestoreProducts.length > 0) {
      setItems(firestoreProducts);
    }
  }, [firestoreProducts, productsLoading, isInitialized]);

  const persist = async (data: Product[]) => {
    setItems(data);
    // Save to Firestore
    for (const product of data) {
      try {
        await setDoc(doc(db, "products", product.id), product);
      } catch (error) {
        console.error("Error saving product:", error);
      }
    }
  };

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

    try {
      if (editing) {
        const updated = items.map((i) =>
          i.id === editing.id
            ? {
              ...i,
              name: form.name,
              description: form.description,
              price: Number(form.price),
              category: form.category,
              stock: Number(form.stock),
              image: form.image || i.image,
            }
            : i
        );
        await persist(updated);
        toast.success("Product updated and synced to buyers!");
      } else {
        const newProduct: Product = {
          id: crypto.randomUUID(),
          name: form.name,
          description: form.description,
          price: Number(form.price),
          image: form.image || defaultProducts[0].image,
          category: form.category,
          stock: Number(form.stock),
        };

        await persist([...items, newProduct]);
        toast.success("Product added and synced to buyers!");
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setItems(items.filter((i) => i.id !== id));
      toast.success("Product removed");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
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

      <div className="mt-6 overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {p.category}
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  ₱{p.price.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-right">
                  <span
                    className={
                      p.stock < 50 ? "text-destructive font-medium" : ""
                    }
                  >
                    {p.stock}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1 text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SellerLayout>
  );
};

export default SellerInventory;