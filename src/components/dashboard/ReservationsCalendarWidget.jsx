import React, { useState } from "react";
import PropTypes from "prop-types";
import enUS from "date-fns/locale/en-US";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "../items/Calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import ItemInformation from "../items/ItemInformation";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ReservationsCalendarWidget = ({ reservations }) => {
  const [view, setView] = useState("month");
  const [showItemInformation, setShowItemInformation] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const transformReservations = () => {
    return reservations?.map((reservation) => ({
      id: reservation._id, // Use the reservation ID
      title: `${reservation.client?.name}-${reservation.items[0]?.name}`, // Customize the title
      start:
        reservation.type === "Final"
          ? new Date(reservation.pickupDate)
          : new Date(reservation.fittingDate), // Start date
      end:
        reservation.type === "df"
          ? new Date(reservation.availabilityDate)
          : new Date(reservation.fittingDate), // End date
      customer: {
        name: reservation.client.name || "Unknown", // Assuming you have the client's name
        // Add additional customer details if available
      },
      rentalDetails: {
        cost: reservation.total || 0, // Total cost
        notes: reservation.notes || "No notes provided", // Notes
      },
    }));
  };

  // Transform reservations for the calendar
  const events = transformReservations(reservations);

  const handleSelectEvent = (event) => {
    const reservation = reservations.find(
      (reservation) => reservation._id == event.id
    );
    setSelectedReservation(reservation);
    setShowItemInformation(true);
  };

  return (
    <div className="space-y-6">
      <div className="h-[600px] bg-white/5 rounded-lg p-4 border border-white/10">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          onSelectEvent={handleSelectEvent}
          className="custom-calendar"
          views={["month", "week", "day"]}
          defaultView="month"
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 23, 59, 0)}
          step={30}
          timeslots={2}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-4">
        {/* <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/30"></span>
          <span className="text-sm text-gray-400">Final</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></span>
          <span className="text-sm text-gray-400">Fitting</span>
        </div> */}

        {showItemInformation && (
          <ItemInformation
            reservation={selectedReservation}
            onClose={() => setShowItemInformation(false)}
          />
        )}
      </div>
    </div>
  );
};

ReservationsCalendarWidget.propTypes = {
  reservations: PropTypes.arrayOf(
    PropTypes.shape({
      client: PropTypes.shape({
        name: PropTypes.string.isRequired,
        surname: PropTypes.string.isRequired,
      }).isRequired,
      type: PropTypes.string.isRequired,
      pickupDate: PropTypes.string.isRequired,
      returnDate: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
};

export default ReservationsCalendarWidget;
