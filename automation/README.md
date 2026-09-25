# 自動製作動畫：設定說明

這個資料夾讓 Claude Code 的 routine 每 6 小時自動做一集新的三語動畫並推送到網站。

| 檔案 | 用途 |
|---|---|
| `ROUTINE_PROMPT.md` | 貼到 routine 的 Instructions |
| `topics.md` | 題目清單，由上往下每次做一個，可自行增刪調整順序 |
| `CHANGELOG.md` | 每次新增的紀錄 |
| `setup.sh` | 雲端環境的 Setup script（安裝 QA 用的 Playwright） |

## 設定步驟
1. 把這個 kit 解壓到 repo 根目錄（與 `index.html` 同層）並推送到 GitHub。
2. 打開 https://claude.ai/code/routines → **New routine**。
3. **Name**：每日再生能源動畫。**Instructions**：貼上 `ROUTINE_PROMPT.md` 的全文，模型選目前最強的版本。
4. **Repositories**：選 `dofliu/renewable-energy-animations`。
5. **Environment**：新增一個環境，Setup script 貼上 `setup.sh` 的內容。Network access 需允許下載 Chromium：選 **Custom**，勾選包含預設清單，再加上 Playwright 的下載網域；或直接選 **Full**。
6. **Trigger**：Schedule → Custom，cron 設為 `0 */6 * * *`（每 6 小時一次；時區依 routine 設定）。
7. **Connectors**：移除全部，這個工作不需要。
8. 按 **Create**，然後在詳細頁按 **Run now** 試跑一次，打開那次 session 確認每一步都成功。

## 注意
- main 分支不能設為 protected，否則推送會被拒絕。若想先審再上線，把提示詞第 6 步改成「推送到 claude/ 分支並開 PR」。
- 綠色的執行狀態只代表 session 正常結束，實際成果要打開 session 查看。
- 每次執行都會消耗訂閱用量，而且 routine 有每日執行次數上限，詳見 claude.ai/settings/usage。
