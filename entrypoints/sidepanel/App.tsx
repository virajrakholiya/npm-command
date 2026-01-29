import { useState } from 'react';
import { useStorage } from './hooks/useStorage';
import FolderCard from './components/FolderCard';
import AddFolderModal from './components/AddFolderModal';
import './App.css';

function App() {
    const {
        data,
        loading,
        addFolder,
        updateFolder,
        deleteFolder,
        addCommand,
        updateCommand,
        deleteCommand,
    } = useStorage();

    const [showAddFolder, setShowAddFolder] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    if (loading) {
        return (
            <div className="app loading">
                <div className="loader">
                    <div className="spinner"></div>
                    <span>DevCommand Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="header">
                <div className="header-top">
                    <div className="logo">
                        <div className="logo-icon-img">
                            <img src="/icons/48.png" alt="DevCommand" />
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="add-folder-btn-header" onClick={() => setShowAddFolder(true)}>
                            <span>+</span>  Add Folder
                        </button>
                        <button
                            className={`edit-mode-toggle ${isEditMode ? 'active' : ''}`}
                            onClick={() => setIsEditMode(!isEditMode)}
                            title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                        >
                            {isEditMode ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            )}
                            <span>{isEditMode ? 'Done' : 'Edit'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="main">
                <div className="folders">
                    {data.folders.length > 0 ? (
                        data.folders.map((folder) => (
                            <FolderCard
                                key={folder.id}
                                folder={folder}
                                isEditMode={isEditMode}
                                onUpdateFolder={updateFolder}
                                onDeleteFolder={deleteFolder}
                                onAddCommand={addCommand}
                                onUpdateCommand={updateCommand}
                                onDeleteCommand={deleteCommand}
                            />
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <p className="empty-title">No folders yet</p>
                            <p className="empty-hint">Create your first folder to organize your NPM commands</p>
                            <button className="add-folder-btn-empty" onClick={() => setShowAddFolder(true)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    <line x1="12" y1="11" x2="12" y2="17" />
                                    <line x1="9" y1="14" x2="15" y2="14" />
                                </svg>
                                <span>Add Folder</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <footer className="footer-note">
                <span className="note-label">Note:</span> To edit or add commands, click the <strong>Edit</strong> button. To change folder name, enable edit mode.
            </footer>

            {showAddFolder && (
                <AddFolderModal
                    onAdd={addFolder}
                    onClose={() => setShowAddFolder(false)}
                />
            )}
        </div>
    );
}

export default App;
