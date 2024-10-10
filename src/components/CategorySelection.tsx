import React from 'react';
import { Book, Heart, Globe, Shuffle } from 'lucide-react';

interface CategorySelectionProps {
  onSelect: (category: string) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelect }) => {
  const categories = [
    { name: 'Christianity', icon: Book },
    { name: 'Ethics', icon: Heart },
    { name: 'Politics', icon: Globe },
    { name: 'Random', icon: Shuffle },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onSelect(category.name)}
          className="btn-primary flex flex-col items-center justify-center p-6 transition-all duration-300 transform hover:scale-105"
        >
          <category.icon size={48} className="mb-2" />
          <span className="text-lg font-semibold">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelection;