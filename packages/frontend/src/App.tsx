import React, { useState, useEffect } from 'react';
import { Item } from '@base-project/shared';
import { apiService } from './services/api';
import ItemCard from './components/ItemCard';
import './App.css';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<string>('checking...');

  useEffect(() => {
    loadItems();
    checkHealth();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await apiService.getItems();
      setItems(fetchedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await apiService.checkHealth();
      setHealthStatus(health.success ? 'healthy' : 'unhealthy');
    } catch (err) {
      setHealthStatus('unhealthy');
    }
  };

  const handleItemClick = async (item: Item) => {
    try {
      const fullItem = await apiService.getItem(item.id);
      setSelectedItem(fullItem);
    } catch (err) {
      console.error('Failed to fetch item details:', err);
    }
  };

  const clearSelection = () => {
    setSelectedItem(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Base Project</h1>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          Backend Status: <span style={{ 
            color: healthStatus === 'healthy' ? 'lightgreen' : 'salmon',
            fontWeight: 'bold'
          }}>{healthStatus}</span>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {selectedItem ? (
          <div>
            <button 
              onClick={clearSelection}
              style={{
                marginBottom: '20px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back to Items
            </button>
            <h2>Item Details</h2>
            <ItemCard item={selectedItem} />
          </div>
        ) : (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2>Items ({items.length})</h2>
              <button 
                onClick={loadItems}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: loading ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {error && (
              <div style={{
                padding: '12px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                Error: {error}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading items...
              </div>
            ) : items.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {items.map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onClick={handleItemClick}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                No items found
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;