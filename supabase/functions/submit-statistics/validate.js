export function validateSubmission(input, model, bonuses) {
  if (!input || input.modelVersion !== '2.1.1' || input.consentVersion !== '1'
      || !['de', 'en'].includes(input.language)
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.submissionId)) throw new Error('invalid metadata');
  if (!Array.isArray(input.answers) || input.answers.length !== model.questions.length) throw new Error('invalid answers');
  const answers = model.questions.map((q, i) => {
    const codes = input.answers[i];
    const allowed = q.options.map(option => option[1]);
    if (!Array.isArray(codes) || !codes.length || codes.length > (q.multi ? allowed.length : 1)
        || new Set(codes).size !== codes.length || codes.some(code => !allowed.includes(code))) throw new Error('invalid answer');
    return [...codes].sort();
  });
  const ram = answers[2][0] === 'O' ? input.ram : null;
  const gpu = answers[0].includes('D') ? input.gpu : null;
  if (answers[2][0] === 'O' && !['AG','AH','AI','AK','AJ'].includes(ram)) throw new Error('invalid RAM');
  if (answers[0].includes('D') && gpu !== '' && !['AMD Radeon','Nvidia GeForce','Intel Grafik','Hybrid / mehrere','Weiß ich nicht'].includes(gpu)) throw new Error('invalid GPU');
  const codes = [...answers.flat(), ...(ram ? [ram] : [])];
  const top3 = model.distros.map((d, index) => ({ name: d.name, index,
    score: codes.reduce((sum, code) => sum + (Number(d.points[code]) || 0), 0)
      + (answers[0].includes('D') ? (bonuses[d.name]?.[gpu] || 0) : 0)
  })).sort((a,b) => b.score - a.score || a.index - b.index).slice(0,3).map(d => d.name);
  return { submission_id: input.submissionId, model_version: input.modelVersion,
    consent_version: input.consentVersion, language: input.language, answers, ram, gpu: gpu || null, top3 };
}
