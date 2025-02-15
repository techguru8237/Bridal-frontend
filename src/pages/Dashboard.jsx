import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from 'date-fns';
import {
  PersonIcon,
  CardStackIcon,
  CalendarIcon,
  BoxIcon,
  PlusIcon,
} from '@radix-ui/react-icons';

import Navbar from '../components/Navbar';
import ItemForm from '../components/items/ItemForm';
import StatsWidget from '../components/dashboard/StatsWidget';
import PickupsWidget from '../components/dashboard/PickupsWidget';
import ReturnsWidget from '../components/dashboard/ReturnsWidget';
import WidgetManager from '../components/dashboard/WidgetManager';
import QuickActionsWidget from '../components/dashboard/QuickActionsWidget';
import SystemHealthWidget from '../components/dashboard/SystemHealthWidget';
import ReservationsCalendarWidget from '../components/dashboard/ReservationsCalendarWidget';
import AddReservation from '../components/reservations/AddReservation';
import ErrorFallback from '../components/ErrorBoundary';
// import RecentActivityWidget from '../components/dashboard/RecentActivityWidget';

import AddCustomer from './AddCustomer';
import AddPayment from './AddPayment';

import { addItem } from '../store/reducers/itemSlice';
import { handleCreateProduct } from '../actions/product';

const PREDEFINED_RANGES = {
  Today: {
    startDate: (() => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      return date;
    })(),
    endDate: (() => {
      const date = new Date();
      date.setHours(23, 59, 59, 999);
      return date;
    })(),
  },
  'This Week': {
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
  },
  'This Month': {
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  },
  'Last Month': {
    startDate: startOfMonth(subMonths(new Date(), 1)),
    endDate: endOfMonth(subMonths(new Date(), 1)),
  },
  'This Year': {
    startDate: startOfYear(new Date()),
    endDate: endOfYear(new Date()),
  },
};

const DashboardContent = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.customers);
  const items = useSelector((state) => state.item.items);
  const reservations = useSelector((state) => state.reservation.reservations);
  const payments = useSelector((state) => state.payment.payments);

  const activeReservations = reservations?.filter(
    (reservation) => new Date(reservation.availabilityDate) > new Date()
  );
  const totalPayments = payments?.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const [dateRanges, setDateRanges] = useState({
    pickup: PREDEFINED_RANGES['This Week'],
    return: PREDEFINED_RANGES['This Week'],
  });

  const [activeRange, setActiveRange] = useState({
    pickup: 'This Week',
    return: 'This Week',
  });

  // Define widgets first, outside of any hooks or state
  const availableWidgets = [
    { id: 'stats', label: 'Statistics', width: 'full' },
    { id: 'pickups', label: 'Upcoming Pickups', width: 'half' },
    { id: 'returns', label: 'Upcoming Returns', width: 'half' },
    // { id: 'activity', label: 'Recent Activity', width: 'full' },
    { id: 'reservationsCalendar', label: 'Reservations Calendar', width: 'full' },
    { id: 'quickActions', label: 'Quick Actions', width: 'half' },
    { id: 'systemHealth', label: 'System Health', width: 'half' },
  ];

  // Then use availableWidgets in your state
  const [visibleWidgets, setVisibleWidgets] = useState(() => {
    // const saved = localStorage.getItem('visibleWidgets');
    return availableWidgets?.map((w) => w.id);
  });

  const [widgetOrder, setWidgetOrder] = useState(() => {
    // const saved = localStorage.getItem('widgetOrder');
    return availableWidgets?.map((w) => w.id);
  });

  const handleToggleWidget = (widgetId) => {
    setVisibleWidgets((prev) => {
      const newVisibleWidgets = prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId];
      localStorage.setItem('visibleWidgets', JSON.stringify(newVisibleWidgets));
      return newVisibleWidgets;
    });
  };
  
  const handleReorderWidgets = (result) => {
    const { destinationIndex, sourceIndex } = result;

    // Create a copy of the current widget order
    const newOrder = Array.from(widgetOrder);

    // Remove the item from the source index
    const [movedWidget] = newOrder.splice(sourceIndex, 1);

    // Insert the item at the destination index
    newOrder.splice(destinationIndex, 0, movedWidget);

    // Update the state with the new order
    setWidgetOrder(newOrder);
  };

  // const dateRangeOptions = [
  //   { id: 'today', label: 'Today' },
  //   { id: 'thisWeek', label: 'This Week' },
  //   { id: 'nextWeek', label: 'Next Week' },
  //   { id: 'thisMonth', label: 'This Month' },
  //   { id: 'nextMonth', label: 'Next Month' },
  // ];

  // const calculateDateRange = (option, type) => {
  //   const today = new Date();
  //   let start = new Date();
  //   let end = new Date();

  //   switch (option) {
  //     case 'today':
  //       break;
  //     case 'tomorrow':
  //       start = new Date(today.setDate(today.getDate() + 1));
  //       end = new Date(start);
  //       break;
  //     case 'thisWeek':
  //       start = new Date(today.setDate(today.getDate() - today.getDay()));
  //       end = new Date(today.setDate(today.getDate() + 6));
  //       break;
  //     case 'nextWeek':
  //       start = new Date(today.setDate(today.getDate() - today.getDay() + 7));
  //       end = new Date(today.setDate(today.getDate() + 6));
  //       break;
  //     case 'thisMonth':
  //       start = new Date(today.getFullYear(), today.getMonth(), 1);
  //       end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  //       break;
  //     case 'nextMonth':
  //       start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  //       end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  //       break;
  //     default:
  //       break;
  //   }

  //   setDateRanges((prev) => ({
  //     ...prev,
  //     [type]: {
  //       start: start.toISOString().split('T')[0],
  //       end: end.toISOString().split('T')[0],
  //     },
  //   }));
  //   setActiveRange((prev) => ({ ...prev, [type]: option }));
  // };

  const handleRangeChange = (type, range) => {
    setActiveRange((prev) => ({
      ...prev,
      [type]: range,
    }));

    // Update the date range immediately
    const newRange = PREDEFINED_RANGES[range];
    if (newRange) {
      setDateRanges((prev) => ({
        ...prev,
        [type]: {
          startDate: new Date(newRange.startDate),
          endDate: new Date(newRange.endDate),
        },
      }));
    }
  };

  const handleDateChange = (type, dates) => {
    setDateRanges((prev) => ({
      ...prev,
      [type]: dates,
    }));
  };

  const getChangeOfCustomer = () => {
    const today = new Date();
    const startOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const startOfPreviousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    // Count of customers in the previous month
    const previousMonthCount = customers?.filter(
      (customer) =>
        new Date(customer.createdAt) >= startOfPreviousMonth &&
        new Date(customer.createdAt) < startOfCurrentMonth
    ).length;

    // Count of customers in the current month
    const currentMonthCount = customers?.filter(
      (customer) => new Date(customer.createdAt) >= startOfCurrentMonth
    ).length;

    // Calculate change value
    const changeValue = currentMonthCount - previousMonthCount;
    let percentage = 0;

    if (previousMonthCount > 0) {
      percentage = (changeValue / previousMonthCount) * 100; // Calculate percentage change
    } else if (changeValue > 0) {
      percentage = 100; // If there were no customers last month and there are new customers
    }

    const trend = changeValue > 0 ? 'up' : 'down';
    const value =
      percentage > 0 ? `+${parseInt(percentage)}%` : `${parseInt(percentage)}%`;

    return { trend, value };
  };

  const getPaymentChange = () => {
    const today = new Date();
    const startOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // Calculate total payments for the current month
    const currentAmount = payments
      ?.filter((payment) => new Date(payment.createdAt) >= startOfCurrentMonth)
      .reduce((total, payment) => total + payment.amount, 0);

    // Calculate total payments for the previous month
    const previousMonthAmount = payments
      ?.filter((payment) => new Date(payment.createdAt) < startOfCurrentMonth)
      .reduce((total, payment) => total + payment.amount, 0);

    // Calculate change value
    const changeValue =
      previousMonthAmount > 0
        ? ((currentAmount - previousMonthAmount) / previousMonthAmount) * 100
        : currentAmount > 0
        ? 100 // If there were no payments last month and there are current payments
        : 0; // If there are no payments at all

    // Determine trend
    const trend = changeValue > 0 ? 'up' : 'down';

    // Format the change value as a string
    const formattedValue =
      changeValue > 0
        ? `+${parseInt(changeValue)}%`
        : `${parseInt(changeValue)}%`;

    return { value: formattedValue, trend };
  };

  const getActivationChange = () => {
    const today = new Date();
    const startOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // Calculate current active reservations
    const currentActiveAmount = activeReservations?.length;

    // Calculate previous month's active reservations
    const startOfPreviousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    const previousMonthActiveAmount = reservations?.filter(
      (reservation) =>
        new Date(reservation.availabilityDate) >= startOfPreviousMonth &&
        new Date(reservation.availabilityDate) <= startOfCurrentMonth
    ).length;

    // Calculate change value
    const changeValue =
      previousMonthActiveAmount > 0
        ? ((currentActiveAmount - previousMonthActiveAmount) /
            previousMonthActiveAmount) *
          100
        : currentActiveAmount > 0
        ? 100 // If there were no active reservations last month and there are current active reservations
        : 0; // If there are no active reservations at all

    // Determine trend
    const trend = changeValue > 0 ? 'up' : 'down';

    // Format the change value as a string
    const formattedValue =
      changeValue > 0
        ? `+${parseInt(changeValue)}%`
        : `${parseInt(changeValue)}%`;

    return { value: formattedValue, trend };
  };

  const stats = [
    {
      title: 'Total Customers',
      value: customers?.length,
      change: getChangeOfCustomer().value,
      trend: getChangeOfCustomer().trend,
      icon: PersonIcon,
    },
    {
      title: 'Total Payments',
      value: `MAD ${totalPayments}`,
      change: getPaymentChange().value,
      trend: getPaymentChange().trend,
      icon: CardStackIcon,
    },
    {
      title: 'Active Reservations',
      value: activeReservations?.length,
      change: getActivationChange().value,
      trend: getActivationChange().trend,
      icon: CalendarIcon,
    },
    {
      title: 'Dress',
      value: items?.length,
      change: '+8%',
      trend: 'up',
      icon: BoxIcon,
    },
  ];

  // Quick Actions Data with "Add Payment" instead of "Process Return"
  const quickActions = [
    {
      id: 1,
      title: 'New Reservation',
      description: 'Create a new rental reservation',
      icon: <BoxIcon className="h-5 w-5 text-blue-400" />,
      iconBg: 'bg-blue-500/10',
      onClick: () => handleQuickAction('addReservation'),
    },
    {
      id: 2,
      title: 'Add Customer',
      description: 'Register a new customer',
      icon: <PersonIcon className="h-5 w-5 text-green-400" />,
      iconBg: 'bg-green-500/10',
      onClick: () => {
        handleQuickAction('addCustomer');
      },
    },
    {
      id: 3,
      title: 'Add Item',
      description: 'Add new inventory item',
      icon: <CardStackIcon className="h-5 w-5 text-purple-400" />,
      iconBg: 'bg-purple-500/10',
      onClick: () => handleQuickAction('addItem'),
    },
    {
      id: 4,
      title: 'Add Payment',
      description: 'Process new payment',
      icon: <PlusIcon className="h-5 w-5 text-emerald-400" />,
      iconBg: 'bg-emerald-500/10',
      onClick: () => handleQuickAction('newPayment'),
    },
  ];

  // System Health Metrics
  const systemMetrics = [
    {
      id: 1,
      label: 'System Status',
      value: 'Operational',
      status: 'Active',
      statusColor: 'bg-green-500/10 text-green-400',
    },
    {
      id: 2,
      label: 'Active Users',
      value: '24',
      status: 'Normal',
      statusColor: 'bg-blue-500/10 text-blue-400',
    },
    {
      id: 3,
      label: 'Pending Returns',
      value: '12',
      status: 'Warning',
      statusColor: 'bg-yellow-500/10 text-yellow-400',
    },
    {
      id: 4,
      label: 'Server Load',
      value: '28%',
      status: 'Good',
      statusColor: 'bg-green-500/10 text-green-400',
    },
  ];

  const filteredPickups = reservations?.filter(
    (reservation) =>
      new Date(reservation.pickupDate) >= dateRanges.pickup.startDate &&
      new Date(reservation.pickupDate) < dateRanges.pickup.endDate
  );

  const filteredReturns = reservations?.filter(
    (reservation) =>
      new Date(reservation.returnDate) >= dateRanges.return.startDate &&
      new Date(reservation.returnDate) < dateRanges.return.endDate
  );

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddReservationModal, setShowAddReservationModal] = useState(false);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'addCustomer':
        setShowAddCustomerModal(true);
        break;
      case 'newPayment':
        setShowAddPaymentModal(true);
        break;
      case 'addReservation':
        setShowAddReservationModal(true);
        break;
      case 'addItem':
        setShowAddItemModal(true);
        break;
      default:
        break;
    }
  };

  // const FilterPopover = ({ type, dateRange, activeRange }) => (
  //   <Popover.Root>
  //     <Popover.Trigger asChild>
  //       <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
  //         <MixerHorizontalIcon className="h-5 w-5 text-gray-400" />
  //       </button>
  //     </Popover.Trigger>
  //     <Popover.Portal>
  //       <Popover.Content
  //         className="w-80 rounded-lg bg-gray-800 border border-white/10 shadow-xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200"
  //         sideOffset={5}
  //         align="end"
  //         side="bottom"
  //       >
  //         <div className="space-y-4">
  //           <h3 className="text-sm font-medium text-white">Date Range</h3>

  //           {/* Predefined Options */}
  //           <div className="flex flex-wrap gap-2">
  //             {dateRangeOptions?.map((option) => (
  //               <button
  //                 key={option.id}
  //                 onClick={() => calculateDateRange(option.id, type)}
  //                 className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
  //                   activeRange === option.id
  //                     ? 'bg-blue-500 text-white'
  //                     : 'bg-white/5 text-gray-400 hover:bg-white/10'
  //                 }`}
  //               >
  //                 {option.label}
  //               </button>
  //             ))}
  //           </div>

  //           {/* Custom Range */}
  //           <div className="space-y-2">
  //             <label className="text-sm font-medium text-gray-400">
  //               Custom Range
  //             </label>
  //             <div className="flex items-center gap-2">
  //               <input
  //                 type="date"
  //                 value={dateRange.start}
  //                 onChange={(e) =>
  //                   setDateRanges((prev) => ({
  //                     ...prev,
  //                     [type]: { ...prev[type], start: e.target.value },
  //                   }))
  //                 }
  //                 className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               />
  //               <span className="text-gray-400">to</span>
  //               <input
  //                 type="date"
  //                 value={dateRange.end}
  //                 onChange={(e) =>
  //                   setDateRanges((prev) => ({
  //                     ...prev,
  //                     [type]: { ...prev[type], end: e.target.value },
  //                   }))
  //                 }
  //                 className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         <Popover.Arrow className="fill-gray-800" />
  //       </Popover.Content>
  //     </Popover.Portal>
  //   </Popover.Root>
  // );

  const handleError = (error, errorInfo) => {
    console.error('Dashboard Error:', error, errorInfo);
    // Here you could also log to an error reporting service
  };

  // Handle adding new item
  const handleAddItem = (formData) => {
    handleCreateProduct(formData, (newItem) => {
      dispatch(addItem(newItem));
    });
    setShowAddItemModal(false);
  };

  const orderedWidgets = widgetOrder
    .map((id) => availableWidgets.find((w) => w.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-900 to-gray-800 py-4 -mt-8 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={handleError}
          >
            <WidgetManager
              widgets={orderedWidgets}
              visibleWidgets={visibleWidgets}
              onToggleWidget={handleToggleWidget}
              onReorderWidgets={handleReorderWidgets}
            />
          </ErrorBoundary>
        </div>
      </div>

      <div className="space-y-6">
        {(() => {
          const renderedWidgets = [];
          let currentRow = [];

          // Helper function to render a row of widgets
          const renderRow = () => {
            if (currentRow.length === 0) return null;

            return (
              <div
                key={currentRow.map((w) => w.id).join('-')}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {currentRow.map((widget) => (
                  <ErrorBoundary
                    key={widget.id}
                    FallbackComponent={ErrorFallback}
                  >
                    {renderWidget(widget)}
                  </ErrorBoundary>
                ))}
              </div>
            );
          };

          // Helper function to render individual widget
          const renderWidget = (widget) => {
            // Create specific props for each widget type
            switch (widget.id) {
              case 'stats':
                return <StatsWidget stats={stats} />;
              case 'pickups':
                return (
                  <PickupsWidget
                    pickups={filteredPickups}
                    dateRange={dateRanges.pickup}
                    activeRange={activeRange.pickup}
                    onRangeChange={(range) =>
                      handleRangeChange('pickup', range)
                    }
                    onDateChange={(dates) => handleDateChange('pickup', dates)}
                    predefinedRanges={PREDEFINED_RANGES}
                  />
                );
              case 'returns':
                return (
                  <ReturnsWidget
                    returns={filteredReturns}
                    dateRange={dateRanges.return}
                    activeRange={activeRange.return}
                    onRangeChange={(range) =>
                      handleRangeChange('return', range)
                    }
                    onDateChange={(dates) => handleDateChange('return', dates)}
                    predefinedRanges={PREDEFINED_RANGES}
                  />
                );
              case 'reservationsCalendar':
                return <ReservationsCalendarWidget reservations={reservations} />;
              // case 'activity':
              //   return <RecentActivityWidget activities={recentActivities} />;
              case 'quickActions':
                return (
                  <QuickActionsWidget
                    actions={quickActions}
                    onAction={handleQuickAction}
                  />
                );
              case 'systemHealth':
                return <SystemHealthWidget metrics={systemMetrics} />;
              default:
                return null;
            }
          };

          // Process widgets in order
          widgetOrder.forEach((widgetId) => {
            if (!visibleWidgets.includes(widgetId)) return;

            const widget = availableWidgets.find((w) => w.id === widgetId);
            if (!widget) return;

            if (widget.width === 'full') {
              if (currentRow.length > 0) {
                renderedWidgets.push(renderRow());
                currentRow = [];
              }
              renderedWidgets.push(
                <div key={`full-${widget.id}`} className="w-full">
                  <ErrorBoundary
                    key={widget.id}
                    FallbackComponent={ErrorFallback}
                  >
                    {renderWidget(widget)}
                  </ErrorBoundary>
                </div>
              );
            } else {
              currentRow.push(widget);
              if (currentRow.length === 2) {
                renderedWidgets.push(renderRow());
                currentRow = [];
              }
            }
          });

          // Render any remaining widgets
          if (currentRow.length > 0) {
            renderedWidgets.push(renderRow());
          }

          return renderedWidgets;
        })()}
      </div>

      {/* Add Reservation Modal */}
      {showAddReservationModal && (
        <AddReservation
          isOpen={showAddReservationModal}
          onClose={() => setShowAddReservationModal(false)}
        />
      )}
      {/* Add/Edit Modal */}
      {showAddItemModal && (
        <ItemForm
          isOpen={showAddItemModal}
          onClose={() => {
            setShowAddItemModal(false);
          }}
          onSubmit={handleAddItem}
        />
      )}
      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <AddCustomer
          isOpen={showAddCustomerModal}
          onClose={() => setShowAddCustomerModal(false)}
        />
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <AddPayment
          isOpen={showAddPaymentModal}
          onClose={() => setShowAddPaymentModal(false)}
        />
      )}
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar />
      <div className="pl-64">
        <div className="max-w-7xl mx-auto">
          <div className="py-8 px-6">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              {location.pathname === '/home' ? (
                <DashboardContent />
              ) : (
                <Outlet />
              )}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
