import { AppError } from "../models/error/appError";

const path = require('path');
const fs = require('node:fs')

const basePath = path.dirname(process.execPath);
const storagePath = path.join(basePath, 'storage.json');

async function loadCfgFile() {
    try {
        return JSON.parse(await fs.readFileSync(storagePath, 'utf-8'))
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
        return data.Attendants.lenght;
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
        const result = data.Attendant.find((item: any) => item.id === id)
        return result
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