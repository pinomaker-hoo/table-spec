import type { BuilderTable, BuilderRelationship } from '../types';

export interface TableSpecProject {
  version: 1;
  tables: BuilderTable[];
  relationships: BuilderRelationship[];
}

export function serializeProject(tables: BuilderTable[], relationships: BuilderRelationship[]): string {
  const project: TableSpecProject = {
    version: 1,
    tables,
    relationships,
  };
  return JSON.stringify(project, null, 2);
}

export function deserializeProject(json: string): { tables: BuilderTable[]; relationships: BuilderRelationship[] } {
  const project = JSON.parse(json) as TableSpecProject;
  if (!project.tables || !Array.isArray(project.tables)) {
    throw new Error('Invalid project file: missing tables');
  }
  return {
    tables: project.tables,
    relationships: project.relationships || [],
  };
}
