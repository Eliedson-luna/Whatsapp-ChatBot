// ChromiumManager.ts
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { execSync } from 'child_process';

export class ChromiumManager {
    private static chromiumPath: string = '';
    
    // Método principal para garantir que o Chromium existe
    static async ensureChromium(): Promise<string> {
        // Diretório onde ficará o Chromium
        
        const basePath = path.dirname(process.execPath);
        const codePath = path.join(process.cwd(), 'dist');
        const chromiumDir = path.join(codePath, 'chromium');
        
        // Caminhos possíveis do executável dependendo da extração
        const possibleExePaths = [
            path.join(chromiumDir, 'chrome.exe'),
            path.join(chromiumDir, 'chrome-win', 'chrome.exe'),
            path.join(chromiumDir, 'chrome-win64', 'chrome.exe'),
            path.join(chromiumDir, 'Google Chrome for Testing.exe'),
        
            // Caminhos padrão do sistema
            // Windows
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        
            // macOS
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        
            // Linux (comum em distros baseadas em Debian, RedHat, etc.)
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
        ];

        // Verifica se já existe algum executável
        for (const exePath of possibleExePaths) {
            if (fs.existsSync(exePath)) {
                console.log(`✅ Chromium encontrado em: ${exePath}`);
                this.chromiumPath = exePath;
                return exePath;
            }
        }

        console.log('📥 Chromium não encontrado. Baixando...');
        
        try {
            // Cria diretório se não existir
            if (!fs.existsSync(chromiumDir)) {
                fs.mkdirSync(chromiumDir, { recursive: true });
            }

            // Baixa e extrai o Chromium
            const chromiumExe = await this.downloadAndExtractChromium(chromiumDir);
            this.chromiumPath = chromiumExe;
            
            console.log(`✅ Chromium baixado e configurado em: ${chromiumExe}`);
            return chromiumExe;
            
        } catch (error) {
            console.error('❌ Erro ao configurar Chromium:', error);
            throw new Error(`Falha ao baixar Chromium: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    private static async downloadAndExtractChromium(chromiumDir: string): Promise<string> {
        // URLs para diferentes plataformas
        const platform = process.platform;
        let downloadUrl: string;
        let expectedExePath: string;

        switch (platform) {
            case 'win32':
                // URL para Windows 64-bit do Google Chrome for Testing
                downloadUrl = 'https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/119.0.6045.105/win64/chrome-win64.zip';
                expectedExePath = path.join(chromiumDir, 'chrome-win64', 'chrome.exe');
                break;
            case 'linux':
                downloadUrl = 'https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/119.0.6045.105/linux64/chrome-linux64.zip';
                expectedExePath = path.join(chromiumDir, 'chrome-linux64', 'chrome');
                break;
            case 'darwin':
                downloadUrl = 'https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/119.0.6045.105/mac-x64/chrome-mac-x64.zip';
                expectedExePath = path.join(chromiumDir, 'chrome-mac-x64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing');
                break;
            default:
                throw new Error(`Plataforma não suportada: ${platform}`);
        }

        const zipPath = path.join(chromiumDir, 'chromium.zip');

        try {
            // Baixa o arquivo
            console.log('📥 Baixando Chromium...');
            await this.downloadFile(downloadUrl, zipPath);
            
            // Extrai usando unzip (Windows) ou unzip (Linux/Mac)
            console.log('📦 Extraindo Chromium...');
            await this.extractZip(zipPath, chromiumDir);
            
            // Remove o arquivo zip
            fs.unlinkSync(zipPath);
            
            // Verifica se o executável foi extraído corretamente
            if (fs.existsSync(expectedExePath)) {
                // No Linux/Mac, torna executável
                if (platform !== 'win32') {
                    execSync(`chmod +x "${expectedExePath}"`);
                }
                return expectedExePath;
            } else {
                throw new Error(`Executável não encontrado após extração: ${expectedExePath}`);
            }
            
        } catch (error) {
            // Limpa arquivos em caso de erro
            if (fs.existsSync(zipPath)) {
                fs.unlinkSync(zipPath);
            }
            throw error;
        }
    }

    private static downloadFile(url: string, destination: string): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log(`📥 Baixando de: ${url}`);
            
            const file = fs.createWriteStream(destination);
            const request = https.get(url, (response) => {
                // Segue redirects
                if (response.statusCode === 302 || response.statusCode === 301) {
                    return https.get(response.headers.location!, (redirectResponse) => {
                        const totalSize = parseInt(redirectResponse.headers['content-length'] || '0');
                        let downloadedSize = 0;

                        redirectResponse.on('data', (chunk) => {
                            downloadedSize += chunk.length;
                            const progress = ((downloadedSize / totalSize) * 100).toFixed(1);
                            process.stdout.write(`\r📥 Progresso: ${progress}%`);
                        });

                        redirectResponse.pipe(file);
                        file.on('finish', () => {
                            file.close();
                            console.log('\n✅ Download concluído');
                            resolve();
                        });
                    }).on('error', reject);
                }

                const totalSize = parseInt(response.headers['content-length'] || '0');
                let downloadedSize = 0;

                response.on('data', (chunk) => {
                    downloadedSize += chunk.length;
                    if (totalSize > 0) {
                        const progress = ((downloadedSize / totalSize) * 100).toFixed(1);
                        process.stdout.write(`\r📥 Progresso: ${progress}%`);
                    }
                });

                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log('\n✅ Download concluído');
                    resolve();
                });
            });

            request.on('error', (error) => {
                fs.unlinkSync(destination);
                reject(error);
            });
        });
    }

    private static extractZip(zipPath: string, extractPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (process.platform === 'win32') {
                    // Windows - usando PowerShell
                    const command = `powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractPath}' -Force"`;
                    execSync(command, { stdio: 'pipe' });
                } else {
                    // Linux/Mac - usando unzip
                    execSync(`unzip -q "${zipPath}" -d "${extractPath}"`, { stdio: 'pipe' });
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    // Método para obter o caminho atual (se já foi configurado)
    static getChromiumPath(): string {
        return this.chromiumPath;
    }

    // Método para verificar se o Chromium está disponível
    static isChromiumAvailable(): boolean {
        return this.chromiumPath !== '' && fs.existsSync(this.chromiumPath);
    }
}