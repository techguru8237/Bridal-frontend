import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { addBaseURL } from "../../../utils/updateURL";

const CustomerReservations = ({ reservations }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Id
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {reservations?.map((reservation, index) => {
            const mainItem = reservation.items[0]; // Get first item for display
            return (
              <tr key={reservation._id} className="hover:bg-white/5">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  #{index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={addBaseURL(mainItem.primaryPhoto)}
                      alt={mainItem.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm">
                        {mainItem.name}
                      </span>
                      {reservation.items.length > 1 && (
                        <span className="text-gray-400 text-xs">
                          +{reservation.items.length - 1} more items
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {reservation.service}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {reservation.createdAt
                    ? format(new Date(reservation.createdAt), "dd/MM/yyyy")
                    : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {reservation.createdAt
                    ? format(new Date(reservation.createdAt), "HH:MM")
                    : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {reservation.service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {reservation.status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

CustomerReservations.propTypes = {
  reservations: PropTypes.array,
};

export default CustomerReservations;
