import { createContext } from "react";

interface ContextType {
  // Define your context value type here
  fetchUserDetails: () => Promise<void>;
  userAddToCart: { count: number };
  fetchUserAddToCart: () => Promise<void>
}

const Context = createContext<ContextType | null>(null);

export default Context;
