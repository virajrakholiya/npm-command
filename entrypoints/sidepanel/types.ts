export interface Command {
    id: string;
    command: string;
}

export interface Folder {
    id: string;
    name: string;
    icon: string;
    color: string;
    commands: Command[];
}

export interface AppData {
    folders: Folder[];
}
