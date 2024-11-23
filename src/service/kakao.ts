// 응답 데이터 인터페이스 정의
interface KakaoWebSearchResponse {
    meta: {
        total_count: number;
        pageable_count: number;
        is_end: boolean;
    };
    documents: Array<{
        datetime: string;
        contents: string;
        title: string;
        url: string;
    }>;
}

// 카카오 웹 검색 함수
export const fetchKakaoWebSearch = async (
    query: string,
): Promise<KakaoWebSearchResponse | null> => {
    const url = new URL("https://dapi.kakao.com/v2/search/web");
    url.searchParams.append("query", query);

    console.log(process.env.KAKAO_REST_API_KEY)

    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
            },
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data: KakaoWebSearchResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};
