import React from 'react'
import { Button } from "@/components/ui/button"
import { Event } from "./types"
import { Droppable, Draggable } from 'react-beautiful-dnd'

interface DayProps {
  date: Date
  events: Event[]
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isWeekend: boolean
  onSelectDay: (date: Date) => void
}

export function Day({ date, events, isCurrentMonth, isToday, isSelected, isWeekend, onSelectDay }: DayProps) {
  const dateString = date.toISOString().split('T')[0];

  return (
    <Droppable droppableId={dateString}>
      {(provided, snapshot) => (
        <Button
          variant="outline"
          className={`h-24 w-full p-2 flex flex-col items-start justify-start rounded-xl transition-all duration-300 ${
            !isCurrentMonth ? 'opacity-50 bg-gray-800 bg-opacity-40' : 'bg-gray-800 bg-opacity-40'
          } ${isToday ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-gray-700'} ${
            isSelected ? 'bg-teal-900 bg-opacity-50 shadow-[0_0_15px_rgba(20,184,166,0.5)]' : ''
          } ${isWeekend ? 'bg-red-900 bg-opacity-20' : ''} ${
            snapshot.isDraggingOver ? 'bg-teal-800 bg-opacity-30' : ''
          } hover:bg-opacity-60 hover:scale-105 backdrop-filter backdrop-blur-sm`}
          onClick={() => onSelectDay(date)}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <span className={`text-sm font-semibold ${isToday ? 'text-blue-400' : isWeekend ? 'text-red-400' : 'text-gray-300'}`}>
            {date.getDate()}
          </span>
          {events.length > 0 && (
            <div className="mt-1 w-full">
              {events.map((event, index) => (
                <Draggable key={`${event.id}-${dateString}`} draggableId={`${event.id}-${dateString}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        transition: 'all 0.2s ease',
                        transform: snapshot.isDragging
                          ? `${provided.draggableProps.style?.transform} scale(1.05)`
                          : provided.draggableProps.style?.transform,
                      }}
                      className={`text-xs truncate bg-${event.color}-500 bg-opacity-70 text-white rounded-full px-2 py-1 mb-1 shadow-[0_0_5px_rgba(59,130,246,0.5)] ${
                        snapshot.isDragging ? 'z-50 opacity-90' : ''
                      }`}
                    >
                      {event.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {events.length > 2 && (
                <div className="text-xs text-gray-400">+{events.length - 2} more</div>
              )}
            </div>
          )}
          {provided.placeholder}
        </Button>
      )}
    </Droppable>
  )
}

