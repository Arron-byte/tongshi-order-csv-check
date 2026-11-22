# 会议行动项转任务表

**试单 260 元，最多 30 条。** 提供一份已确认的会议行动项清单或纪要。团队核对源编号、任务内容、负责人和到期日期，交付 UTF-8 任务表 CSV、带源行的核对清单和可复跑的规则，含一次范围内修正。材料和规则确认后，一个工作日内交首版。按约定用支付宝结算。[说明原文件形式和条目数](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/consult?source=github-meeting-pilot)

合并同编号且字段一致的重复行。同编号内容冲突和负责人或期限缺项在核对清单保留，待买方确认。不同编号即使文字相同也保留。交付在本地完成，若需要写入在线办公系统，可另行确认范围和访问方式。

## 示例

七条合成记录得出三条可用任务。另有一组重复、一组负责人冲突和一条待确认。相同输入两次运行输出逐字节一致。报告含每条记录的原行和保留的文本。[合成输入](synthetic-actions.json) · [任务表 CSV](sample-tasks.csv) · [核对清单](sample-report.json)

团队在处理前将已确认的文字与来源映射为 `sourceId`、`action`、`owner` 和 `due`。日期使用 `YYYY-MM-DD`，缺项用空值。在本目录用 Node.js 复跑。

```sh
node prepare.mjs synthetic-actions.json report
node prepare.mjs synthetic-actions.json csv
node --test prepare.test.mjs
```

## English pilot

**CNY 260 for up to 30 confirmed action items.** We turn one approved action list or meeting document into a UTF-8 task CSV and a source-row review report. Repeated identical IDs are grouped. Conflicting versions and missing owners or due dates go into the review report for confirmation. Includes the replayable rules and one revision. We deliver a first pass within one business day of agreeing on the brief and materials. [Describe your action list](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/consult?locale=en&source=github-meeting-pilot)
