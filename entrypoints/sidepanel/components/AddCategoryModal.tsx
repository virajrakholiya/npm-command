import { useState } from 'react';
import { Category } from '../types';

interface AddCategoryModalProps {
    onAdd: (category: Omit<Category, 'id' | 'commands'>) => void;
    onClose: () => void;
}

// Professional solid colors - no gradients
const COLORS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
];

export default function AddCategoryModal({ onAdd, onClose }: AddCategoryModalProps) {
    const [name, setName] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd({
                name: name.trim(),
                icon: name.charAt(0).toUpperCase(), // Use first letter as icon
                color
            });
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>New Category</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Category Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., DevOps, Utilities, Scripts..."
                            className="form-input"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Color</label>
                        <div className="color-grid">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`color-option ${color === c ? 'selected' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
                            Create Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
