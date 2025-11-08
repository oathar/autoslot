import React from "react";

interface TimetableCell {
  subject: string;
  teacher: string;
  room: string;
  isBreak?: boolean;
}

const Timetable: React.FC = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const times = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 01:00",
    "02:00 - 03:00",
    "03:00 - 04:00",
  ];

  const data: Record<string, Record<string, TimetableCell>> = {};

  times.forEach((time, tIndex) => {
    data[time] = {} as Record<string, TimetableCell>;
    days.forEach((day, dIndex) => {
      if (time === "11:00 - 12:00") {
        data[time][day] = {
          subject: "Break",
          teacher: "",
          room: "",
          isBreak: true,
        };
      } else {
        data[time][day] = {
          subject: `Subject ${tIndex + 1}-${dIndex + 1}`,
          teacher: `Teacher ${tIndex + 1}-${dIndex + 1}`,
          room: `Room ${100 + tIndex * 10 + dIndex}`,
        };
      }
    });
  });

  return (
    <div className="overflow-x-auto">
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
                {time}
              </td>
              {days.map((day) => {
                const cell = data[time][day];
                if (cell.isBreak) {
                  return (
                    <td
                      key={day}
                      className="bg-[#faf4ec] text-[#3a3a3a] font-semibold rounded-lg px-3 py-3 sm:px-4 sm:py-4 text-center"
                    >
                      Break
                    </td>
                  );
                }
                return (
                  <td
                    key={day}
                    className="bg-[#f0f7fc] rounded-lg px-3 py-3 sm:px-4 sm:py-3 align-top"
                  >
                    <p className="font-semibold text-[#3a3a3a] leading-tight text-xs sm:text-sm">
                      {cell.subject}
                    </p>
                    <p className="text-[#8a8a8a] text-[10px] sm:text-xs mt-1 leading-tight">
                      {cell.teacher}
                    </p>
                    <p className="text-[#3a7fc1] text-[10px] sm:text-xs mt-1 leading-tight cursor-pointer">
                      {cell.room}
                    </p>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
