declare class GeminiService {
    private genAI;
    private model;
    constructor();
    generateTimetablePrompt(courses: any[], subjects: any[], teachers: any[], classrooms: any[]): Promise<any[] | null>;
}
export default GeminiService;
//# sourceMappingURL=geminiService.d.ts.map