export function createStatisticsClient(endpoint, send = fetch) {
  const records = new Map(); // Per page only; no cookies or persistent identifier.
  return {
    enabled: /^https:\/\//.test(endpoint),
    state(key) { return records.get(key)?.state || 'idle'; },
    async submit(key, payload) {
      if (!this.enabled) throw new Error('unconfigured');
      let record = records.get(key);
      if (record?.state === 'sent' || record?.state === 'sending') return;
      record ||= { id: crypto.randomUUID() };
      record.state = 'sending';
      records.set(key, record);
      try {
        const response = await send(endpoint, {
          method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, submissionId: record.id, consentVersion: '1' }),
          signal: AbortSignal.timeout(12000)
        });
        if (!response.ok || (await response.json()).ok !== true) throw new Error('submission failed');
        record.state = 'sent';
      } catch (error) { record.state = 'error'; throw error; }
    }
  };
}
