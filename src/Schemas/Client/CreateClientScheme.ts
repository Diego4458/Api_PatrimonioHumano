import { date, object, string } from "yup";
import { DocumentValidation } from "../../Utils/DocumentValidation";

export default () =>
  object({
    name: string().required().label("nome"),
    document: string()
      .min(11)
      .max(14)
      .required()
      .test(
        "cpf-is-valid",
        ({ label }) => `${label} Não é valido`,
        (value, testContext) => DocumentValidation(value)
      )
      .label("CPF"),
});
