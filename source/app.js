function sellPrice(cust,p){
  if(typeof effPrice==='function')return effPrice(cust,p);
  return p.price;
}
var CUSTOMERS=[
{key:'C1',name:'Uzbegim Market',kind:'transfer',phone:'',email:'',contact:'',address:'',city:'Cincinnati',state:'OH',zip:'',terms:'',notes:'Own retail store'},
{key:'C2',name:'Cafe Bistro',kind:'transfer',phone:'',email:'',contact:'',address:'',city:'Cincinnati',state:'OH',zip:'',terms:'',notes:'Own cafe'},
{key:'C3',name:'Chaykhana N1',kind:'invoice',phone:'(513) 555-0101',email:'',contact:'',address:'',city:'Cincinnati',state:'OH',zip:'',terms:'Net 14',notes:''},
{key:'C4',name:'Turkistan Restaurant',kind:'invoice',phone:'(513) 555-0102',email:'',contact:'',address:'',city:'Cincinnati',state:'OH',zip:'',terms:'Net 14',notes:''},
{key:'C5',name:'Registan Restaurant',kind:'invoice',phone:'(513) 555-0103',email:'',contact:'',address:'',city:'Cincinnati',state:'OH',zip:'',terms:'Net 14',notes:''},
{key:'C6',name:'Caravan',kind:'invoice',phone:'(513) 555-0104',email:'',contact:'',address:'',city:'Cincinnati',state:'OH',zip:'',terms:'Net 14',notes:''},
{key:'C7',name:'Oasis',kind:'invoice',phone:'(513) 555-0105',email:'',contact:'',address:'',city:'Cincinnati',state:'OH',zip:'',terms:'Net 14',notes:''}];
function findCust(v){for(var i=0;i<CUSTOMERS.length;i++)if(String(CUSTOMERS[i].key)===String(v)||CUSTOMERS[i].name===v)return CUSTOMERS[i];return null;}
function findSup(v){for(var i=0;i<SUPPLIERS.length;i++)if(SUPPLIERS[i].name===v)return SUPPLIERS[i];return null;}
var SUPPLIERS=[
{name:'ARASHAN',phone:'(312) 509-1986',email:'',contact:'',address:'754 W Algonquin Rd',city:'Arlington Heights',state:'IL',zip:'60005',terms:'Net 14',notes:''},
{name:'LIPARI',phone:'(586) 447-3500',email:'',contact:'',address:'26661 Bunert Rd',city:'Warren',state:'MI',zip:'48089',terms:'Net 30',notes:''},
{name:'PRIME FOOD USA',phone:'',email:'',contact:'',address:'',city:'Brooklyn',state:'NY',zip:'11232',terms:'',notes:''},
{name:'BARAKA TRADING',phone:'',email:'',contact:'',address:'',city:'',state:'',zip:'',terms:'',notes:''},
{name:'FOODIELUX',phone:'',email:'',contact:'',address:'',city:'',state:'',zip:'',terms:'',notes:''}];
var _now=new Date();
var TODAY=_now.getFullYear()+'-'+('0'+(_now.getMonth()+1)).slice(-2)+'-'+('0'+_now.getDate()).slice(-2);
var basket={},lastMovement=null,lastScreen='menu';
var ME={name:'Abdu',role:'manager',email:''};

PRODUCTS.forEach(function(p,i){p.barcode=(i%10<7)?('20'+String(480000+i*137).slice(0,7)):'';});
var OWNER_EMAIL='abduraufkholikov@gmail.com';
/* ── visual identity for categories and brands ── */
var CATICON={
 'Beverages':      ['\uD83E\uDD64','#e3ecf5','#1D4E78'],
 'Rice':           ['\uD83C\uDF5A','#f3ede1','#7d5108'],
 'Flour':          ['\uD83C\uDF3E','#f6f1e4','#8a6d1f'],
 'Oil':            ['\uD83E\uDED2','#fbf1df','#8f6a12'],
 'Canned':         ['\uD83E\uDD6B','#eceef2','#4a5a6b'],
 'Dry Goods':      ['\uD83E\uDDC2','#f1ece2','#6f6b64'],
 'Sunflower seeds':['\uD83C\uDF3B','#fdf3e0','#9a7415'],
 'Sweets':         ['\uD83C\uDF6C','#fbe9ef','#96426a'],
 'Dairy':          ['\uD83E\uDDC0','#fdf6e3','#8a6d1f'],
 'Meat':           ['\uD83E\uDD69','#fbeaea','#992d2d'],
 'Bakery':         ['\uD83C\uDF5E','#f6efe4','#7d5108'],
  'Produce':           ['\uD83E\uDD6C','#eaf3e6','#2f6b3a'],
  'Frozen':            ['\uD83E\uDDCA','#e6f3fa','#1d6f8f'],
  'Spices & Seasoning': ['\uD83E\uDDC2','#fdeee2','#a1542b'],
  'Snacks':            ['\uD83C\uDF7F','#fdf2df','#b5790f'],
  'Tea & Coffee':      ['\u2615','#f1e6da','#6b4423'],
  'Pasta & Noodles':   ['\uD83C\uDF5D','#f7ecd9','#8a5a12'],
  'Eggs':              ['\uD83E\uDD5A','#fdf7e3','#9c8a1d'],
  'Nuts & Dried Fruits': ['\uD83E\uDD5C','#f3e9da','#7a5a28'],
  'Condiments & Sauces': ['\uD83C\uDF6F','#fbeedd','#a5641a'],
  'Seafood':           ['\uD83D\uDC1F','#e3eef5','#22608a'],
  'Household & Cleaning': ['\uD83E\uDDFC','#e8f4f1','#1f7a63'],
  'Kitchenware & Cookware': ['\uD83C\uDF73','#eee9f5','#5b4a8f'],
  'Personal Care':     ['\uD83E\uDDF4','#fbe6ef','#a13d6e'],
  'Paper & Disposables': ['\uD83E\uDDFB','#f0ede6','#7a6f5c'],
};
function catIcon(cat){
  return CATICON[cat]||['\uD83D\uDCE6','#eef1f0','#0F5C5C'];
}
/* brands get a stable colour from their name, plus their category glyph */
var BRANDTINT=[['#e2efee','#0F5C5C'],['#fbe9dc','#C1622D'],['#e3ecf5','#1D4E78'],
               ['#e6f1e8','#26603a'],['#f1ece2','#6f6b64'],['#fbe9ef','#96426a'],
               ['#f3ede1','#7d5108']];
function brandTint(name){
  var h=0,str=String(name||'');
  for(var i=0;i<str.length;i++)h=(h*31+str.charCodeAt(i))>>>0;
  return BRANDTINT[h%BRANDTINT.length];
}
function initials(name){
  var w=String(name||'?').replace(/[^A-Za-z0-9 ]/g,' ').trim().split(/\s+/);
  if(w.length===1)return w[0].substring(0,2).toUpperCase();
  return (w[0][0]+w[1][0]).toUpperCase();
}
function icoCat(cat,cls){
  var c=catIcon(cat);
  return '<div class="ic '+(cls||'')+'" style="background:'+c[1]+';color:'+c[2]+'">'+c[0]+'</div>';
}
function icoBrand(brand,cat,cls){
  var t=brandTint(brand);
  return '<div class="ic '+(cls||'')+'" style="background:'+t[0]+';color:'+t[1]+
    ';font-size:11px;font-weight:800;letter-spacing:.3px">'+initials(brand)+'</div>';
}
function icoParty(name,kind,cls){
  var map={invoice:['\uD83C\uDF7D','#fbe9dc','#C1622D'],
           transfer:['\uD83C\uDFEA','#e3ecf5','#1D4E78'],
           supplier:['\uD83D\uDE9A','#e6f1e8','#26603a']};
  var c=map[kind]||map.invoice;
  return '<div class="ic '+(cls||'')+'" style="background:'+c[1]+';color:'+c[2]+'">'+c[0]+'</div>';
}
function icoStaff(role,cls){
  var c=role==='manager'?['\uD83D\uDD11','#fbe9dc','#C1622D']:['\uD83D\uDC64','#e3ecf5','#1D4E78'];
  return '<div class="ic '+(cls||'')+'" style="background:'+c[1]+';color:'+c[2]+'">'+c[0]+'</div>';
}
function statusOf(p){if(p.boxes<=0)return'OUT';if(!p.min)return'SETMIN';if(p.boxes<=p.min)return'ORDER';if(p.boxes<=p.min*(typeof SETTINGS!=='undefined'?SETTINGS.low:1.5))return'LOW';return'OK';}
function label(s){return s==='SETMIN'?'SET MIN':s==='ORDER'?'ORDER NOW':s==='OUT'?'OUT OF STOCK':s;}
function uniq(a){return a.filter(function(v,i){return v&&a.indexOf(v)===i}).sort();}
function fill(el,items,all){el.innerHTML='<option value="">'+all+'</option>'+items.map(function(v){return'<option value="'+v+'">'+v+'</option>'}).join('');}
function prod(sku){for(var i=0;i<PRODUCTS.length;i++)if(PRODUCTS[i].sku===sku)return PRODUCTS[i];}
function money(n){return'$'+n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
function nice(d){var p=d.split('-');return p[2]+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+p[1]-1]+' '+p[0];}
function movementId(id){return String(id||'').indexOf('INV-')===0?'OUT-'+String(id).slice(4):id;}
function shift(days){var d=new Date(TODAY);d.setDate(d.getDate()-days);return d.toISOString().slice(0,10);}

function go(id){
  var all=document.querySelectorAll('.screen');
  for(var i=0;i<all.length;i++)all[i].classList.remove('on');
  document.getElementById('s-'+id).classList.add('on');
  var t={menu:'Uzbegim Inventory',stock:'Stock',move:'New movement',review:'Review movement',conf:'Confirmed',receive:'Receive stock',attn:'Needs attention',hist:'Movement history',detail:'Movement detail',stats:'Inventory report',scan:'Scan barcode',learn:'Barcode capture',adjust:'Stock count',prices:'Prices and cost',custs:'Customers & suppliers',rreview:'Review delivery',custedit:'Customer details',supedit:'Supplier details',products:'Products',prodedit:'Product details',staff:'Staff',settings:'Settings'};
  document.getElementById('title').textContent=t[id];
  document.getElementById('back').classList.toggle('show',id!=='menu');
  document.getElementById('dock').classList.toggle('on',id==='move');
  document.getElementById('rdock').classList.toggle('on',id==='receive');
  document.getElementById('cdock').classList.toggle('on',id==='adjust');
  document.getElementById('body').scrollTop=0;
  if(id==='menu')kpis();
  lastScreen=id;
}
document.getElementById('back').addEventListener('click',function(){
  stopScan();
  if(lastScreen==='scan'){go(scanTarget==='rc'?'receive':'move');return;}
  if(lastScreen==='review')go('move');
  else if(lastScreen==='rreview')go('receive');
  else if(lastScreen==='custedit'||lastScreen==='supedit')go('custs');
  else if(lastScreen==='prodedit')go('products');else if(lastScreen==='detail')go('hist');else go('menu');
});
var mb=document.querySelectorAll('[data-go]');
for(var i=0;i<mb.length;i++)mb[i].addEventListener('click',function(){
  var d=this.getAttribute('data-go');
  if(d==='stock')renderStock();if(d==='move')renderMove();if(d==='attn')renderAttn();
  if(d==='hist')renderHist();if(d==='stats')initStats();if(d==='receive')renderReceive();if(d==='learn'){go('learn');startLearn();return;}
  if(d==='adjust')renderAdjust();
  if(d==='prices')renderPrices();
  if(d==='custs')renderCusts();
  if(d==='products')renderProducts();
  if(d==='staff')renderStaff();
  if(d==='settings')renderSettings();
  if(d==='newprod'){
    go('receive');
    var t=document.querySelectorAll('.tab[data-rt]');
    if(t.length>1)t[1].click();
    return;
  }
  go(d);
});

function kpis(){
  var b=0,act=0,out=0,ord=0,low=0;
  for(var i=0;i<PRODUCTS.length;i++){
    b+=PRODUCTS[i].boxes;
    var st=statusOf(PRODUCTS[i]);
    if(st==='ORDER'||st==='OUT'||st==='LOW')act++;
    if(st==='OUT')out++;
    if(st==='ORDER')ord++;
    if(st==='LOW')low++;
  }
  document.getElementById('k1').textContent=PRODUCTS.length;
  document.getElementById('k2').textContent=b.toLocaleString();
  document.getElementById('k3').textContent=act;

  var h=new Date().getHours();
  document.getElementById('hi-greet').textContent=h<12?'GOOD MORNING':h<18?'GOOD AFTERNOON':'GOOD EVENING';
  var d=new Date(TODAY);
  document.getElementById('hi-date').textContent=
    ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()]+', '+nice(TODAY);

  var strip=document.getElementById('hi-alert'),tx=document.getElementById('hi-alert-tx'),ic=document.getElementById('hi-alert-ic');
  if(act>0){
    strip.className='alertstrip';ic.innerHTML='!';
    var reasons=[];
    if(out)reasons.push(out+' out of stock');
    if(ord)reasons.push(ord+' at minimum');
    if(low)reasons.push(low+' running low');
    tx.textContent=act+' need attention — '+reasons.join(' · ');
  }else{
    strip.className='alertstrip calm';ic.innerHTML='&#10003;';
    tx.textContent='Every product is above its minimum';
  }

  var ad=document.getElementById('hi-attn');
  ad.textContent=act;ad.style.display=act?'flex':'none';

  var today=0;
  for(var j=0;j<HISTORY.length;j++)if(HISTORY[j].date===TODAY)today++;
  document.getElementById('hi-hist').textContent=
    HISTORY.length+' movements recorded'+(today?' \u00b7 '+today+' today':'');

  var done=0;PRODUCTS.forEach(function(p){if(p.barcode)done++;});
  var bc=document.getElementById('hi-bc');
  if(bc)bc.textContent=done+' of '+PRODUCTS.length+' coded';
  var noMin=0;PRODUCTS.forEach(function(p){if(!p.min)noMin++;});
  var pd=document.getElementById('hi-pd');
  if(pd)pd.textContent=noMin?(noMin+' without a minimum'):(PRODUCTS.length+' products');
  var st=document.getElementById('hi-st');
  if(st&&typeof STAFF!=='undefined')st.textContent=STAFF.length+' people';
  var cu=document.getElementById('hi-cu');
  if(cu)cu.textContent=CUSTOMERS.length+' customers · '+SUPPLIERS.length+' suppliers';
  var role=document.getElementById('hi-role');
  if(role)role.textContent=isManager()?'Manager':'Worker';
  var mgr=document.getElementById('mgr-menu'),lab=document.getElementById('mgr-lab');
  if(mgr&&lab){var show=isManager();mgr.style.display=show?'grid':'none';lab.style.display=show?'block':'none';}
}
function setupFilters(p){
  fill(document.getElementById(p+'-cat'),uniq(PRODUCTS.map(function(x){return x.cat})),'All categories');
  document.getElementById(p+'-status').innerHTML='<option value="">All status</option><option value="OK">OK</option><option value="LOW">Low</option><option value="ORDER">Order now</option><option value="OUT">Out of stock</option><option value="SETMIN">Set min</option>';
  refreshBrands(p);
}
/* Brand list shows only brands that exist inside the chosen category. */
/* horizontal category strip with icons and live counts */
function drawCatBar(p){
  var bar=document.getElementById(p+'-cats'); if(!bar)return;
  var sel=document.getElementById(p+'-cat');
  var cur=sel.value;
  var counts={};
  PRODUCTS.forEach(function(x){counts[x.cat]=(counts[x.cat]||0)+1;});
  var cats=uniq(PRODUCTS.map(function(x){return x.cat}));
  var html='<div class="catpill'+(cur?'':' on')+'" data-c="">'+
    '<div class="ic sm" style="background:#eef1f0;color:#0F5C5C">\u2630</div>'+
    '<div class="lb">All</div><div class="ct">'+PRODUCTS.length+'</div></div>';
  cats.forEach(function(c){
    var ic=catIcon(c);
    html+='<div class="catpill'+(cur===c?' on':'')+'" data-c="'+c+'">'+
      '<div class="ic sm" style="background:'+ic[1]+';color:'+ic[2]+'">'+ic[0]+'</div>'+
      '<div class="lb">'+c.split(' ')[0]+'</div><div class="ct">'+(counts[c]||0)+'</div></div>';
  });
  bar.innerHTML=html;
}
function wireCatBar(p,render){
  var bar=document.getElementById(p+'-cats'); if(!bar)return;
  bar.addEventListener('click',function(ev){
    var pill=ev.target.closest?ev.target.closest('.catpill'):null;
    if(!pill)return;
    document.getElementById(p+'-cat').value=pill.getAttribute('data-c');
    refreshBrands(p); drawCatBar(p); render();
  });
}
function refreshBrands(p){
  var cat=document.getElementById(p+'-cat').value;
  var sel=document.getElementById(p+'-brand');
  var was=sel.value;
  var pool=cat?PRODUCTS.filter(function(x){return x.cat===cat}):PRODUCTS;
  var brands=uniq(pool.map(function(x){return x.brand}));
  fill(sel,brands,cat?('All '+cat.toLowerCase()+' brands'):'All brands');
  sel.value=(brands.indexOf(was)>-1)?was:'';
  drawCatBar(p);
}
function filterProducts(p){
  var q=document.getElementById(p+'-q').value.toLowerCase().trim();
  var c=document.getElementById(p+'-cat').value,b=document.getElementById(p+'-brand').value,s=document.getElementById(p+'-status').value;
  return PRODUCTS.filter(function(x){
    if(q&&(x.name||'').toLowerCase().indexOf(q)<0&&x.sku.toLowerCase().indexOf(q)<0&&(x.brand||'').toLowerCase().indexOf(q)<0)return false;
    if(c&&x.cat!==c)return false;if(b&&x.brand!==b)return false;if(s&&statusOf(x)!==s)return false;return true;});
}

function renderStock(){
  var r=filterProducts('stk');
  document.getElementById('stk-count').textContent=r.length+' of '+PRODUCTS.length+' products';
  document.getElementById('stk-list').innerHTML=r.length?r.map(function(p){var s=statusOf(p);
    return '<div class="card'+(s==='OUT'?' dead':(s==='ORDER'?' hot':''))+'">'+icoCat(p.cat)+'<div class="c-info"><div class="c-name">'+p.name+'</div><div class="c-meta">'+p.sku+' &middot; '+p.cat+' &middot; '+p.upb+' '+p.unit+'/box</div><div style="margin-top:6px"><span class="pill s-'+s+'">'+label(s)+'</span></div></div><div class="c-box">'+p.boxes+'<small>BOXES</small></div></div>';
  }).join(''):'<div class="empty">No products match these filters</div>';
}
['stk-q','stk-cat','stk-brand','stk-status'].forEach(function(id){
  var e=document.getElementById(id);
  var fn=function(){ if(id==='stk-cat'){refreshBrands('stk');drawCatBar('stk');} renderStock(); };
  e.addEventListener('input',fn); e.addEventListener('change',fn);
});

function renderMove(){
  var r=filterProducts('mv');
  document.getElementById('mv-count').textContent=r.length+' of '+PRODUCTS.length+' products';
  document.getElementById('mv-list').innerHTML=r.length?r.map(function(p){
    var inb=basket[p.sku]?basket[p.sku].qty:0,rem=p.boxes-inb,s=statusOf(p);
    return '<div class="card">'+icoCat(p.cat)+'<div class="c-info"><div class="c-name">'+p.name+'</div><div class="c-meta">'+p.sku+' &middot; '+p.cat+' &middot; '+p.upb+' '+p.unit+'/box</div><div class="c-meta c-rem'+(rem<=0?' none':'')+'" id="rem-'+p.sku+'" style="color:#0F5C5C">'+rem+' of '+p.boxes+' boxes left &middot; <span class="pill s-'+s+'" style="font-size:9px">'+label(s)+'</span></div></div><div class="qty"><button class="qbtn minus" onclick="bump(\''+p.sku+'\',-1)">&#8722;</button><input type="number" inputmode="numeric" id="q-'+p.sku+'" value="'+(inb||'')+'" placeholder="0" max="'+p.boxes+'" enterkeyhint="done" onfocus="this.select()" onkeydown="if(event.key===&quot;Enter&quot;){event.preventDefault();this.blur();}" oninput="setQty(\''+p.sku+'\',this.value,true)"><button class="qbtn" onclick="bump(\''+p.sku+'\',1)">+</button></div></div>';
  }).join(''):'<div class="empty">No products match these filters</div>';
  drawBasket();
}
['mv-q','mv-cat','mv-brand','mv-status'].forEach(function(id){
  var e=document.getElementById(id);
  var fn=function(){ if(id==='mv-cat'){refreshBrands('mv');drawCatBar('mv');} renderMove(); };
  e.addEventListener('input',fn); e.addEventListener('change',fn);
});



/* ══════════ RECEIVE: tabs, new product, review ══════════ */
(function(){
  var tabs=document.querySelectorAll('.tab[data-rt]');
  for(var i=0;i<tabs.length;i++)tabs[i].addEventListener('click',function(){
    for(var j=0;j<tabs.length;j++)tabs[j].classList.remove('on');
    this.classList.add('on');
    var isNew=this.getAttribute('data-rt')==='new';
    document.getElementById('rc-existing').style.display=isNew?'none':'block';
    document.getElementById('rc-list').style.display=isNew?'none':'flex';
    document.getElementById('rc-new').style.display=isNew?'block':'none';
    if(isNew)fillNewProduct();
  });
})();

function fillNewProduct(){
  var cats=uniq(PRODUCTS.map(function(p){return p.cat}));
  var brands=uniq(PRODUCTS.map(function(p){return p.brand}));
  var c=document.getElementById('np-cat'), b=document.getElementById('np-brand');
  if(!c.options.length)c.innerHTML=cats.map(function(x){return '<option>'+x+'</option>'}).join('');
  if(!b.options.length)b.innerHTML=brands.map(function(x){return '<option>'+x+'</option>'}).join('');
  previewSku();
}
function addCategory(){
  var n=prompt('New category name'); if(!n)return;
  n=n.trim(); if(!n)return;
  var sel=document.getElementById('np-cat');
  sel.insertAdjacentHTML('afterbegin','<option>'+n+'</option>');
  sel.value=n; previewSku(); toast('Category "'+n+'" added');
}
function addBrand(){
  var n=prompt('New brand name'); if(!n)return;
  n=n.trim(); if(!n)return;
  var sel=document.getElementById('np-brand');
  sel.insertAdjacentHTML('afterbegin','<option>'+n+'</option>');
  sel.value=n; previewSku(); toast('Brand "'+n+'" added');
}
var CATCODE={'Beverages':'BEV','Rice':'RIC','Flour':'FLR','Oil':'OIL','Canned':'CAN',
             'Dry Goods':'DRY','Sunflower seeds':'SED','Sweets':'SWE','Dairy':'DAI','Meat':'MEA','Bakery':'BAK','Produce':'PRO','Frozen':'FRZ','Spices & Seasoning':'SPC','Snacks':'SNK','Tea & Coffee':'TEA','Pasta & Noodles':'PAS','Eggs':'EGG','Nuts & Dried Fruits':'NUT','Condiments & Sauces':'CON','Seafood':'SEA','Household & Cleaning':'HHC','Kitchenware & Cookware':'KIT','Personal Care':'PCR','Paper & Disposables':'PAP'};
function makeSku(cat,brand){
  var cc=CATCODE[cat]||(String(cat||'GEN').replace(/[^A-Za-z]/g,'').toUpperCase()+'XXX').slice(0,3);
  var bc=(String(brand||'GEN').replace(/[^A-Za-z]/g,'').toUpperCase()+'XXX').slice(0,3);
  var n=0;
  PRODUCTS.forEach(function(p){
    if(p.sku.indexOf(cc+'-'+bc+'-')===0){
      var num=parseInt(p.sku.split('-')[2],10);
      if(!isNaN(num)&&num>n)n=num;
    }
  });
  return cc+'-'+bc+'-'+('00'+(n+1)).slice(-3);
}
function previewSku(){
  var el=document.getElementById('np-sku'); if(!el)return;
  var sku=makeSku(document.getElementById('np-cat').value,document.getElementById('np-brand').value);
  el.textContent='SKU will be '+sku;
}
['np-cat','np-brand'].forEach(function(id){
  var e=document.getElementById(id); if(e)e.addEventListener('change',previewSku);
});

document.getElementById('np-add').addEventListener('click',function(){
  var cat=document.getElementById('np-cat').value;
  var brand=document.getElementById('np-brand').value;
  var name=document.getElementById('np-name').value.trim();
  var flavor=document.getElementById('np-flavor').value.trim();
  var upb=parseInt(document.getElementById('np-upb').value,10)||1;
  var cost=parseFloat(document.getElementById('np-cost').value)||0;
  var price=parseFloat(document.getElementById('np-price').value)||0;
  var min=parseInt(document.getElementById('np-min').value,10)||0;
  var boxes=parseInt(document.getElementById('np-boxes').value,10)||0;
  var unit=document.getElementById('np-unit').value;

  if(!name){toast('Type a product name');return;}
  var full=name+(flavor?' - '+flavor:'');
  for(var i=0;i<PRODUCTS.length;i++)
    if(PRODUCTS[i].name.toLowerCase()===full.toLowerCase()){toast(full+' already exists');return;}

  var sku=makeSku(cat,brand);
  PRODUCTS.push({sku:sku,name:full,brand:brand,cat:cat,unit:unit,upb:upb,
                 min:min,boxes:0,price:price,cost:cost,barcode:''});
  if(boxes>0)rbasket[sku]={sku:sku,name:full,upb:upb,qty:boxes};

  ['np-name','np-flavor','np-upb','np-cost','np-price','np-min','np-boxes'].forEach(function(id){
    document.getElementById(id).value='';
  });
  ['rc-cat','rc-brand','stk-cat','stk-brand','mv-cat','mv-brand','pr-cat','pr-brand','aj-cat','aj-brand'].forEach(function(id){
    var e=document.getElementById(id); if(e)e.innerHTML='';
  });
  setupFilters('stk'); setupFilters('mv');
  document.getElementById('rc-cat').innerHTML=''; document.getElementById('rc-brand').innerHTML='';
  fill(document.getElementById('rc-cat'),uniq(PRODUCTS.map(function(x){return x.cat})),'All categories');
  refreshRcBrands();
  toast(full+' created as '+sku+(boxes?' · '+boxes+' boxes added to delivery':''));
  previewSku(); rdraw(); kpis();
});

/* review step before confirming a delivery */
document.getElementById('rb-go').addEventListener('click',function(){
  var a=[];for(var k in rbasket)a.push(rbasket[k]);
  if(!a.length)return;
  var bx=0,un=0;
  document.getElementById('rv2-sup').textContent=document.getElementById('rc-sup').value;
  document.getElementById('rv2-list').innerHTML=a.map(function(it){
    var p=prod(it.sku);
    bx+=it.qty; un+=it.qty*it.upb;
    return '<div class="card"><div class="c-info"><div class="c-name">'+it.name+'</div>'+
    '<div class="c-meta">'+it.sku+' &middot; '+it.upb+' units/box</div>'+
    '<div class="c-meta" style="color:#26603a">'+(p?p.boxes:0)+' &rarr; <b>'+((p?p.boxes:0)+it.qty)+'</b> boxes after</div></div>'+
    '<div class="c-box">'+it.qty+'<small>BOXES</small></div></div>';
  }).join('');
  document.getElementById('rv2-total').textContent=
    bx+' boxes  |  '+un+' units';
  document.getElementById('rv2-ref').value=document.getElementById('rc-ref').value;
  go('rreview');
});

document.getElementById('rv2-go').addEventListener('click',function(){
  var a=[];for(var k in rbasket)a.push(rbasket[k]);
  if(!a.length)return;
  var sup=document.getElementById('rc-sup').value;
  var ref=document.getElementById('rv2-ref').value;
  var notes=document.getElementById('rv2-notes').value;
  var bx=0,un=0;
  var lines=a.map(function(it){
    var p=prod(it.sku);
    bx+=it.qty; un+=it.qty*it.upb;
    return {sku:it.sku,name:it.name,boxes:it.qty,upb:it.upb,price:0,cost:0};
  });
  var num='RCV-'+TODAY.replace(/-/g,'')+'-'+(Math.floor(Math.random()*900)+100);
  var d=new Date();
  var rec={id:num,type:'receipt',cust:sup,date:TODAY,
    time:('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2),
    who:(ME&&ME.name)?ME.name:'Abdu',ref:ref,notes:notes,lines:lines};
  HISTORY.unshift(rec); lastMovement=rec;
  a.forEach(function(it){ var p=prod(it.sku); if(p)p.boxes+=it.qty; });
  document.getElementById('cf-id').textContent=num+'  |  '+sup;
  document.getElementById('cf-sum').textContent=bx+' boxes  |  '+un+' units received';
  document.getElementById('cf-acts').style.display='none';
  document.getElementById('cf-mail').innerHTML='&#128190; Stock increased. Saved as <b>'+num+'</b> in History.';
  rbasket={}; RCOST={};
  document.getElementById('rc-ref').value=''; document.getElementById('rv2-notes').value='';
  kpis(); go('conf');
});


/* ══════════ MANAGER: PRODUCTS ══════════ */
var STAFF=[{name:'Abdu',email:'abduraufkholikov@gmail.com',role:'manager'},
           {name:'Nodir',email:'',role:'worker'}];
var SETTINGS={bizName:'UZBEGIM FOOD MARKET',
  line1:'Wholesale Warehouse \u00b7 Cincinnati, Ohio',
  line2:'abduraufkholikov@gmail.com',
  footer:'Goods remain the property of Uzbegim Food Market until paid in full.',
  low:1.5,target:2,ownerEmail:'abduraufkholikov@gmail.com',emailWhen:'invoice'};

var prodIdx=-1;
function renderProducts(){
  if(!document.getElementById('pd-cat').options.length){
    fill(document.getElementById('pd-cat'),uniq(PRODUCTS.map(function(x){return x.cat})),'All categories');
    refreshPdBrands();
    document.getElementById('pd-only').innerHTML=
      '<option value="">All products</option>'+
      '<option value="nomin">No minimum set</option>'+
      '<option value="nobar">No barcode</option>';
  }
  drawProducts();
}
function refreshPdBrands(){
  var cat=document.getElementById('pd-cat').value,sel=document.getElementById('pd-brand'),was=sel.value;
  var pool=cat?PRODUCTS.filter(function(x){return x.cat===cat}):PRODUCTS;
  var b=uniq(pool.map(function(x){return x.brand}));
  fill(sel,b,cat?('All '+cat.toLowerCase()+' brands'):'All brands');
  sel.value=(b.indexOf(was)>-1)?was:'';
}
function drawProducts(){
  var q=document.getElementById('pd-q').value.toLowerCase().trim();
  var cat=document.getElementById('pd-cat').value,br=document.getElementById('pd-brand').value;
  var only=document.getElementById('pd-only').value;
  var r=PRODUCTS.map(function(p,i){return{p:p,i:i}}).filter(function(x){
    var p=x.p;
    if(q&&(p.name||'').toLowerCase().indexOf(q)<0&&p.sku.toLowerCase().indexOf(q)<0&&(p.brand||'').toLowerCase().indexOf(q)<0)return false;
    if(cat&&p.cat!==cat)return false;
    if(br&&p.brand!==br)return false;
    if(only==='nomin'&&p.min)return false;
    if(only==='nobar'&&p.barcode)return false;
    return true;});
  document.getElementById('pd-count').textContent=r.length+' of '+PRODUCTS.length+' products';
  document.getElementById('pd-list').innerHTML=r.length?r.map(function(x){
    var p=x.p;
    var gaps=[];
    if(!p.min)gaps.push('no minimum');
    if(!p.barcode)gaps.push('no barcode');
    return '<div class="card prod" data-i="'+x.i+'" style="cursor:pointer">'+
      icoCat(p.cat)+'<div class="c-info"><div class="c-name">'+p.name+'</div>'+
      '<div class="c-meta">'+p.sku+' &middot; '+p.brand+' &middot; '+p.upb+' '+p.unit+'/box</div>'+
      '<div class="c-meta">minimum '+(p.min||'—')+' boxes &middot; '+p.boxes+' currently on hand</div>'+
      (gaps.length?'<div class="c-meta cx-miss">'+gaps.join(' &middot; ')+'</div>':'')+
      '</div><div class="c-box">'+p.boxes+'<small>BOXES</small></div></div>';
  }).join(''):'<div class="empty">No products match these filters</div>';
}
['pd-q','pd-cat','pd-brand','pd-only'].forEach(function(id){
  var e=document.getElementById(id); if(!e)return;
  var fn=function(){ if(id==='pd-cat')refreshPdBrands(); drawProducts(); };
  e.addEventListener('input',fn); e.addEventListener('change',fn);
});
(function(){
  var el=document.getElementById('pd-list'); if(!el)return;
  el.addEventListener('click',function(ev){
    var c=ev.target.closest?ev.target.closest('.prod'):null;
    if(c)openProd(parseInt(c.getAttribute('data-i'),10));
  });
})();
function addCatTo(id){
  var n=prompt('New category name'); if(!n||!n.trim())return;
  var sel=document.getElementById(id);
  sel.insertAdjacentHTML('afterbegin','<option>'+n.trim()+'</option>');
  sel.value=n.trim(); previewPeSku(); toast('Category "'+n.trim()+'" added');
}
function addBrandTo(id){
  var n=prompt('New brand name'); if(!n||!n.trim())return;
  var sel=document.getElementById(id);
  sel.insertAdjacentHTML('afterbegin','<option>'+n.trim()+'</option>');
  sel.value=n.trim(); previewPeSku(); toast('Brand "'+n.trim()+'" added');
}
function previewPeSku(){
  var el=document.getElementById('pe-sku'); if(!el)return;
  if(prodIdx>=0){el.textContent='SKU '+PRODUCTS[prodIdx].sku+' (cannot change)';return;}
  el.textContent='SKU will be '+makeSku(document.getElementById('pe-cat').value,
                                        document.getElementById('pe-brand').value);
}
function openProd(i){
  prodIdx=i;
  var p=(i>=0)?PRODUCTS[i]:{};
  document.getElementById('pe-head').textContent=(i>=0)?('Edit '+p.name):'New product';
  var cats=uniq(PRODUCTS.map(function(x){return x.cat}));
  var brands=uniq(PRODUCTS.map(function(x){return x.brand}));
  document.getElementById('pe-cat').innerHTML=cats.map(function(x){return '<option>'+x+'</option>'}).join('');
  document.getElementById('pe-brand').innerHTML=brands.map(function(x){return '<option>'+x+'</option>'}).join('');
  document.getElementById('pe-sup').innerHTML='<option value="">Not set</option>'+
    SUPPLIERS.map(function(x){return '<option>'+x.name+'</option>'}).join('');
  if(i>=0){
    document.getElementById('pe-cat').value=p.cat||'';
    document.getElementById('pe-brand').value=p.brand||'';
    var parts=String(p.name||'').split(' - ');
    document.getElementById('pe-name').value=parts[0]||'';
    document.getElementById('pe-flavor').value=parts.slice(1).join(' - ');
    document.getElementById('pe-unit').value=p.unit||'can';
    document.getElementById('pe-upb').value=p.upb||'';
    document.getElementById('pe-cost').value=p.cost?Number(p.cost).toFixed(2):'';
    document.getElementById('pe-price').value=p.price?Number(p.price).toFixed(2):'';
    document.getElementById('pe-min').value=p.min||'';
    document.getElementById('pe-barcode').value=p.barcode||'';
    document.getElementById('pe-sup').value=p.supplier||'';
  }else{
    ['pe-name','pe-flavor','pe-upb','pe-cost','pe-price','pe-min','pe-barcode'].forEach(function(id){
      document.getElementById(id).value='';});
  }
  previewPeSku();
  go('prodedit');
}
['pe-cat','pe-brand'].forEach(function(id){
  var e=document.getElementById(id); if(e)e.addEventListener('change',previewPeSku);
});
document.getElementById('pd-new').addEventListener('click',function(){openProd(-1)});
document.getElementById('pe-cancel').addEventListener('click',function(){go('products')});
document.getElementById('pe-save').addEventListener('click',function(){
  var v=function(id){return document.getElementById(id).value.trim()};
  var nm=v('pe-name');
  if(!nm){toast('Product name is required');document.getElementById('pe-name').focus();return;}
  var full=nm+(v('pe-flavor')?' - '+v('pe-flavor'):'');
  for(var i=0;i<PRODUCTS.length;i++)
    if(i!==prodIdx&&PRODUCTS[i].name.toLowerCase()===full.toLowerCase()){toast(full+' already exists');return;}
  var rec={
    name:full,cat:v('pe-cat'),brand:v('pe-brand'),unit:v('pe-unit'),
    upb:parseInt(v('pe-upb'),10)||1,
    cost:parseFloat(v('pe-cost'))||0,price:parseFloat(v('pe-price'))||0,
    min:parseInt(v('pe-min'),10)||0,barcode:v('pe-barcode'),supplier:v('pe-sup')
  };
  if(prodIdx>=0){
    rec.sku=PRODUCTS[prodIdx].sku; rec.boxes=PRODUCTS[prodIdx].boxes;
    PRODUCTS[prodIdx]=rec; toast(full+' saved');
  }else{
    rec.sku=makeSku(rec.cat,rec.brand); rec.boxes=0;
    PRODUCTS.push(rec); toast(full+' created as '+rec.sku);
  }
  ['stk','mv','pd','pr','aj'].forEach(function(pfx){
    var c=document.getElementById(pfx+'-cat'),b=document.getElementById(pfx+'-brand');
    if(c)c.innerHTML=''; if(b)b.innerHTML='';
  });
  setupFilters('stk'); setupFilters('mv');
  renderProducts(); kpis(); go('products');
});

/* ══════════ MANAGER: STAFF ══════════ */
function renderStaff(){
  document.getElementById('st-list2').innerHTML=STAFF.map(function(p,i){
    var moves=0;
    HISTORY.forEach(function(h){if(h.who===p.name)moves++;});
    return '<div class="card staff" data-i="'+i+'" style="cursor:pointer">'+icoStaff(p.role)+'<div class="c-info">'+
      '<div class="c-name">'+p.name+(p.name===ME.name?' <span style="color:#8a8780;font-weight:600">(you)</span>':'')+'</div>'+
      '<div class="c-meta"><span class="h-tag '+(p.role==='manager'?'t-invoice':'t-transfer')+'">'+
      p.role.toUpperCase()+'</span> &middot; '+moves+' movements</div>'+
      '<div class="c-meta'+(p.email?'':' cx-miss')+'">'+(p.email||'no email — cannot sign in')+'</div>'+
      '</div></div>';
  }).join('');
}
(function(){
  var el=document.getElementById('st-list2'); if(!el)return;
  el.addEventListener('click',function(ev){
    var c=ev.target.closest?ev.target.closest('.staff'):null;
    if(!c)return;
    var i=parseInt(c.getAttribute('data-i'),10),p=STAFF[i];
    var em=prompt('Google account email for '+p.name,p.email||'');
    if(em!==null)p.email=em.trim();
    var rl=prompt('Role for '+p.name+' — type manager or worker',p.role);
    if(rl!==null&&(rl==='manager'||rl==='worker'))p.role=rl;
    renderStaff(); toast(p.name+' updated');
  });
})();
document.getElementById('sf-add').addEventListener('click',function(){
  var n=document.getElementById('sf-name').value.trim();
  if(!n){toast('Name is required');return;}
  for(var i=0;i<STAFF.length;i++)if(STAFF[i].name.toLowerCase()===n.toLowerCase()){toast(n+' already exists');return;}
  STAFF.push({name:n,email:document.getElementById('sf-email').value.trim(),
              role:document.getElementById('sf-role').value});
  document.getElementById('sf-name').value='';
  document.getElementById('sf-email').value='';
  toast(n+' added'); renderStaff();
});

/* ══════════ MANAGER: SETTINGS ══════════ */
function renderSettings(){
  document.getElementById('se2-name').value=SETTINGS.bizName;
  document.getElementById('se2-line1').value=SETTINGS.line1;
  document.getElementById('se2-line2').value=SETTINGS.line2;
  document.getElementById('se2-foot').value=SETTINGS.footer;
  document.getElementById('se2-low').value=String(SETTINGS.low);
  document.getElementById('se2-target').value=String(SETTINGS.target);
  document.getElementById('se2-email').value=SETTINGS.ownerEmail;
  document.getElementById('se2-when').value=SETTINGS.emailWhen;
}
document.getElementById('se2-save').addEventListener('click',function(){
  SETTINGS.bizName=document.getElementById('se2-name').value.trim();
  SETTINGS.line1=document.getElementById('se2-line1').value.trim();
  SETTINGS.line2=document.getElementById('se2-line2').value.trim();
  SETTINGS.footer=document.getElementById('se2-foot').value.trim();
  SETTINGS.low=parseFloat(document.getElementById('se2-low').value)||1.5;
  SETTINGS.target=parseFloat(document.getElementById('se2-target').value)||2;
  SETTINGS.ownerEmail=document.getElementById('se2-email').value.trim();
  SETTINGS.emailWhen=document.getElementById('se2-when').value;
  OWNER_EMAIL=SETTINGS.ownerEmail;
  kpis(); toast('Settings saved');
  go('menu');
});

/* ══════════ MANAGER: STOCK COUNT ══════════ */
var counts={};
function renderAdjust(){
  if(!document.getElementById('aj-cat').options.length){
    fill(document.getElementById('aj-cat'),uniq(PRODUCTS.map(function(x){return x.cat})),'All categories');
    refreshAjBrands();
  }
  drawAdjust();
}
function refreshAjBrands(){
  var cat=document.getElementById('aj-cat').value, sel=document.getElementById('aj-brand'), was=sel.value;
  var pool=cat?PRODUCTS.filter(function(x){return x.cat===cat}):PRODUCTS;
  var b=uniq(pool.map(function(x){return x.brand}));
  fill(sel,b,cat?('All '+cat.toLowerCase()+' brands'):'All brands');
  sel.value=(b.indexOf(was)>-1)?was:'';
}
function drawAdjust(){
  var q=document.getElementById('aj-q').value.toLowerCase().trim();
  var cat=document.getElementById('aj-cat').value, br=document.getElementById('aj-brand').value;
  var r=PRODUCTS.filter(function(p){
    if(q&&(p.name||'').toLowerCase().indexOf(q)<0&&p.sku.toLowerCase().indexOf(q)<0&&(p.brand||'').toLowerCase().indexOf(q)<0)return false;
    if(cat&&p.cat!==cat)return false; if(br&&p.brand!==br)return false; return true;});
  document.getElementById('aj-count').textContent=r.length+' of '+PRODUCTS.length+' products';
  document.getElementById('aj-list').innerHTML=r.map(function(p){
    var c=counts[p.sku];
    var diff=(c===undefined||c===null||c==='')?null:(Number(c)-p.boxes);
    return '<div class="card">'+icoCat(p.cat)+'<div class="c-info"><div class="c-name">'+p.name+'</div>'+
    '<div class="c-meta">'+p.sku+' &middot; system says <b>'+p.boxes+'</b> boxes</div>'+
    (diff!==null&&diff!==0?'<div class="c-meta" style="color:'+(diff<0?'#B4443F':'#26603a')+';font-weight:800">'+
      (diff>0?'+':'')+diff+' box'+(Math.abs(diff)===1?'':'es')+' '+(diff<0?'missing':'extra')+'</div>':'')+
    '</div><div class="qty"><input type="number" inputmode="numeric" placeholder="count" value="'+(c===undefined?'':c)+'" '+
    'style="width:62px" enterkeyhint="done" onfocus="this.select()" onkeydown="if(event.key===&quot;Enter&quot;){event.preventDefault();this.blur();}" '+
    'oninput="setCount(\''+p.sku+'\',this.value)"></div></div>';
  }).join('')||'<div class="empty">No products match</div>';
  cdraw();
}
function setCount(sku,v){
  if(v===''||v===null)delete counts[sku]; else counts[sku]=v;
  var p=prod(sku); if(!p)return;
  drawAdjustRow(sku); cdraw();
}
function drawAdjustRow(){ drawAdjust(); }
function cdraw(){
  var n=0,diffs=0;
  for(var k in counts){ n++; var p=prod(k); if(p&&Number(counts[k])!==p.boxes)diffs++; }
  var d=document.getElementById('cdock');
  if(!d)return;
  d.classList.toggle('on',lastScreen==='adjust');
  document.getElementById('cb-n').textContent=n?(n+' counted · '+diffs+' differ'):'Nothing counted yet';
  document.getElementById('cb-go').disabled=diffs===0;
}
['aj-q','aj-cat','aj-brand'].forEach(function(id){
  var e=document.getElementById(id); if(!e)return;
  var fn=function(){ if(id==='aj-cat')refreshAjBrands(); drawAdjust(); };
  e.addEventListener('input',fn); e.addEventListener('change',fn);
});

document.getElementById('cb-go').addEventListener('click',function(){
  var lines=[],bx=0;
  for(var k in counts){
    var p=prod(k); if(!p)continue;
    var c=Number(counts[k]); if(isNaN(c))continue;
    var d=c-p.boxes; if(d===0)continue;
    lines.push({sku:p.sku,name:p.name,boxes:Math.abs(d),upb:p.upb,price:0,cost:p.cost||0,dir:d>0?'found':'missing',delta:d});
    bx+=Math.abs(d);
  }
  if(!lines.length)return;
  if(!confirm('Post '+lines.length+' adjustment'+(lines.length===1?'':'s')+'?\n\nStock will be set to what you counted. This is recorded permanently.'))return;
  var num='ADJ-'+TODAY.replace(/-/g,'')+'-'+(Math.floor(Math.random()*900)+100);
  var d=new Date();
  var rec={id:num,type:'transfer',cust:'Stock count',date:TODAY,
    time:('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2),
    who:(ME&&ME.name)?ME.name:'Abdu',ref:'',notes:'Physical count adjustment',lines:lines};
  HISTORY.unshift(rec); lastMovement=rec;
  lines.forEach(function(l){ prod(l.sku).boxes+=l.delta; });
  counts={};
  document.getElementById('cf-id').textContent=num+'  |  Stock count';
  document.getElementById('cf-sum').textContent=lines.length+' product'+(lines.length===1?'':'s')+' adjusted  |  '+bx+' boxes';
  document.getElementById('cf-acts').style.display='none';
  document.getElementById('cf-mail').innerHTML='&#128190; Stock now matches your count. Saved as <b>'+num+'</b>.';
  kpis(); go('conf');
});

/* ══════════ MANAGER: PRICES ══════════ */
function renderPrices(){
  if(!document.getElementById('pr-cat').options.length){
    fill(document.getElementById('pr-cat'),uniq(PRODUCTS.map(function(x){return x.cat})),'All categories');
    refreshPrBrands();
    var sel=document.getElementById('pr-cust');
    sel.innerHTML='<option value="">All customers — standard only</option>'+
      CUSTOMERS.filter(function(c){return c.kind==='invoice'})
        .map(function(c){return '<option value="'+c.name+'">'+c.name+'</option>'}).join('');
    document.getElementById('pr-only').innerHTML=
      '<option value="">All products</option>'+
      '<option value="nocost">Missing cost</option>'+
      '<option value="custom">Has custom price</option>'+
      '<option value="low">Margin under 15%</option>';
  }
  drawPrices();
}
function refreshPrBrands(){
  var cat=document.getElementById('pr-cat').value, sel=document.getElementById('pr-brand'), was=sel.value;
  var pool=cat?PRODUCTS.filter(function(x){return x.cat===cat}):PRODUCTS;
  var b=uniq(pool.map(function(x){return x.brand}));
  fill(sel,b,cat?('All '+cat.toLowerCase()+' brands'):'All brands');
  sel.value=(b.indexOf(was)>-1)?was:'';
}
/* custom prices live here; empty means "use the standard price" */
var CUSTOM={};        /* customer + single product  */
var CUSTBRAND={};     /* customer + whole brand     */
var BRANDPRICE={};    /* standard price for a brand */
var BRANDCOST={};     /* standard cost for a brand  */

function num(v){return (v===undefined||v===null||v==='')?null:Number(v);}

/* what this customer pays, most specific rule wins */
function customPrice(cust,sku){ return num(CUSTOM[cust+'|'+sku]); }
function custBrandPrice(cust,brand){ return num(CUSTBRAND[cust+'|'+brand]); }

function stdPrice(p){
  var b=num(BRANDPRICE[p.brand]);
  return (p.price)?p.price:(b!==null?b:0);
}
function effPrice(cust,p){
  if(cust){
    var a=customPrice(cust,p.sku);      if(a!==null)return a;
    var b=custBrandPrice(cust,p.brand); if(b!==null)return b;
  }
  return stdPrice(p);
}
/* where the price came from, so the screen can say so */
function priceSource(cust,p){
  if(cust){
    if(customPrice(cust,p.sku)!==null)return 'this product';
    if(custBrandPrice(cust,p.brand)!==null)return p.brand+' brand rule';
  }
  if(p.price)return 'standard price';
  if(num(BRANDPRICE[p.brand])!==null)return p.brand+' brand default';
  return 'not set';
}
var priceMode='prod';
(function(){
  var t=document.querySelectorAll('.tab[data-pm]');
  for(var i=0;i<t.length;i++)t[i].addEventListener('click',function(){
    for(var j=0;j<t.length;j++)t[j].classList.remove('on');
    this.classList.add('on');
    priceMode=this.getAttribute('data-pm');
    drawPrices();
  });
})();

function drawPrices(){
  if(priceMode==='brand')return drawBrandPrices();
  document.getElementById('pr-list').className='list price-products';
  var q=document.getElementById('pr-q').value.toLowerCase().trim();
  var cat=document.getElementById('pr-cat').value;
  var br=document.getElementById('pr-brand').value;
  var cust=document.getElementById('pr-cust').value;
  var only=document.getElementById('pr-only').value;

  var r=PRODUCTS.filter(function(p){
    if(q&&(p.name||'').toLowerCase().indexOf(q)<0&&p.sku.toLowerCase().indexOf(q)<0&&(p.brand||'').toLowerCase().indexOf(q)<0)return false;
    if(cat&&p.cat!==cat)return false;
    if(br&&p.brand!==br)return false;
    if(only==='nocost'&&p.cost)return false;
    if(only==='custom'&&!(cust&&customPrice(cust,p.sku)!==null))return false;
    if(only==='low'){
      var pp=effPrice(cust,p);
      if(!pp||100*(pp-(p.cost||0))/pp>=15)return false;
    }
    return true;});

  document.getElementById('pr-count').textContent=
    r.length+' of '+PRODUCTS.length+(cust?(' \u00b7 '+cust):' \u00b7 standard prices');

  document.getElementById('pr-list').innerHTML=r.map(function(p){
    var cp   = cust?customPrice(cust,p.sku):null;
    var eff  = effPrice(cust,p);
    var m    = eff?100*(eff-(p.cost||0))/eff:0;
    var mc   = m<15?'#B4443F':(m>=30?'#26603a':'#7d5108');
    var mkup = p.cost?100*(eff-p.cost)/p.cost:0;
    var src  = priceSource(cust,p);

    var head='<div class="c-name">'+p.name+'</div>'+
      '<div class="c-meta">'+p.sku+' &middot; '+p.brand+' &middot; '+p.cat+'</div>'+
      '<div class="c-meta" id="pm-'+p.sku+'" style="color:'+mc+';font-weight:800">'+
      m.toFixed(0)+'% margin &middot; '+mkup.toFixed(0)+'% markup &middot; '+money(eff-(p.cost||0))+'/box</div>'+
      '<div class="c-meta" id="ps-'+p.sku+'">'+money(eff)+' from '+src+'</div>';

    var fields=
      '<div class="price-fields" style="display:flex;gap:6px;align-items:flex-end">'+
      pstatic('COST',p.cost||0)+
      pfield('NORMAL',p.price,"setSell('"+p.sku+"',this.value)","#0F5C5C",true)+
      (cust?pfield(cust.split(' ')[0].toUpperCase(),cp,"setCustPrice('"+p.sku+"','"+cust+"',this.value)","#C1622D",true):'')+
      '</div>';

    return '<div class="card price-row price-product" style="align-items:flex-start;flex-direction:column;gap:9px">'+
      '<div class="price-identity" style="display:flex;gap:11px;width:100%;align-items:flex-start">'+
      icoCat(p.cat)+'<div class="c-info" style="flex:1">'+head+'</div></div>'+fields+'</div>';
  }).join('')||'<div class="empty">No products match these filters</div>';
}

/* ── one row per brand: set once, every flavour follows ── */
function drawBrandPrices(){
  document.getElementById('pr-list').className='list price-brands';
  var q=document.getElementById('pr-q').value.toLowerCase().trim();
  var cat=document.getElementById('pr-cat').value;
  var cust=document.getElementById('pr-cust').value;

  var pool=PRODUCTS.filter(function(p){return !cat||p.cat===cat});
  var brands={};
  pool.forEach(function(p){
    if(q&&(p.brand||'').toLowerCase().indexOf(q)<0)return;
    var b=brands[p.brand]||(brands[p.brand]={name:p.brand,n:0,cats:{},cost:0,costN:0,sell:0,sellN:0,over:0});
    b.n++; b.cats[p.cat]=1;
    if(p.cost){b.cost+=p.cost;b.costN++;}
    if(p.price){b.sell+=p.price;b.sellN++;}
    if(cust&&customPrice(cust,p.sku)!==null)b.over++;
  });
  var list=[];for(var k in brands)list.push(brands[k]);
  list.sort(function(a,b){return b.n-a.n});

  document.getElementById('pr-count').textContent=
    list.length+' brands'+(cust?(' \u00b7 '+cust):' \u00b7 standard prices');

  document.getElementById('pr-list').innerHTML=list.map(function(b){
    var cb   = cust?custBrandPrice(cust,b.name):null;
    var bs   = num(BRANDPRICE[b.name]);
    var bc   = num(BRANDCOST[b.name]);
    var avgC = b.costN?(b.cost/b.costN):0;
    var avgS = b.sellN?(b.sell/b.sellN):0;
    var shown= cb!==null?cb:(bs!==null?bs:avgS);
    var costShown = bc!==null?bc:avgC;
    var m = shown?100*(shown-costShown)/shown:0;
    var mc= m<15?'#B4443F':(m>=30?'#26603a':'#7d5108');

    var firstCat=Object.keys(b.cats)[0];
    return '<div class="card price-row price-brand" style="align-items:flex-start;flex-direction:column;gap:9px">'+
      '<div class="price-identity" style="display:flex;gap:11px;width:100%;align-items:flex-start">'+
      icoBrand(b.name,firstCat,'lg')+
      '<div class="c-info" style="flex:1">'+
      '<div class="c-name">'+b.name+'</div>'+
      '<div class="c-meta">'+Object.keys(b.cats).join(', ')+'</div>'+
      (b.over?'<div class="c-meta cx-miss">'+b.over+' custom product price'+(b.over===1?'':'s')+'</div>'
             :'<div class="c-meta brand-mobile-detail">applies to every product in this brand</div>')+
      '</div></div>'+
      '<div class="price-brand-metrics">'+
      '<div class="price-metric"><b>'+b.n+'</b><span>Products</span></div>'+
      '<div class="price-metric"><b style="color:'+mc+'">'+m.toFixed(0)+'%</b><span>Margin</span></div>'+
      '<div class="price-metric"><b>'+money(shown)+'</b><span>Avg price</span></div>'+
      '</div>'+
      '<div class="price-fields" style="display:flex;gap:6px;align-items:flex-end">'+
      pstatic('COST',costShown)+
      pfield('NORMAL',bs,"setBrandSell('"+b.name.replace(/'/g,"\\'")+"',this.value)","#0F5C5C",true)+
      (cust?pfield(cust.split(' ')[0].toUpperCase(),cb,"setCustBrand('"+b.name.replace(/'/g,"\\'")+"','"+cust+"',this.value)","#C1622D",true):'')+
      '</div>'+
      '<button class="btn ghost brand-apply" style="margin-top:2px;padding:9px;font-size:11.5px" '+
      'onclick="applyBrand(\''+b.name.replace(/'/g,"\\'")+'\',\''+(cust||'')+'\')">Apply to '+b.n+' products</button>'+
      '</div>';
  }).join('')||'<div class="empty">No brands match</div>';
}

function setBrandCost(brand,v){ if(v===''||v===null)delete BRANDCOST[brand]; else BRANDCOST[brand]=parseFloat(v)||0; }
function setBrandSell(brand,v){ if(v===''||v===null)delete BRANDPRICE[brand]; else BRANDPRICE[brand]=parseFloat(v)||0; }
function setCustBrand(brand,cust,v){
  var k=cust+'|'+brand;
  if(v===''||v===null)delete CUSTBRAND[k]; else CUSTBRAND[k]=parseFloat(v)||0;
}
/* optional: bake the rule into each product, and clear per-product overrides */
function applyBrand(brand,cust){
  var members=PRODUCTS.filter(function(p){return p.brand===brand});
  var bs=num(BRANDPRICE[brand]), bc=num(BRANDCOST[brand]);
  var cb=cust?custBrandPrice(cust,brand):null;
  if(bs===null&&bc===null&&cb===null){toast('Type a price for '+brand+' first');return;}
  var what=[];
  if(bc!==null)what.push('cost '+money(bc));
  if(bs!==null)what.push('price '+money(bs));
  if(cb!==null)what.push(cust+' '+money(cb));
  if(!confirm('Write '+what.join(', ')+' onto all '+members.length+' '+brand+' products?\n\nAny product that had its own different price will be overwritten.'))return;
  members.forEach(function(p){
    if(bc!==null)p.cost=bc;
    if(bs!==null)p.price=bs;
    if(cb!==null)CUSTOM[cust+'|'+p.sku]=cb;
  });
  toast(members.length+' '+brand+' products updated');
  drawPrices(); kpis();
}
/* cost is set when goods are received, never typed here */
function pstatic(lab,val){
  return '<div style="text-align:center">'+
    '<div style="font-size:8.5px;color:#8a8780;font-weight:800;letter-spacing:.4px;margin-bottom:3px">'+lab+'</div>'+
    '<div style="width:74px;padding:8px 4px;border:1.5px dashed #ddd9d1;border-radius:9px;'+
    'text-align:center;font-weight:800;font-size:12.5px;color:#8a8780;background:#faf9f6">'+
    (val?Number(val).toFixed(2):'\u2014')+'</div></div>';
}
function pfield(lab,val,handler,colour,allowBlank){
  return '<div style="text-align:center">'+
    '<div style="font-size:8.5px;color:#8a8780;font-weight:800;letter-spacing:.4px;margin-bottom:3px">'+lab+'</div>'+
    '<input type="number" step="0.01" inputmode="decimal" placeholder="'+(allowBlank?'normal':'0.00')+'" '+
    'style="width:74px;padding:7px 4px;border:1.5px solid '+colour+';border-radius:9px;text-align:center;'+
    'font-weight:800;font-size:12.5px;font-family:inherit" '+
    'enterkeyhint="done" onfocus="this.select()" '+
    'onkeydown="if(event.key===&quot;Enter&quot;){event.preventDefault();this.blur();}" '+
    'value="'+(val===null||val===undefined||val===''?'':Number(val).toFixed(2))+'" oninput="'+handler+'"></div>';
}
['pr-q','pr-cat','pr-brand','pr-cust','pr-only'].forEach(function(id){
  var e=document.getElementById(id); if(!e)return;
  var fn=function(){ if(id==='pr-cat')refreshPrBrands(); drawPrices(); };
  e.addEventListener('input',fn); e.addEventListener('change',fn);
});
/* full redraw only once the user leaves a price field */
document.getElementById('pr-list').addEventListener('focusout',function(e){
  if(e.target&&e.target.tagName==='INPUT')setTimeout(function(){
    if(!document.getElementById('pr-list').contains(document.activeElement))drawPrices();
  },80);
});
/* Values are stored on every keystroke, but the row is NOT redrawn —
   redrawing steals focus and you lose everything after the first digit.
   Only the small margin line under the name is refreshed. */
function setCost(sku,v){var p=prod(sku);if(p){p.cost=parseFloat(v)||0;refreshMargin(sku);}}
function setSell(sku,v){var p=prod(sku);if(p){p.price=parseFloat(v)||0;refreshMargin(sku);}}
function setCustPrice(sku,cust,v){
  var k=cust+'|'+sku;
  if(v===''||v===null||v===undefined)delete CUSTOM[k];
  else CUSTOM[k]=parseFloat(v)||0;
  refreshMargin(sku);
}
function refreshMargin(sku){
  var p=prod(sku); if(!p)return;
  var cust=document.getElementById('pr-cust').value;
  var eff=cust?effPrice(cust,p):p.price;
  var m=eff?100*(eff-(p.cost||0))/eff:0;
  var mk=p.cost?100*(eff-p.cost)/p.cost:0;
  var el=document.getElementById('pm-'+sku);
  if(el){
    el.style.color=m<15?'#B4443F':(m>=30?'#26603a':'#7d5108');
    el.innerHTML=m.toFixed(0)+'% margin &middot; '+mk.toFixed(0)+'% markup &middot; '+money(eff-(p.cost||0))+'/box';
  }
  var note=document.getElementById('pn-'+sku);
  if(note)note.style.display=(cust&&customPrice(cust,sku)===null)?'block':'none';
}

/* ══════════ MANAGER: CUSTOMERS ══════════ */
var editIdx=-1;
function fullAddr(o){
  var l1=o.address||'';
  var l2=[o.city,o.state].filter(Boolean).join(', ');
  if(o.zip)l2=(l2?l2+' ':'')+o.zip;
  return [l1,l2].filter(Boolean).join(', ');
}
function partyStats(name,isSup){
  var moves=0,boxes=0,rev=0,cost=0,last='';
  HISTORY.forEach(function(h){
    if(h.cust!==name)return;
    if(isSup&&h.type!=='receipt')return;
    if(!isSup&&h.type==='receipt')return;
    moves++;
    if(h.date>last)last=h.date;
    h.lines.forEach(function(l){boxes+=l.boxes;rev+=l.boxes*l.price;cost+=l.boxes*(l.cost||0);});
  });
  return {moves:moves,boxes:boxes,rev:rev,cost:cost,last:last};
}
function partyCard(o,i,isSup){
  var st=partyStats(o.name,isSup);
  var addr=fullAddr(o);
  var rows='';
  rows+='<i>&#128100;</i><span'+(o.contact?'':' class="cx-miss"')+'>'+(o.contact||'no contact person')+'</span>';
  rows+='<i>&#128222;</i><span'+(o.phone?'':' class="cx-miss"')+'>'+(o.phone||'no phone')+'</span>';
  if(o.email)rows+='<i>&#9993;</i><span>'+o.email+'</span>';
  rows+='<i>&#128205;</i><span'+(addr?'':' class="cx-miss"')+'>'+(addr||'no address')+'</span>';
  if(o.notes)rows+='<i>&#128221;</i><span>'+o.notes+'</span>';
  var tag=isSup?'<span class="h-tag t-receipt">SUPPLIER</span>'
    :'<span class="h-tag t-transfer">DESTINATION</span>';
  var stats='<div class="cx-stats">'+
    '<div class="cx-s"><div class="cx-sv">'+st.moves+'</div><div class="cx-sl">'+(isSup?'DELIVERIES':'MOVEMENTS')+'</div></div>'+
    '<div class="cx-s"><div class="cx-sv">'+st.boxes+'</div><div class="cx-sl">BOXES</div></div>'+
    (st.last?'<div class="cx-s" style="margin-left:auto;text-align:right"><div class="cx-sv" style="font-size:11px;color:#8a8780">'+nice(st.last)+'</div><div class="cx-sl">LAST</div></div>':'')+
    '</div>';
  return '<div class="card party" data-i="'+i+'" data-sup="'+(isSup?'1':'0')+'" '+
    'style="flex-direction:column;align-items:stretch;cursor:pointer">'+
    '<div class="cx"><div class="cx-top" style="align-items:center">'+
    icoParty(o.name,isSup?'supplier':(o.kind==='invoice'?'invoice':'transfer'))+
    '<div class="cx-name" style="flex:1">'+o.name+'</div>'+tag+'</div>'+
    '<div class="cx-rows">'+rows+'</div>'+stats+'</div></div>';
}
function renderCusts(){
  var q=(document.getElementById('cu-q').value||'').toLowerCase().trim();
  var list=CUSTOMERS.map(function(c,i){return {o:c,i:i}})
    .filter(function(x){return !q||x.o.name.toLowerCase().indexOf(q)>=0});
  document.getElementById('cu-list').innerHTML=list.length
    ? list.map(function(x){return partyCard(x.o,x.i,false)}).join('')
    : '<div class="empty">No customers match</div>';
  var q2=(document.getElementById('sp-q').value||'').toLowerCase().trim();
  var l2=SUPPLIERS.map(function(c,i){return {o:c,i:i}})
    .filter(function(x){return !q2||x.o.name.toLowerCase().indexOf(q2)>=0});
  document.getElementById('sup-list').innerHTML=l2.length
    ? l2.map(function(x){return partyCard(x.o,x.i,true)}).join('')
    : '<div class="empty">No suppliers match</div>';
}
['cu-q','sp-q'].forEach(function(id){
  var e=document.getElementById(id); if(e)e.addEventListener('input',renderCusts);
});
/* delegated so it survives every re-render */
['cu-list','sup-list'].forEach(function(id){
  var el=document.getElementById(id); if(!el)return;
  el.addEventListener('click',function(ev){
    var card=ev.target.closest?ev.target.closest('.party'):null;
    if(!card)return;
    var i=parseInt(card.getAttribute('data-i'),10);
    if(card.getAttribute('data-sup')==='1')openSup(i); else openCust(i);
  });
});
function openCust(i){
  editIdx=i;
  var c=(i>=0)?CUSTOMERS[i]:{kind:'invoice'};
  document.getElementById('ce-head').textContent=(i>=0)?('Edit '+c.name):'New customer';
  var map={'ce-name':'name','ce-kind':'kind','ce-contact':'contact','ce-phone':'phone',
           'ce-email':'email','ce-addr':'address','ce-city':'city','ce-state':'state',
           'ce-zip':'zip','ce-terms':'terms','ce-notes':'notes'};
  for(var id in map)document.getElementById(id).value=c[map[id]]||'';
  if(i<0)document.getElementById('ce-kind').value='invoice';
  go('custedit');
}
document.getElementById('cu-new').addEventListener('click',function(){openCust(-1)});
document.getElementById('ce-cancel').addEventListener('click',function(){go('custs')});
document.getElementById('ce-save').addEventListener('click',function(){
  var v=function(id){return document.getElementById(id).value.trim()};
  var name=v('ce-name');
  if(!name){toast('Customer name is required');document.getElementById('ce-name').focus();return;}
  var dup=findCust(name);
  if(dup&&(editIdx<0||CUSTOMERS[editIdx]!==dup)){toast(name+' already exists');return;}
  var rec={name:name,kind:v('ce-kind'),contact:v('ce-contact'),phone:v('ce-phone'),
    email:v('ce-email'),address:v('ce-addr'),city:v('ce-city'),state:v('ce-state'),
    zip:v('ce-zip'),terms:v('ce-terms'),notes:v('ce-notes')};
  if(editIdx>=0){rec.key=CUSTOMERS[editIdx].key;CUSTOMERS[editIdx]=rec;toast(name+' saved');}
  else{rec.key='C'+(CUSTOMERS.length+1)+Math.floor(Math.random()*90);CUSTOMERS.push(rec);
       toast(name+' added');}
  renderCusts(); kpis(); go('custs');
});
function openSup(i){
  editIdx=i;
  var sp=(i>=0)?SUPPLIERS[i]:{};
  document.getElementById('se-head').textContent=(i>=0)?('Edit '+sp.name):'New supplier';
  var map={'se-name':'name','se-contact':'contact','se-phone':'phone','se-email':'email',
           'se-addr':'address','se-city':'city','se-state':'state','se-zip':'zip',
           'se-terms':'terms','se-notes':'notes'};
  for(var id in map)document.getElementById(id).value=sp[map[id]]||'';
  go('supedit');
}
document.getElementById('sp-new').addEventListener('click',function(){openSup(-1)});
document.getElementById('se-cancel').addEventListener('click',function(){go('custs')});
document.getElementById('se-save').addEventListener('click',function(){
  var v=function(id){return document.getElementById(id).value.trim()};
  var name=v('se-name');
  if(!name){toast('Company name is required');document.getElementById('se-name').focus();return;}
  var dup=findSup(name);
  if(dup&&(editIdx<0||SUPPLIERS[editIdx]!==dup)){toast(name+' already exists');return;}
  var rec={name:name,contact:v('se-contact'),phone:v('se-phone'),email:v('se-email'),
    address:v('se-addr'),city:v('se-city'),state:v('se-state'),zip:v('se-zip'),
    terms:v('se-terms'),notes:v('se-notes')};
  if(editIdx>=0)SUPPLIERS[editIdx]=rec; else SUPPLIERS.push(rec);
  var sel=document.getElementById('rc-sup');
  if(sel)sel.innerHTML=SUPPLIERS.map(function(x){return '<option>'+x.name+'</option>'}).join('');
  toast(name+' saved'); renderCusts(); go('custs');
});
(function(){
  var t=document.querySelectorAll('.tab[data-ct]');
  for(var i=0;i<t.length;i++)t[i].addEventListener('click',function(){
    for(var j=0;j<t.length;j++)t[j].classList.remove('on');
    this.classList.add('on');
    var sup=this.getAttribute('data-ct')==='sup';
    document.getElementById('cu-pane').style.display=sup?'none':'block';
    document.getElementById('sup-pane').style.display=sup?'block':'none';
  });
})();



function isManager(){return !ME||ME.role!=='worker';}
var toastTimer=null;
function toast(msg){
  var t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){t.classList.remove('on')},2600);
}
function setQty(sku,val,typed){
  var p=prod(sku);
  if(!p)return;
  var n=parseInt(val,10);
  var capped=false;
  if(isNaN(n)||n<=0){delete basket[sku];n=0;}
  else{
    if(n>p.boxes){n=p.boxes;capped=true;}
    if(n<=0)delete basket[sku];
    else basket[sku]={sku:sku,name:p.name,upb:p.upb,price:p.price,cat:p.cat,brand:p.brand,qty:n};
  }
  if(capped){
    toast('Only '+p.boxes+' box'+(p.boxes===1?'':'es')+' of '+p.name+' in stock');
    if(navigator.vibrate)navigator.vibrate(60);
  }
  updateRow(sku,capped);
  drawBasket();
}
function updateRow(sku,flash){
  var p=prod(sku);if(!p)return;
  var inb=basket[sku]?basket[sku].qty:0,rem=p.boxes-inb;
  var box=document.getElementById('q-'+sku);
  if(box){
    if(String(inb||'')!==box.value)box.value=inb||'';
    if(flash){box.classList.add('over');setTimeout(function(){box.classList.remove('over')},1400);}
  }
  var lab=document.getElementById('rem-'+sku);
  if(lab){
    var st=statusOf(p);
    lab.innerHTML=rem+' of '+p.boxes+' boxes left &middot; <span class="pill s-'+st+'" style="font-size:9px">'+label(st)+'</span>';
    lab.className='c-meta c-rem'+(rem<=0?' none':'');
  }
}
function bump(sku,d){
  var p=prod(sku);if(!p)return;
  var c=basket[sku]?basket[sku].qty:0;
  if(d>0&&c>=p.boxes){
    toast('Only '+p.boxes+' box'+(p.boxes===1?'':'es')+' of '+p.name+' in stock');
    if(navigator.vibrate)navigator.vibrate(60);
    return;
  }
  setQty(sku,c+d);
}
function drop(sku){delete basket[sku];updateRow(sku);drawBasket();}
function basketArr(){var a=[];for(var k in basket)a.push(basket[k]);return a;}
function drawBasket(){
  var a=basketArr(),bx=0;for(var i=0;i<a.length;i++)bx+=a[i].qty;
  document.getElementById('bb-n').textContent=a.length?(a.length+(a.length===1?' product':' products')):'Basket empty';
  document.getElementById('bb-b').textContent=bx+' boxes';
  document.getElementById('bb-go').disabled=a.length===0;
  var d=document.getElementById('hi-basket');
  if(d){d.textContent=bx;d.style.display=a.length?'flex':'none';}
}

document.getElementById('bb-go').addEventListener('click',function(){
  var a=basketArr(),bx=0,un=0;
  document.getElementById('rv-list').innerHTML=a.map(function(it){
    bx+=it.qty;un+=it.qty*it.upb;
    return '<div class="card"><div class="c-info"><div class="c-name">'+it.name+'</div><div class="c-meta">'+it.sku+' &middot; '+it.upb+' units/box</div></div><div class="c-box">'+it.qty+'<small>BOXES</small></div></div>';
  }).join('');
  document.getElementById('rv-total').textContent=bx+' boxes  |  '+un+' units';
  repriceReview();
  document.getElementById('rv-cust').onchange=repriceReview;
  document.getElementById('rv-cust').innerHTML='<option value="">Select destination...</option>'+CUSTOMERS.map(function(c){return'<option value="'+c.key+'">'+c.name+'</option>'}).join('');
  go('review');
});
function repriceReview(){
  var a=basketArr(),bx=0,un=0;
  document.getElementById('rv-list').innerHTML=a.map(function(it){
    bx+=it.qty;un+=it.qty*it.upb;
    return '<div class="card"><div class="c-info"><div class="c-name">'+it.name+'</div>'+
    '<div class="c-meta">'+it.sku+' &middot; '+it.upb+' units/box</div></div>'+
    '<div class="c-box">'+it.qty+'<small>BOXES</small></div></div>';
  }).join('');
  document.getElementById('rv-total').innerHTML=bx+' boxes  |  '+un+' units';
}

document.getElementById('rv-go').addEventListener('click',function(){
  var id=document.getElementById('rv-cust').value;
  if(!id){alert('Select a destination first');return;}
  var c=findCust(id);
  if(!c){toast('Could not find that customer');return;}
  var a=basketArr(),bx=0,un=0;
  var lines=a.map(function(it){
    var p=prod(it.sku);
    bx+=it.qty;un+=it.qty*it.upb;
    return{sku:it.sku,name:it.name,boxes:it.qty,upb:it.upb,price:0,cost:0,cat:it.cat,brand:it.brand};});
  var d=new Date();
  var num=(c.kind==='transfer'?'MOV-':'OUT-')+TODAY.replace(/-/g,'')+'-'+(Math.floor(Math.random()*900)+100);
  var rec={id:num,type:c.kind,cust:c.name,date:TODAY,time:('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2),who:'Abdu',ref:'',notes:document.getElementById('rv-notes').value,lines:lines};
  HISTORY.unshift(rec);lastMovement=rec;
  for(var j=0;j<a.length;j++)prod(a[j].sku).boxes-=a[j].qty;
  document.getElementById('cf-id').textContent=num+'  |  '+c.name;
  document.getElementById('cf-sum').textContent=bx+' boxes  |  '+un+' units moved out';
  document.getElementById('cf-acts').style.display='none';
  document.getElementById('cf-mail').innerHTML='&#128190; Stock decreased. Saved as <b>'+num+'</b> in Movement history.';
  basket={};document.getElementById('rv-notes').value='';kpis();go('conf');
});
document.getElementById('cf-back').addEventListener('click',function(){go('menu')});
document.getElementById('cf-open').addEventListener('click',function(){pdfAction(lastMovement,'open')});
document.getElementById('cf-save').addEventListener('click',function(){pdfAction(lastMovement,'save')});
document.getElementById('cf-share').addEventListener('click',function(){pdfAction(lastMovement,'share')});

function buildPDF(m){
  if(!m)return null;
  var jsPDF=window.jspdf.jsPDF,doc=new jsPDF({unit:'pt',format:'a4'});
  var W=595,L=45,y=55;
  doc.setFillColor(15,92,92);doc.rect(0,0,W,90,'F');
  doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(20);
  doc.text(SETTINGS.bizName,L,50);
  doc.setFont('helvetica','normal');doc.setFontSize(9);
  doc.text(SETTINGS.line1+'  |  '+SETTINGS.line2,L,68);
  y=125;doc.setTextColor(30);
  doc.setFont('helvetica','bold');doc.setFontSize(15);
  doc.text(m.type==='invoice'?'INVOICE':m.type==='receipt'?'GOODS RECEIPT':'TRANSFER NOTE',L,y);
  doc.setFontSize(10);doc.setFont('helvetica','normal');
  doc.text('No.  '+m.id,L,y+18);
  doc.text('Date  '+nice(m.date)+'  '+(m.time||''),L,y+33);
  doc.text('Prepared by  '+m.who,L,y+48);
  doc.setFont('helvetica','bold');doc.text(m.type==='receipt'?'SUPPLIER':'BILL TO',360,y+18);
  doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text(String(m.cust),360,y+34);
  doc.setFont('helvetica','normal');doc.setFontSize(9);
  var yy=y+48;
  var party=(m.type==='receipt')?findSup(m.cust):findCust(m.cust);
  var pa=party?fullAddr(party):'';
  if(party&&party.contact){doc.text(String(party.contact).substring(0,42),360,yy);yy+=12;}
  if(pa){doc.text(String(pa).substring(0,42),360,yy);yy+=12;}
  if(party&&party.phone){doc.text(String(party.phone),360,yy);yy+=12;}
  if(m.notes){doc.setFontSize(8.5);doc.text('Notes: '+String(m.notes).substring(0,42),360,yy);}
  doc.setFontSize(10);
  y=y+75;
  doc.setFillColor(240,238,232);doc.rect(L,y,W-2*L,22,'F');
  doc.setFont('helvetica','bold');doc.setFontSize(9);
  doc.text('SKU',L+8,y+15);doc.text('PRODUCT',L+95,y+15);
  doc.text('BOXES',SHOW_PRICING?330:400,y+15);doc.text('UNITS',SHOW_PRICING?380:470,y+15);
  if(SHOW_PRICING){doc.text('PRICE/BOX',430,y+15);doc.text('TOTAL',510,y+15);}
  y+=22;doc.setFont('helvetica','normal');
  var bx=0,un=0,tot=0;
  for(var i=0;i<m.lines.length;i++){
    var l=m.lines[i];bx+=l.boxes;un+=l.boxes*l.upb;tot+=l.boxes*l.price;
    if(i%2)doc.setFillColor(250,249,246),doc.rect(L,y,W-2*L,20,'F');
    doc.setFontSize(8);doc.text(l.sku,L+8,y+14);
    doc.setFontSize(9);doc.text(String(l.name).substring(0,32),L+95,y+14);
    doc.text(String(l.boxes),SHOW_PRICING?340:410,y+14);doc.text(String(l.boxes*l.upb),SHOW_PRICING?385:475,y+14);
    if(SHOW_PRICING){doc.text(l.price?money(l.price):'-',440,y+14);
    doc.text(l.price?money(l.boxes*l.price):'-',508,y+14);}
    y+=20;
    if(y>720){doc.addPage();y=60;}
  }
  doc.setDrawColor(200);doc.line(L,y,W-L,y);y+=20;
  doc.setFont('helvetica','bold');doc.setFontSize(10);
  doc.text('Total boxes: '+bx,L+8,y);doc.text('Total units: '+un,L+140,y);
  if(SHOW_PRICING&&tot){doc.setFontSize(13);doc.setTextColor(15,92,92);doc.text('GRAND TOTAL  '+money(tot),380,y);}
  y+=40;doc.setTextColor(120);doc.setFont('helvetica','normal');doc.setFontSize(8);
  doc.text(SETTINGS.footer,L,y);
  return doc;
}

function renderAttn(){
  var r=PRODUCTS.filter(function(p){var s=statusOf(p);return s==='ORDER'||s==='OUT'||s==='LOW'});
  r.sort(function(a,b){return(a.boxes/(a.min||1))-(b.boxes/(b.min||1))});
  document.getElementById('at-list').innerHTML=r.length?r.map(function(p){var s=statusOf(p);
    return '<div class="card'+(s==='OUT'?' dead':' hot')+'">'+icoCat(p.cat)+'<div class="c-info"><div class="c-name">'+p.name+'</div><div class="c-meta">'+p.sku+' &middot; min '+p.min+' boxes</div><div style="margin-top:5px"><span class="pill s-'+s+'">'+label(s)+'</span> <span style="font-size:10.5px;font-weight:700;color:#8f451c">order +'+Math.max(0,p.min*2-p.boxes)+'</span></div></div><div class="c-box">'+p.boxes+'<small>ON HAND</small></div></div>';
  }).join(''):'<div class="empty">Everything is above minimum</div>';
}

function renderHist(){
  document.getElementById('hs-type').innerHTML='<option value="">All types</option><option value="invoice">Stock out</option><option value="transfer">Transfer</option><option value="receipt">Received</option>';
  if(!document.getElementById('hs-brand').options.length){
    fill(document.getElementById('hs-brand'),uniq(PRODUCTS.map(function(p){return p.brand})),'All brands');
    refreshHistoryProducts();
  }
  refreshParties();
  drawHist();
}
function refreshHistoryProducts(){
  var brand=document.getElementById('hs-brand').value;
  var sel=document.getElementById('hs-product'),was=sel.value;
  var pool=brand?PRODUCTS.filter(function(p){return p.brand===brand}):PRODUCTS;
  var names=uniq(pool.map(function(p){return p.name}));
  fill(sel,names,brand?('All '+brand+' products'):'All products');
  sel.value=names.indexOf(was)>-1?was:'';
}
/* Party list shows only names that appear under the chosen movement type. */
function refreshParties(){
  var t=document.getElementById('hs-type').value;
  var sel=document.getElementById('hs-cust');
  var was=sel.value;
  var pool=t?HISTORY.filter(function(h){return h.type===t}):HISTORY;
  var names=uniq(pool.map(function(h){return h.cust}));
  fill(sel,names,t?('All '+t+' parties'):'All parties');
  sel.value=(names.indexOf(was)>-1)?was:'';
}
function histRows(){
  var q=document.getElementById('hs-q').value.toLowerCase().trim();
  var t=document.getElementById('hs-type').value,c=document.getElementById('hs-cust').value;
  var productName=document.getElementById('hs-product').value,brand=document.getElementById('hs-brand').value;
  var f=document.getElementById('hs-from').value,to=document.getElementById('hs-to').value;
  return HISTORY.filter(function(h){
    if(q&&h.id.toLowerCase().indexOf(q)<0&&h.cust.toLowerCase().indexOf(q)<0)return false;
    if(t&&h.type!==t)return false;if(c&&h.cust!==c)return false;
    if(f&&h.date<f)return false;if(to&&h.date>to)return false;
    if(productName||brand){
      var matches=h.lines.some(function(l){
        var p=prod(l.sku),lineBrand=l.brand||((p&&p.brand)||'');
        return (!productName||l.name===productName)&&(!brand||lineBrand===brand);
      });
      if(!matches)return false;
    }
    return true;});
}
function drawHist(){
  var r=histRows();
  var view=document.getElementById('hs-view').value;
  document.getElementById('hs-list').className='list '+(view==='doc'?'history-doc':'history-grouped');
  document.getElementById('hs-count').textContent=r.length+' of '+HISTORY.length+' movements';
  if(view!=='doc'){drawGrouped(r,view);return;}
  document.getElementById('hs-list').innerHTML=r.length?r.slice(0,60).map(function(h){
    var bx=0;for(var i=0;i<h.lines.length;i++)bx+=h.lines[i].boxes;
    var kind=h.type==='receipt'?'RECEIVED':(h.type==='invoice'?'STOCK OUT':'TRANSFER');
    return '<div class="hitem hi-'+h.type+'" onclick="detail(\''+h.id+'\')"><div class="h-top"><span class="h-id">'+movementId(h.id)+'</span><span class="h-tag t-'+h.type+'">'+kind+'</span></div><div class="h-meta">'+h.cust+' &middot; '+nice(h.date)+' '+h.time+' &middot; '+h.who+'</div><div class="h-meta" style="margin-top:3px;color:#0F5C5C;font-weight:700">'+bx+' boxes &middot; '+h.lines.length+' products</div></div>';
  }).join(''):'<div class="empty">No movements match these filters</div>';
}
function drawGrouped(rows,view){
  var prod2cat={};PRODUCTS.forEach(function(p){prod2cat[p.name]=p.cat;});
  var g={};
  rows.forEach(function(h){
    h.lines.forEach(function(l){
      var keys=[];
      if(view==='prod')keys=[l.name];
      else if(view==='cust')keys=[h.type==='receipt'?null:h.cust];
      else if(view==='sup')keys=[h.type==='receipt'?h.cust:null];
      else if(view==='cat'){var p=prod(l.sku);keys=[(p&&p.cat)||l.cat||'Other'];}
      else if(view==='who')keys=[h.who||'Unknown'];
      keys.forEach(function(k){
        if(!k)return;
        var o=g[k]||(g[k]={name:k,boxes:0,rev:0,cost:0,moves:{},last:h.date,inB:0,outB:0});
        o.moves[h.id]=1;
        if(h.type==='receipt'){o.inB+=l.boxes;o.cost+=l.boxes*(l.cost||0);}
        else{o.outB+=l.boxes;o.rev+=l.boxes*l.price;o.cost+=l.boxes*(l.cost||0);}
        o.boxes+=l.boxes;
        if(h.date>o.last)o.last=h.date;
      });
    });
  });
  var a=[];for(var k in g)a.push(g[k]);
  a.sort(function(x,y){return (SHOW_PRICING?(y.rev||y.boxes):y.boxes)-(SHOW_PRICING?(x.rev||x.boxes):x.boxes)});
  var label={prod:'products',cust:'customers',sup:'suppliers',cat:'categories',who:'staff'}[view];
  document.getElementById('hs-count').textContent=a.length+' '+label+' in this period';
  if(!a.length){document.getElementById('hs-list').innerHTML='<div class="empty">Nothing to group</div>';return;}
  var max=Math.max.apply(null,a.map(function(x){return SHOW_PRICING?(x.rev||x.boxes):x.boxes})) || 1;
  document.getElementById('hs-list').innerHTML=a.slice(0,60).map(function(o){
    var gp=o.rev-o.cost, mg=o.rev?100*gp/o.rev:0;
    var nMoves=Object.keys(o.moves).length;
    var gi = view==='cat'?icoCat(o.name,'sm')
           : view==='prod'?icoCat((prod2cat[o.name]||''),'sm')
           : view==='sup'?icoParty(o.name,'supplier','sm')
           : view==='who'?icoStaff('worker','sm')
           : icoParty(o.name,'invoice','sm');
    return '<div class="hitem" style="border-left-color:#0F5C5C"><div class="h-top" style="align-items:center;gap:9px">'+
    gi+'<span class="h-id" style="flex:1">'+o.name+'</span>'+
    '<span class="h-tag" style="background:#e2efee;color:#0F5C5C">'+nMoves+' MOVES</span></div>'+
    '<div class="h-meta">'+
      (o.outB?o.outB+' boxes out':'')+(o.outB&&o.inB?' &middot; ':'')+(o.inB?o.inB+' boxes in':'')+
      ' &middot; last '+nice(o.last)+'</div>'+
    '<div class="bar" style="margin-top:7px"><i style="width:'+Math.max(3,100*(SHOW_PRICING?(o.rev||o.boxes):o.boxes)/max)+'%"></i></div>'+
    '</div>';
  }).join('');
}
['hs-q','hs-type','hs-cust','hs-from','hs-to','hs-product','hs-brand'].forEach(function(id){
  var e=document.getElementById(id);
  var fn=function(){ if(id==='hs-type')refreshParties();if(id==='hs-brand')refreshHistoryProducts();drawHist(); };
  e.addEventListener('input',fn); e.addEventListener('change',fn);
});

function detail(id){
  var h;for(var i=0;i<HISTORY.length;i++)if(HISTORY[i].id===id)h=HISTORY[i];
  var bx=0,un=0;
  for(var j=0;j<h.lines.length;j++){var L=h.lines[j];bx+=L.boxes;un+=L.boxes*L.upb;}
  var kind=h.type==='receipt'?'RECEIVED':(h.type==='invoice'?'STOCK OUT':'TRANSFER');
  var html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="font-size:15px;font-weight:800">'+movementId(h.id)+'</span><span class="h-tag t-'+h.type+'">'+kind+'</span></div>'+
  '<div class="drow"><span>'+(h.type==='receipt'?'Supplier':'Destination')+'</span><span>'+h.cust+'</span></div>'+
  '<div class="drow"><span>Date</span><span>'+nice(h.date)+' '+h.time+'</span></div>'+
  '<div class="drow"><span>Entered by</span><span>'+h.who+'</span></div>'+
  '<div class="drow"><span>Direction</span><span>'+(h.type==='receipt'?'IN':'OUT')+'</span></div>'+
  '<div class="drow"><span>Products</span><span>'+h.lines.length+'</span></div>'+
  (h.ref?'<div class="drow"><span>Reference</span><span>'+h.ref+'</span></div>':'')+
  (h.notes?'<div class="drow"><span>Notes</span><span>'+h.notes+'</span></div>':'')+
  '<div class="sechead">Lines</div>';
  for(var k=0;k<h.lines.length;k++){var l=h.lines[k];
    html+='<div class="card" style="margin-bottom:6px"><div class="c-info"><div class="c-name">'+l.name+'</div>'+
    '<div class="c-meta">'+l.sku+' &middot; '+l.upb+' units/box &middot; '+(l.boxes*l.upb)+' units total</div>'+
    '</div><div class="c-box">'+l.boxes+'<small>BOXES</small></div></div>';}
  html+='<div class="total" style="margin-top:10px">'+bx+' boxes  |  '+un+' units</div>';
  document.getElementById('dt-body').innerHTML=html;go('detail');
}

var rbasket={};
function renderReceive(){
  var sel=document.getElementById('rc-sup');
  sel.innerHTML=SUPPLIERS.map(function(x){return '<option>'+x.name+'</option>'}).join('');
  if(!document.getElementById('rc-cat').options.length){
    fill(document.getElementById('rc-cat'),uniq(PRODUCTS.map(function(x){return x.cat})),'All categories');
    refreshRcBrands();
  }
  drawReceive();
}
function refreshRcBrands(){
  var cat=document.getElementById('rc-cat').value;
  var sel=document.getElementById('rc-brand');
  var was=sel.value;
  var pool=cat?PRODUCTS.filter(function(x){return x.cat===cat}):PRODUCTS;
  var brands=uniq(pool.map(function(x){return x.brand}));
  fill(sel,brands,cat?('All '+cat.toLowerCase()+' brands'):'All brands');
  sel.value=(brands.indexOf(was)>-1)?was:'';
}
function drawReceive(){
  var q=document.getElementById('rc-q').value.toLowerCase().trim();
  var cat=document.getElementById('rc-cat').value, br=document.getElementById('rc-brand').value;
  var r=PRODUCTS.filter(function(p){
    if(q&&(p.name||'').toLowerCase().indexOf(q)<0&&p.sku.toLowerCase().indexOf(q)<0&&(p.brand||'').toLowerCase().indexOf(q)<0)return false;
    if(cat&&p.cat!==cat)return false;
    if(br&&p.brand!==br)return false;
    return true;});
  document.getElementById('rc-count').textContent=r.length+' of '+PRODUCTS.length+' products';
  document.getElementById('rc-list').innerHTML=r.length?r.map(function(p){
    var inb=rbasket[p.sku]?rbasket[p.sku].qty:0;
    return '<div class="card">'+icoCat(p.cat)+'<div class="c-info"><div class="c-name">'+p.name+'</div>'+
    '<div class="c-meta">'+p.sku+' &middot; '+p.cat+'</div>'+
    '<div class="c-meta" id="rrem-'+p.sku+'" style="color:#26603a">on hand '+p.boxes+
    (inb?' &rarr; <b>'+(p.boxes+inb)+'</b> after delivery':'')+'</div>'+
    '</div>'+
    '<div class="qty"><button class="qbtn minus" onclick="rbump(\''+p.sku+'\',-1)">&#8722;</button>'+
    '<input type="number" inputmode="numeric" id="rq-'+p.sku+'" value="'+(inb||'')+'" placeholder="0" enterkeyhint="done" onfocus="this.select()" onkeydown="if(event.key===&quot;Enter&quot;){event.preventDefault();this.blur();}" oninput="rsetQty(\''+p.sku+'\',this.value)">'+
    '<button class="qbtn" onclick="rbump(\''+p.sku+'\',1)">+</button></div></div>';
  }).join(''):'<div class="empty">No products match these filters</div>';
  rdraw();
}
var RCOST={};
function setRecvCost(sku,v){RCOST[sku]=(v===''||v===null)?null:(parseFloat(v)||0);}
function recvCost(sku){
  var v=RCOST[sku];
  if(v!==undefined&&v!==null)return v;
  var p=prod(sku); return (p&&p.cost)||0;
}
function rsetQty(sku,val){
  var p=prod(sku); if(!p)return;
  var n=parseInt(val,10);
  if(isNaN(n)||n<=0)delete rbasket[sku];
  else rbasket[sku]={sku:sku,name:p.name,upb:p.upb,qty:n};
  rupdateRow(sku); rdraw();
}
function rbump(sku,d){var c=rbasket[sku]?rbasket[sku].qty:0;rsetQty(sku,c+d);
  var b=document.getElementById('rq-'+sku); if(b)b.value=(rbasket[sku]?rbasket[sku].qty:'')||'';}
function rupdateRow(sku){
  var p=prod(sku); if(!p)return;
  var inb=rbasket[sku]?rbasket[sku].qty:0;
  var lab=document.getElementById('rrem-'+sku);
  if(lab)lab.innerHTML='on hand '+p.boxes+(inb?' &rarr; <b>'+(p.boxes+inb)+'</b> after delivery':'');
}
function rdraw(){
  var a=[];for(var k in rbasket)a.push(rbasket[k]);
  var bx=0;for(var i=0;i<a.length;i++)bx+=a[i].qty;
  document.getElementById('rb-n').textContent=a.length?(a.length+(a.length===1?' product':' products')):'Nothing added';
  document.getElementById('rb-b').textContent=bx+' boxes';
  document.getElementById('rb-go').disabled=a.length===0;
}
['rc-q','rc-cat','rc-brand'].forEach(function(id){
  var e=document.getElementById(id);
  var fn=function(){ if(id==='rc-cat')refreshRcBrands(); drawReceive(); };
  e.addEventListener('input',fn); e.addEventListener('change',fn);
});


/* ---------------- STATISTICS ---------------- */
function initStats(){
  var chips=document.querySelectorAll('#pb-chips .chip');
  if(!document.getElementById('pb-chips').dataset.wired){
    for(var i=0;i<chips.length;i++)chips[i].addEventListener('click',function(){
      for(var j=0;j<chips.length;j++)chips[j].classList.remove('on');
      this.classList.add('on');applyPreset(this.getAttribute('data-p'));
    });
    document.getElementById('st-from').addEventListener('change',function(){markCustom();renderStats()});
    document.getElementById('st-to').addEventListener('change',function(){markCustom();renderStats()});
    document.getElementById('pb-chips').dataset.wired='1';
  }
  applyPreset('30');
}
function markCustom(){
  var chips=document.querySelectorAll('#pb-chips .chip');
  for(var j=0;j<chips.length;j++)chips[j].classList.toggle('on',chips[j].getAttribute('data-p')==='custom');
}
function applyPreset(v){
  if(v==='custom'){renderStats();return;}
  var to=TODAY,from;
  if(v==='mtd')from=TODAY.slice(0,8)+'01';else from=shift(parseInt(v,10)-1);
  document.getElementById('st-from').value=from;document.getElementById('st-to').value=to;
  renderStats();
}
function daysBetween(a,b){return Math.max(1,Math.round((new Date(b)-new Date(a))/86400000)+1);}

function renderStats(){
  var f=document.getElementById('st-from').value||shift(29),t=document.getElementById('st-to').value||TODAY;
  if(f>t){var swap=f;f=t;t=swap;}
  var days=daysBetween(f,t);
  document.getElementById('pb-range').textContent=nice(f)+'  \u2013  '+nice(t);
  document.getElementById('pb-days').textContent=days+' days of inventory activity';

  var rows=HISTORY.filter(function(h){return h.date>=f&&h.date<=t});
  var inBoxes=0,customerOut=0,transferBoxes=0,outBoxes=0,moveCount=rows.length;
  var byProd={},byCat={},byWho={},byDay={},stockByCat={};
  rows.forEach(function(h){
    h.lines.forEach(function(l){
      var qty=l.boxes||0;
      if(h.type==='receipt')inBoxes+=qty;
      else{
        outBoxes+=qty;
        if(h.type==='transfer')transferBoxes+=qty;else customerOut+=qty;
        byProd[l.name]=(byProd[l.name]||0)+qty;
        var movedCat=l.cat||((prod(l.sku)||{}).cat)||'Other';
        byCat[movedCat]=(byCat[movedCat]||0)+qty;
      }
      byWho[h.who||'Unknown']=(byWho[h.who||'Unknown']||0)+qty;
      byDay[h.date]=(byDay[h.date]||0)+qty;
    });
  });

  var stockBoxes=0,stockUnits=0,ok=0,low=0,order=0,out=0,setmin=0,unmovedN=0,unmovedBoxes=0;
  PRODUCTS.forEach(function(p){
    stockBoxes+=p.boxes;stockUnits+=p.boxes*p.upb;
    stockByCat[p.cat]=(stockByCat[p.cat]||0)+p.boxes;
    var st=statusOf(p);
    if(st==='OK')ok++;else if(st==='LOW')low++;else if(st==='ORDER')order++;else if(st==='OUT')out++;else setmin++;
    if(!byProd[p.name]&&p.boxes>0){unmovedN++;unmovedBoxes+=p.boxes;}
  });
  var dailyOut=outBoxes/days,cover=dailyOut?stockBoxes/dailyOut:0;
  var inStock=PRODUCTS.length?100*(PRODUCTS.length-out)/PRODUCTS.length:0;
  var reorderN=0,reorderBoxes=0;
  PRODUCTS.forEach(function(p){var st=statusOf(p);if(st==='ORDER'||st==='OUT'){reorderN++;reorderBoxes+=Math.max(0,p.min*SETTINGS.target-p.boxes);}});

  function inventoryRank(obj,n){
    var a=[];for(var key in obj)a.push([key,obj[key]]);
    a.sort(function(x,y){return y[1]-x[1]});a=a.slice(0,n);
    if(!a.length)return '<div class="stat-s">No movement in this period</div>';
    var max=a[0][1]||1;
    return a.map(function(r){return '<div class="rank"><span>'+r[0]+'</span><span>'+r[1]+' bx</span></div><div class="bar"><i style="width:'+Math.max(3,100*r[1]/max)+'%"></i></div>';}).join('');
  }

  var H='<div class="hero2">'+
    '<div class="big"><div class="big-l">Boxes on hand</div><div class="big-v">'+stockBoxes.toLocaleString()+'</div><div class="big-d flat">across '+PRODUCTS.length+' products</div></div>'+
    '<div class="big"><div class="big-l">Units on hand</div><div class="big-v">'+stockUnits.toLocaleString()+'</div><div class="big-d flat">inside all boxes</div></div></div>';

  H+='<div class="sechead">Boxes on hand by category</div><div class="stat">'+inventoryRank(stockByCat,10)+'</div>';

  H+='<div class="sechead">'+days+'-day movement</div><div class="hero2">'+
    '<div class="big"><div class="big-l">Received</div><div class="big-v">'+inBoxes+'</div><div class="big-d flat">boxes from suppliers</div></div>'+
    '<div class="big"><div class="big-l">Customer stock-out</div><div class="big-v">'+customerOut+'</div><div class="big-d flat">boxes sent to customers</div></div>'+
    '<div class="big"><div class="big-l">Internal transfers</div><div class="big-v">'+transferBoxes+'</div><div class="big-d flat">boxes moved between locations</div></div>'+
    '<div class="big"><div class="big-l">Net change</div><div class="big-v">'+((inBoxes-outBoxes)>0?'+':'')+(inBoxes-outBoxes)+'</div><div class="big-d flat">received minus all moved out</div></div></div>';

  var total=PRODUCTS.length||1;
  H+='<div class="sechead">Inventory health</div><div class="stat"><div class="stat-l">Status of all '+PRODUCTS.length+' products</div><div class="gauge">'+
    '<i class="g-ok" style="width:'+(100*ok/total)+'%"></i><i class="g-low" style="width:'+(100*low/total)+'%"></i><i class="g-order" style="width:'+(100*order/total)+'%"></i><i class="g-out" style="width:'+(100*out/total)+'%"></i><i class="g-set" style="width:'+(100*setmin/total)+'%"></i></div>'+
    '<div class="legend"><span class="lg"><b style="background:#3d8a56"></b>'+ok+' OK</span><span class="lg"><b style="background:#E0A33A"></b>'+low+' low</span><span class="lg"><b style="background:#C1622D"></b>'+order+' order</span><span class="lg"><b style="background:#B4443F"></b>'+out+' out</span><span class="lg"><b style="background:#c9c5bd"></b>'+setmin+' no min</span></div></div>';

  H+='<div class="hero2">'+
    '<div class="big"><div class="big-l">All moved out</div><div class="big-v">'+outBoxes+'</div><div class="big-d flat">customer stock-out + transfers</div></div>'+
    '<div class="big"><div class="big-l">Days of cover</div><div class="big-v">'+(dailyOut?cover.toFixed(0):'\u2014')+'</div><div class="big-d flat">at current outflow</div></div>'+
    '<div class="big"><div class="big-l">In-stock rate</div><div class="big-v">'+inStock.toFixed(0)+'%</div><div class="big-d '+(out?'down':'up')+'">'+(out?out+' at zero':'nothing at zero')+'</div></div>'+
    '<div class="big"><div class="big-l">Suggested reorder</div><div class="big-v">'+Math.round(reorderBoxes)+'</div><div class="big-d flat">boxes across '+reorderN+' products</div></div></div>';

  H+='<div class="stat"><div class="stat-l">Daily movement</div>'+sparkline(byDay)+'<div class="stat-s">'+moveCount+' movements recorded in '+days+' days</div></div>';
  H+='<div class="sechead">Fastest-moving products</div><div class="stat">'+inventoryRank(byProd,7)+'</div>';
  H+='<div class="sechead">Boxes moved out by category</div><div class="stat">'+inventoryRank(byCat,7)+'</div>';
  H+='<div class="sechead">Boxes handled by staff</div><div class="stat">'+inventoryRank(byWho,5)+'</div>';
  H+='<div class="sechead">No movement in this period</div><div class="stat"><div class="stat-v">'+unmovedN+' products</div><div class="stat-s">'+unmovedBoxes+' boxes are currently on hand without a movement in the selected period.</div></div>';

  var insights=[];
  if(out)insights.push(['d-bad',out+' product'+(out===1?' is':'s are')+' out of stock.']);
  if(order)insights.push(['d-warn',order+' product'+(order===1?' is':'s are')+' at or below minimum.']);
  if(setmin)insights.push(['d-neutral',setmin+' product'+(setmin===1?' has':'s have')+' no minimum set.']);
  if(dailyOut&&cover<14)insights.push(['d-warn','Current stock provides about '+cover.toFixed(0)+' days of cover.']);
  if(!insights.length)insights.push(['d-good','Stock levels are healthy for the selected period.']);
  H+='<div class="sechead">What needs attention</div><div class="stat">'+insights.map(function(x){return '<div class="insight"><span class="dotc '+x[0]+'"></span><span>'+x[1]+'</span></div>';}).join('')+'</div>';
  document.getElementById('st-list').innerHTML=H;
  return;

  var f=document.getElementById('st-from').value||shift(29),t=document.getElementById('st-to').value||TODAY;
  if(f>t){var tmp=f;f=t;t=tmp;}
  var days=daysBetween(f,t);
  document.getElementById('pb-range').textContent=nice(f)+'  \u2013  '+nice(t);
  document.getElementById('pb-days').textContent=days+' days  \u00b7  compared with the previous '+days+' days';

  var pf=new Date(f);pf.setDate(pf.getDate()-days);var prevFrom=pf.toISOString().slice(0,10);
  var pt=new Date(f);pt.setDate(pt.getDate()-1);var prevEnd=pt.toISOString().slice(0,10);
  function slice(a,b){return HISTORY.filter(function(h){return h.date>=a&&h.date<=b});}
  var cur=slice(f,t),prev=slice(prevFrom,prevEnd);

  function agg(rows){
    var o={rev:0,cost:0,outBoxes:0,inBoxes:0,units:0,orders:0,invoices:0,transfers:0,receipts:0,lines:0,
      byCust:{},byProd:{},byCat:{},byWho:{},byDay:{},listValue:0,
      profitCust:{},profitProd:{},profitCat:{},marginCust:{},revCust:{},purchases:0};
    rows.forEach(function(h){
      o.orders++;
      if(h.type==='invoice')o.invoices++;else if(h.type==='transfer')o.transfers++;else o.receipts++;
      h.lines.forEach(function(l){
        o.lines++;
        if(h.type==='receipt')o.inBoxes+=l.boxes;else o.outBoxes+=l.boxes;
        o.units+=l.boxes*l.upb;
        if(h.type==='receipt')o.purchases+=l.boxes*(l.cost||0);
        if(h.type==='invoice'){
          var rev=l.boxes*l.price, cst=l.boxes*(l.cost||0), gp=rev-cst;
          o.rev+=rev; o.cost+=cst;
          o.byCust[h.cust]=(o.byCust[h.cust]||0)+rev;
          o.revCust[h.cust]=(o.revCust[h.cust]||0)+rev;
          o.profitCust[h.cust]=(o.profitCust[h.cust]||0)+gp;
          o.profitProd[l.name]=(o.profitProd[l.name]||0)+gp;
          o.profitCat[l.cat||'Other']=(o.profitCat[l.cat||'Other']||0)+gp;
          var pp=prod(l.sku);if(pp)o.listValue+=l.boxes*pp.price;}
        if(h.type!=='receipt'){o.byProd[l.name]=(o.byProd[l.name]||0)+l.boxes;o.byCat[l.cat||'Other']=(o.byCat[l.cat||'Other']||0)+l.boxes;}
        o.byWho[h.who]=(o.byWho[h.who]||0)+l.boxes;
        o.byDay[h.date]=(o.byDay[h.date]||0)+l.boxes;
      });
    });
    return o;
  }
  var A=agg(cur),B=agg(prev);

  var stockBoxes=0,stockValue=0,stockUnits=0,ok=0,low=0,order=0,out=0,setmin=0,deadN=0,deadV=0;
  var moved={};cur.forEach(function(h){h.lines.forEach(function(l){moved[l.sku]=1})});
  PRODUCTS.forEach(function(p){
    stockBoxes+=p.boxes;stockUnits+=p.boxes*p.upb;stockValue+=p.boxes*p.price;
    var st=statusOf(p);
    if(st==='OK')ok++;else if(st==='LOW')low++;else if(st==='ORDER')order++;else if(st==='OUT')out++;else setmin++;
    if(!moved[p.sku]&&p.boxes>0){deadN++;deadV+=p.boxes*p.price;}
  });

  var perDay=A.outBoxes/days, cover=perDay>0?stockBoxes/perDay:0;
  var turns=stockBoxes>0?(A.outBoxes/stockBoxes)*(365/days):0;
  var inStock=100*(PRODUCTS.length-out)/PRODUCTS.length;
  var aov=A.invoices?A.rev/A.invoices:0;
  var revPerBox=A.outBoxes?A.rev/A.outBoxes:0;
  var realisation=A.listValue?A.rev/A.listValue:0;
  var linesPer=A.orders?A.lines/A.orders:0;
  var activeDays=Object.keys(A.byDay).length;
  var reorderN=0,reorderV=0;
  PRODUCTS.forEach(function(p){var st=statusOf(p);if(st==='ORDER'||st==='OUT'){reorderN++;reorderV+=Math.max(0,p.min*2-p.boxes)*p.price;}});
  var custArr=[];for(var k in A.byCust)custArr.push([k,A.byCust[k]]);
  custArr.sort(function(a,b){return b[1]-a[1]});
  var conc=A.rev>0&&custArr.length?100*custArr[0][1]/A.rev:0;

  function pct(a,b){return b>0?((a-b)/b*100):(a>0?100:0);}
  function delta(v,invert){
    if(!isFinite(v)||Math.round(v)===0)return '<div class="big-d flat">no change</div>';
    var good=invert?v<0:v>0;
    return '<div class="big-d '+(good?'up':'down')+'">'+(v>0?'\u25b2 ':'\u25bc ')+Math.abs(v).toFixed(0)+'% vs previous</div>';
  }
  function sparkline(byDay){
    var out=[],d=new Date(f),endD=new Date(t),n=0;
    while(d<=endD&&n<40){var iso=d.toISOString().slice(0,10);out.push(byDay[iso]||0);d.setDate(d.getDate()+1);n++;}
    if(out.length>21){var step=Math.ceil(out.length/21),red=[];
      for(var i=0;i<out.length;i+=step){var sum=0;for(var j=i;j<Math.min(i+step,out.length);j++)sum+=out[j];red.push(sum);}
      out=red;}
    var mx=Math.max.apply(null,out.concat([1]));
    return '<div class="spark">'+out.map(function(v){
      return '<i class="'+(v>=mx*0.75?'hi':'')+'" style="height:'+Math.max(4,100*v/mx)+'%"></i>';}).join('')+'</div>';
  }
  function ranked(obj,n,fmt,rust){
    var a=[];for(var k in obj)a.push([k,obj[k]]);
    a.sort(function(x,y){return y[1]-x[1]});a=a.slice(0,n);
    if(!a.length)return '<div style="font-size:11px;color:#8a8780;font-weight:600;padding:8px 0">No activity in this period</div>';
    var mx=a[0][1];
    return a.map(function(r){
      return '<div class="rank"><span>'+r[0]+'</span><span>'+fmt(r[1])+'</span></div><div class="bar'+(rust?' rust':'')+'"><i style="width:'+Math.max(3,100*r[1]/mx)+'%"></i></div>';
    }).join('');
  }

  var H='';

  /* headline pair */
  H+='<div class="hero2">';
  H+='<div class="big"><div class="big-l">Revenue</div><div class="big-v">'+money(A.rev)+'</div>'+delta(pct(A.rev,B.rev))+'</div>';
  H+='<div class="big"><div class="big-l">Boxes out</div><div class="big-v">'+A.outBoxes+'</div>'+delta(pct(A.outBoxes,B.outBoxes))+'</div>';
  H+='</div>';

  /* daily rhythm */
  H+='<div class="stat"><div class="stat-l">Daily shipping rhythm</div>'+sparkline(A.byDay)+
     '<div class="stat-s">Active on '+activeDays+' of '+days+' days &middot; '+perDay.toFixed(1)+' boxes per day average</div></div>';

  /* stock health gauge */
  var tot=PRODUCTS.length;
  H+='<div class="sechead">Inventory health</div>';
  H+='<div class="stat"><div class="stat-l">Status of all '+tot+' products</div><div class="gauge">'+
     '<i class="g-ok" style="width:'+(100*ok/tot)+'%"></i><i class="g-low" style="width:'+(100*low/tot)+'%"></i>'+
     '<i class="g-order" style="width:'+(100*order/tot)+'%"></i><i class="g-out" style="width:'+(100*out/tot)+'%"></i>'+
     '<i class="g-set" style="width:'+(100*setmin/tot)+'%"></i></div>'+
     '<div class="legend">'+
     '<span class="lg"><b class="g-ok" style="background:#3d8a56"></b>'+ok+' OK</span>'+
     '<span class="lg"><b style="background:#E0A33A"></b>'+low+' low</span>'+
     '<span class="lg"><b style="background:#C1622D"></b>'+order+' order</span>'+
     '<span class="lg"><b style="background:#B4443F"></b>'+out+' out</span>'+
     '<span class="lg"><b style="background:#c9c5bd"></b>'+setmin+' no min</span></div></div>';

  H+='<div class="hero2">';
  H+='<div class="big"><div class="big-l">Days of cover</div><div class="big-v">'+(perDay?cover.toFixed(0):'&mdash;')+'</div><div class="big-d flat">at current outflow</div></div>';
  H+='<div class="big"><div class="big-l">Stock value</div><div class="big-v">'+money(stockValue)+'</div><div class="big-d flat">'+stockBoxes+' boxes</div></div>';
  H+='<div class="big"><div class="big-l">Turns / year</div><div class="big-v">'+turns.toFixed(1)+'</div><div class="big-d flat">annualised</div></div>';
  H+='<div class="big"><div class="big-l">In-stock rate</div><div class="big-v">'+inStock.toFixed(0)+'%</div>'+
     (out?'<div class="big-d down">'+out+' at zero</div>':'<div class="big-d up">nothing at zero</div>')+'</div>';
  H+='<div class="big"><div class="big-l">Dead stock</div><div class="big-v">'+money(deadV)+'</div><div class="big-d '+(deadV>stockValue*0.15?'down':'flat')+'">'+deadN+' products unmoved</div></div>';
  H+='<div class="big"><div class="big-l">To reorder</div><div class="big-v">'+money(reorderV)+'</div><div class="big-d flat">'+reorderN+' products</div></div>';
  H+='</div>';

  /* ── PROFIT ── */
  var gross=A.rev-A.cost;
  var margin=A.rev?100*gross/A.rev:0;
  var markup=A.cost?100*gross/A.cost:0;
  var gprev=B.rev-B.cost;
  var profitPerBox=A.outBoxes?gross/A.outBoxes:0;
  var profitPerOrder=A.invoices?gross/A.invoices:0;

  H+='<div class="sechead">Profit</div>';
  H+='<div class="hero2">';
  H+='<div class="big"><div class="big-l">Gross profit</div><div class="big-v">'+money(gross)+'</div>'+delta(pct(gross,gprev))+'</div>';
  H+='<div class="big"><div class="big-l">Margin</div><div class="big-v">'+margin.toFixed(1)+'%</div><div class="big-d flat">of revenue kept</div></div>';
  H+='<div class="big"><div class="big-l">Markup</div><div class="big-v">'+markup.toFixed(0)+'%</div><div class="big-d flat">added to cost</div></div>';
  H+='<div class="big"><div class="big-l">Cost of goods</div><div class="big-v">'+money(A.cost)+'</div><div class="big-d flat">what you paid</div></div>';
  H+='<div class="big"><div class="big-l">Profit per box</div><div class="big-v">'+money(profitPerBox)+'</div><div class="big-d flat">across '+A.outBoxes+' boxes</div></div>';
  H+='<div class="big"><div class="big-l">Profit per invoice</div><div class="big-v">'+money(profitPerOrder)+'</div><div class="big-d flat">'+A.invoices+' invoices</div></div>';
  H+='</div>';

  /* revenue vs profit bar */
  if(A.rev>0){
    H+='<div class="stat"><div class="stat-l">Where every dollar goes</div>'+
    '<div class="gauge" style="height:13px"><i style="width:'+(100*A.cost/A.rev)+'%;background:#C1622D"></i>'+
    '<i style="width:'+(100*gross/A.rev)+'%;background:#3d8a56"></i></div>'+
    '<div class="legend"><span class="lg"><b style="background:#C1622D"></b>'+money(A.cost)+' cost ('+(100*A.cost/A.rev).toFixed(0)+'%)</span>'+
    '<span class="lg"><b style="background:#3d8a56"></b>'+money(gross)+' profit ('+margin.toFixed(0)+'%)</span></div></div>';
  }

  /* commercial */
  H+='<div class="sechead">Commercial quality</div>';
  H+='<div class="hero2">';
  H+='<div class="big"><div class="big-l">Avg invoice</div><div class="big-v">'+money(aov)+'</div>'+delta(pct(aov,B.invoices?B.rev/B.invoices:0))+'</div>';
  H+='<div class="big"><div class="big-l">Revenue / box</div><div class="big-v">'+money(revPerBox)+'</div><div class="big-d flat">mix indicator</div></div>';
  H+='<div class="big"><div class="big-l">Price realisation</div><div class="big-v">'+(realisation?(realisation*100).toFixed(0)+'%':'&mdash;')+'</div><div class="big-d '+(realisation<0.98?'down':'up')+'">of list price</div></div>';
  H+='<div class="big"><div class="big-l">Top customer share</div><div class="big-v">'+conc.toFixed(0)+'%</div><div class="big-d '+(conc>40?'down':'up')+'">of revenue</div></div>';
  H+='</div>';

  H+='<div class="sechead">Revenue by customer</div><div class="stat">'+ranked(A.byCust,6,money)+'</div>';

  H+='<div class="sechead">Profit by customer</div><div class="stat">'+
     ranked(A.profitCust,6,money,true)+
     '<div class="stat-s" style="margin-top:10px">'+
     (function(){
       var a=[];for(var k in A.profitCust)a.push([k,A.profitCust[k],A.revCust[k]||0]);
       a.sort(function(x,y){return y[1]-x[1]});
       if(!a.length)return 'No invoiced sales in this period.';
       return a.map(function(r){
         var m=r[2]?100*r[1]/r[2]:0;
         return r[0]+' &mdash; '+m.toFixed(0)+'% margin';}).join('<br>');
     })()+'</div></div>';

  H+='<div class="sechead">Profit by product</div><div class="stat">'+ranked(A.profitProd,7,money,true)+'</div>';
  H+='<div class="sechead">Profit by category</div><div class="stat">'+ranked(A.profitCat,7,money,true)+'</div>';
  H+='<div class="sechead">Fastest moving products</div><div class="stat">'+ranked(A.byProd,7,function(v){return v+' bx'})+'</div>';
  H+='<div class="sechead">Categories by volume</div><div class="stat">'+ranked(A.byCat,7,function(v){return v+' bx'})+'</div>';

  var dead={};PRODUCTS.forEach(function(p){if(!moved[p.sku]&&p.boxes>0)dead[p.name]=p.boxes*p.price});
  H+='<div class="sechead">Capital sitting still</div><div class="stat">'+ranked(dead,5,money,true)+'</div>';
  H+='<div class="sechead">Boxes handled by staff</div><div class="stat">'+ranked(A.byWho,4,function(v){return v+' bx'})+'</div>';

  /* activity mix */
  H+='<div class="sechead">Activity</div><div class="stat">'+
     '<div class="rank"><span>Invoices</span><span>'+A.invoices+'</span></div>'+
     '<div class="rank"><span>Transfers</span><span>'+A.transfers+'</span></div>'+
     '<div class="rank"><span>Receipts</span><span>'+A.receipts+'</span></div>'+
     '<div class="stat-s">'+A.lines+' lines in total &middot; '+linesPer.toFixed(1)+' products per movement &middot; '+
     A.inBoxes+' boxes in vs '+A.outBoxes+' out (net '+(A.inBoxes-A.outBoxes>0?'+':'')+(A.inBoxes-A.outBoxes)+')</div></div>';

  /* insights */
  var ins=[];
  if(out>0)ins.push(['d-bad',out+(out===1?' product is':' products are')+' at zero. Each stockout sends a restaurant to another supplier.']);
  if(perDay&&cover<14)ins.push(['d-warn','Only '+cover.toFixed(0)+' days of cover left at the current rate. Place orders this week.']);
  else if(perDay&&cover>90)ins.push(['d-warn',cover.toFixed(0)+' days of cover is well above need. Cash is tied up in stock.']);
  if(deadV>stockValue*0.15)ins.push(['d-warn',money(deadV)+' ('+(100*deadV/stockValue).toFixed(0)+'% of stock value) has not moved in this period. Promote it or stop reordering it.']);
  if(conc>40)ins.push(['d-warn',custArr.length?custArr[0][0]+' is '+conc.toFixed(0)+'% of revenue. Losing them would hurt.':'']);
  if(setmin>0)ins.push(['d-neutral',setmin+' products have no minimum set, so they can never trigger a reorder alert.']);
  if(A.rev>0&&margin<15)ins.push(['d-bad','Margin is only '+margin.toFixed(0)+'%. After handling and delivery there may be nothing left.']);
  if(A.rev>0&&margin>=30)ins.push(['d-good','Margin of '+margin.toFixed(0)+'% is healthy for wholesale food.']);
  (function(){
    var worst=null;
    for(var k in A.profitCust){
      var m=A.revCust[k]?100*A.profitCust[k]/A.revCust[k]:0;
      if(A.revCust[k]>0&&(!worst||m<worst[1]))worst=[k,m];
    }
    if(worst&&worst[1]<12)ins.push(['d-warn',worst[0]+' is only '+worst[1].toFixed(0)+'% margin. Their agreed price may be too low.']);
  })();
  if(A.purchases>0)ins.push(['d-neutral','Bought '+money(A.purchases)+' of stock this period against '+money(A.rev)+' of sales.']);
  if(realisation&&realisation<0.98)ins.push(['d-warn','Selling at '+(realisation*100).toFixed(0)+'% of list price. Discounts are costing '+money(A.listValue-A.rev)+' this period.']);
  if(turns>0&&turns<4)ins.push(['d-warn','Stock turns '+turns.toFixed(1)+'x a year. Under 4 usually means overstocking.']);
  if(pct(A.rev,B.rev)>10)ins.push(['d-good','Revenue is up '+pct(A.rev,B.rev).toFixed(0)+'% on the previous period.']);
  if(!ins.length)ins.push(['d-good','Nothing needs attention. Stock levels, pricing and concentration all look healthy.']);
  H+='<div class="sechead">What this means</div><div class="stat">'+ins.map(function(x){
    return '<div class="insight"><span class="dotc '+x[0]+'"></span><span>'+x[1]+'</span></div>';}).join('')+'</div>';
  H+='<div style="height:8px"></div>';

  document.getElementById('st-list').innerHTML=H;
}

/* ---------------- PDF ---------------- */
function pdfAction(m,mode){
  if(!m){toast('No movement selected');return;}
  var doc;
  try{ doc=buildPDF(m); }catch(e){ toast('Could not build PDF: '+e.message); return; }
  if(!doc){toast('No movement selected');return;}
  var name=m.id+'.pdf';

  // open: render in a new tab so it can be read before sending
  if(mode==='open'){
    try{
      var burl=URL.createObjectURL(doc.output('blob'));
      var w=window.open(burl,'_blank');
      if(w){ setTimeout(function(){URL.revokeObjectURL(burl)},20000); return; }
    }catch(e){}
    downloadPdf(doc,name); return;
  }
  // share: native sheet — WhatsApp, Telegram, Mail, Files
  if(mode==='share'&&navigator.canShare){
    try{
      var file=new File([doc.output('blob')],name,{type:'application/pdf'});
      if(navigator.canShare({files:[file]})){
        navigator.share({files:[file],title:m.id}).catch(function(){downloadPdf(doc,name)});
        return;
      }
    }catch(e){}
  }
  // 2. anchor download — works inside webviews where window.open is blocked
  downloadPdf(doc,name);
}
function downloadPdf(doc,name){
  try{
    var blob=doc.output('blob');
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url; a.download=name; a.rel='noopener';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); },1500);
    toast('PDF saved as '+name);
  }catch(e){
    try{ doc.save(name); toast('PDF saved'); }
    catch(e2){ toast('This browser blocked the download. Try Safari or Chrome.'); }
  }
}

function histPdf(id,mode){
  for(var i=0;i<HISTORY.length;i++)if(HISTORY[i].id===id){pdfAction(HISTORY[i],mode);return;}
}

/* ---------------- Barcode scanning ---------------- */
var scanner=null,scanner2=null,scanTarget='mv',pendingCode=null;

function stopScan(){
  if(scanner){try{scanner.stop();scanner.clear();}catch(e){}scanner=null;}
  if(scanner2){try{scanner2.stop();scanner2.clear();}catch(e){}scanner2=null;}
}
function scanMsg(id,txt,ok){
  var e=document.getElementById(id);
  e.textContent=txt;e.className='scanmsg '+(ok?'sc-ok':'sc-bad');
}
function byBarcode(code){
  for(var i=0;i<PRODUCTS.length;i++)if(String(PRODUCTS[i].barcode)===String(code))return PRODUCTS[i];
  return null;
}
function openScan(target){
  scanTarget=target;go('scan');
  scanMsg('sc-msg','Point the camera at the barcode on the box',true);
  if(typeof Html5Qrcode==='undefined'){
    scanMsg('sc-msg','Scanner library did not load. Check your connection.',false);return;
  }
  if(location.protocol!=='https:'&&location.hostname!=='localhost'){
    scanMsg('sc-msg','The camera only works over https. It will work once the app is deployed.',false);
    return;
  }
  scanner=new Html5Qrcode('reader');
  scanner.start({facingMode:'environment'},{fps:10,qrbox:{width:250,height:140}},
    function(code){
      var p=byBarcode(code);
      if(!p){
        scanMsg('sc-msg','Code '+code+' is not on any product yet',false);
        pendingCode=code;
        var hint=document.getElementById('sc-hint');
        if(hint)hint.innerHTML='<b>Tap Stop, then open Barcodes to attach this code to a product.</b>';
        return;
      }
      stopScan();
      if(scanTarget==='rc'){
        rsetQty(p.sku,(rbasket[p.sku]?rbasket[p.sku].qty:0)+1);
        document.getElementById('rc-q').value='';drawReceive();go('receive');
      }else{
        setQty(p.sku,(basket[p.sku]?basket[p.sku].qty:0)+1);
        document.getElementById('mv-q').value=p.sku;renderMove();go('move');
      }
    },function(){});
}
document.getElementById('sc-stop').addEventListener('click',function(){
  stopScan();go(scanTarget==='rc'?'receive':'move');
});

/* ---------------- Barcode capture (learn mode) ---------------- */
function startLearn(){
  pendingCode=null;
  scanMsg('ln-msg','Scan a box, then pick the product it belongs to',true);
  drawLearn();
  if(typeof Html5Qrcode==='undefined'){
    scanMsg('ln-msg','Scanner library did not load. Check your connection.',false);return;
  }
  if(location.protocol!=='https:'&&location.hostname!=='localhost'){
    scanMsg('ln-msg','The camera only works over https. You can still type codes after deployment.',false);
    return;
  }
  scanner2=new Html5Qrcode('reader2');
  scanner2.start({facingMode:'environment'},{fps:10,qrbox:{width:250,height:140}},
    function(code){
      var known=byBarcode(code);
      if(known){scanMsg('ln-msg',code+' is already on '+known.name,true);return;}
      pendingCode=code;
      scanMsg('ln-msg','Code '+code+' captured - now tap its product below',true);
    },function(){});
}
function drawLearn(){
  var done=0;PRODUCTS.forEach(function(p){if(p.barcode)done++;});
  document.getElementById('ln-count').textContent=done+' of '+PRODUCTS.length+' products have a barcode';
  var q=document.getElementById('ln-q').value.toLowerCase().trim();
  var fEl=document.getElementById('ln-filter');
  var onlyMissing=fEl?fEl.value==='missing':false;
  var r=PRODUCTS.filter(function(p){
    if(onlyMissing&&p.barcode)return false;
    return!q||(p.name||'').toLowerCase().indexOf(q)>=0||p.sku.toLowerCase().indexOf(q)>=0;});
  document.getElementById('ln-list').innerHTML=r.slice(0,40).map(function(p){
    return '<div class="card" onclick="attachCode(\''+p.sku+'\')"><div class="c-info"><div class="c-name">'+p.name+'</div>'+
    '<div class="c-meta">'+p.sku+' &middot; '+(p.barcode?('code '+p.barcode):'no barcode yet')+'</div></div>'+
    '<div class="c-box" style="font-size:13px">'+(p.barcode?'&#10003;':'&#43;')+'</div></div>';
  }).join('');
}
function attachCode(sku){
  if(!pendingCode){scanMsg('ln-msg','Scan a barcode first, then tap the product',false);return;}
  prod(sku).barcode=pendingCode;
  scanMsg('ln-msg',pendingCode+' saved to '+prod(sku).name,true);
  pendingCode=null;drawLearn();
}
document.getElementById('ln-q').addEventListener('input',drawLearn);
var lnF=document.getElementById('ln-filter');
if(lnF)lnF.addEventListener('change',drawLearn);

document.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&e.target&&e.target.tagName==='INPUT'){e.preventDefault();e.target.blur();}
});
['mv-list','rc-list','stk-list'].forEach(function(id){
  var el=document.getElementById(id);
  if(el)el.addEventListener('touchstart',function(e){
    if(e.target.tagName!=='INPUT'&&document.activeElement&&document.activeElement.tagName==='INPUT')document.activeElement.blur();
  },{passive:true});
});
setupFilters('stk');setupFilters('mv');
wireCatBar('stk',renderStock);wireCatBar('mv',renderMove);
kpis();drawBasket();
