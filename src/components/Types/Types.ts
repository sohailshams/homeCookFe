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

export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postCode: string;
};

export type CreatePaymentIntent = {
  Amount: number;
  Quantity: number;
  FoodId: string;
};

export type CloudinarySignatureTimeStamp = {
    timestamp: string;
    signature: string;
}
