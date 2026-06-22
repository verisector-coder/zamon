"use strict";
/* ============================================================
   ZAMON — shared app (multi-page): data, i18n, shell, logic
   ============================================================ */
const A="https://www.apple.com";
const SCH=k=>"https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/"+k+"?wid=900&hei=900&fmt=png-alpha";
function imgFallback(img){
  const box=img.closest(".media,.ci-img,.lc-media,.buy-media,.info-media,.cfg-media,.phero,.fimg,.promo");
  if(!box||box.classList.contains("phero")||box.classList.contains("fimg")||box.classList.contains("promo")){img.style.visibility="hidden";return;}
  box.classList.add("media-fb");box.setAttribute("data-fb",img.getAttribute("data-emoji")||"📦");img.remove();
}

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
 {id:8,line:"iPad",name:"iPad Pro",cat:"tablet",price:13990,old:0,rating:5,new:true,emoji:"📲",modelPage:"ipad-pro.html",
  tag:{ru:"Чип M5 · Ultra Retina XDR",tj:"Чипи M5 · Ultra Retina XDR",en:"M5 · Ultra Retina XDR"},
  colors:[{n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:A+"/v/ipad-pro/aw/images/overview/design/design_hero_endframe__0uk1xnayimay_large.png"}]},
 {id:9,line:"iPad",name:"iPad Air",cat:"tablet",price:8490,old:0,rating:5,new:false,emoji:"📲",
  tag:{ru:"Лёгкий, быстрый, универсальный",tj:"Сабук, тез, бисёрвазифа",en:"Light, fast, versatile"},
  colors:[{n:{ru:"Серый космос",tj:"Хокистарӣ",en:"Space Gray"},hex:"#7d7e80",img:A+"/v/ipad-air/ah/images/overview/hero/hero_endframe__6gl84bccyaqi_large.png"}]},
 {id:10,line:"Apple Watch",name:"Watch Ultra 3",cat:"watch",price:9990,old:0,rating:5,new:true,emoji:"⌚",modelPage:"apple-watch-ultra-3.html",
  tag:{ru:"Титан · GPS · до 42 часов",tj:"Титан · GPS · то 42 соат",en:"Titanium · GPS · up to 42h"},
  colors:[{n:{ru:"Натуральный титан",tj:"Титани табиӣ",en:"Natural Titanium"},hex:"#b9b2a8",img:A+"/v/apple-watch-ultra-3/b/images/overview/welcome/hero_endframe__e4ls9pihykya_large_2x.jpg"}]},
 {id:11,line:"Apple Watch",name:"Watch Series 11",cat:"watch",price:4990,old:0,rating:5,new:false,emoji:"⌚",
  tag:{ru:"Здоровье и фитнес каждый день",tj:"Саломатӣ ва фитнес ҳар рӯз",en:"Health and fitness, every day"},
  colors:[{n:{ru:"Чёрный",tj:"Сиёҳ",en:"Black"},hex:"#2b2b2e",img:A+"/v/apple-watch-series-11/c/images/overview/product-viewer/product_design_endframe__d7wjctwjpbo2_large.jpg"}]},
 {id:12,line:"AirPods",name:"AirPods Pro 3",cat:"audio",price:2490,old:0,rating:5,new:true,emoji:"🎧",modelPage:"airpods-pro.html",
  tag:{ru:"Шумоподавление нового поколения",tj:"Бартарафсозии садо насли нав",en:"Next-gen noise cancellation"},
  colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:A+"/v/airpods/ae/images/overview/hero_endframe__calpooy4ucr6_large_2x.jpg"}]},
 {id:13,line:"AirPods",name:"AirPods 4",cat:"audio",price:1590,old:0,rating:4,new:false,emoji:"🎧",
  tag:{ru:"Удобная посадка и чистый звук",tj:"Шинонидани бароҳат ва садои тоза",en:"Comfy fit, crisp sound"},
  colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:A+"/v/airpods/ae/images/overview/hero__gb4d3fd8jnu6_large_2x.jpg"}]},
 {id:14,line:"AirPods",name:"AirPods Max",cat:"audio",price:5990,old:0,rating:5,new:false,emoji:"🎧",
  tag:{ru:"Наушники высшего класса",tj:"Гӯшмонакҳои дараҷаи олӣ",en:"Premium over-ear sound"},
  colors:[
   {n:{ru:"Синий",tj:"Кабуд",en:"Blue"},hex:"#5d7d99",img:A+"/v/airpods/ae/images/overview/airpods_max_blue__fsfaleh1smuu_large.png"},
   {n:{ru:"Чёрный",tj:"Сиёҳ",en:"Midnight"},hex:"#2b2b2e",img:A+"/v/airpods/ae/images/overview/airpods_max_black__x3byrd2venmu_large.png"},
   {n:{ru:"Фиолетовый",tj:"Бунафш",en:"Purple"},hex:"#b8b0c8",img:A+"/v/airpods/ae/images/overview/airpods_max_purple__d9y3g3n7cnyq_large.png"},
   {n:{ru:"Оранжевый",tj:"Норанҷӣ",en:"Orange"},hex:"#e08a5b",img:A+"/v/airpods/ae/images/overview/airpods_max_orange__gln3ifz5o9ei_large.png"}]}
];
const P=id=>PRODUCTS.find(p=>p.id===id);
const mainImg=p=>p.card||p.colors[0].img;

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
const WBANDS_S=[
 {n:{ru:"Спортивный ремешок",tj:"Тасмаи варзишӣ",en:"Sport Band"},hex:"#2b2b2e",add:0,desc:{ru:"Мягкий флуороэластомер — на каждый день и спорт.",tj:"Флуороэластомери нарм — барои ҳар рӯз.",en:"Soft fluoroelastomer for everyday and sport."}},
 {n:{ru:"Спортивный браслет",tj:"Sport Loop",en:"Sport Loop"},hex:"#5d7d99",add:0,desc:{ru:"Дышащий нейлон с лёгкой регулировкой.",tj:"Нейлони нафаскашанда бо танзими осон.",en:"Breathable nylon with easy adjustment."}},
 {n:{ru:"Миланская петля",tj:"Milanese Loop",en:"Milanese Loop"},hex:"#c9b27d",add:1200,desc:{ru:"Плетёная нержавеющая сталь с магнитной застёжкой.",tj:"Пӯлоди зангногир бо басти магнитӣ.",en:"Woven stainless steel with a magnetic closure."}},
 {n:{ru:"Плетёный ремешок",tj:"Braided Loop",en:"Braided Solo Loop"},hex:"#6e6e73",add:600,desc:{ru:"Эластичный плетёный — без застёжек.",tj:"Эластикии бофта — бе баст.",en:"Stretchy braided design — no clasp."}}];
/* Watch Ultra 3 (titanium, 49mm) */
delete P(10).card;P(10).tint="linear-gradient(180deg,#e6e8ec,#d3d7dd)";
P(10).colors=[
 {n:{ru:"Натуральный титан",tj:"Титани табиӣ",en:"Natural Titanium"},hex:"#b9b2a8",img:WCASE("49","titanium","natural","","ultra3")},
 {n:{ru:"Чёрный титан",tj:"Титани сиёҳ",en:"Black Titanium"},hex:"#39383c",img:WCASE("49","titanium","black","","ultra3")}];
P(10).gallery=[WG("ultra-case-unselect-gallery-2-202509"),WG("ultra-case-unselect-gallery-3-202509")];
P(10).bandImgs=[WG("ultra-band-unselect-gallery-1-202509"),WG("ultra-band-unselect-gallery-2-202509"),WG("ultra-band-unselect-gallery-3-202509")];
P(10).bands=[
 {n:{ru:"Trail Loop",tj:"Trail Loop",en:"Trail Loop"},hex:"#3a3a3d",add:0,desc:{ru:"Лёгкий тканый — для бега и тренировок.",tj:"Бофтаи сабук — барои давидан.",en:"Light woven band for running and workouts."}},
 {n:{ru:"Alpine Loop",tj:"Alpine Loop",en:"Alpine Loop"},hex:"#c98a3d",add:300,desc:{ru:"Прочный двухслойный с титановым G-крюком.",tj:"Дуқабатаи мустаҳкам бо кармаки титанӣ.",en:"Rugged two-layer weave with a titanium G-hook."}},
 {n:{ru:"Ocean Band",tj:"Ocean Band",en:"Ocean Band"},hex:"#1f4d6b",add:300,desc:{ru:"Для водного спорта и дайвинга.",tj:"Барои варзиши обӣ ва ғаввосӣ.",en:"For water sports and recreational diving."}}];
/* Watch Series 11 (aluminum + titanium, 42/46mm) */
delete P(11).card;P(11).tint="linear-gradient(180deg,#f5f3f1,#ece8e4)";
const S11_ALU=[
 {n:{ru:"Тёмная ночь",tj:"Шаби торик",en:"Jet Black"},hex:"#2b2b2e",img:WCASE("46","aluminum","jetblack","nc","s11")},
 {n:{ru:"Розовое золото",tj:"Тиллои гулобӣ",en:"Rose Gold"},hex:"#e7c8b8",img:WCASE("46","aluminum","rosegold","nc","s11")},
 {n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#dcdee0",img:WCASE("46","aluminum","silver","nc","s11")},
 {n:{ru:"Серый космос",tj:"Хокистарӣ",en:"Space Gray"},hex:"#6e6e73",img:WCASE("46","aluminum","spacegray","nc","s11")}];
const S11_TI=[
 {n:{ru:"Золотой титан",tj:"Титани тиллоӣ",en:"Gold Titanium"},hex:"#c9a96a",img:WCASE("46","titanium","gold","cell","s11")},
 {n:{ru:"Грифельный титан",tj:"Титани графитӣ",en:"Slate Titanium"},hex:"#4a4744",img:WCASE("46","titanium","slate","cell","s11")},
 {n:{ru:"Натуральный титан",tj:"Титани табиӣ",en:"Natural Titanium"},hex:"#b9b2a8",img:WCASE("46","titanium","natural","cell","s11")}];
P(11).colors=S11_ALU;
P(11).materials=[
 {n:{ru:"Алюминий",tj:"Алюминий",en:"Aluminum"},add:0,fromPrice:4990,finishes:S11_ALU,
  desc:{ru:"Матовые и глянцевые финиши и прочное стекло Ion-X.",tj:"Финишҳои матт ва ялақ ва шишаи мустаҳками Ion-X.",en:"Matte and polished finishes with a durable Ion-X glass display."}},
 {n:{ru:"Титан",tj:"Титан",en:"Titanium"},add:2000,fromPrice:6990,finishes:S11_TI,
  desc:{ru:"Полированный авиационный титан и сапфировое стекло.",tj:"Титани ҳавопаймоии ялақ ва шишаи сапфир.",en:"Polished aerospace-grade titanium with a sapphire crystal display."}}];
P(11).variants=[
 {n:{ru:"42 мм",tj:"42 мм",en:"42mm"},add:0,sub:{ru:"Компактный размер",tj:"Андозаи ҷайбӣ",en:"Compact size"}},
 {n:{ru:"46 мм",tj:"46 мм",en:"46mm"},add:800,sub:{ru:"Большой дисплей",tj:"Дисплейи калон",en:"Larger display"}}];
P(11).bands=WBANDS_S;
P(11).gallery=[WG("s11-case-unselect-gallery-2-202509"),WG("s11-case-unselect-gallery-3-202509")];
P(11).bandImgs=[WG("s11-band-unselect-gallery-1-202509")];
/* Watch SE 3 (new — matches Apple lineup) */
PRODUCTS.push({id:15,line:"Apple Watch",name:"Watch SE 3",cat:"watch",price:6490,old:0,rating:5,new:false,emoji:"⌚",
 tag:{ru:"Главное о здоровье по доступной цене",tj:"Асосиҳои саломатӣ бо нархи дастрас",en:"Essential health features, great value"},tint:"linear-gradient(180deg,#e7f0fb,#d6e6f7)",
 colors:[
  {n:{ru:"Тёмная ночь",tj:"Шаби торик",en:"Midnight"},hex:"#2e3138",img:WCASE("44","aluminum","midnight","nc","se3")},
  {n:{ru:"Сияющая звезда",tj:"Ситоравӣ",en:"Starlight"},hex:"#e9e0d2",img:WCASE("44","aluminum","starlight","nc","se3")}],
 variants:[
  {n:{ru:"40 мм",tj:"40 мм",en:"40mm"},add:0,sub:{ru:"Компактный размер",tj:"Андозаи ҷайбӣ",en:"Compact size"}},
  {n:{ru:"44 мм",tj:"44 мм",en:"44mm"},add:500,sub:{ru:"Большой дисплей",tj:"Дисплейи калон",en:"Larger display"}}],
 bands:[WBANDS_S[0],WBANDS_S[1]],bandImgs:[WG("s11-band-unselect-gallery-1-202509")]});
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
const STORAGE={1:[[256,0],[512,2200],[1024,4800]],2:[[256,0],[512,2200]],3:[[256,0],[512,2000]],4:[[128,0],[256,1500]],5:[[128,0],[256,1500]],6:[[512,0],[1024,5000],[2048,12000]],7:[[256,0],[512,2500],[1024,6000]],8:[[256,0],[512,2500],[1024,6000]],9:[[128,0],[256,2000]],16:[[256,0],[512,2200]]};
PRODUCTS.forEach(p=>{const s=STORAGE[p.id];if(s)p.storage=s.map(([gb,add])=>({gb,add}));});
/* submodel variants (size / Pro·Pro Max) [label, +price, sub] */
const VARIANTS={
 1:[[{ru:"iPhone 17 Pro",tj:"iPhone 17 Pro",en:"iPhone 17 Pro"},0,{ru:"Экран 6,3″",tj:"Экран 6,3″",en:"6.3″ display"}],[{ru:"iPhone 17 Pro Max",tj:"iPhone 17 Pro Max",en:"iPhone 17 Pro Max"},2500,{ru:"Экран 6,9″ · батарея больше",tj:"Экран 6,9″ · батареяи калонтар",en:"6.9″ display · bigger battery"}]],
 6:[[{ru:"14″ MacBook Pro",tj:"14″ MacBook Pro",en:"14″ MacBook Pro"},0,{ru:"Компактный профи",tj:"Касбии ҷайбӣ",en:"Compact pro"}],[{ru:"16″ MacBook Pro",tj:"16″ MacBook Pro",en:"16″ MacBook Pro"},4000,{ru:"Большой экран · мощнее",tj:"Экрани калон · пурқувваттар",en:"Bigger display · more power"}]],
 8:[[{ru:"11″ iPad Pro",tj:"11″ iPad Pro",en:"11″ iPad Pro"},0,{ru:"Лёгкий и портативный",tj:"Сабук ва портативӣ",en:"Light and portable"}],[{ru:"13″ iPad Pro",tj:"13″ iPad Pro",en:"13″ iPad Pro"},2500,{ru:"Больше места для работы",tj:"Ҷои бештар барои кор",en:"More room to work"}]]
};
PRODUCTS.forEach(p=>{const v=VARIANTS[p.id];if(v)p.variants=v.map(([n,add,sub])=>({n,add,sub}));});
/* configurator add-ons (per category, TJS) */
const CARE={phone:1490,laptop:2990,tablet:1490,watch:990,audio:490};
const TRADEIN={phone:3000,laptop:5000,tablet:2500,watch:1200,audio:600};
/* accessories (cat:"acc" — excluded from lineups/catalog, shown on accessories.html; P()/cart/search work) */
const ACCSC="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/";
const accImg=k=>ACCSC+k+"?wid=800&hei=800&fmt=png-alpha";
const ACC1=A+"/v/apple-pencil/ag/images/overview/hero/hero__cwrg2eertpyu_large_2x.png";
PRODUCTS.push(
 {id:101,line:"AirTag",name:"AirTag",cat:"acc",price:290,rating:5,new:false,emoji:"🔵",tag:{ru:"Находите вещи без труда",tj:"Чизҳоро бе душворӣ ёбед",en:"Keep track of your things"},colors:[{n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#e8e8ea",img:accImg("airtag-single-select-202104")}]},
 {id:102,line:"AirTag",name:"AirTag · 4-pack",cat:"acc",price:990,rating:5,new:false,emoji:"🔵",tag:{ru:"Комплект из четырёх",tj:"Маҷмӯи чаҳорто",en:"Pack of four"},colors:[{n:{ru:"Серебристый",tj:"Нуқрагӣ",en:"Silver"},hex:"#e8e8ea",img:accImg("HS942")}]},
 {id:103,line:"Apple Pencil",name:"Apple Pencil Pro",cat:"acc",price:1490,rating:5,new:true,emoji:"✏️",tag:{ru:"Пишите и рисуйте точно",tj:"Дақиқ нависед ва расм кашед",en:"Write and draw with precision"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:ACC1}]},
 {id:104,line:"MagSafe",name:"MagSafe Charger",cat:"acc",price:490,rating:5,new:false,emoji:"🔌",tag:{ru:"Быстрая беспроводная зарядка",tj:"Заряди тези бесим",en:"Fast wireless charging"},colors:[{n:{ru:"Белый",tj:"Сафед",en:"White"},hex:"#f2f2f2",img:accImg("HSG72")}]},
 {id:105,line:"Case",name:"iPhone Case · MagSafe",cat:"acc",price:390,rating:5,new:false,emoji:"📱",tag:{ru:"Защита с поддержкой MagSafe",tj:"Ҳифз бо дастгирии MagSafe",en:"Protection with MagSafe"},colors:[{n:{ru:"Прозрачный",tj:"Шаффоф",en:"Clear"},hex:"#dfe3e8",img:accImg("MHWJ4")}]},
 {id:106,line:"Case",name:"iPhone Clear Case",cat:"acc",price:390,rating:4,new:false,emoji:"📱",tag:{ru:"Прозрачный чехол с MagSafe",tj:"Ғилофи шаффоф бо MagSafe",en:"Clear case with MagSafe"},colors:[{n:{ru:"Прозрачный",tj:"Шаффоф",en:"Clear"},hex:"#dfe3e8",img:accImg("MHWC4")}]}
);
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
  heroVideo:A+"/105/media/us/apple-watch-series-11/2025/ff7157de-c561-48f6-8427-90c1ce5498d1/anim/hero/medium.mp4",
  tagline:{ru:"Здоровье и фитнес на запястье",tj:"Саломатӣ ва фитнес дар дастатон",en:"Health and fitness on your wrist"},
  desc:{ru:"От прочных Watch Ultra 3 для спорта до Watch Series 11 на каждый день — забота о здоровье 24/7.",tj:"Аз Watch Ultra 3-и мустаҳкам барои варзиш то Watch Series 11 барои ҳар рӯз — ғамхории саломатӣ 24/7.",en:"From the rugged Watch Ultra 3 to the everyday Watch Series 11 — 24/7 health tracking."},
  feats:[{ru:"Титановый корпус (Ultra)",tj:"Корпуси титанӣ (Ultra)",en:"Titanium case (Ultra)"},{ru:"GPS и сотовая связь",tj:"GPS ва алоқаи мобилӣ",en:"GPS + Cellular"},{ru:"До 42 часов работы",tj:"То 42 соат кор",en:"Up to 42h battery"}]},
 {key:"airpods",cat:"audio",page:"airpods.html",buyPage:"buy-airpods.html",grad:"linear-gradient(180deg,#f3f4f6,#e6e8ee)",emoji:"🎧",
  img:A+"/v/airpods/ae/images/overview/airpods_max_blue__fsfaleh1smuu_large.png",name:"AirPods",
  heroVideo:A+"/105/media/us/airpods-pro/2025/7acffb13-4adb-40b1-9393-8f1c99bc6c90/anim/hero/medium.mp4",
  tagline:{ru:"Звук, который тебя окружает",tj:"Садое, ки шуморо иҳота мекунад",en:"Sound that surrounds you"},
  desc:{ru:"AirPods Pro 3 с топовым шумоподавлением, лёгкие AirPods 4 и полноразмерные AirPods Max.",tj:"AirPods Pro 3 бо бартарафсозии беҳтарини садо, AirPods 4-и сабук ва AirPods Max.",en:"AirPods Pro 3 with top-tier noise cancellation, lightweight AirPods 4 and over-ear AirPods Max."},
  feats:[{ru:"Активное шумоподавление",tj:"Бартарафсозии фаъоли садо",en:"Active Noise Cancellation"},{ru:"Пространственный звук",tj:"Садои фазоӣ",en:"Spatial Audio"},{ru:"До 30 часов с кейсом",tj:"То 30 соат бо кейс",en:"Up to 30h with case"}]}
];
const LI=key=>LINE_INFO.find(l=>l.key===key);
const LIcat=cat=>LINE_INFO.find(l=>l.cat===cat);

/* ===== PAGEDATA: rich product-page content (highlights + advantages) ===== */
const IM=A+"/v/";
const PAGEDATA={
 iphone:{why:{ru:"Почему iPhone 17 Pro",tj:"Чаро iPhone 17 Pro",en:"Why iPhone 17 Pro"},
  highlights:[
   {dark:1,img:IM+"iphone-17-pro/g/images/overview/cameras/intro/hero_camera__f42igewygpqy_large_2x.jpg",h:{ru:"Революционная система камер. Теперь до <b>48 Мп</b>.",tj:"Системаи камераи инқилобӣ. Акнун то <b>48 Мп</b>.",en:"A revolutionary camera system. Now up to <b>48 MP</b>."}},
   {dark:1,img:IM+"iphone-17-pro/g/images/overview/design/design_endframe__7k7qs1qlnpu6_large_2x.jpg",h:{ru:"<b>Титановый</b> корпус. Невероятно прочный и лёгкий.",tj:"Корпуси <b>титанӣ</b>. Бениҳоят мустаҳкам ва сабук.",en:"<b>Titanium</b> design. Incredibly strong and light."}},
   {dark:1,img:IM+"iphone-17-pro/g/images/overview/performance/chip/performance-hero_endframe__fazyny3rhsuy_large_2x.jpg",h:{ru:"Чип <b>A19 Pro</b> — самый мощный в iPhone.",tj:"Чипи <b>A19 Pro</b> — пурқувваттарин дар iPhone.",en:"The <b>A19 Pro</b> chip — the most powerful in iPhone."}}],
  adv:[{ic:"🛡️",h:{ru:"Титановый корпус",tj:"Корпуси титанӣ",en:"Titanium design"},p:{ru:"Прочнее и легче стали — выдержит любой день.",tj:"Аз пӯлод мустаҳкамтар ва сабуктар.",en:"Stronger and lighter than steel."}},
   {ic:"📷",h:{ru:"Камера 48 Мп",tj:"Камераи 48 Мп",en:"48 MP camera"},p:{ru:"Профессиональные фото и видео 4K.",tj:"Аксу видеои касбӣ 4K.",en:"Pro-level photos and 4K video."}},
   {ic:"⚡",h:{ru:"Чип A19 Pro",tj:"Чипи A19 Pro",en:"A19 Pro chip"},p:{ru:"Молниеносная скорость и игры уровня консоли.",tj:"Суръати барқosa ва бозиҳои сатҳи консол.",en:"Blazing speed and console-level gaming."}}]},
 mac:{why:{ru:"Почему Mac",tj:"Чаро Mac",en:"Why Mac"},
  highlights:[
   {dark:0,img:IM+"macbook-air/z/images/overview/display/display_hero__fiig28r0yq2q_large_2x.jpg",h:{ru:"Дисплей <b>Liquid Retina</b>. Яркий, чёткий, красивый.",tj:"Дисплейи <b>Liquid Retina</b>. Равшан ва зебо.",en:"<b>Liquid Retina</b> display. Bright, sharp, beautiful."}},
   {dark:1,img:IM+"macbook-pro/ax/images/overview/battery/battery_hero__db4y37bs7cmu_large_2x.jpg",h:{ru:"До <b>18 часов</b> работы от одной зарядки.",tj:"То <b>18 соат</b> кор аз як заряд.",en:"Up to <b>18 hours</b> of battery life."}},
   {dark:0,img:IM+"macbook-pro/ax/images/overview/display/display_hero__c32k5z50p94y_large_2x.jpg",h:{ru:"Дисплей <b>Liquid Retina XDR</b> на MacBook Pro.",tj:"Дисплейи <b>Liquid Retina XDR</b> дар MacBook Pro.",en:"<b>Liquid Retina XDR</b> display on MacBook Pro."}}],
  adv:[{ic:"⚡",h:{ru:"Чипы M4 / M5",tj:"Чипҳои M4 / M5",en:"M4 / M5 chips"},p:{ru:"Невероятная скорость при полной тишине.",tj:"Суръати бениҳоят дар оромии комил.",en:"Incredible speed, whisper quiet."}},
   {ic:"🔋",h:{ru:"До 18 часов",tj:"То 18 соат",en:"Up to 18 hours"},p:{ru:"Работает весь день без подзарядки.",tj:"Тамоми рӯз бе заряд кор мекунад.",en:"All-day battery, no charger needed."}},
   {ic:"🖥️",h:{ru:"Дисплей Retina",tj:"Дисплейи Retina",en:"Retina display"},p:{ru:"Миллиарды цветов и невероятная чёткость.",tj:"Миллиардҳо ранг ва возеҳии аҷиб.",en:"Billions of colors, stunning clarity."}}]},
 ipad:{why:{ru:"Почему iPad Pro",tj:"Чаро iPad Pro",en:"Why iPad Pro"},
  highlights:[
   {dark:1,img:IM+"ipad-pro/aw/images/overview/chip/chip_hero_endframe__becrgbad20j6_large_2x.jpg",h:{ru:"Чип <b>M5</b> — мощь компьютера в планшете.",tj:"Чипи <b>M5</b> — қуввати компютер дар планшет.",en:"The <b>M5</b> chip — computer power in a tablet."}},
   {dark:0,img:IM+"ipad-pro/aw/images/overview/display/display_hero_endframe__fr1073m9t56y_large_2x.jpg",h:{ru:"Дисплей <b>Ultra Retina XDR</b>. Невероятно тонкий.",tj:"Дисплейи <b>Ultra Retina XDR</b>. Бениҳоят тунук.",en:"<b>Ultra Retina XDR</b> display. Impossibly thin."}}],
  adv:[{ic:"⚡",h:{ru:"Чип M5",tj:"Чипи M5",en:"M5 chip"},p:{ru:"Справится с любой задачей и игрой.",tj:"Бо ҳар вазифа ва бозӣ мерасад.",en:"Handles any task or game."}},
   {ic:"✏️",h:{ru:"Apple Pencil Pro",tj:"Apple Pencil Pro",en:"Apple Pencil Pro"},p:{ru:"Рисуйте и пишите с точностью до пикселя.",tj:"Бо дақиқии пиксел нависед ва расм кашед.",en:"Draw and write with pixel precision."}},
   {ic:"🖥️",h:{ru:"Ultra Retina XDR",tj:"Ultra Retina XDR",en:"Ultra Retina XDR"},p:{ru:"Самый продвинутый дисплей iPad.",tj:"Пешрафтатарин дисплейи iPad.",en:"The most advanced iPad display."}}]},
 watch:{why:{ru:"Почему Apple Watch",tj:"Чаро Apple Watch",en:"Why Apple Watch"},
  highlights:[
   {dark:0,img:IM+"apple-watch-series-11/c/images/overview/health/health_hero__bs99gittogoi_large_2x.jpg",h:{ru:"Передовые датчики <b>здоровья</b> прямо на запястье.",tj:"Сенсорҳои пешрафтаи <b>саломатӣ</b> дар дастатон.",en:"Advanced <b>health</b> sensors right on your wrist."}},
   {dark:0,img:IM+"apple-watch-series-11/c/images/overview/fitness/fitness_hero__f9uqyx14gmmq_large_2x.jpg",h:{ru:"Точные метрики для <b>бега</b> и любых тренировок.",tj:"Метрикаи дақиқ барои <b>давидан</b> ва машқҳо.",en:"Precise metrics for <b>running</b> and any workout."}},
   {dark:0,img:IM+"apple-watch-series-11/c/images/overview/on-the-go/go_hero__ghlevcvsmr6u_large_2x.jpg",h:{ru:"Всегда на связи, даже без телефона рядом.",tj:"Ҳамеша дар тамос, ҳатто бе телефон.",en:"Always connected, even without your phone."}}],
  adv:[{ic:"❤️",h:{ru:"Здоровье 24/7",tj:"Саломатӣ 24/7",en:"Health 24/7"},p:{ru:"Пульс, ЭКГ, кислород в крови и контроль сна.",tj:"Набз, ЭКГ, оксиген ва назорати хоб.",en:"Heart rate, ECG, blood oxygen and sleep tracking."}},
   {ic:"🏃",h:{ru:"Фитнес и активность",tj:"Фитнес ва фаъолият",en:"Fitness and activity"},p:{ru:"Кольца активности и десятки видов тренировок.",tj:"Ҳалқаҳои фаъолият ва даҳҳо намуди машқ.",en:"Activity rings and dozens of workout types."}},
   {ic:"📡",h:{ru:"Всегда на связи",tj:"Ҳамеша дар тамос",en:"Always connected"},p:{ru:"Звонки, сообщения и Apple Pay прямо с запястья.",tj:"Занг, паём ва Apple Pay аз дастатон.",en:"Calls, messages and Apple Pay from your wrist."}}]},
 airpods:{why:{ru:"Почему AirPods",tj:"Чаро AirPods",en:"Why AirPods"},
  highlights:[
   {dark:0,img:IM+"airpods/ae/images/overview/hero_endframe__calpooy4ucr6_large_2x.jpg",h:{ru:"Активное <b>шумоподавление</b> нового поколения.",tj:"<b>Бартарафсозии садо</b>и насли нав.",en:"Next-generation active <b>Noise Cancellation</b>."}},
   {dark:0,img:IM+"airpods/ae/images/overview/airpods_max_blue__fsfaleh1smuu_large.png",h:{ru:"<b>AirPods Max</b> — звук высшего класса.",tj:"<b>AirPods Max</b> — садои дараҷаи олӣ.",en:"<b>AirPods Max</b> — high-fidelity sound."}}],
  adv:[{ic:"🔇",h:{ru:"Шумоподавление",tj:"Бартарафсозии садо",en:"Noise Cancellation"},p:{ru:"Полное погружение в музыку где угодно.",tj:"Ғарқшавии пурра дар мусиқӣ.",en:"Total immersion in your music."}},
   {ic:"🎧",h:{ru:"Пространственный звук",tj:"Садои фазоӣ",en:"Spatial Audio"},p:{ru:"Объёмное звучание вокруг вас.",tj:"Садои ҳаҷмӣ дар атрофи шумо.",en:"Immersive surround sound."}},
   {ic:"🔋",h:{ru:"До 30 часов",tj:"То 30 соат",en:"Up to 30 hours"},p:{ru:"Долгая работа вместе с зарядным кейсом.",tj:"Кори дароз бо кейси заряд.",en:"Long battery life with the charging case."}}]}
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
function renderHighlights(){
  const el=document.getElementById("highlights");if(!el)return;const pd=PAGEDATA[curLine()];if(!pd)return;
  el.innerHTML=`<div class="wrap"><div class="sec-head reveal"><h2>${t("pp_highlights")}</h2></div>
    <div class="carousel" id="hlCar" data-dots="hlDots">
      <button class="car-arrow prev" aria-label="prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
      <div class="car-viewport"><div class="car-track">${pd.highlights.map(h=>`<div class="hl-card ${h.dark?"dark":""}"><div class="hl-h">${tr(h.h)}</div><img class="hl-img" src="${h.img}" alt="" loading="lazy" onerror="this.style.display='none'"></div>`).join("")}</div></div>
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
 1:{chip:"A19 Pro",display:"6.3″ OLED",battery:"до 33 ч"},2:{chip:"A19 Pro",display:"6.5″ OLED",battery:"до 27 ч"},
 3:{chip:"A19",display:"6.3″ OLED",battery:"до 30 ч"},4:{chip:"A19",display:"6.1″ OLED",battery:"до 26 ч"},5:{chip:"A18",display:"6.1″ OLED",battery:"до 22 ч"},
 6:{chip:"M5 Pro / M5 Max",display:"14″ или 16″ XDR",battery:"до 24 ч"},7:{chip:"M4",display:"15″ Retina",battery:"до 18 ч"},16:{chip:"M5",display:"13″ Retina",battery:"до 18 ч"},
 8:{chip:"M5",display:"13″ XDR",battery:"до 10 ч"},9:{chip:"M3",display:"11″ Retina",battery:"до 10 ч"},
 10:{chip:"S11",display:"49 мм Ti",battery:"до 42 ч"},11:{chip:"S11",display:"46 мм",battery:"до 24 ч"},15:{chip:"S10",display:"44 мм OLED",battery:"до 18 ч"},
 12:{chip:"H3 · ANC",display:"USB-C",battery:"до 8 ч"},13:{chip:"H2",display:"USB-C",battery:"до 5 ч"},14:{chip:"H1 · ANC",display:"Over-ear",battery:"до 20 ч"}
};
function renderCompare(){
  const box=document.getElementById("compare-models");if(!box)return;
  const items=PRODUCTS.filter(p=>p.cat===box.dataset.cat);if(!items.length)return;
  const rows=[["spec_price",p=>fmtPrice(p.price)],["spec_chip",p=>(SPECS[p.id]||{}).chip||"—"],["spec_display",p=>(SPECS[p.id]||{}).display||"—"],["spec_battery",p=>(SPECS[p.id]||{}).battery||"—"]];
  box.innerHTML=`<div class="wrap"><div class="sec-head reveal"><h2>${t("cmp_h")}</h2></div>
    <div class="cmp-scroll"><table class="cmp-table"><thead><tr><th></th>${items.map(p=>`<th><div class="cmp-prod"><img src="${(p.buyColors||p.colors)[0].img}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"><span>${p.name}</span><button class="add" data-buy="${p.id}">${t("pp_buy")}</button></div></th>`).join("")}</tr></thead>
    <tbody>${rows.map(([lbl,fn])=>`<tr><td class="cmp-lbl">${t(lbl)}</td>${items.map(p=>`<td>${fn(p)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
  observeReveal();
}

/* ===== MODEL PAGE (Apple Watch Ultra 3 — 1:1) ===== */
const WU=A+"/v/apple-watch-ultra-3/b/images/overview/";
const MODELS={
 ultra3:{name:"Apple Watch Ultra 3",productId:10,price:9990,eyebrow:"⌚ Watch Ultra 3",
  heroVideo:LI("watch").heroVideo,
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
 airpodspro3:{name:"AirPods Pro 3",productId:12,price:2490,eyebrow:"AirPods Pro 3",light:true,hlLight:true,
  heroVideo:LI("airpods").heroVideo,
  heroImg:A+"/v/airpods/ae/images/overview/hero_endframe__calpooy4ucr6_large.jpg",
  title:{ru:"Звук, который адаптируется.",tj:"Садое, ки мутобиқ мешавад.",en:"Adaptive Audio. Now playing."},
  highlights:[
   {img:A+"/v/airpods/ae/images/overview/consider/card_noise_cancellation__bcl69t06noci_large.jpg",h:{ru:"Активное шумоподавление мирового класса.",tj:"Бартарафсозии садои дараҷаи ҷаҳонӣ.",en:"World-class Active Noise Cancellation."}},
   {img:A+"/v/airpods/ae/images/overview/consider/card_personalized_spatial_audio__d9ghs2utja82_large.jpg",h:{ru:"Персональный пространственный звук.",tj:"Садои фазоии шахсӣ.",en:"Personalized Spatial Audio."}},
   {img:A+"/v/airpods/ae/images/overview/consider/card_hearing_health__ss2uxyv3j5m6_large.jpg",h:{ru:"Функции для здоровья слуха.",tj:"Функсияҳо барои саломатии шунавоӣ.",en:"Hearing health features."}},
   {img:A+"/v/airpods/ae/images/overview/consider/card_heart_rate_sensing__exas9s71qo4m_large.jpg",h:{ru:"Датчик пульса прямо в наушниках.",tj:"Сенсори набз дар гӯшмонак.",en:"Heart rate sensing, built in."}},
   {img:A+"/v/airpods/ae/images/overview/consider/card_live_translation__ep68h9wscbee_large.jpg",h:{ru:"Живой перевод в реальном времени.",tj:"Тарҷумаи зинда дар вақти воқеӣ.",en:"Live Translation on the go."}}]
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
 ]
};
const ICON_PLAY='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const ICON_PAUSE='<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
function renderModelPage(){
  const root=document.getElementById("modelpage");if(!root)return;
  const m=MODELS[root.dataset.model];if(!m)return;
  document.title="ZAMON — "+m.name;
  const specs=TECHSPECS[root.dataset.model];
  const subnav=`<div class="psubnav"><div class="psubnav-in"><span class="pn-name">${m.name}</span>
    <a href="#mhl">${t("pp_highlights")}</a>${m.explorer?`<a href="#mxplor">${tr({ru:"Поближе",tj:"Аз наздик",en:"Closer look"})}</a>`:""}${specs?`<a href="#mspecs">${t("spec_nav")}</a>`:""}
    <a class="pn-buy" href="buy.html?id=${m.productId}">${t("pp_buy")}</a></div></div>`;
  const mhMedia=m.heroVideo
    ? `<video class="mh-img mh-video" autoplay muted loop playsinline preload="auto" poster="${m.heroImg}" aria-label="${m.name}"><source src="${m.heroVideo}" type="video/mp4"></video>`
    : `<img class="mh-img" src="${m.heroImg}" alt="${m.name}" onerror="imgFallback(this)">`;
  const heroFull=`<section class="mhero ${m.light?"light":""}"><div class="mh-eyebrow">${m.eyebrow}</div><h1>${tr(m.title)}</h1>
    ${mhMedia}</section>`;
  const hl=`<section class="sec alt" id="mhl"><div class="wrap"><div class="sec-head reveal"><h2>${t("pp_highlights")}</h2></div>
    <div class="carousel" id="mhlCar">
      <button class="car-arrow prev" aria-label="prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
      <div class="car-viewport"><div class="car-track">${m.highlights.map(h=>`<div class="hl-card ${m.hlLight?"":"dark"}"><div class="hl-h">${tr(h.h)}</div><img class="hl-img" src="${h.img}" alt="" loading="lazy" onerror="this.style.display='none'"></div>`).join("")}</div></div>
      <button class="car-arrow next" aria-label="next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
    </div><div class="hl-controls"><div class="car-dots" id="mhlDots"></div><button class="hl-play" id="mhlPlay">${ICON_PAUSE}</button></div></div></section>`;
  const xp=!m.explorer?"":`<section class="sec xplor-sec" id="mxplor"><div class="sec-head reveal"><h2>${tr({ru:"Рассмотрите поближе.",tj:"Аз наздик бубинед.",en:"Take a closer look."})}</h2></div>
    <div class="mfeats">${m.explorer.map((it,i)=>`<div class="mfeat ${i%2?"rev":""} reveal">
      <div class="mf-text"><h3>${tr(it.label)}</h3><p>${tr(it.desc)}</p>
        ${it.sw?`<div class="mf-sw">${it.sw.map((s,j)=>`<span class="sw ${j===0?"active":""}" data-img="${s.img}" style="background:${s.hex}" title="finish"></span>`).join("")}</div>`:""}</div>
      <div class="mf-media"><img src="${it.img}" alt="${tr(it.label)}" loading="lazy" onerror="this.style.display='none'"></div></div>`).join("")}</div></section>`;
  const cta=`<section class="sec" id="mwhy"><div class="wrap" style="text-align:center">
    <h2 style="font-size:clamp(2rem,4vw,3rem);margin-bottom:14px">${tr({ru:"Готовы к покупке?",tj:"Ба харид тайёред?",en:"Ready to buy?"})}</h2>
    <p style="color:var(--text-2);max-width:520px;margin:0 auto 24px">${tr({ru:"Оригинал, официальная гарантия, кредит 0% и доставка за 24 часа по Таджикистану.",tj:"Аслӣ, кафолати расмӣ, қарзи 0% ва расонидан дар 24 соат.",en:"Genuine, official warranty, 0% financing and 24-hour delivery across Tajikistan."})}</p>
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
 ru:{bar:"🚚 Бесплатная доставка по Таджикистану от 500 сом. · Кредит 0% · Trade-In",region:"Таджикистан",
  n_store:"Магазин",n_mac:"Mac",n_ipad:"iPad",n_iphone:"iPhone",n_watch:"Watch",n_airpods:"AirPods",n_acc:"Аксессуары",n_support:"Поддержка",
  cur:"сом.",from:"от ",mo:"/мес",add:"Купить",buy_now:"Купить",learn:"Узнать подробнее",details:"Подробнее",pieces:"шт.",remove:"Удалить",close:"Закрыть",gb:"ГБ",tb:"ТБ",cfg_storage:"Память",cfg_storage_sub:"Сколько места вам нужно?",
  m_explore:"Обзор",m_shop:"Магазин",m_more:"Ещё",m_all:"Все модели",m_compare:"Сравнить",m_acc:"Аксессуары",m_trade:"Trade-In",m_credit:"Кредит 0%",m_support:"Поддержка",
  cart_title:"Корзина",cart_items:"Товаров",cart_total:"Итого",cart_checkout:"Оформить заказ",cart_clear:"Очистить корзину",cart_empty:"Ваша корзина пуста",cart_empty_sub:"Добавьте устройства из каталога",ship_free:"Бесплатная доставка по Таджикистану",
  co_title:"Оформление заказа",co_sub:"Заполните данные — мы перезвоним для подтверждения.",co_name:"Имя и фамилия",co_phone:"Телефон",co_city:"Город",co_pay:"Способ оплаты",co_pay1:"Наличными при получении",co_pay2:"Картой при получении",co_pay3:"Кредит 0%",co_total:"К оплате",co_submit:"Подтвердить заказ",co_ok_h:"Заказ принят!",co_ok_p:"Спасибо за покупку в ZAMON. Менеджер свяжется с вами в течение 15 минут.",co_ok_btn:"Отлично",
  buy_color:"Цвет",buy_add:"Добавить в корзину",buy_perk1:"Бесплатная доставка по стране",buy_perk2:"Гарантия 1 год",buy_perk3:"Возврат 14 дней",
  cfg_model:"Модель",cfg_model_sub:"Какая вам подходит?",cfg_finish:"Цвет",cfg_finish_sub:"Выберите любимый.",cfg_add:"Добавить в корзину",cfg_total:"Итого",
  cfg_size:"Размер",cfg_size_sub:"Выберите размер.",cfg_storage_label:"Память",cfg_incl:"Включено",cfg_band:"Ремешок",cfg_band_sub:"Подберите свой стиль.",cfg_material:"Корпус",cfg_material_sub:"Начнём с материала и цвета.",
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
  ck_step1:"Доставка",ck_step2:"Оплата",ck_step3:"Подтверждение",ck_addr:"Адрес доставки",ck_method:"Способ получения",ck_courier:"Курьер — 24 часа",ck_courier_s:"Бесплатно от 500 сом.",ck_pickup:"Самовывоз",ck_pickup_s:"Магазин в Душанбе, сегодня",ck_next:"Далее",ck_back:"Назад",ck_place:"Подтвердить заказ",ck_review:"Проверьте заказ",ck_contact:"Контакт",ck_deliv:"Доставка",ck_items:"Товары",ck_email:"Эл. почта (необязательно)",order_num:"Заказ №",ck_to_acc:"Мои заказы",
  acc_title:"Аккаунт",acc_login:"Вход",acc_register:"Регистрация",acc_email:"Эл. почта",acc_pass:"Пароль",acc_name:"Имя",acc_signin:"Войти",acc_signup:"Создать аккаунт",acc_logout:"Выйти",acc_profile:"Профиль",acc_orders:"Заказы",acc_wish:"Избранное",acc_no_orders:"У вас пока нет заказов",acc_no_wish:"В избранном пока пусто",acc_welcome:"С возвращением",acc_login_sub:"Войдите, чтобы видеть заказы и избранное.",acc_reg_sub:"Создайте аккаунт ZAMON за минуту.",acc_to_login:"Уже есть аккаунт? Войти",acc_to_reg:"Нет аккаунта? Зарегистрироваться",acc_status:"В обработке",acc_member:"Клиент ZAMON",wished:"Добавлено в избранное",unwished:"Удалено из избранного",
  added:"Добавлено в корзину",nl_done:"Спасибо! Промокод на скидку 10% отправлен 🎉",cleared:"Корзина очищена",
  f_shop:"Покупки",f_account:"Аккаунт",f_store:"Магазин ZAMON",f_biz:"Для бизнеса",f_about:"О ZAMON",
  f_disc:"Apple, логотип Apple, iPhone, iPad, Mac, Apple Watch и AirPods — товарные знаки Apple Inc. ZAMON — независимый магазин-реселлер. Цены указаны в сомони (TJS). Изображения приведены для ознакомления.",
  f_copy:"© 2026 ZAMON. Все права защищены.",f_made:"Сделано с ❤️ в Таджикистане",
  hero_eyebrow:"Apple Premium Store · Таджикистан",hero_sub:"Только оригинальная техника Apple с официальной гарантией. Кредит 0%, Trade-In и доставка за 24 часа — по всему Таджикистану.",hero_cta1:"Перейти в каталог",hero_cta2:"Почему ZAMON →",
  chip1:"100% оригинал",chip2:"Гарантия 2 года",chip3:"Кредит 0%",chip4:"Доставка 24ч",
  stat1:"Клиентов в Таджикистане",stat2:"% оригинальная техника",stat3:"часа доставка по стране",
  why_tag:"Почему ZAMON",why_h:"Чем мы отличаемся от других",why_p:"Мы не просто продаём технику Apple — мы отвечаем за каждое устройство.",
  cmp_zamon:"ZAMON",cmp_other:"Обычный магазин",cmp1:"Оригинальная техника Apple",cmp2:"Официальная гарантия",cmp3:"Кредит 0% и Trade-In",cmp4:"Доставка по стране за 24 часа",cmp5:"Поддержка на 3 языках 24/7",
  sc_tag:"Линейка Apple",sc_h:"Вся техника Apple — у нас",
  srv_tag:"Наш сервис",srv_h:"Премиальный сервис на каждом шаге",
  s1h:"Только оригинал",s1p:"100% официальная техника Apple с гарантией.",s2h:"Доставка за 24 часа",s2p:"По всему Таджикистану. Бесплатно от 500 сомони.",s3h:"Кредит 0%",s3p:"Рассрочка до 12 месяцев без переплат.",s4h:"Trade-In",s4p:"Обмен старого устройства со скидкой до 6 000 сом.",s5h:"Поддержка 24/7",s5p:"Эксперты ZAMON помогут на трёх языках.",s6h:"AppleCare+",s6p:"Расширенная гарантия и защита от повреждений.",
  line_h:"Изучите всю линейку",line_all:"Сравнить все модели →",
  catalog_h:"Все модели",cat_all:"Все",pp_lineup:"Линейка",pp_buy:"Купить",pp_overview:"Обзор",pp_why:"Преимущества",pp_specs:"Главное",pp_highlights:"Главное",cmp_h:"Сравните модели",spec_price:"Цена",spec_chip:"Чип",spec_display:"Экран",spec_battery:"Батарея"},

 tj:{bar:"🚚 Расонидани ройгон дар Тоҷикистон аз 500 сом. · Қарзи 0% · Trade-In",region:"Тоҷикистон",
  n_store:"Мағоза",n_mac:"Mac",n_ipad:"iPad",n_iphone:"iPhone",n_watch:"Watch",n_airpods:"AirPods",n_acc:"Лавозимот",n_support:"Дастгирӣ",
  cur:"сом.",from:"аз ",mo:"/моҳ",add:"Харидан",buy_now:"Харидан",learn:"Муфассал",details:"Муфассал",pieces:"дона",remove:"Тоза кардан",close:"Пӯшидан",gb:"ГБ",tb:"ТБ",cfg_storage:"Хотира",cfg_storage_sub:"Чӣ қадар ҷой лозим аст?",
  m_explore:"Обзор",m_shop:"Мағоза",m_more:"Боз",m_all:"Ҳама моделҳо",m_compare:"Муқоиса",m_acc:"Лавозимот",m_trade:"Trade-In",m_credit:"Қарзи 0%",m_support:"Дастгирӣ",
  cart_title:"Сабад",cart_items:"Молҳо",cart_total:"Ҳамагӣ",cart_checkout:"Ба расмият даровардан",cart_clear:"Холӣ кардан",cart_empty:"Сабади шумо холист",cart_empty_sub:"Аз феҳрист дастгоҳ илова кунед",ship_free:"Расонидани ройгон дар Тоҷикистон",
  co_title:"Ба расмият даровардан",co_sub:"Маълумотро пур кунед — занг мезанем.",co_name:"Ном ва насаб",co_phone:"Телефон",co_city:"Шаҳр",co_pay:"Тарзи пардохт",co_pay1:"Нақд ҳангоми гирифтан",co_pay2:"Корт ҳангоми гирифтан",co_pay3:"Қарзи 0%",co_total:"Барои пардохт",co_submit:"Тасдиқи фармоиш",co_ok_h:"Фармоиш қабул шуд!",co_ok_p:"Ташаккур! Менеҷер дар давоми 15 дақиқа тамос мегирад.",co_ok_btn:"Аъло",
  buy_color:"Ранг",buy_add:"Ба сабад илова",buy_perk1:"Расонидани ройгон",buy_perk2:"Кафолати 1 сол",buy_perk3:"Баргардонидан 14 рӯз",
  cfg_model:"Модел",cfg_model_sub:"Кадомаш ба шумо мувофиқ аст?",cfg_finish:"Ранг",cfg_finish_sub:"Дӯстдоштаатонро интихоб кунед.",cfg_add:"Ба сабад илова",cfg_total:"Ҳамагӣ",
  cfg_size:"Андоза",cfg_size_sub:"Андозаро интихоб кунед.",cfg_storage_label:"Хотира",cfg_incl:"Дохил аст",cfg_band:"Тасма",cfg_band_sub:"Услуби худро интихоб кунед.",cfg_material:"Корпус",cfg_material_sub:"Аз мавод ва ранг сар мекунем.",
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
  ck_step1:"Расонидан",ck_step2:"Пардохт",ck_step3:"Тасдиқ",ck_addr:"Суроғаи расонидан",ck_method:"Тарзи гирифтан",ck_courier:"Курьер — 24 соат",ck_courier_s:"Ройгон аз 500 сом.",ck_pickup:"Худбардорӣ",ck_pickup_s:"Мағоза дар Душанбе, имрӯз",ck_next:"Минбаъд",ck_back:"Бозгашт",ck_place:"Тасдиқи фармоиш",ck_review:"Фармоишро санҷед",ck_contact:"Тамос",ck_deliv:"Расонидан",ck_items:"Молҳо",ck_email:"Почтаи электронӣ (ихтиёрӣ)",order_num:"Фармоиш №",ck_to_acc:"Фармоишҳои ман",
  acc_title:"Аккаунт",acc_login:"Воридшавӣ",acc_register:"Бақайдгирӣ",acc_email:"Почтаи электронӣ",acc_pass:"Парол",acc_name:"Ном",acc_signin:"Ворид шудан",acc_signup:"Сохтани аккаунт",acc_logout:"Баромад",acc_profile:"Профил",acc_orders:"Фармоишҳо",acc_wish:"Дӯстдошта",acc_no_orders:"Шумо ҳоло фармоиш надоред",acc_no_wish:"Дӯстдоштаҳо холӣ аст",acc_welcome:"Хуш омадед",acc_login_sub:"Барои дидани фармоишҳо ворид шавед.",acc_reg_sub:"Дар як дақиқа аккаунти ZAMON созед.",acc_to_login:"Аллакай аккаунт доред? Ворид шавед",acc_to_reg:"Аккаунт надоред? Бақайд гиред",acc_status:"Дар коркард",acc_member:"Мизоҷи ZAMON",wished:"Ба дӯстдошта илова шуд",unwished:"Аз дӯстдошта хориҷ шуд",
  added:"Ба сабад илова шуд",nl_done:"Ташаккур! Промокоди 10% фиристода шуд 🎉",cleared:"Сабад холӣ шуд",
  f_shop:"Харидҳо",f_account:"Аккаунт",f_store:"Мағозаи ZAMON",f_biz:"Барои бизнес",f_about:"Дар бораи ZAMON",
  f_disc:"Apple ва тамғаҳои дигар моликияти Apple Inc. мебошанд. ZAMON мағозаи мустақили реселлер аст. Нархҳо бо сомонӣ (TJS). Тасвирҳо барои шиносоӣ.",
  f_copy:"© 2026 ZAMON. Ҳамаи ҳуқуқҳо ҳифз шудаанд.",f_made:"Бо ❤️ дар Тоҷикистон сохта шуд",
  hero_eyebrow:"Apple Premium Store · Тоҷикистон",hero_sub:"Танҳо техникаи аслии Apple бо кафолати расмӣ. Қарзи 0%, Trade-In ва расонидан дар 24 соат — ба тамоми Тоҷикистон.",hero_cta1:"Ба феҳрист",hero_cta2:"Чаро ZAMON →",
  chip1:"100% аслӣ",chip2:"Кафолати 2 сол",chip3:"Қарзи 0%",chip4:"Расонидан 24с",
  stat1:"Мизоҷон дар Тоҷикистон",stat2:"% техникаи аслӣ",stat3:"соат расонидан",
  why_tag:"Чаро ZAMON",why_h:"Чӣ моро аз дигарон фарқ мекунад",why_p:"Мо на танҳо техникаи Apple мефурӯшем — мо барои ҳар дастгоҳ ҷавобгар ҳастем.",
  cmp_zamon:"ZAMON",cmp_other:"Мағозаи оддӣ",cmp1:"Техникаи аслии Apple",cmp2:"Кафолати расмӣ",cmp3:"Қарзи 0% ва Trade-In",cmp4:"Расонидан дар 24 соат",cmp5:"Дастгирӣ бо 3 забон 24/7",
  sc_tag:"Хатти Apple",sc_h:"Тамоми техникаи Apple — дар мо",
  srv_tag:"Хизмати мо",srv_h:"Хизматрасонии олӣ дар ҳар қадам",
  s1h:"Танҳо аслӣ",s1p:"100% техникаи расмии Apple бо кафолат.",s2h:"Расонидан дар 24 соат",s2p:"Ба тамоми Тоҷикистон. Ройгон аз 500 сомонӣ.",s3h:"Қарзи 0%",s3p:"Кредит то 12 моҳ бе пардохти иловагӣ.",s4h:"Trade-In",s4p:"Иваз бо тахфифи то 6 000 сом.",s5h:"Дастгирӣ 24/7",s5p:"Коршиносони ZAMON ба се забон кӯмак мекунанд.",s6h:"AppleCare+",s6p:"Кафолати васеъ ва ҳифз аз осеб.",
  line_h:"Тамоми хатти маҳсулот",line_all:"Муқоисаи ҳама →",
  catalog_h:"Ҳама моделҳо",cat_all:"Ҳама",pp_lineup:"Хатти маҳсулот",pp_buy:"Харидан",pp_overview:"Обзор",pp_why:"Бартариҳо",pp_specs:"Асосӣ",pp_highlights:"Асосӣ",cmp_h:"Моделҳоро муқоиса кунед",spec_price:"Нарх",spec_chip:"Чип",spec_display:"Экран",spec_battery:"Батарея"},

 en:{bar:"🚚 Free delivery across Tajikistan from 500 TJS · 0% financing · Trade-In",region:"Tajikistan",
  n_store:"Store",n_mac:"Mac",n_ipad:"iPad",n_iphone:"iPhone",n_watch:"Watch",n_airpods:"AirPods",n_acc:"Accessories",n_support:"Support",
  cur:"TJS",from:"from ",mo:"/mo",add:"Buy",buy_now:"Buy",learn:"Learn more",details:"Learn more",pieces:"pcs",remove:"Remove",close:"Close",gb:"GB",tb:"TB",cfg_storage:"Storage",cfg_storage_sub:"How much space do you need?",
  m_explore:"Explore",m_shop:"Shop",m_more:"More",m_all:"All models",m_compare:"Compare",m_acc:"Accessories",m_trade:"Trade-In",m_credit:"0% financing",m_support:"Support",
  cart_title:"Bag",cart_items:"Items",cart_total:"Total",cart_checkout:"Checkout",cart_clear:"Clear bag",cart_empty:"Your bag is empty",cart_empty_sub:"Add devices from the catalog",ship_free:"Free delivery across Tajikistan",
  co_title:"Checkout",co_sub:"Fill in your details — we'll call to confirm.",co_name:"Full name",co_phone:"Phone",co_city:"City",co_pay:"Payment method",co_pay1:"Cash on delivery",co_pay2:"Card on delivery",co_pay3:"0% financing",co_total:"To pay",co_submit:"Confirm order",co_ok_h:"Order received!",co_ok_p:"Thank you for shopping at ZAMON. Our manager will contact you within 15 minutes.",co_ok_btn:"Great",
  buy_color:"Color",buy_add:"Add to Bag",buy_perk1:"Free nationwide delivery",buy_perk2:"1-year warranty",buy_perk3:"14-day returns",
  cfg_model:"Model",cfg_model_sub:"Which is best for you?",cfg_finish:"Finish",cfg_finish_sub:"Pick your favorite.",cfg_add:"Add to Bag",cfg_total:"Total",
  cfg_size:"Size",cfg_size_sub:"Choose your size.",cfg_storage_label:"Storage",cfg_incl:"Included",cfg_band:"Band",cfg_band_sub:"Find your style.",cfg_material:"Case",cfg_material_sub:"Start with your material and finish.",
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
  ck_step1:"Delivery",ck_step2:"Payment",ck_step3:"Review",ck_addr:"Delivery address",ck_method:"Delivery method",ck_courier:"Courier — 24 hours",ck_courier_s:"Free from 500 TJS",ck_pickup:"Store pickup",ck_pickup_s:"Dushanbe store, today",ck_next:"Continue",ck_back:"Back",ck_place:"Place order",ck_review:"Review your order",ck_contact:"Contact",ck_deliv:"Delivery",ck_items:"Items",ck_email:"Email (optional)",order_num:"Order №",ck_to_acc:"My orders",
  acc_title:"Account",acc_login:"Sign in",acc_register:"Register",acc_email:"Email",acc_pass:"Password",acc_name:"Name",acc_signin:"Sign in",acc_signup:"Create account",acc_logout:"Sign out",acc_profile:"Profile",acc_orders:"Orders",acc_wish:"Saved",acc_no_orders:"You have no orders yet",acc_no_wish:"Your saved list is empty",acc_welcome:"Welcome back",acc_login_sub:"Sign in to see your orders and saved items.",acc_reg_sub:"Create your ZAMON account in a minute.",acc_to_login:"Already have an account? Sign in",acc_to_reg:"No account? Register",acc_status:"Processing",acc_member:"ZAMON customer",wished:"Added to saved",unwished:"Removed from saved",
  added:"Added to bag",nl_done:"Thank you! Your 10% promo code has been sent 🎉",cleared:"Bag cleared",
  f_shop:"Shop and Learn",f_account:"Account",f_store:"The ZAMON Store",f_biz:"For Business",f_about:"About ZAMON",
  f_disc:"Apple and other marks are trademarks of Apple Inc. ZAMON is an independent reseller. Prices in somoni (TJS). Images for reference only.",
  f_copy:"© 2026 ZAMON. All rights reserved.",f_made:"Made with ❤️ in Tajikistan",
  hero_eyebrow:"Apple Premium Store · Tajikistan",hero_sub:"Only genuine Apple products with official warranty. 0% financing, Trade-In and 24-hour delivery — across all of Tajikistan.",hero_cta1:"Go to catalog",hero_cta2:"Why ZAMON →",
  chip1:"100% genuine",chip2:"2-year warranty",chip3:"0% financing",chip4:"24h delivery",
  stat1:"Customers in Tajikistan",stat2:"% genuine products",stat3:"hour delivery",
  why_tag:"Why ZAMON",why_h:"What sets us apart",why_p:"We don't just sell Apple — we stand behind every single device.",
  cmp_zamon:"ZAMON",cmp_other:"Ordinary store",cmp1:"Genuine Apple products",cmp2:"Official warranty",cmp3:"0% financing & Trade-In",cmp4:"24-hour nationwide delivery",cmp5:"24/7 support in 3 languages",
  sc_tag:"The Apple lineup",sc_h:"All of Apple — right here",
  srv_tag:"Our service",srv_h:"Premium service at every step",
  s1h:"Genuine only",s1p:"100% official Apple products with warranty.",s2h:"24-hour delivery",s2p:"Across Tajikistan. Free from 500 somoni.",s3h:"0% financing",s3p:"Installments up to 12 months, no overpayments.",s4h:"Trade-In",s4p:"Trade your old device, save up to 6,000 TJS.",s5h:"24/7 support",s5p:"ZAMON experts help in three languages.",s6h:"AppleCare+",s6p:"Extended warranty and damage protection.",
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
const MARK='<span class="mark"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 12.5h16v4.2l-9.3 6.6H28v4.2H12v-4.2l9.3-6.6H12z" fill="#fff"/></svg></span>';
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
  document.body.insertAdjacentHTML("beforeend",buildFooter()+buildOverlays());
  // mark main content for skip link
  const main=document.querySelector("body > section");
  if(main){if(!main.id)main.id="maincontent";main.setAttribute("tabindex","-1");
    const sl=document.querySelector(".skip-link");if(sl)sl.setAttribute("href","#"+main.id);}
}
function fcol(title,links){return `<div class="gf-col"><h5>${title}</h5>${links.map(([l,h])=>`<a href="${h||"#"}">${l}</a>`).join("")}</div>`;}
function buildFooter(){
  const L=I18N[LANG];
  return `<footer class="gfooter"><div class="gf-in">
    <div class="gf-pitch"><b>ZAMON</b> — ${L.hero_eyebrow}. ${L.s1p}</div>
    <div class="gf-dir">
      <div class="gf-col"><div class="gf-brand">${MARK}ZAMON</div><p class="gf-about">${tr({ru:"Авторизованный премиальный магазин техники Apple в Таджикистане.",tj:"Мағозаи расмии премиалии техникаи Apple дар Тоҷикистон.",en:"An authorized premium Apple store in Tajikistan."})}</p>
        <div class="gf-socials">
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg></a>
          <a href="#" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 3-9.5 9.5"/><path d="M22 3 15 21l-3.5-7.5L4 10l18-7Z"/></svg></a>
          <a href="#" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.8.7.7-2.7-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5 0-.7-.3-1.4-.7-2-1.4-.4-.5-.7-1-.9-1.4-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.2.2-.4 0-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.7.7-.9 1.6-.6 2.6.3 1.1 1 2.1 1.2 2.4 1.7 2.5 3.6 3.3 4.8 3.6.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1l-.3-.2Z"/></svg></a>
          <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"/></svg></a>
        </div></div>
      ${fcol(L.f_shop,[["iPhone","iphone.html"],["Mac","mac.html"],["iPad","ipad.html"],["Apple Watch","watch.html"],["AirPods","airpods.html"],[L.m_acc,"accessories.html"]])}
      ${fcol(L.f_store,[["Trade-In","trade-in.html"],[L.m_credit,"trade-in.html"],[tr({ru:"Сравнить модели",tj:"Муқоисаи моделҳо",en:"Compare models"}),"compare.html"],[tr({ru:"Доставка",tj:"Расонидан",en:"Delivery"}),"index.html#services"],["AppleCare+","trade-in.html"]])}
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
      <div class="mega-col"><h5>${t("m_shop")}</h5><a href="trade-in.html">${t("m_trade")}</a><a href="trade-in.html">${t("m_credit")}</a><a href="index.html#services">AppleCare+</a><a href="accessories.html">${t("m_acc")}</a></div>
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
  if(document.getElementById("catalog"))renderCatalog();
  if(document.getElementById("buygrid"))renderBuyGrid();
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
function addToCart(id,colorIdx=0,silent=false,price){const ex=cart.find(c=>c.id===id&&c.color===colorIdx&&(c.price||0)===(price||0));if(ex)ex.qty++;else cart.push({id,color:colorIdx,qty:1,price:price});saveCart();updateCount();renderCart();if(!silent)toast(t("added"));}
function updateCount(){const n=cart.reduce((s,c)=>s+c.qty,0);const el=document.getElementById("cartCount");if(!el)return;el.textContent=n;el.classList.toggle("show",n>0);}
function renderCartPage(){
  const box=document.getElementById("cartpage");if(!box)return;
  document.title="ZAMON — "+t("cart_title");
  if(!cart.length){box.innerHTML=`<div class="cp-empty"><div class="ec-ico">🛍️</div><h2>${t("cart_empty")}</h2><p>${t("cart_empty_sub")}</p><a class="btn btn-primary" href="index.html#catalog">${t("cp_continue")}</a></div>`;return;}
  const total=cartSum();
  box.innerHTML=`<div class="cp-head"><h1>${t("cart_title")}</h1><span>${cart.reduce((s,c)=>s+c.qty,0)} ${t("pieces")}</span></div>
   <div class="cp-grid"><div class="cp-items">${cart.map((c,i)=>{const p=P(c.id);if(!p)return"";const col=p.colors[c.color]||p.colors[0];
     return `<div class="cp-item"><div class="cp-img"><img src="${p.card||col.img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div>
       <div class="cp-info"><h3>${p.name}</h3>${p.colors.length>1?`<div class="cp-sub">${tr(col.n)}</div>`:""}<div class="cp-unit">${fmtPrice(priceOf(c))}</div><button class="cp-rm" data-rm="${i}">${t("remove")}</button></div>
       <div class="cp-right"><div class="qty"><button data-dec="${i}">−</button><span>${c.qty}</span><button data-inc="${i}">+</button></div><div class="cp-price">${fmtPrice(priceOf(c)*c.qty)}</div></div></div>`;}).join("")}</div>
     <aside class="cp-sum"><h3>${t("cp_summary")}</h3>
       <div class="cp-row"><span>${t("cart_total")}</span><span>${fmtPrice(total)}</span></div>
       <div class="cp-ship">✓ <span>${t("ship_free")}</span></div>
       <div class="cp-grand"><span>${t("co_total")}</span><span>${fmtPrice(total)}</span></div>
       <button class="btn btn-primary" id="cpCheckout">${t("cart_checkout")}</button>
       <a class="cp-cont" href="index.html#catalog">${t("cp_continue")} →</a></aside></div>`;
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
  box.innerHTML=cart.map((c,i)=>{const p=P(c.id);if(!p)return"";const col=p.colors[c.color]||p.colors[0];
    return `<div class="ci"><div class="ci-img"><img src="${p.card||col.img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div>
      <div class="ci-info"><h4>${p.name}</h4>${p.colors.length>1?`<div class="ci-sub">${tr(col.n)}</div>`:""}<div class="ci-price">${fmtPrice(priceOf(c))}</div>
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
  const p=P(id);if(!p)return;let ci=0;const mi=document.getElementById("modalInner");
  const cols=p.buyColors||p.colors;let si=0;
  function render(){const col=cols[ci];const price=p.price+(p.storage?p.storage[si].add:0);mi.className="modal buy";
    mi.innerHTML=`<button class="close-x mclose" data-close>✕</button>
      <div class="buy-grid"><div class="buy-media ${p.darkMedia&&!p.buyColors?"dark":""}"><img src="${col.img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div>
      <div class="buy-info">${p.new?`<div class="bnew">NEW</div>`:""}<h3>${p.name}</h3><div class="bdesc">${tr(p.tag)}</div>
      ${cols.length>1?`<div class="blabel">${t("buy_color")} — <span>${tr(col.n)}</span></div><div class="color-opts">${cols.map((c,i)=>`<div class="color-opt ${i===ci?"active":""}" data-ci="${i}"><span class="cdot" style="background:${c.hex}"></span>${tr(c.n)}</div>`).join("")}</div>`:""}
      ${p.storage?`<div class="blabel">${t("cfg_storage")} — <span>${stLabel(p.storage[si].gb)}</span></div><div class="color-opts">${p.storage.map((st,i)=>`<div class="color-opt ${i===si?"active":""}" data-si="${i}"><b>${stLabel(st.gb)}</b></div>`).join("")}</div>`:""}
      <div class="buy-price">${fmtPrice(price)}</div><div class="buy-mo">${t("from")}${num(monthly(price))} ${t("cur")}${t("mo")} · ${t("co_pay3")}</div>
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
function renderCheckout(){
  const root=document.getElementById("checkout");if(!root)return;
  document.title="ZAMON — "+t("co_title");
  if(!CK)CK={step:1,done:false,order:null,d:{name:"",phone:"",city:"",addr:"",email:"",delivery:"courier",pay:t("co_pay3")}};
  if(CK.done&&CK.order){
    const o=CK.order;
    root.innerHTML=`<div class="ck-done"><div class="ok-ico">✓</div><h1>${t("co_ok_h")}</h1>
      <p class="ck-onum">${t("order_num")} <b>${o.no}</b></p><p class="msub">${t("co_ok_p")}</p>
      <div class="ck-done-total"><span>${t("co_total")}</span><b>${fmtPrice(o.total)}</b></div>
      <div class="ck-done-act"><a class="btn btn-primary" href="account.html">${t("ck_to_acc")}</a><a class="btn btn-soft" href="index.html">${t("co_ok_btn")}</a></div></div>`;
    return;
  }
  if(!cart.length){root.innerHTML=`<div class="cp-empty"><div class="ec-ico">🛍️</div><h2>${t("cart_empty")}</h2><p>${t("cart_empty_sub")}</p><a class="btn btn-primary" href="index.html#catalog">${t("cp_continue")}</a></div>`;return;}
  const steps=["ck_step1","ck_step2","ck_step3"];
  const prog=`<div class="ck-steps">${steps.map((s,i)=>`<div class="ck-st ${i+1===CK.step?"active":""} ${i+1<CK.step?"done":""}"><span class="ck-stn">${i+1<CK.step?"✓":i+1}</span>${t(s)}</div>`).join("")}</div>`;
  const D=CK.d;const field=(k,lbl,ph,type)=>`<div class="field"><label>${lbl}</label><input data-f="${k}" type="${type||"text"}" value="${(D[k]||"").replace(/"/g,"&quot;")}" placeholder="${ph}"></div>`;
  const opt=(active,attr,name,sub,price)=>`<div class="cfg-opt ${active?"active":""}" ${attr}><div><div class="o-name">${name}</div>${sub?`<div class="o-sub">${sub}</div>`:""}</div>${price?`<div class="o-price">${price}</div>`:""}</div>`;
  let body="";
  if(CK.step===1){
    body=`<div class="ck-fields">${field("name",t("co_name"),"Ahmad Rahimov")}${field("phone",t("co_phone"),"+992 90 000 00 00","tel")}
      ${field("city",t("co_city"),t("region"))}${field("addr",t("ck_addr"),"ул. Рудаки 25, кв. 4")}${field("email",t("ck_email"),"mail@example.com","email")}</div>
      <div class="ck-q">${t("ck_method")}</div>
      ${opt(D.delivery==="courier",`data-deliv="courier"`,t("ck_courier"),t("ck_courier_s"),null)}
      ${opt(D.delivery==="pickup",`data-deliv="pickup"`,t("ck_pickup"),t("ck_pickup_s"),null)}`;
  }else if(CK.step===2){
    body=`<div class="ck-q">${t("co_pay")}</div>
      ${opt(D.pay===t("co_pay3"),`data-pay="${t("co_pay3")}"`,t("co_pay3"),t("cfg_pay_inst_sub"),null)}
      ${opt(D.pay===t("co_pay1"),`data-pay="${t("co_pay1")}"`,t("co_pay1"),"",null)}
      ${opt(D.pay===t("co_pay2"),`data-pay="${t("co_pay2")}"`,t("co_pay2"),"",null)}`;
  }else{
    body=`<div class="ck-review">
      <div class="ck-rev-card"><h4>${t("ck_contact")}</h4><p>${D.name||"—"}<br>${D.phone||"—"}${D.email?"<br>"+D.email:""}</p></div>
      <div class="ck-rev-card"><h4>${t("ck_deliv")}</h4><p>${D.delivery==="courier"?t("ck_courier"):t("ck_pickup")}<br>${D.city||""} ${D.addr||""}</p></div>
      <div class="ck-rev-card"><h4>${t("co_pay")}</h4><p>${D.pay}</p></div>
      <div class="ck-rev-card full"><h4>${t("ck_items")}</h4>${cart.map(c=>{const p=P(c.id);return p?`<div class="ck-ri"><span>${p.name} × ${c.qty}</span><span>${fmtPrice(priceOf(c)*c.qty)}</span></div>`:"";}).join("")}</div></div>`;
  }
  const total=cartSum();
  root.innerHTML=`<div class="ck-head"><h1>${t("co_title")}</h1><a class="ck-cancel" href="cart.html">${t("ck_back")} →</a></div>${prog}
    <div class="ck-grid"><div class="ck-main">${body}
      <div class="ck-nav">${CK.step>1?`<button class="btn btn-soft" id="ckBack">${t("ck_back")}</button>`:`<a class="btn btn-soft" href="cart.html">${t("ck_back")}</a>`}
        <button class="btn btn-primary" id="ckNext">${CK.step<3?t("ck_next"):t("ck_place")}</button></div></div>
      <aside class="ck-sum"><h3>${t("cp_summary")}</h3>
        ${cart.map(c=>{const p=P(c.id);if(!p)return"";const col=p.colors[c.color]||p.colors[0];return `<div class="ck-sli"><div class="ck-sli-img"><img src="${p.card||col.img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div><div class="ck-sli-i"><span>${p.name}</span><small>${tr(col.n)} · ${c.qty} ${t("pieces")}</small></div><b>${fmtPrice(priceOf(c)*c.qty)}</b></div>`;}).join("")}
        <div class="ck-ship">✓ <span>${t("ship_free")}</span></div>
        <div class="cp-grand"><span>${t("co_total")}</span><span>${fmtPrice(total)}</span></div></aside></div>`;
  root.querySelectorAll("[data-f]").forEach(i=>i.oninput=()=>{D[i.dataset.f]=i.value;});
  root.querySelectorAll("[data-deliv]").forEach(o=>o.onclick=()=>{D.delivery=o.dataset.deliv;renderCheckout();});
  root.querySelectorAll("[data-pay]").forEach(o=>o.onclick=()=>{D.pay=o.dataset.pay;renderCheckout();});
  const bk=root.querySelector("#ckBack");if(bk)bk.onclick=()=>{CK.step--;renderCheckout();};
  root.querySelector("#ckNext").onclick=()=>{
    if(CK.step===1){if(!D.name||!D.phone||!D.city||!D.addr){toast(tr({ru:"Заполните все поля",tj:"Ҳама майдонҳоро пур кунед",en:"Please fill in all fields"}));return;}}
    if(CK.step<3){CK.step++;renderCheckout();return;}
    // place order
    const o={no:"Z"+Date.now().toString().slice(-7),ts:Date.now(),items:cart.map(c=>({id:c.id,color:c.color,qty:c.qty,price:priceOf(c)})),total:cartSum(),d:Object.assign({},D)};
    orders.unshift(o);saveOrders();cart=[];saveCart();updateCount();renderCart();
    CK.done=true;CK.order=o;renderCheckout();window.scrollTo(0,0);
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
      <div class="ao-items">${o.items.map(it=>{const p=P(it.id);return p?`<div class="ao-img" title="${p.name} × ${it.qty}"><img src="${p.card||p.colors[0].img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></div>`:"";}).join("")}</div>
      <div class="ao-foot"><span>${o.items.reduce((s,i)=>s+i.qty,0)} ${t("pieces")}</span><b>${fmtPrice(o.total)}</b></div></div>`).join("")}</div>`
      :emptyBlock("📦",t("acc_no_orders"));
  }else{
    const items=wishlist.map(id=>P(id)).filter(Boolean);
    content=items.length?`<div class="buy-grid-cards">${items.map(p=>`<div class="bgcard" data-id="${p.id}"><button class="wish-btn on" data-wish="${p.id}" aria-label="${t("acc_wish")}">♥</button><div class="bg-media"><img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div><h3>${p.name}</h3><div class="bg-sw"></div><div class="bg-price">${t("from")}${num(p.price)} ${t("cur")}<small>${t("from")}${num(monthly(p.price))} ${t("cur")}${t("mo")} · 0%</small></div><button class="add" data-buy="${p.id}">${t("pp_buy")}</button></div>`).join("")}</div>`
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
function swatchHtml(p,cls,force){if(p.colors.length<2||(p.card&&!force))return "";return `<div class="${cls}">`+p.colors.map((c,i)=>`<span class="sw ${i===0?"active":""}" data-sw="${p.id}" data-idx="${i}" title="${tr(c.n)}" style="background:${c.hex}"></span>`).join("")+`</div>`;}

/* ===== RENDER: lineup ===== */
function renderLineup(){
  const track=document.getElementById("lineupTrack");if(!track)return;
  const cat=track.getAttribute("data-cat")||"phone";
  track.innerHTML=PRODUCTS.filter(p=>p.cat===cat).map(p=>`<div class="lcard" data-id="${p.id}">
    <div class="lc-media"${p.tint?` style="background:${p.tint}"`:""}>${p.new?`<div class="lc-badge">NEW</div>`:""}<img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div>
    <div class="lc-body">${swatchHtml(p,"lc-sw",true)}<h3>${p.name}</h3><div class="lc-desc">${tr(p.tag)}</div>
    <div class="lc-price"><b>${t("from")}${num(p.price)} ${t("cur")}</b><br>${t("from")}${num(monthly(p.price))} ${t("cur")}${t("mo")} · 0%</div></div></div>`).join("");
  const car=track.closest(".carousel");initCarousel(car,document.getElementById(car.dataset.dots||"lineupDots"));
}

/* ===== RENDER: showcase ===== */
function showcaseTile(li,full){return `<div class="promo reveal ${li.dark?"dark":""} ${full?"full":""}" data-page="${li.page}" style="background:${li.grad}">
  <div>${li.new?`<div class="pnew">NEW</div>`:""}<h3>${li.name}</h3><div class="pt">${tr(li.tagline)}</div></div>
  <div class="promo-btns"><a class="btn-pill" href="${li.page}">${t("learn")}</a><a class="btn-pill ghost" href="${li.buyPage||li.page}">${t("add")}</a></div>
  <img class="pimg" data-emoji="${li.emoji}" src="${li.img}" alt="${li.name}" loading="lazy" onerror="imgFallback(this)"></div>`;}
const STOREBAR=[
 {name:"Mac",page:"mac.html",img:A+"/v/macbook-air/z/images/overview/hero/hero_endframe__c67cz35iy9me_large_2x.png"},
 {name:"iPhone",page:"iphone.html",img:A+"/v/iphone/home/cj/images/overview/chapternav/nav_iphone_17pro__b8rt659h2ogi_large.png"},
 {name:"iPad",page:"ipad.html",img:A+"/v/ipad-air/ah/images/overview/hero/hero_endframe__6gl84bccyaqi_large_2x.png"},
 {name:"Apple Watch",page:"watch.html",img:"https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-case-46-aluminum-silver-nc-s11_VW_34FR?wid=500&hei=500&fmt=png-alpha"},
 {name:"AirPods",page:"airpods.html",img:A+"/v/airpods/ae/images/overview/airpods_max_blue__fsfaleh1smuu_large.png"}
];
function renderStoreBar(){
  const box=document.getElementById("storebar");if(!box)return;
  box.innerHTML=`<div class="storebar-row">`+STOREBAR.map(s=>`<a class="sb-item" href="${s.page}"><div class="sb-ic"><img src="${s.img}" alt="${s.name}" loading="lazy" decoding="async" onerror="imgFallback(this)"></div><span>${s.name}</span></a>`).join("")+`</div>`;
}
/* ===== Apple chapternav-style lineup row (all models of a category) ===== */
function lineupRow(cat){
  const items=PRODUCTS.filter(p=>p.cat===cat);
  return `<div class="lineup-wrap">
    <button class="lr-arrow prev" aria-label="prev" hidden>${ARROW_L}</button>
    <div class="lineup-row">${items.map(p=>`<a class="lr-item reveal" href="${productUrl(p)}">
    <div class="lr-media"${p.tint?` style="background:${p.tint}"`:""}>${p.new?`<span class="lr-new">NEW</span>`:""}<img src="${p.lineImg||mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" decoding="async" onerror="imgFallback(this)"></div>
    <div class="lr-name">${p.name}</div>
    <div class="lr-from">${t("from")}${num(p.price)} ${t("cur")}</div>
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
function renderShowcase(){const box=document.getElementById("showcaseBox");if(!box)return;
  box.innerHTML=scLineup("phone","iPhone")+scLineup("laptop","Mac")+scLineup("tablet","iPad")+scLineup("watch","Apple Watch")+scLineup("audio","AirPods");
  observeReveal();initLineupNav();}

/* ===== RENDER: catalog ===== */
let currentFilter="all",currentSearch="";
const ORDER=[["phone","iPhone"],["laptop","Mac"],["tablet","iPad"],["watch","Apple Watch"],["audio","AirPods"]];
function cardHtml(p){return `<div class="pcard" data-id="${p.id}"><div class="badge-top">${p.new?"NEW":""}</div>
  <button class="wish-btn ${inWish(p.id)?"on":""}" data-wish="${p.id}" aria-label="${t("acc_wish")}">♥</button>
  <div class="media"${p.tint?` style="background:${p.tint}"`:""}><img src="${mainImg(p)}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div>
  ${swatchHtml(p,"p-sw")}<h3>${p.name}</h3><div class="ptag">${tr(p.tag)}</div>
  <div class="p-price">${t("from")}${num(p.price)} ${t("cur")}${p.old?`<span class="old">${num(p.old)}</span>`:""}<small>${t("from")}${num(monthly(p.price))} ${t("cur")}${t("mo")} · 0%</small></div>
  <div class="p-actions"><button class="add" data-add="${p.id}">${t("add")}</button><button class="more" data-buy="${p.id}">${t("details")}</button></div></div>`;}
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
      <div class="bg-media"><img src="${cols[0].img}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)"></div>
      <h3>${p.name}</h3>
      ${cols.length>1?`<div class="bg-sw">${cols.map((c,i)=>`<span class="sw ${i===0?"active":""}" data-bsw="${p.id}" data-idx="${i}" title="${tr(c.n)}" style="background:${c.hex}"></span>`).join("")}</div>`:`<div class="bg-sw"></div>`}
      <div class="bg-price">${t("from")}${num(p.price)} ${t("cur")}<small>${t("from")}${num(monthly(p.price))} ${t("cur")}${t("mo")} · 0%</small></div>
      <button class="add" data-buy="${p.id}">${t("pp_buy")}</button></div>`;
  }).join("")+`</div>`;
  observeReveal();initTilt(".bgcard");
}

/* ===== RENDER: product-page hero (from LINE_INFO via #phero[data-line]) ===== */
function renderProductHero(){
  const el=document.getElementById("phero");if(!el)return;
  const li=LI(el.dataset.line);if(!li)return;
  const firstId=(PRODUCTS.find(p=>p.cat===li.cat)||{}).id||1;
  el.className="phero "+(li.dark?"dark":"light");
  const media=li.heroVideo
    ? `<video class="phero-img phero-video" autoplay muted loop playsinline preload="auto" poster="${li.img}" aria-label="${li.name}"><source src="${li.heroVideo}" type="video/mp4"></video>`
    : `<img class="phero-img" data-emoji="${li.emoji}" src="${li.img}" alt="${li.name}" onerror="imgFallback(this)">`;
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
    CFG={pid:(P(id)?id:PRODUCTS[0].id),ci:0,si:0,vi:0,bi:0,mi:0,gi:0,focus:"case",care:false,trade:false,pay:"inst"};
  }
  const p=P(CFG.pid)||PRODUCTS[0];
  const mats=p.materials;
  const curCols=()=>mats?mats[CFG.mi].finishes:(p.buyColors||p.colors);
  const cat=p.cat;
  const li=LIcat(cat)||{};
  const hl=((PAGEDATA[li.key]||{}).highlights||[]).map(h=>h.img);
  const siblings=PRODUCTS.filter(s=>s.cat===cat);

  function gallery(){
    if(CFG.focus==="band"&&p.bandImgs&&p.bandImgs.length)return p.bandImgs.slice(0,4);
    const cols=curCols();const angles=p.gallery||[];
    return [cols[CFG.ci].img].concat(angles).filter(Boolean).slice(0,5);
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
    const cols=curCols();const c=calc(),imgs=gallery(),col=cols[CFG.ci];
    if(CFG.gi>=imgs.length)CFG.gi=0;
    const optRow=(active,data,name,sub,price)=>`<div class="cfg-opt ${active?"active":""}" ${data}>
      <div><div class="o-name">${name}</div>${sub?`<div class="o-sub">${sub}</div>`:""}</div>
      ${price!=null?`<div class="o-price">${price}</div>`:""}</div>`;
    const plus=n=>n>0?"+"+fmtPrice(n):t("cfg_incl");

    root.innerHTML=`
    <div class="cfg-top">
      <a class="cfg-back" href="${li.buyPage||"index.html"}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg> ${t("cfg_back")}</a>
      ${siblings.length>1?`<div class="cfg-models">${siblings.map(s=>`<button class="cfg-mtab ${s.id===CFG.pid?"active":""}" data-pid="${s.id}">${s.name}</button>`).join("")}</div>`:""}
    </div>

    <div class="cfg-stage"><div class="cfg-gallery">
      <div class="cfg-bigimg">
        <img id="cfgBig" src="${imgs[CFG.gi]}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)">
        ${imgs.length>1?`<div class="cfg-gnav"><button class="cfg-arrow" id="cfgGPrev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg></button><button class="cfg-arrow" id="cfgGNext"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button></div>`:""}
      </div>
      ${imgs.length>1?`<div class="cfg-thumbs">${imgs.map((im,i)=>`<button class="cfg-thumb ${i===CFG.gi?"active":""}" data-gi="${i}"><img src="${im}" alt="" onerror="this.style.display='none'"></button>`).join("")}</div>`:""}
    </div></div>

    <div class="cfg-panel">
      <h1>${p.name}</h1><div class="cfg-tagline">${tr(p.tag)}</div>

      ${mats?`<div class="cfg-group"><div class="cfg-q">${t("cfg_material")} <span>${t("cfg_material_sub")}</span></div>
        ${mats.map((m,i)=>`<div class="cfg-mat ${i===CFG.mi?"active":""}" data-mi="${i}">
          <div class="cm-head"><div><b>${tr(m.n)}</b><div class="cm-from">${t("from")}${fmtPrice(m.fromPrice)}</div></div><div class="o-price">${m.add>0?"+"+fmtPrice(m.add):t("cfg_incl")}</div></div>
          <div class="cm-desc">${tr(m.desc)}</div></div>`).join("")}</div>`:""}

      ${p.variants?`<div class="cfg-group"><div class="cfg-q">${t("cfg_size")} <span>${t("cfg_size_sub")}</span></div>
        ${p.variants.map((v,i)=>optRow(i===CFG.vi,`data-vi="${i}"`,tr(v.n),tr(v.sub),plus(v.add))).join("")}
        <details class="cfg-help"><summary>${t("cfg_help_size")}</summary><p>${t("cfg_help_size_txt")}</p></details></div>`:""}

      <div class="cfg-group"><div class="cfg-q">${t("cfg_finish")} <span>${t("cfg_finish_sub")}</span></div>
        <div class="cfg-colors">${cols.map((cc,i)=>`<div class="cfg-color ${i===CFG.ci?"active":""}" data-ci="${i}"><span class="cc-dot" style="background:${cc.hex}"></span><span class="cc-name">${tr(cc.n)}</span></div>`).join("")}</div>
        ${cols.length>1?`<div class="cfg-curname">${tr(col.n)}</div>`:""}</div>

      ${p.bands?`<div class="cfg-group"><div class="cfg-q">${t("cfg_band")} <span>${t("cfg_band_sub")}</span></div>
        ${p.bands.map((b,i)=>optRow(i===CFG.bi,`data-bi="${i}"`,`<span class="cfg-banddot" style="background:${b.hex}"></span>${tr(b.n)}`,b.desc?tr(b.desc):"",plus(b.add))).join("")}
        <details class="cfg-help"><summary>${t("cfg_help_band")}</summary><p>${t("cfg_help_band_txt")}</p></details></div>`:""}

      ${p.storage?`<div class="cfg-group"><div class="cfg-q">${t("cfg_storage_label")} <span>${t("cfg_storage_sub")}</span></div>
        ${p.storage.map((st,i)=>optRow(i===CFG.si,`data-si="${i}"`,stLabel(st.gb),"",plus(st.add))).join("")}</div>`:""}

      <div class="cfg-group"><div class="cfg-q">${t("cfg_trade")} <span>${t("cfg_trade_sub")}</span></div>
        ${optRow(!CFG.trade,`data-trade="0"`,t("cfg_trade_none"),t("cfg_trade_none_sub"),null)}
        ${optRow(CFG.trade,`data-trade="1"`,t("cfg_trade_yes"),t("cfg_trade_est"),"−"+fmtPrice(TRADEIN[cat]||0))}</div>

      <div class="cfg-group"><div class="cfg-q">${t("cfg_care")} <span>${t("cfg_care_sub")}</span></div>
        ${optRow(!CFG.care,`data-care="0"`,t("cfg_care_none"),t("cfg_care_none_sub"),null)}
        ${optRow(CFG.care,`data-care="1"`,t("cfg_care_yes"),t("cfg_care_yes_sub"),"+"+fmtPrice(CARE[cat]||0))}</div>

      <div class="cfg-group"><div class="cfg-q">${t("cfg_pay")} <span>${t("cfg_pay_sub")}</span></div>
        ${optRow(CFG.pay==="inst",`data-pay="inst"`,t("cfg_pay_inst"),t("cfg_pay_inst_sub"),fmtPrice(monthly(c.total))+t("mo"))}
        ${optRow(CFG.pay==="full",`data-pay="full"`,t("cfg_pay_full"),t("cfg_pay_full_sub"),fmtPrice(c.total))}</div>

      <div class="cfg-summary">
        <div class="cfg-sum-h">${t("cfg_summary_h")}</div>
        <div class="cfg-rows">
          <div class="cfg-row"><span>${t("cfg_device")}</span><span>${fmtPrice(c.dev)}</span></div>
          ${c.careAdd?`<div class="cfg-row"><span>AppleCare+</span><span>+${fmtPrice(c.careAdd)}</span></div>`:""}
          ${c.tradeVal?`<div class="cfg-row save"><span>${t("cfg_save")}</span><span>−${fmtPrice(c.tradeVal)}</span></div>`:""}
        </div>
        <div class="cfg-total"><span>${t("cfg_total")}</span><span>${fmtPrice(c.total)}</span></div>
        ${CFG.pay==="inst"?`<div class="cfg-mo">${t("from")}${fmtPrice(monthly(c.total))}${t("mo")} ${t("cfg_mo_note")}</div>`:""}
        <div class="cfg-actions">
          <button class="btn btn-primary" id="cfgAdd">${t("cfg_add")}</button>
          <button class="btn btn-soft" id="cfgBuy">${t("cfg_buynow")}</button>
        </div>
      </div>
    </div>`;

    root.querySelectorAll("[data-pid]").forEach(b=>b.onclick=()=>{CFG.pid=+b.dataset.pid;CFG.ci=0;CFG.si=0;CFG.vi=0;CFG.bi=0;CFG.mi=0;CFG.gi=0;CFG.focus="case";CFG.care=false;CFG.trade=false;renderConfigurator();});
    root.querySelectorAll("[data-mi]").forEach(o=>o.onclick=()=>{CFG.mi=+o.dataset.mi;CFG.ci=0;CFG.gi=0;CFG.focus="case";render();});
    root.querySelectorAll("[data-vi]").forEach(o=>o.onclick=()=>{CFG.vi=+o.dataset.vi;CFG.focus="case";render();});
    root.querySelectorAll("[data-bi]").forEach(o=>o.onclick=()=>{CFG.bi=+o.dataset.bi;CFG.gi=0;CFG.focus="band";render();});
    root.querySelectorAll(".cfg-color").forEach(o=>o.onclick=()=>{CFG.ci=+o.dataset.ci;CFG.gi=0;CFG.focus="case";render();});
    root.querySelectorAll("[data-si]").forEach(o=>o.onclick=()=>{CFG.si=+o.dataset.si;CFG.focus="case";render();});
    root.querySelectorAll("[data-trade]").forEach(o=>o.onclick=()=>{CFG.trade=o.dataset.trade==="1";render();});
    root.querySelectorAll("[data-care]").forEach(o=>o.onclick=()=>{CFG.care=o.dataset.care==="1";render();});
    root.querySelectorAll("[data-pay]").forEach(o=>o.onclick=()=>{CFG.pay=o.dataset.pay;render();});
    root.querySelectorAll("[data-gi]").forEach(o=>o.onclick=()=>{CFG.gi=+o.dataset.gi;render();});
    const gp=root.querySelector("#cfgGPrev"),gn=root.querySelector("#cfgGNext");
    if(gp)gp.onclick=()=>{CFG.gi=(CFG.gi-1+imgs.length)%imgs.length;render();};
    if(gn)gn.onclick=()=>{CFG.gi=(CFG.gi+1)%imgs.length;render();};
    root.querySelector("#cfgAdd").onclick=()=>{addToCart(p.id,CFG.ci,false,c.total);openCart();};
    root.querySelector("#cfgBuy").onclick=()=>{addToCart(p.id,CFG.ci,true,c.total);openCheckout();};
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
  const witb=witbMap[p.cat]||witbMap.phone;
  return `<section class="sec alt"><div class="wrap"><div class="sec-head reveal"><h2>${tr({ru:"В коробке",tj:"Дар қуттӣ",en:"In the box"})}</h2></div>
    <div class="witb-grid">${witb.map(w=>`<div class="witb-item reveal"><div class="witb-ic">${w.ic}</div><div class="witb-n">${typeof w.n==="string"?w.n:tr(w.n)}</div></div>`).join("")}</div></div></section>`;
}
function buildBuyerFAQ(){
  const pfaq=[
    {q:{ru:"Сколько идёт доставка?",tj:"Расонидан чанд вақт мегирад?",en:"How long is delivery?"},a:{ru:"Доставим за 24 часа по Душанбе и по всему Таджикистану. По городу часто привозим в день заказа, бесплатно от 500 сомони.",tj:"Дар 24 соат аз рӯи тамоми Тоҷикистон мерасонем. Дар шаҳр аксар вақт ҳамон рӯз, ройгон аз 500 сом.",en:"We deliver within 24 hours across Tajikistan — often same-day in the city, free from 500 TJS."}},
    {q:{ru:"Это оригинал с гарантией?",tj:"Ин аслӣ бо кафолат аст?",en:"Is it genuine with warranty?"},a:{ru:"Да. Только оригинальная техника Apple с официальной гарантией. AppleCare+ можно добавить при оформлении для расширенной защиты.",tj:"Бале. Танҳо техникаи аслии Apple бо кафолати расмӣ. AppleCare+-ро ҳангоми харид илова кардан мумкин.",en:"Yes. Only genuine Apple products with official warranty. AppleCare+ can be added at checkout."}},
    {q:{ru:"Можно купить в рассрочку?",tj:"Бо қарз харидан мумкин аст?",en:"Can I pay in instalments?"},a:{ru:"Да, кредит 0% до 24 месяцев. Ежемесячный платёж рассчитывается автоматически при оформлении заказа.",tj:"Бале, қарзи 0% то 24 моҳ. Пардохти моҳона худкор ҳисоб мешавад.",en:"Yes, 0% financing up to 24 months. The monthly payment is calculated automatically at checkout."}},
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
  document.title="ZAMON — "+p.name;
  const li=LIcat(p.cat)||{};const key=li.key;const pd=PAGEDATA[key];const cols=p.buyColors||p.colors;
  const mkey=Object.keys(MODELS).find(k=>MODELS[k].productId===id);const ts=mkey?TECHSPECS[mkey]:null;
  const sp=SPECS[id]||{};const SL=x=>typeof x==="string"?x:tr(x);
  const dark=p.darkMedia&&!p.buyColors;
  const hero=`<section class="phero ${dark?"dark":"light"} prod-hero">${p.new?`<div class="pe">NEW</div>`:`<div class="pe">${li.name||p.line}</div>`}
    <h1>${p.name}</h1><p class="psub">${tr(p.tag)}</p>
    <p class="pprice">${t("from")}${fmtPrice(p.price)} · ${t("from")}${fmtPrice(monthly(p.price))}${t("mo")} · ${t("co_pay3")}</p>
    <div class="phero-cta"><a class="btn btn-primary lg" href="buy.html?id=${id}">${t("pp_buy")}</a><button class="btn btn-ghost lg" id="prodAdd">${t("buy_add")}</button></div>
    ${cols.length>1?`<div class="prod-sw">${cols.map((c,i)=>`<button class="psw ${i===0?"active":""}" data-pi="${i}" style="background:${c.hex}" title="${tr(c.n)}" aria-label="${tr(c.n)}"></button>`).join("")}</div>`:""}
    <img class="phero-img" id="prodImg" src="${cols[0].img}" data-emoji="${p.emoji}" alt="${p.name}" onerror="imgFallback(this)"></section>`;
  let specsHtml;
  if(ts){specsHtml=`<div class="specs-grid">${ts.map(g=>`<div class="spec-group reveal"><h3>${SL(g.t)}</h3><dl>${g.rows.map(([k,v])=>`<div class="spec-row"><dt>${SL(k)}</dt><dd>${SL(v)}</dd></div>`).join("")}</dl></div>`).join("")}</div>`;}
  else{const rows=[[t("spec_chip"),sp.chip],[t("spec_display"),sp.display],[t("spec_battery"),sp.battery],[t("spec_price"),fmtPrice(p.price)]].filter(r=>r[1]);
    specsHtml=`<div class="specs-grid"><div class="spec-group reveal" style="max-width:520px;margin:0 auto"><h3>${p.name}</h3><dl>${rows.map(([k,v])=>`<div class="spec-row"><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl></div></div>`;}
  const flbl=p.cat==="audio"?[tr({ru:"Чип",tj:"Чип",en:"Chip"}),tr({ru:"Подключение",tj:"Пайвастшавӣ",en:"Connectivity"}),tr({ru:"Время работы",tj:"Батарея",en:"Battery"})]
    :p.cat==="watch"?[tr({ru:"Чип",tj:"Чип",en:"Chip"}),tr({ru:"Корпус",tj:"Корпус",en:"Case"}),tr({ru:"Батарея",tj:"Батарея",en:"Battery"})]
    :[t("spec_chip"),t("spec_display"),t("spec_battery")];
  const ficons=p.cat==="audio"?["🎧","🔌","🔋"]:p.cat==="watch"?["⌚","📐","🔋"]:["⚡","🖥️","🔋"];
  const fvals=[sp.chip,sp.display,sp.battery];
  const feats=(sp.chip&&sp.display&&sp.battery)?`<section class="sec alt"><div class="wrap"><div class="sec-head reveal"><h2>${t("pp_highlights")}</h2><p class="sec-sub">${tr({ru:"Главное об устройстве — коротко.",tj:"Асосӣ дар бораи дастгоҳ.",en:"The key things at a glance."})}</p></div>
    <div class="prod-feats">${fvals.map((v,i)=>`<div class="pf-card reveal"><div class="pf-ic">${ficons[i]}</div><div class="pf-big">${v}</div><div class="pf-lbl">${flbl[i]}</div></div>`).join("")}</div></div></section>`:"";
  const benefits=[{ic:"🛡️",h:t("s1h"),p:t("s1p")},{ic:"💳",h:t("s3h"),p:t("s3p")},{ic:"🚚",h:t("s2h"),p:t("s2p")}];
  const why=`<section class="sec"><div class="wrap"><div class="sec-head reveal"><h2>${tr({ru:"Почему ZAMON",tj:"Чаро ZAMON",en:"Why ZAMON"})}</h2></div>
    <div class="why-adv">${benefits.map(w=>`<div class="wa reveal"><div class="wa-ic">${w.ic}</div><h4>${w.h}</h4><p>${w.p}</p></div>`).join("")}</div></div></section>`;
  const specsSec=`<section class="sec alt"><div class="wrap"><div class="sec-head reveal"><h2>${t("spec_h")}</h2></div>${specsHtml}</div></section>`;
  const faqSec=buildBuyerFAQ();
  const witbSec=buildWITB(p);
  const cta=`<section class="sec"><div class="wrap" style="text-align:center"><h2 style="font-size:clamp(1.8rem,4vw,2.6rem);margin-bottom:14px">${tr({ru:"Готовы к покупке?",tj:"Ба харид тайёред?",en:"Ready to buy?"})}</h2>
    <p style="color:var(--text-2);max-width:520px;margin:0 auto 22px">${tr({ru:"Оригинал, официальная гарантия, кредит 0% и доставка за 24 часа по Таджикистану.",tj:"Аслӣ, кафолати расмӣ, қарзи 0% ва расонидан дар 24 соат.",en:"Genuine, official warranty, 0% financing and 24-hour delivery."})}</p>
    <div class="phero-cta" style="justify-content:center"><a class="btn btn-primary lg" href="buy.html?id=${id}">${t("pp_buy")} · ${fmtPrice(p.price)}</a><a class="btn btn-ghost lg" href="${li.page||"index.html"}">${t("details")} →</a></div></div></section>`;
  root.innerHTML=hero+feats+why+specsSec+witbSec+faqSec+cta;
  root.querySelectorAll("[data-pi]").forEach(b=>b.onclick=()=>{const i=+b.dataset.pi;document.getElementById("prodImg").src=cols[i].img;root.querySelectorAll("[data-pi]").forEach(s=>s.classList.toggle("active",s===b));});
  wireFAQ(root);
  const add=root.querySelector("#prodAdd");if(add)add.onclick=()=>{addToCart(id,0);openCart();};
  observeReveal();initTilt(".pf-card");
}

/* ===== RENDER: accessories (accessories.html) ===== */
function renderAccessories(){
  const hero=document.getElementById("accHero");
  if(hero)hero.innerHTML=`<div class="pe">ZAMON</div><h1>${t("acc_h")}</h1><p class="psub">${t("acc_sub")}</p>`;
  const box=document.getElementById("accgrid");if(!box)return;
  document.title="ZAMON — "+t("acc_h");
  const items=PRODUCTS.filter(p=>p.cat==="acc");
  box.innerHTML=`<div class="acc-grid">`+items.map(cardHtml).join("")+`</div>`;
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
  <div class="tools-grid">
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
    <div class="tool-card">
      <h3>${t("calc_title")}</h3><p class="sec-sub" style="margin-bottom:18px">${t("calc_sub")}</p>
      <label class="tool-lbl">${t("calc_product")}</label>
      <select class="tool-select" id="calcSel">${tradeables.map(p=>`<option value="${p.id}" ${p.id===TI.calcId?"selected":""}>${p.name} — ${fmtPrice(p.price)}</option>`).join("")}</select>
      <label class="tool-lbl">${t("calc_term")}</label>
      <div class="ti-conds">${[12,24].map(m=>`<button class="ti-cond ${TI.term===m?"active":""}" data-term="${m}">${m} ${t("calc_mo")}</button>`).join("")}</div>
      <label class="calc-care"><input type="checkbox" id="calcCare" ${TI.care?"checked":""}> ${t("calc_care")} ${CARE[cp.cat]?`(+${fmtPrice(CARE[cp.cat])})`:""}</label>
      <div class="ti-result"><span>${t("calc_monthly")}</span><div class="ti-amount">${fmtPrice(monthly)}<small>/${t("calc_mo")} · 0%</small></div></div>
      <div class="calc-total"><span>${t("calc_total")}</span><b>${fmtPrice(calcBase)}</b></div>
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
   {ic:"💳",h:{ru:"Кредит и оплата",tj:"Қарз ва пардохт",en:"Financing"},p:{ru:"Кредит 0% до 24 месяцев, наличные или карта.",tj:"Қарзи 0% то 24 моҳ, нақд ё корт.",en:"0% financing up to 24 months, cash or card."},page:"trade-in.html"},
   {ic:"↩️",h:{ru:"Возврат",tj:"Баргардонидан",en:"Returns"},p:{ru:"14 дней на возврат без объяснения причин.",tj:"14 рӯз барои баргардонидан.",en:"14-day returns, no questions asked."},page:"index.html#services"},
   {ic:"➕",h:{ru:"AppleCare+",tj:"AppleCare+",en:"AppleCare+"},p:{ru:"Расширенная гарантия и защита от повреждений.",tj:"Кафолати васеъ ва ҳифз аз осеб.",en:"Extended warranty and damage protection."},page:"index.html#services"}];
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
   {ic:"📞",h:{ru:"Телефон",tj:"Телефон",en:"Phone"},v:{ru:"+992 90 000 00 00",tj:"+992 90 000 00 00",en:"+992 90 000 00 00"}},
   {ic:"✉️",h:{ru:"Эл. почта",tj:"Почта",en:"Email"},v:{ru:"info@zamon.tj",tj:"info@zamon.tj",en:"info@zamon.tj"}},
   {ic:"🕘",h:{ru:"Часы работы",tj:"Соатҳои корӣ",en:"Hours"},v:{ru:"Ежедневно 9:00 – 21:00",tj:"Ҳар рӯз 9:00 – 21:00",en:"Daily 9:00 – 21:00"}}];
  box.innerHTML=`<div class="sec-head reveal"><span class="sec-tag">${tr({ru:"Контакты",tj:"Тамос",en:"Contact"})}</span>
    <h1>${tr({ru:"Мы всегда на связи",tj:"Мо ҳамеша дар тамос",en:"We're always here"})}</h1>
    <p class="sec-sub">${tr({ru:"Приходите в магазин или напишите нам — ответим быстро.",tj:"Ба мағоза биёед ё нависед.",en:"Visit the store or message us — we reply fast."})}</p></div>
    <div class="contact-grid">
      <div class="contact-info">${info.map(i=>`<div class="ci-row reveal"><div class="ci-ic">${i.ic}</div><div><div class="ci-h">${tr(i.h)}</div><div class="ci-v">${tr(i.v)}</div></div></div>`).join("")}
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
   {ic:"🤝",h:{ru:"Доверие клиентов",tj:"Боварии мизоҷон",en:"Customer trust"},p:{ru:"Более 50 000 довольных клиентов по всему Таджикистану.",tj:"Зиёда аз 50 000 мизоҷон.",en:"Over 50,000 happy customers across Tajikistan."}},
   {ic:"⚡",h:{ru:"Премиальный сервис",tj:"Хизмати олӣ",en:"Premium service"},p:{ru:"Доставка за 24 часа, кредит 0%, Trade-In и поддержка 24/7.",tj:"Расонидан 24с, қарзи 0%, дастгирӣ 24/7.",en:"24-hour delivery, 0% financing, Trade-In and 24/7 support."}}];
  box.innerHTML=`<div class="about-hero reveal"><span class="sec-tag">${tr({ru:"О ZAMON",tj:"Дар бораи ZAMON",en:"About ZAMON"})}</span>
    <h1>${tr({ru:"Apple, которому доверяют в Таджикистане",tj:"Apple, ки дар Тоҷикистон бовар мекунанд",en:"The Apple store Tajikistan trusts"})}</h1>
    <p>${tr({ru:"ZAMON — авторизованный премиальный магазин техники Apple. Мы не просто продаём устройства — мы отвечаем за каждое, от выбора до сервиса.",tj:"ZAMON — мағозаи расмии премиалии Apple. Мо барои ҳар дастгоҳ ҷавобгар ҳастем.",en:"ZAMON is an authorized premium Apple store. We don't just sell devices — we stand behind every one."})}</p></div>
    <div class="about-stats reveal"><div><div class="num" data-count="50000">0</div><span>${t("stat1")}</span></div><div><div class="num" data-count="100">0</div><span>${t("stat2")}</span></div><div><div class="num" data-count="24">0</div><span>${t("stat3")}</span></div></div>
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
  if(bsw){const p=P(+bsw.dataset.bsw),idx=+bsw.dataset.idx,card=bsw.closest(".bgcard"),img=card&&card.querySelector("img"),cols=p.buyColors||p.colors;if(img)img.src=cols[idx].img;if(card)card.querySelectorAll("[data-bsw]").forEach(s=>s.classList.toggle("active",s===bsw));return;}
  const sw=e.target.closest("[data-sw]");
  if(sw){const p=P(+sw.dataset.sw),idx=+sw.dataset.idx,card=sw.closest(".pcard,.lcard"),img=card&&card.querySelector("img");if(img)img.src=p.colors[idx].img;if(card)card.querySelectorAll("[data-sw]").forEach(s=>s.classList.toggle("active",s===sw));return;}
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
  if(document.getElementById("catalog"))renderCatalog();
  if(document.getElementById("buygrid"))renderBuyGrid();
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
