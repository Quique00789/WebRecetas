import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MenuSection {
  title: string;
  items: {
    name: string;
    flag?: string;
  }[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Recetas por tipo',
    items: [
      { name: 'Comida' },
      { name: 'Repostería' },
      { name: 'Bebidas' },
      { name: 'Veganas' },
      { name: 'Saludables' },
      { name: 'Rápidas' },
      { name: 'Internacional' }
    ]
  },
  {
    title: 'Recetas por país',
    items: [
      { name: 'México', flag: '🇲🇽' },
      { name: 'Italia', flag: '🇮🇹' },
      { name: 'Japón', flag: '🇯🇵' },
      { name: 'Francia', flag: '🇫🇷' },
      { name: 'Estados Unidos', flag: '🇺🇸' },
      { name: 'China', flag: '🇨🇳' }
    ]
  },
  {
    title: 'Categorías especiales',
    items: [
      { name: 'Para fiestas' },
      { name: 'Para niños' },
      { name: 'Bajo en calorías' },
      { name: 'Sin gluten' },
      { name: 'Económicas' }
    ]
  }
];

const RecipeMenu: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {menuSections.map((section) => (
        <div key={section.title} className="mb-2">
          <button
            onClick={() => toggleSection(section.title)}
            className="w-full flex items-center justify-between p-3 text-left text-amber-900 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <span className="font-medium">{section.title}</span>
            {expandedSections.includes(section.title) ? (
              <ChevronDown size={20} className="text-amber-600" />
            ) : (
              <ChevronRight size={20} className="text-amber-600" />
            )}
          </button>
          
          {expandedSections.includes(section.title) && (
            <div className="ml-4 mt-2 space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  to={`/category/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center p-2 text-amber-800 hover:bg-amber-50 rounded-md text-sm transition-colors"
                >
                  {item.flag && <span className="mr-2">{item.flag}</span>}
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecipeMenu;