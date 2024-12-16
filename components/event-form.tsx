import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Event } from '../types'

interface EventFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
  event?: Event
  date: Date
}

const colorOptions = [
  { value: 'blue', label: 'Work' },
  { value: 'green', label: 'Personal' },
  { value: 'red', label: 'Important' },
  { value: 'yellow', label: 'Social' },
  { value: 'purple', label: 'Other' },
]

export function EventForm({ isOpen, onClose, onSave, event, date }: EventFormProps) {
  const [name, setName] = useState(event?.name || '')
  const [startTime, setStartTime] = useState(event?.startTime || '')
  const [endTime, setEndTime] = useState(event?.endTime || '')
  const [description, setDescription] = useState(event?.description || '')
  const [color, setColor] = useState(event?.color || 'blue')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      console.error('No date selected for the event');
      return;
    }
    onSave({
      id: event?.id || Date.now().toString(),
      name,
      startTime,
      endTime,
      description,
      color,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-xl text-gray-100 border border-gray-700 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            {event ? 'Edit Event' : 'Add Event'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-gray-800 bg-opacity-50 text-gray-100 border-gray-700 focus:border-blue-500 placeholder-gray-400"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-time" className="text-right text-gray-300">
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3 bg-gray-800 bg-opacity-50 text-gray-100 border-gray-700 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-time" className="text-right text-gray-300">
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3 bg-gray-800 bg-opacity-50 text-gray-100 border-gray-700 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 bg-gray-800 bg-opacity-50 text-gray-100 border-gray-700 focus:border-blue-500 placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right text-gray-300">
                Category
              </Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="col-span-3 bg-gray-800 bg-opacity-50 text-gray-100 border-gray-700 focus:border-blue-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full bg-${option.value}-500 mr-2`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Save Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

