import React from 'react';
import { Item } from '@base-project/shared';

interface ItemCardProps {
  item: Item;
  onClick?: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  return (
    <div 
      className="item-card"
      onClick={() => onClick?.(item)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px',
        backgroundColor: '#f9f9f9',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = '#f9f9f9';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{item.name}</h3>
      <p style={{ margin: '4px 0', color: '#666' }}>
        <strong>Type:</strong> {item.type}
      </p>
      <p style={{ margin: '4px 0', color: '#666' }}>
        <strong>Amount:</strong> ${item.amount}
      </p>
      <p style={{ margin: '4px 0', fontSize: '12px', color: '#999' }}>
        ID: {item.id}
      </p>
    </div>
  );
};

export default ItemCard;