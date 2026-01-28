import { useState } from 'react';
import { Folder, Command } from '../types';
import CommandItem from './CommandItem';
import ConfirmDialog from './ConfirmDialog';

interface FolderCardProps {
    folder: Folder;
    isEditMode: boolean;
    onUpdateFolder: (id: string, updates: Partial<Folder>) => void;
    onDeleteFolder: (id: string) => void;
    onAddCommand: (folderId: string, command: Omit<Command, 'id'>) => void;
    onUpdateCommand: (folderId: string, commandId: string, updates: Partial<Command>) => void;
    onDeleteCommand: (folderId: string, commandId: string) => void;
}

// Get initials from folder name
function getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
}

export default function FolderCard({
    folder,
    isEditMode,
    onUpdateFolder,
    onDeleteFolder,
    onAddCommand,
    onUpdateCommand,
    onDeleteCommand,
}: FolderCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(folder.name);
    const [showAddCommand, setShowAddCommand] = useState(false);
    const [newCommandText, setNewCommandText] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSaveFolder = () => {
        if (editName.trim()) {
            onUpdateFolder(folder.id, { name: editName.trim() });
            setIsEditing(false);
        }
    };

    const handleAddCommand = () => {
        if (newCommandText.trim()) {
            onAddCommand(folder.id, {
                command: newCommandText.trim(),
            });
            setNewCommandText('');
            setShowAddCommand(false);
        }
    };

    const handleDeleteFolder = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        onDeleteFolder(folder.id);
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <div className="folder-card" style={{ '--folder-color': folder.color } as React.CSSProperties}>
            <div className="folder-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="folder-info">
                    <div className="folder-icon" style={{ background: folder.color }}>
                        {getInitials(folder.name)}
                    </div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveFolder();
                                if (e.key === 'Escape') setIsEditing(false);
                            }}
                            className="edit-input"
                            autoFocus
                        />
                    ) : (
                        <span className="folder-name">{folder.name}</span>
                    )}
                    <span className="command-count">{folder.commands.length}</span>
                </div>
                <div className="folder-actions" onClick={(e) => e.stopPropagation()}>
                    {isEditing ? (
                        <>
                            <button className="action-btn save" onClick={handleSaveFolder} title="Save">
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
                            {isEditMode && (
                                <>
                                    <button className="action-btn edit" onClick={() => setIsEditing(true)} title="Edit">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                    <button className="action-btn delete" onClick={handleDeleteFolder} title="Delete">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </>
                    )}
                    <span
                        className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </div>

            {isExpanded && (
                <div className="folder-content">
                    <div className="commands-list">
                        {folder.commands.map((command) => (
                            <CommandItem
                                key={command.id}
                                command={command}
                                isEditMode={isEditMode}
                                folderId={folder.id}
                                onUpdate={onUpdateCommand}
                                onDelete={onDeleteCommand}
                            />
                        ))}
                    </div>

                    {folder.commands.length === 0 && !showAddCommand && (
                        <div className="empty-commands-state">
                            <p className="empty-commands-text">No commands yet</p>
                            <button className="add-command-btn-in-folder" onClick={() => setShowAddCommand(true)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Add Command</span>
                            </button>
                        </div>
                    )}

                    {(showAddCommand || (isEditMode && folder.commands.length > 0)) && (
                        <>
                            {showAddCommand ? (
                                <div className="add-command-form">
                                    <input
                                        type="text"
                                        placeholder="npm command (e.g., npm install react)"
                                        value={newCommandText}
                                        onChange={(e) => setNewCommandText(e.target.value)}
                                        className="form-input"
                                        autoFocus
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
                        </>
                    )}
                </div>
            )}

            {showDeleteConfirm && (
                <ConfirmDialog
                    title="Delete Folder"
                    message={`Delete "${folder.name}" and its ${folder.commands.length} command${folder.commands.length !== 1 ? 's' : ''}?`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
}
