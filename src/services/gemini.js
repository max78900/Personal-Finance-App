export const parseTextWithGemini = async (geminiKey, inputStr, defaultDateStr) => {
    if (!geminiKey || !inputStr.trim()) throw new Error("API Key or Input is missing");

    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dYesterday = new Date(d); dYesterday.setDate(dYesterday.getDate() - 1);
    const yesterday = `${dYesterday.getFullYear()}-${String(dYesterday.getMonth() + 1).padStart(2, '0')}-${String(dYesterday.getDate()).padStart(2, '0')}`;
    const dBefore = new Date(d); dBefore.setDate(dBefore.getDate() - 2);
    const dayBeforeYesterday = `${dBefore.getFullYear()}-${String(dBefore.getMonth() + 1).padStart(2, '0')}-${String(dBefore.getDate()).padStart(2, '0')}`;

    const prompt = `你是一個專業的記帳助手。請協助解析使用者輸入的記帳文字。
輸入文字: "${inputStr}"
目前的預設記帳日期是: ${defaultDateStr}。
今天是: ${today} (昨天是 ${yesterday}，前天是 ${dayBeforeYesterday})。

請判斷使用者輸入中是否有提到特定日期(例如: "昨天", "前天", "1月25日", "1/25" 等)。
- 如果有明確提到「昨天」，請使用 ${yesterday}。
- 如果有明確提到「前天」，請使用 ${dayBeforeYesterday}。
- 如果有提到幾月幾號(如1月25日)，請將其轉換為 "YYYY-MM-DD" 的格式。如果只有提到月和日，請自動補上今年的年份(${d.getFullYear()})。
- 如果完全沒有提到日期，或者無法判斷，請直接使用預設日期: "${defaultDateStr}"。

請回傳包含以下格式的JSON陣列，除了這個 JSON 格式的純文字，不要輸出其他任何東西：
[{"date": "YYYY-MM-DD", "type":"支出 或是 收入", "category":"分類名稱(如:餐飲、交通)", "item":"項目名稱(如: 拉麵)", "amount":數字金額, "note":"備註內容(如果沒有或已設為日期就留空)"}]`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const textContent = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
    const list = JSON.parse(textContent);

    return Array.isArray(list) ? list : [list];
};
