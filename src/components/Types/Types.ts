export type LoginRegisterFormInputs = {
  email: string;
  password: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Food = {
  id: number;
  name: string;
  foodImageUrls: string[];
  price: number;
  description: string;
  category: Category;
  quantityAvailable: number;
  sellerId: number;
  availableDate: string;
};
