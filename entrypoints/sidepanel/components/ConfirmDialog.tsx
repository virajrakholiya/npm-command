import React from 'react';

interface ConfirmDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-header">
                    <h3>{title}</h3>
                </div>
                <div className="confirm-body">
                    <p>{message}</p>
                </div>
                <div className="confirm-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
