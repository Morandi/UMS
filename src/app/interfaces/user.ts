// E' sempre conveniente quando si puo' definire le interfacce dei
// tipi di dato che si utilizzano: questo aiuta a prevenire gli errori
// e consente di poter sfruttare l'autocompletamento degli IDE 
export interface UserInterface {
    id: number;
    name: string;
    lastname: string;
    email: string;
    fiscalcode: string;
    province: string;
    phone: string;
    age: number;
}
