'use client'

import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import './calendar.css'
import React from 'react';

interface CalendarProps {
    events: { color: string; title: string; start: string; end: string; }[]
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {

    return (
        <div className='h-full'>
            <FullCalendar
                dayHeaderClassNames={
                    ['bg-gray-800', 'text-white', '!border-0 rounded']// Usar clases de Tailwind
                }
                slotLaneClassNames={
                    ['!border !border-1 dark:!border-gray-500']// Usar clases de Tailwind
                }
               
                viewClassNames={
                    ['!border-0']// Usar clases de Tailwind
                }

                slotLabelClassNames={
                    ['!border dark:!border-gray-500']// Usar clases de Tailwind
                }
                
                dayCellClassNames={
                    ['!border-0']// Usar clases de Tailwind
                }
                slotLabelFormat={
                    { hour: '2-digit', minute: '2-digit', hour12: false }
                }
                

                
                height={"auto"}
                headerToolbar={false}
                dayHeaderFormat={{ weekday: "long" }}
                locale={"es-MX"}
                // slotLabelContent={(args) => args.date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })}
                allDaySlot={false}
                slotMinTime="07:00:00"
                hiddenDays={[0, 7]}
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                events={events}
                dayHeaderContent={(args) => args.date.toLocaleDateString('es-MX', { weekday: 'long' }).charAt(0).toUpperCase() + args.date.toLocaleDateString('es-MX', { weekday: 'long' }).slice(1)}
            />
        </div>
    );
}

export default Calendar