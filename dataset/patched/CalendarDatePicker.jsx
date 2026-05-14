
import React, { useState } from "react";

export function CalendarDatePicker({ selectedDate }) {
  const [showCalendar, setShowCalendar] = useState(false);

  if (!selectedDate) {
    return null;
  }

  return (
    <div>
      <button onClick={() => setShowCalendar(!showCalendar)}>
        Open Calendar
      </button>
      {showCalendar && (
        <div className="calendar-container">
          <div className="calendar-popup">
            <h3>Selected Date: {selectedDate}</h3>
            <div className="calendar-grid">
              <button className="date-btn">{selectedDate}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


