# 同事AI 订单 CSV 自查

[打开自查工具](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/tools/order-csv-check?source=github-csv-guide) · [下载合成样例](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/sample.csv)

核对店铺导出的 CSV 订单表时，可以在浏览器里找出重复订单编号、缺失编号和空金额。文件在当前浏览器中处理，可下载带源行号的异常清单。

1. 用页面的「试用样表」体验，或选择带标题行、逗号分隔的 CSV 文件。Excel 工作簿可先将要核对的工作表另存为 CSV UTF-8。
2. 选择订单编号列和订单金额列，点击「核查」。单次最多 2,000 条记录、50 列和 5 MB。
3. 查看异常后点击「下载异常清单 CSV」。编号重复的每条记录会保留所在行，方便回原表逐项核对。

## 离线自查

[下载单文件离线版](https://github.com/Arron-byte/tongshi-order-csv-check/releases/download/offline-v0.1.0/tongshi-order-csv-check.html)，保存后双击打开，在浏览器里离线核查并下载异常清单。页面内有合成样表，也可联网打开正式接单页。

## 自助核查 Excel 和退款状态

订单台账核查技能可在本机按确认的字段、金额和退款规则运行，生成整理表、带源行号的异常清单及 HTML 报告。每批处理一个 CSV 或 Excel 可见表，最多 2,000 行。技能包含处理与核验脚本、规则模板和样表，需要 Python 3.12 或兼容版本。一次买断 ¥19.90。[查看技能包并下单](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/skills/order-audit)

## 付费核查交付样例

可在确认范围时选择 Excel 工作簿。以下样例由 4 条合成订单生成，包含可筛选的「订单整理」和「待核对」两张表，便于按原表行号复查。

[下载 Excel 交付样例](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/sample/order-review.xlsx?source=github-csv-guide)

如需按店铺的退款、金额和订单状态规则核查，可先提交脱敏样本。当前服务为 7 天内核查两批，价格 ¥299。[查看服务并提交需求](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/?source=github-csv-guide#inquiry)

## 工具目录

[![查看 NoLoginTools 审核进度](https://nologin.tools/badges/flat.svg)](https://nologin.tools/badge/sqtlow7jjmgjdgncr4fhmf7pki-srv-us-tools-order-csv-check "Verified by NoLoginTools.org")

[一页工具](https://www.gitd.cn/)可查找其他免登录的文本处理和表格小工具。
