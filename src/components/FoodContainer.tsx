import { useState } from "react";
import Categories from "./Categories"
import FoodList from "./FoodList";

export const FoodContainer = () => {
    const [categoryId, setCategoryId] = useState<number | null>(null);

    return (
        <>
            <div className="sticky top-[105px] z-50 bg-white">
                <Categories setCategoryId={setCategoryId} />
            </div>
            <FoodList categoryId={categoryId} />
        </>
    )
}
