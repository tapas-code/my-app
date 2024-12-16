import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Event } from "./types"

interface EventListProps {
  events: Event[]
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
}

export function EventList({ events, onEditEvent, onDeleteEvent }: EventListProps) {
  return (
    <ScrollArea className="h-[400px] w-full rounded-xl border border-gray-700 p-4 bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-xl">
      {events.map((event) => (
        <div key={event.id} className="mb-4 p-4 border border-gray-700 rounded-xl bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all duration-300 hover:bg-opacity-70">
          <h3 className="font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">{event.name}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {event.startTime} - {event.endTime}
          </p>
          {event.description && <p className="mt-2 text-sm text-gray-300">{event.description}</p>}
          <div className="mt-4 flex justify-end space-x-2">
            <Button size="sm" variant="outline" onClick={() => onEditEvent(event)} className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900 transition-colors duration-300">
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDeleteEvent(event.id)} className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-300">
              Delete
            </Button>
          </div>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-gray-400 text-center">No events for this day.</p>
      )}
    </ScrollArea>
  )
}

