import { object, string } from "yup";


export default () => object({
    responsibleName: string().required().min(2).max(256).label("Nome"),
    email: string().required().email(),
    phoneNumber: string().nullable().label("Numero de Telefone"),
    Address: string().max(1024).nullable(),
});
