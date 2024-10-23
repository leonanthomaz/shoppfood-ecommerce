import { CartDTO } from "./Cart";
import { User } from "./User";

export interface CheckoutDTO {
    merchantCode: string,
    deliveryFee?: number,
    cartCode: string,
    token?: string,
    cart?: CartDTO,
    user?: User,
}