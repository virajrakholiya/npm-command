import { useState, useEffect, useCallback } from 'react';
import { AppData, Category, Command } from '../types';

const DEFAULT_DATA: AppData = {
    categories: [
        {
            id: '1',
            name: 'Frontend',
            icon: '🎨',
            color: '#6366f1',
            commands: [
                { id: '1-1', name: 'Create React App', command: 'npx create-react-app my-app', description: 'Bootstrap a new React application' },
                { id: '1-2', name: 'Vite React', command: 'npm create vite@latest my-app -- --template react-ts', description: 'Create Vite + React + TypeScript project' },
                { id: '1-3', name: 'Tailwind CSS', command: 'npm install -D tailwindcss postcss autoprefixer', description: 'Install Tailwind CSS with PostCSS' },
            ],
        },
        {
            id: '2',
            name: 'Backend',
            icon: '⚡',
            color: '#10b981',
            commands: [
                { id: '2-1', name: 'Express Setup', command: 'npm install express cors dotenv', description: 'Essential Express.js packages' },
                { id: '2-2', name: 'Prisma Init', command: 'npx prisma init', description: 'Initialize Prisma ORM' },
                { id: '2-3', name: 'Mongoose', command: 'npm install mongoose', description: 'MongoDB ODM for Node.js' },
            ],
        },
        {
            id: '3',
            name: 'Testing',
            icon: '🧪',
            color: '#f59e0b',
            commands: [
                { id: '3-1', name: 'Jest', command: 'npm install -D jest @types/jest ts-jest', description: 'Jest testing framework with TypeScript' },
                { id: '3-2', name: 'Vitest', command: 'npm install -D vitest', description: 'Blazing fast unit test framework' },
                { id: '3-3', name: 'Cypress', command: 'npm install -D cypress', description: 'E2E testing framework' },
            ],
        },
    ],
};

const STORAGE_KEY = 'gemin_data';

export function useStorage() {
    const [data, setData] = useState<AppData>(DEFAULT_DATA);
    const [loading, setLoading] = useState(true);

    // Load data from storage
    useEffect(() => {
        const loadData = async () => {
            try {
                if (typeof chrome !== 'undefined' && chrome.storage) {
                    const result = await chrome.storage.local.get(STORAGE_KEY);
                    if (result[STORAGE_KEY]) {
                        setData(result[STORAGE_KEY]);
                    }
                } else {
                    // Fallback for development
                    const stored = localStorage.getItem(STORAGE_KEY);
                    if (stored) {
                        setData(JSON.parse(stored));
                    }
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Save data to storage
    const saveData = useCallback(async (newData: AppData) => {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.local.set({ [STORAGE_KEY]: newData });
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            }
            setData(newData);
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    }, []);

    // Category operations
    const addCategory = useCallback((category: Omit<Category, 'id' | 'commands'>) => {
        const newCategory: Category = {
            ...category,
            id: Date.now().toString(),
            commands: [],
        };
        saveData({ categories: [...data.categories, newCategory] });
    }, [data, saveData]);

    const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
        const newCategories = data.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
        );
        saveData({ categories: newCategories });
    }, [data, saveData]);

    const deleteCategory = useCallback((id: string) => {
        saveData({ categories: data.categories.filter((cat) => cat.id !== id) });
    }, [data, saveData]);

    // Command operations
    const addCommand = useCallback((categoryId: string, command: Omit<Command, 'id'>) => {
        const newCategories = data.categories.map((cat) => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    commands: [...cat.commands, { ...command, id: Date.now().toString() }],
                };
            }
            return cat;
        });
        saveData({ categories: newCategories });
    }, [data, saveData]);

    const updateCommand = useCallback((categoryId: string, commandId: string, updates: Partial<Command>) => {
        const newCategories = data.categories.map((cat) => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    commands: cat.commands.map((cmd) =>
                        cmd.id === commandId ? { ...cmd, ...updates } : cmd
                    ),
                };
            }
            return cat;
        });
        saveData({ categories: newCategories });
    }, [data, saveData]);

    const deleteCommand = useCallback((categoryId: string, commandId: string) => {
        const newCategories = data.categories.map((cat) => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    commands: cat.commands.filter((cmd) => cmd.id !== commandId),
                };
            }
            return cat;
        });
        saveData({ categories: newCategories });
    }, [data, saveData]);

    return {
        data,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        addCommand,
        updateCommand,
        deleteCommand,
    };
}
