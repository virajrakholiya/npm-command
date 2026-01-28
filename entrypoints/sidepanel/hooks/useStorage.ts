import { useState, useEffect, useCallback } from 'react';
import { AppData, Folder, Command } from '../types';

const DEFAULT_DATA: AppData = {
    folders: [],
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
                        setData(result[STORAGE_KEY] as AppData);
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

    // Folder operations
    const addFolder = useCallback((folder: Omit<Folder, 'id' | 'commands'>) => {
        const newFolder: Folder = {
            ...folder,
            id: Date.now().toString(),
            commands: [],
        };
        saveData({ folders: [...data.folders, newFolder] });
    }, [data.folders, saveData]);

    const updateFolder = useCallback((id: string, updates: Partial<Folder>) => {
        const newFolders = data.folders.map((f) =>
            f.id === id ? { ...f, ...updates } : f
        );
        saveData({ folders: newFolders });
    }, [data.folders, saveData]);

    const deleteFolder = useCallback((id: string) => {
        saveData({ folders: data.folders.filter((f) => f.id !== id) });
    }, [data.folders, saveData]);

    // Command operations
    const addCommand = useCallback((folderId: string, command: Omit<Command, 'id'>) => {
        const newFolders = data.folders.map((f) => {
            if (f.id === folderId) {
                return {
                    ...f,
                    commands: [...f.commands, { ...command, id: Date.now().toString() }],
                };
            }
            return f;
        });
        saveData({ folders: newFolders });
    }, [data.folders, saveData]);

    const updateCommand = useCallback((folderId: string, commandId: string, updates: Partial<Command>) => {
        const newFolders = data.folders.map((f) => {
            if (f.id === folderId) {
                return {
                    ...f,
                    commands: f.commands.map((cmd) =>
                        cmd.id === commandId ? { ...cmd, ...updates } : cmd
                    ),
                };
            }
            return f;
        });
        saveData({ folders: newFolders });
    }, [data.folders, saveData]);

    const deleteCommand = useCallback((folderId: string, commandId: string) => {
        const newFolders = data.folders.map((f) => {
            if (f.id === folderId) {
                return {
                    ...f,
                    commands: f.commands.filter((cmd) => cmd.id !== commandId),
                };
            }
            return f;
        });
        saveData({ folders: newFolders });
    }, [data.folders, saveData]);

    return {
        data,
        loading,
        addFolder,
        updateFolder,
        deleteFolder,
        addCommand,
        updateCommand,
        deleteCommand,
    };
}
