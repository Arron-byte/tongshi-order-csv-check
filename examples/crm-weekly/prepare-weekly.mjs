import { readFile } from 'node:fs/promises';

const day = 86_400_000;
const statuses = new Map([
  ['done', '已完成'],
  ['working', '进行中'],
  ['waiting_customer', '待客户反馈'],
]);

function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : NaN;
}

function asText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cell(value) {
  return value.replace(/[\r\n]+/g, ' ').replace(/[&<>|]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '|': '&#124;',
  }[character]));
}

function prepare({ weekStart, records }) {
  const start = parseDate(weekStart);
  if (!Number.isFinite(start) || new Date(start).getUTCDay() !== 1 || !Array.isArray(records)) {
    throw new Error('需要周一日期和结构化 CRM 记录列表。');
  }

  const groups = new Map();
  const review = [];
  const excluded = [];
  for (const [index, item] of records.entries()) {
    const sourceRow = index + 1;
    const sourceId = asText(item?.sourceId);
    const date = asText(item?.date);
    const timestamp = parseDate(date);
    if (!Number.isFinite(timestamp) || !sourceId) {
      review.push({ sourceId, sourceRows: [sourceRow], reason: '记录编号或日期无效' });
      continue;
    }
    if (timestamp < start || timestamp >= start + 7 * day) {
      excluded.push({ sourceId, sourceRow, date });
      continue;
    }
    const record = {
      sourceId, sourceRow, date, owner: asText(item.owner), text: asText(item.text),
      status: asText(item.status), due: asText(item.due),
    };
    const group = groups.get(sourceId) ?? [];
    group.push(record);
    groups.set(sourceId, group);
  }

  const items = [];
  const duplicates = [];
  for (const [sourceId, group] of groups) {
    const first = group[0];
    const sourceRows = group.map(record => record.sourceRow);
    const equal = group.every(record => ['date', 'owner', 'text', 'status', 'due'].every(
      key => record[key] === first[key],
    ));
    if (!equal) {
      review.push({ sourceId, sourceRows, reason: '同一编号存在冲突' });
      continue;
    }
    if (!first.owner || !first.text || !statuses.has(first.status) || (first.due && !Number.isFinite(parseDate(first.due)))) {
      review.push({ sourceId, sourceRows, reason: '负责人、摘要、状态或期限需核对' });
      continue;
    }
    if (group.length > 1) duplicates.push({ sourceId, sourceRows });
    const { sourceRow, ...item } = first;
    items.push({ ...item, sourceRows });
  }

  return {
    weekStart, weekEnd: new Date(start + 6 * day).toISOString().slice(0, 10),
    sourceRecordCount: records.length, items, duplicates, review, excluded,
  };
}

function toMarkdown(result) {
  const lines = [
    `# ${result.weekStart} 至 ${result.weekEnd} CRM 周报草稿`, '',
    `读取 ${result.sourceRecordCount} 条合成记录，汇入周报 ${result.items.length} 条，待复核 ${result.review.length} 组。`,
  ];
  for (const [status, label] of statuses) {
    const items = result.items.filter(item => item.status === status);
    lines.push('', `## ${label}`, '', '| 编号 | 事项 | 负责人 | 期限 | 源记录序号 |', '| --- | --- | --- | --- | --- |');
    for (const item of items) {
      lines.push(`| ${[item.sourceId, item.text, item.owner, item.due || '待约定', item.sourceRows.join('、')].map(cell).join(' | ')} |`);
    }
  }
  lines.push('', '## 待复核', '');
  for (const item of result.review) {
    lines.push(`- ${cell(item.sourceId || '缺少编号')} · 源记录 ${item.sourceRows.join('、')} · ${item.reason}`);
  }
  lines.push('', '## 归并与范围', '');
  for (const item of result.duplicates) {
    lines.push(`- ${cell(item.sourceId)} · 源记录 ${item.sourceRows.join('、')} 内容一致，归并到一条。`);
  }
  for (const item of result.excluded) {
    lines.push(`- ${cell(item.sourceId)} · 源记录 ${item.sourceRow} 日期为 ${item.date}，属于其他周。`);
  }
  lines.push('', '这份草稿由人工复核后使用。', '');
  return lines.join('\n');
}

const [, , sourcePath, format = 'markdown'] = process.argv;
if (!sourcePath || !['markdown', 'json'].includes(format)) {
  throw new Error('用法为 node prepare-weekly.mjs <记录.json> [markdown|json]');
}
const result = prepare(JSON.parse(await readFile(sourcePath, 'utf8')));
process.stdout.write(format === 'json' ? JSON.stringify(result, null, 2) + '\n' : toMarkdown(result));
