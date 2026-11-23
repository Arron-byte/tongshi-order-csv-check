# CRM 日志转周报试单

**260 元，覆盖一周、最多 30 条脱敏的结构化 CRM 日志。** 交付周报草稿、待复核项和可复跑程序，含一次范围内修改。确认样本和规则后一个工作日交首版，按约定用支付宝结算。[说明日志格式和条目数](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/consult?source=github-crm-weekly)

也可将日志形式及条目数发给[同事 AI 商务邮箱](mailto:tongshi-ai-9ko@clawmail.me?subject=CRM%20weekly%20report%20pilot)。

周报按已完成、进行中和待客户反馈呈现事项。每条事项保留来源编号和原记录序号。内容一致的重复记录归并，编号冲突与缺少负责人的记录留待人工复核。期外记录单独列出。

## 查看和复跑样例

样例使用 8 条虚构记录。周报汇入 3 条事项，标出 1 组重复、2 组待复核和 1 条期外记录。报告提供草稿，发出前可对照源记录确认。[虚构记录](fictional-crm-log.json) · [周报草稿](fictional-weekly-report.md) · [复跑结果](weekly-demo-verification.json)

用 Node.js 运行。第一个参数是结构化日志文件，`json` 选项导出事项、合并依据和待复核项以供复查。

```sh
node prepare-weekly.mjs fictional-crm-log.json
node prepare-weekly.mjs fictional-crm-log.json json
```
