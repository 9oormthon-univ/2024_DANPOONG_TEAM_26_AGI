import express, { Request, Response, Router } from "express";
import AsyncWrapper from "#global/middleware/async-wrapper";
import AssignmentService from "#service/assignment";

const router: Router = express.Router();
const assignmentService = new AssignmentService();

router.post(
    "/",
    AsyncWrapper(async (req: Request, res: Response) => {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "submissionId is required" });
        }

        const assignment = await assignmentService.generateAssignment(id);

        res.status(200).json({ assignment });
    })
);

export default router;