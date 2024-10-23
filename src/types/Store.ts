import { AddressDTO } from "./Address";

export interface StoreRegisterUserDTO {
    name?: string;
    email?: string;
}

export interface Store {
    name?: string;
    logoImage?: string;
    headerImage?: string;
    address?: AddressDTO[];
    user?: StoreRegisterUserDTO;
    merchantCode?: string;
    phoneNumber?: string;
    deliveryTime?: number;
    storeImage?: string;
    openingHours?: string;
    minimumValue?: number;
    newStore?: boolean;
    open?: boolean;
    primaryColor?: string;
}

export interface StoreFormData {
    name?: string;
    user?: StoreRegisterUserDTO;
    address?: AddressDTO;
    merchantCode?: string;

    logoImage?: string;
    headerImage?: string;

    phoneNumber?: string;
    deliveryTime?: number;
    openingHours?: string;
    minimumValue?: number;
    newStore?: boolean;    
    open?: boolean;
    primaryColor?: string;

}