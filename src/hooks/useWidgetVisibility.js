import { useState, useEffect } from 'react'

const useWidgetVisibility = (defaultWidgets) => {
  const [visibleWidgets, setVisibleWidgets] = useState(() => {
    const saved = localStorage.getItem('dashboardWidgets')
    return saved ? JSON.parse(saved) : defaultWidgets
  })

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(visibleWidgets))
  }, [visibleWidgets])

  const toggleWidget = (widgetId) => {
    setVisibleWidgets(prev => {
      if (prev.includes(widgetId)) {
        return prev.filter(id => id !== widgetId)
      }
      return [...prev, widgetId]
    })
  }

  return [visibleWidgets, toggleWidget]
}

export default useWidgetVisibility 