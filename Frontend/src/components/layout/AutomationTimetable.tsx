import React, { useState, useEffect } from "react";

interface TimetableEntry {
  id: number;
  courseId: number;
  subjectId: number;
  teacherId: number;
  classroomId: number;
  day: string;
  startTime: string;
  endTime: string;
}

interface Course {
  id: number;
  name: string;
  totalStudents: number;
  semester: number;
}

interface Subject {
  id: number;
  name: string;
  hoursPerWeek: number;
  courseId: number;
}

interface Teacher {
  id: number;
  name: string;
  maxHoursPerWeek: number;
}

interface Classroom {
  id: number;
  name: string;
  capacity: number;
  features: string | null;
}

interface AutomationTimetableProps {
  selectedCourse?: number | '';
  selectedSemester?: number | '';
}

const AutomationTimetable: React.FC<AutomationTimetableProps> = ({ selectedCourse, selectedSemester }) => {
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allData, setAllData] = useState<{
    timetableEntries: TimetableEntry[];
    courses: Course[];
    subjects: Subject[];
    teachers: Teacher[];
    classrooms: Classroom[];
  }>({
    timetableEntries: [],
    courses: [],
    subjects: [],
    teachers: [],
    classrooms: []
  });

  // Days and times for the timetable
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  // Refetch data when filters change
  useEffect(() => {
    filterTimetableData();
  }, [selectedCourse, selectedSemester, allData]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch timetable data with related details
      const response = await fetch("http://localhost:8000/api/timetable/with-details");
      
      if (!response.ok) {
        throw new Error("Failed to fetch timetable data");
      }
      
      const result = await response.json();
      
      // Set all data from the API response
      setAllData({
        timetableEntries: result.data.timetableEntries || [],
        courses: result.data.courses || [],
        subjects: result.data.subjects || [],
        teachers: result.data.teachers || [],
        classrooms: result.data.classrooms || []
      });
      
      // Set individual states for reference
      setCourses(result.data.courses || []);
      setSubjects(result.data.subjects || []);
      setTeachers(result.data.teachers || []);
      setClassrooms(result.data.classrooms || []);
      
      // Don't set timetableData here, let filterTimetableData handle it
      // The useEffect will call filterTimetableData when allData changes
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const filterTimetableData = () => {
    let filteredEntries = [...allData.timetableEntries];
    
    // Apply course filter if provided and not zero (prioritized over semester filter)
    if (selectedCourse && selectedCourse !== 0) {
      filteredEntries = filteredEntries.filter(entry => entry.courseId === selectedCourse);
    } 
    // Apply semester filter if provided and not zero, but only if no specific course is selected
    else if (selectedSemester && selectedSemester !== 0) {
      const courseIdsWithSemester = allData.courses
        .filter(course => course.semester === selectedSemester)
        .map(course => course.id);
      
      filteredEntries = filteredEntries.filter(entry => 
        courseIdsWithSemester.includes(entry.courseId)
      );
    }
    
    setTimetableData(filteredEntries);
  };

  // Function to get timetable entry for a specific time and day
  const getTimetableEntry = (day: string, time: string) => {
    return timetableData.find(entry => 
      entry.day === day && 
      entry.startTime <= time && 
      entry.endTime > time
    );
  };

  // Function to get classroom name by ID
  const getClassroomName = (classroomId: number) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom ? classroom.name : `Room ${classroomId}`;
  };

  // Function to get subject name by ID
  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : `Subject ${subjectId}`;
  };

  // Function to get teacher name by ID
  const getTeacherName = (teacherId: number) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : `Teacher ${teacherId}`;
  };

  // Function to get course name by ID
  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : `Course ${courseId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleRefresh = () => {
    fetchAllData();
  };

  const handleGenerateTimetable = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/generate-sample-timetable", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate timetable");
      }
      
      // Refresh the data after generation
      fetchAllData();
    } catch (err: any) {
      setError(err.message || "An error occurred while generating timetable");
      setLoading(false);
    }
  };

  const handleClearTimetable = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/timetable", {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to clear timetable");
      }
      
      // Refresh the data after clearing
      fetchAllData();
    } catch (err: any) {
      setError(err.message || "An error occurred while clearing timetable");
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between">
        <div className="flex gap-2">
          <button 
            onClick={handleGenerateTimetable}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            Generate Sample Timetable
          </button>
          <button 
            onClick={handleClearTimetable}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            disabled={loading}
          >
            Clear Timetable
          </button>
        </div>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh Data
        </button>
      </div>
      <table className="min-w-[700px] sm:min-w-full border-separate border-spacing-2 text-left text-sm">
        <thead>
          <tr>
            <th className="bg-[#faf4ec] text-[#3a3a3a] font-semibold rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-center min-w-[100px]">
              Time
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="bg-[#fcd9a3] text-[#3a3a3a] font-semibold rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-center min-w-[120px]"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td className="bg-[#faf4ec] text-[#3a3a3a] font-normal rounded-lg px-3 py-3 sm:px-4 sm:py-6 text-center">
                {time} - {parseInt(time.split(':')[0]) + 1}:00
              </td>
              {days.map((day) => {
                // Check if this is the break time (13:00)
                if (time === "13:00") {
                  return (
                    <td
                      key={day}
                      className="bg-[#ffe4b5] rounded-lg px-3 py-3 sm:px-4 sm:py-6 text-center"
                    >
                      <p className="text-[#3a3a3a] text-xs sm:text-sm font-semibold leading-tight">
                        Break Time
                      </p>
                    </td>
                  );
                }
                
                const entry = getTimetableEntry(day, time);
                
                if (entry) {
                  return (
                    <td
                      key={day}
                      className="bg-[#f0f7fc] rounded-lg px-3 py-3 sm:px-4 sm:py-3 align-top"
                    >
                      <p className="font-semibold text-[#3a3a3a] leading-tight text-xs sm:text-sm">
                        {getSubjectName(entry.subjectId)}
                      </p>
                      <p className="text-[#8a8a8a] text-[10px] sm:text-xs mt-1 leading-tight">
                        {getTeacherName(entry.teacherId)}
                      </p>
                      <p className="text-[#3a7fc1] text-[10px] sm:text-xs mt-1 leading-tight cursor-pointer">
                        {getClassroomName(entry.classroomId)}
                      </p>
                      <p className="text-[#6b7280] text-[9px] sm:text-[10px] mt-1 leading-tight">
                        {getCourseName(entry.courseId)}
                      </p>
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={day}
                      className="bg-[#faf4ec] rounded-lg px-3 py-3 sm:px-4 sm:py-6 text-center"
                    >
                      <p className="text-[#8a8a8a] text-[10px] sm:text-xs leading-tight">
                        Free
                      </p>
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AutomationTimetable;