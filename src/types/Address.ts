import { UserDetailsDTO } from "./User";

export interface Address {
    id: number;
    cep: string;
    state?: string;
    city?: string;
    neighborhood?: string;
    street?: string;
    number?: string;
    complement?: string;
}


export interface AddressDTO {
    id?: number;
    cep: string;
    state?: string;
    city?: string;
    neighborhood?: string;
    street?: string;
    number?: string;
    complement?: string;
    user?: UserDetailsDTO;
}