import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, Download, Eye, Edit, X } from "lucide-react";
import WeeklyTimeTable from "../components/layout/WeeklyTimeTable";
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Timetable = () => {
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedCell, setSelectedCell] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const programs = ["B.Ed.", "M.Ed.", "FYUP", "ITEP"];
  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

  const handleExportPDF = async () => {
    setIsExporting(true);
    const loadingToast = toast.loading('Generating timetable PDF...', {
      position: 'top-right',
      style: { background: '#3B82F6', color: '#fff', padding: '16px', borderRadius: '12px' },
    });

    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const timetableElement = document.querySelector('.timetable-content');
      if (!timetableElement) {
        toast.error('Timetable not found!', { id: loadingToast });
        setIsExporting(false);
        return;
      }

      const canvas = await html2canvas(timetableElement as HTMLElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 210; // A4 landscape height
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `timetable-${selectedProgram || 'all'}-${selectedSemester || 'all'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success('Timetable PDF exported successfully! 🎉', {
        id: loadingToast,
        duration: 4000,
        icon: '📄',
        style: { background: '#10B981', color: '#fff', padding: '16px', borderRadius: '12px' },
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF. Please try again.', { 
        id: loadingToast,
        style: { background: '#EF4444', color: '#fff', padding: '16px', borderRadius: '12px' },
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCellClick = (cellData: any) => {
    setSelectedCell(cellData);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    toast.success('Timetable updated successfully!', {
      icon: '✅',
      style: { background: '#10B981', color: '#fff', padding: '16px', borderRadius: '12px' },
    });
    setShowEditModal(false);
  };
  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <Toaster position="top-right" />
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
            <p className="text-gray-600">
              View and manage your complete teaching schedule
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Program Select */}
            <div className="relative w-full sm:w-1/2">
              <select
                value={selectedProgram}
                onChange={(e) => {
                  setSelectedProgram(e.target.value);
                  toast.success(`Viewing ${e.target.value} timetable`, {
                    icon: '📅',
                    style: { background: '#3B82F6', color: '#fff', padding: '16px', borderRadius: '12px' },
                  });
                }}
                className="appearance-none w-full border border-gray-300 rounded-lg p-2 pl-4 pr-8
                bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Semester Select */}
            <div className="relative w-full sm:w-1/2">
              <select
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  toast.success(`Viewing ${e.target.value} semester timetable`, {
                    icon: '📅',
                    style: { background: '#3B82F6', color: '#fff', padding: '16px', borderRadius: '12px' },
                  });
                }}
                className="appearance-none w-full border border-gray-300 rounded-lg p-2 pl-4 pr-8
                bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Semester</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Content */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl timetable-content">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center text-gray-900">
                  <Calendar className="h-5 w-5 mr-2" />
                  Weekly Schedule
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your complete weekly teaching timetable
                  {selectedProgram && ` - ${selectedProgram}`}
                  {selectedSemester && ` - ${selectedSemester} Semester`}
                </CardDescription>
              </div>
              {(selectedProgram || selectedSemester) && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                  Filtered View
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <WeeklyTimeTable onCellClick={handleCellClick} />
          </CardContent>
        </Card>

        {/* Edit Modal */}
        {showEditModal && selectedCell && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Edit Period</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)} className="hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
                    placeholder="Enter subject name"
                    defaultValue={selectedCell?.subject}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
                    placeholder="Enter teacher name"
                    defaultValue={selectedCell?.teacher}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
                    placeholder="Enter room number"
                    defaultValue={selectedCell?.room}
                  />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Timetable;
