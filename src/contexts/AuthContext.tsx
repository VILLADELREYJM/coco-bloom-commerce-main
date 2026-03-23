import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, Transaction, CartItem } from "@/data/types";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  transactions: Transaction[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Omit<User, "id" | "role"> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  addTransaction: (items: CartItem[], paymentMethod: string, deliveryMethod: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getFirebaseErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const firebaseError = error as { code?: string; message?: string };

    if (firebaseError.code === "auth/configuration-not-found") {
      return "Firebase Auth is not configured for this project. Enable Email/Password sign-in in Firebase Console > Authentication > Sign-in method.";
    }

    if (firebaseError.code) {
      return `${firebaseError.code}: ${firebaseError.message || "Firebase operation failed"}`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown Firebase error";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (userId: string) => {
    try {
      const q = query(collection(db, "transactions"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const txs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions: ", error);
    }
  };

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 6000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
            await fetchTransactions(firebaseUser.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setTransactions([]);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  };

  const register = async (data: Omit<User, "id" | "role"> & { password: string }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Save extra user info in Firestore
      const { password, ...userData } = data; // NOTE: Password is not saved in firestore!
      const newUser = {
        ...userData,
        role: "buyer"
      };

      try {
        await setDoc(doc(db, "users", userCredential.user.uid), newUser);
      } catch (firestoreError) {
        await userCredential.user.delete();
        throw firestoreError;
      }

      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return { success: false, error: "No user logged in" };
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, data);
      setUser(prev => prev ? { ...prev, ...data } : null);
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  };

  const addTransaction = async (items: CartItem[], paymentMethod: string, deliveryMethod: string) => {
    if (!user) return;

    try {
      const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
      const txData = {
        userId: user.id,
        date: new Date().toISOString(),
        items,
        total,
        paymentMethod,
        deliveryMethod,
        status: "pending",
        statusHistory: [{ status: "pending", at: new Date().toISOString() }],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "transactions"), txData);

      // **UPDATE PRODUCT STOCK & SOLD COUNT** - Reduce stock and increment sold for each item purchased
      for (const cartItem of items) {
        const productRef = doc(db, "products", cartItem.product.id);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          const currentStock = productDoc.data().stock || 0;
          const currentSold = productDoc.data().sold || 0;
          const newStock = Math.max(0, currentStock - cartItem.quantity);
          const newSold = currentSold + cartItem.quantity;

          await updateDoc(productRef, {
            stock: newStock,
            sold: newSold
          });

          console.log(`Updated ${cartItem.product.name}: stock ${currentStock} → ${newStock}, sold ${currentSold} → ${newSold}`);
        }
      }

      const newTx: Transaction = {
        id: docRef.id,
        ...txData
      } as Transaction;

      setTransactions(prev => [...prev, newTx]);
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, transactions, login, register, logout, addTransaction, updateUserProfile }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-sm text-muted-foreground">Loading please wait...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
