'use client';

import { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, Package, MoreHorizontal } from 'lucide-react';

/* Categories must match the web app exactly */
const CATEGORIES = [
  { id: 1, name: 'Furniture', icon: '🛋️', items: 156, description: 'Tables, chairs, shelves, sofas, beds, desks', status: 'active', color: '#C84B4B' },
  { id: 2, name: 'Electronics', icon: '📱', items: 218, description: 'Phones, laptops, tablets, chargers, headphones', status: 'active', color: '#D4A574' },
  { id: 3, name: 'Books', icon: '📚', items: 289, description: 'Textbooks, novels, comics, magazines, box sets', status: 'active', color: '#6B8E23' },
  { id: 4, name: 'Clothing', icon: '👕', items: 342, description: 'Shirts, pants, jackets, shoes, accessories', status: 'active', color: '#5C4033' },
  { id: 5, name: 'Toys', icon: '🧸', items: 198, description: 'Board games, building blocks, puzzles, kids toys', status: 'active', color: '#F57C00' },
  { id: 6, name: 'Kitchen', icon: '🍳', items: 134, description: 'Utensils, appliances, cookware, plates, containers', status: 'active', color: '#8B7D6B' },
  { id: 7, name: 'Sports', icon: '⚽', items: 87, description: 'Equipment, dumbbells, fitness gear, outdoor items', status: 'active', color: '#1976D2' },
  { id: 8, name: 'Medical', icon: '🩺', items: 45, description: 'First aid kits, oximeters, health monitors, supplies', status: 'active', color: '#D32F2F' },
  { id: 9, name: 'Plants', icon: '🌿', items: 62, description: 'Indoor plants, outdoor plants, pots, gardening tools', status: 'active', color: '#2ECC71' },
  { id: 10, name: 'Food', icon: '🥫', items: 98, description: 'Non-perishable groceries, canned food, dry goods', status: 'active', color: '#FF8A00' },
  { id: 11, name: 'Other', icon: '📦', items: 176, description: 'Musical instruments, crafts, miscellaneous items', status: 'active', color: '#CDB6A8' },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Categories</h1>
          <p className="text-sm text-muted mt-1">Manage donation item categories. These match the categories shown on the website and app.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors shadow-warm-sm">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Summary */}
      <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-4 flex items-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-heading">{CATEGORIES.length}</p>
          <p className="text-xs text-muted">Total Categories</p>
        </div>
        <div className="w-px h-10 bg-tamarind-100" />
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-leaf">{CATEGORIES.filter(c => c.status === 'active').length}</p>
          <p className="text-xs text-muted">Active</p>
        </div>
        <div className="w-px h-10 bg-tamarind-100" />
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-heading">{CATEGORIES.reduce((sum, c) => sum + c.items, 0).toLocaleString()}</p>
          <p className="text-xs text-muted">Total Items</p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-5 hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${cat.color}15` }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-heading text-lg">{cat.name}</h3>
                  <p className="text-xs text-muted">{cat.items} items</p>
                </div>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-heading transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted mb-4 line-clamp-2">{cat.description}</p>
            <div className="flex items-center justify-between">
              <span className={cat.status === 'active' ? 'badge-success' : 'badge-neutral'}>{cat.status}</span>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-heading transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-error transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-cream rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((cat.items / 350) * 100, 100)}%`, backgroundColor: cat.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
