import ValidateJWT from "./Middlewares/ValidateJWT";
const multer = require("multer");

import { CreateUser } from "./Routes/Auth/CreateUser";
import { AuthenticateUser } from "./Routes/Auth/AuthenticateUser";
import { UpdateData } from "./Routes/Auth/ChangeSettings";
import { UserStatus } from "./Routes/Auth/UserStatus";

import { Router } from "express";
import { FindNextApointments } from "./Routes/Apointments/FindNextApointments";
import { GetAllCompanys } from "./Routes/Companys/GetAllCompanys";
import { CreateCompany } from "./Routes/Companys/CreateCompany";
import { CreateAppointment } from "./Routes/Companys/apointments/CreateAppointment";
import { GetAllCompanyApointments } from "./Routes/Companys/apointments/GetAllCompanyApointments";
import { FindSingleApointment } from "./Routes/Apointments/FindSingleApointment";
import { UpdateSingleApointment } from "./Routes/Apointments/UpdateSingleApointment";
import { GetAllClients } from "./Routes/Clients/GetAllClients";
import { CreateClient } from "./Routes/Clients/CreateClient";
import { AssignClientToAppointment } from "./Routes/Apointments/AssignClientToAppointment";
import { UpdateClientPressence } from "./Routes/Apointments/UpdateClientPressence";
import { GetAppointmentFiles } from "./Routes/Clients/GetAppointmentFiles";
import { UploadAppointmentFiles } from "./Routes/Clients/UploadAppointmentFiles";
import { DeleteApointmentFile } from "./Routes/Clients/DeleteApointmentFile";
import { GetClientsNotAssingedOnThisAppointment } from "./Routes/Apointments/Clients/GetClientsNotAssingedOnThisAppointment";
import { GetSingleCompany } from "./Routes/Companys/GetSingleCompany";
import { UpdateContact } from "./Routes/Companys/contacts/UpdateContact";
import { CreateContact } from "./Routes/Companys/contacts/CreateContact";
import { GetSingleClient } from "./Routes/Clients/GetSingleClient";
import { GetClientAppointments } from "./Routes/Clients/GetClientAppointments";
import { UpdateClient } from "./Routes/Clients/UpdateClient";

const upload = multer({ dest: "./secret/secured" });

const router = Router();

router.post("/auth/register", CreateUser);
router.post("/auth", AuthenticateUser);
router.use(ValidateJWT);

router.route("/auth").get(UserStatus).patch(UpdateData);

//apointment
router.get("/apointments/next", FindNextApointments);

router
  .route("/apointment/:id")
  .get(FindSingleApointment)
  .put(UpdateSingleApointment);

router.get("/apointment/:id/avaible", GetClientsNotAssingedOnThisAppointment);

router
  .route("/apointment/:id/:userId")
  .post(AssignClientToAppointment)
  .put(UpdateClientPressence);

router
  .route("/apointment/:id/:userId/files")
  .get(GetAppointmentFiles)
  .post(upload.single("uploaded_file"), UploadAppointmentFiles);

router.delete("/apointment/:id/:userId/:fileId", DeleteApointmentFile);

//company
router.route("/company/:id").get(GetSingleCompany);
router.route("/company/:id/contact/:contactId").patch(UpdateContact);
router.route("/company/:id/contact").post(CreateContact);
router.route("/company").get(GetAllCompanys).post(CreateCompany);

router
  .route("/company/:id/apointments")
  .post(CreateAppointment)
  .get(GetAllCompanyApointments);

router.route("/client").post(CreateClient).get(GetAllClients);
router.route("/client/:id").get(GetSingleClient).patch(UpdateClient);
router.route("/client/:id/apointments").get(GetClientAppointments);

export default router;
