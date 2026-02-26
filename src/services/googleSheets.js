export const fetchRecordsFromCloud = async (apiUrl, apiToken) => {
    if (!apiUrl) return [];
    try {
        const res = await fetch(apiUrl, { method: 'POST', body: JSON.stringify({ action: 'get', token: apiToken }) });
        const data = await res.json();
        return data.status !== 'error' && Array.isArray(data) ? data : [];
    } catch (e) {
        console.error('Error fetching records:', e);
        return [];
    }
};

export const addRecordToCloud = async (apiUrl, apiToken, recordData) => {
    if (!apiUrl) throw new Error("API URL not set");
    const payload = { ...recordData, action: 'add', token: apiToken };
    const res = await fetch(apiUrl, { method: 'POST', body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("Network error");
    return await res.json();
};

export const deleteRecordFromCloud = async (apiUrl, apiToken, rowIndex) => {
    if (!apiUrl) throw new Error("API URL not set");
    const payload = { action: 'delete', rowIndex, token: apiToken };
    const res = await fetch(apiUrl, { method: 'POST', body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("Network error");
    return await res.json();
};
