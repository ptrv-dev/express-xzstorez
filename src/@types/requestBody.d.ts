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
