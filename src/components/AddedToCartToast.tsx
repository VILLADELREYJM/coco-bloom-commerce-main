import { Check, ShoppingCart } from "lucide-react";

export const AddedToCartToast = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/95 p-6 shadow-xl backdrop-blur-md border border-border/50 animate-in fade-in zoom-in duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="h-6 w-6" />
            </div>
            <div className="text-center">
                <h3 className="font-semibold text-lg text-foreground">Added to Cart!</h3>
                <p className="text-sm text-muted-foreground">Item has been added to your cart</p>
            </div>
            <div className="flex items-center text-xs text-primary font-medium mt-1">
                <ShoppingCart className="h-3 w-3 mr-1" />
                Continue Shopping or Checkout
            </div>
        </div>
    );
};
