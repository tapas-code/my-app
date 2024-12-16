'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Day } from './day'
import { EventForm } from './event-form'
import { EventList } from './event-list'
import { DayEvents, Event } from '../types'
import { getDaysInMonth, formatDate, getEventsForDay, addEvent, updateEvent, deleteEvent, filterEvents, checkEventOverlap, moveEvent } from '../utils'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<DayEvents>({})
  const [isEventFormOpen, setIsEventFormOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)
  const [isEventListOpen, setIsEventListOpen] = useState(false)
  const [filterKeyword, setFilterKeyword] = useState('')

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events))
  }, [events])

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date)
    setIsEventListOpen(true)
  }

  const handleAddEvent = () => {
    setSelectedEvent(undefined)
    setIsEventFormOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsEventFormOpen(true)
  }

  const handleSaveEvent = (event: Event) => {
    if (selectedDate) {
      const dateEvents = getEventsForDay(events, selectedDate);
      if (checkEventOverlap(dateEvents.filter(e => e.id !== event.id), event)) {
        alert('Event overlaps with an existing event. Please choose a different time.');
        return;
      }

      const updatedEvents = updateEvent(events, selectedDate, event);
      setEvents(updatedEvents);
      setIsEventFormOpen(false);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (selectedDate) {
      const updatedEvents = deleteEvent(events, selectedDate, eventId)
      setEvents(updatedEvents)
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceDate = result.source.droppableId;
    const destinationDate = result.destination.droppableId;
    const eventId = result.draggableId.split('-')[0];

    if (sourceDate !== destinationDate) {
      const updatedEvents = moveEvent(events, sourceDate, destinationDate, eventId);
      setEvents(updatedEvents);
    }
  };

  const filteredEvents = filterKeyword ? filterEvents(events, filterKeyword) : events

  const exportEvents = () => {
    const eventsArray = Object.entries(events).flatMap(([date, dayEvents]) =>
      dayEvents.map(event => ({ ...event, date }))
    );
    const jsonString = JSON.stringify(eventsArray, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calendar_events_${formatDate(currentDate)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-8 bg-gray-900 bg-opacity-30 backdrop-filter backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:bg-opacity-40">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handlePreviousMonth} className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900 transition-colors duration-300">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleNextMonth} className="text-teal-400 border-teal-400 hover:bg-teal-400 hover:text-gray-900 transition-colors duration-300">
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={exportEvents} className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-gray-900 transition-colors duration-300">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mb-8">
          <Input
            placeholder="Filter events..."
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="bg-gray-800 bg-opacity-50 text-gray-100 border-gray-700 focus:border-blue-500 placeholder-gray-400"
          />
        </div>
        <div className="grid grid-cols-7 gap-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className={`text-center font-semibold ${day === 'Sat' || day === 'Sun' ? 'text-red-400' : 'text-gray-400'}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {daysInMonth.map((date) => (
            <Day
              key={date.toString()}
              date={date}
              events={getEventsForDay(filteredEvents, date)}
              isCurrentMonth={date.getMonth() === currentDate.getMonth()}
              isToday={formatDate(date) === formatDate(new Date())}
              isSelected={selectedDate ? formatDate(date) === formatDate(selectedDate) : false}
              isWeekend={date.getDay() === 0 || date.getDay() === 6}
              onSelectDay={handleSelectDay}
            />
          ))}
        </div>
        {selectedDate && (
          <div className="mt-8 flex justify-end">
            <Button onClick={handleAddEvent} className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Event
            </Button>
          </div>
        )}
        <EventForm
          isOpen={isEventFormOpen}
          onClose={() => setIsEventFormOpen(false)}
          onSave={handleSaveEvent}
          event={selectedEvent}
          date={selectedDate || new Date()}
        />
        <Dialog open={isEventListOpen} onOpenChange={setIsEventListOpen}>
          <DialogContent className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-xl text-gray-100 border border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                Events for {selectedDate?.toLocaleDateString()}
              </DialogTitle>
            </DialogHeader>
            <EventList
              events={selectedDate ? getEventsForDay(filteredEvents, selectedDate) : []}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DragDropContext>
  )
}

