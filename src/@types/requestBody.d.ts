export interface loginBody {
  username: string;
  password: string;
}

export interface categoryCreateBody {
  title: string;
}

export interface brandCreateBody {
  image: string;
  title: string;
}

export interface productCreateBody {
  images: [string];
  title: string;
  description?: string;
  category?: string;
  brand?: string;
  sizes?: [string];
  price: number;
}

export interface paymentProductItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface orderCreateBody {
  session_id: string;
}

export interface paymentCreateBody {
  cart: paymentProductItem[];
  coupon: string | undefined;
}

export interface couponCreateBody {
  name: string;
  coupon: string;
  percent: number;
}

export interface sellixOrderCreateBody {
  email: string;
  fullName: string;
  country: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
}
