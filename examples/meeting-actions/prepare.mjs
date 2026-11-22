import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

const fields = ['sourceId', 'action', 'owner', 'due'];

function text(value, field, row, required = false) {
  if (!required && value == null) return '';
  if (typeof value !== 'string' || (required && !value.trim())) {
    throw new Error(`Row ${row} requires ${field} as ${required ? 'nonempty text' : 'text'}.`);
  }
  return value;
}

function normalize(item, row) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error(`Row ${row} must be an action item object.`);
  }
  const task = {
    sourceId: text(item.sourceId, 'sourceId', row, true).trim(),
    action: text(item.action, 'action', row, true),
    owner: text(item.owner, 'owner', row),
    due: text(item.due, 'due', row).trim(),
  };
  if (task.due) {
    const date = new Date(task.due + 'T00:00:00Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(task.due) || !Number.isFinite(date.valueOf()) ||
        date.toISOString().slice(0, 10) !== task.due) {
      throw new Error(`Row ${row} due must be a valid YYYY-MM-DD date or empty.`);
    }
  }
  return task;
}

function csvCell(value) {
  const safe = /^[=+@-]/.test(value.trimStart()) ? "'" + value : value;
  return '"' + safe.replaceAll('"', '""') + '"';
}

export function prepareActions(items) {
  if (!Array.isArray(items)) throw new Error('Input must be an array of confirmed action items.');
  const byId = new Map();
  for (const [index, item] of items.entries()) {
    const sourceRow = index + 1;
    const task = normalize(item, sourceRow);
    const entries = byId.get(task.sourceId) ?? [];
    entries.push({sourceRow, task});
    byId.set(task.sourceId, entries);
  }

  const tasks = [];
  const duplicates = [];
  const conflicts = [];
  const incomplete = [];
  for (const [sourceId, entries] of byId) {
    const {task} = entries[0];
    const sourceRows = entries.map(entry => entry.sourceRow);
    if (entries.some(entry => fields.some(field => entry.task[field] !== task[field]))) {
      conflicts.push({sourceId, entries});
      continue;
    }
    if (sourceRows.length > 1) duplicates.push({sourceId, sourceRows});
    const missing = ['owner', 'due'].filter(field => !task[field].trim());
    if (missing.length) {
      incomplete.push({task, sourceRows, missing});
    } else {
      tasks.push({...task, sourceRows});
    }
  }

  const rows = tasks.map(task => fields.map(field => csvCell(task[field])).join(','));
  return {report: {inputRows: items.length, tasks, duplicates, conflicts, incomplete},
    csv: '\uFEFF' + [fields.join(','), ...rows].join('\r\n') + '\r\n'};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [filename, format = 'report', ...additional] = process.argv.slice(2);
  if (!filename || !['report', 'csv'].includes(format) || additional.length) {
    throw new Error('Usage: node prepare.mjs confirmed-actions.json [report|csv]');
  }
  const source = (await readFile(filename, 'utf8')).replace(/^\uFEFF/, '');
  const {report, csv} = prepareActions(JSON.parse(source));
  process.stdout.write(format === 'csv' ? csv : JSON.stringify(report, null, 2) + '\n');
}
