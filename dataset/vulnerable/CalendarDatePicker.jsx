
import React, { useRef } from "react";

export function CalendarDatePicker({ selectedDate }) {
  const calendarRef = useRef(null);

  const showCalendar = () => {
    if (calendarRef.current && selectedDate) {
      calendarRef.current.innerHTML = `
        <div class="calendar-popup">
          <h3>Selected Date: ${selectedDate}</h3>
          <div class="calendar-grid">
            <button class="date-btn">${selectedDate}</button>
          </div>
        </div>
      `;
    }
  };

  return (
    <div>
      <button onClick={showCalendar}>Open Calendar</button>
      <div ref={calendarRef} className="calendar-container" />
    </div>
  );
}


