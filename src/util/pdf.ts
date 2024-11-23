import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const loadJoinedPDF = async (cvPath: string): Promise<string> => {
    try {
        const resolvedPath = path.join(process.cwd(), cvPath);
        console.log("Resolved path:", resolvedPath);

        // Use LangChain's PDFLoader
        const loader = new PDFLoader(resolvedPath);
        const docs = await loader.load();

        // Combine the text from all pages
        const text = docs.map(doc => doc.pageContent).join("\n\n");
        return text;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw error;
    }
};
