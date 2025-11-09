import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Calendar } from "lucide-react";
import AutomationTimetable from "../components/layout/AutomationTimetable";

const Timetable = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number>(0);
  const [selectedSemester, setSelectedSemester] = useState<number>(0);

  // Fetch courses for filters
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/timetable/with-details");
        if (response.ok) {
          const result = await response.json();
          setCourses(result.data.courses || []);
          
          // Set default selections to first course and its corresponding semester
          if (result.data.courses && result.data.courses.length > 0) {
            const firstCourse = result.data.courses[0];
            setSelectedCourse(firstCourse.id);
            setSelectedSemester(firstCourse.semester);
          }
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Get unique semesters from courses
  const semesters = [...new Set(courses.map(course => course.semester))].sort();

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">
            View and manage your complete teaching schedule
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h1 className="text-3xl font-medium text-gray-900 mb-4">Filters</h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Program Select */}
            <div className="relative w-full sm:w-1/2">
              <select
                className="appearance-none w-full border border-gray-300 rounded-lg p-2 pl-4 pr-8
                bg-blue-100 text-blue-900 focus:outline-none"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(Number(e.target.value))}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Semester Select */}
            <div className="relative w-full sm:w-1/2">
              <select
                className="appearance-none w-full border border-gray-300 rounded-lg p-2 pl-4 pr-8
                bg-blue-100 text-blue-900 focus:outline-none"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
              >
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Content */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Calendar className="h-5 w-5 mr-2" />
              Weekly Schedule
            </CardTitle>
            <CardDescription className="text-gray-600">
              AI generated weekly teaching timetable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AutomationTimetable 
              selectedCourse={selectedCourse} 
              selectedSemester={selectedSemester} 
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Timetable;