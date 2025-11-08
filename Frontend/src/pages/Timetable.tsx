import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Calendar } from "lucide-react";
import WeeklyTimeTable from "../components/layout/WeeklyTimeTable";

const Timetable = () => {
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
              >
                <option value="">Select Program</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
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
              >
                <option value="">Select Semester</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
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
              Your complete weekly teaching timetable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyTimeTable />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Timetable;
