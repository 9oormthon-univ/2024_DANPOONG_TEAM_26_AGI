import {askQuery} from "#service/llm";
import UserRepository from "#repository/user";
import HttpError from "#global/error/http.error";

class AssignmentService {
    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
    // 이력서 읽기
    // 정보 추출
    // 응답
    public generateAssignment = async (id: string) => {
        const userPrompt = await this.userRepository.getPromptByUserId(id);
        if (!userPrompt) {
            throw new HttpError(404, "not found")
        }
        console.log(userPrompt);

        const system = `
        당신은 기업 과제 출제자입니다.
        사용자가 선택한 기술과 분야에 맞는 프로젝트 구현과제를 작성해야합니다.
        
        # 설정
        우선 사용해야하는 언어와 프레임워크, 라이브러리 등을 설정합니다.
        구현 설정은 FE, BE에 따라 1개만 선택합니다.
        // 풀스택이 배열에 포함되지 않는 다면 사용자는 선택한 분야중 딱 1개만 보도록 작성해야함
        // 언어 및 기술은 보편적으로 한 세트로 묶이는 경우만 같이 제시 (ts+node, java+srping, ... 등)
        
        
        반드시 requirements의 첫줄에는 Heading1 으로 제목을 설정합니다.
        반드시 requirements의 두번째 줄에는 description을 작성합니다.
        이후 과제 요구사항를 작성합니다.
        구현해야 하는 기능, 컨벤션, api 설정등을 작성합니다.
        
        # requirements 예시
        // 예시 시작
        ${requirements}
        
        // 예시 종료
        
        문서는 마크다운 형식으로 합니다.
        
        당신의 프로젝트 과제 출제 퀄리티에 따라 응시자의 이후 역량에 큰 영향을 받으며, 기업의 위상이 달라집니다.
        예시보다 다양하고 구체적으로 문서를 작성해야합니다.
        
        한국어로 응답합니다.
        `
       const assignment = await askQuery(JSON.stringify(userPrompt), system);

        const lines = assignment.trim().split('\n');

        const name = lines[0].replaceAll('#', '');
        const description = lines[1];
        const readme = lines.slice(2).join('\n').trim();

        return {
            name,
            description,
            readme,
        }
    }
}

export default AssignmentService;

const requirements = `
# Request, BE 과제 테스트
llm 과 RAG 를 활용한 유틸리티 로직 구현 테스트

# 과제 요구사항

다음 과제 요구사항에 맞춰 Typscript + Node.js 코드를 구현해야합니다.

RAG를 활용하여 LLM 시맨틱 검색 기능을 구현합니다.

## RAG
- RAG 시스템을 구축합니다.
- retrive는 vector 를 통한 검색을 사용합니다.
- PDF 및 외부 파일도 읽을 수 있어야합니다

## Chat
- LLM에게 제시하는 대화는 멀티턴을 구현할 수 있어야합니다.
- LLM이 이전 대화를 기억할 수 있도록 구현하세요

## Convention
- 타입스크립트를 사용합니다.
- MVC 패턴을 사용합니다.
`;