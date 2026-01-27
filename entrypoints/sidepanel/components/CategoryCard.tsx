import { useState } from 'react';
import { Category, Command } from '../types';
import CommandItem from './CommandItem';

interface CategoryCardProps {
    category: Category;
    onUpdateCategory: (id: string, updates: Partial<Category>) => void;
    onDeleteCategory: (id: string) => void;
    onAddCommand: (categoryId: string, command: Omit<Command, 'id'>) => void;
    onUpdateCommand: (categoryId: string, commandId: string, updates: Partial<Command>) => void;
    onDeleteCommand: (categoryId: string, commandId: string) => void;
}

// Get initials from category name
function getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
}

export default function CategoryCard({
    category,
    onUpdateCategory,
    onDeleteCategory,
    onAddCommand,
    onUpdateCommand,
    onDeleteCommand,
}: CategoryCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(category.name);
    const [showAddCommand, setShowAddCommand] = useState(false);
    const [newCommand, setNewCommand] = useState({ name: '', command: '', description: '' });

    const handleSaveCategory = () => {
        if (editName.trim()) {
            onUpdateCategory(category.id, { name: editName.trim() });
            setIsEditing(false);
        }
    };

    const handleAddCommand = () => {
        if (newCommand.name.trim() && newCommand.command.trim()) {
            onAddCommand(category.id, {
                name: newCommand.name.trim(),
                command: newCommand.command.trim(),
                description: newCommand.description.trim() || undefined,
            });
            setNewCommand({ name: '', command: '', description: '' });
            setShowAddCommand(false);
        }
    };

    return (
        <div className="category-card" style={{ '--category-color': category.color } as React.CSSProperties}>
            <div className="category-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="category-info">
                    <div className="category-icon" style={{ background: category.color }}>
                        {getInitials(category.name)}
                    </div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveCategory();
                                if (e.key === 'Escape') setIsEditing(false);
                            }}
                            className="edit-input"
                            autoFocus
                        />
                    ) : (
                        <span className="category-name">{category.name}</span>
                    )}
                    <span className="command-count">{category.commands.length}</span>
                </div>
                <div className="category-actions" onClick={(e) => e.stopPropagation()}>
                    {isEditing ? (
                        <>
                            <button className="action-btn save" onClick={handleSaveCategory} title="Save">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </button>
                            <button className="action-btn cancel" onClick={() => setIsEditing(false)} title="Cancel">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="action-btn edit" onClick={() => setIsEditing(true)} title="Edit">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                            <button className="action-btn delete" onClick={() => onDeleteCategory(category.id)} title="Delete">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </>
                    )}
                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </div>

            {isExpanded && (
                <div className="category-content">
                    <div className="commands-list">
                        {category.commands.map((command) => (
                            <CommandItem
                                key={command.id}
                                command={command}
                                categoryId={category.id}
                                onUpdate={onUpdateCommand}
                                onDelete={onDeleteCommand}
                            />
                        ))}
                        {category.commands.length === 0 && (
                            <div className="empty-commands">No commands yet. Add your first one!</div>
                        )}
                    </div>

                    {showAddCommand ? (
                        <div className="add-command-form">
                            <input
                                type="text"
                                placeholder="Command name (e.g., Install React)"
                                value={newCommand.name}
                                onChange={(e) => setNewCommand({ ...newCommand, name: e.target.value })}
                                className="form-input"
                            />
                            <input
                                type="text"
                                placeholder="npm command (e.g., npm install react)"
                                value={newCommand.command}
                                onChange={(e) => setNewCommand({ ...newCommand, command: e.target.value })}
                                className="form-input"
                            />
                            <input
                                type="text"
                                placeholder="Description (optional)"
                                value={newCommand.description}
                                onChange={(e) => setNewCommand({ ...newCommand, description: e.target.value })}
                                className="form-input"
                            />
                            <div className="form-actions">
                                <button className="btn btn-primary" onClick={handleAddCommand}>
                                    Add Command
                                </button>
                                <button className="btn btn-secondary" onClick={() => setShowAddCommand(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button className="add-command-btn" onClick={() => setShowAddCommand(true)}>
                            <span>+</span> Add Command
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
