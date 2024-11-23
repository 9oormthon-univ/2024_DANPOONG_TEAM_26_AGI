import { z, ZodSchema } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import OpenAI from "openai";

// TypeScript 타입 정의
type TUserInfo = {
    name?: string;
    githubName?: string;
    desiredRoles?: string[]; // 희망직무
    interestedTechnologies?: string[]; // 관심기술
    interestedCompanies?: string[]; // 관심기업
    schoolName?: string; // 학교명
    major?: string; // 전공
    admissionYear?: string; // 입학년도
    graduationYear?: string; // 졸업년도
    gpa?: string; // 학점
};

// Zod 스키마 정의
const UserInfoSchema: ZodSchema<TUserInfo> = z.object({
    name: z.string().optional(),
    githubName: z.string().optional(),
    desiredRoles: z.array(z.string()).optional(),
    interestedTechnologies: z.array(z.string()).optional(),
    interestedCompanies: z.array(z.string()).optional(),
    schoolName: z.string().optional(),
    major: z.string().optional(),
    admissionYear: z.string().optional(),
    graduationYear: z.string().optional(),
    gpa: z.string().optional(),
});

export const askQuery = async (query: string, system = ""): Promise<string> => {
    const openAi = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET as string });

    const stream = openAi.beta.chat.completions.stream({
        model: 'gpt-4o',
        messages: [
            {role: "system", content: system},
            {role: 'user', content: query}
        ],
        stream: true,
    });

    stream.on('content', (delta: any, snapshot: any) => {
        process.stdout.write(delta);
    });

    const chatCompletion = await stream.finalChatCompletion();
    return chatCompletion?.choices[0]?.message?.content ?? ''
}

// CV 분석 함수
export const analyzeCV = async (query: string): Promise<TUserInfo> => {
    const openAi = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET as string });

    // 프롬프트 정의
    const prompt = `
    다음은 PDF를 추출한 텍스트입니다.
    텍스트에서 사용자의 기본정보를 아래와 같은 키로 추출하세요:
    - name
    - githubName
    - desiredRoles // 상위 3개
    - interestedTechnologies // 상위 3개
    - interestedCompanies
    - schoolName
    - major
    - admissionYear
    - graduationYear
    - gpa
  `;

    // OpenAI API 호출
    const response = await openAi.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: prompt },
            { role: "user", content: query },
        ],
        response_format: zodResponseFormat(UserInfoSchema, "userInfo"),
    });

    // 응답 파싱 및 반환
    const parsed = response.choices[0].message.parsed;
    if (!parsed) {
        throw new Error("Invalid response structure");
    }

    return parsed as TUserInfo;
};
