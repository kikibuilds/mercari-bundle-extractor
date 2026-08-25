const K="mercariBundleBatchV2",TK="mercariBundleWorkerTabV2",ALARM="mercariBundleNextV2";
const fresh=()=>({version:2,status:"idle",importedAt:null,updatedAt:null,queue:[],results:[],currentBundleId:null,message:""});
const get=async()=>({...fresh(),...(await chrome.storage.local.get(K))[K]});
const save=async s=>{s.updatedAt=new Date().toISOString();await chrome.storage.local.set({[K]:s});chrome.runtime.sendMessage({type:"STATE_UPDATED"}).catch(()=>{})};
const tabId=async()=>(await chrome.storage.local.get(TK))[TK]||null;
const setTab=id=>chrome.storage.local.set({[TK]:id});
const next=s=>s.queue.find(x=>x.status==="pending"||x.status==="retry");
async function schedule(ms=3000){await chrome.alarms.clear(ALARM);chrome.alarms.create(ALARM,{when:Date.now()+ms})}
async function openNext(){
 const s=await get();if(s.status!=="running")return;const x=next(s);
 if(!x){s.status="complete";s.currentBundleId=null;s.message="全部 Bundle 已处理完成。";await save(s);return}
 x.status="loading";x.attempts=(x.attempts||0)+1;s.currentBundleId=x.bundleId;s.message=`正在打开 ${x.bundleId}…`;await save(s);
 const url=`https://www.mercari.com/us/item/${x.bundleId}/`;let id=await tabId();
 try{if(id)await chrome.tabs.update(id,{url,active:true});else{const t=await chrome.tabs.create({url,active:true});id=t.id;await setTab(id)}}catch{const t=await chrome.tabs.create({url,active:true});await setTab(t.id)}
}
async function extract(id,n=0){
 const s=await get();if(s.status!=="running"||!s.currentBundleId)return;
 try{const r=await chrome.tabs.sendMessage(id,{type:"EXTRACT_BUNDLE",bundleId:s.currentBundleId});if(!r?.ok)throw Error(r?.error||"页面尚未准备好");await accept(r)}
 catch(e){if(n<5){setTimeout(()=>extract(id,n+1),2200);return}const z=await get(),x=z.queue.find(q=>q.bundleId===z.currentBundleId);if(x){x.status="failed";x.error=String(e?.message||e)}z.message=`${z.currentBundleId} 提取失败，已继续下一笔。`;z.currentBundleId=null;await save(z);await schedule(4000)}
}
async function accept(r){
 const s=await get(),x=s.queue.find(q=>q.bundleId===r.bundleId);if(!x)return;
 if(r.attention){x.status="attention";x.error=r.attention;s.status="paused";s.message=r.attention+" 请在 Mercari 页面处理后点击继续。";await save(s);return}
 if(!r.rows?.length){x.status="failed";x.error="没有识别到 Bundle 商品"}else{x.status=r.confidence==="high"?"done":"review";x.error=r.confidence==="high"?"":"页面结构不明确，建议抽查";s.results=s.results.filter(y=>y.bundle_id!==r.bundleId);s.results.push(...r.rows)}
 s.currentBundleId=null;s.message=`${r.bundleId}：提取 ${r.rows?.length||0} 件商品。`;await save(s);await schedule(3500+Math.floor(Math.random()*3500))
}
chrome.tabs.onUpdated.addListener(async(id,info,tab)=>{if(info.status==="complete"&&id===await tabId()&&/^https:\/\/www\.mercari\.com\/us\/item\//i.test(tab.url||""))setTimeout(()=>extract(id),3500)});
chrome.tabs.onRemoved.addListener(async id=>{if(id===await tabId())await chrome.storage.local.remove(TK)});
chrome.alarms.onAlarm.addListener(a=>{if(a.name===ALARM)openNext()});
chrome.runtime.onMessage.addListener((m,_s,reply)=>{(async()=>{
 if(m.type==="GET_STATE")reply({ok:true,state:await get()});
 else if(m.type==="IMPORT_QUEUE"){const s=fresh();s.importedAt=new Date().toISOString();s.queue=m.queue.map(x=>({...x,status:"pending",attempts:0,error:""}));s.message=`已导入 ${s.queue.length} 笔 Bundle。`;await save(s);reply({ok:true})}
 else if(m.type==="START"){const s=await get();s.status="running";s.message="批量提取已开始。";s.queue.forEach(x=>{if(["attention","loading"].includes(x.status))x.status="retry"});await save(s);await openNext();reply({ok:true})}
 else if(m.type==="PAUSE"){const s=await get();s.status="paused";s.message="已暂停。";const x=s.queue.find(q=>q.bundleId===s.currentBundleId);if(x?.status==="loading")x.status="retry";s.currentBundleId=null;await save(s);reply({ok:true})}
 else if(m.type==="RETRY_FAILED"){const s=await get();s.queue.forEach(x=>{if(["failed","attention","review"].includes(x.status))x.status="retry"});s.status="running";s.message="正在重试需要处理的订单。";await save(s);await openNext();reply({ok:true})}
 else if(m.type==="CLEAR"){await chrome.alarms.clear(ALARM);await save(fresh());reply({ok:true})}else reply({ok:false})
 })();return true});
