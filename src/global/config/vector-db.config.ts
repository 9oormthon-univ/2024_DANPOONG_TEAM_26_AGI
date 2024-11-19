import { ChromaClient, Collection } from "chromadb";

type TChromaDBConfig = {
    host?: string;
    port?: number;
    ssl?: boolean;
    path?: string;
};

class ChromaDBConnectionPool {
    private clients: Map<string, ChromaClient> = new Map();
    private readonly config: TChromaDBConfig;

    constructor(config: TChromaDBConfig) {
        this.config = config;
    }

    getClient(collectionName: string): ChromaClient {
        if (!this.clients.has(collectionName)) {
            this.clients.set(collectionName, new ChromaClient(this.config));
        }
        return this.clients.get(collectionName)!;
    }
}

class ImprovedChromaDBManager {
    private pool: ChromaDBConnectionPool;

    constructor(config: TChromaDBConfig) {
        this.pool = new ChromaDBConnectionPool(config);
    }

    async getOrCreateCollection(collectionName: string): Promise<Collection> {
        const client = this.pool.getClient(collectionName);
        try {
            const existingCollections = await client.listCollections();
            const collectionExists = existingCollections.some(
                (collection) => collection.name === collectionName,
            );

            if (collectionExists) {
                return await client.getCollection({ name: collectionName });
            } else {
                return await client.createCollection({ name: collectionName });
            }
        } catch (error) {
            console.error(`Error accessing collection ${collectionName}:`, error);
            throw error;
        }
    }
}

const getChromaDBConfig = (): TChromaDBConfig => {
    const url = process.env.CHROMA_DB_URL;
    if (!url) {
        throw new Error(
            "CHROMA_DB_URL is not defined in the environment variables",
        );
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
        const parsedUrl = new URL(url);
        return {
            host: parsedUrl.hostname,
            port:
                parseInt(parsedUrl.port, 10) ||
                (parsedUrl.protocol === "https:" ? 443 : 80),
            ssl: parsedUrl.protocol === "https:",
        };
    }

    return { path: url };
};

const chromaManager = new ImprovedChromaDBManager(getChromaDBConfig());

export async function getChromaCollection(
    collectionName: string,
): Promise<Collection> {
    return await chromaManager.getOrCreateCollection(collectionName);
}
