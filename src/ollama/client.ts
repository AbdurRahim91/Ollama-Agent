import axios from 'axios';

export interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

export class OllamaClient {
    private baseUrl: string;

    constructor(baseUrl = 'http://localhost:11434') {
        this.baseUrl = baseUrl;
    }

    async chat(model: string, messages: any[]): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/chat`, {
                model,
                messages,
                stream: false
            });
            return response.data.message.content;
        } catch (error: any) {
            console.error('Ollama chat error:', error);
            throw new Error(`Failed to communicate with Ollama: ${error.message}`);
        }
    }

    async listModels(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/tags`);
            return response.data.models.map((m: any) => m.name);
        } catch (error: any) {
            console.error('Ollama listModels error:', error);
            return [];
        }
    }
}
