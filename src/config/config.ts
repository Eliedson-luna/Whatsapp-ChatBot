import { AppError } from "../models/error/appError";

const path = require('path');
const fs = require('node:fs')

type AttendantType = {
    id: number,
    name: string,
    number: string,
    method: string,
    kewords: string
}

type Storage = {
    Attendants: [AttendantType]
}

const basePath = path.dirname(process.execPath);
const storagePath = path.join(basePath, 'storage.json');

const codePath = path.join(process.cwd(), 'src', 'data', 'storage.json');

const templateJson = {
    "Attendants": [
        {
            "id": 0,
            "name": "exemple",
            "number": "cell Number with Country Code@c.us",
            "method": "sendLink Or notifyAttendant",
            "keywords": [
                "Key words to use in menu"
            ]
        }
    ]
};

async function loadCfgFile(): Promise<Storage> {
    try {
        if (!fs.existsSync(storagePath)) {

            await fs.promises.writeFile(
                storagePath,
                JSON.stringify(templateJson, null, 4),
                'utf-8'
            );
        } 
        const fileContent = await fs.promises.readFile(storagePath, 'utf-8');
        return JSON.parse(fileContent);
        // if (!fs.existsSync(codePath)) {

        //     await fs.promises.writeFile(
        //         codePath,
        //         JSON.stringify(templateJson, null, 4),
        //         'utf-8'
        //     );
        // }
        // const fileContent = await fs.promises.readFile(codePath, 'utf-8');
        // return JSON.parse(fileContent);
    } catch (error) {
        if (error instanceof Error) {
            throw new AppError('Config.cfg.loadCfgFile()', error);
        }
        else {
            throw new Error("Erro desconhecido ao carregar arquivo de dados: storage.json")
        }
    }
}

export async function allAttendants() {
    try {
        const data = await loadCfgFile();
        return data.Attendants;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else if (error instanceof Error) {
            throw new AppError('Config.cfg.allAttendants()', error);
        } else {
            throw new Error("Erro desconhecido ao carregar atendentes");
        }
    }
}

export async function totalAttendants() {
    try {
        const data = await loadCfgFile();
        return data.Attendants.length;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else if (error instanceof Error) {
            throw new AppError('Config.cfg.totalAttendants()', error);
        } else {
            throw new Error("Erro desconhecido ao contar atendentes");
        }
    }
}

export async function getAttendant(id: number) {
    try {
        const data = await loadCfgFile();
        const result = data.Attendants.find((item: any) => item.id === id)
        return result
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else if (error instanceof Error) {
            throw new AppError('Config.cfg.getAttendant()', error);
        } else {
            throw new Error("Erro desconhecido ao ler atendente");
        }
    }
}

export async function getCellNumber(id: number) {
    try {
        const data = await loadCfgFile();
        const result = data.Attendants.find((item: any) => item.id === id)
        if (!result) { throw new Error("nao foi encontrado atendente") }
        return result.number
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else if (error instanceof Error) {
            throw new AppError('Config.cfg.totalAttendants()', error);
        } else {
            throw new Error("Erro desconhecido ao ler atendente");
        }
    }
}

export async function getAttendantName(id: number) {
    try {
        const data = await loadCfgFile();
        const result = data.Attendants.find((item: any) => item.id === id)
        if (!result) { throw new Error("nao foi encontrado atendente") }
        return result.name
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else if (error instanceof Error) {
            throw new AppError('Config.cfg.getAttendantName()', error);
        } else {
            throw new Error("Erro desconhecido ao ler atendente");
        }
    }
}

export async function getAttendantMethod(id: number) {
    try {
        const data = await loadCfgFile();
        const result = data.Attendants.find((item: any) => item.id === id)
        if (!result) { throw new Error("nao foi encontrado atendente") }
        return result.method
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else if (error instanceof Error) {
            throw new AppError('Config.cfg.getAttendantMethod()', error);
        } else {
            throw new Error("Erro desconhecido ao ler atendente");
        }
    }
}