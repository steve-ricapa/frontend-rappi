export interface Product {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
}

export interface CartItem {
  product: Product
  quantity: number
}
