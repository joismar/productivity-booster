import electron from 'electron';
import * as fs from 'fs';
import * as path from 'path';

class StoreManager {
    private storePath: string;

    constructor(
        fileName: string, 
        defaultData: object = {
            tasks: [],
        }
    ) {
        const userDataPath = electron.app.getPath('documents');
        this.storePath = path.join(userDataPath, 'PBData', fileName);

        if (!fs.existsSync(this.storePath)) {
            const dirPath = path.dirname(this.storePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            fs.writeFileSync(this.storePath, JSON.stringify(defaultData));
        }
    }

    get(key: string): any {
        const data = JSON.parse(fs.readFileSync(this.storePath, 'utf-8'));
        return data[key];
    }

    set(key: string, value: any): void {
        const data = JSON.parse(fs.readFileSync(this.storePath, 'utf-8'));
        data[key] = value;
        fs.writeFileSync(this.storePath, JSON.stringify(data, null, 2));
    }

    delete(key: string): void {
        const data = JSON.parse(fs.readFileSync(this.storePath, 'utf-8'));
        delete data[key];
        fs.writeFileSync(this.storePath, JSON.stringify(data, null, 2));
    }
}

export default StoreManager;