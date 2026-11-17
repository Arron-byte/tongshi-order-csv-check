# 从 Medusa 导出订单后做单表核查

在 Medusa Admin 的 Orders 页面选择所需范围，再导出 CSV。核查副本只保留 `Order_ID`、`Total`、`Payment Status` 和 `Currency Code`。客户姓名、邮箱、地址和内部客户编号留在本地原件中。按币种拆表，并把副本的币种代码统一成大写，例如 `usd` 改为 `USD`。保留订单编号原样并按文本导入。一行对应一笔订单。 [Medusa 导出说明](https://docs.medusajs.com/user-guide/orders/export) · [v2.22.7 导出字段](https://github.com/medusajs/medusa/blob/v2.22.7/packages/core/core-flows/src/order/steps/export-orders.ts#L28)

下表使用 6 行合成数据，行号包含表头。在免费自查工具里选择合成 CSV、`Order_ID` 和 `Total`，可得到第 3 和 4 行的重复编号及第 6 行的缺金额。带业务规则的台账核查还会检查第 5 和 7 行。 [免费自查工具](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/tools/order-csv-check?source=github-csv-guide)

| 原行号 | 核查结果 |
| --- | --- |
| 3、4 | 同一订单出现两次，保留两行供核对 |
| 5 | `partially_refunded` 需要复核，保留原状态 |
| 6 | `Total` 缺失 |
| 7 | `EUR` 混入 `USD` 表，单独列出 |

样例规则已确认 `captured` 行按未退款处理。实际订单请按自己的支付和退款口径确认。`Total` 的汇总口径是原订单金额。支付到账、净收入和退款金额需要其他记录核对。 [合成 CSV](orders.redacted.csv) · [本次样例规则](rules.example.json)

## 一次代查 ¥49

可先提交一份脱敏样本。服务覆盖一个 CSV 或 Excel 可见工作表，最多 500 行、20 列。样本、规则和支付宝到账确认后 24 小时内交付可编辑的异常清单和核查报告，待复核项附原行号。 [提交代查需求](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/?service=order-audit-once-v1&source=github-csv-guide#inquiry)

## English quick start

From Medusa Admin, export orders and copy only `Order_ID`, `Total`, `Payment Status`, and `Currency Code` into your review file. Use a single currency per file and normalize the currency code to uppercase. Open the synthetic CSV in the local checker and select `Order_ID` and `Total`. It flags both rows of the duplicate and the missing total. The rule-based review also flags the partial refund for manual review and the stray EUR row. Treat `Total` as the order amount. Check actual settlements against your payment records. [Synthetic CSV](orders.redacted.csv) · [Free browser checker](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/tools/order-csv-check?source=github-csv-guide)
