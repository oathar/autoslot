declare class TimetableService {
    private geminiService;
    constructor();
    generateTimetable(): Promise<boolean>;
    getAllTimetableEntries(): Promise<any>;
    clearTimetable(): Promise<boolean>;
}
export default TimetableService;
//# sourceMappingURL=timetableService.d.ts.map