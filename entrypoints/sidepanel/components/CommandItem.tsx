import { useState } from 'react';
import { Command } from '../types';

interface CommandItemProps {
    command: Command;
    folderId: string;
    isEditMode: boolean;
    onUpdate: (folderId: string, commandId: string, updates: Partial<Command>) => void;
    onDelete: (folderId: string, commandId: string) => void;
}

export default function CommandItem({ command, folderId, isEditMode, onUpdate, onDelete }: CommandItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editCommand, setEditCommand] = useState(command.command);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(command.command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleSave = () => {
        if (editCommand.trim()) {
            onUpdate(folderId, command.id, {
                command: editCommand.trim(),
            });
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="command-item editing">
                <input
                    type="text"
                    value={editCommand}
                    onChange={(e) => setEditCommand(e.target.value)}
                    placeholder="npm command"
                    className="form-input"
                    autoFocus
                />
                <div className="command-edit-actions">
                    <button className="btn btn-primary btn-sm" onClick={handleSave}>
                        Save
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="command-item">
            <div className="command-code-wrapper" onClick={handleCopy}>
                <code className="command-code">{command.command}</code>
                <button
                    className={`copy-btn-inline ${copied ? 'copied' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCopy();
                    }}
                    title={copied ? 'Copied!' : 'Copy command'}
                >
                    {copied ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    )}
                </button>
            </div>
            {isEditMode && (
                <div className="command-actions-inline">
                    <button className="action-btn edit" onClick={() => setIsEditing(true)} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <button
                        className="action-btn delete"
                        onClick={() => onDelete(folderId, command.id)}
                        title="Delete"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
