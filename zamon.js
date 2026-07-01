"use strict";
/* ============================================================
   ZAMON — shared app (multi-page): data, i18n, shell, logic
   ============================================================ */
const A="https://www.apple.com";
const SCH=k=>"https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/"+k+"?wid=900&hei=900&fmt=png-alpha";
/* ===== shop contacts (real) ===== */
const SHOP_WA="992982227635",SHOP_TG="vensurel",SHOP_PHONE="+992 98 222 76 35";
const waLink=text=>"https://wa.me/"+SHOP_WA+(text?"?text="+encodeURIComponent(text):"");
const tgLink="https://t.me/"+SHOP_TG;
/* Telegram order notifications — bot @zamonshopbot sends each order to the shop owner's chat */
const TG_BOT="8247300906:AAFR467XQnDOUCdK3N2Do7ZemyQETkuB97Q",TG_CHAT="1223922479";
function notifyShop(o){
  try{
    return fetch("https://api.telegram.org/bot"+TG_BOT+"/sendMessage",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:TG_CHAT,text:buildOrderMsg(o)})
    }).then(r=>r.ok).catch(()=>false);
  }catch(e){return Promise.resolve(false);}
}
/* request a smaller image for small tiles (store CDN supports wid/hei params; apple.com /v/ images are fixed-size) */
function shrinkCDN(url,w){if(url&&/storeimages\.cdn-apple\.com/.test(url))return url.replace(/wid=\d+/,"wid="+w).replace(/hei=\d+/,"hei="+w);return url;}
function imgFallback(img){
  img.classList.add("img-loaded");if(img.parentElement)img.parentElement.classList.add("img-ready");
  const box=img.closest(".media,.ci-img,.lc-media,.lr-media,.bg-media,.mc-img,.buy-media,.info-media,.cfg-media,.phero,.fimg,.promo");
  if(!box||box.classList.contains("phero")||box.classList.contains("fimg")||box.classList.contains("promo")){img.style.visibility="hidden";return;}
  box.classList.add("media-fb");box.setAttribute("data-fb",img.getAttribute("data-emoji")||"📦");img.remove();
}
/* smooth image loading: fade each product image in when it arrives, hide its skeleton shimmer */
document.addEventListener("load",function(e){
  var el=e.target;
  if(el&&el.tagName==="IMG"&&el.hasAttribute("data-emoji")){
    el.classList.add("img-loaded");
    if(el.parentElement)el.parentElement.classList.add("img-ready");
  }
},true);
function zRevealImgs(){
  var imgs=document.querySelectorAll('img[data-emoji]:not(.img-loaded)');
  for(var i=0;i<imgs.length;i++){var im=imgs[i];if(im.complete&&im.naturalWidth>0){im.classList.add("img-loaded");if(im.parentElement)im.parentElement.classList.add("img-ready");}}
}
setInterval(zRevealImgs,700);
/* ===== SEO: Schema.org structured data (JSON-LD) ===== */
function setLD(key,obj){var id="ld-"+key;var ex=document.getElementById(id);if(ex)ex.remove();var s=document.createElement("script");s.id=id;s.type="application/ld+json";s.text=JSON.stringify(obj);document.head.appendChild(s);}
function siteLD(){
  setLD("org",{"@context":"https://schema.org","@type":"Store","name":"ZAMON","url":"https://zamon.app/","logo":"https://zamon.app/favicon.svg","image":"https://zamon.app/favicon.svg","telephone":"+992982227635","priceRange":"$$$","address":{"@type":"PostalAddress","addressLocality":"Душанбе","addressCountry":"TJ"},"areaServed":{"@type":"Country","name":"Tajikistan"},"sameAs":["https://wa.me/992982227635","https://t.me/vensurel"]});
  setLD("web",{"@context":"https://schema.org","@type":"WebSite","name":"ZAMON","url":"https://zamon.app/","inLanguage":["ru","tg","en"]});
}
try{siteLD();}catch(e){}
function productLD(p){try{setLD("product",{"@context":"https://schema.org","@type":"Product","name":p.name,"image":mainImg(p),"description":tr(p.tag||{ru:p.name,tj:p.name,en:p.name}),"sku":"ZAMON-"+p.id,"brand":{"@type":"Brand","name":"Apple"},"category":p.line||p.cat,"offers":{"@type":"Offer","priceCurrency":"TJS","price":p.price,"availability":"https://schema.org/InStock","url":location.href,"seller":{"@type":"Organization","name":"ZAMON"}}});}catch(e){}}

/* ===== PRICING — цены привязаны к официальным ценам Apple США (USD) =====
   Итог = цена_Apple_USD × курс × наценка. Чтобы обновить — поменяй ДВА числа ниже,
   все цены (карточки, корзина, конфигуратор, рассрочка) пересчитаются автоматически. */
const USD_TJS=9.5;   // курс доллара к сомони (с запасом на колебания)
/* Ступенчатая наценка: чем дороже модель — тем ниже %, чтобы дорогие позиции
   оставались конкурентными. Меняй проценты здесь — все цены пересчитаются. */
function marginFor(usd){
  if(usd>=1500) return 1.13;   // топ (MacBook Pro и т.п.) — +13%
  if(usd>=1000) return 1.16;   // дорогие (флагманы) — +16%
  if(usd>=600)  return 1.20;   // средние — +20%
  if(usd>=200)  return 1.25;   // недорогие — +25%
  return 1.30;                 // аксессуары — +30%
}
const tjs=usd=>Math.round(usd*USD_TJS*marginFor(usd)/10)*10;   // USD → сомони, округление до 10
/* Официальные цены Apple США (USD) за базовую конфигурацию (память) */
const APPLE_USD={1:1099,2:999,3:799,4:599,5:699,6:1599,7:1199,8:999,9:599,10:799,11:399,12:249,13:129,14:549,15:249,16:1099,18:1299,19:599,101:29,102:99,103:129,104:39,105:49,106:49,107:59,108:49,109:59,110:49,111:299,112:79,113:79,114:199,115:79,116:59,117:49,118:99};

/* ===== PRODUCTS ===== */
const PRODUCTS=[
 {id:1,line:"iPhone",name:"iPhone 17 Pro",cat:"phone",price:15990,old:0,rating:5,new:true,emoji:"📱",modelPage:"iphone-17-pro.html",
  card:A+"/v/iphone/home/cj/images/overview/select/iphone_17pro__t1j902iw6kya_large_2x.jpg",darkMedia:true,
  tag:{ru:"A19 Pro · титан · камера 48 Мп",tj:"A19 Pro · титан · 48 Мп",en:"A19 Pro · titanium · 48 MP"},
  colors:[
   {n:{ru:"Оранжевый",tj:"Норанҷӣ",en:"Orange"},hex:"#c8502d",img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/colors_orange__cr2oq3n1dwk2_large_2x.jpg"},
   {n:{ru:"Синий",tj:"Кабуд",en:"Blue"},hex:"#4a5a78",img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/colors_blue__li170wg4gkae_large_2x.jpg"},
   {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/colors_silver__eb8fu7zfvwmu_large_2x.jpg"}]},
 {id:2,line:"iPhone",name:"iPhone Air",cat:"phone",price:13490,old:0,rating:5,new:true,emoji:"📱",
  tag:{ru:"Самый тонкий iPhone",tj:"Тунуктарин iPhone",en:"The thinnest iPhone ever"},
  colors:[{n:{ru:"Небесно-голубой",tj:"Осмонӣ",en:"Sky Blue"},hex:"#a9c4d6",img:A+"/v/iphone/home/cj/images/overview/select/iphone_air__b5qmgl05ojyq_large_2x.jpg"}]},
 {id:3,line:"iPhone",name:"iPhone 17",cat:"phone",price:10990,old:0,rating:5,new:true,emoji:"📱",
  tag:{ru:"Новый дисплей и чип A19",tj:"Дисплейи нав ва A19",en:"New display and A19 chip"},
  colors:[{n:{ru:"Лавандовый",tj:"Бунафш",en:"Lavender"},hex:"#cbbfe0",img:A+"/v/iphone/home/cj/images/overview/select/iphone_17__fb1277oq3eaa_large_2x.jpg"}]},
 {id:4,line:"iPhone",name:"iPhone 17e",cat:"phone",price:7990,old:0,rating:4,new:false,emoji:"📱",
  tag:{ru:"Мощь Apple по доступной цене",tj:"Қуввати Apple бо нархи арзон",en:"Apple power, friendly price"},
  colors:[{n:{ru:"Розовый",tj:"Гулобӣ",en:"Pink"},hex:"#f3c6cf",img:A+"/v/iphone/home/cj/images/overview/select/iphone_17e__cq5ygzct314y_large_2x.jpg"}]},
 {id:5,line:"iPhone",name:"iPhone 16",cat:"phone",price:8990,old:9990,rating:5,new:false,emoji:"📱",
  tag:{ru:"Любимая классика, выгодная цена",tj:"Классикаи дӯстдошта",en:"A beloved classic, great value"},
  colors:[{n:{ru:"Ультрамарин",tj:"Кабуди баланд",en:"Ultramarine"},hex:"#5b6fd6",img:A+"/v/iphone/home/cj/images/overview/select/iphone_16__b6tkv86m2gc2_large_2x.jpg"}]},
 {id:6,line:"Mac",name:"MacBook Pro",cat:"laptop",price:27990,old:0,rating:5,new:true,emoji:"💻",modelPage:"macbook-pro.html",
  lineImg:SCH("mbp14-spaceblack-select-202410"),
  tag:{ru:"Чип M5 Pro и M5 Max · 14″ и 16″",tj:"Чипи M5 Pro ва M5 Max · 14″ ва 16″",en:"M5 Pro and M5 Max · 14″ and 16″"},
  variants:[{n:{ru:"14″",tj:"14″",en:"14″"},add:0,sub:{ru:"Чип M5 Pro",tj:"Чипи M5 Pro",en:"M5 Pro chip"}},{n:{ru:"16″",tj:"16″",en:"16″"},add:7000,sub:{ru:"Чип M5 Max · больше экран",tj:"Чипи M5 Max · экрани калонтар",en:"M5 Max · larger display"}}],
  colors:[
   {n:{ru:"Космический чёрный",tj:"Сиёҳи кайҳонӣ",en:"Space Black"},hex:"#2e2c2e",img:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_colors_spaceblack__dwfpyrbaf4cy_large_2x.jpg"},
   {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_colors_silver__doa20s4tupaq_large_2x.jpg"}]},
 {id:7,line:"Mac",name:"MacBook Air 15″",cat:"laptop",price:14990,old:0,rating:5,new:false,emoji:"💻",
  lineImg:SCH("mba15-skyblue-select-202503"),
  tag:{ru:"Чип M4 · до 18 часов работы",tj:"Чипи M4 · то 18 соат",en:"M4 chip · up to 18h battery"},
  colors:[
   {n:{ru:"Небесно-голубой",tj:"Осмонӣ",en:"Sky Blue"},hex:"#b3c7d6",img:A+"/v/macbook-air/z/images/overview/design/color/design_top_skyblue__eepkvlvjzcia_large_2x.jpg"},
   {n:{ru:"Полночный",tj:"Нимашабӣ",en:"Midnight"},hex:"#2e3641",img:A+"/v/macbook-air/z/images/overview/design/color/design_top_midnight__fvf2p6124tqq_large_2x.jpg"},
   {n:{ru:"Сияющая звезда",tj:"Ситоравӣ",en:"Starlight"},hex:"#f0e9dd",img:A+"/v/macbook-air/z/images/overview/design/color/design_top_starlight__dtojfd6ibywm_large_2x.jpg"},
   {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:A+"/v/macbook-air/z/images/overview/design/color/design_top_silver__dcf8hwixw2uu_large_2x.jpg"}]},
 {id:16,line:"Mac",name:"MacBook Neo",cat:"laptop",price:13990,old:0,rating:5,new:true,emoji:"💻",
  lineImg:SCH("macbook-neo-blush-cto-hero-202603"),
  tag:{ru:"Яркий MacBook на чипе M5",tj:"MacBook-и рангоранг бо чипи M5",en:"A vivid MacBook with the M5 chip"},
  colors:[
   {n:{ru:"Розовый",tj:"Гулобӣ",en:"Blush"},hex:"#f0c5cd",img:SCH("macbook-neo-blush-cto-hero-202603")},
   {n:{ru:"Цитрус",tj:"Ситрусӣ",en:"Citrus"},hex:"#e6cf4e",img:SCH("macbook-neo-citrus-cto-hero-202603")},
   {n:{ru:"Индиго",tj:"Индиго",en:"Indigo"},hex:"#3b4a7e",img:SCH("macbook-neo-indigo-cto-hero-202603")},
   {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:SCH("macbook-neo-silver-cto-hero-202603")}]},
 {id:18,line:"Mac",name:"iMac",cat:"laptop",price:17990,old:0,rating:5,new:true,emoji:"🖥️",
  lineImg:SCH("imac-blue-selection-hero-202410"),
  tag:{ru:"Яркий настольный Mac на чипе M4",tj:"Mac-и мизи рангоранг бо чипи M4",en:"A vivid all-in-one desktop with M4"},
  highlights:[
   {ic:"⚡",big:"M4",lbl:{ru:"Чип",tj:"Чип",en:"Chip"}},
   {ic:"🖥️",big:"24″ 4.5K",lbl:{ru:"Дисплей Retina",tj:"Дисплейи Retina",en:"Retina display"}},
   {ic:"🎨",big:{ru:"5 цветов",tj:"5 ранг",en:"5 colors"},lbl:{ru:"Дизайн",tj:"Дизайн",en:"Design"}}],
  box:[{ic:"🖥️",n:"iMac"},{ic:"⌨️",n:{ru:"Magic Keyboard",tj:"Magic Keyboard",en:"Magic Keyboard"}},{ic:"🖱️",n:{ru:"Magic Mouse",tj:"Magic Mouse",en:"Magic Mouse"}},{ic:"🔌",n:{ru:"Кабель питания",tj:"Сими барқ",en:"Power cable"}}],
  colors:[
   {n:{ru:"Синий",tj:"Кабуд",en:"Blue"},hex:"#4a6b9a",img:SCH("imac-blue-selection-hero-202410")},
   {n:{ru:"Зелёный",tj:"Сабз",en:"Green"},hex:"#3f7a5e",img:SCH("imac-green-selection-hero-202410")},
   {n:{ru:"Розовый",tj:"Гулобӣ",en:"Pink"},hex:"#d98a93",img:SCH("imac-pink-selection-hero-202410")},
   {n:{ru:"Жёлтый",tj:"Зард",en:"Yellow"},hex:"#e3c34a",img:SCH("imac-yellow-selection-hero-202410")},
   {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:SCH("imac-silver-selection-hero-202410")}]},
 {id:19,line:"Mac",name:"Mac mini",cat:"laptop",price:9990,old:0,rating:5,new:true,emoji:"🖥️",
  lineImg:SCH("mac-mini-select-202410"),
  tag:{ru:"Компактный настольный Mac на чипе M4",tj:"Mac-и мизи ҷайбӣ бо чипи M4",en:"Compact desktop Mac with M4"},
  highlights:[
   {ic:"⚡",big:"M4",lbl:{ru:"Чип",tj:"Чип",en:"Chip"}},
   {ic:"📦",big:{ru:"12,7 см",tj:"12,7 см",en:"12.7 cm"},lbl:{ru:"Компактный корпус",tj:"Корпуси ҷайбӣ",en:"Compact design"}},
   {ic:"💾",big:{ru:"до 1 ТБ",tj:"то 1 ТБ",en:"up to 1 TB"},lbl:{ru:"Память SSD",tj:"Хотираи SSD",en:"SSD storage"}}],
  box:[{ic:"🖥️",n:"Mac mini"},{ic:"🔌",n:{ru:"Кабель питания",tj:"Сими барқ",en:"Power cable"}},{ic:"📄",n:{ru:"Документация",tj:"Ҳуҷҷатҳо",en:"Documentation"}}],
  colors:[{n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:SCH("mac-mini-select-202410")}]},
 {id:8,line:"iPad",name:"iPad Pro",cat:"tablet",price:13990,old:0,rating:5,new:true,emoji:"📲",modelPage:"ipad-pro.html",
  tag:{ru:"Чип M5 · Ultra Retina XDR",tj:"Чипи M5 · Ultra Retina XDR",en:"M5 · Ultra Retina XDR"},
  colors:[
   {n:{ru:"Космический чёрный",tj:"Сиёҳи кайҳонӣ",en:"Space Black"},hex:"#3a3b3d",img:WG("ipad-pro-finish-select-202405-11inch-spaceblack")},
   {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#e3e4e6",img:WG("ipad-pro-finish-select-202405-11inch-silver")}]},
 {id:9,line:"iPad",name:"iPad Air",cat:"tablet",price:8490,old:0,rating:5,new:true,emoji:"📲",modelPage:"ipad-air.html",
  tag:{ru:"Лёгкий, быстрый, универсальный",tj:"Сабук, тез, бисёрвазифа",en:"Light, fast, versatile"},
  colors:[
   {n:{ru:"Синий",tj:"Кабуд",en:"Blue"},hex:"#cdd8ea",img:WG("ipad-air-select-11in-wifi-blue-202405")},
   {n:{ru:"Фиолетовый",tj:"Бунафш",en:"Purple"},hex:"#ded9e8",img:WG("ipad-air-select-11in-wifi-purple-202405")},
   {n:{ru:"Серый космос",tj:"Хокистарӣ",en:"Space Gray"},hex:"#7d7e80",img:WG("ipad-air-select-11in-wifi-spacegray-202405")},
   {n:{ru:"Сияющая звезда",tj:"Ситоравӣ",en:"Starlight"},hex:"#efe9dd",img:WG("ipad-air-select-11in-wifi-starlight-202405")}]},
 {id:20,line:"iPad",name:"iPad",cat:"tablet",price:4990,old:0,rating:5,new:true,emoji:"📲",modelPage:"ipad-11.html",
  tag:{ru:"Чип A16 · экран 11″",tj:"Чипи A16 · экрани 11″",en:"A16 chip · 11″ display"},
  colors:[
   {n:{ru:"Синий",tj:"Кабуд",en:"Blue"},hex:"#a6c0dd",img:WG("ipad-2022-hero-blue-wifi-select")},
   {n:{ru:"Розовый",tj:"Гулобӣ",en:"Pink"},hex:"#e6c7c2",img:WG("ipad-2022-hero-pink-wifi-select")},
   {n:{ru:"Жёлтый",tj:"Зард",en:"Yellow"},hex:"#eed77e",img:WG("ipad-2022-hero-yellow-wifi-select")},
   {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#e3e4e6",img:WG("ipad-2022-hero-silver-wifi-select")}]},
 {id:21,line:"iPad",name:"iPad mini",cat:"tablet",price:6990,old:0,rating:5,new:true,emoji:"📲",modelPage:"ipad-mini.html",
  tag:{ru:"Чип A17 Pro · 8,3″",tj:"Чипи A17 Pro · 8,3″",en:"A17 Pro · 8.3″"},
  colors:[
   {n:{ru:"Синий",tj:"Кабуд",en:"Blue"},hex:"#b8c4d4",img:WG("ipad-mini-select-wifi-blue-202410")},
   {n:{ru:"Фиолетовый",tj:"Бунафш",en:"Purple"},hex:"#bcb6cc",img:WG("ipad-mini-select-wifi-purple-202410")},
   {n:{ru:"Серый космос",tj:"Хокистарӣ",en:"Space Gray"},hex:"#7d7e80",img:WG("ipad-mini-select-wifi-spacegray-202410")},
   {n:{ru:"Сияющая звезда",tj:"Ситоравӣ",en:"Starlight"},hex:"#efe9dd",img:WG("ipad-mini-select-wifi-starlight-202410")}]},
 {id:10,line:"Apple Watch",name:"Watch Ultra 3",cat:"watch",price:9990,old:0,rating:5,new:true,emoji:"⌚",modelPage:"apple-watch-ultra-3.html",
  tag:{ru:"Титан · GPS · до 42 часов",tj:"Титан · GPS · то 42 соат",en:"Titanium · GPS · up to 42h"},
  colors:[{n:{ru:"Натуральный титан",tj:"Титани табиӣ",en:"Natural Titanium"},hex:"#b9b2a8",img:A+"/v/apple-watch-ultra-3/b/images/overview/welcome/hero_endframe__e4ls9pihykya_large_2x.jpg"}]},
 {id:11,line:"Apple Watch",name:"Watch Series 11",cat:"watch",price:4990,old:0,rating:5,new:false,emoji:"⌚",
  tag:{ru:"Здоровье и фитнес каждый день",tj:"Саломатӣ ва фитнес ҳар рӯз",en:"Health and fitness, every day"},
  colors:[{n:{ru:"Чёрный",tj:"Сиёҳ",en:"Black"},hex:"#2b2b2e",img:A+"/v/apple-watch-series-11/c/images/overview/product-viewer/product_design_endframe__d7wjctwjpbo2_large.jpg"}]},
 {id:12,line:"AirPods",name:"AirPods Pro 3",cat:"audio",price:2490,old:0,rating:5,new:true,emoji:"🎧",modelPage:"airpods-pro.html",
  tag:{ru:"Шумоподавление нового поколения",tj:"Бартарафсозии садо насли нав",en:"Next-gen noise cancellation"},
  box:[{ic:"🎧",n:"AirPods Pro 3"},{ic:"🔋",n:{ru:"Зарядный кейс MagSafe",tj:"Ғилофи шаржи MagSafe",en:"MagSafe Charging Case"}},{ic:"👂",n:{ru:"Амбушюры, 4 размера",tj:"Амбушюрҳо, 4 андоза",en:"Ear tips, 4 sizes"}},{ic:"🔌",n:{ru:"Кабель USB‑C",tj:"Сими USB‑C",en:"USB‑C cable"}}],
  colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:A+"/v/airpods/ae/images/overview/hero_endframe__calpooy4ucr6_large_2x.jpg"}]},
 {id:13,line:"AirPods",name:"AirPods 4",cat:"audio",price:1590,old:0,rating:4,new:false,emoji:"🎧",
  tag:{ru:"Удобная посадка и чистый звук",tj:"Шинонидани бароҳат ва садои тоза",en:"Comfy fit, crisp sound"},
  colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:A+"/v/airpods/ae/images/overview/hero__gb4d3fd8jnu6_large_2x.jpg"}]},
 {id:14,line:"AirPods",name:"AirPods Max",cat:"audio",price:5990,old:0,rating:5,new:false,emoji:"🎧",
  tag:{ru:"Наушники высшего класса",tj:"Гӯшмонакҳои дараҷаи олӣ",en:"Premium over-ear sound"},
  highlights:[
   {ic:"🎧",big:"H1",lbl:{ru:"Чип",tj:"Чип",en:"Chip"}},
   {ic:"🔇",big:{ru:"ANC",tj:"ANC",en:"ANC"},lbl:{ru:"Шумоподавление",tj:"Бартарафсозии садо",en:"Noise cancellation"}},
   {ic:"🔋",big:{ru:"до 20 ч",tj:"то 20 соат",en:"up to 20h"},lbl:{ru:"Время работы",tj:"Батарея",en:"Battery"}}],
  box:[{ic:"🎧",n:"AirPods Max"},{ic:"👜",n:{ru:"Чехол Smart Case",tj:"Ғилофи Smart Case",en:"Smart Case"}},{ic:"🔌",n:{ru:"Кабель USB‑C",tj:"Сими USB‑C",en:"USB‑C cable"}}],
  colors:[
   {n:{ru:"Синий",tj:"Кабуд",en:"Blue"},hex:"#5d7d99",img:A+"/v/airpods/ae/images/overview/airpods_max_blue__fsfaleh1smuu_large.png"},
   {n:{ru:"Чёрный",tj:"Сиёҳ",en:"Midnight"},hex:"#2b2b2e",img:A+"/v/airpods/ae/images/overview/airpods_max_black__x3byrd2venmu_large.png"},
   {n:{ru:"Фиолетовый",tj:"Бунафш",en:"Purple"},hex:"#b8b0c8",img:A+"/v/airpods/ae/images/overview/airpods_max_purple__d9y3g3n7cnyq_large.png"},
   {n:{ru:"Оранжевый",tj:"Норанҷӣ",en:"Orange"},hex:"#e08a5b",img:A+"/v/airpods/ae/images/overview/airpods_max_orange__gln3ifz5o9ei_large.png"}]}
];
const P=id=>PRODUCTS.find(p=>p.id===id);
const mainImg=p=>p.card||(p.colors[0]&&p.colors[0].disp)||p.colors[0].img;

/* per-model finish colors (store CDN, transparent PNG) for the Buy flow */
const SC="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/";
const scImg=k=>SC+k+"?wid=900&hei=900&fmt=png-alpha";
const IPH_COLORS={
 1:[["Космический оранжевый","#c8502d","iphone-17-pro-finish-select-cosmicorange-202509"],["Тёмно-синий","#3f4d6b","iphone-17-pro-finish-select-deepblue-202509"],["Серебристый","#dcdee0","iphone-17-pro-finish-select-silver-202509"]],
 2:[["Небесно-голубой","#a9c4d6","iphone-air-finish-select-skyblue-202509"],["Облачно-белый","#ece9e2","iphone-air-finish-select-cloudwhite-202509"],["Светлое золото","#e6d6ad","iphone-air-finish-select-lightgold-202509"],["Чёрный космос","#36373b","iphone-air-finish-select-spaceblack-202509"]],
 3:[["Лавандовый","#cbbfe0","iphone-17-finish-select-lavender-202509"],["Шалфей","#b9c2a8","iphone-17-finish-select-sage-202509"],["Туманно-синий","#aebfcf","iphone-17-finish-select-mistblue-202509"],["Белый","#ece9e6","iphone-17-finish-select-white-202509"],["Чёрный","#2b2b2e","iphone-17-finish-select-black-202509"]],
 4:[["Белый","#ece9e6","iphone-17e-finish-select-white-202603"],["Чёрный","#2b2b2e","iphone-17e-finish-select-black-202603"],["Розовый","#f3c6cf","iphone-17e-finish-select-softpink-202603"]],
 5:[["Ультрамарин","#4a5fc7","iphone-16-ultramarine-select-202409"],["Бирюзовый","#7fb5b0","iphone-16-teal-select-202409"],["Розовый","#f3c6cf","iphone-16-pink-select-202409"],["Белый","#ece9e6","iphone-16-white-select-202409"],["Чёрный","#2b2b2e","iphone-16-black-select-202409"]],
 9:[["Синий","#aebfd6","ipad-air-select-11in-wifi-blue-202405"],["Фиолетовый","#cabfe0","ipad-air-select-11in-wifi-purple-202405"],["Серый космос","#7d7e80","ipad-air-select-11in-wifi-spacegray-202405"],["Сияющая звезда","#f0e9dd","ipad-air-select-11in-wifi-starlight-202405"]]
};
PRODUCTS.forEach(p=>{const c=IPH_COLORS[p.id];if(c)p.buyColors=c.map(([n,hex,k])=>({n:{ru:n,tj:n,en:n},hex,img:scImg(k)}));});
/* richer card imagery: show distinct per-colour photos + swatches on cards */
[1,2,3,4,5,9].forEach(id=>{const p=P(id);if(p&&p.buyColors)p.colors=p.buyColors;});
delete P(1).card;P(1).darkMedia=false;/* iPhone 17 Pro now uses clean png-alpha everywhere */
/* Apple Watch — clean per-finish case images (store CDN _VW_34FR view, transparent 1:1) — image changes per finish, like Apple */
const WCASE=(sz,mat,fin,conn,model)=>"https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-case-"+sz+"-"+mat+"-"+fin+(conn?"-"+conn:"")+"-"+model+"_VW_34FR?wid=900&hei=900&fmt=png-alpha";
const WG=k=>"https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/"+k+"?wid=900&hei=900&fmt=png-alpha";
/* цвет ремешка: {n,hex} */
const bcl=(...arr)=>arr.map(([ru,hex])=>({n:{ru,tj:ru,en:ru},hex}));
const WBANDS_S=[
 {n:{ru:"Спортивный ремешок",tj:"Тасмаи варзишӣ",en:"Sport Band"},hex:"#2b2b2e",add:0,desc:{ru:"Мягкий флуороэластомер — на каждый день и спорт.",tj:"Флуороэластомери нарм — барои ҳар рӯз.",en:"Soft fluoroelastomer for everyday and sport."},
  colors:bcl(["Чёрный","#1c1c1e"],["Сияющая звезда","#e8e0d2"],["Туманно-синий","#a9c4d6"],["Сливовый","#6f3a52"],["Оранжевый","#e8923c"])},
 {n:{ru:"Спортивный браслет",tj:"Sport Loop",en:"Sport Loop"},hex:"#5d7d99",add:0,desc:{ru:"Дышащий нейлон с лёгкой регулировкой.",tj:"Нейлони нафаскашанда бо танзими осон.",en:"Breathable nylon with easy adjustment."},
  colors:bcl(["Чёрный","#2b2b2e"],["Синий","#3f5e8c"],["Зелёное озеро","#5f7d5a"],["Светло-розовый","#e6c8c4"])},
 {n:{ru:"Миланская петля",tj:"Milanese Loop",en:"Milanese Loop"},hex:"#c9b27d",add:tjs(50),desc:{ru:"Плетёная нержавеющая сталь с магнитной застёжкой.",tj:"Пӯлоди зангногир бо басти магнитӣ.",en:"Woven stainless steel with a magnetic closure."},
  colors:bcl(["Натуральный","#d6d6d8"],["Золотой","#c9a96a"],["Графитовый","#45433f"])},
 {n:{ru:"Плетёный ремешок",tj:"Braided Loop",en:"Braided Solo Loop"},hex:"#6e6e73",add:tjs(50),desc:{ru:"Эластичный плетёный — без застёжек.",tj:"Эластикии бофта — бе баст.",en:"Stretchy braided design — no clasp."},
  colors:bcl(["Чёрный","#2b2b2e"],["Тёмно-синий","#4f6d8f"],["Графитовый","#555558"])}];
/* Watch Ultra 3 (titanium, 49mm) */
delete P(10).card;P(10).tint="linear-gradient(180deg,#e6e8ec,#d3d7dd)";
P(10).colors=[
 {n:{ru:"Натуральный титан",tj:"Титани табиӣ",en:"Natural Titanium"},hex:"#b9b2a8",img:WCASE("49","titanium","natural","","ultra3")},
 {n:{ru:"Чёрный титан",tj:"Титани сиёҳ",en:"Black Titanium"},hex:"#39383c",img:WCASE("49","titanium","black","","ultra3")}];
P(10).gallery=[WG("ultra-case-unselect-gallery-1-202509"),WG("ultra-case-unselect-gallery-2-202509"),WG("ultra-case-unselect-gallery-3-202509")];
P(10).bandImgs=[WG("ultra-band-unselect-gallery-1-202509"),WG("ultra-band-unselect-gallery-2-202509"),WG("ultra-band-unselect-gallery-3-202509")];
/* цвет ремешка Ultra: img=ремешок крупно; pN/pB = part-номер ремешка для натур./чёрного корпуса (Scene7-слой) */
const ubc=(ru,hex,key,pN,pB)=>({n:{ru,tj:ru,en:ru},hex,img:WG(key),pN,pB});
/* композит «часы+ремешок» наложением слоёв Apple (Scene7 `+`, без подписи): ремешок + корпус(финиш) + циферблат.
   Ultra: part зависит от финиша (pN/pB), циферблат по семейству. S11/SE3: part единый, циферблат выводится из корпуса. */
function watchCombo(p,bd,bc,ci,col){
  if(!bc||!col||!col.img)return null;
  const m=col.img.match(/\/is\/([a-z0-9-]+)_VW_34FR/i);if(!m)return null;
  const caseKey=m[1];
  if(p.id===10){const part=ci===1?bc.pB:bc.pN;if(!part||!bd.family)return null;return WG(part+"_VW_34FR+"+caseKey+"_VW_34FR+watch-face-49-"+bd.family+"-ultra3_VW_34FR_GEO_US");}
  if(!bc.part)return null;
  const faceKey=caseKey.replace("watch-case","watch-face").replace(/-(nc|cell)-/,"-");
  return WG(bc.part+"_VW_34FR+"+caseKey+"_VW_34FR+"+faceKey+"_VW_34FR");
}
P(10).bands=[
 {n:{ru:"Trail Loop",tj:"Trail Loop",en:"Trail Loop"},hex:"#3a3a3d",add:0,family:"trail",desc:{ru:"Лёгкий тканый — для бега и тренировок.",tj:"Бофтаи сабук — барои давидан.",en:"Light woven band for running and workouts."},
  colors:[ubc("Чёрный/угольный","#3a3a3d","trail-loop-natural-titanium-black-band","MFT84ref","MG9T4ref"),ubc("Ярко-синий","#2f6db5","trail-loop-natural-titanium-blue-band","MFT64ref","MG9Q4ref"),ubc("Неоново-зелёный","#86c545","trail-loop-natural-titanium-green-band","MFT44ref","MG9N4ref")]},
 {n:{ru:"Alpine Loop",tj:"Alpine Loop",en:"Alpine Loop"},hex:"#c98a3d",add:0,family:"alpine",desc:{ru:"Прочный двухслойный с титановым G-крюком.",tj:"Дуқабатаи мустаҳкам бо кармаки титанӣ.",en:"Rugged two-layer weave with a titanium G-hook."},
  colors:[ubc("Чёрный","#2b2b2e","alpine-loop-natural-titanium-black-band","MFTE4ref","MG9G4ref"),ubc("Голубой","#8fb4cc","alpine-loop-natural-titanium-light-blue-band","MFTH4ref","MG9K4ref"),ubc("Терракота","#b5562f","alpine-loop-natural-titanium-terra-cotta-band","MFTA4ref","MG9D4ref")]},
 {n:{ru:"Ocean Band",tj:"Ocean Band",en:"Ocean Band"},hex:"#1f4d6b",add:0,family:"ocean",desc:{ru:"Для водного спорта и дайвинга.",tj:"Барои варзиши обӣ ва ғаввосӣ.",en:"For water sports and recreational diving."},
  colors:[ubc("Якорный синий","#3a5f7d","ocean-band-natural-titanium-anchor-blue-band","MGCC4","MGCJ4"),ubc("Чёрный","#20242a","ocean-band-natural-titanium-black-band","MXTL3ref","MYPD3ref"),ubc("Неоново-зелёный","#9fe04a","ocean-band-natural-titanium-neon-green-band","MGCF4","MGCL4")]}];
/* Watch Series 11 (aluminum + titanium, 42/46mm) */
delete P(11).card;P(11).tint="linear-gradient(180deg,#f5f3f1,#ece8e4)";
const S11_ALU=[
 {n:{ru:"Розовое золото",tj:"Тиллои гулобӣ",en:"Rose Gold"},hex:"#e7c8b8",img:WCASE("46","aluminum","rosegold","nc","s11")},
 {n:{ru:"Тёмная ночь",tj:"Шаби торик",en:"Jet Black"},hex:"#2b2b2e",img:WCASE("46","aluminum","jetblack","nc","s11")},
 {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:WCASE("46","aluminum","silver","nc","s11")},
 {n:{ru:"Серый космос",tj:"Хокистарӣ",en:"Space Gray"},hex:"#6e6e73",img:WCASE("46","aluminum","spacegray","nc","s11")}];
const S11_TI=[
 {n:{ru:"Золотой титан",tj:"Титани тиллоӣ",en:"Gold Titanium"},hex:"#c9a96a",img:WCASE("46","titanium","gold","cell","s11")},
 {n:{ru:"Грифельный титан",tj:"Титани графитӣ",en:"Slate Titanium"},hex:"#4a4744",img:WCASE("46","titanium","slate","cell","s11")},
 {n:{ru:"Натуральный титан",tj:"Титани табиӣ",en:"Natural Titanium"},hex:"#b9b2a8",img:WCASE("46","titanium","natural","cell","s11")}];
P(11).colors=S11_ALU;
P(11).materials=[
 {n:{ru:"Алюминий",tj:"Алюминий",en:"Aluminum"},add:0,fromPrice:tjs(399),finishes:S11_ALU,
  desc:{ru:"Матовые и глянцевые финиши и прочное стекло Ion-X.",tj:"Финишҳои матт ва ялақ ва шишаи мустаҳками Ion-X.",en:"Matte and polished finishes with a durable Ion-X glass display."}},
 {n:{ru:"Титан",tj:"Титан",en:"Titanium"},add:tjs(300),fromPrice:tjs(699),finishes:S11_TI,
  desc:{ru:"Полированный авиационный титан и сапфировое стекло.",tj:"Титани ҳавопаймоии ялақ ва шишаи сапфир.",en:"Polished aerospace-grade titanium with a sapphire crystal display."}}];
P(11).variants=[
 {n:{ru:"42 мм",tj:"42 мм",en:"42mm"},add:0,sub:{ru:"Компактный размер",tj:"Андозаи ҷайбӣ",en:"Compact size"}},
 {n:{ru:"46 мм",tj:"46 мм",en:"46mm"},add:tjs(30),sub:{ru:"Большой дисплей",tj:"Дисплейи калон",en:"Larger display"}}];
/* ремешки Series 11 с part-номерами Apple → композит часы+ремешок наложением слоёв (любой финиш) */
const s11c=(ru,hex,part,bandimg)=>({n:{ru,tj:ru,en:ru},hex,part,img:bandimg?WG(bandimg):undefined});
P(11).bands=[
 {n:{ru:"Спортивный ремешок",tj:"Тасмаи варзишӣ",en:"Sport Band"},hex:"#1c1c1e",add:0,desc:{ru:"Мягкий флуороэластомер — на каждый день и спорт.",tj:"Флуороэластомери нарм.",en:"Soft fluoroelastomer for everyday and sport."},
  colors:[s11c("Яркая гуава","#e84a6f","MHYH4ref","sport-bright-guava-band"),s11c("Сияющая звезда","#e8e0d2","MXM63ref_FV99","sport-starlight-band"),s11c("Светло-розовый","#e6c8c4","MXM83ref_FV99"),s11c("Чёрный","#1c1c1e","MXM23ref_FV99")]},
 {n:{ru:"Спортивный браслет",tj:"Sport Loop",en:"Sport Loop"},hex:"#2b5a3a",add:0,desc:{ru:"Дышащий нейлон с лёгкой регулировкой.",tj:"Нейлони нафаскашанда.",en:"Breathable nylon with easy adjustment."},
  colors:[s11c("Лесной","#2b5a3a","MFFJ4")]},
 {n:{ru:"Миланская петля",tj:"Milanese Loop",en:"Milanese Loop"},hex:"#d6d6d8",add:tjs(50),desc:{ru:"Плетёная нержавеющая сталь с магнитной застёжкой.",tj:"Пӯлоди зангногир бо басти магнитӣ.",en:"Woven stainless steel with a magnetic closure."},
  colors:[s11c("Натуральный","#d6d6d8","MGJ24ref"),s11c("Золотой","#c9a96a","MGJ44ref"),s11c("Графитовый","#45433f","MGJ64ref")]}];
P(11).gallery=[WG("s11-case-unselect-gallery-1-202509"),WG("s11-case-unselect-gallery-2-202509"),WG("s11-case-unselect-gallery-3-202509")];
/* «живые» фото часов для витрин/конфигуратора: композит дефолтный ремешок+корпус(финиш)+ЦИФЕРБЛАТ (экран «горит», как у Apple) */
[10,11].forEach(id=>{const p=P(id);if(!p.bands||!p.bands[0]||!p.bands[0].colors||!p.bands[0].colors[0])return;
  const bd0=p.bands[0],bc0=bd0.colors[0],groups=[];
  if(p.materials)p.materials.forEach(m=>groups.push(m.finishes));else if(p.colors)groups.push(p.colors);
  groups.forEach(g=>g.forEach((c,ci)=>{const d=watchCombo(p,bd0,bc0,ci,c);if(d)c.disp=shrinkCDN(d,480);}));});
P(11).bandImgs=[WG("s11-band-unselect-gallery-1-202509")];
/* Watch SE 3 (new — matches Apple lineup) */
PRODUCTS.push({id:15,line:"Apple Watch",name:"Watch SE 3",cat:"watch",price:6490,old:0,rating:5,new:false,emoji:"⌚",
 tag:{ru:"Главное о здоровье по доступной цене",tj:"Асосиҳои саломатӣ бо нархи дастрас",en:"Essential health features, great value"},tint:"linear-gradient(180deg,#e7f0fb,#d6e6f7)",
 card:"img/se3-mid.webp",
 colors:[
  {n:{ru:"Тёмная ночь",tj:"Шаби торик",en:"Midnight"},hex:"#2e3138",img:"img/se3-mid.webp",sw:WG("watch-case-44-aluminum-midnight-nc-se3_SW_COLOR"),gal:["img/se3-mid.webp","img/se3-mid-a.webp","img/se3-mid-b.webp","img/se3-duo.webp"]},
  {n:{ru:"Сияющая звезда",tj:"Ситоравӣ",en:"Starlight"},hex:"#e9e0d2",img:"img/se3-star.webp",sw:WG("watch-case-44-aluminum-starlight-nc-se3_SW_COLOR"),gal:["img/se3-star.webp","img/se3-star-a.webp","img/se3-star-b.webp","img/se3-duo.webp"]}],
 variants:[
  {n:{ru:"40 мм",tj:"40 мм",en:"40mm"},add:0,sub:{ru:"Компактный размер",tj:"Андозаи ҷайбӣ",en:"Compact size"}},
  {n:{ru:"44 мм",tj:"44 мм",en:"44mm"},add:500,sub:{ru:"Большой дисплей",tj:"Дисплейи калон",en:"Larger display"}}],
 gallery:["img/se3-duo.webp"]});
/* реалистичные свотчи финиша часов (металл-градиент Apple): выводим _SW_COLOR из фото корпуса _VW_34FR */
[10,11,15].forEach(id=>{const p=P(id);const groups=[];if(p.colors)groups.push(p.colors);if(p.materials)p.materials.forEach(m=>groups.push(m.finishes));groups.forEach(g=>g&&g.forEach(c=>{if(c.img&&c.img.indexOf("_VW_34FR")>-1&&!c.sw)c.sw=c.img.replace("_VW_34FR","_SW_COLOR");}));});
/* богатые страницы моделей часов (эталон Ultra 3) */
P(11).modelPage="apple-watch-series-11.html";P(15).modelPage="apple-watch-se-3.html";
P(11).bandImgs=[WG("s11-band-unselect-gallery-1-202509")];P(15).bandImgs=[WG("s11-band-unselect-gallery-1-202509")];
/* iPad Pro — clean per-finish images (store CDN), like watch */
P(8).colors=[
 {n:{ru:"Серый космос",tj:"Хокистарӣ",en:"Space Black"},hex:"#3a3a3c",img:WG("ipad-pro-11-select-wifi-spaceblack-202405")},
 {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:WG("ipad-pro-11-select-wifi-silver-202405")}];
/* Mac — clean per-finish store CDN images (pv_colors were on black → black box) */
P(6).colors=[
 {n:{ru:"Космический чёрный",tj:"Сиёҳи кайҳонӣ",en:"Space Black"},hex:"#2e2c2e",img:WG("mbp14-spaceblack-select-202410")},
 {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:WG("mbp14-silver-select-202410")}];
P(7).colors=[
 {n:{ru:"Небесно-голубой",tj:"Осмонӣ",en:"Sky Blue"},hex:"#b3c7d6",img:WG("mba15-skyblue-select-202503")},
 {n:{ru:"Полночный",tj:"Нимашабӣ",en:"Midnight"},hex:"#2e3641",img:WG("mba15-midnight-select-202503")},
 {n:{ru:"Сияющая звезда",tj:"Ситоравӣ",en:"Starlight"},hex:"#f0e9dd",img:WG("mba15-starlight-select-202503")},
 {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:WG("mba15-silver-select-202503")}];
/* AirPods 4 — clean product image (was a lifestyle photo) */
P(13).colors=[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:WG("airpods-4-anc-select-202409")}];
/* storage / config options [sizeGB, +price] */
/* доплаты за память — в долларах Apple (USD), конвертируются по курсу+наценке */
const STORAGE={1:[[256,0],[512,200],[1024,400]],2:[[256,0],[512,200]],3:[[256,0],[512,200]],4:[[128,0],[256,100]],5:[[128,0],[256,100]],6:[[512,0],[1024,200],[2048,600]],7:[[256,0],[512,200],[1024,400]],8:[[256,0],[512,200],[1024,500],[2048,1000]],9:[[128,0],[256,150],[512,400],[1024,800]],16:[[256,0],[512,200]],18:[[256,0],[512,200],[1024,400]],19:[[256,0],[512,200],[1024,400]],20:[[128,0],[256,120],[512,320]],21:[[128,0],[256,120],[512,320]]};
PRODUCTS.forEach(p=>{const s=STORAGE[p.id];if(s)p.storage=s.map(([gb,add])=>({gb,add:tjs(add)}));});
/* submodel variants (size / Pro·Pro Max) [label, +price, sub] */
/* доплаты за вариант (размер/Pro Max) — тоже в долларах Apple (USD) */
const VARIANTS={
 1:[[{ru:"iPhone 17 Pro",tj:"iPhone 17 Pro",en:"iPhone 17 Pro"},0,{ru:"Экран 6,3″",tj:"Экран 6,3″",en:"6.3″ display"}],[{ru:"iPhone 17 Pro Max",tj:"iPhone 17 Pro Max",en:"iPhone 17 Pro Max"},100,{ru:"Экран 6,9″ · батарея больше",tj:"Экран 6,9″ · батареяи калонтар",en:"6.9″ display · bigger battery"}]],
 6:[[{ru:"14″ MacBook Pro",tj:"14″ MacBook Pro",en:"14″ MacBook Pro"},0,{ru:"Компактный профи",tj:"Касбии ҷайбӣ",en:"Compact pro"}],[{ru:"16″ MacBook Pro",tj:"16″ MacBook Pro",en:"16″ MacBook Pro"},900,{ru:"Большой экран · мощнее",tj:"Экрани калон · пурқувваттар",en:"Bigger display · more power"}]],
 8:[[{ru:"11″ iPad Pro",tj:"11″ iPad Pro",en:"11″ iPad Pro"},0,{ru:"Лёгкий и портативный",tj:"Сабук ва портативӣ",en:"Light and portable"}],[{ru:"13″ iPad Pro",tj:"13″ iPad Pro",en:"13″ iPad Pro"},300,{ru:"Больше места для работы",tj:"Ҷои бештар барои кор",en:"More room to work"}]],
 9:[[{ru:"11″ iPad Air",tj:"11″ iPad Air",en:"11″ iPad Air"},0,{ru:"Лёгкий и портативный",tj:"Сабук ва портативӣ",en:"Light and portable"}],[{ru:"13″ iPad Air",tj:"13″ iPad Air",en:"13″ iPad Air"},200,{ru:"Больше места для работы",tj:"Ҷои бештар барои кор",en:"More room to work"}]],
 15:[[{ru:"40 мм",tj:"40 мм",en:"40mm"},0,{ru:"Компактный размер",tj:"Андозаи ҷайбӣ",en:"Compact size"}],[{ru:"44 мм",tj:"44 мм",en:"44mm"},30,{ru:"Большой дисплей",tj:"Дисплейи калон",en:"Larger display"}]]
};
PRODUCTS.forEach(p=>{const v=VARIANTS[p.id];if(v)p.variants=v.map(([n,add,sub])=>({n,add:tjs(add),sub}));});
/* configurator add-ons (per category, TJS) */
const CARE={phone:1490,laptop:2990,tablet:1490,watch:990,audio:490};
const TRADEIN={phone:3000,laptop:5000,tablet:2500,watch:1200,audio:600};
/* accessories (cat:"acc" — excluded from lineups/catalog, shown on accessories.html; P()/cart/search work) */
const ACCSC="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/";
const accImg=k=>ACCSC+k+"?wid=800&hei=800&fmt=png-alpha";
/* строит набор цветов аксессуара из ключей Apple: свотч-картинка + галерея (главное фото + ракурсы AV1/AV2) */
function accColors(keys,av,names){av=Math.max(av||0,5);return keys.map((k,i)=>{const gal=[accImg(k)];for(let n=1;n<=av;n++)gal.push(accImg(k+"_AV"+n));return {n:(names&&names[i])||{ru:"Цвет "+(i+1),tj:"Ранг "+(i+1),en:"Color "+(i+1)},img:accImg(k),sw:accImg(k+"_SW_COLOR"),gal};});}
/* реальные имена цветов Apple (EN→{ru,tj,en}) */
const CNAMES={"Bright Guava":{ru:"Яркая гуава",tj:"Яркая гуава",en:"Bright Guava"},"Light Moss":{ru:"Светлый мох",tj:"Светлый мох",en:"Light Moss"},"Vanilla":{ru:"Ваниль",tj:"Ваниль",en:"Vanilla"},"Black":{ru:"Чёрный",tj:"Сиёҳ",en:"Black"},"Purple Fog":{ru:"Пурпурный туман",tj:"Пурпурный туман",en:"Purple Fog"},"Anchor Blue":{ru:"Синий якорь",tj:"Синий якорь",en:"Anchor Blue"},"Electric Lavender":{ru:"Лавандовый",tj:"Лавандовый",en:"Electric Lavender"},"Orange":{ru:"Оранжевый",tj:"Норинҷӣ",en:"Orange"},"Terra Cotta":{ru:"Терракота",tj:"Терракота",en:"Terra Cotta"},"Midnight":{ru:"Тёмная ночь",tj:"Тёмная ночь",en:"Midnight"},"Sienna":{ru:"Сиена",tj:"Сиена",en:"Sienna"},"Blue":{ru:"Синий",tj:"Кабуд",en:"Blue"},"Green":{ru:"Зелёный",tj:"Сабз",en:"Green"},"Purple":{ru:"Фиолетовый",tj:"Фиолетовый",en:"Purple"},"Frost":{ru:"Морозный",tj:"Морозный",en:"Frost"},"Shadow":{ru:"Графитовый",tj:"Графитовый",en:"Shadow"},"Sage":{ru:"Шалфей",tj:"Шалфей",en:"Sage"},"Light Violet":{ru:"Светло-фиолетовый",tj:"Светло-фиолетовый",en:"Light Violet"},"Charcoal Gray":{ru:"Угольно-серый",tj:"Угольно-серый",en:"Charcoal Gray"},"Denim":{ru:"Деним",tj:"Деним",en:"Denim"},"White":{ru:"Белый",tj:"Сафед",en:"White"}};
const cn=en=>CNAMES[en]||{ru:en,tj:en,en:en};
const ACC1=A+"/v/apple-pencil/ag/images/overview/hero/hero__cwrg2eertpyu_large_2x.png";
PRODUCTS.push(
 {id:101,line:"AirTag",name:"AirTag",cat:"acc",price:290,rating:5,new:false,emoji:"🔵",tag:{ru:"Находите вещи без труда",tj:"Чизҳоро бе душворӣ ёбед",en:"Keep track of your things"},colors:[{n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#e8e8ea",img:accImg("airtag-single-select-202104")}]},
 {id:102,line:"AirTag",name:"AirTag · 4-pack",cat:"acc",price:990,rating:5,new:false,emoji:"🔵",tag:{ru:"Комплект из четырёх",tj:"Маҷмӯи чаҳорто",en:"Pack of four"},colors:[{n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#e8e8ea",img:accImg("HS942")}]},
 {id:103,line:"Apple Pencil",name:"Apple Pencil Pro",cat:"acc",price:1490,rating:5,new:true,emoji:"✏️",tag:{ru:"Пишите и рисуйте точно",tj:"Дақиқ нависед ва расм кашед",en:"Write and draw with precision"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:ACC1}]},
 {id:104,line:"MagSafe",name:"MagSafe Charger",cat:"acc",price:490,rating:5,new:false,emoji:"🔌",tag:{ru:"Быстрая беспроводная зарядка",tj:"Заряди тези бесим",en:"Fast wireless charging"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("HSG72")}]},
 {id:105,line:"Case",name:"iPhone Case · MagSafe",cat:"acc",price:390,rating:5,new:false,emoji:"📱",tag:{ru:"Защита с поддержкой MagSafe",tj:"Ҳифз бо дастгирии MagSafe",en:"Protection with MagSafe"},colors:[{n:{ru:"Прозрачный",tj:"Шаффоф",en:"Clear"},hex:"#dfe3e8",img:accImg("MHWJ4"),gal:[accImg("MHWJ4"),accImg("MHWJ4_AV1"),accImg("MHWJ4_AV2"),accImg("MHWJ4_AV3"),accImg("MHWJ4_AV4")]}]},
 {id:106,line:"Case",name:"iPhone Clear Case",cat:"acc",price:390,rating:4,new:false,emoji:"📱",tag:{ru:"Прозрачный чехол с MagSafe",tj:"Ғилофи шаффоф бо MagSafe",en:"Clear case with MagSafe"},colors:[{n:{ru:"Прозрачный",tj:"Шаффоф",en:"Clear"},hex:"#dfe3e8",img:accImg("MHWC4"),gal:[accImg("MHWC4"),accImg("MHWC4_AV1"),accImg("MHWC4_AV2"),accImg("MHWC4_AV3")]}]}
);
PRODUCTS.push(
 {id:107,line:"Case",name:"iPhone Tech Woven Case",cat:"acc",rating:5,new:true,emoji:"📱",tag:{ru:"Тканый чехол с MagSafe",tj:"Ғилофи бофта бо MagSafe",en:"Woven case with MagSafe"},colors:accColors(["MGF44","MGF34","MGF54","MGF64","MGF74"],4)},
 {id:108,line:"Case",name:"iPhone Silicone Case",cat:"acc",rating:5,new:true,emoji:"📱",tag:{ru:"Силиконовый чехол с MagSafe",tj:"Ғилофи силиконӣ бо MagSafe",en:"Silicone case with MagSafe"},colors:accColors(["MHVQ4","MGEW4","MGEX4","MGF04","MGF14","MHVM4","MHVT4"],6)},
 {id:109,line:"Strap",name:"iPhone Crossbody Strap",cat:"acc",rating:5,new:true,emoji:"📱",tag:{ru:"Ремешок через плечо для iPhone",tj:"Тасма аз китф барои iPhone",en:"Crossbody strap for iPhone"},colors:accColors(["MHYX4","MGGD4","MHYY4","MGGE4","MGGG4","MGGH4","MGGK4","MGGM4","MGGJ4","MGGL4","MGGN4","MGGF4"],2)},
 {id:110,line:"Case",name:"iPhone Air Clear Case",cat:"acc",rating:5,new:false,emoji:"📱",tag:{ru:"Прозрачный чехол для iPhone Air",tj:"Ғилофи шаффоф барои iPhone Air",en:"Clear case for iPhone Air"},colors:accColors(["MGH34","MGH24"],5,[cn("Frost"),cn("Shadow")])},
 {id:111,line:"Keyboard",name:"Magic Keyboard для iPad",cat:"acc",rating:5,new:true,emoji:"⌨️",tag:{ru:"Клавиатура с трекпадом для iPad",tj:"Клавиатура бо трекпад барои iPad",en:"Keyboard with trackpad for iPad"},colors:[{n:{ru:"Чёрный",tj:"Сиёҳ",en:"Black"},hex:"#3a3a3c",img:accImg("MGYY4")},{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MDFW4")}]},
 {id:112,line:"Case",name:"Smart Folio для iPad",cat:"acc",rating:5,new:false,emoji:"📱",tag:{ru:"Обложка Smart Folio для iPad",tj:"Муқоваи Smart Folio барои iPad",en:"Smart Folio cover for iPad"},colors:accColors(["MWK73","MWK53","MWK63","MWK83"],1,[cn("Sage"),cn("Charcoal Gray"),cn("Denim"),cn("Light Violet")])},
 {id:113,line:"Apple Pencil",name:"Apple Pencil (USB-C)",cat:"acc",rating:5,new:false,emoji:"✏️",tag:{ru:"Стилус с зарядкой через USB-C",tj:"Қалам бо заряди USB-C",en:"Stylus with USB-C charging"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MUWA3")}]},
 {id:114,line:"Keyboard",name:"Magic Keyboard",cat:"acc",rating:5,new:false,emoji:"⌨️",tag:{ru:"Беспроводная клавиатура с Touch ID",tj:"Клавиатураи бесим бо Touch ID",en:"Wireless keyboard with Touch ID"},colors:accColors(["MXK83","MXK73"],1,[{ru:"Чёрный",tj:"Сиёҳ",en:"Black"},{ru:"Белый",tj:"Сафед",en:"White"}])},
 {id:115,line:"Mouse",name:"Magic Mouse",cat:"acc",rating:5,new:false,emoji:"🖱️",tag:{ru:"Беспроводная мышь Multi-Touch",tj:"Мушаки бесими Multi-Touch",en:"Multi-Touch wireless mouse"},colors:[{n:{ru:"Чёрный",tj:"Сиёҳ",en:"Black"},hex:"#2e2e30",img:accImg("MXK63")},{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MXK53")}]},
 {id:116,line:"Charger",name:"USB-C Power Adapter",cat:"acc",rating:5,new:false,emoji:"🔌",tag:{ru:"Быстрая зарядка USB-C",tj:"Заряди тези USB-C",en:"Fast USB-C charging"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MGKN4")}]},
 {id:117,line:"Band",name:"Sport Band",cat:"acc",rating:5,new:true,emoji:"⌚",tag:{ru:"Спортивный ремешок для Apple Watch",tj:"Тасмаи варзишӣ барои Apple Watch",en:"Sport Band for Apple Watch"},colors:accColors(["MHYH4ref","MFGX4ref","MHYF4ref","MHYK4ref","MXLX3ref","MXM23ref","MXM63ref","MXM83ref"],2)},
 {id:118,line:"Band",name:"Alpine Loop",cat:"acc",rating:5,new:true,emoji:"⌚",tag:{ru:"Ремешок Alpine Loop для Apple Watch",tj:"Тасмаи Alpine Loop барои Apple Watch",en:"Alpine Loop for Apple Watch"},colors:accColors(["MFTA4ref","MFTE4ref","MFTH4ref"],2)},
 {id:119,line:"Band",name:"Milanese Loop",cat:"acc",rating:5,new:true,emoji:"⌚",price:tjs(99),tag:{ru:"Миланская петля для Apple Watch",tj:"Тасмаи Milanese Loop барои Apple Watch",en:"Milanese Loop for Apple Watch"},colors:accColors(["MGJ24ref","MGJ44ref","MGJ64ref"],0,[{ru:"Натуральный",tj:"Натуральный",en:"Natural"},{ru:"Золотой",tj:"Тиллоӣ",en:"Gold"},{ru:"Графитовый",tj:"Графитӣ",en:"Graphite"}])},
 {id:120,line:"Band",name:"Trail Loop",cat:"acc",rating:5,new:true,emoji:"⌚",price:tjs(99),tag:{ru:"Ремешок Trail Loop для Apple Watch",tj:"Тасмаи Trail Loop барои Apple Watch",en:"Trail Loop for Apple Watch"},colors:accColors(["MFT84ref","MFT64ref","MFT44ref"],0,[{ru:"Чёрный/угольный",tj:"Сиёҳ",en:"Black/Charcoal"},{ru:"Ярко-синий",tj:"Кабуд",en:"Blue"},{ru:"Неоново-зелёный",tj:"Сабз",en:"Green"}])},
 {id:121,line:"Band",name:"Ocean Band",cat:"acc",rating:5,new:true,emoji:"⌚",price:tjs(99),tag:{ru:"Ремешок Ocean Band для Apple Watch",tj:"Тасмаи Ocean Band барои Apple Watch",en:"Ocean Band for Apple Watch"},colors:accColors(["MGCC4","MXTL3ref","MGCF4"],0,[{ru:"Якорный синий",tj:"Кабуди лангар",en:"Anchor Blue"},{ru:"Чёрный",tj:"Сиёҳ",en:"Black"},{ru:"Неоново-зелёный",tj:"Сабз",en:"Neon Green"}])},
 {id:122,line:"Band",name:"Sport Loop",cat:"acc",rating:5,new:false,emoji:"⌚",price:tjs(49),tag:{ru:"Спортивный браслет для Apple Watch",tj:"Тасмаи варзишӣ Sport Loop",en:"Sport Loop for Apple Watch"},colors:accColors(["MHYU4","MFFH4","MFFJ4","MHYV4","MHYW4","MFFM4ref"],2,[{ru:"Голубая дымка",tj:"Кабуди мулоим",en:"Blue Mist"},{ru:"Якорный синий",tj:"Кабуди лангар",en:"Anchor Blue"},{ru:"Лесной",tj:"Ҷангалӣ",en:"Forest"},{ru:"Канталупа",tj:"Норинҷӣ",en:"Cantaloupe"},{ru:"Розовый",tj:"Гулобӣ",en:"Pink"},{ru:"Чёрный",tj:"Сиёҳ",en:"Black"}])}
);
PRODUCTS.push(
 {id:123,line:"Adapter",name:"USB-C Digital AV Multiport Adapter",cat:"acc",price:tjs(69),rating:5,new:false,emoji:"🔌",tag:{ru:"HDMI, USB и зарядка через USB-C",tj:"HDMI, USB ва заряд тавассути USB-C",en:"HDMI, USB and charging via USB-C"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MUF82")}]},
 {id:124,line:"Adapter",name:"USB-C to USB Adapter",cat:"acc",price:tjs(19),rating:5,new:false,emoji:"🔌",tag:{ru:"Подключение USB-A устройств",tj:"Пайвасти дастгоҳҳои USB-A",en:"Connect USB-A devices"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MJ1M2")}]},
 {id:125,line:"Adapter",name:"USB-C to 3.5 mm Headphone Jack Adapter",cat:"acc",price:tjs(9),rating:5,new:false,emoji:"🎧",tag:{ru:"Проводные наушники через USB-C",tj:"Гӯшмонакҳои симдор тавассути USB-C",en:"Wired headphones via USB-C"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MU7E2")}]},
 {id:126,line:"Cable",name:"240W USB-C Charge Cable (2 м)",cat:"acc",price:tjs(29),rating:5,new:false,emoji:"🧵",tag:{ru:"Быстрая зарядка до 240 Вт",tj:"Заряди тез то 240 Вт",en:"Fast charging up to 240W"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MU2G3")}]},
 {id:127,line:"Cable",name:"USB-C to MagSafe 3 Cable (2 м)",cat:"acc",price:tjs(49),rating:5,new:false,emoji:"🧵",tag:{ru:"Зарядка MacBook через MagSafe 3",tj:"Заряди MacBook тавассути MagSafe 3",en:"Charge MacBook via MagSafe 3"},colors:[{n:{ru:"Небесно-голубой",tj:"Осмонӣ",en:"Sky Blue"},hex:"#a9c4d6",img:accImg("MDF14")}]},
 {id:128,line:"MagSafe",name:"MagSafe Battery",cat:"acc",price:tjs(99),rating:5,new:true,emoji:"🔋",tag:{ru:"Беспроводной внешний аккумулятор",tj:"Батареяи берунаи бесим",en:"Wireless external battery"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MGPG4")}]},
 {id:129,line:"Charger",name:"20W USB-C Power Adapter",cat:"acc",price:tjs(19),rating:5,new:false,emoji:"🔌",tag:{ru:"Компактная быстрая зарядка",tj:"Заряди тези ҷайбӣ",en:"Compact fast charging"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MWVV3")}]},
 {id:130,line:"Charger",name:"35W Dual USB-C Power Adapter",cat:"acc",price:tjs(59),rating:5,new:false,emoji:"🔌",tag:{ru:"Два порта — заряжайте два устройства",tj:"Ду порт — ду дастгоҳро заряд кунед",en:"Two ports — charge two devices"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MNWP3")}]},
 {id:131,line:"Charger",name:"70W USB-C Power Adapter",cat:"acc",price:tjs(59),rating:5,new:false,emoji:"🔌",tag:{ru:"Быстрая зарядка MacBook",tj:"Заряди тези MacBook",en:"Fast MacBook charging"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MQLN3_GEO_US")}]},
 {id:132,line:"Charger",name:"Apple Watch Fast Charger (USB-C)",cat:"acc",price:tjs(29),rating:5,new:false,emoji:"🔌",tag:{ru:"Быстрая зарядка Apple Watch",tj:"Заряди тези Apple Watch",en:"Fast charging for Apple Watch"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MT0H3")}]},
 {id:133,line:"Mouse",name:"Magic Trackpad",cat:"acc",price:tjs(129),rating:5,new:false,emoji:"🖱️",tag:{ru:"Multi-Touch трекпад с Force Touch",tj:"Трекпади Multi-Touch бо Force Touch",en:"Multi-Touch trackpad with Force Touch"},colors:[{n:{ru:"Чёрный",tj:"Сиёҳ",en:"Black"},hex:"#2e2e30",img:accImg("MMMP3")},{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MK2D3")}]}
);
PRODUCTS.push(
 {id:134,line:"Wallet",name:"iPhone FineWoven Wallet",cat:"acc",price:tjs(59),rating:5,new:false,emoji:"👛",tag:{ru:"Кошелёк с MagSafe и Локатором",tj:"Ҳамён бо MagSafe ва Ёбанда",en:"MagSafe wallet with Find My"},colors:accColors(["MGH94","MGH64","MGH84","MGHA4","MGH74"])},
 {id:135,line:"Band",name:"Braided Solo Loop",cat:"acc",price:tjs(99),rating:5,new:false,emoji:"⌚",tag:{ru:"Плетёный ремешок без застёжек",tj:"Тасмаи бофта бе баст",en:"Stretchy braided band, no clasp"},colors:accColors(["MFJU4ref","MFK64ref","MFKX4ref","MFKJ4ref","MGL14ref"])},
 {id:136,line:"AirTag",name:"AirTag FineWoven Key Ring",cat:"acc",price:tjs(39),rating:5,new:false,emoji:"🔑",tag:{ru:"Брелок для AirTag",tj:"Ҷаббандаки AirTag",en:"Key ring for AirTag"},colors:[{n:{ru:"Оранжевый",tj:"Норинҷӣ",en:"Fox Orange"},hex:"#e8923c",img:accImg("MGFY4")}]},
 {id:137,line:"Apple Pencil",name:"Apple Pencil (1‑го поколения)",cat:"acc",price:tjs(99),rating:5,new:false,emoji:"✏️",tag:{ru:"Стилус для совместимых iPad",tj:"Қалам барои iPad-и мувофиқ",en:"Stylus for compatible iPad"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("MK0C2")}]}
);
/* привязка базовых цен к Apple США (USD → сомони × наценка) */
PRODUCTS.forEach(p=>{if(APPLE_USD[p.id]!=null)p.price=tjs(APPLE_USD[p.id]);});
/* совместимость аксессуаров (выбор модели/размера — как у Apple, без изменения цены) */
const FIT_IPH={ru:"Модель iPhone",tj:"Модели iPhone",en:"iPhone model"};
const FIT_IPAD={ru:"Модель iPad",tj:"Модели iPad",en:"iPad model"};
const FIT_SIZE={ru:"Размер",tj:"Андоза",en:"Size"};
const IPH4=["iPhone Air","iPhone 17","iPhone 17 Pro","iPhone 17 Pro Max"];
const IPAD4=["iPad Pro 11″","iPad Pro 13″","iPad Air 11″","iPad Air 13″"];
/* простой селектор без смены фото: единственная модель (совместимость) или размер ремешка */
const FITS={
 110:{l:FIT_IPH,o:["iPhone Air"]},
 112:{l:FIT_IPAD,o:["iPad Air 11″"]},
 117:{l:FIT_SIZE,o:[{ru:"S/M · 40–42 мм",tj:"S/M · 40–42 мм",en:"S/M · 40–42mm"},{ru:"M/L · 44–49 мм",tj:"M/L · 44–49 мм",en:"M/L · 44–49mm"}]},
 118:{l:FIT_SIZE,o:[{ru:"S · 46–49 мм",tj:"S · 46–49 мм",en:"S · 46–49mm"},{ru:"M · 46–49 мм",tj:"M · 46–49 мм",en:"M · 46–49mm"},{ru:"L · 46–49 мм",tj:"L · 46–49 мм",en:"L · 46–49mm"}]},
 119:{l:FIT_SIZE,o:[{ru:"S/M · 42 мм",tj:"S/M · 42 мм",en:"S/M · 42mm"},{ru:"M/L · 46 мм",tj:"M/L · 46 мм",en:"M/L · 46mm"}]},
 120:{l:FIT_SIZE,o:[{ru:"S/M · 46–49 мм",tj:"S/M · 46–49 мм",en:"S/M · 46–49mm"},{ru:"M/L · 46–49 мм",tj:"M/L · 46–49 мм",en:"M/L · 46–49mm"}]},
 121:{l:FIT_SIZE,o:[{ru:"49 мм",tj:"49 мм",en:"49mm"}]},
 122:{l:FIT_SIZE,o:[{ru:"S/M · 40–42 мм",tj:"S/M · 40–42 мм",en:"S/M · 40–42mm"},{ru:"M/L · 44–46 мм",tj:"M/L · 44–46 мм",en:"M/L · 44–46mm"}]}
};
PRODUCTS.forEach(p=>{const f=FITS[p.id];if(f)p.fit={label:f.l,opts:f.o.map(o=>typeof o==="string"?{ru:o,tj:o,en:o}:o)};});
/* выбор модели СО сменой фото+цветов: у каждой модели свои ключи Apple (камера-вырез разный) + своё число ракурсов */
const mdl=name=>({ru:name,tj:name,en:name});
const FITCOLORS={
 108:[
  ["iPhone 17",["MHVQ4","MGEX4","MHVM4","MGF14","MGF04","MGEW4","MHVT4"],["Bright Guava","Light Moss","Vanilla","Black","Purple Fog","Anchor Blue","Electric Lavender"],6],
  ["iPhone 17 Pro",["MGFE4","MGFK4","MHVX4","MGFJ4","MHW04","MGFG4","MGFH4"],["Orange","Black","Vanilla","Terra Cotta","Bright Guava","Purple Fog","Midnight"],4],
  ["iPhone 17 Pro Max",["MGFR4","MGFQ4","MGFN4","MHW64","MGFL4","MGFP4","MHW54"],["Black","Terra Cotta","Purple Fog","Bright Guava","Orange","Midnight","Vanilla"],2]
 ],
 107:[
  ["iPhone 17 Pro",["MGF54","MGF74","MGF44","MGF34","MGF64"],["Purple","Green","Blue","Black","Sienna"],4],
  ["iPhone 17 Pro Max",["MGF84","MGF94","MGFA4","MGFD4","MGFC4"],["Black","Blue","Purple","Green","Sienna"],2]
 ],
 111:[
  ["iPad Air 11″",["MGYX4","MDFV4"],["Black","White"],5],
  ["iPad Air 13″",["MGYY4","MDFW4"],["Black","White"],5]
 ]
};
PRODUCTS.forEach(p=>{const f=FITCOLORS[p.id];if(f){p.fitColors={label:(/iPad|iMac|Mac/.test(f[0][0])?FIT_IPAD:FIT_IPH),models:f.map(([mn,keys,names,av])=>({n:mdl(mn),colors:accColors(keys,av,names.map(cn))}))};p.colors=p.fitColors.models[0].colors;}});
/* категории аксессуаров (accessories.html — фильтр как у Apple) */
const ACAT={101:"find",102:"find",103:"pencil",104:"charge",105:"case",106:"case",107:"case",108:"case",109:"case",110:"case",111:"input",112:"case",113:"pencil",114:"input",115:"input",116:"charge",117:"band",118:"band",119:"band",120:"band",121:"band",122:"band",123:"cable",124:"cable",125:"cable",126:"cable",127:"cable",128:"charge",129:"charge",130:"charge",131:"charge",132:"charge",133:"input",134:"case",135:"band",136:"find",137:"pencil"};
const ACAT_CATS=[["all",{ru:"Все",tj:"Ҳама",en:"All"}],["case",{ru:"Чехлы и защита",tj:"Ғилофу ҳифз",en:"Cases & protection"}],["input",{ru:"Клавиатуры и мыши",tj:"Клавиатура ва муш",en:"Keyboards & mice"}],["band",{ru:"Ремешки для Watch",tj:"Тасмаҳо барои Watch",en:"Watch bands"}],["charge",{ru:"Зарядка",tj:"Заряд",en:"Power"}],["cable",{ru:"Кабели и адаптеры",tj:"Симу адаптерҳо",en:"Cables & adapters"}],["pencil",{ru:"Apple Pencil",tj:"Apple Pencil",en:"Apple Pencil"}],["find",{ru:"Поиск вещей",tj:"Ёфтани ашё",en:"Find My"}]];
/* свои лёгкие WebP-фото (img/pN.webp) для карточек/линеек/поиска — быстрая загрузка вместо тяжёлых apple.com */
const LOCALIMG=new Set([1,2,3,4,5,6,7,8,9,12,13,14,16,18,19,101,102,103,104,105,106]);
PRODUCTS.forEach(p=>{if(LOCALIMG.has(p.id)){const f="img/p"+p.id+".webp";p.card=f;if(p.lineImg)p.lineImg=f;}});
const stLabel=gb=>gb<1024?gb+" "+t("gb"):(gb/1024)+" "+t("tb");
const priceOf=c=>{const p=P(c.id);return (c.price||(p?p.price:0));};
const cartSum=()=>cart.reduce((s,c)=>s+priceOf(c)*c.qty,0);

/* ===== LINE_INFO (per category) ===== */
const LINE_INFO=[
 {key:"iphone",cat:"phone",page:"iphone.html",buyPage:"buy-iphone.html",dark:true,grad:"radial-gradient(circle at 50% 30%,#1a1a22,#0a0a0f)",emoji:"📱",new:true,
  img:A+"/v/iphone-17-pro/g/images/overview/highlights/highlights_design_endframe__eu8gj0kqlmoi_large_2x.jpg",name:"iPhone",
  heroVideo:A+"/105/media/us/iphone-17-pro/2025/704d4474-8e63-4ce7-9917-bb47b1ca4ba0/anim/hero/medium.mp4",
  tagline:{ru:"Знакомьтесь с новой линейкой iPhone",tj:"Бо хатти нави iPhone шинос шавед",en:"Meet the latest iPhone lineup"},
  desc:{ru:"От титанового iPhone 17 Pro до самого тонкого iPhone Air — пять моделей с чипом A19 и лучшими камерами Apple.",tj:"Аз iPhone 17 Pro-и титанӣ то тунуктарин iPhone Air — панҷ модел бо чипи A19 ва беҳтарин камераҳои Apple.",en:"From the titanium iPhone 17 Pro to the thinnest iPhone Air — five models with the A19 chip and Apple's best cameras."},
  feats:[{ru:"Чип A19 / A19 Pro",tj:"Чипи A19 / A19 Pro",en:"A19 / A19 Pro chip"},{ru:"Камера до 48 Мп",tj:"Камераи то 48 Мп",en:"Up to 48 MP camera"},{ru:"Титановый корпус (Pro)",tj:"Корпуси титанӣ (Pro)",en:"Titanium design (Pro)"}]},
 {key:"mac",cat:"laptop",page:"mac.html",buyPage:"buy-mac.html",grad:"linear-gradient(180deg,#eaf2fb,#d6e7f5)",emoji:"💻",new:true,
  img:A+"/v/macbook-air/z/images/overview/hero/hero_endframe__c67cz35iy9me_large_2x.png",name:"Mac",
  heroVideo:A+"/105/media/us/macbook-pro/2025/785e1bc4-d1bd-4cf4-b1b3-94b9411c9e74/anim/hero/medium.mp4",
  tagline:{ru:"Теперь с чипом M5",tj:"Акнун бо чипи M5",en:"Now supercharged by M5"},
  desc:{ru:"MacBook Air и MacBook Pro на чипах Apple: невероятная производительность и до 18 часов автономной работы.",tj:"MacBook Air ва MacBook Pro дар чипҳои Apple: маҳсулнокии бениҳоят ва то 18 соат кор.",en:"MacBook Air and MacBook Pro on Apple silicon: incredible performance and up to 18 hours of battery."},
  feats:[{ru:"Чипы M4 / M5",tj:"Чипҳои M4 / M5",en:"M4 / M5 chips"},{ru:"До 18 часов работы",tj:"То 18 соат кор",en:"Up to 18h battery"},{ru:"Дисплей Liquid Retina",tj:"Дисплейи Liquid Retina",en:"Liquid Retina display"}]},
 {key:"ipad",cat:"tablet",page:"ipad.html",buyPage:"buy-ipad.html",grad:"linear-gradient(180deg,#e9f3fb,#d1e6f4)",emoji:"📲",
  img:A+"/v/ipad-air/ah/images/overview/hero/hero_endframe__6gl84bccyaqi_large_2x.png",name:"iPad",
  heroVideo:A+"/105/media/us/ipad-pro/2025/adee90db-c01e-430d-b726-fe64c0063f08/anim/hero/medium.mp4",
  tagline:{ru:"Мощь, которую можно взять с собой",tj:"Қувва, ки бо худ мебаред",en:"Power you can take anywhere"},
  desc:{ru:"iPad Pro с чипом M5 и дисплеем Ultra Retina XDR, а также лёгкий и универсальный iPad Air.",tj:"iPad Pro бо чипи M5 ва дисплейи Ultra Retina XDR, инчунин iPad Air-и сабук.",en:"iPad Pro with the M5 chip and Ultra Retina XDR display, plus the light and versatile iPad Air."},
  feats:[{ru:"Чип M5",tj:"Чипи M5",en:"M5 chip"},{ru:"Дисплей Ultra Retina XDR",tj:"Ultra Retina XDR",en:"Ultra Retina XDR display"},{ru:"Поддержка Apple Pencil Pro",tj:"Дастгирии Apple Pencil Pro",en:"Apple Pencil Pro support"}]},
 {key:"watch",cat:"watch",page:"watch.html",buyPage:"buy-watch.html",dark:true,grad:"radial-gradient(circle at 50% 30%,#26262e,#08080b)",emoji:"⌚",new:true,
  img:"https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-case-46-aluminum-jetblack-nc-s11_VW_34FR?wid=900&hei=900&fmt=png-alpha",name:"Apple Watch",
  noHeroMedia:true,
  tagline:{ru:"Здоровье и фитнес на запястье",tj:"Саломатӣ ва фитнес дар дастатон",en:"Health and fitness on your wrist"},
  desc:{ru:"От прочных Watch Ultra 3 для спорта до Watch Series 11 на каждый день — забота о здоровье 24/7.",tj:"Аз Watch Ultra 3-и мустаҳкам барои варзиш то Watch Series 11 барои ҳар рӯз — ғамхории саломатӣ 24/7.",en:"From the rugged Watch Ultra 3 to the everyday Watch Series 11 — 24/7 health tracking."},
  feats:[{ru:"Титановый корпус (Ultra)",tj:"Корпуси титанӣ (Ultra)",en:"Titanium case (Ultra)"},{ru:"GPS и сотовая связь",tj:"GPS ва алоқаи мобилӣ",en:"GPS + Cellular"},{ru:"До 42 часов работы",tj:"То 42 соат кор",en:"Up to 42h battery"}]},
 {key:"airpods",cat:"audio",page:"airpods.html",buyPage:"buy-airpods.html",grad:"linear-gradient(180deg,#f3f4f6,#e6e8ee)",emoji:"🎧",
  img:A+"/v/airpods/ae/images/overview/airpods_max_blue__fsfaleh1smuu_large.png",name:"AirPods",
  heroVideo:A+"/105/media/us/airpods/2025/515ae144-8530-47d0-85d1-22a263f4b237/anim/hero/large.mp4",
  tagline:{ru:"Звук, который тебя окружает",tj:"Садое, ки шуморо иҳота мекунад",en:"Sound that surrounds you"},
  desc:{ru:"AirPods Pro 3 с топовым шумоподавлением, лёгкие AirPods 4 и полноразмерные AirPods Max.",tj:"AirPods Pro 3 бо бартарафсозии беҳтарини садо, AirPods 4-и сабук ва AirPods Max.",en:"AirPods Pro 3 with top-tier noise cancellation, lightweight AirPods 4 and over-ear AirPods Max."},
  feats:[{ru:"Активное шумоподавление",tj:"Бартарафсозии фаъоли садо",en:"Active Noise Cancellation"},{ru:"Пространственный звук",tj:"Садои фазоӣ",en:"Spatial Audio"},{ru:"До 30 часов с кейсом",tj:"То 30 соат бо кейс",en:"Up to 30h with case"}]}
];
const LI=key=>LINE_INFO.find(l=>l.key===key);
const LIcat=cat=>LINE_INFO.find(l=>l.cat===cat);

/* ===== PAGEDATA: rich product-page content (highlights + advantages) ===== */
const IM=A+"/v/";
const PAGEDATA={
 iphone:{why:{ru:"Почему iPhone",tj:"Чаро iPhone",en:"Why iPhone"},
  highlights:[
   {dark:1,img:IM+"iphone-17-pro/g/images/overview/cameras/intro/hero_camera__f42igewygpqy_large_2x.jpg",h:{ru:"Продвинутая система камер для чётких фото и детального видео.",tj:"Системаи камераи пешрафта барои аксу видеои возеҳ.",en:"An advanced camera system for sharp photos and detailed video."}},
   {dark:1,img:IM+"iphone-17-pro/g/images/overview/design/design_endframe__7k7qs1qlnpu6_large_2x.jpg",h:{ru:"Прочный и элегантный корпус, приятный в руке.",tj:"Корпуси мустаҳкам ва шево, дар даст форам.",en:"A durable, elegant design that feels great in the hand."}},
   {dark:1,img:IM+"iphone-17-pro/g/images/overview/performance/chip/performance-hero_endframe__fazyny3rhsuy_large_2x.jpg",h:{ru:"Мощный чип Apple — быстрая работа и игры без тормозов.",tj:"Чипи пурқуввати Apple — кор ва бозиҳои зуд.",en:"A powerful Apple chip — fast performance and smooth gaming."}}],
  adv:[{ic:"📷",h:{ru:"Отличная камера",tj:"Камераи аъло",en:"Great camera"},p:{ru:"Чёткие фото и видео в любых условиях.",tj:"Аксу видеои возеҳ дар ҳама шароит.",en:"Sharp photos and video in any conditions."}},
   {ic:"🛡️",h:{ru:"Надёжный корпус",tj:"Корпуси боэътимод",en:"Durable design"},p:{ru:"Прочные материалы и защита от воды и пыли.",tj:"Маводи мустаҳкам ва ҳифз аз об ва чанг.",en:"Tough materials with water and dust resistance."}},
   {ic:"⚡",h:{ru:"Чип Apple",tj:"Чипи Apple",en:"Apple chip"},p:{ru:"Молниеносная скорость и плавная работа.",tj:"Суръати барқ ва кори ҳамвор.",en:"Lightning-fast speed and smooth performance."}}]},
 mac:{why:{ru:"Почему Mac",tj:"Чаро Mac",en:"Why Mac"},
  highlights:[
   {dark:0,img:IM+"macbook-air/z/images/overview/display/display_hero__fiig28r0yq2q_large_2x.jpg",h:{ru:"Дисплей <b>Liquid Retina</b>. Яркий, чёткий, красивый.",tj:"Дисплейи <b>Liquid Retina</b>. Равшан ва зебо.",en:"<b>Liquid Retina</b> display. Bright, sharp, beautiful."}},
   {dark:1,img:IM+"macbook-pro/ax/images/overview/battery/battery_hero__db4y37bs7cmu_large_2x.jpg",h:{ru:"До <b>18 часов</b> работы от одной зарядки.",tj:"То <b>18 соат</b> кор аз як заряд.",en:"Up to <b>18 hours</b> of battery life."}},
   {dark:0,img:IM+"macbook-pro/ax/images/overview/display/display_hero__c32k5z50p94y_large_2x.jpg",h:{ru:"Дисплей <b>Liquid Retina XDR</b> на MacBook Pro.",tj:"Дисплейи <b>Liquid Retina XDR</b> дар MacBook Pro.",en:"<b>Liquid Retina XDR</b> display on MacBook Pro."}}],
  adv:[{ic:"⚡",h:{ru:"Чипы M4 / M5",tj:"Чипҳои M4 / M5",en:"M4 / M5 chips"},p:{ru:"Невероятная скорость при полной тишине.",tj:"Суръати бениҳоят дар оромии комил.",en:"Incredible speed, whisper quiet."}},
   {ic:"🔋",h:{ru:"До 18 часов",tj:"То 18 соат",en:"Up to 18 hours"},p:{ru:"Работает весь день без подзарядки.",tj:"Тамоми рӯз бе заряд кор мекунад.",en:"All-day battery, no charger needed."}},
   {ic:"🖥️",h:{ru:"Дисплей Retina",tj:"Дисплейи Retina",en:"Retina display"},p:{ru:"Миллиарды цветов и невероятная чёткость.",tj:"Миллиардҳо ранг ва возеҳии аҷиб.",en:"Billions of colors, stunning clarity."}}]},
 ipad:{why:{ru:"Почему iPad",tj:"Чаро iPad",en:"Why iPad"},
  highlights:[
   {dark:1,img:IM+"ipad-pro/aw/images/overview/chip/chip_hero_endframe__becrgbad20j6_large_2x.jpg",h:{ru:"Чип <b>M5</b> — мощь компьютера в планшете.",tj:"Чипи <b>M5</b> — қуввати компютер дар планшет.",en:"The <b>M5</b> chip — computer power in a tablet."}},
   {dark:0,img:IM+"ipad-pro/aw/images/overview/display/display_hero_endframe__fr1073m9t56y_large_2x.jpg",h:{ru:"Дисплей <b>Ultra Retina XDR</b>. Невероятно тонкий.",tj:"Дисплейи <b>Ultra Retina XDR</b>. Бениҳоят тунук.",en:"<b>Ultra Retina XDR</b> display. Impossibly thin."}}],
  adv:[{ic:"⚡",h:{ru:"Чип M5",tj:"Чипи M5",en:"M5 chip"},p:{ru:"Справится с любой задачей и игрой.",tj:"Бо ҳар вазифа ва бозӣ мерасад.",en:"Handles any task or game."}},
   {ic:"✏️",h:{ru:"Apple Pencil Pro",tj:"Apple Pencil Pro",en:"Apple Pencil Pro"},p:{ru:"Рисуйте и пишите с точностью до пикселя.",tj:"Бо дақиқии пиксел нависед ва расм кашед.",en:"Draw and write with pixel precision."}},
   {ic:"🖥️",h:{ru:"Ultra Retina XDR",tj:"Ultra Retina XDR",en:"Ultra Retina XDR"},p:{ru:"Самый продвинутый дисплей iPad.",tj:"Пешрафтатарин дисплейи iPad.",en:"The most advanced iPad display."}}]},
 watch:{why:{ru:"Почему Apple Watch",tj:"Чаро Apple Watch",en:"Why Apple Watch"},
  highlights:[
   {dark:0,img:IM+"apple-watch-series-11/c/images/overview/product-viewer/product_display_endframe__baw4nxfmflbm_large.jpg",h:{ru:"Самый яркий <b>Always-On</b> дисплей Retina.",tj:"Дисплейи <b>Always-On</b> Retina — равшантарин.",en:"The brightest <b>Always-On</b> Retina display."}},
   {dark:0,img:IM+"apple-watch-series-11/c/images/overview/product-viewer/product_design_endframe__d7wjctwjpbo2_large.jpg",h:{ru:"Прочный корпус — <b>титан</b> или алюминий.",tj:"Корпуси мустаҳкам — <b>титан</b> ё алюминий.",en:"A durable case — <b>titanium</b> or aluminum."}},
   {dark:0,img:IM+"apple-watch-series-11/c/images/overview/highlights/highlights_battery_endframe__d8dlmkib4qky_large.jpg",h:{ru:"До <b>24 часов</b> работы и быстрая зарядка.",tj:"То <b>24 соат</b> кор ва заряди тез.",en:"Up to <b>24 hours</b> and fast charging."}}],
  adv:[{ic:"❤️",h:{ru:"Здоровье 24/7",tj:"Саломатӣ 24/7",en:"Health 24/7"},p:{ru:"Пульс, ЭКГ, кислород в крови и контроль сна.",tj:"Набз, ЭКГ, оксиген ва назорати хоб.",en:"Heart rate, ECG, blood oxygen and sleep tracking."}},
   {ic:"🏃",h:{ru:"Фитнес и активность",tj:"Фитнес ва фаъолият",en:"Fitness and activity"},p:{ru:"Кольца активности и десятки видов тренировок.",tj:"Ҳалқаҳои фаъолият ва даҳҳо намуди машқ.",en:"Activity rings and dozens of workout types."}},
   {ic:"📡",h:{ru:"Всегда на связи",tj:"Ҳамеша дар тамос",en:"Always connected"},p:{ru:"Звонки, сообщения и Apple Pay прямо с запястья.",tj:"Занг, паём ва Apple Pay аз дастатон.",en:"Calls, messages and Apple Pay from your wrist."}}]},
 airpods:{why:{ru:"Почему AirPods",tj:"Чаро AirPods",en:"Why AirPods"},
  highlights:[
   {dark:1,video:A+"/105/media/us/airpods-max/2024/e8f376d6-82b2-40ca-8a22-5f87de755d6b/anim/highlights-anc/large.mp4",h:{ru:"Активное <b>шумоподавление</b> высшего класса.",tj:"<b>Бартарафсозии садо</b>и дараҷаи олӣ.",en:"World-class active <b>Noise Cancellation</b>."}},
   {dark:0,video:A+"/105/media/us/airpods-pro/2025/7acffb13-4adb-40b1-9393-8f1c99bc6c90/anim/fit-feel/medium.mp4",h:{ru:"Идеальная <b>посадка</b> и звукоизоляция.",tj:"<b>Насб</b>и идеалӣ ва садоизолятсия.",en:"A perfect <b>fit</b> and seal."}},
   {dark:0,video:A+"/105/media/us/airpods-pro/2025/7acffb13-4adb-40b1-9393-8f1c99bc6c90/anim/heart-rate/medium.mp4",h:{ru:"Датчик <b>пульса</b> прямо в ушах.",tj:"Сенсори <b>набз</b> дар гӯшҳо.",en:"A <b>heart rate</b> sensor in your ears."}},
   {dark:0,video:A+"/105/media/us/airpods-pro/2025/7acffb13-4adb-40b1-9393-8f1c99bc6c90/anim/connectivity/medium.mp4",h:{ru:"Мгновенное <b>переключение</b> между устройствами Apple.",tj:"Гузариши фаврӣ байни дастгоҳҳои Apple.",en:"Instant <b>switching</b> across Apple devices."}}],
  adv:[{ic:"🔇",h:{ru:"Шумоподавление",tj:"Бартарафсозии садо",en:"Noise Cancellation"},p:{ru:"Полное погружение в музыку где угодно.",tj:"Ғарқшавии пурра дар мусиқӣ.",en:"Total immersion in your music."}},
   {ic:"🎧",h:{ru:"Пространственный звук",tj:"Садои фазоӣ",en:"Spatial Audio"},p:{ru:"Объёмное звучание вокруг вас.",tj:"Садои ҳаҷмӣ дар атрофи шумо.",en:"Immersive surround sound."}},
   {ic:"🔋",h:{ru:"До 30 часов",tj:"То 30 соат",en:"Up to 30 hours"},p:{ru:"Долгая работа вместе с зарядным кейсом.",tj:"Кори дароз бо кейси заряд.",en:"Long battery life with the charging case."}}]}
};
/* Per-product rich media pulled from Apple's own pages (own photos + hero video).
   Заполняется по модели: фото скачаны в img/ (webp), видео — hotlink Apple CDN. */
const PRODUCTDATA={
 2:{heroVideo:"https://www.apple.com/105/media/us/iphone-air/2025/731189b1-a606-493f-afa4-7c766a8fd08d/anim/highlights-design/large.mp4",
    gallery:[{img:"img/air-design.webp",h:{ru:"Самый тонкий iPhone. Прочный корпус из титана.",tj:"Тунуктарин iPhone. Корпуси титанӣ.",en:"The thinnest iPhone. Durable titanium design."}},
     {img:"img/air-camera.webp",h:{ru:"Камера 48 Мп Fusion для чётких фото и видео 4K.",tj:"Камераи 48 Мп Fusion барои аксу видеои 4K.",en:"48 MP Fusion camera for sharp photos and 4K video."}},
     {img:"img/air-chip.webp",h:{ru:"Чип A19 Pro — молниеносная производительность.",tj:"Чипи A19 Pro — иҷрои барқосо.",en:"A19 Pro chip — blazing performance."}}]},
 3:{heroVideo:"https://www.apple.com/105/media/us/iphone-17/2025/b2c72de3-1cbc-4e24-b4d3-23c7abcec4ec/anim/hero/large.mp4",gallery:[
   {img:"img/p3-1.webp",h:{ru:"Прочный экран Ceramic Shield и продуманный дизайн.",tj:"Экрани мустаҳками Ceramic Shield ва тарҳи зебо.",en:"Durable Ceramic Shield front and refined design."}},
   {img:"img/p3-2.webp",h:{ru:"Продвинутая система камер 48 Мп и видео 4K.",tj:"Системаи камераи 48 Мп ва видеои 4K.",en:"Advanced 48 MP camera system and 4K video."}},
   {img:"img/p3-3.webp",h:{ru:"Мощный чип Apple — быстро и энергоэффективно.",tj:"Чипи пурқуввати Apple — зуд ва камсарф.",en:"Powerful Apple chip — fast and efficient."}}]},
 7:{gallery:[
   {img:"img/p7-1.webp",h:{ru:"Невероятно тонкий и лёгкий — всегда с собой.",tj:"Бениҳоят тунук ва сабук — ҳамеша бо худ.",en:"Incredibly thin and light — take it anywhere."}},
   {img:"img/p7-2.webp",h:{ru:"Чип Apple M — мощно и абсолютно бесшумно.",tj:"Чипи Apple M — пурқувват ва ором.",en:"Apple M chip — powerful and silent."}},
   {img:"img/p7-3.webp",h:{ru:"До 18 часов работы от одной зарядки.",tj:"То 18 соат кор аз як заряд.",en:"Up to 18 hours of battery life."}}]},
 9:{gallery:[
   {img:"img/p9-1.webp",h:{ru:"Тонкий и портативный — 11″ или 13″.",tj:"Тунук ва сабук — 11″ ё 13″.",en:"Thin and portable — 11″ or 13″."}},
   {img:"img/p9-2.webp",h:{ru:"Чип Apple M — справится с любой задачей.",tj:"Чипи Apple M — ҳар вазифаро иҷро мекунад.",en:"Apple M chip — handles any task."}},
   {img:"img/p9-3.webp",h:{ru:"Поддержка Apple Pencil Pro для заметок и рисунков.",tj:"Дастгирии Apple Pencil Pro барои навису расм.",en:"Works with Apple Pencil Pro for notes and art."}}]},
 11:{gallery:[
   {img:"img/p11-1.webp",h:{ru:"Прочный корпус и яркий дисплей Always-On.",tj:"Корпуси мустаҳкам ва дисплейи равшан Always-On.",en:"Durable case and bright Always-On display."}},
   {img:"img/p11-2.webp",h:{ru:"Датчики здоровья: пульс, ЭКГ, сон и не только.",tj:"Сенсорҳои саломатӣ: набз, ЭКГ, хоб.",en:"Health sensors: heart rate, ECG, sleep and more."}},
   {img:"img/p11-3.webp",h:{ru:"Точные метрики для тренировок и активности.",tj:"Метрикаи дақиқ барои машқу фаъолият.",en:"Precise metrics for workouts and activity."}}]},
 13:{gallery:[
   {img:"img/p13-1.webp",h:{ru:"Удобная посадка и лёгкий дизайн на каждый день.",tj:"Шинондани қулай ва тарҳи сабук.",en:"Comfortable fit and light everyday design."}},
   {img:"img/p13-2.webp",h:{ru:"Чистый звук нового поколения с чипом H2.",tj:"Садои тозаи насли нав бо чипи H2.",en:"Next-generation clear sound with the H2 chip."}},
   {img:"img/p13-3.webp",h:{ru:"Компактный кейс с зарядкой через USB-C.",tj:"Кейси ҷайбӣ бо заряди USB-C.",en:"Compact case with USB-C charging."}}]},
 14:{gallery:[
   {img:"img/p14-1.webp",h:{ru:"Премиальные материалы и продуманный дизайн.",tj:"Маводи дараҷаи олӣ ва тарҳи зебо.",en:"Premium materials and refined design."}},
   {img:"img/p14-2.webp",h:{ru:"Звук высшего класса с насыщенными деталями.",tj:"Садои дараҷаи олӣ бо тафсилоти бой.",en:"High-fidelity sound with rich detail."}},
   {img:"img/p14-3.webp",h:{ru:"Активное шумоподавление для полного погружения.",tj:"Бартарафсозии садо барои ғарқшавии пурра.",en:"Active Noise Cancellation for total immersion."}}]},
 15:{gallery:[
   {img:"img/p15-1.webp",h:{ru:"Главные датчики здоровья по доступной цене.",tj:"Сенсорҳои асосии саломатӣ бо нархи дастрас.",en:"Essential health sensors at a great value."}},
   {img:"img/p15-2.webp",h:{ru:"Прочный корпус, готовый к ежедневным нагрузкам.",tj:"Корпуси мустаҳкам барои ҳар рӯз.",en:"Durable case ready for everyday life."}},
   {img:"img/p15-3.webp",h:{ru:"Отслеживание сна и активности 24/7.",tj:"Назорати хоб ва фаъолият 24/7.",en:"Sleep and activity tracking 24/7."}}]},
 18:{gallery:[
   {img:"img/p18-1.webp",h:{ru:"Дисплей 24″ 4,5K Retina — яркий и чёткий.",tj:"Дисплейи 24″ 4,5K Retina — равшан ва возеҳ.",en:"24″ 4.5K Retina display — bright and sharp."}},
   {img:"img/p18-2.webp",h:{ru:"Тонкий корпус в пяти ярких цветах.",tj:"Корпуси тунук дар панҷ ранги дурахшон.",en:"Slim design in five vibrant colors."}},
   {img:"img/p18-3.webp",h:{ru:"Чип Apple M и Apple Intelligence для всего.",tj:"Чипи Apple M ва Apple Intelligence.",en:"Apple M chip and Apple Intelligence built in."}}]},
 19:{gallery:[
   {img:"img/p19-1.webp",h:{ru:"Компактный корпус, который поместится где угодно.",tj:"Корпуси ҷайбӣ, дар ҳама ҷо ҷойгир мешавад.",en:"A compact design that fits anywhere."}},
   {img:"img/p19-2.webp",h:{ru:"Чип Apple M — большая мощность в малом корпусе.",tj:"Чипи Apple M — қуввати калон дар андозаи хурд.",en:"Apple M chip — big power in a small form."}},
   {img:"img/p19-3.webp",h:{ru:"Множество портов: Thunderbolt, HDMI, Ethernet.",tj:"Бисёр портҳо: Thunderbolt, HDMI, Ethernet.",en:"Plenty of ports: Thunderbolt, HDMI, Ethernet."}}]},
 4:{gallery:[
   {img:"img/p4-1.webp",h:{ru:"Прочный и стильный корпус iPhone 17e.",tj:"Корпуси мустаҳкам ва шевои iPhone 17e.",en:"A durable, stylish iPhone 17e design."}},
   {img:"img/p4-2.webp",h:{ru:"Камера 48 Мп Fusion для чётких фото и видео 4K.",tj:"Камераи 48 Мп Fusion барои аксу видеои 4K.",en:"48 MP Fusion camera for sharp photos and 4K video."}},
   {img:"img/p4-3.webp",h:{ru:"Чип A19 — быстрая и плавная работа.",tj:"Чипи A19 — кори зуд ва ҳамвор.",en:"A19 chip — fast and smooth performance."}}]},
 16:{gallery:[
   {img:"img/p16-1.webp",h:{ru:"Тонкий и лёгкий MacBook Neo — стиль и портативность.",tj:"MacBook Neo-и тунук ва сабук — услуб ва сабукӣ.",en:"Thin and light MacBook Neo — style and portability."}},
   {img:"img/p16-2.webp",h:{ru:"Яркий и чёткий дисплей Liquid Retina.",tj:"Дисплейи равшан ва возеҳи Liquid Retina.",en:"A bright, sharp Liquid Retina display."}},
   {img:"img/p16-3.webp",h:{ru:"Целый день работы от одной зарядки.",tj:"Тамоми рӯз кор аз як заряд.",en:"All-day battery life on a single charge."}}]}
};
function curLine(){const ph=document.getElementById("phero");return ph?ph.dataset.line:null;}
function renderSubnav(){
  const el=document.getElementById("subnav");if(!el)return;const li=LI(curLine());if(!li)return;
  const firstId=(PRODUCTS.find(p=>p.cat===li.cat)||{}).id||1;
  el.className="psubnav";
  el.innerHTML=`<div class="psubnav-in"><span class="pn-name">${li.name}</span>
    <a href="#lineup">${t("pp_overview")}</a><a href="#whyprod">${t("pp_why")}</a><a href="#highlights">${t("pp_specs")}</a>
    <a class="pn-buy" href="${li.buyPage||('buy.html?id='+firstId)}">${t("pp_buy")}</a></div>`;
}
/* ===== Apple-style chapternav: иконочная лента моделей категории + разделы ===== */
function renderChapnav(){
  const el=document.getElementById("chapnav");if(!el)return;
  const cat=el.dataset.cat||"watch";
  const models=PRODUCTS.filter(p=>p.cat===cat);
  const cmpIc='<svg viewBox="0 0 24 24"><rect x="3" y="5" width="7" height="14" rx="1.5"/><rect x="14" y="5" width="7" height="14" rx="1.5"/></svg>';
  const accIc='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 3v3M12 18v3"/></svg>';
  el.innerHTML=`<div class="chapnav-in">
    ${models.map(p=>`<a class="chap-item" href="${productUrl(p)}" title="${p.name}"><span class="chap-ic"><img src="${shrinkCDN(mainImg(p),150)}" alt="${p.name}" loading="lazy" decoding="async" onerror="imgFallback(this)"></span><span class="chap-l">${p.name}</span></a>`).join("")}
    <span class="chap-sep" aria-hidden="true"></span>
    <a class="chap-item chap-link" href="compare.html"><span class="chap-ic">${cmpIc}</span><span class="chap-l">${tr({ru:"Сравнить",tj:"Муқоиса",en:"Compare"})}</span></a>
    <a class="chap-item chap-link" href="accessories.html?for=${cat}"><span class="chap-ic">${accIc}</span><span class="chap-l">${tr({ru:"Аксессуары",tj:"Лавозимот",en:"Accessories"})}</span></a>
  </div>`;
}
function renderHighlights(){
  const el=document.getElementById("highlights");if(!el)return;const pd=PAGEDATA[curLine()];if(!pd)return;
  el.innerHTML=`<div class="wrap"><div class="sec-head reveal"><h2>${t("pp_highlights")}</h2></div>
    <div class="carousel" id="hlCar" data-dots="hlDots">
      <button class="car-arrow prev" aria-label="prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
      <div class="car-viewport"><div class="car-track">${pd.highlights.map(h=>`<div class="hl-card ${h.dark?"dark":""}"><div class="hl-h">${tr(h.h)}</div>${h.video?`<video class="hl-img" autoplay muted loop playsinline preload="none"${h.img?` poster="${h.img}"`:""}><source src="${h.video}" type="video/mp4"></video>`:`<img class="hl-img" src="${h.img}" alt="" loading="lazy" onerror="this.style.display='none'">`}</div>`).join("")}</div></div>
      <button class="car-arrow next" aria-label="next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
    </div><div class="car-dots" id="hlDots"></div></div>`;
  initCarousel(el.querySelector("#hlCar"),document.getElementById("hlDots"));observeReveal();
}
function renderWhyProd(){
  const el=document.getElementById("whyprod");if(!el)return;const pd=PAGEDATA[curLine()];if(!pd)return;
  el.innerHTML=`<div class="wrap"><div class="sec-head reveal"><h2>${tr(pd.why)}</h2></div>
    <div class="why-adv">${pd.adv.map(w=>`<div class="wa reveal"><div class="wa-ic">${w.ic}</div><h4>${tr(w.h)}</h4><p>${tr(w.p)}</p></div>`).join("")}</div></div>`;
  observeReveal();
}
/* ===== FEATURES: alternating photo+text blocks (per category) ===== */
const FEATURES={
 iphone:[
  {img:IM+"iphone-17-pro/g/images/overview/cameras/intro/hero_camera__f42igewygpqy_large_2x.jpg",dark:1,e:"📷",h:{ru:"Камеры Pro, снимающие как профи",tj:"Камераҳои Pro, ки касбӣ акс мегиранд",en:"Pro cameras that shoot like a pro"},p:{ru:"Три камеры по 48 Мп, оптический зум 4× и видео 4K Dolby Vision до 120 кадров в секунду.",tj:"Се камераи 48 Мп, зуми оптикии 4× ва видеои 4K Dolby Vision то 120 кадр/сония.",en:"Three 48 MP cameras, 4× optical zoom and 4K Dolby Vision video up to 120 fps."}},
  {img:IM+"iphone-17-pro/g/images/overview/design/design_endframe__7k7qs1qlnpu6_large_2x.jpg",dark:1,e:"🛡️",h:{ru:"Титан. Прочный и лёгкий",tj:"Титан. Мустаҳкам ва сабук",en:"Titanium. Strong and light"},p:{ru:"Корпус из титана авиационного класса и Ceramic Shield 2 — невероятная защита каждый день.",tj:"Корпуси титани синфи ҳавопаймоӣ ва Ceramic Shield 2 — ҳифзи аҷиб ҳар рӯз.",en:"An aerospace-grade titanium frame and Ceramic Shield 2 — incredible everyday protection."}},
  {img:IM+"iphone-17-pro/g/images/overview/performance/chip/performance-hero_endframe__fazyny3rhsuy_large_2x.jpg",dark:1,e:"⚡",h:{ru:"Чип A19 Pro — мощь уровня консоли",tj:"Чипи A19 Pro — қуввати сатҳи консол",en:"A19 Pro — console-class power"},p:{ru:"Молниеносная производительность для игр, монтажа и Apple Intelligence прямо на устройстве.",tj:"Маҳсулнокии барқосо барои бозӣ, монтаж ва Apple Intelligence дар дастгоҳ.",en:"Blazing performance for gaming, editing and on-device Apple Intelligence."}}],
 mac:[
  {img:IM+"macbook-pro/ax/images/overview/highlights/highlights_chip_endframe__dp975gwqppw2_large.jpg",dark:1,e:"⚡",h:{ru:"Чипы M5 меняют правила",tj:"Чипҳои M5 қоидаҳоро тағйир медиҳанд",en:"M5 chips change the game"},p:{ru:"M5, M5 Pro и M5 Max дают невероятную скорость при полной тишине и прохладе.",tj:"M5, M5 Pro ва M5 Max суръати аҷиб дар оромӣ ва хунукӣ медиҳанд.",en:"M5, M5 Pro and M5 Max deliver incredible speed — silent and cool."}},
  {img:IM+"macbook-air/z/images/overview/display/display_hero__fiig28r0yq2q_large_2x.jpg",dark:0,e:"🖥️",h:{ru:"Дисплей Liquid Retina",tj:"Дисплейи Liquid Retina",en:"Liquid Retina display"},p:{ru:"Миллиард цветов, высокая яркость и невероятная чёткость — для работы и творчества.",tj:"Миллиард ранг, равшании баланд ва возеҳии аҷиб — барои кор ва эҷод.",en:"A billion colors, high brightness and stunning clarity — for work and creativity."}},
  {img:IM+"macbook-pro/ax/images/overview/highlights/highlights_battery__d7riytopt742_large.jpg",dark:1,e:"🔋",h:{ru:"До 24 часов автономной работы",tj:"То 24 соат кори мустақил",en:"Up to 24 hours of battery"},p:{ru:"Работайте весь день и ещё дольше — Mac не привязан к розетке.",tj:"Тамоми рӯз ва бештар кор кунед — Mac ба розетка вобаста нест.",en:"Work all day and then some — Mac isn't tied to an outlet."}}],
 ipad:[
  {img:IM+"ipad-pro/aw/images/overview/highlights/chip__fxe2fg13jsy2_large.jpg",dark:1,e:"⚡",h:{ru:"Чип M5 — мощь компьютера",tj:"Чипи M5 — қуввати компютер",en:"M5 — computer-class power"},p:{ru:"Справляется с 4K-монтажом, 3D и тяжёлыми играми так же легко, как Mac.",tj:"Бо монтажи 4K, 3D ва бозиҳои вазнин мисли Mac мерасад.",en:"Handles 4K editing, 3D and demanding games as easily as a Mac."}},
  {img:IM+"ipad-pro/aw/images/overview/highlights/display__cssypjgif58i_large.jpg",dark:0,e:"🖥️",h:{ru:"Дисплей Ultra Retina XDR",tj:"Дисплейи Ultra Retina XDR",en:"Ultra Retina XDR display"},p:{ru:"Технология Tandem OLED даёт глубокий чёрный и яркие цвета в тончайшем корпусе.",tj:"Технологияи Tandem OLED сиёҳи амиқ ва рангҳои равшан дар корпуси тунук медиҳад.",en:"Tandem OLED brings deep blacks and bright color in an impossibly thin design."}},
  {img:IM+"ipad-pro/aw/images/overview/highlights/pencil__ef30gehj01yu_large.jpg",dark:0,e:"✏️",h:{ru:"Apple Pencil Pro",tj:"Apple Pencil Pro",en:"Apple Pencil Pro"},p:{ru:"Новые жесты, тактильный отклик и поиск — для письма и рисования с точностью до пикселя.",tj:"Имову ишораҳои нав, бозхӯрди ламсӣ ва ҷустуҷӯ — бо дақиқии пиксел.",en:"New gestures, haptics and Find My — write and draw with pixel precision."}}],
 watch:[
  {img:IM+"apple-watch-series-11/c/images/overview/health/health_hero__bs99gittogoi_large_2x.jpg",dark:0,e:"❤️",h:{ru:"Здоровье на запястье",tj:"Саломатӣ дар дастатон",en:"Health on your wrist"},p:{ru:"Пульс, ЭКГ, кислород в крови, температура и оценка сна — каждый день под контролем.",tj:"Набз, ЭКГ, оксиген, ҳарорат ва баҳои хоб — ҳар рӯз таҳти назорат.",en:"Heart rate, ECG, blood oxygen, temperature and sleep score — every day."}},
  {img:IM+"apple-watch-series-11/c/images/overview/fitness/fitness_hero__f9uqyx14gmmq_large_2x.jpg",dark:0,e:"🏃",h:{ru:"Фитнес и тренировки",tj:"Фитнес ва машқҳо",en:"Fitness and workouts"},p:{ru:"Кольца активности, десятки видов тренировок и точный GPS для любых результатов.",tj:"Ҳалқаҳои фаъолият, даҳҳо намуди машқ ва GPS-и дақиқ.",en:"Activity rings, dozens of workout types and precise GPS for any goal."}},
  {img:IM+"apple-watch-series-11/c/images/overview/on-the-go/go_hero__ghlevcvsmr6u_large_2x.jpg",dark:0,e:"📡",h:{ru:"Всегда на связи",tj:"Ҳамеша дар тамос",en:"Always connected"},p:{ru:"Звонки, сообщения, Apple Pay и сотовая связь прямо с запястья — без телефона.",tj:"Занг, паём, Apple Pay ва алоқаи мобилӣ аз дастатон — бе телефон.",en:"Calls, messages, Apple Pay and cellular right from your wrist — phone-free."}}],
 airpods:[
  {img:IM+"airpods/ae/images/overview/consider/card_noise_cancellation__bcl69t06noci_large.jpg",dark:0,e:"🔇",h:{ru:"Шумоподавление мирового класса",tj:"Бартарафсозии садои дараҷаи ҷаҳонӣ",en:"World-class noise cancellation"},p:{ru:"Вдвое мощнее прежнего — полное погружение в музыку где угодно.",tj:"Ду баробар пурқувваттар — ғарқшавии пурра дар мусиқӣ.",en:"Twice as powerful as before — total immersion in your music anywhere."}},
  {img:IM+"airpods/ae/images/overview/consider/card_personalized_spatial_audio__d9ghs2utja82_large.jpg",dark:0,e:"🎧",h:{ru:"Персональный пространственный звук",tj:"Садои фазоии шахсӣ",en:"Personalized Spatial Audio"},p:{ru:"Объёмное звучание, которое подстраивается под форму ваших ушей.",tj:"Садои ҳаҷмӣ, ки ба шакли гӯшҳои шумо мутобиқ мешавад.",en:"Immersive sound that adapts to the shape of your ears."}},
  {img:IM+"airpods/ae/images/overview/consider/card_hearing_health__ss2uxyv3j5m6_large.jpg",dark:0,e:"❤️",h:{ru:"Забота о здоровье слуха",tj:"Ғамхории саломатии шунавоӣ",en:"Hearing health, built in"},p:{ru:"Проверка слуха, защита от шума и режим слухового аппарата прямо в наушниках.",tj:"Санҷиши шунавоӣ, ҳифз аз садо ва реҷаи гӯшмонак.",en:"Hearing test, protection and a hearing aid feature right in your AirPods."}}]
};
function renderFeatures(){
  const el=document.getElementById("features");if(!el)return;const key=curLine();const fs=FEATURES[key];if(!fs){el.innerHTML="";return;}
  const li=LI(key)||{};const firstId=(PRODUCTS.find(p=>p.cat===li.cat)||{}).id||1;const buy=li.buyPage||("buy.html?id="+firstId);
  el.innerHTML=`<div class="wrap"><div class="fstrip">${fs.map(f=>`<div class="fblock reveal">
    <div class="fb-text"><div class="fb-e">${f.e}</div><h3>${tr(f.h)}</h3><p>${tr(f.p)}</p><a class="fb-link" href="${buy}">${t("pp_buy")} <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m9 18 6-6-6-6"/></svg></a></div>
    <div class="fb-media ${f.dark?"dark":""}"><img src="${f.img}" alt="${tr(f.h)}" loading="lazy" onerror="this.style.display='none'"></div></div>`).join("")}</div></div>`;
  observeReveal();
}

/* ===== COMPARE table (per category) ===== */
const SPECS={
 1:{chip:"A19 Pro",display:"6,3″ Super Retina XDR OLED · 120 Гц",camera:"48 Мп + 48 Мп + 48 Мп · видео 4K",battery:"до 33 ч видео",build:"Титан · Ceramic Shield · IP68",conn:"5G · USB-C · Wi-Fi 7"},
 2:{chip:"A19 Pro",display:"6,5″ Super Retina XDR OLED · 120 Гц",camera:"48 Мп Fusion · видео 4K",battery:"до 27 ч видео",build:"Титан · Ceramic Shield · IP68",conn:"5G · USB-C · Wi-Fi 7"},
 3:{chip:"A19",display:"6,3″ Super Retina XDR OLED · 120 Гц",camera:"48 Мп + 12 Мп · видео 4K",battery:"до 30 ч видео",build:"Алюминий · Ceramic Shield · IP68",conn:"5G · USB-C · Wi-Fi 7"},
 4:{chip:"A19",display:"6,1″ Super Retina XDR OLED",camera:"48 Мп Fusion · видео 4K",battery:"до 26 ч видео",build:"Алюминий · Ceramic Shield · IP68",conn:"5G · USB-C"},
 5:{chip:"A18",display:"6,1″ Super Retina XDR OLED",camera:"48 Мп Fusion + 12 Мп сверхширокая · видео 4K",battery:"до 22 ч видео",build:"Алюминий · Ceramic Shield · IP68",conn:"5G · USB-C · Wi-Fi 7"},
 6:{chip:"M5 Pro / M5 Max",display:"14″ или 16″ XDR",battery:"до 24 ч"},7:{chip:"M4",display:"15″ Retina",battery:"до 18 ч"},16:{chip:"M5",display:"13″ Retina",battery:"до 18 ч"},18:{chip:"M4",display:"24″ 4,5K Retina",conn:"Thunderbolt · USB-C · Ethernet"},19:{chip:"M4",conn:"HDMI · 2×Thunderbolt 4 · Ethernet · USB-C"},
 8:{chip:"M5",display:"11″/13″ Ultra Retina XDR · Tandem OLED · 120 Гц",camera:"12 Мп + LiDAR · фронт 12 Мп",battery:"до 10 ч",build:"Алюминий · 5,1 мм",conn:"USB-C (TB) · Wi-Fi 7 · 5G"},9:{chip:"M3",display:"11″/13″ Liquid Retina · 500 нит",camera:"12 Мп · фронт 12 Мп Center Stage",battery:"до 10 ч",build:"Алюминий",conn:"USB-C · Wi-Fi 6E · 5G"},
 20:{chip:"A16",display:"11″ Liquid Retina · 500 нит",camera:"12 Мп · фронт 12 Мп Center Stage",battery:"до 10 ч",build:"Алюминий",conn:"USB-C · Wi-Fi 6"},21:{chip:"A17 Pro",display:"8,3″ Liquid Retina · 500 нит",camera:"12 Мп · фронт 12 Мп Center Stage",battery:"до 10 ч",build:"Алюминий",conn:"USB-C · Wi-Fi 6E · 5G"},
 10:{chip:"S11",display:"49 мм Ti",battery:"до 42 ч"},11:{chip:"S11",display:"46 мм",battery:"до 24 ч"},15:{chip:"S10",display:"44 мм OLED",battery:"до 18 ч"},
 12:{chip:"H3 · ANC",display:"USB-C",battery:"до 8 ч"},13:{chip:"H2",display:"USB-C",battery:"до 5 ч"},14:{chip:"H1 · ANC",display:"Over-ear",battery:"до 20 ч"}
};
function renderCompare(){
  const box=document.getElementById("compare-models");if(!box)return;
  const items=PRODUCTS.filter(p=>p.cat===box.dataset.cat);if(!items.length)return;
  const rows=[["spec_price",p=>fmtPrice(p.price)],["spec_chip",p=>(SPECS[p.id]||{}).chip||"—"],["spec_display",p=>(SPECS[p.id]||{}).display||"—"],["spec_battery",p=>(SPECS[p.id]||{}).battery||"—"]];
  box.innerHTML=`<div class="wrap"><div class="sec-head reveal"><h2>${t("cmp_h")}</h2></div>
    <div class="cmp-scroll"><table class="cmp-table"><thead><tr><th></th>${items.map(p=>`<th><div class="cmp-prod"><img src="${mainImg(p)}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"><span>${p.name}</span><button class="add" data-buy="${p.id}">${t("pp_buy")}</button></div></th>`).join("")}</tr></thead>
    <tbody>${rows.map(([lbl,fn])=>`<tr><td class="cmp-lbl">${t(lbl)}</td>${items.map(p=>`<td>${fn(p)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
  observeReveal();
}

/* ===== MODEL PAGE (Apple Watch Ultra 3 — 1:1) ===== */
const WU=A+"/v/apple-watch-ultra-3/b/images/overview/";
const WS=A+"/v/apple-watch-series-11/c/images/overview/";
const WSE=A+"/v/apple-watch-se-3/b/images/overview/";
/* hero-видео каждой модели часов (свои, проверены 200 video/mp4) */
const VMED=s=>A+"/105/media/us/"+s+"/anim/hero/medium.mp4";
const V_ULTRA3=VMED("apple-watch-ultra-3/2025/7235c96b-e65b-4ba2-a99e-6cb15fa22668");
const V_S11=VMED("apple-watch-series-11/2025/ff7157de-c561-48f6-8427-90c1ce5498d1");
const V_SE3=VMED("apple-watch-se-3/2025/499c4097-d6f9-4dbe-b2c3-7cdf022ce822");
/* видео-повторы фич (для highlights страниц моделей) */
const AVID=(slug,uuid,seg)=>A+"/105/media/us/"+slug+"/2025/"+uuid+"/anim/"+seg+"/medium.mp4";
const MODELS={
 ultra3:{name:"Apple Watch Ultra 3",productId:10,price:9990,eyebrow:"⌚ Watch Ultra 3",
  heroVideo:V_ULTRA3,
  heroImg:WU+"welcome/hero_endframe__e4ls9pihykya_large.jpg",
  title:{ru:"Личный зверь.",tj:"Ҳайвони шахсӣ.",en:"Personal beast."},
  highlights:[
   {img:WU+"highlights/highlights_display__bnt03ajxbbw2_large.jpg",h:{ru:"Самый большой и продвинутый дисплей Apple Watch.",tj:"Калонтарин ва пешрафтатарин дисплейи Apple Watch.",en:"Our largest, most advanced Apple Watch display."}},
   {img:WU+"highlights/highlights_battery_endframe__d8dlmkib4qky_large.jpg",h:{ru:"Батарея для выносливости. До <b>42 часов</b> работы.",tj:"Батарея барои тобоварӣ. То <b>42 соат</b> кор.",en:"A battery built for stamina. Up to <b>42 hours</b>."}},
   {img:WU+"highlights/highlights_running_endframe__2zvbvddxn0ie_large.jpg",h:{ru:"Продвинутые метрики для бега и тренировок.",tj:"Метрикаи пешрафта барои давидан ва машқ.",en:"Advanced metrics for running and training."}},
   {img:WU+"highlights/highlights_satellite__ftgl6qyfpkia_large.jpg",h:{ru:"Спутниковая связь там, где нет сети.",tj:"Алоқаи моҳворагӣ дар ҷое, ки шабака нест.",en:"Stay connected via satellite, off the grid."}},
   {img:WU+"highlights/highlights_health__e7pfz5oyade2_large.jpg",h:{ru:"Мощные функции здоровья прямо на запястье.",tj:"Функсияҳои пурқуввати саломатӣ дар дастатон.",en:"Powerful health features right on your wrist."}},
   {img:WU+"highlights/highlights_sleep_score__dl1y2j6kkouq_large.jpg",h:{ru:"Оценка сна и глубокая аналитика здоровья.",tj:"Баҳои хоб ва таҳлили амиқи саломатӣ.",en:"Sleep score and deeper health insights."}}],
  explorer:[
   {label:{ru:"Корпус",tj:"Маводи корпус",en:"Finishes"},img:WU+"product-viewer/product_finishes_titanium_natural__dv2dd6sekxaq_large.jpg",
    desc:{ru:"Титан авиационного класса — натуральный и чёрный.",tj:"Титани синфи ҳавопаймоӣ — табиӣ ва сиёҳ.",en:"Aerospace-grade titanium in Natural and Black."},
    sw:[{hex:"#b9b2a8",img:WU+"product-viewer/product_finishes_titanium_natural__dv2dd6sekxaq_large.jpg"},{hex:"#2b2b2e",img:WU+"product-viewer/product_finishes_titanium_black__eli4j24zkyi6_large.jpg"}]},
   {label:{ru:"Дисплей",tj:"Дисплей",en:"Display"},img:WU+"product-viewer/product_display__ei3ka2jtf5oy_large.jpg",
    desc:{ru:"Самый большой и яркий дисплей Apple Watch — читается под любым углом.",tj:"Калонтарин ва равшантарин дисплей — дар ҳар кунҷ хонда мешавад.",en:"Our largest, brightest display — easy to read at wider angles."}},
   {label:{ru:"Батарея",tj:"Батарея",en:"Battery"},img:WU+"product-viewer/product_battery__fhmgm5ba3omm_large.jpg",
    desc:{ru:"До 42 часов обычной работы и до 72 часов в режиме энергосбережения.",tj:"То 42 соат кори оддӣ ва то 72 соат дар реҷаи сарфакорӣ.",en:"Up to 42 hours of normal use and up to 72 hours in Low Power Mode."}},
   {label:{ru:"Прочность",tj:"Мустаҳкамӣ",en:"Durability"},img:WU+"product-viewer/product_durability__fjxsjypa2e6i_large.jpg",
    desc:{ru:"Прочный титановый корпус и защитное сапфировое стекло.",tj:"Корпуси титании мустаҳкам ва шишаи сапфир.",en:"Rugged titanium case and sapphire crystal front."}},
   {label:{ru:"Защита от воды и пыли",tj:"Муҳофизат аз об ва чанг",en:"Water and dust resistance"},img:WU+"product-viewer/product_resistance__ei2kafgdf2ie_large.jpg",
    desc:{ru:"Водозащита до 100 м, для дайвинга до 40 м, пылезащита IP6X.",tj:"Муҳофизат аз об то 100 м, ғаввосӣ то 40 м, IP6X.",en:"Water resistant to 100 m, dive to 40 m, IP6X dust resistant."}},
   {label:{ru:"Кнопка действия",tj:"Тугмаи амал",en:"Action button"},img:WU+"product-viewer/product_action_button__e5d567476zsm_large.jpg",
    desc:{ru:"Настраиваемая кнопка для быстрого доступа к нужным функциям.",tj:"Тугмаи танзимшаванда барои дастрасии тез ба функсияҳо.",en:"A customizable button for fast access to key features."}},
   {label:{ru:"Ремешки",tj:"Тасмаҳо",en:"Bands"},img:WU+"product-viewer/product_bands__gg14jjttqaum_large.jpg",
    desc:{ru:"Три прочных стиля: Trail Loop, Alpine Loop и Ocean Band.",tj:"Се услуби мустаҳкам: Trail Loop, Alpine Loop ва Ocean Band.",en:"Three rugged styles: Trail Loop, Alpine Loop and Ocean Band."}}]
 },
 iphone17pro:{name:"iPhone 17 Pro",productId:1,price:15990,eyebrow:"iPhone 17 Pro",
  heroVideo:LI("iphone").heroVideo,
  heroImg:A+"/v/iphone-17-pro/g/images/overview/product-viewer/colors_orange__cr2oq3n1dwk2_large.jpg",
  title:{ru:"Максимум Pro.",tj:"Ҳадди аксар Pro.",en:"All out Pro."},
  highlights:[
   {img:A+"/v/iphone-17-pro/g/images/overview/highlights/highlights_camera_endframe__e72sxwhaxhyu_large.jpg",h:{ru:"Система камер Pro — три по <b>48 Мп</b>.",tj:"Системаи камераи Pro — се то <b>48 Мп</b>.",en:"Pro camera system — three <b>48 MP</b> cameras."}},
   {img:A+"/v/iphone-17-pro/g/images/overview/highlights/highlights_zoom_endframe__dyqkn2swjbsm_large.jpg",h:{ru:"Зум нового уровня для дальних кадров.",tj:"Зуми сатҳи нав барои аксҳои дур.",en:"Next-level zoom for distant shots."}},
   {img:A+"/v/iphone-17-pro/g/images/overview/highlights/highlights_chip_endframe__d06u2zxywxme_large.jpg",h:{ru:"Чип <b>A19 Pro</b> — самый мощный в iPhone.",tj:"Чипи <b>A19 Pro</b> — пурқувваттарин дар iPhone.",en:"The <b>A19 Pro</b> chip — the most powerful in iPhone."}},
   {img:A+"/v/iphone-17-pro/g/images/overview/highlights/highlights_design_endframe__eu8gj0kqlmoi_large.jpg",h:{ru:"Прочный лёгкий корпус. Три цвета.",tj:"Корпуси мустаҳками сабук. Се ранг.",en:"A strong, light design. Three colors."}},
   {img:A+"/v/iphone-17-pro/g/images/overview/highlights/highlights_apple_intelligence__c9a098yssb8m_large.jpg",h:{ru:"Apple Intelligence — умные функции прямо на устройстве.",tj:"Apple Intelligence — функсияҳои ақлӣ дар дастгоҳ.",en:"Apple Intelligence — smart features right on device."}}],
  explorer:[
   {label:{ru:"Корпус",tj:"Маводи корпус",en:"Finishes"},img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/colors_orange__cr2oq3n1dwk2_large.jpg",
    desc:{ru:"Цельный алюминиевый корпус: космический оранжевый, тёмно-синий и серебристый.",tj:"Корпуси яклухти алюминӣ: норанҷӣ, кабуд ва нуқрагӣ.",en:"Unibody aluminum design: Cosmic Orange, Deep Blue and Silver."},
    sw:[{hex:"#c8502d",img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/colors_orange__cr2oq3n1dwk2_large.jpg"},{hex:"#4a5a78",img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/colors_blue__li170wg4gkae_large.jpg"},{hex:"#dcdee0",img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/colors_silver__eb8fu7zfvwmu_large.jpg"}]},
   {label:{ru:"Дизайн",tj:"Дизайн",en:"Design"},img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/unibody__beiiszaqty3m_large.jpg",
    desc:{ru:"Цельнометаллический алюминиевый корпус — прочный и лёгкий.",tj:"Корпуси яклухти алюминӣ — мустаҳкам ва сабук.",en:"Heat-forged aluminum unibody — strong and light."}},
   {label:{ru:"Камеры",tj:"Камераҳо",en:"Cameras"},img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/camera_control__gl7rgu1l9066_large.jpg",
    desc:{ru:"Три камеры по 48 Мп и кнопка Camera Control.",tj:"Се камераи 48 Мп ва тугмаи Camera Control.",en:"Three 48 MP cameras and Camera Control."}},
   {label:{ru:"Дисплей",tj:"Дисплей",en:"Display"},img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/pro_display__bvu4xbhsdpf6_large.jpg",
    desc:{ru:"Super Retina XDR с ProMotion 120 Гц и Always-On.",tj:"Super Retina XDR бо ProMotion 120 Гс.",en:"Super Retina XDR with 120Hz ProMotion and Always-On."}},
   {label:{ru:"Чип и охлаждение",tj:"Чип ва хунуккунӣ",en:"Chip"},img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/vapor_chamber__ghepoq1a90a6_large.jpg",
    desc:{ru:"Чип A19 Pro с системой охлаждения vapor chamber.",tj:"Чипи A19 Pro бо системаи хунуккунии vapor chamber.",en:"A19 Pro chip with a vapor chamber cooling system."}},
   {label:{ru:"Прочность",tj:"Мустаҳкамӣ",en:"Durability"},img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/ceramic_shield__cv0z40rccqy6_large.jpg",
    desc:{ru:"Ceramic Shield 2 спереди и сзади — невероятная защита.",tj:"Ceramic Shield 2 дар пеш ва қафо.",en:"Ceramic Shield 2 front and back — incredible protection."}},
   {label:{ru:"Кнопка действия",tj:"Тугмаи амал",en:"Action button"},img:A+"/v/iphone-17-pro/g/images/overview/product-viewer/action_button__efiof6bf182u_large.jpg",
    desc:{ru:"Настраиваемая кнопка действия для быстрого доступа.",tj:"Тугмаи танзимшавандаи амал барои дастрасии тез.",en:"A customizable Action button for fast access."}}]
 },
 macbookpro:{name:"MacBook Pro",productId:6,price:27990,eyebrow:"MacBook Pro",
  heroVideo:LI("mac").heroVideo,
  heroImg:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_hero_endframe__gc89p7dw1syi_large.jpg",
  title:{ru:"Мощь, которая поражает.",tj:"Қувва, ки ба ҳайрат меорад.",en:"Mind-blowing. Head-turning."},
  highlights:[
   {img:A+"/v/macbook-pro/ax/images/overview/highlights/highlights_chip_endframe__dp975gwqppw2_large.jpg",h:{ru:"Чипы <b>M5, M5 Pro и M5 Max</b> — невероятная скорость.",tj:"Чипҳои <b>M5, M5 Pro ва M5 Max</b> — суръати аҷиб.",en:"<b>M5, M5 Pro and M5 Max</b> chips — incredible speed."}},
   {img:A+"/v/macbook-pro/ax/images/overview/highlights/highlights_battery__d7riytopt742_large.jpg",h:{ru:"До <b>24 часов</b> работы от батареи.",tj:"То <b>24 соат</b> кор аз батарея.",en:"Up to <b>24 hours</b> of battery life."}},
   {img:A+"/v/macbook-pro/ax/images/overview/highlights/highlights_liquid_glass__fup1pqvqx866_large.jpg",h:{ru:"macOS Tahoe с новым дизайном Liquid Glass.",tj:"macOS Tahoe бо дизайни нави Liquid Glass.",en:"macOS Tahoe with the new Liquid Glass design."}},
   {img:A+"/v/macbook-pro/ax/images/overview/highlights/highlights_mac_iphone__cxajkjnjbx26_large.jpg",h:{ru:"Mac и iPhone работают как единое целое.",tj:"Mac ва iPhone ҳамчун як кул кор мекунанд.",en:"Mac and iPhone work better together."}}],
  explorer:[
   {label:{ru:"Корпус",tj:"Маводи корпус",en:"Finishes"},img:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_colors_spaceblack__dwfpyrbaf4cy_large.jpg",
    desc:{ru:"Алюминий: космический чёрный и серебристый.",tj:"Алюминий: сиёҳи кайҳонӣ ва нуқрагӣ.",en:"Aluminum in Space Black and Silver."},
    sw:[{hex:"#2e2c2e",img:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_colors_spaceblack__dwfpyrbaf4cy_large.jpg"},{hex:"#dcdee0",img:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_colors_silver__doa20s4tupaq_large.jpg"}]},
   {label:{ru:"Дисплей",tj:"Дисплей",en:"Display"},img:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_display__fv0jzlzaak2u_large.jpg",
    desc:{ru:"Liquid Retina XDR — яркость, контраст и ProMotion.",tj:"Liquid Retina XDR — равшанӣ, контраст ва ProMotion.",en:"Liquid Retina XDR — brightness, contrast and ProMotion."}},
   {label:{ru:"Звук",tj:"Садо",en:"Audio"},img:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_audio_endframe__ee95uehal7sm_large.jpg",
    desc:{ru:"Система из шести динамиков с пространственным звуком.",tj:"Системаи шаш динамик бо садои фазоӣ.",en:"Six-speaker sound system with Spatial Audio."}},
   {label:{ru:"Порты",tj:"Портҳо",en:"Connectivity"},img:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_connectivity__27f84rcgb42e_large.jpg",
    desc:{ru:"Thunderbolt, HDMI, SDXC и MagSafe 3.",tj:"Thunderbolt, HDMI, SDXC ва MagSafe 3.",en:"Thunderbolt, HDMI, SDXC and MagSafe 3."}},
   {label:{ru:"Прочность",tj:"Мустаҳкамӣ",en:"Durability"},img:A+"/v/macbook-pro/ax/images/overview/product-viewer/pv_durable__ee5bejbfpis2_large.jpg",
    desc:{ru:"Цельный алюминиевый корпус выдерживает годы работы.",tj:"Корпуси яклухти алюминӣ солҳо кор мекунад.",en:"Unibody aluminum built to last for years."}}]
 },
 ipadpro:{name:"iPad Pro",productId:8,price:13990,eyebrow:"iPad Pro",
  heroVideo:LI("ipad").heroVideo,
  heroImg:A+"/v/ipad-pro/aw/images/overview/design/design_hero_endframe__0uk1xnayimay_large.png",
  title:{ru:"Тонко. Невероятно мощно.",tj:"Тунук. Бениҳоят пурқувват.",en:"Unbelievably thin. Incredibly powerful."},
  highlights:[
   {img:A+"/v/ipad-pro/aw/images/overview/highlights/chip__fxe2fg13jsy2_large.jpg",h:{ru:"Чип <b>M5</b> — мощь настольного компьютера.",tj:"Чипи <b>M5</b> — қуввати компютери мизӣ.",en:"The <b>M5</b> chip — desktop-class power."}},
   {img:A+"/v/ipad-pro/aw/images/overview/highlights/display__cssypjgif58i_large.jpg",h:{ru:"Дисплей <b>Ultra Retina XDR</b>.",tj:"Дисплейи <b>Ultra Retina XDR</b>.",en:"<b>Ultra Retina XDR</b> display."}},
   {img:A+"/v/ipad-pro/aw/images/overview/highlights/design__fz9jny9rl722_large.jpg",h:{ru:"Невероятно тонкий и лёгкий дизайн.",tj:"Дизайни бениҳоят тунук ва сабук.",en:"An impossibly thin and light design."}},
   {img:A+"/v/ipad-pro/aw/images/overview/highlights/pencil__ef30gehj01yu_large.jpg",h:{ru:"Apple Pencil Pro — для безграничного творчества.",tj:"Apple Pencil Pro — барои эҷодиёти беканор.",en:"Apple Pencil Pro — for limitless creativity."}},
   {img:A+"/v/ipad-pro/aw/images/overview/highlights/apple_intelligence__f2wdpo1j5biq_large.jpg",h:{ru:"Apple Intelligence прямо на iPad.",tj:"Apple Intelligence дар iPad.",en:"Apple Intelligence right on iPad."}}],
  explorer:[
   {label:{ru:"Дизайн",tj:"Дизайн",en:"Design"},img:A+"/v/ipad-pro/aw/images/overview/highlights/design__fz9jny9rl722_large.jpg",
    desc:{ru:"Самый тонкий продукт Apple — алюминиевый корпус.",tj:"Тунуктарин маҳсулоти Apple — корпуси алюминӣ.",en:"Apple's thinnest product ever — aluminum design."}},
   {label:{ru:"Дисплей",tj:"Дисплей",en:"Display"},img:A+"/v/ipad-pro/aw/images/overview/display/display_hero_endframe__fr1073m9t56y_large.jpg",
    desc:{ru:"Ultra Retina XDR с технологией Tandem OLED.",tj:"Ultra Retina XDR бо технологияи Tandem OLED.",en:"Ultra Retina XDR with Tandem OLED technology."}},
   {label:{ru:"Чип M5",tj:"Чипи M5",en:"Chip"},img:A+"/v/ipad-pro/aw/images/overview/chip/chip_hero_endframe__becrgbad20j6_large.jpg",
    desc:{ru:"Чип M5 для самых требовательных задач.",tj:"Чипи M5 барои вазифаҳои вазнин.",en:"The M5 chip for the most demanding tasks."}},
   {label:{ru:"Apple Pencil Pro",tj:"Apple Pencil Pro",en:"Apple Pencil"},img:A+"/v/ipad-pro/aw/images/overview/highlights/pencil__ef30gehj01yu_large.jpg",
    desc:{ru:"Новые жесты, тактильный отклик и поиск.",tj:"Имову ишораҳои нав ва бозхӯрди ламсӣ.",en:"New gestures, haptic feedback and Find My."}}]
 },
 ipadair:{name:"iPad Air",productId:9,price:8490,eyebrow:"iPad Air",light:true,hlLight:true,
  heroVideo:A+"/105/media/us/ipad-air/2026/fe27e8b5-d1fd-4e76-82a5-4ee1120a4d97/anim/highlights-chip/medium.mp4",
  heroImg:A+"/v/ipad-air/ah/images/overview/hero/hero_endframe__6gl84bccyaqi_large.png",
  title:{ru:"Лёгкий. Яркий. Полон сил.",tj:"Сабук. Равшан. Пур аз қувва.",en:"Light. Bright. Full of might."},
  highlights:[
   {img:A+"/v/ipad-air/ah/images/overview/chip/chip_top_endframe__bac7em7optua_large.png",h:{ru:"Чип <b>M3</b> — до 2× быстрее прошлого iPad Air.",tj:"Чипи <b>M3</b> — то 2× тезтар аз iPad Air-и пешин.",en:"The <b>M3</b> chip — up to 2× faster than before."}},
   {img:A+"/v/ipad-air/ah/images/overview/cameras/cameras_endframe__cv0fbgxrv2uu_large.png",h:{ru:"Фронтальная камера по центру — идеально для видеозвонков.",tj:"Камераи пеши марказӣ — барои занги видеоӣ беҳтарин.",en:"Landscape front camera — perfect for video calls."}},
   {img:A+"/v/ipad-air/ah/images/overview/apple-pencil-pro/modal/barrel_roll_endframe__d6cy5ij3s0k2_large.jpg",h:{ru:"Работает с Apple Pencil Pro и Magic Keyboard.",tj:"Бо Apple Pencil Pro ва Magic Keyboard кор мекунад.",en:"Works with Apple Pencil Pro and Magic Keyboard."}},
   {img:A+"/v/ipad-air/ah/images/overview/apple-intelligence/privacy_endframe__cmahnib2pzxy_large.jpg",h:{ru:"Apple Intelligence — прямо на iPad Air.",tj:"Apple Intelligence — дар iPad Air.",en:"Apple Intelligence, built right in."}}],
  explorer:[
   {label:{ru:"Дизайн",tj:"Дизайн",en:"Design"},img:WG("ipad-air-select-11in-wifi-blue-202405"),
    desc:{ru:"Два размера — 11″ и 13″ — в четырёх цветах.",tj:"Ду андоза — 11″ ва 13″ — дар чор ранг.",en:"Two sizes — 11″ and 13″ — in four colors."},
    sw:[{hex:"#cdd8ea",img:WG("ipad-air-select-11in-wifi-blue-202405")},{hex:"#ded9e8",img:WG("ipad-air-select-11in-wifi-purple-202405")},{hex:"#7d7e80",img:WG("ipad-air-select-11in-wifi-spacegray-202405")},{hex:"#efe9dd",img:WG("ipad-air-select-11in-wifi-starlight-202405")}]},
   {label:{ru:"Чип M3",tj:"Чипи M3",en:"M3 chip"},img:A+"/v/ipad-air/ah/images/overview/chip/chip_middle_top_endframe__3zu8i1nab6ai_large.png",
    desc:{ru:"Быстрый для многозадачности, игр и Apple Intelligence.",tj:"Тез барои бисёрвазифагӣ, бозиҳо ва Apple Intelligence.",en:"Fast for multitasking, gaming and Apple Intelligence."}},
   {label:{ru:"Камеры",tj:"Камераҳо",en:"Cameras"},img:A+"/v/ipad-air/ah/images/overview/cameras/cameras_endframe__cv0fbgxrv2uu_large.png",
    desc:{ru:"Камера 12 Мп и фронтальная 12 Мп с Center Stage.",tj:"Камераи 12 Мп ва пеши 12 Мп бо Center Stage.",en:"12MP rear and 12MP landscape front camera with Center Stage."}},
   {label:{ru:"Apple Pencil",tj:"Apple Pencil",en:"Apple Pencil"},img:A+"/v/ipad-air/ah/images/overview/apple-pencil-pro/modal/hover_endframe__fkkda8kjyne6_large.jpg",
    desc:{ru:"Поддержка Apple Pencil Pro, USB-C и Magic Keyboard.",tj:"Дастгирии Apple Pencil Pro, USB-C ва Magic Keyboard.",en:"Supports Apple Pencil Pro, USB-C and Magic Keyboard."}}]
 },
 ipadbase:{name:"iPad",productId:20,price:4990,eyebrow:"iPad",light:true,hlLight:true,
  heroVideo:A+"/105/media/us/ipad-11/2025/21af9618-666d-4368-9fb9-38822c35dc35/anim/modular/medium.mp4",
  heroImg:A+"/v/ipad-11/d/images/overview/hero/hero__crzh9misvcuq_large.jpg",
  title:{ru:"iPad. Как скажешь.",tj:"iPad. Чӣ хоҳӣ.",en:"iPad. Lovable. Drawable. Do-it-all-able."},
  highlights:[
   {video:A+"/105/media/us/ipad-11/2025/21af9618-666d-4368-9fb9-38822c35dc35/anim/center-stage/medium.mp4",img:A+"/v/ipad-11/d/images/overview/connect/center_stage_endframe__eu4x3duk262q_large.jpg",h:{ru:"Center Stage держит вас в центре кадра на видеозвонках.",tj:"Center Stage шуморо дар маркази кадр нигоҳ медорад.",en:"Center Stage keeps you in frame on video calls."}},
   {img:A+"/v/ipad-11/d/images/overview/get-things-done/chip__buvu5472f81y_large.jpg",h:{ru:"Чип <b>A16</b> — шустрый для учёбы, работы и игр.",tj:"Чипи <b>A16</b> — тез барои таҳсил, кор ва бозӣ.",en:"The <b>A16</b> chip — fast for school, work and play."}},
   {img:A+"/v/ipad-11/d/images/overview/design/snap_endframe__ej9e60w545aq_large.jpg",h:{ru:"Прочный цельноалюминиевый корпус в четырёх цветах.",tj:"Корпуси якпораи алюминӣ дар чор ранг.",en:"A durable all-aluminum design in four colors."}},
   {img:A+"/v/ipad-11/d/images/overview/get-things-done/keyboard_endframe__f430b2lvfv2a_large.jpg",h:{ru:"Работает с Magic Keyboard Folio и Apple Pencil.",tj:"Бо Magic Keyboard Folio ва Apple Pencil кор мекунад.",en:"Works with Magic Keyboard Folio and Apple Pencil."}}],
  explorer:[
   {label:{ru:"Дизайн",tj:"Дизайн",en:"Design"},img:WG("ipad-2022-hero-blue-wifi-select"),
    desc:{ru:"Цельный алюминий, экран 11″, четыре ярких цвета.",tj:"Алюминийи якпора, экрани 11″, чор ранги равшан.",en:"All-aluminum, 11″ display, four vivid colors."},
    sw:[{hex:"#a6c0dd",img:WG("ipad-2022-hero-blue-wifi-select")},{hex:"#e6c7c2",img:WG("ipad-2022-hero-pink-wifi-select")},{hex:"#eed77e",img:WG("ipad-2022-hero-yellow-wifi-select")},{hex:"#e3e4e6",img:WG("ipad-2022-hero-silver-wifi-select")}]},
   {label:{ru:"Чип A16",tj:"Чипи A16",en:"A16 chip"},img:A+"/v/ipad-11/d/images/overview/get-things-done/chip__buvu5472f81y_large.jpg",
    desc:{ru:"Плавная работа приложений, задач и игр.",tj:"Кори ҳамвори барномаҳо, вазифаҳо ва бозиҳо.",en:"Smooth performance across apps, tasks and games."}},
   {label:{ru:"Камера",tj:"Камера",en:"Camera"},img:A+"/v/ipad-11/d/images/overview/connect/camera_endframe__qioefbh5aoyi_large.jpg",
    desc:{ru:"Камера 12 Мп и фронтальная 12 Мп с Center Stage.",tj:"Камераи 12 Мп ва пеши 12 Мп бо Center Stage.",en:"12MP rear and 12MP landscape front with Center Stage."}},
   {label:{ru:"Разъёмы",tj:"Пайвастҳо",en:"Connectivity"},img:A+"/v/ipad-11/d/images/overview/ipad-accessories/usb_c_endframe__bo810y4gzrua_large.jpg",
    desc:{ru:"Порт USB-C, Wi-Fi 6, аккумулятор на весь день.",tj:"Порти USB-C, Wi-Fi 6, батарея барои тамоми рӯз.",en:"USB-C port, Wi-Fi 6 and all-day battery."}}]
 },
 ipadmini:{name:"iPad mini",productId:21,price:6990,eyebrow:"iPad mini",light:true,hlLight:true,
  heroVideo:A+"/105/media/us/ipad-mini/2024/ab503ae9-d404-4d31-8983-47a8cb46614f/anim/hand-rotation/medium.mp4",
  heroImg:A+"/v/ipad-mini/v/images/overview/hero/hero_endframe__ck10nf4t7ely_large.png",
  title:{ru:"Мега-мощь. Мини-размер.",tj:"Қуввати мега. Андозаи мини.",en:"Mega power. Mini size."},
  highlights:[
   {video:A+"/105/media/us/ipad-mini/2024/ab503ae9-d404-4d31-8983-47a8cb46614f/anim/express/medium.mp4",img:A+"/v/ipad-mini/v/images/overview/intelligence/personal_headline__f80s63iho8ya_large.png",h:{ru:"Apple Intelligence прямо в кармане.",tj:"Apple Intelligence дар кисаи шумо.",en:"Apple Intelligence, right in your pocket."}},
   {img:A+"/v/ipad-mini/v/images/overview/chip/chip_headline__fwdrtscejfmi_large.png",h:{ru:"Чип <b>A17 Pro</b> — огромная мощь в компактном корпусе.",tj:"Чипи <b>A17 Pro</b> — қуввати бузург дар корпуси ҷайбӣ.",en:"The <b>A17 Pro</b> chip — huge power in a compact size."}},
   {img:A+"/v/ipad-mini/v/images/overview/design/design_headline__cvgh51rmzq2q_large.png",h:{ru:"Дисплей Liquid Retina 8,3″ — удобно в одной руке.",tj:"Дисплейи Liquid Retina 8,3″ — дар як даст бароҳат.",en:"An 8.3″ Liquid Retina display — perfect in one hand."}},
   {img:A+"/v/ipad-mini/v/images/overview/camera/camera_headline__e8328uhkokii_large.png",h:{ru:"Камера 12 Мп со сканированием документов.",tj:"Камераи 12 Мп бо сканкунии ҳуҷҷатҳо.",en:"A 12MP camera with document scanning."}}],
  explorer:[
   {label:{ru:"Дизайн",tj:"Дизайн",en:"Design"},img:WG("ipad-mini-select-wifi-blue-202410"),
    desc:{ru:"Компактный корпус 8,3″ в четырёх цветах.",tj:"Корпуси ҷайбии 8,3″ дар чор ранг.",en:"A compact 8.3″ design in four colors."},
    sw:[{hex:"#b8c4d4",img:WG("ipad-mini-select-wifi-blue-202410")},{hex:"#bcb6cc",img:WG("ipad-mini-select-wifi-purple-202410")},{hex:"#7d7e80",img:WG("ipad-mini-select-wifi-spacegray-202410")},{hex:"#efe9dd",img:WG("ipad-mini-select-wifi-starlight-202410")}]},
   {label:{ru:"Чип A17 Pro",tj:"Чипи A17 Pro",en:"A17 Pro chip"},img:A+"/v/ipad-mini/v/images/overview/chip/powerful__fs81y3s8dfee_large.jpg",
    desc:{ru:"Мощь для игр, творчества и Apple Intelligence.",tj:"Қувва барои бозӣ, эҷод ва Apple Intelligence.",en:"Power for gaming, creativity and Apple Intelligence."}},
   {label:{ru:"Дисплей",tj:"Дисплей",en:"Display"},img:A+"/v/ipad-mini/v/images/overview/design/liquid_retina_1__eh1ihtzkw8wi_large.jpg",
    desc:{ru:"Liquid Retina 8,3″ с True Tone и P3.",tj:"Liquid Retina 8,3″ бо True Tone ва P3.",en:"8.3″ Liquid Retina with True Tone and P3."}},
   {label:{ru:"Камера",tj:"Камера",en:"Camera"},img:A+"/v/ipad-mini/v/images/overview/camera/camera_headline__e8328uhkokii_large.png",
    desc:{ru:"Камера 12 Мп и фронтальная с Center Stage.",tj:"Камераи 12 Мп ва пеши бо Center Stage.",en:"12MP rear and Center Stage front camera."}}]
 },
 airpodspro3:{name:"AirPods Pro 3",productId:12,price:2490,eyebrow:"AirPods Pro 3",light:true,hlLight:true,
  heroVideo:LI("airpods").heroVideo,
  heroImg:A+"/v/airpods/ae/images/overview/hero_endframe__calpooy4ucr6_large.jpg",
  title:{ru:"Звук, который адаптируется.",tj:"Садое, ки мутобиқ мешавад.",en:"Adaptive Audio. Now playing."},
  highlights:[
   {img:A+"/v/airpods/ae/images/overview/consider/card_noise_cancellation__bcl69t06noci_large.jpg",h:{ru:"Активное шумоподавление мирового класса.",tj:"Бартарафсозии садои дараҷаи ҷаҳонӣ.",en:"World-class Active Noise Cancellation."}},
   {img:A+"/v/airpods/ae/images/overview/consider/card_personalized_spatial_audio__d9ghs2utja82_large.jpg",h:{ru:"Персональный пространственный звук.",tj:"Садои фазоии шахсӣ.",en:"Personalized Spatial Audio."}},
   {img:A+"/v/airpods/ae/images/overview/consider/card_hearing_health__ss2uxyv3j5m6_large.jpg",h:{ru:"Функции для здоровья слуха.",tj:"Функсияҳо барои саломатии шунавоӣ.",en:"Hearing health features."}},
   {video:A+"/105/media/us/airpods-pro/2025/7acffb13-4adb-40b1-9393-8f1c99bc6c90/anim/heart-rate/medium.mp4",img:A+"/v/airpods/ae/images/overview/consider/card_heart_rate_sensing__exas9s71qo4m_large.jpg",h:{ru:"Датчик пульса прямо в наушниках.",tj:"Сенсори набз дар гӯшмонак.",en:"Heart rate sensing, built in."}},
   {img:A+"/v/airpods/ae/images/overview/consider/card_live_translation__ep68h9wscbee_large.jpg",h:{ru:"Живой перевод в реальном времени.",tj:"Тарҷумаи зинда дар вақти воқеӣ.",en:"Live Translation on the go."}}]
 },
 s11:{name:"Apple Watch Series 11",productId:11,price:4990,eyebrow:"⌚ Watch Series 11",light:true,hlLight:true,
  heroVideo:V_S11,
  heroImg:WS+"product-viewer/product_landing_endframe__eaytrp6zz6c2_large.jpg",
  title:{ru:"Здоровье на новой высоте.",tj:"Саломатӣ дар баландии нав.",en:"A healthy leap ahead."},
  highlights:[
   {img:WS+"highlights/highlights_hypertension_endframe__bbpmzln3nniq_large.jpg",h:{ru:"Уведомления о гипертонии — новая забота о здоровье сердца.",tj:"Огоҳиҳо дар бораи гипертония — ғамхории нав барои дил.",en:"Hypertension notifications — a new layer of heart care."}},
   {img:WS+"highlights/highlights_sleep_score__dl1y2j6kkouq_large.jpg",h:{ru:"Оценка сна каждое утро — понимайте свой отдых.",tj:"Баҳои хоб ҳар саҳар — истироҳати худро фаҳмед.",en:"A Sleep Score every morning — understand your rest."}},
   {img:WS+"highlights/highlights_glass_endframe__f39nueq3bfiy_large.jpg",h:{ru:"Самое прочное переднее стекло Apple Watch.",tj:"Мустаҳкамтарин шишаи пеши Apple Watch.",en:"The most durable Apple Watch front glass ever."}},
   {img:WS+"highlights/highlights_5g__bvrxbjoke2c2_large.jpg",h:{ru:"Связь <b>5G</b> — оставайтесь на связи без iPhone.",tj:"Алоқаи <b>5G</b> — бе iPhone дар тамос бошед.",en:"<b>5G</b> connectivity — stay connected without iPhone."}},
   {img:WS+"highlights/highlights_workout_endframe__fozegosc7daq_large.jpg",h:{ru:"Умные тренировки и точные метрики фитнеса.",tj:"Машқҳои ақлӣ ва метрикаи дақиқи фитнес.",en:"Smarter workouts and precise fitness metrics."}},
   {img:WS+"highlights/highlights_battery_endframe__d8dlmkib4qky_large.jpg",h:{ru:"До <b>24 часов</b> работы — на весь день.",tj:"То <b>24 соат</b> кор — барои тамоми рӯз.",en:"Up to <b>24 hours</b> of battery — all-day power."}}],
  explorer:[
   {label:{ru:"Корпус",tj:"Маводи корпус",en:"Finishes"},img:WS+"product-viewer/product_finishes_jet_black__blfwjso629w2_large.jpg",
    desc:{ru:"Алюминий в 4 цветах и титан в 3 цветах.",tj:"Алюминий дар 4 ранг ва титан дар 3 ранг.",en:"Aluminum in 4 colors and titanium in 3 colors."},
    sw:[{hex:"#2b2b2e",img:WS+"product-viewer/product_finishes_jet_black__blfwjso629w2_large.jpg"},{hex:"#e7c8b8",img:WS+"product-viewer/product_finishes_rose_gold__bhstyih3ki6a_large.jpg"},{hex:"#dcdee0",img:WS+"product-viewer/product_finishes_silver__cyyyc94lds02_large.jpg"},{hex:"#6e6e73",img:WS+"product-viewer/product_finishes_space_gray__z8jlhu1vgbmm_large.jpg"},{hex:"#c9a96a",img:WS+"product-viewer/product_finishes_titanium_gold__czj188e02ygm_large.jpg"},{hex:"#4a4744",img:WS+"product-viewer/product_finishes_titanium_slate__fz9rx562j0qe_large.jpg"},{hex:"#b9b2a8",img:WS+"product-viewer/product_finishes_titanium_natural__dv2dd6sekxaq_large.jpg"}]},
   {label:{ru:"Дисплей",tj:"Дисплей",en:"Display"},img:WS+"product-viewer/product_display_endframe__baw4nxfmflbm_large.jpg",
    desc:{ru:"Always-On дисплей — ярче и читается под широким углом.",tj:"Дисплейи Always-On — равшантар ва дар кунҷи васеъ хонда мешавад.",en:"Always-On display — brighter and readable at wide angles."}},
   {label:{ru:"Батарея",tj:"Батарея",en:"Battery"},img:WS+"product-viewer/product_battery__fhmgm5ba3omm_large.jpg",
    desc:{ru:"До 24 часов работы и быстрая зарядка.",tj:"То 24 соат кор ва заряди тез.",en:"Up to 24 hours of battery and fast charging."}},
   {label:{ru:"Здоровье",tj:"Саломатӣ",en:"Health"},img:WS+"product-viewer/product_sensors__j8r1adunvqai_large.jpg",
    desc:{ru:"Пульс, ЭКГ, кислород в крови и уведомления о гипертонии.",tj:"Набз, ЭКГ, оксиген ва огоҳиҳо дар бораи гипертония.",en:"Heart rate, ECG, blood oxygen and hypertension alerts."}},
   {label:{ru:"Защита от воды",tj:"Муҳофизат аз об",en:"Water resistance"},img:WS+"product-viewer/product_resistance_alt_endframe__brc7bgls3602_large.jpg",
    desc:{ru:"Водозащита до 50 м и пылезащита IP6X.",tj:"Муҳофизат аз об то 50 м ва IP6X.",en:"Water resistant to 50 m and IP6X dust resistant."}}]
 },
 se3:{name:"Apple Watch SE 3",productId:15,price:6490,eyebrow:"⌚ Watch SE 3",light:true,hlLight:true,
  heroVideo:V_SE3,
  heroImg:WSE+"product-viewer/product_landing__fn9ldzg4foey_large.jpg",
  title:{ru:"Главное. По умной цене.",tj:"Асосӣ. Бо нархи оқилона.",en:"The essentials. Smartly priced."},
  highlights:[
   {img:WSE+"highlights/highlights_always_on__f4gfjwfcdl26_large.jpg",h:{ru:"Дисплей <b>Always-On</b> — впервые в Apple Watch SE.",tj:"Дисплейи <b>Always-On</b> — бори аввал дар SE.",en:"<b>Always-On</b> display — a first for Apple Watch SE."}},
   {img:WSE+"highlights/highlights_sleep_score__gg1jx7w3zfee_large.jpg",h:{ru:"Оценка сна и отслеживание фаз отдыха.",tj:"Баҳои хоб ва пайгирии марҳилаҳои истироҳат.",en:"Sleep Score and sleep stage tracking."}},
   {img:WSE+"highlights/highlights_battery_endframe__evrcjqzrfmie_large.jpg",h:{ru:"До <b>18 часов</b> работы и быстрая зарядка.",tj:"То <b>18 соат</b> кор ва заряди тез.",en:"Up to <b>18 hours</b> of battery and fast charging."}},
   {img:WSE+"highlights/highlights_safety__ehj70sr1vygm_large.jpg",h:{ru:"Безопасность: распознавание аварии и падения.",tj:"Бехатарӣ: муайянкунии садама ва афтиш.",en:"Safety features: Crash and Fall Detection."}},
   {img:WSE+"highlights/highlights_durability_endframe__cvvei6d85uwm_large.jpg",h:{ru:"Прочный корпус для активной жизни.",tj:"Корпуси мустаҳкам барои ҳаёти фаъол.",en:"A durable design for an active life."}},
   {img:WSE+"highlights/highlights_sensor__b624ls8kmtiu_large.jpg",h:{ru:"Датчики здоровья и пульса прямо на запястье.",tj:"Сенсорҳои саломатӣ ва набз дар дастатон.",en:"Health and heart rate sensors on your wrist."}}],
  explorer:[
   {label:{ru:"Корпус",tj:"Маводи корпус",en:"Finishes"},img:WSE+"product-viewer/product_finishes_midnight__jgmf0mnpvwq6_large.jpg",
    desc:{ru:"Алюминий: тёмная ночь и сияющая звезда.",tj:"Алюминий: шаби торик ва ситоравӣ.",en:"Aluminum in Midnight and Starlight."},
    sw:[{hex:"#2e3138",img:WSE+"product-viewer/product_finishes_midnight__jgmf0mnpvwq6_large.jpg"},{hex:"#e9e0d2",img:WSE+"product-viewer/product_finishes_starlight__enr6i85tuqwm_large.jpg"}]},
   {label:{ru:"Дисплей",tj:"Дисплей",en:"Display"},img:WSE+"product-viewer/product_display__d8qh865laqie_large.jpg",
    desc:{ru:"Always-On Retina — теперь и в SE.",tj:"Always-On Retina — акнун дар SE.",en:"Always-On Retina display — now on SE."}},
   {label:{ru:"Здоровье",tj:"Саломатӣ",en:"Health"},img:WSE+"product-viewer/product_health_sensors__c3xtx4ix08cy_large.jpg",
    desc:{ru:"Пульс, уведомления о сердце и контроль активности.",tj:"Набз, огоҳиҳои дил ва назорати фаъолият.",en:"Heart rate, cardiac notifications and activity tracking."}},
   {label:{ru:"Безопасность",tj:"Бехатарӣ",en:"Safety"},img:WSE+"product-viewer/product_motion_sensors__d15xde8xsc6e_large.jpg",
    desc:{ru:"Распознавание аварии и падения, экстренный вызов SOS.",tj:"Муайянкунии садама ва афтиш, занги SOS.",en:"Crash and Fall Detection with Emergency SOS."}},
   {label:{ru:"Защита от воды",tj:"Муҳофизат аз об",en:"Water resistance"},img:WSE+"product-viewer/product_water_resistance__fwm3ju4h4uqa_large.jpg",
    desc:{ru:"Водозащита до 50 метров.",tj:"Муҳофизат аз об то 50 метр.",en:"Water resistant to 50 meters."}}]
 }
};
/* ===== TECH SPECS (per model-page) — value is string (universal) or {ru,tj,en} ===== */
const G=(ru,tj,en)=>({ru,tj,en});
const TECHSPECS={
 iphone17pro:[
  {t:G("Дисплей","Дисплей","Display"),rows:[[G("Тип","Навъ","Type"),G("6,3″ Super Retina XDR OLED","6,3″ Super Retina XDR OLED","6.3″ Super Retina XDR OLED")],[G("Частота","Басомад","Refresh"),"ProMotion 120 Hz · Always-On"],[G("Разрешение","Возеҳӣ","Resolution"),"2622×1206 · 460 ppi"],[G("Яркость","Равшанӣ","Brightness"),G("до 3000 нит","то 3000 нит","up to 3000 nits")]]},
  {t:G("Чип","Чип","Chip"),rows:[[G("Процессор","Просессор","Processor"),"A19 Pro"],["CPU",G("6 ядер","6 ядро","6-core")],["GPU",G("6 ядер","6 ядро","6-core")],["Neural Engine",G("16 ядер","16 ядро","16-core")]]},
  {t:G("Камера","Камера","Camera"),rows:[[G("Основная","Асосӣ","Main"),"48 MP ƒ/1.78"],[G("Ультраширокая","Ултрафарох","Ultra Wide"),"48 MP ƒ/2.2"],[G("Телефото","Телефото","Telephoto"),G("48 MP · зум 4×","48 MP · зум 4×","48 MP · 4× zoom")],[G("Видео","Видео","Video"),"4K Dolby Vision · 120 fps"]]},
  {t:G("Аккумулятор","Батарея","Battery"),rows:[[G("Видео","Видео","Video"),G("до 33 часов","то 33 соат","up to 33 hrs")],[G("Зарядка","Заряд","Charging"),"USB-C · MagSafe · Qi2"],[G("Быстрая зарядка","Заряди тез","Fast charge"),G("50% за 20 мин","50% дар 20 дақ","50% in 20 min")]]},
  {t:G("Корпус и защита","Корпус ва ҳифз","Build"),rows:[[G("Материал","Мавод","Material"),G("Титан Grade 5","Титани Grade 5","Grade 5 Titanium")],[G("Стекло","Шиша","Glass"),"Ceramic Shield 2"],[G("Защита","Ҳифз","Resistance"),"IP68"],[G("Связь","Алоқа","Connectivity"),"5G · Wi-Fi 7 · BT 6 · eSIM"]]}
 ],
 macbookpro:[
  {t:G("Чип","Чип","Chip"),rows:[[G("Процессор","Просессор","Processor"),"Apple M5 Pro"],["CPU",G("до 14 ядер","то 14 ядро","up to 14-core")],["GPU",G("до 20 ядер","то 20 ядро","up to 20-core")],[G("Память","Хотира","Memory"),G("до 48 ГБ","то 48 ГБ","up to 48 GB")]]},
  {t:G("Дисплей","Дисплей","Display"),rows:[[G("Тип","Навъ","Type"),"Liquid Retina XDR"],[G("Диагональ","Диагонал","Size"),"14,2″ / 16,2″"],[G("Частота","Басомад","Refresh"),"ProMotion 120 Hz"],[G("Яркость","Равшанӣ","Brightness"),G("до 1600 нит","то 1600 нит","up to 1600 nits")]]},
  {t:G("Аккумулятор","Батарея","Battery"),rows:[[G("Работа","Кор","Battery life"),G("до 24 часов","то 24 соат","up to 24 hrs")],[G("Зарядка","Заряд","Charging"),"MagSafe 3 · USB-C"]]},
  {t:G("Порты и связь","Портҳо ва алоқа","Connectivity"),rows:[[G("Порты","Портҳо","Ports"),"Thunderbolt 5 · HDMI · SDXC"],[G("Беспроводное","Бесим","Wireless"),"Wi-Fi 7 · BT 5.3"]]}
 ],
 ipadpro:[
  {t:G("Дисплей","Дисплей","Display"),rows:[[G("Тип","Навъ","Type"),"Ultra Retina XDR · Tandem OLED"],[G("Диагональ","Диагонал","Size"),"11″ / 13″"],[G("Частота","Басомад","Refresh"),"ProMotion 120 Hz"],[G("Яркость","Равшанӣ","Brightness"),"1000 / 1600 nits HDR"]]},
  {t:G("Чип","Чип","Chip"),rows:[[G("Процессор","Просессор","Processor"),"Apple M5"],["CPU",G("до 10 ядер","то 10 ядро","up to 10-core")],["GPU",G("10 ядер","10 ядро","10-core")]]},
  {t:G("Камеры","Камераҳо","Cameras"),rows:[[G("Задняя","Қафо","Rear"),"12 MP ƒ/1.8"],[G("Фронтальная","Пеш","Front"),G("12 MP · Center Stage","12 MP · Center Stage","12 MP · Center Stage")],[G("Видео","Видео","Video"),"4K ProRes"]]},
  {t:G("Аккумулятор и связь","Батарея ва алоқа","Battery & more"),rows:[[G("Работа","Кор","Battery life"),G("до 10 часов","то 10 соат","up to 10 hrs")],[G("Связь","Алоқа","Connectivity"),"USB-C · Wi-Fi 7 · 5G"],["Apple Pencil",G("Pencil Pro","Pencil Pro","Pencil Pro")]]}
 ],
 ipadair:[
  {t:G("Дисплей","Дисплей","Display"),rows:[[G("Тип","Навъ","Type"),"Liquid Retina"],[G("Диагональ","Диагонал","Size"),"11″ / 13″"],[G("Разрешение","Возеҳӣ","Resolution"),"264 ppi"],[G("Яркость","Равшанӣ","Brightness"),G("500 нит","500 нит","500 nits")]]},
  {t:G("Чип","Чип","Chip"),rows:[[G("Процессор","Просессор","Processor"),"Apple M3"],["CPU",G("8 ядер","8 ядро","8-core")],["GPU",G("9 ядер","9 ядро","9-core")],["Neural Engine",G("16 ядер","16 ядро","16-core")]]},
  {t:G("Камеры","Камераҳо","Cameras"),rows:[[G("Задняя","Қафо","Rear"),"12 MP"],[G("Фронтальная","Пеш","Front"),G("12 MP · Center Stage (ландшафт)","12 MP · Center Stage","12 MP · Center Stage (landscape)")],[G("Видео","Видео","Video"),"4K"]]},
  {t:G("Аккумулятор и связь","Батарея ва алоқа","Battery & more"),rows:[[G("Работа","Кор","Battery life"),G("до 10 часов","то 10 соат","up to 10 hrs")],[G("Связь","Алоқа","Connectivity"),"USB-C · Wi-Fi 6E · 5G"],["Apple Pencil",G("Pencil Pro · USB-C","Pencil Pro · USB-C","Pencil Pro · USB-C")]]}
 ],
 ipadbase:[
  {t:G("Дисплей","Дисплей","Display"),rows:[[G("Тип","Навъ","Type"),"Liquid Retina"],[G("Диагональ","Диагонал","Size"),"11″"],[G("Разрешение","Возеҳӣ","Resolution"),"264 ppi"],[G("Яркость","Равшанӣ","Brightness"),G("500 нит","500 нит","500 nits")]]},
  {t:G("Чип","Чип","Chip"),rows:[[G("Процессор","Просессор","Processor"),"Apple A16"],["CPU",G("5 ядер","5 ядро","5-core")],["GPU",G("4 ядра","4 ядро","4-core")]]},
  {t:G("Камеры","Камераҳо","Cameras"),rows:[[G("Задняя","Қафо","Rear"),"12 MP"],[G("Фронтальная","Пеш","Front"),G("12 MP · Center Stage (ландшафт)","12 MP · Center Stage","12 MP · Center Stage (landscape)")],[G("Видео","Видео","Video"),"4K"]]},
  {t:G("Аккумулятор и связь","Батарея ва алоқа","Battery & more"),rows:[[G("Работа","Кор","Battery life"),G("до 10 часов","то 10 соат","up to 10 hrs")],[G("Связь","Алоқа","Connectivity"),"USB-C · Wi-Fi 6"],["Apple Pencil",G("USB-C · 1-го поколения","USB-C · насли 1","USB-C · 1st gen")]]}
 ],
 ipadmini:[
  {t:G("Дисплей","Дисплей","Display"),rows:[[G("Тип","Навъ","Type"),"Liquid Retina"],[G("Диагональ","Диагонал","Size"),"8,3″"],[G("Разрешение","Возеҳӣ","Resolution"),"326 ppi"],[G("Яркость","Равшанӣ","Brightness"),G("500 нит","500 нит","500 nits")]]},
  {t:G("Чип","Чип","Chip"),rows:[[G("Процессор","Просессор","Processor"),"Apple A17 Pro"],["CPU",G("6 ядер","6 ядро","6-core")],["GPU",G("5 ядер","5 ядро","5-core")],["Neural Engine",G("16 ядер","16 ядро","16-core")]]},
  {t:G("Камеры","Камераҳо","Cameras"),rows:[[G("Задняя","Қафо","Rear"),"12 MP"],[G("Фронтальная","Пеш","Front"),G("12 MP · Center Stage","12 MP · Center Stage","12 MP · Center Stage")],[G("Видео","Видео","Video"),"4K"]]},
  {t:G("Аккумулятор и связь","Батарея ва алоқа","Battery & more"),rows:[[G("Работа","Кор","Battery life"),G("до 10 часов","то 10 соат","up to 10 hrs")],[G("Связь","Алоқа","Connectivity"),"USB-C · Wi-Fi 6E · 5G"],["Apple Pencil",G("Pencil Pro · USB-C","Pencil Pro · USB-C","Pencil Pro · USB-C")]]}
 ],
 ultra3:[
  {t:G("Корпус","Корпус","Case"),rows:[[G("Материал","Мавод","Material"),G("Титан 49 мм","Титани 49 мм","49mm Titanium")],[G("Стекло","Шиша","Glass"),G("Плоский сапфир","Сапфири ҳамвор","Flat sapphire")],[G("Защита","Ҳифз","Resistance"),"100 m · IP6X · EN13319"]]},
  {t:G("Дисплей","Дисплей","Display"),rows:[[G("Тип","Навъ","Type"),G("LTPO3 OLED Always-On","LTPO3 OLED Always-On","LTPO3 OLED Always-On")],[G("Яркость","Равшанӣ","Brightness"),G("до 3000 нит","то 3000 нит","up to 3000 nits")]]},
  {t:G("Аккумулятор","Батарея","Battery"),rows:[[G("Работа","Кор","Battery life"),G("до 42 часов","то 42 соат","up to 42 hrs")],[G("Энергосбережение","Сарфаи қувва","Low Power"),G("до 72 часов","то 72 соат","up to 72 hrs")]]},
  {t:G("Здоровье и связь","Саломатӣ ва алоқа","Health & more"),rows:[[G("Датчики","Сенсорҳо","Sensors"),G("Пульс · ЭКГ · O₂ · температура","Набз · ЭКГ · O₂ · ҳарорат","Heart · ECG · O₂ · temp")],[G("Навигация","Навигатсия","Navigation"),G("2-частотный GPS · спутник","GPS-и 2-басомад · моҳвора","Dual-freq GPS · satellite")],[G("Связь","Алоқа","Connectivity"),"5G · Wi-Fi · BT 5.3"]]}
 ],
 airpodspro3:[
  {t:G("Чип и звук","Чип ва садо","Chip & audio"),rows:[[G("Чип","Чип","Chip"),"Apple H3"],[G("Звук","Садо","Audio"),G("Адаптивный · Spatial Audio","Адаптивӣ · Spatial Audio","Adaptive · Spatial Audio")],[G("Шумоподавление","Бартарафсозии садо","ANC"),G("в 2× лучше","2× беҳтар","2× better")]]},
  {t:G("Аккумулятор","Батарея","Battery"),rows:[[G("С ANC","Бо ANC","With ANC"),G("до 8 часов","то 8 соат","up to 8 hrs")],[G("С кейсом","Бо кейс","With case"),G("до 30 часов","то 30 соат","up to 30 hrs")],[G("Зарядка","Заряд","Charging"),"USB-C · MagSafe · Qi"]]},
  {t:G("Возможности","Имкониятҳо","Features"),rows:[[G("Здоровье","Саломатӣ","Health"),G("Пульс · слух","Набз · шунавоӣ","Heart rate · hearing")],[G("Перевод","Тарҷума","Translation"),G("Живой перевод","Тарҷумаи зинда","Live Translation")],[G("Защита","Ҳифз","Resistance"),"IP57"]]}
 ],
 s11:[
  {t:G("Корпус","Корпус","Case"),rows:[[G("Размеры","Андозаҳо","Sizes"),G("42 мм · 46 мм","42 мм · 46 мм","42mm · 46mm")],[G("Материал","Мавод","Material"),G("Алюминий или титан","Алюминий ё титан","Aluminum or titanium")],[G("Защита","Ҳифз","Resistance"),"50 m · IP6X"]]},
  {t:G("Дисплей","Дисплей","Display"),rows:[[G("Тип","Навъ","Type"),"LTPO3 OLED Always-On"],[G("Яркость","Равшанӣ","Brightness"),G("до 2000 нит","то 2000 нит","up to 2000 nits")]]},
  {t:G("Аккумулятор","Батарея","Battery"),rows:[[G("Работа","Кор","Battery life"),G("до 24 часов","то 24 соат","up to 24 hrs")],[G("Зарядка","Заряд","Charging"),G("Быстрая · USB-C","Тез · USB-C","Fast charge · USB-C")]]},
  {t:G("Здоровье и связь","Саломатӣ ва алоқа","Health & more"),rows:[[G("Датчики","Сенсорҳо","Sensors"),G("Пульс · ЭКГ · O₂ · гипертония","Набз · ЭКГ · O₂ · гипертония","Heart · ECG · O₂ · hypertension")],[G("Связь","Алоқа","Connectivity"),"5G · Wi-Fi · BT 5.3"]]}
 ],
 se3:[
  {t:G("Корпус","Корпус","Case"),rows:[[G("Размеры","Андозаҳо","Sizes"),G("40 мм · 44 мм","40 мм · 44 мм","40mm · 44mm")],[G("Материал","Мавод","Material"),G("Алюминий","Алюминий","Aluminum")],[G("Защита","Ҳифз","Resistance"),"50 m"]]},
  {t:G("Дисплей","Дисплей","Display"),rows:[[G("Тип","Навъ","Type"),"Retina OLED Always-On"],[G("Особенности","Хусусиятҳо","Features"),G("Always-On — впервые в SE","Always-On — бори аввал","Always-On — first on SE")]]},
  {t:G("Аккумулятор","Батарея","Battery"),rows:[[G("Работа","Кор","Battery life"),G("до 18 часов","то 18 соат","up to 18 hrs")],[G("Зарядка","Заряд","Charging"),G("Быстрая · USB-C","Тез · USB-C","Fast charge · USB-C")]]},
  {t:G("Здоровье и безопасность","Саломатӣ ва бехатарӣ","Health & safety"),rows:[[G("Датчики","Сенсорҳо","Sensors"),G("Пульс · уведомления","Набз · огоҳиҳо","Heart rate · notifications")],[G("Безопасность","Бехатарӣ","Safety"),G("Авария · падение · SOS","Садама · афтиш · SOS","Crash · Fall · SOS")]]}
 ]
};
/* видео-повторы Apple на карточках highlights страниц моделей часов (проверены 200 video/mp4) */
(function(){const U="apple-watch-ultra-3",S="apple-watch-series-11",E="apple-watch-se-3",
  uu="dabb0ca4-1556-466c-a314-ae3ba2cc088e",su="cb7dae4b-d675-49db-8fe3-d4f635c1a345",eu="499c4097-d6f9-4dbe-b2c3-7cdf022ce822";
  const set=(m,i,slug,uuid,seg)=>{if(MODELS[m]&&MODELS[m].highlights[i])MODELS[m].highlights[i].video=AVID(slug,uuid,seg);};
  set("ultra3",1,U,uu,"highlights-battery");set("ultra3",2,U,uu,"highlights-running");set("ultra3",4,U,uu,"health");
  set("s11",0,S,su,"highlights-hypertension");set("s11",2,S,su,"highlights-glass");set("s11",4,S,su,"highlights-workout");set("s11",5,S,su,"highlights-battery");
  set("se3",2,E,eu,"highlights-battery");set("se3",3,E,eu,"on-the-go");set("se3",4,E,eu,"highlights-durability");
})();
const ICON_PLAY='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const ICON_PAUSE='<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
function renderModelPage(){
  const root=document.getElementById("modelpage");if(!root)return;
  const m=MODELS[root.dataset.model];if(!m)return;
  document.title=tr({ru:"Купить "+m.name+" в Душанбе",tj:m.name+"-ро дар Душанбе харед",en:"Buy "+m.name+" in Dushanbe"})+" — ZAMON";
  {const mp=P(m.productId);if(mp)productLD(mp);}
  const specs=TECHSPECS[root.dataset.model];
  const subnav=`<div class="psubnav"><div class="psubnav-in"><span class="pn-name">${m.name}</span>
    <a href="#mhl">${t("pp_highlights")}</a>${m.explorer?`<a href="#mxplor">${tr({ru:"Поближе",tj:"Аз наздик",en:"Closer look"})}</a>`:""}${specs?`<a href="#mspecs">${t("spec_nav")}</a>`:""}
    <a class="pn-buy" href="buy.html?id=${m.productId}">${t("pp_buy")}</a></div></div>`;
  const mhMedia=m.heroVideo
    ? `<video class="mh-img mh-video" autoplay muted loop playsinline preload="auto" aria-label="${m.name}"><source src="${m.heroVideo}" type="video/mp4"></video>`
    : `<img class="mh-img" src="${m.heroImg}" alt="${m.name}" onerror="imgFallback(this)">`;
  const heroFull=`<section class="mhero ${m.light?"light":""}"><div class="mh-eyebrow">${m.eyebrow}</div><h1>${tr(m.title)}</h1>
    ${mhMedia}</section>`;
  const hl=`<section class="sec alt" id="mhl"><div class="wrap"><div class="sec-head reveal"><h2>${t("pp_highlights")}</h2></div>
    <div class="carousel" id="mhlCar">
      <button class="car-arrow prev" aria-label="prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
      <div class="car-viewport"><div class="car-track">${m.highlights.map(h=>`<div class="hl-card ${m.hlLight?"":"dark"}"><div class="hl-h">${tr(h.h)}</div>${h.video?`<video class="hl-img" autoplay muted loop playsinline preload="none"${h.img?` poster="${h.img}"`:""}><source src="${h.video}" type="video/mp4"></video>`:`<img class="hl-img" src="${h.img}" alt="" loading="lazy" onerror="this.style.display='none'">`}</div>`).join("")}</div></div>
      <button class="car-arrow next" aria-label="next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
    </div><div class="hl-controls"><div class="car-dots" id="mhlDots"></div><button class="hl-play" id="mhlPlay">${ICON_PAUSE}</button></div></div></section>`;
  const xp=!m.explorer?"":`<section class="sec xplor-sec" id="mxplor"><div class="sec-head reveal"><h2>${tr({ru:"Рассмотрите поближе.",tj:"Аз наздик бубинед.",en:"Take a closer look."})}</h2></div>
    <div class="mfeats">${m.explorer.map((it,i)=>`<div class="mfeat ${i%2?"rev":""} reveal">
      <div class="mf-text"><h3>${tr(it.label)}</h3><p>${tr(it.desc)}</p>
        ${it.sw?`<div class="mf-sw">${it.sw.map((s,j)=>`<span class="sw ${j===0?"active":""}" data-img="${s.img}" style="background:${s.hex}" title="finish"></span>`).join("")}</div>`:""}</div>
      <div class="mf-media"><img src="${it.img}" alt="${tr(it.label)}" loading="lazy" onerror="this.style.display='none'"></div></div>`).join("")}</div></section>`;
  const cta=`<section class="sec" id="mwhy"><div class="wrap" style="text-align:center">
    <h2 style="font-size:clamp(2rem,4vw,3rem);margin-bottom:14px">${tr({ru:"Готовы к покупке?",tj:"Ба харид тайёред?",en:"Ready to buy?"})}</h2>
    <p style="color:var(--text-2);max-width:520px;margin:0 auto 24px">${tr({ru:"Оригинал, официальная гарантия и быстрая доставка по Душанбе.",tj:"Аслӣ, кафолати расмӣ ва расонидани зуд дар Душанбе.",en:"Genuine, official warranty and fast delivery across Dushanbe."})}</p>
    <button class="btn btn-primary lg" data-buy="${m.productId}">${t("pp_buy")} · ${fmtPrice(m.price)}</button></div></section>`;
  const SL=x=>typeof x==="string"?x:tr(x);
  const sp=!specs?"":`<section class="sec alt" id="mspecs"><div class="wrap"><div class="sec-head reveal"><h2>${t("spec_h")}</h2></div>
    <div class="specs-grid">${specs.map(g=>`<div class="spec-group reveal"><h3>${SL(g.t)}</h3>
      <dl>${g.rows.map(([k,v])=>`<div class="spec-row"><dt>${SL(k)}</dt><dd>${SL(v)}</dd></div>`).join("")}</dl></div>`).join("")}</div></div></section>`;
  const mp=P(m.productId)||{cat:"phone",name:m.name,emoji:"📱"};
  root.innerHTML=subnav+heroFull+hl+(m.explorer?xp:"")+sp+buildWITB(mp)+buildBuyerFAQ()+cta;
  // floating buy pill
  let bp=document.getElementById("buypill");
  if(!bp){bp=document.createElement("div");bp.id="buypill";bp.className="buypill";document.body.appendChild(bp);}
  bp.innerHTML=`<span class="bp-price">${t("from")}${fmtPrice(m.price)}</span><button class="bp-buy">${t("pp_buy")}</button>`;
  bp.querySelector(".bp-buy").onclick=()=>openBuy(m.productId);
  if(window.__bpScroll)window.removeEventListener("scroll",window.__bpScroll);
  window.__bpScroll=()=>bp.classList.toggle("show",window.scrollY>360);
  window.addEventListener("scroll",window.__bpScroll);window.__bpScroll();
  initMHL();initExplorer();wireFAQ(root);observeReveal();initSubnavSpy();
}
function initMHL(){
  const root=document.getElementById("mhlCar");if(!root)return;
  const track=root.querySelector(".car-track"),cards=track.children,dots=document.getElementById("mhlDots"),play=document.getElementById("mhlPlay");
  const n=cards.length;let i=0,playing=true,timer=null;
  const step=()=>cards[0].getBoundingClientRect().width+18;
  function go(k){i=(k+n)%n;track.style.transform=`translateX(${-i*step()}px)`;dots.querySelectorAll(".dot").forEach((d,j)=>d.classList.toggle("active",j===i));}
  dots.innerHTML=Array.from({length:n},(_,j)=>`<span class="dot ${j===0?"active":""}" data-p="${j}"></span>`).join("");
  dots.querySelectorAll(".dot").forEach(d=>d.onclick=()=>{go(+d.dataset.p);bump();});
  root.querySelector(".prev").onclick=()=>{go(i-1);bump();};
  root.querySelector(".next").onclick=()=>{go(i+1);bump();};
  function start(){clearInterval(timer);timer=setInterval(()=>go(i+1),4500);}
  function bump(){if(playing)start();}
  function setPlay(p){playing=p;clearInterval(timer);if(p)start();play.innerHTML=p?ICON_PAUSE:ICON_PLAY;}
  play.onclick=()=>setPlay(!playing);
  go(0);setPlay(true);
  let rz;window.addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(()=>go(i),150);});
}
function initExplorer(){
  const sec=document.getElementById("mxplor");if(!sec)return;
  sec.querySelectorAll(".mfeat").forEach(it=>{
    it.querySelectorAll(".sw").forEach(s=>s.onclick=()=>{const img=it.querySelector(".mf-media img");if(img)img.src=s.dataset.img;it.querySelectorAll(".sw").forEach(x=>x.classList.toggle("active",x===s));});
  });
}

/* ===== I18N ===== */
const I18N={
 ru:{bar:"🚚 Бесплатная доставка по Душанбе от 500 сом. · Оплата при получении · Trade-In",region:"Таджикистан",
  n_store:"Магазин",n_mac:"Mac",n_ipad:"iPad",n_iphone:"iPhone",n_watch:"Watch",n_airpods:"AirPods",n_acc:"Аксессуары",n_support:"Поддержка",
  cur:"сом.",from:"от ",mo:"/мес",c_cod:"Оплата при получении",c_warr:"Гарантия 1 год",add:"Купить",buy_now:"Купить",learn:"Узнать подробнее",details:"Подробнее",pieces:"шт.",remove:"Удалить",close:"Закрыть",gb:"ГБ",tb:"ТБ",cfg_storage:"Память",cfg_storage_sub:"Сколько места вам нужно?",
  m_explore:"Обзор",m_shop:"Магазин",m_more:"Ещё",m_all:"Все модели",m_compare:"Сравнить",m_acc:"Аксессуары",m_trade:"Trade-In",m_credit:"Кредит 0%",m_support:"Поддержка",
  cart_title:"Корзина",cart_items:"Товаров",cart_total:"Итого",cart_checkout:"Оформить заказ",cart_clear:"Очистить корзину",cart_empty:"Ваша корзина пуста",cart_empty_sub:"Добавьте устройства из каталога",ship_free:"Бесплатная доставка по Душанбе",
  co_title:"Оформление заказа",co_sub:"Заполните данные — мы перезвоним для подтверждения.",co_name:"Имя и фамилия",co_phone:"Телефон",co_city:"Город",co_pay:"Способ оплаты",co_pay1:"Наличными при получении",co_pay2:"Картой при получении",co_pay3:"Кредит 0%",co_total:"К оплате",co_submit:"Подтвердить заказ",co_ok_h:"Заказ принят!",co_ok_p:"Спасибо за покупку в ZAMON. Менеджер свяжется с вами в течение 15 минут.",co_ok_btn:"Отлично",
  buy_color:"Цвет",buy_add:"Добавить в корзину",buy_perk1:"Бесплатная доставка по Душанбе",buy_perk2:"Гарантия 1 год",buy_perk3:"Возврат 14 дней",
  cfg_model:"Модель",cfg_model_sub:"Какая вам подходит?",cfg_finish:"Цвет",cfg_finish_sub:"Выберите любимый.",cfg_add:"Добавить в корзину",cfg_total:"Итого",
  cfg_size:"Размер",cfg_size_sub:"Выберите размер.",cfg_fit_sub:"Под вашу модель.",cfg_storage_label:"Память",cfg_incl:"Включено",cfg_band:"Ремешок",cfg_band_sub:"Подберите свой стиль.",cfg_material:"Корпус",cfg_material_sub:"Начнём с материала и цвета.",
  cfg_help_size:"Не знаете, какой размер выбрать?",cfg_help_size_txt:"Больший размер — больше дисплей и ёмкость батареи. Меньший — компактнее и легче. Оба одинаково мощные.",cfg_help_band:"Какой ремешок подойдёт?",cfg_help_band_txt:"Спортивный — универсальный на каждый день. Sport Loop — мягкий и дышащий для тренировок. Миланская петля — элегантная сталь с магнитом. Плетёный — эластичный, без застёжки.",
  cfg_trade:"Trade-In",cfg_trade_sub:"Сдайте старое устройство и сэкономьте.",cfg_trade_none:"Без Trade-In",cfg_trade_none_sub:"Оплачу полную стоимость",cfg_trade_yes:"Сдать устройство",cfg_trade_est:"Ориентировочный зачёт",
  cfg_care:"Защита",cfg_care_sub:"Добавьте AppleCare+ для спокойствия.",cfg_care_none:"Без AppleCare+",cfg_care_none_sub:"Стандартная гарантия 1 год",cfg_care_yes:"AppleCare+ · 2 года",cfg_care_yes_sub:"Защита от поломок и кражи",
  cfg_pay:"Оплата",cfg_pay_sub:"Как вам удобно платить?",cfg_pay_full:"Полная оплата",cfg_pay_full_sub:"Один платёж",cfg_pay_inst:"Кредит 0%",cfg_pay_inst_sub:"24 месяца без переплат",
  cfg_back:"Все модели",cfg_buynow:"Купить сейчас",cfg_device:"Устройство",cfg_save:"Экономия по Trade-In",cfg_mo_note:"× 24 мес · кредит 0%",cfg_summary_h:"Ваша конфигурация",
  search_ph:"Поиск по ZAMON",search_sug:"Популярное",search_quick:"Категории",search_none:"Ничего не найдено. Попробуйте другой запрос.",
  spec_h:"Технические характеристики",spec_nav:"Характеристики",
  acc_h:"Аксессуары",acc_sub:"Дополните вашу технику Apple — оригинальные аксессуары с гарантией.",
  cmp_title:"Сравнение моделей",cmp_sub:"Выберите до трёх устройств и сравните характеристики.",cmp_pick:"Выберите модели",cmp_max:"Можно сравнить до 3 моделей",cmp_hint:"Выберите минимум 2 модели для сравнения",spec_rating:"Оценка",
  ti_title:"Trade-In оценка",ti_sub:"Узнайте, сколько можно сэкономить, сдав старое устройство.",ti_device:"Что сдаёте?",ti_model:"Модель",ti_cond:"Состояние",ti_c1:"Отличное",ti_c2:"Хорошее",ti_c3:"Удовлетворительное",ti_credit:"Ориентировочный зачёт",ti_apply:"Применить к покупке",ti_note:"Точная сумма определяется после осмотра устройства специалистом ZAMON.",
  calc_title:"Калькулятор рассрочки",calc_sub:"Рассчитайте ежемесячный платёж — кредит 0%.",calc_product:"Устройство",calc_term:"Срок",calc_mo:"мес.",calc_care:"Добавить AppleCare+",calc_monthly:"Платёж в месяц",calc_total:"Итого к оплате",
  cp_continue:"Продолжить покупки",cp_summary:"Сумма заказа",cp_view:"Перейти в корзину",
  nf_h:"Страница не найдена",nf_p:"Похоже, этой страницы не существует или она была перемещена. Вернитесь на главную и продолжите покупки.",nf_btn:"На главную",
  skip:"Перейти к содержанию",a_search:"Поиск",a_theme:"Сменить тему",a_cart:"Корзина",a_menu:"Меню",
  ck_step1:"Доставка",ck_step2:"Оплата",ck_step3:"Подтверждение",ck_addr:"Адрес доставки",ck_method:"Способ получения",ck_courier:"Курьер по Душанбе",ck_courier_s:"Бесплатно от 500 сом.",ck_pickup:"Самовывоз",ck_pickup_s:"Магазин в Душанбе, сегодня",ck_next:"Далее",ck_back:"Назад",ck_place:"Подтвердить заказ",ck_review:"Проверьте заказ",ck_contact:"Контакт",ck_deliv:"Доставка",ck_items:"Товары",ck_email:"Эл. почта (необязательно)",order_num:"Заказ №",ck_to_acc:"Мои заказы",
  acc_title:"Аккаунт",acc_login:"Вход",acc_register:"Регистрация",acc_email:"Эл. почта",acc_pass:"Пароль",acc_name:"Имя",acc_signin:"Войти",acc_signup:"Создать аккаунт",acc_logout:"Выйти",acc_profile:"Профиль",acc_orders:"Заказы",acc_wish:"Избранное",acc_no_orders:"У вас пока нет заказов",acc_no_wish:"В избранном пока пусто",acc_welcome:"С возвращением",acc_login_sub:"Войдите, чтобы видеть заказы и избранное.",acc_reg_sub:"Создайте аккаунт ZAMON за минуту.",acc_to_login:"Уже есть аккаунт? Войти",acc_to_reg:"Нет аккаунта? Зарегистрироваться",acc_status:"В обработке",acc_member:"Клиент ZAMON",wished:"Добавлено в избранное",unwished:"Удалено из избранного",
  added:"Добавлено в корзину",nl_done:"Спасибо! Промокод на скидку 10% отправлен 🎉",cleared:"Корзина очищена",
  f_shop:"Покупки",f_account:"Аккаунт",f_store:"Магазин ZAMON",f_biz:"Для бизнеса",f_about:"О ZAMON",
  f_disc:"Apple, логотип Apple, iPhone, iPad, Mac, Apple Watch и AirPods — товарные знаки Apple Inc. ZAMON — независимый магазин-реселлер. Цены указаны в сомони (TJS). Изображения приведены для ознакомления.",
  f_copy:"© 2026 ZAMON. Все права защищены.",f_made:"Сделано с ❤️ в Таджикистане",
  hero_eyebrow:"Apple Premium Store · Таджикистан",hero_sub:"Только оригинальная техника Apple с официальной гарантией. Trade-In, оплата при получении и быстрая доставка по Душанбе.",hero_cta1:"Перейти в каталог",hero_cta2:"Почему ZAMON →",
  chip1:"100% оригинал",chip2:"Гарантия 1 год",chip3:"Оплата при получении",chip4:"Доставка по Душанбе",
  stat1:"Довольных клиентов",stat2:"% оригинальная техника",stat3:"часа — доставка по Душанбе",
  why_tag:"Почему ZAMON",why_h:"Чем мы отличаемся от других",why_p:"Мы не просто продаём технику Apple — мы отвечаем за каждое устройство.",
  cmp_zamon:"ZAMON",cmp_other:"Обычный магазин",cmp1:"Оригинальная техника Apple",cmp2:"Официальная гарантия",cmp3:"Trade-In — обмен с выгодой",cmp4:"Быстрая доставка по Душанбе",cmp5:"Поддержка на 3 языках 24/7",
  sc_tag:"Линейка Apple",sc_h:"Вся техника Apple — у нас",
  srv_tag:"Наш сервис",srv_h:"Премиальный сервис на каждом шаге",
  faq_tag:"Вопросы и ответы",faq_h:"Покупка Apple в Душанбе — частые вопросы",
  s1h:"Только оригинал",s1p:"100% официальная техника Apple с гарантией.",s2h:"Доставка по Душанбе",s2p:"В день заказа. Бесплатно от 500 сом.",s3h:"Оплата при получении",s3p:"Платите только когда получили заказ на руки.",s4h:"Trade-In",s4p:"Обмен старого устройства со скидкой до 6 000 сом.",s5h:"Поддержка 24/7",s5p:"Эксперты ZAMON помогут на трёх языках.",s6h:"Проверка перед оплатой",s6p:"Осмотрите и проверьте устройство до оплаты.",
  line_h:"Изучите всю линейку",line_all:"Сравнить все модели →",
  catalog_h:"Все модели",cat_all:"Все",pp_lineup:"Линейка",pp_buy:"Купить",pp_overview:"Обзор",pp_why:"Преимущества",pp_specs:"Главное",pp_highlights:"Главное",cmp_h:"Сравните модели",spec_price:"Цена",spec_chip:"Чип",spec_display:"Экран",spec_battery:"Батарея"},

 tj:{bar:"🚚 Расонидани ройгон дар Душанбе аз 500 сом. · Пардохт ҳангоми гирифтан · Trade-In",region:"Тоҷикистон",
  n_store:"Мағоза",n_mac:"Mac",n_ipad:"iPad",n_iphone:"iPhone",n_watch:"Watch",n_airpods:"AirPods",n_acc:"Лавозимот",n_support:"Дастгирӣ",
  cur:"сом.",from:"аз ",mo:"/моҳ",c_cod:"Пардохт ҳангоми гирифтан",c_warr:"Кафолати 1 сол",add:"Харидан",buy_now:"Харидан",learn:"Муфассал",details:"Муфассал",pieces:"дона",remove:"Тоза кардан",close:"Пӯшидан",gb:"ГБ",tb:"ТБ",cfg_storage:"Хотира",cfg_storage_sub:"Чӣ қадар ҷой лозим аст?",
  m_explore:"Обзор",m_shop:"Мағоза",m_more:"Боз",m_all:"Ҳама моделҳо",m_compare:"Муқоиса",m_acc:"Лавозимот",m_trade:"Trade-In",m_credit:"Қарзи 0%",m_support:"Дастгирӣ",
  cart_title:"Сабад",cart_items:"Молҳо",cart_total:"Ҳамагӣ",cart_checkout:"Ба расмият даровардан",cart_clear:"Холӣ кардан",cart_empty:"Сабади шумо холист",cart_empty_sub:"Аз феҳрист дастгоҳ илова кунед",ship_free:"Расонидани ройгон дар Душанбе",
  co_title:"Ба расмият даровардан",co_sub:"Маълумотро пур кунед — занг мезанем.",co_name:"Ном ва насаб",co_phone:"Телефон",co_city:"Шаҳр",co_pay:"Тарзи пардохт",co_pay1:"Нақд ҳангоми гирифтан",co_pay2:"Корт ҳангоми гирифтан",co_pay3:"Қарзи 0%",co_total:"Барои пардохт",co_submit:"Тасдиқи фармоиш",co_ok_h:"Фармоиш қабул шуд!",co_ok_p:"Ташаккур! Менеҷер дар давоми 15 дақиқа тамос мегирад.",co_ok_btn:"Аъло",
  buy_color:"Ранг",buy_add:"Ба сабад илова",buy_perk1:"Расонидани ройгон дар Душанбе",buy_perk2:"Кафолати 1 сол",buy_perk3:"Баргардонидан 14 рӯз",
  cfg_model:"Модел",cfg_model_sub:"Кадомаш ба шумо мувофиқ аст?",cfg_finish:"Ранг",cfg_finish_sub:"Дӯстдоштаатонро интихоб кунед.",cfg_add:"Ба сабад илова",cfg_total:"Ҳамагӣ",
  cfg_size:"Андоза",cfg_size_sub:"Андозаро интихоб кунед.",cfg_fit_sub:"Барои модели шумо.",cfg_storage_label:"Хотира",cfg_incl:"Дохил аст",cfg_band:"Тасма",cfg_band_sub:"Услуби худро интихоб кунед.",cfg_material:"Корпус",cfg_material_sub:"Аз мавод ва ранг сар мекунем.",
  cfg_help_size:"Намедонед кадом андоза?",cfg_help_size_txt:"Андозаи калонтар — дисплей ва батареяи калонтар. Хурдтар — ҷайбӣ ва сабуктар. Ҳарду баробар пурқувватанд.",cfg_help_band:"Кадом тасма мувофиқ аст?",cfg_help_band_txt:"Варзишӣ — барои ҳар рӯз. Sport Loop — нарм барои машқ. Миланӣ — пӯлоди шево. Бофта — бе баст.",
  cfg_trade:"Trade-In",cfg_trade_sub:"Дастгоҳи кӯҳнаро супоред ва сарфа кунед.",cfg_trade_none:"Бе Trade-In",cfg_trade_none_sub:"Арзиши пурраро пардохт мекунам",cfg_trade_yes:"Супоридани дастгоҳ",cfg_trade_est:"Зачёти тахминӣ",
  cfg_care:"Ҳифз",cfg_care_sub:"Барои оромӣ AppleCare+ илова кунед.",cfg_care_none:"Бе AppleCare+",cfg_care_none_sub:"Кафолати стандартии 1 сол",cfg_care_yes:"AppleCare+ · 2 сол",cfg_care_yes_sub:"Ҳифз аз шикаст ва дуздӣ",
  cfg_pay:"Пардохт",cfg_pay_sub:"Чӣ тавр пардохт мекунед?",cfg_pay_full:"Пардохти пурра",cfg_pay_full_sub:"Як пардохт",cfg_pay_inst:"Қарзи 0%",cfg_pay_inst_sub:"24 моҳ бе пардохти иловагӣ",
  cfg_back:"Ҳама моделҳо",cfg_buynow:"Ҳозир харидан",cfg_device:"Дастгоҳ",cfg_save:"Сарфа аз Trade-In",cfg_mo_note:"× 24 моҳ · қарзи 0%",cfg_summary_h:"Конфигуратсияи шумо",
  search_ph:"Ҷустуҷӯ дар ZAMON",search_sug:"Маъмул",search_quick:"Категорияҳо",search_none:"Чизе ёфт нашуд. Дархости дигарро санҷед.",
  spec_h:"Хусусиятҳои техникӣ",spec_nav:"Хусусиятҳо",
  acc_h:"Лавозимот",acc_sub:"Техникаи Apple-и худро пурра кунед — лавозимоти аслӣ бо кафолат.",
  cmp_title:"Муқоисаи моделҳо",cmp_sub:"То се дастгоҳ интихоб кунед ва хусусиятҳоро муқоиса кунед.",cmp_pick:"Моделҳоро интихоб кунед",cmp_max:"То 3 модел муқоиса кардан мумкин аст",cmp_hint:"Барои муқоиса камаш 2 модел интихоб кунед",spec_rating:"Баҳо",
  ti_title:"Арзёбии Trade-In",ti_sub:"Бифаҳмед, ки бо супоридани дастгоҳи кӯҳна чӣ қадар сарфа мекунед.",ti_device:"Чиро месупоред?",ti_model:"Модел",ti_cond:"Ҳолат",ti_c1:"Аъло",ti_c2:"Хуб",ti_c3:"Қаноатбахш",ti_credit:"Зачёти тахминӣ",ti_apply:"Ба харид татбиқ кардан",ti_note:"Маблағи дақиқ пас аз муоинаи дастгоҳ муайян мешавад.",
  calc_title:"Ҳисобкунаки кредит",calc_sub:"Пардохти моҳонаро ҳисоб кунед — қарзи 0%.",calc_product:"Дастгоҳ",calc_term:"Мӯҳлат",calc_mo:"моҳ",calc_care:"AppleCare+ илова кардан",calc_monthly:"Пардохти моҳона",calc_total:"Ҳамагӣ барои пардохт",
  cp_continue:"Идомаи харид",cp_summary:"Маблағи фармоиш",cp_view:"Ба сабад гузаштан",
  nf_h:"Саҳифа ёфт нашуд",nf_p:"Чунин менамояд, ки ин саҳифа вуҷуд надорад ё кӯчонида шудааст. Ба саҳифаи асосӣ баргардед.",nf_btn:"Ба асосӣ",
  skip:"Ба мундариҷа гузаштан",a_search:"Ҷустуҷӯ",a_theme:"Тағйири мавзӯъ",a_cart:"Сабад",a_menu:"Меню",
  ck_step1:"Расонидан",ck_step2:"Пардохт",ck_step3:"Тасдиқ",ck_addr:"Суроғаи расонидан",ck_method:"Тарзи гирифтан",ck_courier:"Курьер дар Душанбе",ck_courier_s:"Ройгон аз 500 сом.",ck_pickup:"Худбардорӣ",ck_pickup_s:"Мағоза дар Душанбе, имрӯз",ck_next:"Минбаъд",ck_back:"Бозгашт",ck_place:"Тасдиқи фармоиш",ck_review:"Фармоишро санҷед",ck_contact:"Тамос",ck_deliv:"Расонидан",ck_items:"Молҳо",ck_email:"Почтаи электронӣ (ихтиёрӣ)",order_num:"Фармоиш №",ck_to_acc:"Фармоишҳои ман",
  acc_title:"Аккаунт",acc_login:"Воридшавӣ",acc_register:"Бақайдгирӣ",acc_email:"Почтаи электронӣ",acc_pass:"Парол",acc_name:"Ном",acc_signin:"Ворид шудан",acc_signup:"Сохтани аккаунт",acc_logout:"Баромад",acc_profile:"Профил",acc_orders:"Фармоишҳо",acc_wish:"Дӯстдошта",acc_no_orders:"Шумо ҳоло фармоиш надоред",acc_no_wish:"Дӯстдоштаҳо холӣ аст",acc_welcome:"Хуш омадед",acc_login_sub:"Барои дидани фармоишҳо ворид шавед.",acc_reg_sub:"Дар як дақиқа аккаунти ZAMON созед.",acc_to_login:"Аллакай аккаунт доред? Ворид шавед",acc_to_reg:"Аккаунт надоред? Бақайд гиред",acc_status:"Дар коркард",acc_member:"Мизоҷи ZAMON",wished:"Ба дӯстдошта илова шуд",unwished:"Аз дӯстдошта хориҷ шуд",
  added:"Ба сабад илова шуд",nl_done:"Ташаккур! Промокоди 10% фиристода шуд 🎉",cleared:"Сабад холӣ шуд",
  f_shop:"Харидҳо",f_account:"Аккаунт",f_store:"Мағозаи ZAMON",f_biz:"Барои бизнес",f_about:"Дар бораи ZAMON",
  f_disc:"Apple ва тамғаҳои дигар моликияти Apple Inc. мебошанд. ZAMON мағозаи мустақили реселлер аст. Нархҳо бо сомонӣ (TJS). Тасвирҳо барои шиносоӣ.",
  f_copy:"© 2026 ZAMON. Ҳамаи ҳуқуқҳо ҳифз шудаанд.",f_made:"Бо ❤️ дар Тоҷикистон сохта шуд",
  hero_eyebrow:"Apple Premium Store · Тоҷикистон",hero_sub:"Танҳо техникаи аслии Apple бо кафолати расмӣ. Trade-In, пардохт ҳангоми гирифтан ва расонидани зуд дар Душанбе.",hero_cta1:"Ба феҳрист",hero_cta2:"Чаро ZAMON →",
  chip1:"100% аслӣ",chip2:"Кафолати 1 сол",chip3:"Пардохт ҳангоми гирифтан",chip4:"Расонидан дар Душанбе",
  stat1:"Мизоҷони мамнун",stat2:"% техникаи аслӣ",stat3:"соат — расонидан дар Душанбе",
  why_tag:"Чаро ZAMON",why_h:"Чӣ моро аз дигарон фарқ мекунад",why_p:"Мо на танҳо техникаи Apple мефурӯшем — мо барои ҳар дастгоҳ ҷавобгар ҳастем.",
  cmp_zamon:"ZAMON",cmp_other:"Мағозаи оддӣ",cmp1:"Техникаи аслии Apple",cmp2:"Кафолати расмӣ",cmp3:"Trade-In — иваз бо фоида",cmp4:"Расонидани зуд дар Душанбе",cmp5:"Дастгирӣ бо 3 забон 24/7",
  sc_tag:"Хатти Apple",sc_h:"Тамоми техникаи Apple — дар мо",
  srv_tag:"Хизмати мо",srv_h:"Хизматрасонии олӣ дар ҳар қадам",
  faq_tag:"Саволу ҷавоб",faq_h:"Хариди Apple дар Душанбе — саволҳои маъмул",
  s1h:"Танҳо аслӣ",s1p:"100% техникаи расмии Apple бо кафолат.",s2h:"Расонидан дар Душанбе",s2p:"Дар рӯзи фармоиш. Ройгон аз 500 сом.",s3h:"Пардохт ҳангоми гирифтан",s3p:"Танҳо ҳангоми ба даст гирифтани фармоиш пардохт кунед.",s4h:"Trade-In",s4p:"Иваз бо тахфифи то 6 000 сом.",s5h:"Дастгирӣ 24/7",s5p:"Коршиносони ZAMON ба се забон кӯмак мекунанд.",s6h:"Санҷиш пеш аз пардохт",s6p:"Дастгоҳро пеш аз пардохт бинед ва санҷед.",
  line_h:"Тамоми хатти маҳсулот",line_all:"Муқоисаи ҳама →",
  catalog_h:"Ҳама моделҳо",cat_all:"Ҳама",pp_lineup:"Хатти маҳсулот",pp_buy:"Харидан",pp_overview:"Обзор",pp_why:"Бартариҳо",pp_specs:"Асосӣ",pp_highlights:"Асосӣ",cmp_h:"Моделҳоро муқоиса кунед",spec_price:"Нарх",spec_chip:"Чип",spec_display:"Экран",spec_battery:"Батарея"},

 en:{bar:"🚚 Free delivery across Dushanbe from 500 TJS · Pay on delivery · Trade-In",region:"Tajikistan",
  n_store:"Store",n_mac:"Mac",n_ipad:"iPad",n_iphone:"iPhone",n_watch:"Watch",n_airpods:"AirPods",n_acc:"Accessories",n_support:"Support",
  cur:"TJS",from:"from ",mo:"/mo",c_cod:"Pay on delivery",c_warr:"1-year warranty",add:"Buy",buy_now:"Buy",learn:"Learn more",details:"Learn more",pieces:"pcs",remove:"Remove",close:"Close",gb:"GB",tb:"TB",cfg_storage:"Storage",cfg_storage_sub:"How much space do you need?",
  m_explore:"Explore",m_shop:"Shop",m_more:"More",m_all:"All models",m_compare:"Compare",m_acc:"Accessories",m_trade:"Trade-In",m_credit:"0% financing",m_support:"Support",
  cart_title:"Bag",cart_items:"Items",cart_total:"Total",cart_checkout:"Checkout",cart_clear:"Clear bag",cart_empty:"Your bag is empty",cart_empty_sub:"Add devices from the catalog",ship_free:"Free delivery across Dushanbe",
  co_title:"Checkout",co_sub:"Fill in your details — we'll call to confirm.",co_name:"Full name",co_phone:"Phone",co_city:"City",co_pay:"Payment method",co_pay1:"Cash on delivery",co_pay2:"Card on delivery",co_pay3:"0% financing",co_total:"To pay",co_submit:"Confirm order",co_ok_h:"Order received!",co_ok_p:"Thank you for shopping at ZAMON. Our manager will contact you within 15 minutes.",co_ok_btn:"Great",
  buy_color:"Color",buy_add:"Add to Bag",buy_perk1:"Free delivery in Dushanbe",buy_perk2:"1-year warranty",buy_perk3:"14-day returns",
  cfg_model:"Model",cfg_model_sub:"Which is best for you?",cfg_finish:"Finish",cfg_finish_sub:"Pick your favorite.",cfg_add:"Add to Bag",cfg_total:"Total",
  cfg_size:"Size",cfg_size_sub:"Choose your size.",cfg_fit_sub:"For your model.",cfg_storage_label:"Storage",cfg_incl:"Included",cfg_band:"Band",cfg_band_sub:"Find your style.",cfg_material:"Case",cfg_material_sub:"Start with your material and finish.",
  cfg_help_size:"Need help choosing a size?",cfg_help_size_txt:"A larger size means a bigger display and battery. A smaller one is more compact and lighter. Both are equally powerful.",cfg_help_band:"Which band is right for you?",cfg_help_band_txt:"Sport Band — versatile for everyday. Sport Loop — soft and breathable for workouts. Milanese Loop — elegant steel with a magnet. Braided — stretchy, no clasp.",
  cfg_trade:"Trade-In",cfg_trade_sub:"Trade in your old device and save.",cfg_trade_none:"No Trade-In",cfg_trade_none_sub:"I'll pay the full price",cfg_trade_yes:"Trade in a device",cfg_trade_est:"Estimated credit",
  cfg_care:"Protection",cfg_care_sub:"Add AppleCare+ for peace of mind.",cfg_care_none:"No AppleCare+",cfg_care_none_sub:"Standard 1-year warranty",cfg_care_yes:"AppleCare+ · 2 years",cfg_care_yes_sub:"Coverage for damage and theft",
  cfg_pay:"Payment",cfg_pay_sub:"How would you like to pay?",cfg_pay_full:"Pay in full",cfg_pay_full_sub:"One payment",cfg_pay_inst:"0% financing",cfg_pay_inst_sub:"24 months, no overpayment",
  cfg_back:"All models",cfg_buynow:"Buy now",cfg_device:"Device",cfg_save:"Trade-In savings",cfg_mo_note:"× 24 mo · 0% financing",cfg_summary_h:"Your configuration",
  search_ph:"Search ZAMON",search_sug:"Popular",search_quick:"Categories",search_none:"No results. Try another search.",
  spec_h:"Tech Specs",spec_nav:"Specs",
  acc_h:"Accessories",acc_sub:"Complete your Apple setup — genuine accessories with warranty.",
  cmp_title:"Compare models",cmp_sub:"Pick up to three devices and compare their specs.",cmp_pick:"Choose models",cmp_max:"Compare up to 3 models",cmp_hint:"Select at least 2 models to compare",spec_rating:"Rating",
  ti_title:"Trade-In estimate",ti_sub:"See how much you can save by trading in your old device.",ti_device:"What are you trading?",ti_model:"Model",ti_cond:"Condition",ti_c1:"Excellent",ti_c2:"Good",ti_c3:"Fair",ti_credit:"Estimated credit",ti_apply:"Apply to a purchase",ti_note:"The exact amount is determined after a ZAMON specialist inspects the device.",
  calc_title:"Financing calculator",calc_sub:"Estimate your monthly payment — 0% financing.",calc_product:"Device",calc_term:"Term",calc_mo:"mo",calc_care:"Add AppleCare+",calc_monthly:"Monthly payment",calc_total:"Total to pay",
  cp_continue:"Continue shopping",cp_summary:"Order summary",cp_view:"View bag",
  nf_h:"Page not found",nf_p:"This page doesn't seem to exist or may have moved. Head back to the homepage to keep shopping.",nf_btn:"Back to home",
  skip:"Skip to content",a_search:"Search",a_theme:"Toggle theme",a_cart:"Bag",a_menu:"Menu",
  ck_step1:"Delivery",ck_step2:"Payment",ck_step3:"Review",ck_addr:"Delivery address",ck_method:"Delivery method",ck_courier:"Courier in Dushanbe",ck_courier_s:"Free from 500 TJS",ck_pickup:"Store pickup",ck_pickup_s:"Dushanbe store, today",ck_next:"Continue",ck_back:"Back",ck_place:"Place order",ck_review:"Review your order",ck_contact:"Contact",ck_deliv:"Delivery",ck_items:"Items",ck_email:"Email (optional)",order_num:"Order №",ck_to_acc:"My orders",
  acc_title:"Account",acc_login:"Sign in",acc_register:"Register",acc_email:"Email",acc_pass:"Password",acc_name:"Name",acc_signin:"Sign in",acc_signup:"Create account",acc_logout:"Sign out",acc_profile:"Profile",acc_orders:"Orders",acc_wish:"Saved",acc_no_orders:"You have no orders yet",acc_no_wish:"Your saved list is empty",acc_welcome:"Welcome back",acc_login_sub:"Sign in to see your orders and saved items.",acc_reg_sub:"Create your ZAMON account in a minute.",acc_to_login:"Already have an account? Sign in",acc_to_reg:"No account? Register",acc_status:"Processing",acc_member:"ZAMON customer",wished:"Added to saved",unwished:"Removed from saved",
  added:"Added to bag",nl_done:"Thank you! Your 10% promo code has been sent 🎉",cleared:"Bag cleared",
  f_shop:"Shop and Learn",f_account:"Account",f_store:"The ZAMON Store",f_biz:"For Business",f_about:"About ZAMON",
  f_disc:"Apple and other marks are trademarks of Apple Inc. ZAMON is an independent reseller. Prices in somoni (TJS). Images for reference only.",
  f_copy:"© 2026 ZAMON. All rights reserved.",f_made:"Made with ❤️ in Tajikistan",
  hero_eyebrow:"Apple Premium Store · Tajikistan",hero_sub:"Only genuine Apple products with official warranty. Trade-In, pay on delivery and fast delivery across Dushanbe.",hero_cta1:"Go to catalog",hero_cta2:"Why ZAMON →",
  chip1:"100% genuine",chip2:"1-year warranty",chip3:"Pay on delivery",chip4:"Dushanbe delivery",
  stat1:"Happy customers",stat2:"% genuine products",stat3:"hour — Dushanbe delivery",
  why_tag:"Why ZAMON",why_h:"What sets us apart",why_p:"We don't just sell Apple — we stand behind every single device.",
  cmp_zamon:"ZAMON",cmp_other:"Ordinary store",cmp1:"Genuine Apple products",cmp2:"Official warranty",cmp3:"Trade-In with great value",cmp4:"Fast Dushanbe delivery",cmp5:"24/7 support in 3 languages",
  sc_tag:"The Apple lineup",sc_h:"All of Apple — right here",
  srv_tag:"Our service",srv_h:"Premium service at every step",
  faq_tag:"Questions & answers",faq_h:"Buying Apple in Dushanbe — FAQ",
  s1h:"Genuine only",s1p:"100% official Apple products with warranty.",s2h:"Dushanbe delivery",s2p:"Same day. Free from 500 somoni.",s3h:"Pay on delivery",s3p:"Pay only when the order is in your hands.",s4h:"Trade-In",s4p:"Trade your old device, save up to 6,000 TJS.",s5h:"24/7 support",s5p:"ZAMON experts help in three languages.",s6h:"Inspect before paying",s6p:"Check and test the device before you pay.",
  line_h:"Explore the lineup",line_all:"Compare all models →",
  catalog_h:"All models",cat_all:"All",pp_lineup:"The lineup",pp_buy:"Buy",pp_overview:"Overview",pp_why:"Why",pp_specs:"Highlights",pp_highlights:"Get the highlights",cmp_h:"Compare models",spec_price:"Price",spec_chip:"Chip",spec_display:"Display",spec_battery:"Battery"}
};
let LANG=localStorage.getItem("zamon-lang")||"ru"; if(!I18N[LANG])LANG="ru";
const t=k=>(I18N[LANG]&&I18N[LANG][k]!=null)?I18N[LANG][k]:k;
const tr=o=>(o&&(o[LANG]||o.ru))||"";
const num=n=>n.toLocaleString("ru-RU").replace(/,/g," ");
const fmtPrice=n=>num(n)+" "+t("cur");
const monthly=n=>Math.round(n/24);

/* ===== SHELL: build nav + footer + overlays ===== */
const MARK='<span class="mark"><svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="zcm" x1="8" y1="7" x2="33" y2="34" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fcfcfe"/><stop offset=".42" stop-color="#c4c6cc"/><stop offset=".6" stop-color="#7a7d83"/><stop offset=".82" stop-color="#bcbec3"/><stop offset="1" stop-color="#e6e8ec"/></linearGradient></defs><rect x="8.5" y="8.5" width="23" height="23" rx="6.5" fill="none" stroke="url(#zcm)" stroke-width="2.4"/><path d="M14.6 14.2H26.2L14.4 25.8H26.4" fill="none" stroke="url(#zcm)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
const NAVITEMS=[["store","n_store","index.html#showcase",null],["mac","n_mac","mac.html","mac"],["ipad","n_ipad","ipad.html","ipad"],
 ["iphone","n_iphone","iphone.html","iphone"],["watch","n_watch","watch.html","watch"],["airpods","n_airpods","airpods.html","airpods"],
 ["acc","n_acc","accessories.html",null],["support","n_support","support.html",null]];
function curPage(){const p=location.pathname.split("/").pop();return p||"index.html";}
function buildShell(){
  const page=curPage();
  const navlinks=NAVITEMS.map(([id,key,href,menu])=>{
    const active=(menu&&href===page)?"active":"";
    return `<a href="${href}" class="${active}" ${active?'aria-current="page"':""} ${menu?`data-menu="${menu}"`:""}>${t(key)}</a>`;
  }).join("");
  const skip=`<a href="#maincontent" class="skip-link">${t("skip")}</a>`;
  const topbar=`<div class="topbar"><span>${t("bar")}</span><span class="region">🌐 ${t("region")} <span class="chk">✓</span></span></div>`;
  const nav=`<header class="gnav"><div class="gnav-bar"><div class="gnav-in">
      <a href="index.html" class="gnav-logo" aria-label="ZAMON">${MARK}ZAMON</a>
      <nav class="gnav-links" id="gnavLinks" aria-label="${t("n_store")}">${navlinks}</nav>
      <div class="gnav-right">
        <button class="icon-btn" id="searchBtn" aria-label="${t("a_search")}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></button>
        <button class="icon-btn" id="themeBtn" aria-label="${t("a_theme")}"><svg id="themeIcon" viewBox="0 0 24 24" aria-hidden="true"></svg></button>
        <div class="lang" role="group" aria-label="Language"><button data-lang="tj" aria-label="Тоҷикӣ">TJ</button><button data-lang="ru" aria-label="Русский">RU</button><button data-lang="en" aria-label="English">EN</button></div>
        <a class="icon-btn" href="account.html" aria-label="${t("acc_title")}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg></a>
        <button class="icon-btn" id="openCart" aria-label="${t("a_cart")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span class="cart-count" id="cartCount">0</span></button>
        <button class="icon-btn burger" id="burger" aria-label="${t("a_menu")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
      </div></div>
      <div class="megamenu" id="megamenu"><div class="mega-in" id="megaIn"></div></div>
    </header>`;
  const mobile=`<div class="mobile-menu" id="mobileMenu">${NAVITEMS.map(([id,key,href])=>`<a href="${href}">${t(key)}</a>`).join("")}</div>`;
  document.body.insertAdjacentHTML("afterbegin",skip+topbar+nav+mobile);
  document.body.insertAdjacentHTML("beforeend",buildFooter()+buildOverlays()+
    `<a class="wa-float" href="${waLink(tr({ru:"Здравствуйте! Хочу задать вопрос о покупке в ZAMON.",tj:"Салом! Дар бораи харид дар ZAMON савол дорам.",en:"Hello! I have a question about buying at ZAMON."}))}" target="_blank" rel="noopener" aria-label="WhatsApp" title="${tr({ru:"Написать в WhatsApp",tj:"Ба WhatsApp нависед",en:"Message on WhatsApp"})}"><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.7L.5 31.5l8-2.1c2.2 1.2 4.8 1.9 7.5 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.8 1.3 1.3-4.7-.3-.5C3.8 20.8 3.2 18.4 3.2 16 3.2 8.9 8.9 3.2 16 3.2S28.8 8.9 28.8 16 23.1 28.8 16 28.8zm7.3-9.6c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.2-1.3-3-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.3-.3-.7-.5z"/></svg></a>`+
    `<button class="scrolltop" id="scrollTop" aria-label="Наверх" title="Наверх"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg></button>`);
  // mark main content for skip link
  const main=document.querySelector("body > section");
  if(main){if(!main.id)main.id="maincontent";main.setAttribute("tabindex","-1");
    const sl=document.querySelector(".skip-link");if(sl)sl.setAttribute("href","#"+main.id);}
  const st=document.getElementById("scrollTop");
  if(st){st.onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
    let stT=false;addEventListener("scroll",()=>{if(!stT){requestAnimationFrame(()=>{st.classList.toggle("show",scrollY>700);stT=false;});stT=true;}},{passive:true});}
}
function fcol(title,links){return `<div class="gf-col"><h5>${title}</h5>${links.map(([l,h])=>`<a href="${h||"#"}">${l}</a>`).join("")}</div>`;}
function buildFooter(){
  const L=I18N[LANG];
  return `<footer class="gfooter"><div class="gf-in">
    <div class="gf-pitch"><b>ZAMON</b> — ${L.hero_eyebrow}. ${L.s1p}</div>
    <div class="gf-dir">
      <div class="gf-col"><div class="gf-brand">${MARK}ZAMON</div><p class="gf-about">${tr({ru:"Авторизованный премиальный магазин техники Apple в Таджикистане.",tj:"Мағозаи расмии премиалии техникаи Apple дар Тоҷикистон.",en:"An authorized premium Apple store in Tajikistan."})}</p>
        <div class="gf-socials">
          <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.8.7.7-2.7-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5 0-.7-.3-1.4-.7-2-1.4-.4-.5-.7-1-.9-1.4-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.2.2-.4 0-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.7.7-.9 1.6-.6 2.6.3 1.1 1 2.1 1.2 2.4 1.7 2.5 3.6 3.3 4.8 3.6.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1l-.3-.2Z"/></svg></a>
          <a href="${tgLink}" target="_blank" rel="noopener" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 3-9.5 9.5"/><path d="M22 3 15 21l-3.5-7.5L4 10l18-7Z"/></svg></a>
          <a href="tel:${SHOP_PHONE.replace(/\s/g,"")}" aria-label="Телефон"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"/></svg></a>
        </div></div>
      ${fcol(L.f_shop,[["iPhone","iphone.html"],["Mac","mac.html"],["iPad","ipad.html"],["Apple Watch","watch.html"],["AirPods","airpods.html"],[L.m_acc,"accessories.html"]])}
      ${fcol(L.f_store,[["Trade-In","trade-in.html"],[tr({ru:"Сравнить модели",tj:"Муқоисаи моделҳо",en:"Compare models"}),"compare.html"],[tr({ru:"Доставка",tj:"Расонидан",en:"Delivery"}),"index.html#services"],[tr({ru:"Аксессуары",tj:"Лавозимот",en:"Accessories"}),"accessories.html"]])}
      ${fcol(L.f_account,[[tr({ru:"Мой аккаунт",tj:"Аккаунти ман",en:"My Account"}),"account.html"],[tr({ru:"Корзина",tj:"Сабад",en:"Bag"}),"cart.html"],[tr({ru:"Заказы",tj:"Фармоишҳо",en:"Orders"}),"account.html"]])}
      ${fcol(L.f_about,[[tr({ru:"О нас",tj:"Дар бораи мо",en:"About us"}),"about.html"],[tr({ru:"Поддержка",tj:"Дастгирӣ",en:"Support"}),"support.html"],[tr({ru:"Контакты",tj:"Тамос",en:"Contact"}),"contact.html"],[tr({ru:"Магазины в Душанбе",tj:"Мағозаҳо дар Душанбе",en:"Stores in Dushanbe"}),"contact.html"]])}
    </div>
    <div class="gf-legal"><p>${L.f_disc}</p>
      <div class="gf-row"><span>${L.f_copy}</span>
        <span class="gf-links"><a href="#">${tr({ru:"Конфиденциальность",tj:"Махфият",en:"Privacy"})}</a><a href="#">${tr({ru:"Условия",tj:"Шартҳо",en:"Terms"})}</a><span>🌐 ${L.region}</span></span></div>
      <div class="gf-row"><span>${L.f_made}</span></div>
    </div></div></footer>`;
}
function buildOverlays(){
  return `<div class="overlay" id="overlay"></div>
  <aside class="drawer" id="drawer"><div class="drawer-head"><h3>${t("cart_title")}</h3><button class="close-x" id="closeCart">✕</button></div>
    <div class="cart-items" id="cartItems"></div>
    <div class="drawer-foot" id="drawerFoot"><div class="ship-note" id="shipNote"></div>
      <div class="drawer-sub"><span>${t("cart_items")}</span><span id="cartQtyTotal">0</span></div>
      <div class="drawer-total"><span>${t("cart_total")}</span><span id="cartTotal">0</span></div>
      <button class="btn btn-primary" id="checkoutBtn">${t("cart_checkout")}</button>
      <a class="btn btn-soft" href="cart.html" style="width:100%;justify-content:center">${t("cp_view")}</a>
      <button class="btn-clear" id="clearCart">${t("cart_clear")}</button></div></aside>
  <div class="modal-wrap" id="modalWrap"><div class="mbg" data-close></div><div class="modal" id="modalInner"></div></div>
  <div class="search-overlay" id="searchOverlay"><div class="search-bg" data-sclose></div>
    <div class="search-panel"><div class="search-bar">
      <svg class="sb-ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <input id="searchInput" type="text" autocomplete="off" data-i-ph="search_ph" placeholder="${t("search_ph")}">
      <button class="search-close" id="searchClose" aria-label="close">✕</button></div>
      <div class="search-results" id="searchResults"></div></div></div>
  <div class="toast" id="toast"></div>`;
}

/* ===== MEGA MENU ===== */
function buildMega(menu){
  const li=LI(menu);if(!li)return "";
  const cards=PRODUCTS.filter(p=>p.cat===li.cat).map(p=>`<a class="mega-card" href="${p.modelPage||("buy.html?id="+p.id)}">
    <div class="mc-img">${p.new?`<span class="mc-new">NEW</span>`:""}<img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div>
    <div class="mc-name">${p.name}</div><div class="mc-price">${t("from")}${num(p.price)} ${t("cur")}</div></a>`).join("");
  return `<div class="mega-left">
      <div class="mega-col"><h5>${t("m_explore")}</h5><a class="big" href="${li.page}">${li.name}</a>
        <a href="${li.buyPage||li.page}">${t("m_all")}</a><a href="compare.html">${t("m_compare")}</a><a href="support.html">${t("m_support")}</a></div>
      <div class="mega-col"><h5>${t("m_shop")}</h5><a href="trade-in.html">${t("m_trade")}</a><a href="compare.html">${t("m_compare")}</a><a href="accessories.html">${t("m_acc")}</a></div>
    </div>
    <div class="mega-cards">${cards}</div>`;
}
let megaTimer;
function initMega(){
  const mm=document.getElementById("megamenu"),mi=document.getElementById("megaIn");
  document.querySelectorAll("#gnavLinks a[data-menu]").forEach(a=>{
    a.addEventListener("mouseenter",()=>{clearTimeout(megaTimer);mi.innerHTML=buildMega(a.dataset.menu);mm.classList.add("open");});
    a.addEventListener("mouseleave",()=>{megaTimer=setTimeout(()=>mm.classList.remove("open"),140);});
  });
  mm.addEventListener("mouseenter",()=>clearTimeout(megaTimer));
  mm.addEventListener("mouseleave",()=>{megaTimer=setTimeout(()=>mm.classList.remove("open"),140);});
}

/* ===== THEME / LANG ===== */
function setTheme(m){
  document.documentElement.setAttribute("data-theme",m);localStorage.setItem("zamon-theme",m);
  const ic=document.getElementById("themeIcon");if(ic)ic.innerHTML=m==="dark"?'<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>':'<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",m==="dark"?"#000":"#fbfbfd");
}
function applyLang(l){
  LANG=l;localStorage.setItem("zamon-lang",l);document.documentElement.lang=l;
  document.querySelectorAll("[data-i]").forEach(el=>{const k=el.getAttribute("data-i");if(I18N[l][k]!=null)el.textContent=I18N[l][k];});
  document.querySelectorAll("[data-i-ph]").forEach(el=>{const k=el.getAttribute("data-i-ph");if(I18N[l][k]!=null)el.placeholder=I18N[l][k];});
  document.querySelectorAll(".lang button").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));
  // re-render dynamic regions
  if(document.getElementById("lineupTrack"))renderLineup();
  if(document.getElementById("storebar"))renderStoreBar();
  if(document.getElementById("showcaseBox"))renderShowcase();
  if(document.getElementById("accMarqueeSec"))renderAccMarquee();
  if(document.getElementById("faqBox"))renderFAQ();
  if(document.getElementById("guarantees"))renderGuarantees();
  if(document.getElementById("catalog"))renderCatalog();
  if(document.getElementById("buygrid"))renderBuyGrid();
  if(document.getElementById("chapnav"))renderChapnav();
  if(document.getElementById("phero")){renderProductHero();renderSubnav();renderHighlights();renderFeatures();renderWhyProd();initSubnavSpy();}
  if(document.getElementById("compare-models"))renderCompare();
  if(document.getElementById("modelpage"))renderModelPage();
  if(document.getElementById("cfg"))renderConfigurator();
  if(document.getElementById("checkout"))renderCheckout();
  if(document.getElementById("account"))renderAccount();
  if(document.getElementById("product"))renderProduct();
  if(document.getElementById("accgrid"))renderAccessories();
  if(document.getElementById("compareTool"))renderCompareTool();
  if(document.getElementById("tradein"))renderTradeIn();
  if(document.getElementById("support"))renderSupport();
  if(document.getElementById("contact"))renderContact();
  if(document.getElementById("about"))renderAbout();
  const so=document.getElementById("searchOverlay");if(so&&so.classList.contains("open"))renderSearch(document.getElementById("searchInput").value);
  renderCart();if(typeof initParallax==="function")initParallax();
}

/* ===== CART ===== */
let cart=JSON.parse(localStorage.getItem("zamon-cart")||"[]");
function saveCart(){localStorage.setItem("zamon-cart",JSON.stringify(cart));}
function openCart(){document.getElementById("drawer").classList.add("open");document.getElementById("overlay").classList.add("open");document.body.style.overflow="hidden";}
function closeCart(){document.getElementById("drawer").classList.remove("open");document.getElementById("overlay").classList.remove("open");document.body.style.overflow="";}
function addToCart(id,colorIdx=0,silent=false,price,fit,cfg){fit=fit||0;const cfgK=JSON.stringify(cfg||0);const ex=cart.find(c=>c.id===id&&c.color===colorIdx&&(c.price||0)===(price||0)&&(c.fit||0)===fit&&JSON.stringify(c.cfg||0)===cfgK);if(ex)ex.qty++;else cart.push({id,color:colorIdx,qty:1,price:price,fit:fit,cfg:cfg});saveCart();updateCount();renderCart();if(!silent)toast(t("added"));}
/* активный набор цветов с учётом выбранной модели (fitColors) */
function colsOf(p,fit){return (p.fitColors&&p.fitColors.models[fit||0])?p.fitColors.models[fit||0].colors:(p.buyColors||p.colors);}
/* активный набор цветов позиции корзины с учётом материала (watch) и модели (fitColors) */
function itemCols(p,c){const cfg=c.cfg||{};if(p.materials)return (p.materials[cfg.mi||0]||p.materials[0]).finishes;if(p.fitColors)return (p.fitColors.models[c.fit||0]||p.fitColors.models[0]).colors;return p.buyColors||p.colors;}
function colOf(p,c){const cs=itemCols(p,c);return cs[c.color]||cs[0];}
/* подпись варианта в корзине: цвет + выбранная модель/размер */
function cartSub(p,c){const b=[];const cfg=c.cfg||{};
  if(p.materials){const m=p.materials[cfg.mi||0]||p.materials[0];b.push(tr(m.n));}
  const cs=itemCols(p,c);if(cs.length>1)b.push(tr((cs[c.color]||cs[0]).n));
  if(p.variants){const v=p.variants[cfg.vi||0]||p.variants[0];b.push(tr(v.n));}
  if(p.storage){const st=p.storage[cfg.si||0]||p.storage[0];b.push(stLabel(st.gb));}
  if(p.bands){const bd=p.bands[cfg.bi||0]||p.bands[0];let bn=tr(bd.n);if(bd.colors&&bd.colors.length>1){const bc=bd.colors[cfg.bci||0]||bd.colors[0];bn+=" — "+tr(bc.n);}b.push(bn);}
  if(p.fitColors){const m=p.fitColors.models[c.fit||0]||p.fitColors.models[0];b.push(tr(m.n));}
  else if(p.fit&&p.fit.opts[c.fit||0])b.push(tr(p.fit.opts[c.fit||0]));
  return b.join(" · ");}
function updateCount(){const n=cart.reduce((s,c)=>s+c.qty,0);const el=document.getElementById("cartCount");if(!el)return;el.textContent=n;el.classList.toggle("show",n>0);}
function renderCartPage(){
  const box=document.getElementById("cartpage");if(!box)return;
  document.title="ZAMON — "+t("cart_title");
  if(!cart.length){box.innerHTML=`<div class="cp-empty"><div class="ec-ico">🛍️</div><h2>${t("cart_empty")}</h2><p>${t("cart_empty_sub")}</p><a class="btn btn-primary" href="index.html#catalog">${t("cp_continue")}</a></div>`;return;}
  const total=cartSum();
  const waCartMsg=tr({ru:"Здравствуйте! Хочу заказать:",tj:"Салом! Мехоҳам фармоиш диҳам:",en:"Hi! I'd like to order:"})+"\n"+cart.map(c=>{const p=P(c.id);return p?"• "+p.name+" × "+c.qty:"";}).filter(Boolean).join("\n")+"\n"+tr({ru:"Итого: ",tj:"Ҳамагӣ: ",en:"Total: "})+fmtPrice(total);
  box.innerHTML=`<div class="cp-head"><h1>${t("cart_title")}</h1><span>${cart.reduce((s,c)=>s+c.qty,0)} ${t("pieces")}</span></div>
   <div class="cp-grid"><div class="cp-items">${cart.map((c,i)=>{const p=P(c.id);if(!p)return"";const col=colOf(p,c);
     return `<div class="cp-item"><div class="cp-img"><img src="${p.card||col.disp||col.img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div>
       <div class="cp-info"><h3>${p.name}</h3>${cartSub(p,c)?`<div class="cp-sub">${cartSub(p,c)}</div>`:""}<div class="cp-unit">${fmtPrice(priceOf(c))}</div><button class="cp-rm" data-rm="${i}">${t("remove")}</button></div>
       <div class="cp-right"><div class="qty"><button data-dec="${i}">−</button><span>${c.qty}</span><button data-inc="${i}">+</button></div><div class="cp-price">${fmtPrice(priceOf(c)*c.qty)}</div></div></div>`;}).join("")}</div>
     <aside class="cp-sum"><h3>${t("cp_summary")}</h3>
       <div class="cp-row"><span>${t("cart_total")}</span><span>${fmtPrice(total)}</span></div>
       <div class="cp-ship">✓ <span>${t("ship_free")}</span></div>
       <div class="cp-grand"><span>${t("co_total")}</span><span>${fmtPrice(total)}</span></div>
       <button class="btn btn-primary" id="cpCheckout">${t("cart_checkout")}</button>
       <a class="btn btn-wa cp-wa" href="${waLink(waCartMsg)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.8.7.7-2.7-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5 0-.7-.3-1.4-.7-2-1.4-.4-.5-.7-1-.9-1.4-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.2.2-.4 0-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.7.7-.9 1.6-.6 2.6.3 1.1 1 2.1 1.2 2.4 1.7 2.5 3.6 3.3 4.8 3.6.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1l-.3-.2Z"/></svg> ${tr({ru:"Заказать в WhatsApp",tj:"Фармоиш дар WhatsApp",en:"Order on WhatsApp"})}</a>
       <a class="cp-cont" href="index.html">${t("cp_continue")} →</a></aside></div>`;
  box.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{cart[+b.dataset.inc].qty++;saveCart();updateCount();renderCart();});
  box.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const i=+b.dataset.dec;cart[i].qty--;if(cart[i].qty<=0)cart.splice(i,1);saveCart();updateCount();renderCart();});
  box.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.rm,1);saveCart();updateCount();renderCart();});
  const co=box.querySelector("#cpCheckout");if(co)co.onclick=openCheckout;
}
function renderCart(){
  renderCartPage();
  const box=document.getElementById("cartItems"),foot=document.getElementById("drawerFoot");if(!box)return;
  if(!cart.length){box.innerHTML=`<div class="empty-cart"><div class="ec-ico">🛍️</div><div style="font-weight:600;color:var(--text)">${t("cart_empty")}</div><div style="font-size:.85rem;margin-top:4px">${t("cart_empty_sub")}</div></div>`;foot.style.display="none";return;}
  foot.style.display="block";
  box.innerHTML=cart.map((c,i)=>{const p=P(c.id);if(!p)return"";const col=colOf(p,c);
    return `<div class="ci"><div class="ci-img"><img src="${p.card||col.disp||col.img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div>
      <div class="ci-info"><h4>${p.name}</h4>${cartSub(p,c)?`<div class="ci-sub">${cartSub(p,c)}</div>`:""}<div class="ci-price">${fmtPrice(priceOf(c))}</div>
        <button class="ci-rm" data-rm="${i}">${t("remove")}</button></div>
      <div class="qty"><button data-dec="${i}">−</button><span>${c.qty}</span><button data-inc="${i}">+</button></div></div>`;}).join("");
  const total=cartSum();
  document.getElementById("cartTotal").textContent=fmtPrice(total);
  document.getElementById("cartQtyTotal").textContent=cart.reduce((s,c)=>s+c.qty,0)+" "+t("pieces");
  document.getElementById("shipNote").innerHTML=`✓ <span>${t("ship_free")}</span>`;
  box.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{cart[+b.dataset.inc].qty++;saveCart();updateCount();renderCart();});
  box.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const i=+b.dataset.dec;cart[i].qty--;if(cart[i].qty<=0)cart.splice(i,1);saveCart();updateCount();renderCart();});
  box.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.rm,1);saveCart();updateCount();renderCart();});
}

/* ===== MODALS ===== */
function openModal(){document.getElementById("modalWrap").classList.add("open");document.body.style.overflow="hidden";}
function closeModal(){document.getElementById("modalWrap").classList.remove("open");document.body.style.overflow="";}

/* ===== SEARCH OVERLAY ===== */
const searchLink=p=>p.modelPage||("buy.html?id="+p.id);
function searchRow(p){return `<a class="search-row" href="${searchLink(p)}"><div class="sr-img"><img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div>
  <div class="sr-info"><h4>${p.name}</h4><span>${tr(p.tag)}</span></div><div class="sr-price">${t("from")}${num(p.price)} ${t("cur")}</div>
  <svg class="sr-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></a>`;}
function renderSearch(q){
  const box=document.getElementById("searchResults");if(!box)return;q=(q||"").trim().toLowerCase();
  if(!q){
    box.innerHTML=`<div class="search-sec"><div class="search-h">${t("search_quick")}</div>
      <div class="search-quick">${LINE_INFO.map(li=>`<a href="${li.page}">${li.name}</a>`).join("")}</div></div>
      <div class="search-sec"><div class="search-h">${t("search_sug")}</div>
      <div class="search-grid">${PRODUCTS.filter(p=>p.new).slice(0,4).map(searchRow).join("")}</div></div>`;
    return;
  }
  const res=PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||tr(p.tag).toLowerCase().includes(q)||(p.line||"").toLowerCase().includes(q));
  box.innerHTML=res.length?`<div class="search-grid">${res.map(searchRow).join("")}</div>`:`<div class="search-none">🔍 ${t("search_none")}</div>`;
}
function openSearch(){const o=document.getElementById("searchOverlay");if(!o)return;o.classList.add("open");document.body.style.overflow="hidden";
  const inp=document.getElementById("searchInput");inp.value="";renderSearch("");setTimeout(()=>inp.focus(),80);}
function closeSearch(){const o=document.getElementById("searchOverlay");if(!o)return;o.classList.remove("open");document.body.style.overflow="";}
function openBuy(id){
  const p=P(id);if(!p)return;
  /* сложная конфигурация (часы: ремешок/материал/размер; чехлы: модель iPhone) — открываем полный конфигуратор, а не упрощённое окно */
  if(p.cat==="watch"||p.fitColors||p.bands||p.materials){location.href="buy.html?id="+id;return;}
  let ci=0;const mi=document.getElementById("modalInner");
  const cols=p.buyColors||p.colors;let si=0;
  function render(){const col=cols[ci];const price=p.price+(p.storage?p.storage[si].add:0);mi.className="modal buy";
    mi.innerHTML=`<button class="close-x mclose" data-close>✕</button>
      <div class="buy-grid"><div class="buy-media ${p.darkMedia&&!p.buyColors?"dark":""}"><img src="${col.img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div>
      <div class="buy-info">${p.new?`<div class="bnew">NEW</div>`:""}<h3>${p.name}</h3><div class="bdesc">${tr(p.tag)}</div>
      ${cols.length>1?`<div class="blabel">${t("buy_color")} — <span>${tr(col.n)}</span></div><div class="color-opts">${cols.map((c,i)=>`<div class="color-opt ${i===ci?"active":""}" data-ci="${i}"><span class="cdot" style="background:${c.hex}"></span>${tr(c.n)}</div>`).join("")}</div>`:""}
      ${p.storage?`<div class="blabel">${t("cfg_storage")} — <span>${stLabel(p.storage[si].gb)}</span></div><div class="color-opts">${p.storage.map((st,i)=>`<div class="color-opt ${i===si?"active":""}" data-si="${i}"><b>${stLabel(st.gb)}</b></div>`).join("")}</div>`:""}
      <div class="buy-price">${fmtPrice(price)}</div>
      <div class="buy-perks"><div class="perk"><span class="pi">🚚</span>${t("buy_perk1")}</div><div class="perk"><span class="pi">🛡️</span>${t("buy_perk2")}</div><div class="perk"><span class="pi">↩️</span>${t("buy_perk3")}</div></div>
      <div class="buy-actions"><button class="btn btn-soft" id="buyAdd">${t("buy_add")}</button><button class="btn btn-primary" id="buyNow">${t("buy_now")}</button></div></div></div>`;
    mi.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeModal);
    mi.querySelectorAll("[data-ci]").forEach(o=>o.onclick=()=>{ci=+o.dataset.ci;render();});
    mi.querySelectorAll("[data-si]").forEach(o=>o.onclick=()=>{si=+o.dataset.si;render();});
    mi.querySelector("#buyAdd").onclick=()=>{addToCart(p.id,ci,false,price);closeModal();openCart();};
    mi.querySelector("#buyNow").onclick=()=>{addToCart(p.id,ci,true,price);closeModal();openCheckout();};
  }
  render();openModal();
}
function openInfo(key){
  const li=LI(key);if(!li)return;const mi=document.getElementById("modalInner");mi.className="modal info";
  mi.innerHTML=`<button class="close-x mclose" data-close>✕</button>
    <div class="info-media ${li.dark?"dark":""}"><img src="${li.img}" data-emoji="${li.emoji}" alt="${li.name}" onerror="imgFallback(this)"></div>
    <div class="info-body"><div class="inew">${tr(li.tagline)}</div><h3>${li.name}</h3><p class="isub">${tr(li.desc)}</p>
    <ul class="info-feats">${li.feats.map(f=>`<li><span class="fi">✓</span> ${tr(f)}</li>`).join("")}</ul>
    <div class="info-actions"><button class="btn btn-soft" data-close>${t("close")}</button><a class="btn btn-primary" href="${li.page}">${t("learn")}</a></div></div>`;
  mi.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeModal);openModal();
}
/* "Checkout" now routes to the multi-step page */
function openCheckout(){if(!cartSum()){toast(t("cart_empty"));return;}closeCart();location.href="checkout.html";}

/* ===== ORDERS (persisted) ===== */
let orders=JSON.parse(localStorage.getItem("zamon-orders")||"[]");
function saveOrders(){localStorage.setItem("zamon-orders",JSON.stringify(orders));}
function orderDate(ts){try{return new Date(ts).toLocaleDateString(LANG==="en"?"en-GB":"ru-RU",{day:"numeric",month:"long",year:"numeric"});}catch(e){return "";}}

/* ===== MULTI-STEP CHECKOUT (checkout.html) ===== */
let CK=null;
function buildOrderMsg(o){
  const lines=o.items.map(it=>{const p=P(it.id);if(!p)return"";const s=cartSub(p,it);return "• "+p.name+(s?" ("+s+")":"")+" × "+it.qty;}).filter(Boolean).join("\n");
  const dd=o.d;
  const deliv=dd.delivery==="courier"?(tr({ru:"Курьер",tj:"Курьер",en:"Courier"})+": "+dd.city+", "+dd.addr):tr({ru:"Самовывоз",tj:"Худбардорӣ",en:"Pickup"});
  return tr({ru:"🛒 НОВЫЙ ЗАКАЗ ZAMON",tj:"🛒 ФАРМОИШИ НАВ ZAMON",en:"🛒 NEW ZAMON ORDER"})+" №"+o.no+"\n\n"
    +"👤 "+dd.name+"\n📞 "+dd.phone+"\n🚚 "+deliv+"\n💳 "+dd.pay+"\n\n"
    +lines+"\n\n"+t("co_total")+": "+fmtPrice(o.total);
}
function renderCheckout(){
  const root=document.getElementById("checkout");if(!root)return;
  document.title="ZAMON — "+t("co_title");
  if(!CK)CK={done:false,order:null,d:{name:"",phone:"",city:"",addr:"",delivery:"courier",pay:t("co_pay1")}};
  if(CK.done&&CK.order){
    const o=CK.order;
    const wm=o.waMsg||buildOrderMsg(o);
    root.innerHTML=`<div class="ck-done"><div class="ok-ico">✓</div><h1>${t("co_ok_h")}</h1>
      <p class="ck-onum">${t("order_num")} <b>${o.no}</b></p>
      <p class="msub">${t("co_ok_p")}</p>
      <div class="ck-done-total"><span>${t("co_total")}</span><b>${fmtPrice(o.total)}</b></div>
      <p class="ck-done-contact msub">${tr({ru:"Есть вопрос по заказу? Напишите нам:",tj:"Оид ба фармоиш савол доред? Ба мо нависед:",en:"Questions about your order? Message us:"})}</p>
      <div class="ck-done-act">
        <a class="btn btn-wa ck-done-wa" href="${waLink(wm)}" target="_blank">WhatsApp</a>
        <a class="btn btn-soft ck-done-tg" href="${tgLink}" target="_blank">Telegram</a></div>
      <div class="ck-done-act ck-done-nav"><a class="btn btn-ghost" href="account.html">${t("ck_to_acc")}</a><a class="btn btn-ghost" href="index.html">${t("co_ok_btn")}</a></div></div>`;
    return;
  }
  if(!cart.length){root.innerHTML=`<div class="cp-empty"><div class="ec-ico">🛍️</div><h2>${t("cart_empty")}</h2><p>${t("cart_empty_sub")}</p><a class="btn btn-primary" href="index.html">${t("cp_continue")}</a></div>`;return;}
  const D=CK.d;
  const field=(k,lbl,ph,type,req)=>`<div class="field"><label>${lbl}${req?` <span class="req">*</span>`:""}</label><input data-f="${k}" type="${type||"text"}" value="${(D[k]||"").replace(/"/g,"&quot;")}" placeholder="${ph}"></div>`;
  const opt=(active,attr,name,sub)=>`<div class="cfg-opt ${active?"active":""}" ${attr}><div><div class="o-name">${name}</div>${sub?`<div class="o-sub">${sub}</div>`:""}</div></div>`;
  const courier=D.delivery==="courier";
  const body=`
    <div class="ck-q">${t("ck_contact")}</div>
    <div class="ck-fields">${field("name",t("co_name"),"Ahmad Rahimov",null,true)}${field("phone",t("co_phone"),"+992 90 000 00 00","tel",true)}</div>
    <div class="ck-q">${t("ck_method")}</div>
    ${opt(courier,`data-deliv="courier"`,t("ck_courier"),t("ck_courier_s"))}
    ${opt(!courier,`data-deliv="pickup"`,t("ck_pickup"),t("ck_pickup_s"))}
    ${courier?`<div class="ck-fields">${field("city",t("co_city"),t("region"),null,true)}${field("addr",t("ck_addr"),"ул. Рудаки 25, кв. 4",null,true)}</div>`:""}
    <div class="ck-q">${t("co_pay")}</div>
    ${opt(D.pay===t("co_pay1"),`data-pay="${t("co_pay1")}"`,t("co_pay1"),tr({ru:"Наличными при получении",tj:"Нақд ҳангоми гирифтан",en:"Cash on delivery"}))}
    ${opt(D.pay===t("co_pay2"),`data-pay="${t("co_pay2")}"`,t("co_pay2"),tr({ru:"Картой при получении",tj:"Корт ҳангоми гирифтан",en:"Card on delivery"}))}`;
  const total=cartSum();
  root.innerHTML=`<div class="ck-head"><h1>${t("co_title")}</h1><a class="ck-cancel" href="cart.html">${t("ck_back")} →</a></div>
    <p class="ck-intro msub">${t("co_sub")}</p>
    <div class="ck-grid"><div class="ck-main">${body}
      <div class="ck-nav"><a class="btn btn-soft" href="cart.html">${t("ck_back")}</a>
        <button class="btn btn-primary" id="ckNext">${t("ck_place")}</button></div></div>
      <aside class="ck-sum"><h3>${t("cp_summary")}</h3>
        ${cart.map(c=>{const p=P(c.id);if(!p)return"";const col=colOf(p,c);return `<div class="ck-sli"><div class="ck-sli-img"><img src="${p.card||col.disp||col.img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div><div class="ck-sli-i"><span>${p.name}</span><small>${cartSub(p,c)?cartSub(p,c)+" · ":""}${c.qty} ${t("pieces")}</small></div><b>${fmtPrice(priceOf(c)*c.qty)}</b></div>`;}).join("")}
        <div class="ck-ship">✓ <span>${t("ship_free")}</span></div>
        <div class="cp-grand"><span>${t("co_total")}</span><span>${fmtPrice(total)}</span></div></aside></div>`;
  root.querySelectorAll("[data-f]").forEach(i=>i.oninput=()=>{D[i.dataset.f]=i.value;});
  root.querySelectorAll("[data-deliv]").forEach(o=>o.onclick=()=>{D.delivery=o.dataset.deliv;renderCheckout();});
  root.querySelectorAll("[data-pay]").forEach(o=>o.onclick=()=>{D.pay=o.dataset.pay;renderCheckout();});
  root.querySelector("#ckNext").onclick=()=>{
    if(!D.name||!D.phone){toast(tr({ru:"Укажите имя и телефон",tj:"Ном ва телефонро нависед",en:"Enter name and phone"}));return;}
    if(courier&&(!D.city||!D.addr)){toast(tr({ru:"Укажите город и адрес доставки",tj:"Шаҳр ва суроғаро нависед",en:"Enter city and delivery address"}));return;}
    const o={no:"Z"+Date.now().toString().slice(-7),ts:Date.now(),items:cart.map(c=>({id:c.id,color:c.color,qty:c.qty,price:priceOf(c),fit:c.fit||0,cfg:c.cfg})),total:cartSum(),d:Object.assign({},D)};
    o.waMsg=buildOrderMsg(o);
    notifyShop(o);
    orders.unshift(o);saveOrders();cart=[];saveCart();updateCount();renderCart();
    CK.done=true;CK.order=o;
    renderCheckout();window.scrollTo(0,0);
  };
}

/* ===== ACCOUNT / AUTH ===== */
let user=JSON.parse(localStorage.getItem("zamon-user")||"null");
function saveUser(){user?localStorage.setItem("zamon-user",JSON.stringify(user)):localStorage.removeItem("zamon-user");}
function emptyBlock(ico,txt){return `<div class="cp-empty"><div class="ec-ico">${ico}</div><p>${txt}</p><a class="btn btn-primary" href="index.html#catalog">${t("cp_continue")}</a></div>`;}
let ACCTAB="orders",AUTHMODE="login";
function renderAccount(){
  const root=document.getElementById("account");if(!root)return;
  document.title="ZAMON — "+t("acc_title");
  if(!user){renderAuth(root);return;}
  const tabs=[["profile","acc_profile"],["orders","acc_orders"],["wish","acc_wish"]];
  let content="";
  if(ACCTAB==="profile"){
    content=`<div class="acc-profile"><div class="acc-avatar">${(user.name||"U").charAt(0).toUpperCase()}</div>
      <div class="acc-pinfo"><h3>${user.name}</h3><p>${user.email}</p><span class="acc-badge">${t("acc_member")}</span></div></div>
      <button class="btn btn-soft" id="accLogout">${t("acc_logout")}</button>`;
  }else if(ACCTAB==="orders"){
    content=orders.length?`<div class="acc-orders">${orders.map(o=>`<div class="acc-order"><div class="ao-head"><div><b>${t("order_num")} ${o.no}</b><span>${orderDate(o.ts)}</span></div><span class="ao-status">${t("acc_status")}</span></div>
      <div class="ao-items">${o.items.map(it=>{const p=P(it.id);return p?`<div class="ao-img" title="${p.name} × ${it.qty}"><img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div>`:"";}).join("")}</div>
      <div class="ao-foot"><span>${o.items.reduce((s,i)=>s+i.qty,0)} ${t("pieces")}</span><b>${fmtPrice(o.total)}</b></div></div>`).join("")}</div>`
      :emptyBlock("📦",t("acc_no_orders"));
  }else{
    const items=wishlist.map(id=>P(id)).filter(Boolean);
    content=items.length?`<div class="buy-grid-cards">${items.map(p=>`<div class="bgcard" data-id="${p.id}"><button class="wish-btn on" data-wish="${p.id}" aria-label="${t("acc_wish")}">♥</button><div class="bg-media"><img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div><h3>${p.name}</h3><div class="bg-sw"></div><div class="bg-price">${t("from")}${num(p.price)} ${t("cur")}</div><button class="add" data-buy="${p.id}">${t("pp_buy")}</button></div>`).join("")}</div>`
      :emptyBlock("🤍",t("acc_no_wish"));
  }
  root.innerHTML=`<div class="acc-head"><h1>${t("acc_title")}</h1><span>${user.name}</span></div>
    <div class="acc-tabs">${tabs.map(([k,lbl])=>`<button class="acc-tab ${k===ACCTAB?"active":""}" data-tab="${k}">${t(lbl)}</button>`).join("")}</div>
    <div class="acc-content">${content}</div>`;
  root.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{ACCTAB=b.dataset.tab;renderAccount();});
  const lo=root.querySelector("#accLogout");if(lo)lo.onclick=()=>{user=null;saveUser();ACCTAB="orders";renderAccount();};
}
function renderAuth(root){
  const reg=AUTHMODE==="register";
  root.innerHTML=`<div class="auth-card"><div class="auth-tabs"><button class="${!reg?"active":""}" data-am="login">${t("acc_login")}</button><button class="${reg?"active":""}" data-am="register">${t("acc_register")}</button></div>
    <h2>${reg?t("acc_register"):t("acc_welcome")}</h2><p class="msub">${reg?t("acc_reg_sub"):t("acc_login_sub")}</p>
    <form id="authForm">${reg?`<div class="field"><label>${t("acc_name")}</label><input id="auName" required type="text" placeholder="Ahmad Rahimov"></div>`:""}
      <div class="field"><label>${t("acc_email")}</label><input id="auEmail" required type="email" placeholder="mail@example.com"></div>
      <div class="field"><label>${t("acc_pass")}</label><input id="auPass" required type="password" placeholder="••••••••"></div>
      <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">${reg?t("acc_signup"):t("acc_signin")}</button></form>
    <button class="auth-switch" data-am="${reg?"login":"register"}">${reg?t("acc_to_login"):t("acc_to_reg")}</button></div>`;
  root.querySelectorAll("[data-am]").forEach(b=>b.onclick=()=>{AUTHMODE=b.dataset.am;renderAuth(root);});
  root.querySelector("#authForm").onsubmit=e=>{e.preventDefault();
    const email=root.querySelector("#auEmail").value;const nm=reg?root.querySelector("#auName").value:(email.split("@")[0]||"User");
    user={name:nm.charAt(0).toUpperCase()+nm.slice(1),email};saveUser();ACCTAB="orders";renderAccount();};
}
/* ===== WISHLIST ===== */
let wishlist=JSON.parse(localStorage.getItem("zamon-wishlist")||"[]");
function saveWish(){localStorage.setItem("zamon-wishlist",JSON.stringify(wishlist));}
const inWish=id=>wishlist.includes(id);
function toggleWish(id){const i=wishlist.indexOf(id);if(i<0){wishlist.push(id);toast(t("wished"));}else{wishlist.splice(i,1);toast(t("unwished"));}
  saveWish();const on=inWish(id);document.querySelectorAll(`[data-wish="${id}"]`).forEach(b=>{b.classList.toggle("on",on);if(on){b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop");}});
  if(document.getElementById("account"))renderAccount();}

/* ===== TOAST ===== */
let toastT;
function toast(msg){const el=document.getElementById("toast");if(!el)return;el.innerHTML="✓ "+msg;el.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove("show"),2400);}

/* ===== CAROUSEL ===== */
let lastDragEnd=0;
function initCarousel(root,dotsEl){
  const viewport=root.querySelector(".car-viewport"),track=root.querySelector(".car-track");
  const prev=root.querySelector(".prev"),next=root.querySelector(".next");const cards=track.children;if(!cards.length)return;
  let index=0;const GAP=18;
  const cardW=()=>cards[0].getBoundingClientRect().width+GAP;
  const perView=()=>Math.max(1,Math.floor((viewport.clientWidth+GAP)/cardW()));
  const pages=()=>Math.max(1,Math.ceil(cards.length/perView()));
  const maxShift=()=>Math.max(0,track.scrollWidth-viewport.clientWidth);
  const shiftFor=i=>Math.min(i*perView()*cardW(),maxShift());
  function apply(anim=true){index=Math.max(0,Math.min(index,pages()-1));track.style.transition=anim?"":"none";track.style.transform=`translateX(${-shiftFor(index)}px)`;if(!anim)requestAnimationFrame(()=>track.style.transition="");
    if(dotsEl)dotsEl.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active",i===index));
    const multi=pages()>1;
    if(prev){prev.style.display=multi?"":"none";prev.classList.toggle("disabled",index<=0);}
    if(next){next.style.display=multi?"":"none";next.classList.toggle("disabled",index>=pages()-1);}}
  function buildDots(){if(!dotsEl)return;const n=pages();if(n<=1){dotsEl.innerHTML="";return;}dotsEl.innerHTML=Array.from({length:n},(_,i)=>`<span class="dot ${i===0?"active":""}" data-p="${i}"></span>`).join("");dotsEl.querySelectorAll(".dot").forEach(d=>d.onclick=()=>{index=+d.dataset.p;apply();});}
  if(prev)prev.onclick=()=>{index--;apply();};if(next)next.onclick=()=>{index++;apply();};
  let down=false,startX=0,base=0,moved=0;
  track.addEventListener("pointerdown",e=>{down=true;moved=0;startX=e.clientX;base=shiftFor(index);track.classList.add("dragging");});
  window.addEventListener("pointermove",e=>{if(!down)return;moved=e.clientX-startX;track.style.transform=`translateX(${-(base-moved)}px)`;});
  window.addEventListener("pointerup",()=>{if(!down)return;down=false;track.classList.remove("dragging");if(Math.abs(moved)>8)lastDragEnd=performance.now();if(moved<-50)index++;else if(moved>50)index--;apply();});
  buildDots();apply(false);let rz;window.addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(()=>{buildDots();apply(false);},150);});
}

/* ===== SWATCHES (cards) ===== */
function swatchHtml(p,cls,force){if(p.colors.length<2||(p.card&&!force))return "";return `<div class="${cls}">`+p.colors.map((c,i)=>`<span class="sw ${c.sw?"sw-img":""} ${i===0?"active":""}" data-sw="${p.id}" data-idx="${i}" title="${tr(c.n)}" style="${c.sw?`background-image:url('${shrinkCDN(c.sw,90)}')`:`background:${c.hex}`}"></span>`).join("")+`</div>`;}

/* ===== RENDER: lineup ===== */
function renderLineup(){
  const track=document.getElementById("lineupTrack");if(!track)return;
  const cat=track.getAttribute("data-cat")||"phone";
  track.innerHTML=PRODUCTS.filter(p=>p.cat===cat).map(p=>`<div class="lcard" data-id="${p.id}">
    <div class="lc-media"${p.tint?` style="background:${p.tint}"`:""}>${p.new?`<div class="lc-badge">NEW</div>`:""}<img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div>
    <div class="lc-body">${swatchHtml(p,"lc-sw",true)}<h3>${p.name}</h3><div class="lc-desc">${tr(p.tag)}</div>
    <div class="lc-price"><b>${t("from")}${num(p.price)} ${t("cur")}</b></div></div></div>`).join("");
  const car=track.closest(".carousel");initCarousel(car,document.getElementById(car.dataset.dots||"lineupDots"));
}

/* ===== RENDER: showcase ===== */
function showcaseTile(li,full){return `<div class="promo reveal ${li.dark?"dark":""} ${full?"full":""}" data-page="${li.page}" style="background:${li.grad}">
  <div>${li.new?`<div class="pnew">NEW</div>`:""}<h3>${li.name}</h3><div class="pt">${tr(li.tagline)}</div></div>
  <div class="promo-btns"><a class="btn-pill" href="${li.page}">${t("learn")}</a><a class="btn-pill ghost" href="${li.buyPage||li.page}">${t("add")}</a></div>
  <img class="pimg" data-emoji="${li.emoji}" src="${li.img}" alt="${li.name}" loading="lazy" onerror="imgFallback(this)"></div>`;}
const STOREBAR=[
 {name:"Mac",page:"mac.html",img:WG("store-card-13-mac-nav-202603")},
 {name:"iPhone",page:"iphone.html",img:WG("store-card-13-iphone-nav-202509")},
 {name:"iPad",page:"ipad.html",img:WG("store-card-13-ipad-nav-202405")},
 {name:"Apple Watch",page:"watch.html",img:WG("store-card-13-watch-nav-202509")},
 {name:"AirPods",page:"airpods.html",img:WG("store-card-13-airpods-nav-202509")},
 {name:{ru:"Аксессуары",tj:"Лавозимот",en:"Accessories"},page:"accessories.html",img:WG("store-card-13-accessories-nav-202603")}
];
function renderStoreBar(){
  const box=document.getElementById("storebar");if(!box)return;
  box.innerHTML=`<div class="storebar-row">`+STOREBAR.map(s=>{const nm=typeof s.name==="string"?s.name:tr(s.name);return `<a class="sb-item" href="${s.page}"><div class="sb-ic"><img src="${shrinkCDN(s.img,260)}" alt="${nm}" loading="lazy" decoding="async" onerror="imgFallback(this)"></div><span>${nm}</span></a>`;}).join("")+`</div>`;
}
/* ===== Apple chapternav-style lineup row (all models of a category) ===== */
function lineupRow(cat){
  const items=PRODUCTS.filter(p=>p.cat===cat);
  return `<div class="lineup-wrap">
    <button class="lr-arrow prev" aria-label="prev" hidden>${ARROW_L}</button>
    <div class="lineup-row">${items.map(p=>`<a class="lr-item reveal" href="${productUrl(p)}">
    <div class="lr-media"${p.tint?` style="background:${p.tint}"`:""}>${p.new?`<span class="lr-new">NEW</span>`:""}<img src="${shrinkCDN(p.lineImg||mainImg(p),460)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" decoding="async" onerror="imgFallback(this)"></div>
    <div class="lr-name">${p.name}</div>
    <div class="lr-from">${t("from")}${num(p.price)} ${t("cur")}</div>
    <div class="lr-cod">✓ ${t("c_cod")}</div>
    <span class="lr-cta">${t("learn")} ${ARROW_R}</span></a>`).join("")}</div>
    <button class="lr-arrow next" aria-label="next">${ARROW_R}</button>
  </div>`;
}
function initLineupNav(){
  document.querySelectorAll(".lineup-wrap").forEach(wrap=>{
    const row=wrap.querySelector(".lineup-row"),prev=wrap.querySelector(".lr-arrow.prev"),next=wrap.querySelector(".lr-arrow.next");
    if(!row||!prev||!next)return;
    const upd=()=>{const max=row.scrollWidth-row.clientWidth-2,noov=row.scrollWidth<=row.clientWidth+2;
      wrap.classList.toggle("no-overflow",noov);
      prev.hidden=noov||row.scrollLeft<=2;next.hidden=noov||row.scrollLeft>=max;};
    const step=()=>Math.max(200,row.clientWidth*0.8);
    next.onclick=()=>row.scrollBy({left:step(),behavior:"smooth"});
    prev.onclick=()=>row.scrollBy({left:-step(),behavior:"smooth"});
    row.addEventListener("scroll",()=>requestAnimationFrame(upd),{passive:true});
    addEventListener("resize",upd);
    setTimeout(upd,300);upd();
  });
}
function scLineup(cat,title){const sub=tr({ru:"Выберите свою модель.",tj:"Модели худро интихоб кунед.",en:"Choose the one that's right for you."});
  return `<div class="sc-lineup"><div class="sc-lineup-head reveal"><h3 class="lr-title">${title}</h3><p class="sec-sub">${sub}</p></div>${lineupRow(cat)}</div>`;}
/* ===== FAQ (local SEO + FAQPage schema) ===== */
const FAQS=[
 {q:{ru:"Где купить iPhone в Душанбе?",tj:"iPhone-ро дар Душанбе аз куҷо харидан мумкин аст?",en:"Where to buy an iPhone in Dushanbe?"},
  a:{ru:"В магазине ZAMON — оригинальные iPhone всех моделей с быстрой доставкой по Душанбе. Оформить заказ можно прямо на сайте, в WhatsApp или Telegram, с оплатой при получении.",tj:"Дар мағозаи ZAMON — iPhone-ҳои аслии ҳама моделҳо бо расонидани зуд дар Душанбе. Фармоишро дар сайт, WhatsApp ё Telegram бо пардохт ҳангоми гирифтан додан мумкин аст.",en:"At ZAMON — original iPhones of every model with fast delivery across Dushanbe. Order on the site, WhatsApp or Telegram, pay on delivery."}},
 {q:{ru:"Техника оригинальная? Есть гарантия?",tj:"Молҳо аслӣ ҳастанд? Кафолат ҳаст?",en:"Is the tech genuine? Is there a warranty?"},
  a:{ru:"Да. В ZAMON только оригинальная техника Apple с официальной гарантией. На каждое устройство распространяется гарантия и сервисная поддержка.",tj:"Бале. Дар ZAMON танҳо техникаи аслии Apple бо кафолати расмӣ. Ба ҳар дастгоҳ кафолат ва дастгирии хизматрасонӣ дода мешавад.",en:"Yes. ZAMON sells only genuine Apple products with official warranty and service support on every device."}},
 {q:{ru:"Как работает доставка по Душанбе?",tj:"Расонидан дар Душанбе чӣ тавр кор мекунад?",en:"How does delivery across Dushanbe work?"},
  a:{ru:"Курьером по всему Душанбе — часто в день заказа. Стоимость зависит от района, по городу бесплатно от 500 сомони.",tj:"Бо курьер дар тамоми Душанбе — аксаран дар рӯзи фармоиш. Нарх аз ноҳия вобаста аст, дар шаҳр аз 500 сомонӣ ройгон.",en:"By courier across Dushanbe — often same day. Cost depends on the district; free in the city from 500 somoni."}},
 {q:{ru:"Какие способы оплаты?",tj:"Тарзҳои пардохт кадомҳоянд?",en:"What payment methods are available?"},
  a:{ru:"Наличными или картой при получении — вы платите только после того, как получили заказ на руки.",tj:"Нақд ё бо корт ҳангоми гирифтан — шумо танҳо пас аз ба даст гирифтани фармоиш пардохт мекунед.",en:"Cash or card on delivery — you pay only after the order is in your hands."}},
 {q:{ru:"Можно проверить устройство перед оплатой?",tj:"Дастгоҳро пеш аз пардохт санҷидан мумкин аст?",en:"Can I check the device before paying?"},
  a:{ru:"Да. При доставке вы спокойно осматриваете и проверяете устройство, и оплачиваете только после этого — оплата при получении.",tj:"Бале. Ҳангоми расонидан шумо дастгоҳро бемалол бинед ва месанҷед, ва танҳо пас аз он пардохт мекунед — пардохт ҳангоми гирифтан.",en:"Yes. On delivery you can calmly inspect and test the device, and pay only afterwards — payment on delivery."}},
 {q:{ru:"Как сделать заказ в ZAMON?",tj:"Дар ZAMON чӣ тавр фармоиш додан мумкин аст?",en:"How do I place an order at ZAMON?"},
  a:{ru:"Добавьте товар в корзину и оформите заказ на сайте, либо напишите нам в WhatsApp (+992 98 222 76 35) или Telegram (@vensurel) — поможем с выбором и доставкой.",tj:"Молро ба сабад илова кунед ва дар сайт фармоиш диҳед, ё ба мо дар WhatsApp (+992 98 222 76 35) ё Telegram (@vensurel) нависед — дар интихоб ва расонидан кӯмак мекунем.",en:"Add an item to the cart and check out on the site, or message us on WhatsApp (+992 98 222 76 35) or Telegram (@vensurel) — we'll help with the choice and delivery."}}
];
/* ===== GUARANTEES (risk-reversal, trust) ===== */
const GUARANTEES=[
 {ic:"💳",h:{ru:"Оплата при получении",tj:"Пардохт ҳангоми гирифтан",en:"Pay on delivery"},p:{ru:"Платите наличными или картой, только когда заказ у вас в руках.",tj:"Нақд ё бо корт танҳо вақте фармоиш дар дасти шумост.",en:"Pay by cash or card only when the order is in your hands."}},
 {ic:"🔍",h:{ru:"Проверка перед оплатой",tj:"Санҷиш пеш аз пардохт",en:"Inspect before paying"},p:{ru:"Осмотрите и протестируйте устройство до оплаты.",tj:"Дастгоҳро пеш аз пардохт бинед ва санҷед.",en:"Check and test the device before you pay."}},
 {ic:"↩️",h:{ru:"Возврат 14 дней",tj:"Бозгашти 14 рӯз",en:"14-day returns"},p:{ru:"Не подошло — вернём деньги в течение 14 дней.",tj:"Мувофиқ нашуд — дар 14 рӯз пулро бармегардонем.",en:"Changed your mind? Refund within 14 days."}},
 {ic:"✅",h:{ru:"100% оригинал",tj:"100% аслӣ",en:"100% genuine"},p:{ru:"Только официальная техника Apple с гарантией 1 год.",tj:"Танҳо техникаи расмии Apple бо кафолати 1 сол.",en:"Only official Apple products with a 1-year warranty."}}
];
function guaranteesHTML(){return `<div class="guarantees">`+GUARANTEES.map(g=>`<div class="grt reveal"><div class="grt-ic">${g.ic}</div><div class="grt-t"><div class="grt-h">${tr(g.h)}</div><div class="grt-p">${tr(g.p)}</div></div></div>`).join("")+`</div>`;}
function trustRowHTML(){return `<div class="trust-row">`+GUARANTEES.map(g=>`<span class="trust-i">${g.ic} ${tr(g.h)}</span>`).join("")+`</div>`;}
function renderGuarantees(){const box=document.getElementById("guarantees");if(!box)return;box.innerHTML=`<div class="sec-head reveal"><span class="sec-tag">${tr({ru:"Покупайте без риска",tj:"Бе хавф харидед",en:"Shop with no risk"})}</span><h2>${tr({ru:"Почему с нами спокойно",tj:"Чаро бо мо бехатар аст",en:"Why buying with us is safe"})}</h2></div>`+guaranteesHTML();}
function renderFAQ(){
  const box=document.getElementById("faqBox");if(!box)return;
  box.innerHTML=FAQS.map((f,i)=>`<details class="hfaq-item"${i===0?" open":""}><summary>${tr(f.q)}<span class="hfaq-ic">+</span></summary><div class="hfaq-a">${tr(f.a)}</div></details>`).join("");
  try{setLD("faq",{"@context":"https://schema.org","@type":"FAQPage","mainEntity":FAQS.map(f=>({"@type":"Question","name":tr(f.q),"acceptedAnswer":{"@type":"Answer","text":tr(f.a)}}))});}catch(e){}
}
function renderShowcase(){const box=document.getElementById("showcaseBox");if(!box)return;
  box.innerHTML=scLineup("phone","iPhone")+scLineup("laptop","Mac")+scLineup("tablet","iPad")+scLineup("watch","Apple Watch")+scLineup("audio","AirPods");
  observeReveal();initLineupNav();}
/* авто-прокручиваемая лента иконок аксессуаров на главной (под AirPods) */
function renderAccMarquee(){
  const box=document.getElementById("accMarqueeSec");if(!box)return;
  const items=PRODUCTS.filter(p=>p.cat==="acc");
  const cell=p=>`<a class="acc-mq-item" href="product.html?id=${p.id}"><div class="acc-mq-ic"><img src="${shrinkCDN(mainImg(p),320)}" alt="${p.name}" loading="lazy" decoding="async" onerror="imgFallback(this)"></div><span class="acc-mq-n">${p.name}</span></a>`;
  const row=items.map(cell).join("");
  box.innerHTML=`<div class="wrap"><div class="sec-head reveal"><span class="sec-tag">${tr({ru:"Аксессуары",tj:"Лавозимот",en:"Accessories"})}</span><h2>${tr({ru:"Дополните вашу технику Apple",tj:"Техникаи Apple-и худро пурра кунед",en:"Complete your Apple setup"})}</h2></div></div>
    <div class="acc-marquee"><div class="acc-mq-track">${row}${row}</div></div>
    <div class="wrap acc-mq-cta"><a href="accessories.html" class="btn btn-ghost">${tr({ru:"Все аксессуары",tj:"Ҳамаи лавозимот",en:"All accessories"})} →</a></div>`;
}

/* ===== RENDER: catalog ===== */
let currentFilter="all",currentSearch="";
const ORDER=[["phone","iPhone"],["laptop","Mac"],["tablet","iPad"],["watch","Apple Watch"],["audio","AirPods"]];
function cardHtml(p){return `<div class="pcard" data-id="${p.id}"><div class="badge-top">${p.new?"NEW":""}</div>
  <button class="wish-btn ${inWish(p.id)?"on":""}" data-wish="${p.id}" aria-label="${t("acc_wish")}">♥</button>
  <div class="media"${p.tint?` style="background:${p.tint}"`:""}><img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div>
  ${swatchHtml(p,"p-sw")}<h3>${p.name}</h3><div class="ptag">${tr(p.tag)}</div>
  <div class="p-price">${t("from")}${num(p.price)} ${t("cur")}${p.old?`<span class="old">${num(p.old)}</span>`:""}</div>
  <div class="p-actions"><button class="add" data-add="${p.id}">${t("add")}</button><button class="more" data-buy="${p.id}">${t("details")}</button></div></div>`;}
/* карточка аксессуара в стиле Apple: фото + свотчи + имя + цена, вся карточка — ссылка (без кнопок) */
function accCardHtml(p){
  const sw=p.colors.length>1?`<div class="acard-sw">${p.colors.slice(0,7).map(c=>`<span class="asw ${c.sw?"asw-img":""}" title="${tr(c.n)}" style="${c.sw?`background-image:url('${shrinkCDN(c.sw,80)}')`:`background:${c.hex}`}"></span>`).join("")}${p.colors.length>7?`<span class="asw-more">+${p.colors.length-7}</span>`:""}</div>`:`<div class="acard-sw"></div>`;
  return `<a class="acard reveal" href="product.html?id=${p.id}">${p.new?`<span class="acard-new">NEW</span>`:""}
    <div class="acard-media"><img src="${shrinkCDN(mainImg(p),520)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" decoding="async" onerror="imgFallback(this)"></div>
    ${sw}<h3 class="acard-name">${p.name}</h3>
    <div class="acard-price">${t("from")}${num(p.price)} ${t("cur")}</div></a>`;
}
function renderCatalog(){
  const box=document.getElementById("catalog");if(!box)return;
  const only=box.getAttribute("data-cat");const q=currentSearch.toLowerCase();
  const cats=ORDER.filter(([f])=>only?f===only:(currentFilter==="all"||currentFilter===f));
  let html="";
  cats.forEach(([f,title])=>{let items=PRODUCTS.filter(p=>p.cat===f);if(q)items=items.filter(p=>p.name.toLowerCase().includes(q)||tr(p.tag).toLowerCase().includes(q));if(!items.length)return;
    const cid="cb_"+f;html+=`<div class="cat-block"><div class="cb-head"><h3>${title}</h3></div><div class="carousel" id="${cid}">
      <button class="car-arrow prev"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>
      <div class="car-viewport"><div class="car-track">${items.map(cardHtml).join("")}</div></div>
      <button class="car-arrow next"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button></div><div class="car-dots" id="${cid}_dots"></div></div>`;});
  if(!html){box.innerHTML=`<div class="empty-grid">🔍 ${tr({ru:"Ничего не найдено",tj:"Чизе ёфт нашуд",en:"Nothing found"})}</div>`;return;}
  box.innerHTML=html;cats.forEach(([f])=>{const c=document.getElementById("cb_"+f);if(c)initCarousel(c,document.getElementById("cb_"+f+"_dots"));});
  observeReveal();
}

/* ===== RENDER: buy grid (All models. Take your pick.) ===== */
function renderBuyGrid(){
  const box=document.getElementById("buygrid");if(!box)return;
  const items=PRODUCTS.filter(p=>p.cat===(box.dataset.cat||"phone"));
  box.innerHTML=`<div class="sec-head reveal"><h2>${tr({ru:"Все модели. Выбирайте.",tj:"Ҳама моделҳо. Интихоб кунед.",en:"All models. Take your pick."})}</h2></div>
   <div class="buy-grid-cards">`+items.map(p=>{const cols=p.buyColors||p.colors;
    return `<div class="bgcard" data-id="${p.id}">${p.new?`<div class="bg-new">NEW</div>`:""}
      <div class="bg-media"><img src="${cols[0].disp||cols[0].img}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div>
      <h3>${p.name}</h3>
      ${cols.length>1?`<div class="bg-sw">${cols.map((c,i)=>`<span class="sw ${i===0?"active":""}" data-bsw="${p.id}" data-idx="${i}" title="${tr(c.n)}" style="background:${c.hex}"></span>`).join("")}</div>`:`<div class="bg-sw"></div>`}
      <div class="bg-price">${t("from")}${num(p.price)} ${t("cur")}</div>
      <div class="bg-trust"><span class="bg-tag">✓ ${t("c_cod")}</span><span class="bg-tag">✓ ${t("c_warr")}</span></div>
      <button class="add" data-buy="${p.id}">${t("pp_buy")}</button></div>`;
  }).join("")+`</div>`;
  observeReveal();initTilt(".bgcard");
}

/* ===== RENDER: product-page hero (from LINE_INFO via #phero[data-line]) ===== */
function renderProductHero(){
  const el=document.getElementById("phero");if(!el)return;
  const li=LI(el.dataset.line);if(!li)return;
  const firstId=(PRODUCTS.find(p=>p.cat===li.cat)||{}).id||1;
  el.className="phero "+(li.dark?"dark":"light")+(li.noHeroMedia?" phero-compact":"");
  const media=li.noHeroMedia?""
    :li.heroVideo
    ? `<video class="phero-img phero-video" autoplay muted loop playsinline preload="auto" aria-label="${li.name}"><source src="${li.heroVideo}" type="video/mp4"></video>`
    : `<img class="phero-img ${li.heroImg?"phero-wide":""}" data-emoji="${li.emoji}" src="${li.heroImg||li.img}" alt="${li.name}" onerror="imgFallback(this)">`;
  el.innerHTML=`${li.new?`<div class="pe">NEW</div>`:""}<h1>${li.name}</h1><p class="psub">${tr(li.tagline)}</p>
    <p class="pprice">${tr(li.desc)}</p>
    <div class="phero-cta"><a class="btn btn-primary lg" href="${li.buyPage||('buy.html?id='+firstId)}">${t("pp_buy")}</a><a class="btn btn-ghost lg" href="#lineup">${t("details")} →</a></div>
    ${media}`;
}

/* ===== RENDER: full configurator (buy.html?id=) ===== */
let CFG=null;
function renderConfigurator(){
  const root=document.getElementById("cfg");if(!root)return;
  if(!CFG){
    const id=+(new URLSearchParams(location.search).get("id")||1);
    CFG={pid:(P(id)?id:PRODUCTS[0].id),ci:0,si:0,vi:0,bi:0,bci:0,mi:0,gi:0,fi:0,focus:"case",care:false,trade:false,pay:"inst"};
  }
  const p=P(CFG.pid)||PRODUCTS[0];
  const mats=p.materials;
  const curCols=()=>mats?mats[CFG.mi].finishes:(p.fitColors?p.fitColors.models[CFG.fi].colors:(p.buyColors||p.colors));
  const cat=p.cat;
  const li=LIcat(cat)||{};
  const hl=((PAGEDATA[li.key]||{}).highlights||[]).map(h=>h.img);
  const siblings=PRODUCTS.filter(s=>s.cat===cat);

  function gallery(){
    const cols=curCols();const col=cols[CFG.ci];
    // per-colour gallery (accessory: main + AV angles) wins; else recoloured main + product angles
    if(col.gal&&col.gal.length)return col.gal.filter(Boolean).slice(0,8);
    const angles=p.gallery||[];
    // шаг «Ремешок»: главным — фото часов с выбранным ремешком в его цвете (как Apple Watch Studio)
    if(CFG.focus==="band"&&p.bands){
      const bd=p.bands[CFG.bi];const bc=bd&&bd.colors&&bd.colors[CFG.bci||0];
      const pics=[];
      const combo=watchCombo(p,bd,bc,CFG.ci,col);       // композит «часы+ремешок» наложением слоёв
      if(combo)pics.push(shrinkCDN(combo,760));
      else pics.push(col.img);                          // фолбэк: собранный корпус в финише
      if(bc&&bc.img)pics.push(bc.img);                  // деталь: ремешок крупно
      if(p.bandImgs&&p.bandImgs.length)pics.push(...p.bandImgs);
      pics.push(col.img);
      return pics.concat(angles).filter(Boolean).slice(0,6);
    }
    // шаг «Корпус/финиш»: «живые» часы в выбранном финише (ремешок+корпус+циферблат) + ракурсы корпуса
    return [(col.disp?shrinkCDN(col.disp,760):col.img)].concat(angles).filter(Boolean).slice(0,5);
  }
  function calc(){
    let dev=p.price;
    if(mats)dev+=mats[CFG.mi].add;
    if(p.variants)dev+=p.variants[CFG.vi].add;
    if(p.storage)dev+=p.storage[CFG.si].add;
    if(p.bands)dev+=p.bands[CFG.bi].add;
    const careAdd=CFG.care?(CARE[cat]||0):0;
    const tradeVal=CFG.trade?(TRADEIN[cat]||0):0;
    const total=Math.max(0,dev+careAdd-tradeVal);
    return {dev,careAdd,tradeVal,total};
  }

  function render(){
    if(p.fitColors&&CFG.fi>=p.fitColors.models.length)CFG.fi=0;
    if(p.fit&&CFG.fi>=p.fit.opts.length)CFG.fi=0;
    let cols=curCols();
    if(CFG.ci>=cols.length)CFG.ci=0;
    if(p.bands&&p.bands[CFG.bi]&&p.bands[CFG.bi].colors&&CFG.bci>=p.bands[CFG.bi].colors.length)CFG.bci=0;
    const c=calc(),imgs=gallery(),col=cols[CFG.ci];
    if(CFG.gi>=imgs.length)CFG.gi=0;
    const optRow=(active,data,name,sub,price)=>`<div class="cfg-opt ${active?"active":""}" ${data}>
      <div><div class="o-name">${name}</div>${sub?`<div class="o-sub">${sub}</div>`:""}</div>
      ${price!=null?`<div class="o-price">${price}</div>`:""}</div>`;
    const plus=n=>n>0?"+"+fmtPrice(n):t("cfg_incl");
    const isImgSw=!!(cols[0]&&cols[0].sw);
    const finishSw=`<div class="cfg-colors ${isImgSw?"cfg-colors-img":""}">${cols.map((cc,i)=>`<div class="cfg-color ${i===CFG.ci?"active":""}" data-ci="${i}" title="${tr(cc.n)}"><span class="cc-dot ${cc.sw?"cc-img":""}" style="${cc.sw?`background-image:url('${cc.sw}')`:`background:${cc.hex}`}"></span>${isImgSw?"":`<span class="cc-name">${tr(cc.n)}</span>`}</div>`).join("")}</div>${cols.length>1&&!isImgSw?`<div class="cfg-curname">${tr(col.n)}</div>`:""}`;

    root.innerHTML=`
    <div class="cfg-top">
      <a class="cfg-back" href="${li.buyPage||"index.html"}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg> ${t("cfg_back")}</a>
      ${siblings.length>1&&cat!=="watch"?`<div class="cfg-models">${siblings.map(s=>`<button class="cfg-mtab ${s.id===CFG.pid?"active":""}" data-pid="${s.id}">${s.name}</button>`).join("")}</div>`:""}
    </div>

    <div class="cfg-stage"><div class="cfg-gallery">
      <div class="cfg-bigimg">
        <img id="cfgBig" src="${imgs[CFG.gi]}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)">
        ${imgs.length>1?`<div class="cfg-gnav"><button class="cfg-arrow" id="cfgGPrev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg></button><button class="cfg-arrow" id="cfgGNext"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button></div>`:""}
      </div>
      ${imgs.length>1?`<div class="cfg-details">${imgs.map((im,i)=>({im,i})).filter(o=>o.i!==CFG.gi).slice(0,2).map(o=>`<button class="cfg-detail" data-gi="${o.i}"><img src="${o.im}" alt="" loading="lazy" onerror="var b=this.closest('.cfg-detail');if(b)b.remove()"></button>`).join("")}</div>`:""}
    </div></div>

    <div class="cfg-panel">
      <h1>${p.name}</h1><div class="cfg-tagline">${tr(p.tag)}</div>

      ${mats?`<div class="cfg-group"><div class="cfg-q">${t("cfg_material")} <span>${t("cfg_material_sub")}</span></div>
        ${mats.map((m,i)=>`<div class="cfg-mat ${i===CFG.mi?"active":""}" data-mi="${i}">
          <div class="cm-head"><div><b>${tr(m.n)}</b><div class="cm-from">${t("from")}${fmtPrice(m.fromPrice)}</div></div><div class="o-price">${m.add>0?"+"+fmtPrice(m.add):t("cfg_incl")}</div></div>
          <div class="cm-desc">${tr(m.desc)}</div></div>`).join("")}
        <div class="cfg-finish-row"><div class="cfg-sublabel">${t("cfg_finish")}${cols.length>1?" — "+tr(col.n):""}</div>${finishSw}</div></div>`:""}

      ${p.variants?`<div class="cfg-group"><div class="cfg-q">${t("cfg_size")} <span>${t("cfg_size_sub")}</span></div>
        ${p.variants.map((v,i)=>optRow(i===CFG.vi,`data-vi="${i}"`,tr(v.n),tr(v.sub),plus(v.add))).join("")}
        <details class="cfg-help"><summary>${t("cfg_help_size")}</summary><p>${t("cfg_help_size_txt")}</p></details></div>`:""}

      ${!mats?`<div class="cfg-group"><div class="cfg-q">${t("cfg_finish")} <span>${t("cfg_finish_sub")}</span></div>${finishSw}</div>`:""}

      ${p.fitColors?`<div class="cfg-group"><div class="cfg-q">${tr(p.fitColors.label)} <span>${t("cfg_fit_sub")}</span></div>
        ${p.fitColors.models.map((m,i)=>optRow(i===CFG.fi,`data-fi="${i}"`,tr(m.n),"",null)).join("")}</div>`:""}

      ${p.fit?`<div class="cfg-group"><div class="cfg-q">${tr(p.fit.label)} <span>${t("cfg_fit_sub")}</span></div>
        ${p.fit.opts.map((o,i)=>optRow(i===CFG.fi,`data-fi="${i}"`,tr(o),"",null)).join("")}</div>`:""}

      ${p.bands?`<div class="cfg-group"><div class="cfg-q">${t("cfg_band")} <span>${t("cfg_band_sub")}</span></div>
        ${p.bands.map((b,i)=>{const cc=b.colors&&b.colors[i===CFG.bi?(CFG.bci||0):0];const dot=cc?cc.hex:b.hex;return optRow(i===CFG.bi,`data-bi="${i}"`,`<span class="cfg-banddot" style="background:${dot}"></span>${tr(b.n)}`,b.desc?tr(b.desc):"",plus(b.add));}).join("")}
        ${(()=>{const bd=p.bands[CFG.bi];if(!bd||!bd.colors||bd.colors.length<2)return"";return `<div class="cfg-finish-row"><div class="cfg-sublabel">${tr({ru:"Цвет ремешка",tj:"Ранги тасма",en:"Band colour"})} — ${tr((bd.colors[CFG.bci||0]||bd.colors[0]).n)}</div><div class="cfg-colors">${bd.colors.map((cc,i)=>`<div class="cfg-color ${i===(CFG.bci||0)?"active":""}" data-bci="${i}" title="${tr(cc.n)}"><span class="cc-dot" style="background:${cc.hex}"></span><span class="cc-name">${tr(cc.n)}</span></div>`).join("")}</div></div>`;})()}
        <details class="cfg-help"><summary>${t("cfg_help_band")}</summary><p>${t("cfg_help_band_txt")}</p></details></div>`:""}

      ${p.storage?`<div class="cfg-group"><div class="cfg-q">${t("cfg_storage_label")} <span>${t("cfg_storage_sub")}</span></div>
        ${p.storage.map((st,i)=>optRow(i===CFG.si,`data-si="${i}"`,stLabel(st.gb),"",plus(st.add))).join("")}</div>`:""}

      ${cat!=="acc"?`<div class="cfg-group"><div class="cfg-q">${t("cfg_trade")} <span>${t("cfg_trade_sub")}</span></div>
        ${optRow(!CFG.trade,`data-trade="0"`,t("cfg_trade_none"),t("cfg_trade_none_sub"),null)}
        ${optRow(CFG.trade,`data-trade="1"`,t("cfg_trade_yes"),t("cfg_trade_est"),"−"+fmtPrice(TRADEIN[cat]||0))}</div>`:""}


      <div class="cfg-summary">
        <div class="cfg-sum-h">${t("cfg_summary_h")}</div>
        <div class="cfg-rows">
          <div class="cfg-row"><span>${t("cfg_device")}</span><span>${fmtPrice(c.dev)}</span></div>
          ${c.tradeVal?`<div class="cfg-row save"><span>${t("cfg_save")}</span><span>−${fmtPrice(c.tradeVal)}</span></div>`:""}
        </div>
        <div class="cfg-total"><span>${t("cfg_total")}</span><span>${fmtPrice(c.total)}</span></div>
        <div class="cfg-actions">
          <button class="btn btn-primary" id="cfgAdd">${t("cfg_add")}</button>
          <button class="btn btn-soft" id="cfgBuy">${t("cfg_buynow")}</button>
        </div>
      </div>
    </div>`;

    root.querySelectorAll("[data-pid]").forEach(b=>b.onclick=()=>{CFG.pid=+b.dataset.pid;CFG.ci=0;CFG.si=0;CFG.vi=0;CFG.bi=0;CFG.bci=0;CFG.mi=0;CFG.gi=0;CFG.fi=0;CFG.focus="case";CFG.care=false;CFG.trade=false;renderConfigurator();});
    root.querySelectorAll("[data-mi]").forEach(o=>o.onclick=()=>{CFG.mi=+o.dataset.mi;CFG.ci=0;CFG.gi=0;CFG.focus="case";render();});
    root.querySelectorAll("[data-vi]").forEach(o=>o.onclick=()=>{CFG.vi=+o.dataset.vi;CFG.focus="case";render();});
    root.querySelectorAll("[data-bi]").forEach(o=>o.onclick=()=>{CFG.bi=+o.dataset.bi;CFG.bci=0;CFG.gi=0;CFG.focus="band";render();});
    root.querySelectorAll("[data-bci]").forEach(o=>o.onclick=()=>{CFG.bci=+o.dataset.bci;CFG.gi=0;CFG.focus="band";render();});
    root.querySelectorAll("[data-ci]").forEach(o=>o.onclick=()=>{CFG.ci=+o.dataset.ci;CFG.gi=0;CFG.focus="case";render();});
    root.querySelectorAll("[data-si]").forEach(o=>o.onclick=()=>{CFG.si=+o.dataset.si;CFG.focus="case";render();});
    root.querySelectorAll("[data-trade]").forEach(o=>o.onclick=()=>{CFG.trade=o.dataset.trade==="1";render();});
    root.querySelectorAll("[data-care]").forEach(o=>o.onclick=()=>{CFG.care=o.dataset.care==="1";render();});
    root.querySelectorAll("[data-pay]").forEach(o=>o.onclick=()=>{CFG.pay=o.dataset.pay;render();});
    root.querySelectorAll("[data-fi]").forEach(o=>o.onclick=()=>{CFG.fi=+o.dataset.fi;if(p.fitColors){CFG.ci=0;CFG.gi=0;}render();});
    root.querySelectorAll("[data-gi]").forEach(o=>o.onclick=()=>{CFG.gi=+o.dataset.gi;render();});
    const gp=root.querySelector("#cfgGPrev"),gn=root.querySelector("#cfgGNext");
    if(gp)gp.onclick=()=>{CFG.gi=(CFG.gi-1+imgs.length)%imgs.length;render();};
    if(gn)gn.onclick=()=>{CFG.gi=(CFG.gi+1)%imgs.length;render();};
    const cfgState=()=>({mi:CFG.mi,vi:CFG.vi,si:CFG.si,bi:CFG.bi,bci:CFG.bci||0});
    root.querySelector("#cfgAdd").onclick=()=>{addToCart(p.id,CFG.ci,false,c.total,CFG.fi,cfgState());openCart();};
    root.querySelector("#cfgBuy").onclick=()=>{addToCart(p.id,CFG.ci,true,c.total,CFG.fi,cfgState());openCheckout();};
  }
  render();
  document.title="ZAMON — "+p.name;
}

/* ===== shared product-page sections (used by product + model pages) ===== */
function buildWITB(p){
  const cable={ic:"🔌",n:{ru:"Кабель USB‑C",tj:"Сими USB‑C",en:"USB‑C cable"}};
  const witbMap={
    phone:[{ic:p.emoji||"📱",n:p.name},cable,{ic:"📄",n:{ru:"Документация",tj:"Ҳуҷҷатҳо",en:"Documentation"}}],
    laptop:[{ic:p.emoji||"💻",n:p.name},{ic:"⚡",n:{ru:"Адаптер питания USB‑C",tj:"Адаптери барқи USB‑C",en:"USB‑C power adapter"}},{ic:"🔌",n:{ru:"Кабель зарядки",tj:"Сими шарж",en:"Charge cable"}}],
    tablet:[{ic:p.emoji||"📲",n:p.name},cable,{ic:"⚡",n:{ru:"Адаптер питания 20 Вт",tj:"Адаптери 20 Вт",en:"20W power adapter"}}],
    audio:[{ic:p.emoji||"🎧",n:p.name},{ic:"🔋",n:{ru:"Зарядный кейс",tj:"Ғилофи шарж",en:"Charging case"}},cable],
    watch:[{ic:p.emoji||"⌚",n:p.name},{ic:"⌚",n:{ru:"Ремешок",tj:"Тасма",en:"Band"}},{ic:"🧲",n:{ru:"Магнитный зарядный кабель",tj:"Сими магнитии шарж",en:"Magnetic charge cable"}}]
  };
  const witb=p.box||witbMap[p.cat]||witbMap.phone;
  return `<section class="sec alt"><div class="wrap"><div class="sec-head reveal"><h2>${tr({ru:"В коробке",tj:"Дар қуттӣ",en:"In the box"})}</h2></div>
    <div class="witb-grid">${witb.map(w=>`<div class="witb-item reveal"><div class="witb-ic">${w.ic}</div><div class="witb-n">${typeof w.n==="string"?w.n:tr(w.n)}</div></div>`).join("")}</div></div></section>`;
}
function buildBuyerFAQ(){
  const pfaq=[
    {q:{ru:"Сколько идёт доставка?",tj:"Расонидан чанд вақт мегирад?",en:"How long is delivery?"},a:{ru:"Доставляем курьером по всему Душанбе, часто в день заказа. Бесплатно от 500 сомони.",tj:"Бо курьер дар тамоми Душанбе мерасонем, аксаран дар рӯзи фармоиш. Ройгон аз 500 сом.",en:"We deliver by courier across Dushanbe, often same day. Free from 500 TJS."}},
    {q:{ru:"Это оригинал с гарантией?",tj:"Ин аслӣ бо кафолат аст?",en:"Is it genuine with warranty?"},a:{ru:"Да. Только оригинальная техника Apple с официальной гарантией. AppleCare+ можно добавить при оформлении для расширенной защиты.",tj:"Бале. Танҳо техникаи аслии Apple бо кафолати расмӣ. AppleCare+-ро ҳангоми харид илова кардан мумкин.",en:"Yes. Only genuine Apple products with official warranty. AppleCare+ can be added at checkout."}},
    {q:{ru:"Как можно оплатить заказ?",tj:"Фармоишро чӣ тавр пардохт кардан мумкин аст?",en:"How can I pay for my order?"},a:{ru:"Оплата при получении — наличными или картой, когда курьер привезёт заказ. Никакой предоплаты.",tj:"Пардохт ҳангоми гирифтан — нақд ё бо корт, вақте ки курьер фармоишро меорад. Бе пешпардохт.",en:"Payment on delivery — cash or card when the courier brings your order. No prepayment."}},
    {q:{ru:"Примете старое устройство в зачёт?",tj:"Дастгоҳи кӯҳнаро қабул мекунед?",en:"Do you accept trade-ins?"},a:{ru:"Да. По Trade-In оценим ваше устройство и вычтем его стоимость из цены нового — выгода до 6 000 сомони.",tj:"Бале. Аз рӯи Trade-In дастгоҳатонро баҳо медиҳем ва аз нарх кам мекунем — то 6 000 сом.",en:"Yes. With Trade-In we appraise your device and deduct its value from the new one — save up to 6,000 TJS."}}];
  return `<section class="sec"><div class="wrap" style="max-width:780px"><div class="sec-head reveal"><h2>${tr({ru:"Частые вопросы",tj:"Саволҳои зуд-зуд",en:"Frequently asked"})}</h2></div>
    <div class="faq">${pfaq.map((f,i)=>`<div class="faq-item reveal ${i===0?"open":""}"><button class="faq-q">${tr(f.q)}<span class="faq-ic"></span></button><div class="faq-a"><p>${tr(f.a)}</p></div></div>`).join("")}</div></div></section>`;
}
function wireFAQ(root){root.querySelectorAll(".faq-item .faq-q").forEach(b=>b.onclick=()=>b.parentElement.classList.toggle("open"));}

/* ===== RENDER: generic product page (product.html?id=) ===== */
const productUrl=p=>p.modelPage||("product.html?id="+p.id);
const ARROW_L='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
const ARROW_R='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
function renderProduct(){
  const root=document.getElementById("product");if(!root)return;
  const id=+(new URLSearchParams(location.search).get("id")||1);const p=P(id)||PRODUCTS[0];
  document.title=tr({ru:"Купить "+p.name+" в Душанбе",tj:p.name+"-ро дар Душанбе харед",en:"Buy "+p.name+" in Dushanbe"})+" — ZAMON";
  productLD(p);
  const li=LIcat(p.cat)||{};const key=li.key;const pd=PAGEDATA[key];let cols=colsOf(p,0);
  const fitData=p.fitColors?{label:p.fitColors.label,opts:p.fitColors.models.map(m=>m.n)}:p.fit;
  const mkey=Object.keys(MODELS).find(k=>MODELS[k].productId===id);const ts=mkey?TECHSPECS[mkey]:null;
  const sp=SPECS[id]||{};const SL=x=>typeof x==="string"?x:tr(x);
  const dark=p.darkMedia&&!p.buyColors;
  const hero=`<section class="phero ${dark?"dark":"light"} prod-hero">${p.new?`<div class="pe">NEW</div>`:`<div class="pe">${li.name||p.line}</div>`}
    <h1>${p.name}</h1><p class="psub">${tr(p.tag)}</p>
    <p class="pprice">${t("from")}${fmtPrice(p.price)}</p>
    <div class="phero-cta"><a class="btn btn-primary lg" href="buy.html?id=${id}">${t("pp_buy")}</a><button class="btn btn-ghost lg" id="prodAdd">${t("buy_add")}</button></div>
    <a class="btn btn-wa lg prod-wa" href="${waLink(tr({ru:"Здравствуйте! Хочу заказать ",tj:"Салом! Мехоҳам фармоиш диҳам ",en:"Hi! I'd like to order "})+p.name+" — "+t("from")+fmtPrice(p.price)+".")}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.8.7.7-2.7-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5 0-.7-.3-1.4-.7-2-1.4-.4-.5-.7-1-.9-1.4-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.2.2-.4 0-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.7.7-.9 1.6-.6 2.6.3 1.1 1 2.1 1.2 2.4 1.7 2.5 3.6 3.3 4.8 3.6.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1l-.3-.2Z"/></svg> ${tr({ru:"Заказать в WhatsApp",tj:"Фармоиш дар WhatsApp",en:"Order on WhatsApp"})}</a>
    ${trustRowHTML()}
    <div class="prod-sw" id="prodSw">${cols.length>1?cols.map((c,i)=>`<button class="psw ${c.sw?"psw-img":""} ${i===0?"active":""}" data-pi="${i}" style="${c.sw?`background-image:url(${c.sw})`:`background:${c.hex}`}" title="${tr(c.n)}" aria-label="${tr(c.n)}"></button>`).join(""):""}</div>
    ${fitData?`<div class="prod-fit"><div class="pf-label">${tr(fitData.label)}</div><div class="pf-opts">${fitData.opts.map((o,i)=>`<button class="pf-opt ${i===0?"active":""}" data-fit="${i}">${tr(o)}</button>`).join("")}</div></div>`:""}
    <img class="phero-img" id="prodImg" src="${(cols[0].gal&&cols[0].gal[0])||cols[0].disp||cols[0].img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)">
    <div class="prod-gallery" id="prodGal"></div></section>`;
  let specsHtml;
  if(ts){specsHtml=`<div class="specs-grid">${ts.map(g=>`<div class="spec-group reveal"><h3>${SL(g.t)}</h3><dl>${g.rows.map(([k,v])=>`<div class="spec-row"><dt>${SL(k)}</dt><dd>${SL(v)}</dd></div>`).join("")}</dl></div>`).join("")}</div>`;}
  else{const stor=sp.storage||(p.storage?p.storage.map(s=>stLabel(s.gb)).join(" / "):"");
    const rows=[[t("spec_chip"),sp.chip],[t("spec_display"),sp.display],[tr({ru:"Камера",tj:"Камера",en:"Camera"}),sp.camera],[t("spec_battery"),sp.battery],[tr({ru:"Память",tj:"Хотира",en:"Storage"}),stor],[tr({ru:"Корпус",tj:"Корпус",en:"Build"}),sp.build],[tr({ru:"Связь",tj:"Пайваст",en:"Connectivity"}),sp.conn],[tr({ru:"Цвета",tj:"Рангҳо",en:"Colors"}),(cols&&cols.length>1?cols.length+" "+tr({ru:"вариантов",tj:"вариант",en:"options"}):"")],[t("spec_price"),fmtPrice(p.price)]].filter(r=>r[1]);
    specsHtml=`<div class="specs-grid"><div class="spec-group reveal" style="max-width:560px;margin:0 auto"><h3>${p.name}</h3><dl>${rows.map(([k,v])=>`<div class="spec-row"><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl></div></div>`;}
  const flbl=p.cat==="audio"?[tr({ru:"Чип",tj:"Чип",en:"Chip"}),tr({ru:"Подключение",tj:"Пайвастшавӣ",en:"Connectivity"}),tr({ru:"Время работы",tj:"Батарея",en:"Battery"})]
    :p.cat==="watch"?[tr({ru:"Чип",tj:"Чип",en:"Chip"}),tr({ru:"Корпус",tj:"Корпус",en:"Case"}),tr({ru:"Батарея",tj:"Батарея",en:"Battery"})]
    :[t("spec_chip"),t("spec_display"),t("spec_battery")];
  const ficons=p.cat==="audio"?["🎧","🔌","🔋"]:p.cat==="watch"?["⌚","📐","🔋"]:["⚡","🖥️","🔋"];
  const SLV=x=>x==null?"":(typeof x==="string"?x:tr(x));
  const featData=p.highlights||((sp.chip&&sp.display&&sp.battery)?[{ic:ficons[0],big:sp.chip,lbl:flbl[0]},{ic:ficons[1],big:sp.display,lbl:flbl[1]},{ic:ficons[2],big:sp.battery,lbl:flbl[2]}]:null);
  const feats=featData?`<section class="sec alt"><div class="wrap"><div class="sec-head reveal"><h2>${t("pp_highlights")}</h2><p class="sec-sub">${tr({ru:"Главное об устройстве — коротко.",tj:"Асосӣ дар бораи дастгоҳ.",en:"The key things at a glance."})}</p></div>
    <div class="prod-feats">${featData.map(f=>`<div class="pf-card reveal"><div class="pf-ic">${f.ic}</div><div class="pf-big">${SLV(f.big)}</div><div class="pf-lbl">${SLV(f.lbl)}</div></div>`).join("")}</div></div></section>`:"";
  const advOk=pd&&pd.adv&&p.cat!=="acc"&&p.id!==18&&p.id!==19;
  const lineWhy=tr({ru:"Почему "+(li.name||p.line),tj:"Чаро "+(li.name||p.line),en:"Why "+(li.name||p.line)});
  const advSec=advOk?`<section class="sec alt"><div class="wrap"><div class="sec-head reveal"><h2>${lineWhy}</h2></div>
    <div class="why-adv">${pd.adv.map(a=>`<div class="wa reveal"><div class="wa-ic">${a.ic}</div><h4>${tr(a.h)}</h4><p>${tr(a.p)}</p></div>`).join("")}</div></div></section>`:feats;
  const pdata=PRODUCTDATA[id];
  const mediaSec=pdata?`${pdata.heroVideo?`<section class="sec"><div class="wrap"><div class="prod-video-wrap reveal"><video class="prod-video" autoplay muted loop playsinline preload="auto"><source src="${pdata.heroVideo}" type="video/mp4"></video></div></div></section>`:""}${pdata.gallery?`<section class="sec alt"><div class="wrap"><div class="sec-head reveal"><h2>${t("pp_highlights")}</h2></div>
    <div class="carousel" id="pdCar"><button class="car-arrow prev" aria-label="prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
      <div class="car-viewport"><div class="car-track">${pdata.gallery.map(g=>`<div class="hl-card dark"><div class="hl-h">${tr(g.h)}</div><img class="hl-img" src="${g.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>`).join("")}</div></div>
      <button class="car-arrow next" aria-label="next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
    </div><div class="car-dots" id="pdDots"></div></div></section>`:""}`:"";
  const specsSec=`<section class="sec"><div class="wrap"><div class="sec-head reveal"><h2>${t("spec_h")}</h2></div>${specsHtml}</div></section>`;
  const faqSec=buildBuyerFAQ();
  const witbSec=buildWITB(p);
  const cta=`<section class="sec"><div class="wrap" style="text-align:center"><h2 style="font-size:clamp(1.8rem,4vw,2.6rem);margin-bottom:14px">${tr({ru:"Готовы к покупке?",tj:"Ба харид тайёред?",en:"Ready to buy?"})}</h2>
    <p style="color:var(--text-2);max-width:520px;margin:0 auto 22px">${tr({ru:"Оригинал, официальная гарантия и быстрая доставка по Душанбе.",tj:"Аслӣ, кафолати расмӣ ва расонидани зуд дар Душанбе.",en:"Genuine, official warranty and fast delivery across Dushanbe."})}</p>
    <div class="phero-cta" style="justify-content:center"><a class="btn btn-primary lg" href="buy.html?id=${id}">${t("pp_buy")} · ${fmtPrice(p.price)}</a><a class="btn btn-ghost lg" href="${li.page||"index.html"}">${t("details")} →</a></div></div></section>`;
  root.innerHTML=hero+(pdata?mediaSec:advSec)+specsSec+witbSec+faqSec+cta;
  function setProdGallery(ci){const c=cols[ci];const gal=(c.gal&&c.gal.length)?c.gal:[c.img];const main=document.getElementById("prodImg");if(main)main.src=gal[0];const gel=document.getElementById("prodGal");if(!gel)return;gel.innerHTML=gal.length>1?gal.map((g,j)=>`<button class="pg-thumb ${j===0?"active":""}" data-g="${j}"><img src="${g}" loading="lazy" alt="" onerror="var b=this.closest('.pg-thumb');if(b)b.remove()"></button>`).join(""):"";gel.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{if(main)main.src=gal[+b.dataset.g];gel.querySelectorAll("[data-g]").forEach(x=>x.classList.toggle("active",x===b));});}
  let prodCi=0,prodFit=0;
  function wireSw(){root.querySelectorAll("[data-pi]").forEach(b=>b.onclick=()=>{prodCi=+b.dataset.pi;setProdGallery(prodCi);root.querySelectorAll("[data-pi]").forEach(s=>s.classList.toggle("active",s===b));});}
  function paintSw(){const sw=root.querySelector("#prodSw");if(sw){sw.innerHTML=cols.length>1?cols.map((c,i)=>`<button class="psw ${c.sw?"psw-img":""} ${i===prodCi?"active":""}" data-pi="${i}" style="${c.sw?`background-image:url(${c.sw})`:`background:${c.hex}`}" title="${tr(c.n)}" aria-label="${tr(c.n)}"></button>`).join(""):"";wireSw();}setProdGallery(prodCi);}
  wireSw();
  root.querySelectorAll("[data-fit]").forEach(b=>b.onclick=()=>{prodFit=+b.dataset.fit;prodCi=0;if(p.fitColors)cols=colsOf(p,prodFit);root.querySelectorAll("[data-fit]").forEach(s=>s.classList.toggle("active",s===b));paintSw();});
  setProdGallery(0);
  wireFAQ(root);
  const add=root.querySelector("#prodAdd");if(add)add.onclick=()=>{addToCart(id,prodCi,false,undefined,prodFit);openCart();};
  if(pdata&&pdata.gallery){const c=root.querySelector("#pdCar");if(c)initCarousel(c,document.getElementById("pdDots"));}
  observeReveal();initTilt(".pf-card");
}

/* ===== RENDER: accessories (accessories.html) ===== */
let ACCFILTER="all",ACCFOR_DONE=false;
/* категория→тип аксессуара (для ?for=): часы→ремешки, iPhone/iPad→чехлы, Mac→клавиатуры/мыши */
const ACC_FORMAP={watch:"band",phone:"case",tablet:"case",laptop:"input"};
function renderAccessories(){
  if(!ACCFOR_DONE&&document.getElementById("accgrid")){ACCFOR_DONE=true;const f=new URLSearchParams(location.search).get("for");if(f&&ACC_FORMAP[f])ACCFILTER=ACC_FORMAP[f];}
  const hero=document.getElementById("accHero");
  if(hero)hero.innerHTML=`<div class="pe">ZAMON</div><h1>${t("acc_h")}</h1><p class="psub">${t("acc_sub")}</p>`;
  const box=document.getElementById("accgrid");if(!box)return;
  document.title="ZAMON — "+t("acc_h");
  const all=PRODUCTS.filter(p=>p.cat==="acc");
  const cats=ACAT_CATS.filter(([k])=>k==="all"||all.some(p=>ACAT[p.id]===k));
  /* «Shop by category» — чипы-навигация */
  const chips=`<div class="acc-filters">${cats.map(([k,l])=>`<button class="acc-chip ${k===ACCFILTER?"active":""}" data-acc="${k}">${tr(l)}</button>`).join("")}</div>`;
  /* разделы по категориям (как на apple.com/shop/accessories): «Все» → все секции стопкой, чип → одна секция */
  const showCats=(ACCFILTER==="all"?cats.filter(([k])=>k!=="all"):cats.filter(([k])=>k===ACCFILTER));
  const sections=showCats.map(([k,l])=>{
    const items=all.filter(p=>ACAT[p.id]===k);if(!items.length)return"";
    return `<section class="acc-cat" id="acc-${k}"><div class="acc-cat-head"><h2 class="acc-cat-h">${tr(l)}</h2><span class="acc-cat-n">${items.length}</span></div><div class="acc-grid">${items.map(accCardHtml).join("")}</div></section>`;
  }).join("");
  box.innerHTML=chips+sections;
  box.querySelectorAll("[data-acc]").forEach(b=>b.onclick=()=>{ACCFILTER=b.dataset.acc;renderAccessories();const box2=document.getElementById("accgrid");if(box2)box2.scrollIntoView({behavior:"smooth",block:"start"});});
  observeReveal();
}

/* ===== TOOL: compare (compare.html) ===== */
const CMPCATS=[["phone","iPhone"],["laptop","Mac"],["tablet","iPad"],["watch","Apple Watch"],["audio","AirPods"]];
let CMPT=null;
function renderCompareTool(){
  const root=document.getElementById("compareTool");if(!root)return;
  document.title="ZAMON — "+t("cmp_title");
  if(!CMPT)CMPT={cat:"phone",picks:PRODUCTS.filter(p=>p.cat==="phone").slice(0,3).map(p=>p.id)};
  const items=PRODUCTS.filter(p=>p.cat===CMPT.cat);
  const picked=CMPT.picks.map(id=>P(id)).filter(p=>p&&p.cat===CMPT.cat);
  const rows=[["spec_price",p=>fmtPrice(p.price)],["spec_chip",p=>(SPECS[p.id]||{}).chip||"—"],["spec_display",p=>(SPECS[p.id]||{}).display||"—"],["spec_battery",p=>(SPECS[p.id]||{}).battery||"—"],["spec_rating",p=>"★".repeat(p.rating||5)]];
  root.innerHTML=`<div class="ct-head"><h1>${t("cmp_title")}</h1><p class="sec-sub">${t("cmp_sub")}</p></div>
    <div class="ct-cats">${CMPCATS.map(([c,l])=>`<button class="ct-cat ${c===CMPT.cat?"active":""}" data-cat="${c}">${l}</button>`).join("")}</div>
    <div class="ct-pick-h">${t("cmp_pick")} <span>· ${t("cmp_max")}</span></div>
    <div class="ct-pick-grid">${items.map(p=>`<button class="ct-chip ${CMPT.picks.includes(p.id)?"on":""}" data-pick="${p.id}"><img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"><span>${p.name}</span></button>`).join("")}</div>
    ${picked.length<2?`<div class="ct-hint">🔎 ${t("cmp_hint")}</div>`:`<div class="cmp-scroll"><table class="cmp-table"><thead><tr><th></th>${picked.map(p=>`<th><div class="cmp-prod"><img src="${mainImg(p)}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"><span>${p.name}</span><button class="add" data-buy="${p.id}">${t("pp_buy")}</button></div></th>`).join("")}</tr></thead>
      <tbody>${rows.map(([lbl,fn])=>`<tr><td class="cmp-lbl">${t(lbl)}</td>${picked.map(p=>`<td>${fn(p)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}`;
  root.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{CMPT.cat=b.dataset.cat;CMPT.picks=PRODUCTS.filter(p=>p.cat===CMPT.cat).slice(0,3).map(p=>p.id);renderCompareTool();});
  root.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{const id=+b.dataset.pick;const i=CMPT.picks.indexOf(id);if(i>=0){if(CMPT.picks.length>1)CMPT.picks.splice(i,1);}else{if(CMPT.picks.length<3)CMPT.picks.push(id);else{toast(t("cmp_max"));return;}}renderCompareTool();});
}

/* ===== TOOL: Trade-In estimator + financing calculator (trade-in.html) ===== */
let TI=null;
function renderTradeIn(){
  const root=document.getElementById("tradein");if(!root)return;
  document.title="ZAMON — "+t("ti_title");
  const tradeables=PRODUCTS.filter(p=>p.cat!=="acc");
  if(!TI)TI={cat:"phone",cond:1,calcId:1,term:24,care:false};
  const catItems=tradeables.filter(p=>p.cat===TI.cat);
  const credit=Math.round((TRADEIN[TI.cat]||0)*TI.cond);
  const cp=P(TI.calcId)||PRODUCTS[0];
  const calcBase=cp.price+(TI.care?(CARE[cp.cat]||0):0);
  const monthly=Math.round(calcBase/TI.term);
  const li=LIcat(TI.cat)||{};
  const conds=[[1,"ti_c1"],[0.7,"ti_c2"],[0.4,"ti_c3"]];
  root.innerHTML=`<div class="ct-head"><h1>${t("ti_title")}</h1><p class="sec-sub">${t("ti_sub")}</p></div>
  <div class="tools-grid solo">
    <div class="tool-card">
      <h3>${t("ti_title")}</h3>
      <label class="tool-lbl">${t("ti_device")}</label>
      <div class="ct-cats">${CMPCATS.map(([c,l])=>`<button class="ct-cat ${c===TI.cat?"active":""}" data-ticat="${c}">${l}</button>`).join("")}</div>
      <label class="tool-lbl">${t("ti_cond")}</label>
      <div class="ti-conds">${conds.map(([f,k])=>`<button class="ti-cond ${TI.cond===f?"active":""}" data-cond="${f}">${t(k)}</button>`).join("")}</div>
      <div class="ti-result"><span>${t("ti_credit")}</span><div class="ti-amount">−${fmtPrice(credit)}</div></div>
      <p class="ti-note">${t("ti_note")}</p>
      <a class="btn btn-primary" href="${li.buyPage||"index.html#catalog"}" style="width:100%;justify-content:center">${t("ti_apply")}</a>
    </div>
  </div>`;
  root.querySelectorAll("[data-ticat]").forEach(b=>b.onclick=()=>{TI.cat=b.dataset.ticat;renderTradeIn();});
  root.querySelectorAll("[data-cond]").forEach(b=>b.onclick=()=>{TI.cond=+b.dataset.cond;renderTradeIn();});
  root.querySelectorAll("[data-term]").forEach(b=>b.onclick=()=>{TI.term=+b.dataset.term;renderTradeIn();});
  const sel=root.querySelector("#calcSel");if(sel)sel.onchange=()=>{TI.calcId=+sel.value;renderTradeIn();};
  const care=root.querySelector("#calcCare");if(care)care.onchange=()=>{TI.care=care.checked;renderTradeIn();};
}

/* ===== SERVICE PAGES: support / contact / about ===== */
function renderSupport(){
  const box=document.getElementById("support");if(!box)return;
  document.title="ZAMON — "+tr({ru:"Поддержка",tj:"Дастгирӣ",en:"Support"});
  const cats=[
   {ic:"🚚",h:{ru:"Доставка",tj:"Расонидан",en:"Delivery"},p:{ru:"Бесплатно от 500 сом., по всей стране за 24 часа.",tj:"Ройгон аз 500 сом., дар 24 соат.",en:"Free from 500 TJS, nationwide in 24 hours."},page:"index.html#services"},
   {ic:"🛡️",h:{ru:"Гарантия",tj:"Кафолат",en:"Warranty"},p:{ru:"Официальная гарантия 1–2 года на всю технику.",tj:"Кафолати расмии 1–2 сол.",en:"Official 1–2 year warranty on all devices."},page:"index.html#services"},
   {ic:"🔄",h:{ru:"Trade-In",tj:"Trade-In",en:"Trade-In"},p:{ru:"Сдайте старое устройство и сэкономьте до 6 000 сом.",tj:"Дастгоҳи кӯҳнаро супоред ва сарфа кунед.",en:"Trade in your old device, save up to 6,000 TJS."},page:"trade-in.html"},
   {ic:"💳",h:{ru:"Оплата при получении",tj:"Пардохт ҳангоми гирифтан",en:"Pay on delivery"},p:{ru:"Платите наличными или картой, когда получили заказ. Без предоплаты.",tj:"Ҳангоми гирифтани фармоиш нақд ё бо корт пардохт кунед. Бе пешпардохт.",en:"Pay by cash or card when you receive your order. No prepayment."},page:"contact.html"},
   {ic:"↩️",h:{ru:"Возврат",tj:"Баргардонидан",en:"Returns"},p:{ru:"14 дней на возврат без объяснения причин.",tj:"14 рӯз барои баргардонидан.",en:"14-day returns, no questions asked."},page:"index.html#services"},
   {ic:"↩️",h:{ru:"Возврат 14 дней",tj:"Бозгашти 14 рӯз",en:"14-day returns"},p:{ru:"Не подошло — вернём деньги в течение 14 дней.",tj:"Мувофиқ нашуд — дар 14 рӯз пулро бармегардонем.",en:"Changed your mind? Full refund within 14 days."},page:"index.html#services"}];
  const faq=[
   {q:{ru:"Оригинальная ли у вас техника?",tj:"Техникаи шумо аслист?",en:"Is your tech genuine?"},a:{ru:"Да. ZAMON продаёт только 100% оригинальную технику Apple с официальной гарантией. Никаких реплик и серых поставок.",tj:"Бале. Танҳо техникаи 100% аслии Apple бо кафолати расмӣ.",en:"Yes. ZAMON sells only 100% genuine Apple products with official warranty."}},
   {q:{ru:"Сколько стоит доставка?",tj:"Расонидан чанд аст?",en:"How much is delivery?"},a:{ru:"Доставка бесплатна при заказе от 500 сомони. По всему Таджикистану — в течение 24 часов.",tj:"Ройгон аз 500 сомонӣ, дар 24 соат.",en:"Free for orders from 500 TJS, delivered within 24 hours across Tajikistan."}},
   {q:{ru:"Как работает кредит 0%?",tj:"Қарзи 0% чӣ тавр кор мекунад?",en:"How does 0% financing work?"},a:{ru:"Вы оплачиваете технику равными частями до 24 месяцев без переплат и скрытых процентов. Оформляется за 15 минут.",tj:"Пардохт ба қисмҳои баробар то 24 моҳ бе фоиз.",en:"Pay in equal installments up to 24 months with no overpayment. Approved in 15 minutes."}},
   {q:{ru:"Что такое Trade-In?",tj:"Trade-In чист?",en:"What is Trade-In?"},a:{ru:"Сдайте старое устройство — мы оценим его и вычтем стоимость из цены нового. Экономия до 6 000 сомони.",tj:"Дастгоҳи кӯҳнаро супоред ва то 6 000 сом. сарфа кунед.",en:"Trade in your old device — we'll appraise it and deduct the value. Save up to 6,000 TJS."}},
   {q:{ru:"Какая гарантия на технику?",tj:"Кафолат чанд сол аст?",en:"What's the warranty?"},a:{ru:"Официальная гарантия 1–2 года в зависимости от устройства. AppleCare+ продлевает её и добавляет защиту от повреждений.",tj:"Кафолати расмии 1–2 сол. AppleCare+ онро дароз мекунад.",en:"Official 1–2 year warranty depending on the device. AppleCare+ extends it."}},
   {q:{ru:"Можно ли вернуть товар?",tj:"Молро баргардонидан мумкин аст?",en:"Can I return a product?"},a:{ru:"Да, в течение 14 дней с момента покупки при сохранении товарного вида и комплектации.",tj:"Бале, дар давоми 14 рӯз.",en:"Yes, within 14 days of purchase if the product is in original condition."}},
   {q:{ru:"Какие способы оплаты?",tj:"Тарзҳои пардохт кадомҳоянд?",en:"What payment methods?"},a:{ru:"Наличными или картой при получении, а также кредит 0% до 24 месяцев.",tj:"Нақд, корт ё қарзи 0%.",en:"Cash or card on delivery, plus 0% financing up to 24 months."}},
   {q:{ru:"Где находится магазин?",tj:"Мағоза дар куҷост?",en:"Where is the store?"},a:{ru:"Наш магазин в Душанбе, проспект Рудаки 25. Работаем ежедневно с 9:00 до 21:00.",tj:"Душанбе, хиёбони Рӯдакӣ 25, ҳар рӯз 9:00–21:00.",en:"Our store is in Dushanbe, Rudaki Avenue 25. Open daily 9:00–21:00."}}];
  box.innerHTML=`<div class="sec-head reveal"><span class="sec-tag">${tr({ru:"Поддержка ZAMON",tj:"Дастгирии ZAMON",en:"ZAMON Support"})}</span>
    <h1>${tr({ru:"Чем можем помочь?",tj:"Чӣ гуна кӯмак расонем?",en:"How can we help?"})}</h1>
    <p class="sec-sub">${tr({ru:"Ответы на частые вопросы о покупке, доставке и сервисе.",tj:"Ҷавоб ба саволҳои маъмул.",en:"Answers to common questions about buying, delivery and service."})}</p></div>
    <div class="sup-cats">${cats.map(c=>`<a class="sup-cat reveal" href="${c.page}"><div class="sc-ic">${c.ic}</div><h4>${tr(c.h)}</h4><p>${tr(c.p)}</p></a>`).join("")}</div>
    <div class="faq-wrap"><h2 class="reveal">${tr({ru:"Частые вопросы",tj:"Саволҳои зуд-зуд",en:"Frequently asked"})}</h2>
    <div class="faq">${faq.map((f,i)=>`<div class="faq-item reveal ${i===0?"open":""}"><button class="faq-q">${tr(f.q)}<span class="faq-ic"></span></button><div class="faq-a"><p>${tr(f.a)}</p></div></div>`).join("")}</div></div>
    <div class="sup-cta reveal"><h3>${tr({ru:"Не нашли ответ?",tj:"Ҷавоб наёфтед?",en:"Didn't find an answer?"})}</h3>
      <p>${tr({ru:"Свяжитесь с нами — поможем на трёх языках.",tj:"Бо мо тамос гиред.",en:"Get in touch — we help in three languages."})}</p>
      <a class="btn btn-primary lg" href="contact.html">${tr({ru:"Связаться с нами",tj:"Тамос",en:"Contact us"})}</a></div>`;
  box.querySelectorAll(".faq-item .faq-q").forEach(b=>b.onclick=()=>b.parentElement.classList.toggle("open"));
  observeReveal();
}
function renderContact(){
  const box=document.getElementById("contact");if(!box)return;
  document.title="ZAMON — "+tr({ru:"Контакты",tj:"Тамос",en:"Contact"});
  const info=[
   {ic:"📍",h:{ru:"Адрес",tj:"Суроға",en:"Address"},v:{ru:"г. Душанбе, проспект Рудаки 25",tj:"ш. Душанбе, хиёбони Рӯдакӣ 25",en:"Dushanbe, Rudaki Avenue 25"}},
   {ic:"📞",h:{ru:"Телефон",tj:"Телефон",en:"Phone"},v:SHOP_PHONE,href:"tel:"+SHOP_PHONE.replace(/\s/g,"")},
   {ic:"💬",h:{ru:"WhatsApp",tj:"WhatsApp",en:"WhatsApp"},v:SHOP_PHONE,href:waLink()},
   {ic:"✈️",h:{ru:"Telegram",tj:"Telegram",en:"Telegram"},v:"@"+SHOP_TG,href:tgLink},
   {ic:"🕘",h:{ru:"Часы работы",tj:"Соатҳои корӣ",en:"Hours"},v:{ru:"Ежедневно 9:00 – 21:00",tj:"Ҳар рӯз 9:00 – 21:00",en:"Daily 9:00 – 21:00"}}];
  box.innerHTML=`<div class="sec-head reveal"><span class="sec-tag">${tr({ru:"Контакты",tj:"Тамос",en:"Contact"})}</span>
    <h1>${tr({ru:"Мы всегда на связи",tj:"Мо ҳамеша дар тамос",en:"We're always here"})}</h1>
    <p class="sec-sub">${tr({ru:"Приходите в магазин или напишите нам — ответим быстро.",tj:"Ба мағоза биёед ё нависед.",en:"Visit the store or message us — we reply fast."})}</p></div>
    <div class="contact-grid">
      <div class="contact-info">${info.map(i=>{const val=typeof i.v==="string"?i.v:tr(i.v);return `<div class="ci-row reveal"><div class="ci-ic">${i.ic}</div><div><div class="ci-h">${tr(i.h)}</div>${i.href?`<a class="ci-v ci-link" href="${i.href}"${i.href.startsWith("http")?' target="_blank" rel="noopener"':""}>${val}</a>`:`<div class="ci-v">${val}</div>`}</div></div>`;}).join("")}
        <div class="contact-map reveal"><div class="map-pin">📍</div><span>${tr({ru:"Душанбе · Рудаки 25",tj:"Душанбе · Рӯдакӣ 25",en:"Dushanbe · Rudaki 25"})}</span></div></div>
      <form class="contact-form reveal" id="contactForm">
        <h3>${tr({ru:"Напишите нам",tj:"Ба мо нависед",en:"Send a message"})}</h3>
        <div class="field"><label>${t("co_name")}</label><input required type="text" placeholder="Ahmad Rahimov"></div>
        <div class="field"><label>${t("co_phone")}</label><input required type="tel" placeholder="+992 90 000 00 00"></div>
        <div class="field"><label>${tr({ru:"Сообщение",tj:"Паём",en:"Message"})}</label><textarea required rows="4" placeholder="${tr({ru:"Ваш вопрос…",tj:"Саволи шумо…",en:"Your question…"})}"></textarea></div>
        <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">${tr({ru:"Отправить",tj:"Фиристодан",en:"Send"})}</button></form></div>`;
  const f=box.querySelector("#contactForm");if(f)f.onsubmit=e=>{e.preventDefault();f.reset();toast(tr({ru:"Сообщение отправлено! Мы свяжемся с вами.",tj:"Паём фиристода шуд!",en:"Message sent! We'll be in touch."}));};
  observeReveal();
}
function renderAbout(){
  const box=document.getElementById("about");if(!box)return;
  document.title="ZAMON — "+tr({ru:"О нас",tj:"Дар бораи мо",en:"About"});
  const vals=[
   {ic:"💯",h:{ru:"Только оригинал",tj:"Танҳо аслӣ",en:"Genuine only"},p:{ru:"100% официальная техника Apple с гарантией. Никаких компромиссов.",tj:"100% техникаи расмии Apple.",en:"100% official Apple products. No compromises."}},
   {ic:"🤝",h:{ru:"Доверие клиентов",tj:"Боварии мизоҷон",en:"Customer trust"},p:{ru:"Более 1000 довольных клиентов в Душанбе — и мы только растём.",tj:"Зиёда аз 1000 мизоҷон дар Душанбе — ва мо танҳо меафзоем.",en:"Over 1,000 happy customers in Dushanbe — and we are just growing."}},
   {ic:"⚡",h:{ru:"Премиальный сервис",tj:"Хизмати олӣ",en:"Premium service"},p:{ru:"Доставка за 24 часа, кредит 0%, Trade-In и поддержка 24/7.",tj:"Расонидан 24с, қарзи 0%, дастгирӣ 24/7.",en:"24-hour delivery, 0% financing, Trade-In and 24/7 support."}}];
  box.innerHTML=`<div class="about-hero reveal"><span class="sec-tag">${tr({ru:"О ZAMON",tj:"Дар бораи ZAMON",en:"About ZAMON"})}</span>
    <h1>${tr({ru:"Apple, которому доверяют в Таджикистане",tj:"Apple, ки дар Тоҷикистон бовар мекунанд",en:"The Apple store Tajikistan trusts"})}</h1>
    <p>${tr({ru:"ZAMON — авторизованный премиальный магазин техники Apple. Мы не просто продаём устройства — мы отвечаем за каждое, от выбора до сервиса.",tj:"ZAMON — мағозаи расмии премиалии Apple. Мо барои ҳар дастгоҳ ҷавобгар ҳастем.",en:"ZAMON is an authorized premium Apple store. We don't just sell devices — we stand behind every one."})}</p></div>
    <div class="about-stats reveal"><div><div class="num" data-count="1000">0</div><span>${t("stat1")}</span></div><div><div class="num" data-count="100">0</div><span>${t("stat2")}</span></div><div><div class="num" data-count="2">0</div><span>${t("stat3")}</span></div></div>
    <div class="about-vals">${vals.map(v=>`<div class="about-val reveal"><div class="av-ic">${v.ic}</div><h3>${tr(v.h)}</h3><p>${tr(v.p)}</p></div>`).join("")}</div>
    <div class="sup-cta reveal"><h3>${tr({ru:"Готовы выбрать своё устройство?",tj:"Тайёред дастгоҳатонро интихоб кунед?",en:"Ready to choose your device?"})}</h3>
      <a class="btn btn-primary lg" href="index.html#catalog">${t("hero_cta1")}</a></div>`;
  observeReveal();initCounters();
}

/* ===== REVEAL / counters / parallax ===== */
let io;
function observeReveal(){if(!io)io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}}),{threshold:.12});document.querySelectorAll(".reveal:not(.in)").forEach(el=>io.observe(el));}
/* subtle pointer-reactive 3D tilt on cards (desktop pointers only) */
function initTilt(sel){
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches||!window.matchMedia("(pointer:fine)").matches)return;
  document.querySelectorAll(sel).forEach(card=>{
    if(card._tilt)return;card._tilt=1;const MAX=7;
    card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect();const px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
      card.classList.add("tilting");
      card.style.setProperty("--ry",((px-.5)*MAX*2).toFixed(2)+"deg");
      card.style.setProperty("--rx",((.5-py)*MAX*2).toFixed(2)+"deg");
      card.style.setProperty("--mx",(px*100).toFixed(1)+"%");card.style.setProperty("--my",(py*100).toFixed(1)+"%");});
    card.addEventListener("pointerleave",()=>{card.classList.remove("tilting");card.style.setProperty("--ry","0deg");card.style.setProperty("--rx","0deg");});
  });
}
/* scroll-linked parallax on showcase + product/model heroes (Apple-style depth) */
let parallaxBound=false,parallaxUpdate=()=>{};
function initParallax(){
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  if(!parallaxBound){parallaxBound=true;let ticking=false;
    parallaxUpdate=()=>{const vh=innerHeight;
      document.querySelectorAll(".promo .pimg, .phero-img.par, .mhero .mh-img.par").forEach(el=>{
        const r=el.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;
        const prog=(r.top+r.height/2-vh/2)/vh;el.style.setProperty("--py",(prog*-30).toFixed(1)+"px");});
      ticking=false;};
    addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(parallaxUpdate);ticking=true;}},{passive:true});
    addEventListener("resize",()=>requestAnimationFrame(parallaxUpdate),{passive:true});
  }
  // hand off hero images from entrance animation to parallax once they settle
  document.querySelectorAll(".phero-img:not(.par-ready), .mhero .mh-img:not(.par-ready)").forEach(el=>{
    el.classList.add("par-ready");
    const enable=()=>{el.style.animation="none";el.classList.add("par");parallaxUpdate();};
    if(getComputedStyle(el).animationName==="none")enable();else el.addEventListener("animationend",enable,{once:true});
  });
  parallaxUpdate();
}
/* scrollspy: highlight the sub-nav link of the section in view (Apple-style) */
let spyIO;
function initSubnavSpy(){
  const nav=document.querySelector(".psubnav");if(!nav)return;
  const links=[...nav.querySelectorAll("a")].filter(a=>(a.getAttribute("href")||"").startsWith("#"));
  if(!links.length)return;
  const map=new Map();links.forEach(a=>{const sec=document.querySelector(a.getAttribute("href"));if(sec)map.set(sec,a);});
  if(!map.size)return;
  if(spyIO)spyIO.disconnect();
  const visible=new Set();
  spyIO=new IntersectionObserver(es=>{
    es.forEach(en=>{if(en.isIntersecting)visible.add(en.target);else visible.delete(en.target);});
    let best=null,bestTop=Infinity;
    visible.forEach(sec=>{const tp=sec.getBoundingClientRect().top;if(tp<bestTop){bestTop=tp;best=sec;}});
    links.forEach(a=>a.classList.remove("spy-active"));
    if(best&&map.get(best))map.get(best).classList.add("spy-active");
  },{rootMargin:"-45% 0px -45% 0px",threshold:0});
  map.forEach((a,sec)=>spyIO.observe(sec));
}
function initCounters(){const cio=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const el=en.target,target=+el.dataset.count;let cur=0;const step=target/55;const tm=setInterval(()=>{cur+=step;if(cur>=target){cur=target;clearInterval(tm);}el.textContent=num(Math.floor(cur))+(target>=1000?"+":"");},22);cio.unobserve(el);}}),{threshold:.5});document.querySelectorAll("[data-count]").forEach(c=>cio.observe(c));}

/* ===== global click delegation ===== */
document.addEventListener("click",e=>{
  const bsw=e.target.closest("[data-bsw]");
  if(bsw){const p=P(+bsw.dataset.bsw),idx=+bsw.dataset.idx,card=bsw.closest(".bgcard"),img=card&&card.querySelector("img"),cols=p.buyColors||p.colors;if(img)img.src=cols[idx].disp||cols[idx].img;if(card)card.querySelectorAll("[data-bsw]").forEach(s=>s.classList.toggle("active",s===bsw));return;}
  const sw=e.target.closest("[data-sw]");
  if(sw){const p=P(+sw.dataset.sw),idx=+sw.dataset.idx,card=sw.closest(".pcard,.lcard"),img=card&&card.querySelector("img");if(img)img.src=p.colors[idx].disp||p.colors[idx].img;if(card)card.querySelectorAll("[data-sw]").forEach(s=>s.classList.toggle("active",s===sw));return;}
  const wishBtn=e.target.closest("[data-wish]");if(wishBtn){e.preventDefault();e.stopPropagation();toggleWish(+wishBtn.dataset.wish);return;}
  const addBtn=e.target.closest("[data-add]");if(addBtn){e.stopPropagation();addToCart(+addBtn.dataset.add);return;}
  const buyBtn=e.target.closest("[data-buy]");if(buyBtn){e.stopPropagation();if(buyBtn.closest(".bgcard")){openBuy(+buyBtn.dataset.buy);}else{location.href=productUrl(P(+buyBtn.dataset.buy));}return;}
  const infoBtn=e.target.closest("[data-info]");if(infoBtn){e.stopPropagation();openInfo(infoBtn.dataset.info);return;}
  const bg=e.target.closest(".bgcard");if(bg){openBuy(+bg.dataset.id);return;}
  const promo=e.target.closest(".promo");if(promo&&promo.dataset.page&&!e.target.closest("a,button")){location.href=promo.dataset.page;return;}
  const card=e.target.closest(".pcard,.lcard");
  if(card&&!e.target.closest("[data-sw]")){if(performance.now()-lastDragEnd<250)return;location.href=productUrl(P(+card.dataset.id));}
});

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded",()=>{
  buildShell();
  let th=localStorage.getItem("zamon-theme");if(!th)th=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";setTheme(th);
  initMega();
  // wire shell controls
  document.getElementById("themeBtn").onclick=()=>setTheme(document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark");
  document.querySelectorAll(".lang button").forEach(b=>b.addEventListener("click",()=>applyLang(b.dataset.lang)));
  document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
  document.getElementById("clearCart").onclick=()=>{cart=[];saveCart();updateCount();renderCart();toast(t("cleared"));};
  document.getElementById("checkoutBtn").onclick=()=>{closeCart();setTimeout(openCheckout,300);};
  document.getElementById("modalWrap").querySelector(".mbg").onclick=closeModal;
  const mm=document.getElementById("mobileMenu");
  document.getElementById("burger").onclick=()=>{const o=mm.classList.toggle("open");document.body.style.overflow=o?"hidden":"";};
  document.getElementById("searchBtn").onclick=openSearch;
  document.getElementById("searchClose").onclick=closeSearch;
  document.querySelectorAll("#searchOverlay [data-sclose]").forEach(b=>b.onclick=closeSearch);
  document.getElementById("searchInput").addEventListener("input",e=>renderSearch(e.target.value));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSearch();closeModal();closeCart();}});
  // newsletter form (if present)
  const nlf=document.getElementById("nlForm");if(nlf)nlf.addEventListener("submit",e=>{e.preventDefault();nlf.reset();toast(t("nl_done"));});
  // render dynamic regions present on this page
  if(document.getElementById("lineupTrack"))renderLineup();
  if(document.getElementById("storebar"))renderStoreBar();
  if(document.getElementById("showcaseBox"))renderShowcase();
  if(document.getElementById("accMarqueeSec"))renderAccMarquee();
  if(document.getElementById("faqBox"))renderFAQ();
  if(document.getElementById("guarantees"))renderGuarantees();
  if(document.getElementById("catalog"))renderCatalog();
  if(document.getElementById("buygrid"))renderBuyGrid();
  if(document.getElementById("chapnav"))renderChapnav();
  if(document.getElementById("phero")){renderProductHero();renderSubnav();renderHighlights();renderFeatures();renderWhyProd();initSubnavSpy();}
  if(document.getElementById("compare-models"))renderCompare();
  if(document.getElementById("modelpage"))renderModelPage();
  if(document.getElementById("cfg"))renderConfigurator();
  if(document.getElementById("checkout"))renderCheckout();
  if(document.getElementById("account"))renderAccount();
  if(document.getElementById("product"))renderProduct();
  if(document.getElementById("accgrid"))renderAccessories();
  if(document.getElementById("compareTool"))renderCompareTool();
  if(document.getElementById("tradein"))renderTradeIn();
  if(document.getElementById("support"))renderSupport();
  if(document.getElementById("contact"))renderContact();
  if(document.getElementById("about"))renderAbout();
  updateCount();renderCart();applyLang(LANG);
  observeReveal();initCounters();initParallax();
  // hero parallax
  const heroImg=document.getElementById("heroImg");
  if(heroImg&&matchMedia("(min-width:861px)").matches){addEventListener("mousemove",e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;heroImg.style.transform=`translate(${x*20}px,${y*14}px)`;});}
  // filters/search (home catalog)
  const filters=document.getElementById("filters");
  if(filters)filters.addEventListener("click",e=>{const chip=e.target.closest(".chip");if(!chip)return;filters.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));chip.classList.add("active");currentFilter=chip.dataset.f;renderCatalog();});
  const search=document.getElementById("search");if(search)search.addEventListener("input",e=>{currentSearch=e.target.value.trim();renderCatalog();});
});
