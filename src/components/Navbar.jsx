import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  PersonIcon,
  CardStackIcon,
  CalendarIcon,
  BoxIcon,
  ExitIcon,
  GearIcon,
  ReaderIcon,
} from '@radix-ui/react-icons'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activedNavItem, setActivedNavItem] = React.useState(() => {
    // Set initial active tab based on current path
    const path = location.pathname
    if (path.includes('/home')) return 'Dashboard';
    if (path.includes('/customers')) return 'Customers'
    if (path.includes('/payments')) return 'Payments'
    if (path.includes('/reservations')) return 'Reservations'
    if (path.includes('/items')) return 'Items'
    return 'Dashboard'
  })

  const handleTabClick = (tabName) => {
    setActivedNavItem(tabName)
    switch (tabName) {
      case 'Dashboard':
        navigate('/home', { replace: true });
        break
      case 'Customers':
        navigate('/customers', { replace: true })
        break
      case 'Payments':
        navigate('/payments', { replace: true })
        break
      case 'Reservations':
        navigate('/reservations', { replace: true })
        break
      case 'Items':
        navigate('/items', { replace: true })
        break
      case 'Settings':
        navigate('/settings', { replace: true })
        break
      case 'Documentation':
        navigate('/documentation', { replace: true })
        break
      default:
        navigate('/home', { replace: true })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/', { replace: true })
  }

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Customers', icon: PersonIcon },
    { name: 'Payments', icon: CardStackIcon },
    { name: 'Reservations', icon: CalendarIcon },
    { name: 'Items', icon: BoxIcon },
    { name: 'Settings', icon: GearIcon },
    { name: 'Documentation', icon: ReaderIcon },
  ]

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-white/10">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-white/10">
          <img 
            src="/TBH white.png" 
            alt="TBH Logo" 
            className="w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-6">
          {navItems?.map((navItem) => {
            const Icon = navItem.icon
            return (
              <button
                key={navItem.name}
                onClick={() => handleTabClick(navItem.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                  activedNavItem === navItem.name
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                {navItem.name}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md cursor-pointer transition-colors"
          >
            <ExitIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar 