import express, {json} from "express";
import assignment from "#route/assignment";

const app = express();

app.use(json());

app.use("/api/assignment", assignment)


export default app;