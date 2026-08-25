# Mercari Bundle Extractor

Chrome extension that imports Mercari Sales Reports, extracts Bundle item details, and exports bundle-only or consolidated all-sold-items CSV files for Shopify SKU and cost mapping.

## 中文简介

Mercari Bundle Extractor 是一款用于处理 Mercari 月度 Sales Report 的 Chrome 扩展程序。

它能够自动识别报表中的 Bundle 订单，逐笔打开对应的 Mercari 订单页面，提取 Bundle 内实际售出的商品名称、Item ID 和商品链接，并将结果导出为结构化 CSV。

插件提供两种导出模式：

- **仅 Bundle 商品明细**：只导出 Bundle 订单中提取到的商品。
- **全部售出商品**：保留普通订单，并将每个 Bundle 拆分成实际商品行，生成一份包含当月所有售出商品的统一表格。

生成的合并 CSV 可以直接用于后续的 SKU、Shopify Product 和商品 Cost 匹配，减少手动查找 Bundle 订单、复制链接、逐个下载 Listing 信息以及重新合并表格的工作。

### 主要功能

- 导入 Mercari 月度 Sales Report CSV
- 自动筛选标题以 `Bundle for...` 开头的订单
- 根据 Bundle Item ID 批量打开订单页面
- 自动提取 Bundle 内商品名称、Item ID 和 Listing URL
- 支持暂停、继续和失败重试
- 自动保存处理进度
- 导出 Bundle 商品明细
- 合并普通订单与 Bundle 商品，生成完整的 Cost Mapping CSV
- 导出 Bundle 处理状态表，方便检查异常订单
- 使用 UTF-8 CSV，兼容 Excel 和其他表格工具

### 安装

1. 下载并解压插件文件。
2. 在 Chrome 地址栏打开 `chrome://extensions/`。
3. 开启右上角的“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择插件文件夹，并将扩展固定到 Chrome 工具栏。

### 每月使用流程

1. 确认 Chrome 已登录 Mercari。
2. 打开扩展并导入 Mercari 月度 Sales Report CSV。
3. 点击“开始 / 继续”，让扩展逐笔读取 Bundle 订单。
4. 如有需要，可以暂停或重试异常订单；关闭弹窗不会丢失进度。
5. 完成后选择“仅 Bundle 商品明细”或“全部售出商品”。
6. 下载 CSV，用于后续的 Shopify SKU 和 Cost Mapping。

### 状态说明

- `SUCCESS` / `done`：找到明确的 Bundle 商品区域，提取结果具有较高可信度。
- `REVIEW` / `review`：商品已经提取，但 Mercari 页面没有明确的 Bundle 容器，插件使用页面范围进行判断；不代表失败，建议人工抽查。
- `MISSING`：Bundle 没有可用的商品明细。
- `NOT_APPLICABLE`：普通非 Bundle 订单，不需要执行 Bundle 提取。
- `FAILED` / `failed`：页面加载失败或没有识别到商品。
- `ATTENTION` / `attention`：需要重新登录 Mercari 或手动完成人机验证。

> 本扩展不会绕过 Mercari 登录、验证码或其他访问限制。使用前需要在 Chrome 中登录 Mercari。

---

## English Introduction

Mercari Bundle Extractor is a Chrome extension designed to process monthly Mercari Sales Report CSV files.

It automatically identifies bundle orders, opens the corresponding Mercari order pages, extracts the actual items included in each bundle, and exports structured item data such as listing titles, Mercari Item IDs, and listing URLs.

The extension provides two export modes:

- **Bundle Items Only**: Exports only the individual items extracted from bundle orders.
- **All Sold Items**: Keeps regular orders as individual rows and expands each bundle into its actual sold items, producing one consolidated file for the entire reporting period.

The consolidated CSV is designed for downstream SKU, Shopify product, and inventory cost mapping. It eliminates much of the manual work previously required to locate bundle orders, open individual order links, download listing information, and merge the results back into the original sales report.

### Key Features

- Import a monthly Mercari Sales Report CSV
- Automatically detect orders titled `Bundle for...`
- Open bundle order pages using their Item IDs
- Extract item names, Mercari Item IDs, and listing URLs
- Pause, resume, and retry failed extractions
- Preserve progress when the extension popup is closed
- Export bundle-only item details
- Combine regular and bundle orders into a unified Cost Mapping CSV
- Export a bundle processing status report for troubleshooting
- Generate UTF-8 CSV files compatible with Excel and other spreadsheet tools

### Installation

1. Download and unzip the extension files.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extension folder and pin the extension to the Chrome toolbar.

### Monthly Workflow

1. Make sure you are signed in to Mercari in Chrome.
2. Open the extension and import a monthly Mercari Sales Report CSV.
3. Click **Start / Continue** to process each bundle order.
4. Pause or retry problem orders as needed; closing the popup does not erase progress.
5. Select **Bundle Items Only** or **All Sold Items**.
6. Download the CSV for Shopify SKU and cost mapping.

### Extraction Statuses

- `SUCCESS` / `done`: A clearly defined bundle item section was found, giving the extraction a high confidence level.
- `REVIEW` / `review`: Items were extracted, but the page did not expose a clearly defined bundle container. Page-range detection was used; this is not a failure, but a manual spot check is recommended.
- `MISSING`: No extracted item details are available for the bundle.
- `NOT_APPLICABLE`: A regular, non-bundle order that does not require bundle extraction.
- `FAILED` / `failed`: The page could not be processed or no bundle items were detected.
- `ATTENTION` / `attention`: Mercari login or human verification requires user action.

> This extension does not bypass Mercari authentication, CAPTCHAs, or other access restrictions. You must be logged in to Mercari in Chrome before running a batch.

## Privacy

Sales Report data and extracted results are processed locally by the extension and stored in Chrome extension storage. This repository does not include seller reports, customer order data, or Shopify cost data.

## Disclaimer

This is an independent utility and is not affiliated with, endorsed by, or sponsored by Mercari or Shopify. Mercari page changes may affect extraction accuracy, so review flagged results before using them for accounting.
