
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Accommodation } from '../types';

interface ComparisonChartProps {
  data: Accommodation[];
  pricingMode: 'max' | 'comfort';
  setPricingMode: (mode: 'max' | 'comfort') => void;
  viewMode: 'total' | 'perPerson';
  setViewMode: (mode: 'total' | 'perPerson') => void;
}

const CustomTooltip = ({ active, payload, label, viewMode, pricingMode }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    const divisor = pricingMode === 'max' ? data.maxGuests : (data.comfortCapacity || 1);
    const labelText = pricingMode === 'max' ? 'Max Capacity' : 'Comfort (K=2, Q=1)';

    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg max-w-xs z-50">
        <p className="font-serif font-bold text-wedding-ocean mb-1">{label}</p>
        <p className="text-gray-600 text-sm mb-1 font-bold">
           ${Math.round(value).toLocaleString()} <span className="text-xs font-normal text-gray-500">{viewMode === 'total' ? 'per Night (incl. Tax)' : 'per Person / Night'}</span>
        </p>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
           <p className="font-medium text-wedding-gold">{labelText}: {divisor} ppl</p>
        </div>
      </div>
    );
  }
  return null;
};

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, pricingMode, setPricingMode, viewMode, setViewMode }) => {

  const chartData = data
    .filter(d => d.pricePerNight > 0 && !d.hiddenFromChart)
    .map(d => {
      const divisor = pricingMode === 'max' ? d.maxGuests : (d.comfortCapacity || 1);
      return {
        name: d.name.length > 20 ? d.name.substring(0, 18) + '...' : d.name,
        nightlyRate: d.pricePerNight,
        perPersonPrice: d.pricePerNight / divisor,
        category: d.category,
        maxGuests: d.maxGuests,
        comfortCapacity: d.comfortCapacity
      };
    });

  const getColor = (category: string) => {
    switch(category) {
      case 'Onsite': return '#C5A059';
      case 'Budget': return '#2C5282';
      case 'Airbnb_Medium': return '#FF5A5F';
      case 'Airbnb_Large': return '#E53E3E';
      default: return '#718096';
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h3 className="text-xl font-serif text-wedding-text text-center xl:text-left">Nightly Rate Comparison</h3>
           <p className="text-xs text-gray-400 mt-1">Comparing prices inclusive of tax (Resort fees waived for block)</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-medium self-center">
            <button 
              onClick={() => setViewMode('total')}
              className={`px-3 py-2 rounded-md transition-all ${viewMode === 'total' ? 'bg-white shadow text-wedding-ocean' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Room Rate
            </button>
            <button 
              onClick={() => setViewMode('perPerson')}
              className={`px-3 py-2 rounded-md transition-all ${viewMode === 'perPerson' ? 'bg-white shadow text-wedding-ocean' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Per Person
            </button>
          </div>

          <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-medium self-center">
             <button 
              onClick={() => setPricingMode('max')}
              className={`px-3 py-2 rounded-md transition-all ${pricingMode === 'max' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Max
            </button>
            <button 
              onClick={() => setPricingMode('comfort')}
              className={`px-3 py-2 rounded-md transition-all ${pricingMode === 'comfort' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Comfort
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: '#4A5568' }} />
            <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12, fill: '#4A5568' }} />
            <Tooltip content={<CustomTooltip viewMode={viewMode} pricingMode={pricingMode} />} />
            <Bar dataKey={viewMode === 'total' ? 'nightlyRate' : 'perPersonPrice'} radius={[4, 4, 0, 0]} animationDuration={800}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
