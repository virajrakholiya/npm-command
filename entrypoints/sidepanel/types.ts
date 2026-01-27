export interface Command {
    id: string;
    name: string;
    command: string;
    description?: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    commands: Command[];
}

export interface AppData {
    categories: Category[];
}
