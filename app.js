const $ = (id) => document.getElementById(id);
const STAGES = [
  { id: 'A', weeks: 2, offset: -35 }, { id: 'B', weeks: 2, offset: -25 },
  { id: 'C', weeks: 1, offset: -20 }, { id: 'D', weeks: 1, offset: -15 },
  { id: 'E', weeks: 1, offset: -10 }, { id: 'F', weeks: 1, offset: -5 },
  { id: 'G', weeks: 0, offset: 5, final: true }
];
const WEEK = [{ label: '加热 1', type: '加热', hours: 60 }, { label: '休息 D3', type: '休息', hours: 12 }, { label: '加热 2', type: '加热', hours: 36 }, { label: '休息 D5', type: '休息', hours: 12 }, { label: '加热 3', type: '加热', hours: 72 }];
const pad = (value) => String(value).padStart(2, '0');
const format = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
const validDate = (value) => value && !Number.isNaN(value.getTime());
function buildTimeline(tf) {
  let elapsed = 0; const list = [];
  STAGES.forEach((stage) => {
    if (stage.final) { list.push({ stage: stage.id, label: '终段加热', type: '加热', temp: tf + stage.offset, start: elapsed, end: elapsed + 24 }); elapsed += 24; return; }
    for (let week = 1; week <= stage.weeks; week += 1) WEEK.forEach((step) => { list.push({ stage: stage.id, label: `W${week} · ${step.label}`, type: step.type, temp: step.type === '加热' ? tf + stage.offset : '室温', start: elapsed, end: elapsed + step.hours }); elapsed += step.hours; });
  });
  return list;
}
function render() {
  const tf = Number($('tfVal').value); const start = new Date($('startMoment').value); const used = Number($('totalHours').value);
  if (!Number.isFinite(tf) || !Number.isFinite(used) || used < 0 || !validDate(start)) return;
  const timeline = buildTimeline(tf); const total = timeline.at(-1).end; const clamped = Math.min(used, total); const current = timeline.find((row) => clamped >= row.start && clamped < row.end);
  const endDate = new Date(start.getTime() + total * 3600000); const actualEndDate = new Date(start.getTime() + used * 3600000);
  $('startSummary').textContent = format(start); $('endSummary').textContent = format(endDate); $('actualEndSummary').textContent = format(actualEndDate); $('usedHours').textContent = `${used.toFixed(2)} h`; $('progressSummary').textContent = `${Math.min(used / total * 100, 100).toFixed(1)}%`;
  if (current) {
    const target = new Date(start.getTime() + current.end * 3600000); const isRest = current.type === '休息';
    $('stageLetter').textContent = current.stage; $('stageTitle').textContent = `${current.type}阶段`; $('segmentName').textContent = `${current.label}（${current.end - current.start} h）`; $('setTemp').textContent = typeof current.temp === 'number' ? `${current.temp.toFixed(1)} °C` : '室温'; $('tempDetail').textContent = isRest ? '烘箱关闭，样品冷却' : `Tf ${current.stage === 'G' ? '+ 5 K' : '阶段设定'}`; $('segmentProgress').textContent = `当前段落 ${(clamped - current.start).toFixed(2)} / ${current.end - current.start} h`; $('targetDT').textContent = `${(current.end - clamped).toFixed(2)} h`; $('statusSummary').textContent = '进行中';
  } else { $('stageLetter').textContent = '✓'; $('stageTitle').textContent = '老化已结束'; $('segmentName').textContent = '已达到 1560 h 排程终点'; $('setTemp').textContent = '—'; $('tempDetail').textContent = '请以实际试验记录为准'; $('segmentProgress').textContent = '全部阶段完成'; $('targetDT').textContent = '0.00 h'; $('statusSummary').textContent = used > total ? '超出计划' : '已完成'; }
  $('stageTimeline').innerHTML = STAGES.map((stage) => { const rows = timeline.filter((item) => item.stage === stage.id); const isActive = current?.stage === stage.id; const hours = rows.at(-1).end - rows[0].start; const state = clamped >= rows.at(-1).end ? 'stage-past' : (isActive ? 'stage-current active' : 'stage-future'); return `<div class="stage-cell stage-${stage.id} ${state}" style="flex:${hours}"><b>${stage.id}</b><span>${stage.id === 'G' ? '终段' : `${stage.weeks} 周`}</span><small>${hours} h</small></div>`; }).join('');
  $('tbBody').innerHTML = timeline.map((row) => { const cls = clamped >= row.end ? 'row-past' : (current === row ? 'row-now' : 'row-future'); const rowStart = new Date(start.getTime() + row.start * 3600000); const rowEnd = new Date(start.getTime() + row.end * 3600000); return `<tr class="${cls} stage-row-${row.stage}"><td><span class="stage-pill stage-pill-${row.stage}">${row.stage}</span> · ${row.label}</td><td><span class="kind ${row.type === '加热' ? 'heat' : 'rest'}">${row.type}</span></td><td>${typeof row.temp === 'number' ? `${row.temp.toFixed(1)} °C` : row.temp}</td><td>${row.end - row.start} h</td><td>${format(rowStart)}</td><td>${format(rowEnd)}</td><td>${row.start} → ${row.end} h</td></tr>`; }).join('');
  $('rowCount').textContent = `${timeline.length} 个排程段落`;
}
function initialise() { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); $('startMoment').value = now.toISOString().slice(0, 16); render(); }
$('scheduleForm').addEventListener('submit', (event) => { event.preventDefault(); render(); });
['startMoment', 'totalHours', 'tfVal'].forEach((id) => $(id).addEventListener('input', render));
initialise();
