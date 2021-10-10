const persistentStorage: any = {
    get(key: string, d: any): any {
        try {
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            }
            return d ;
        }
        catch {
            return d;
        }
    },
    set(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    },
}

export default persistentStorage;
