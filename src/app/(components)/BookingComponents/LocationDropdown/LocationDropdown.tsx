"use client"

import { useState, useEffect, useRef } from 'react'
import { Location } from '@/types/FormTypes'
import styles from './LocationDropdown.module.css'

interface LocationDropdownProps {
  locations: Location[]
  selectedLocation: string
  onChange: (locationId: string) => void
  disabled?: boolean
  error?: string
  selectedInstructor?: string
}

const LocationDropdown = ({
  locations,
  selectedLocation,
  onChange,
  disabled = false,
  error,
  selectedInstructor
}: LocationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [groupedLocations, setGroupedLocations] = useState<Record<string, Location[]>>({})
  const [selectedLocationName, setSelectedLocationName] = useState<string>('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Group locations by city, with filtering based on instructor
  useEffect(() => {
    if (locations && locations.length > 0) {
      // Filter locations if Adressa instructor is selected
      const filteredLocations = locations.filter(location => {
        // Exclude Vancouver McDonald St location for Adressa
        // We check if the selectedInstructor ID corresponds to an instructor named Adressa
        if (selectedInstructor && 
        // Intentionally broad match to catch variations of the name
        (selectedInstructor.toLowerCase().includes('andresa') || 
         selectedInstructor === 'instructor-andresa-id')) {
          return !(location.city === "Vancouver" && location.address.includes("McDonald"))
        }
        return true
      })
      
      // Group by city
      const grouped = filteredLocations.reduce((acc, location) => {
        if (!acc[location.city]) {
          acc[location.city] = []
        }
        acc[location.city].push(location)
        return acc
      }, {} as Record<string, Location[]>)
      
      setGroupedLocations(grouped)
    }
  }, [locations, selectedInstructor])

  // Set the selected location name when selectedLocation or locations change
  useEffect(() => {
    if (selectedLocation && locations.length > 0) {
      const location = locations.find(loc => loc.id === selectedLocation)
      if (location) {
        setSelectedLocationName(location.name)
      }
    }
  }, [selectedLocation, locations])

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Get unique cities
  const cities = Object.keys(groupedLocations)

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        type="button"
        className={`${styles.dropdownButton} ${error ? styles.error : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedLocationName || 'Select a location'}
        <svg
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownContent}>
          <div className={styles.citiesColumn}>
            {cities.map(city => (
              <div
                key={city}
                className={`${styles.cityItem} ${hoveredCity === city ? styles.active : ''}`}
                onMouseEnter={() => setHoveredCity(city)}
              >
                {city}
              </div>
            ))}
          </div>
          {hoveredCity && (
            <div className={styles.locationsColumn}>
              {groupedLocations[hoveredCity]?.map(location => (
                <div
                  key={location.id}
                  className={`${styles.locationItem} ${selectedLocation === location.id ? styles.selected : ''}`}
                  onClick={() => {
                    onChange(location.id)
                    setSelectedLocationName(location.name)
                    setIsOpen(false)
                  }}
                >
                  <div className={styles.locationName}>{location.name}</div>
                  <div className={styles.locationAddress}>{location.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}

export default LocationDropdown
