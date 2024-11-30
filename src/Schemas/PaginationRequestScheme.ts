import { number, object, string } from "yup";

export default (size = 10) => object({
    page: number().default(1).min(1),
    size: number().min(size).default(size).max(100),
    search: string().nullable()
});
