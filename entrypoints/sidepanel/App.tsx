import { useState } from 'react';
import { useStorage } from './hooks/useStorage';
import CategoryCard from './components/CategoryCard';
import AddCategoryModal from './components/AddCategoryModal';
import './App.css';

function App() {
    const {
        data,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        addCommand,
        updateCommand,
        deleteCommand,
    } = useStorage();

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = data.categories.filter((category) => {
        const matchesCategory = category.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCommand = category.commands.some(
            (cmd) =>
                cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cmd.command.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesCategory || matchesCommand;
    });

    if (loading) {
        return (
            <div className="app loading">
                <div className="loader">
                    <div className="spinner"></div>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="header">
                <div className="logo">
                    <div className="logo-icon">G</div>
                    <h1>Gemin</h1>
                </div>
                <p className="tagline">NPM Command Manager</p>
            </header>

            <div className="search-container">
                <div className="search-box">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search commands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button className="clear-search" onClick={() => setSearchQuery('')}>
                            ×
                        </button>
                    )}
                </div>
            </div>

            <main className="main">
                <div className="categories">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onUpdateCategory={updateCategory}
                                onDeleteCategory={deleteCategory}
                                onAddCommand={addCommand}
                                onUpdateCommand={updateCommand}
                                onDeleteCommand={deleteCommand}
                            />
                        ))
                    ) : (
                        <div className="empty-state">
                            {searchQuery ? (
                                <>
                                    <div className="empty-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.3-4.3" />
                                        </svg>
                                    </div>
                                    <p>No commands found for "{searchQuery}"</p>
                                </>
                            ) : (
                                <>
                                    <div className="empty-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                        </svg>
                                    </div>
                                    <p>No categories yet</p>
                                    <p className="empty-hint">Create your first category to get started</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <button className="add-category-btn" onClick={() => setShowAddCategory(true)}>
                    <span>+</span> Add Category
                </button>
            </main>

            <footer className="footer">
                <span>Click a category to expand • Copy commands with one click</span>
            </footer>

            {showAddCategory && (
                <AddCategoryModal
                    onAdd={addCategory}
                    onClose={() => setShowAddCategory(false)}
                />
            )}
        </div>
    );
}

export default App;
