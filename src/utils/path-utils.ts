import { resolve } from 'path';

export const projectDirectory = process.cwd();
export const projectPackageJson = resolve(projectDirectory, 'package.json');
export const resolveProjectPath = (path: string) => resolve(path);
