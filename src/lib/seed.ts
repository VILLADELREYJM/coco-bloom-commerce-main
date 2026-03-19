import { db } from "./firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { products as localProducts } from "../data/products";

export const seedProductsToFirebase = async () => {
    try {
        const productsRef = collection(db, "products");

        // Check if products already exist so we don't duplicate them
        const snapshot = await getDocs(productsRef);
        if (!snapshot.empty) {
            alert("Products already exist in Firebase!");
            return;
        }

        // Upload each product
        for (const product of localProducts) {
            // Instead of an auto-generated ID, we can keep the local ID, or let Firebase make one.
            // We will use the local ID here for consistency.
            await setDoc(doc(db, "products", product.id), product);
        }

        alert("Successfully uploaded all products to Firebase!");
    } catch (error) {
        console.error("Error uploading products:", error);
        alert("Failed to upload products. Check console.");
    }
};
