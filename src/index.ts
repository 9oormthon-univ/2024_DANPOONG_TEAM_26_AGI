import {loadJoinedPDF} from "#util/pdf";
import dotenvx from "@dotenvx/dotenvx";
import {analyzeCV} from "#service/llm";
import {fetchKakaoWebSearch} from "#service/kakao";

dotenvx.config();

(async () => {
    const { default: app } = await import("./server");
    const mongoose = await import("mongoose");

    await mongoose.connect(process.env.MONGODB_URI as string);

    const PORT = 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    //
    // const text = await loadJoinedPDF('cv.pdf');
    // console.log(text);
    //
    // const info = await analyzeCV(text);
    // console.log(info);

    // fetchKakaoWebSearch("이효리")
    //     .then((data) => {
    //         if (data) {
    //             console.log("검색 결과:", data);
    //         } else {
    //             console.log("검색 실패");
    //         }
    //     })
    //     .catch((error) => console.error("Unexpected error:", error));
})();