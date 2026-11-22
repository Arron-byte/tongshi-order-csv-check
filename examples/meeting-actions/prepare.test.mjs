import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {prepareActions} from './prepare.mjs';

const fixture = JSON.parse(await readFile(new URL('./synthetic-actions.json', import.meta.url), 'utf8'));

test('keeps source rows and only exports confirmed, unambiguous tasks', () => {
  const {report, csv} = prepareActions(fixture);
  assert.equal(report.inputRows, 7);
  assert.deepEqual(report.tasks.map(task => [task.sourceId, task.sourceRows]), [
    ['M01-01', [1, 2]], ['M01-03', [5]], ['M01-04', [6]],
  ]);
  assert.deepEqual(report.duplicates, [{sourceId: 'M01-01', sourceRows: [1, 2]}]);
  assert.deepEqual(report.conflicts[0].entries.map(entry => entry.sourceRow), [3, 4]);
  assert.deepEqual(report.incomplete[0].missing, ['owner', 'due']);
  assert.ok(csv.startsWith('\uFEFFsourceId,action,owner,due\r\n'));
  assert.match(csv, /"M01-03"[^\r\n]+\r\n"M01-04"/u);
  assert.doesNotMatch(csv, /M01-0[25]/);
  assert.deepEqual(prepareActions(fixture), {report, csv});
});

test('preserves approved wording while exporting safe spreadsheet text', () => {
  const item = {...fixture[0], action: '  =文字,"原样"\n第二行  '};
  const {report, csv} = prepareActions([item]);
  assert.equal(report.tasks[0].action, item.action);
  assert.ok(csv.includes('"\'  =文字,""原样""\n第二行  "'));
  assert.deepEqual(prepareActions([{...item, owner: '  '}]).report.incomplete[0].missing, ['owner']);
});

test('rejects malformed action rows and impossible dates', () => {
  assert.throws(() => prepareActions([null]), /Row 1/);
  assert.throws(() => prepareActions([{...fixture[0], sourceId: ''}]), /sourceId/);
  assert.throws(() => prepareActions([{...fixture[0], due: '2026-11-31'}]), /valid YYYY-MM-DD/);
});
