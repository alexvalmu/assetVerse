// src/components/TagList.js
import React from 'react';
import { Link } from 'react-router-dom';

const TagList = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="asset-tags">
      <ul style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingLeft: 0 }}>
        {tags.map((tag) => (
          <li
            key={tag._id}
            style={{
              listStyle: 'none',
              textDecoration: 'none',
              backgroundColor: '#E5A0A0',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.9rem',
            }}
          >
            <Link to={`/categories?tag=${tag.name}`} style={{ textDecoration: 'none',color: 'black' }}>
              #{tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagList;
