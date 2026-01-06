import { fetchCategories } from "@/api/api";
import { Category } from "@/components/Types/Types";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
} from "react";
import { toast } from "sonner";

type CategoriesContextType = {
  categoriesList: Category[] | null;
};

type ContextChildren = {
  children: React.ReactNode;
};

export const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

export const CategoriesProvider = ({ children }: ContextChildren) => {


  const {
    data: categoriesList = [],
    isError,
  } = useQuery<Category[]>({
    queryFn: fetchCategories,
    queryKey: ["categoriesList"],
  });

  useEffect(() => {
    if (isError) {
      toast.error("Error fetching catgories list from database.", {
        action: {
          label: <X />,
          onClick: () => toast.dismiss(),
        },
        id: "fetchCategories-error-toast",
      });
    }
  }, [isError]);

  return (
    <CategoriesContext.Provider value={{ categoriesList }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within an CategoriesProvider");
  }
  return context;
};
