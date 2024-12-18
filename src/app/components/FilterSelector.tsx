"use client"
import Category from '@/app/Category'
import React from 'react'
import CategorySelector from '@/app/components/CategorySelector';
import SliderFilter from './SliderBar';

interface FilterSelectorProps {
    categories: Category[]
    onClick: (category: Category, value: string) => void
    onSubmit:() => void
    onChanceSliderValue:(value: number | number[]) => void;

}


const FilterSelector: React.FC<FilterSelectorProps> = ({categories, onClick, onSubmit,onChanceSliderValue}) => {
   

    return (
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
                <li className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white group'>
                <span className="ms-3">Filtrar por</span>

                </li>

                {
                    categories.map((category, index) => (
                        <CategorySelector key={index} category={category} onClick={onClick} />
                    ))
                    
                }
                <li>
                <SliderFilter maxValue={75} label='materias' objectNameCounting='materias' onValueChange={onChanceSliderValue} />
                </li>
                
                <li>
                    <button onClick={onSubmit} className="justify-self-center block mt-12 py-2 px-10 bg-purple-500 hover:bg-purple-800 text-white font-bold rounded">
                        Aplicar
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default FilterSelector