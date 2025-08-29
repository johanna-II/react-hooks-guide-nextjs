import React, { useState, useMemo } from 'react';
import { Button, Card, DemoContainer } from '@/components/common';

interface ListItem {
  id: number;
  value: string;
}

const FilteredList: React.FC<{ items: ListItem[]; filter: string; onRemove: (id: number) => void }> = React.memo(({ items, filter, onRemove }) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.value.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  const isEmpty = filteredItems.length === 0;
  const hasItems = items.length > 0;

  return (
    <div className="min-h-[100px] max-h-40 overflow-y-auto bg-slate-900/50 rounded-lg p-2">
      {isEmpty ? (
        <p className="text-center text-slate-500 py-8 text-sm">
          {!hasItems 
            ? "아이템이 없습니다. 'Add Item'을 눌러 추가하세요!" 
            : "필터 조건에 맞는 아이템이 없습니다."}
        </p>
      ) : (
        filteredItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded mb-1">
            <span className="text-slate-300 text-sm">{item.value}</span>
            <Button 
              onClick={() => onRemove(item.id)} 
              variant="danger" 
              size="sm"
            >
              Remove
            </Button>
          </div>
        ))
      )}
    </div>
  );
});

FilteredList.displayName = 'FilteredList';

export const UseMemoDemo: React.FC = React.memo(() => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [filter, setFilter] = useState('');
  const [nextId, setNextId] = useState(1);

  const addItem = () => {
    const newItem: ListItem = { id: nextId, value: `Item ${nextId}` };
    setItems(prev => [...prev, newItem]);
    setNextId(prev => prev + 1);
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <DemoContainer
      title="useMemo Hook"
      description="비용이 높은 계산을 메모이제이션하여 성능을 최적화합니다"
      tip="useMemo로 필터링 계산을 최적화하여 성능을 향상시킵니다!"
    >
      <Card variant="bordered" className="mb-4">
        <p className="text-sm font-semibold text-orange-400 mb-2">실시간 피드백</p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-slate-400 mb-1">전체 아이템</p>
            <p className="text-2xl font-bold text-white">{items.length}</p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">필터링된 아이템</p>
            <p className="text-2xl font-bold text-green-400">
              {items.filter(item => item.value.toLowerCase().includes(filter.toLowerCase())).length}
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={addItem} variant="success" size="sm">
            Add Item
          </Button>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter items..."
            className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <FilteredList items={items} filter={filter} onRemove={removeItem} />
      </div>
    </DemoContainer>
  );
});

UseMemoDemo.displayName = 'UseMemoDemo';
