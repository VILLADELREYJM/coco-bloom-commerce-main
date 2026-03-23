import { Check, Edit, Plus, Trash2 } from "lucide-react";

export const ProductUpdatedToast = ({ type }: { type: 'add' | 'update' | 'delete' }) => {

    const config = {
        add: {
            title: "Product Added!",
            desc: "New item is now live.",
            icon: Plus,
            color: "bg-green-100 text-green-600"
        },
        update: {
            title: "Changes Saved!",
            desc: "Product updated successfully.",
            icon: Edit,
            color: "bg-blue-100 text-blue-600"
        },
        delete: {
            title: "Product Removed",
            desc: "Item deleted from inventory.",
            icon: Trash2,
            color: "bg-red-100 text-red-600"
        }
    }[type];

    const Icon = config.icon;

    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-white/95 p-6 shadow-xl backdrop-blur-md border border-slate-200/60 animate-in fade-in zoom-in duration-300 min-w-[240px]">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${config.color}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="text-center">
                <h3 className="font-display font-bold text-lg text-slate-900">{config.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{config.desc}</p>
            </div>
        </div>
    );
};