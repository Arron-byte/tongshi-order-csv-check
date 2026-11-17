# 同事AI 订单 CSV 自查

## 店铺订单表一次代查

¥49 核查一份店铺订单表，按确认的规则找出重复订单编号、缺失字段、金额或退款状态异常，交付带源行号的异常清单和核查报告。接收一份 CSV 或 Excel 的一个工作表，最多 500 行、20 列。样本、核查规则和到账确认后 24 小时内交付。

[提交一份脱敏订单表](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/?service=order-audit-once-v1&source=github-csv-guide#inquiry) · [查看交付样例](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/?source=github-csv-guide#sample)

[Medusa 商家订单导出核查样例](examples/medusa/)

[打开免费自查工具](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/tools/order-csv-check?source=github-csv-guide) · [¥19.90 本机核查技能](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/skills/order-audit?source=github-csv-guide#purchase)

## English quick start

Open the offline HTML in a browser. Choose a CSV with one order per row, select the order ID and amount columns, then run the check. The file is processed locally and the findings CSV includes the source line number for each flagged row. [Download the offline HTML](https://github.com/Arron-byte/tongshi-order-csv-check/releases/download/offline-v0.1.2/tongshi-order-csv-check.html)

A one-sheet order audit costs CNY 49, payable by Alipay. Send a redacted CSV or one visible Excel worksheet with up to 500 data rows and 20 columns, one order per row and one currency. You receive a cleaned table, an exception list with source row numbers and an audit report within 24 hours after we confirm the sample, audit rules and payment. [Request an audit (Chinese form)](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/?service=order-audit-once-v1&source=github-csv-guide#inquiry) or [view the Medusa example](examples/medusa/).

The local CSV/XLSX audit package adds configurable refund-status checks, a review report and an independent verification script. It costs CNY 19.90 once and is payable by Alipay. [English buying guide and sample results](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/skills/order-audit?source=github-csv-guide#english-buying-guide)

核对店铺导出的 CSV 订单表时，可以在浏览器里找出重复订单编号、缺失编号和空金额。文件在当前浏览器中处理，可下载带源行号的异常清单。

1. 用页面的「试用样表」体验，或选择带标题行、逗号分隔的 CSV 文件。Excel 工作簿可先将要核对的工作表另存为 CSV UTF-8。[下载合成样例](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/sample.csv)
2. 选择订单编号列和订单金额列，点击「核查」。单次最多 2,000 条记录、50 列和 5 MB。
3. 查看异常后点击「下载异常清单 CSV」。编号重复的每条记录会保留所在行，方便回原表逐项核对。

## 离线自查

[下载单文件离线版](https://github.com/Arron-byte/tongshi-order-csv-check/releases/download/offline-v0.1.2/tongshi-order-csv-check.html)，保存后双击打开，在浏览器里离线核查并下载异常清单。结果区可联网打开 ¥49 一次代查表单或 ¥19.90 技能买断入口。

## 在 Agent 中使用

安装 Node.js 和 npm 后，在项目目录运行以下命令。

```shell
npx skills add Arron-byte/tongshi-order-csv-check --skill tongshi-order-csv-check --agent codex gemini-cli --copy
```

安装后，在浏览器打开 `.agents/skills/tongshi-order-csv-check/assets/tongshi-order-csv-check.html`。可在断网状态选表、核查并导出异常清单。用 Agent 解释结果时，可先查看[技能说明](SKILL.md)，再提供所需的脱敏异常清单。

[下载订单 CSV 自查技能包](https://github.com/Arron-byte/tongshi-order-csv-check/releases/download/offline-v0.1.2/tongshi-order-csv-check-v0.1.2.zip)

## 自助核查 Excel 和退款状态

订单台账核查技能可在本机按确认的字段、金额和退款规则运行，生成整理表、带源行号的异常清单及 HTML 报告。每批处理一个 CSV 或 Excel 可见表，最多 2,000 行。技能包含处理与核验脚本、规则模板和样表，需要 Python 3.12 或兼容版本。一次买断 ¥19.90。[查看技能包并下单](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/skills/order-audit)

## 付费核查交付样例

可在确认范围时选择 Excel 工作簿。以下样例由 4 条合成订单生成，包含可筛选的「订单整理」和「待核对」两张表，便于按原表行号复查。

[下载 Excel 交付样例](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/sample/order-review.xlsx?source=github-csv-guide)

需要团队代查一份表时，可以先提交脱敏样本。一次代查 ¥49，接收一份 CSV 或一个可见 Excel 工作表，最多 500 行、20 列。材料、规则和到账确认后 24 小时内交付。

需要在 7 天内按同一套规则核查两批时，可选 ¥299 的两批服务。[提交两批代查需求](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/?source=github-csv-guide#inquiry)

## 工具目录

[![查看 NoLoginTools 审核进度](https://nologin.tools/badges/flat.svg)](https://nologin.tools/badge/sqtlow7jjmgjdgncr4fhmf7pki-srv-us-tools-order-csv-check "Verified by NoLoginTools.org")

[一页工具](https://www.gitd.cn/)可查找其他免登录的文本处理和表格小工具。
