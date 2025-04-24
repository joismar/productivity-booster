import electron from 'electron';
import * as fs from 'fs';
import * as path from 'path';

class StoreManager {
    private storePath: string;

    constructor(fileName: string) {
        const userDataPath = electron.app.getPath('documents');
        this.storePath = path.join(userDataPath, fileName);

        if (!fs.existsSync(this.storePath)) {
            fs.writeFileSync(this.storePath, JSON.stringify({}));
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