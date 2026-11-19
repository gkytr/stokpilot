const STORAGE_KEY = "stokpilot-products-v1";
const initialProducts = [
  {id:1,name:"Kablosuz Mouse",sku:"ELK-001",category:"Elektronik",price:420,quantity:18,minimum:5},
  {id:2,name:"Mekanik Klavye",sku:"ELK-002",category:"Elektronik",price:1850,quantity:4,minimum:6},
  {id:3,name:"USB-C Hub",sku:"ELK-003",category:"Elektronik",price:790,quantity:12,minimum:4},
  {id:4,name:"A4 Fotokopi Kağıdı",sku:"OFS-001",category:"Ofis",price:165,quantity:3,minimum:8},
  {id:5,name:"Masaüstü Organizer",sku:"OFS-002",category:"Ofis",price:240,quantity:22,minimum:5},
  {id:6,name:"Filtre Kahve 1 kg",sku:"GDA-001",category:"Gıda",price:560,quantity:7,minimum:7},
  {id:7,name:"Termos 500 ml",sku:"DIG-001",category:"Diğer",price:390,quantity:14,minimum:4}
];
const $ = (selector) => document.querySelector(selector);
let products = loadProducts();

function loadProducts(){
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialProducts.map(item=>({...item}));
  } catch { return initialProducts.map(item=>({...item})); }
}
function saveProducts(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(products)); }
function money(value){ return new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:2}).format(value); }
function escapeHTML(value){ return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
function isLow(item){ return item.quantity <= item.minimum; }

function render(){
  const totalUnits = products.reduce((sum,item)=>sum+item.quantity,0);
  const stockValue = products.reduce((sum,item)=>sum+item.quantity*item.price,0);
  const lowItems = products.filter(isLow);
  $("#metric-products").textContent = products.length;
  $("#metric-units").textContent = totalUnits.toLocaleString("tr-TR");
  $("#metric-value").textContent = money(stockValue);
  $("#metric-low").textContent = lowItems.length;
  $("#alert-count").textContent = lowItems.length;
  renderTable();
  renderAlerts(lowItems);
  renderCategories();
}
function filteredProducts(){
  const query = $("#search-input").value.trim().toLocaleLowerCase("tr-TR");
  const category = $("#category-filter").value;
  const stock = $("#stock-filter").value;
  return products.filter(item=>{
    const matchesQuery = !query || item.name.toLocaleLowerCase("tr-TR").includes(query) || item.sku.toLocaleLowerCase("tr-TR").includes(query);
    const matchesCategory = category==="all" || item.category===category;
    const matchesStock = stock==="all" || (stock==="low" ? isLow(item) : !isLow(item));
    return matchesQuery && matchesCategory && matchesStock;
  }).sort((a,b)=>a.name.localeCompare(b.name,"tr"));
}
function renderTable(){
  const list=filteredProducts();
  $("#product-table").innerHTML=list.map(item=>`
    <tr>
      <td><div class="product-name"><span class="product-symbol">${escapeHTML(item.name.charAt(0).toLocaleUpperCase("tr"))}</span><span>${escapeHTML(item.name)}<small class="product-sub">Ürün kaydı</small></span></div></td>
      <td>${escapeHTML(item.category)}</td><td>${escapeHTML(item.sku)}</td>
      <td>${money(item.price)}</td><td><span class="stock-number">${item.quantity}</span> adet</td>
      <td><span class="status ${isLow(item)?"low":"ok"}">${isLow(item)?"Kritik":"Yeterli"}</span></td>
      <td><div class="row-actions"><button class="mini-btn" data-action="edit" data-id="${item.id}" aria-label="${escapeHTML(item.name)} düzenle" title="Düzenle">✎</button><button class="mini-btn" data-action="delete" data-id="${item.id}" aria-label="${escapeHTML(item.name)} sil" title="Sil">×</button></div></td>
    </tr>`).join("");
  $("#empty-state").hidden=list.length!==0;
  $("#result-count").textContent=`${list.length} / ${products.length} ürün gösteriliyor`;
}
function renderAlerts(items){
  $("#alerts-list").innerHTML=items.length?items.slice(0,5).map(item=>`
    <div class="alert-item"><div><strong>${escapeHTML(item.name)}</strong><small>Minimum seviye: ${item.minimum} adet</small></div><span class="alert-qty">${item.quantity} adet</span></div>`).join(""):'<div class="no-alerts">✓ Kritik stok uyarısı bulunmuyor.</div>';
}
function renderCategories(){
  const categories=["Elektronik","Ofis","Gıda","Diğer"];
  const totals=categories.map(name=>({name,count:products.filter(item=>item.category===name).reduce((sum,item)=>sum+item.quantity,0)}));
  const max=Math.max(1,...totals.map(item=>item.count));
  $("#category-chart").innerHTML=totals.map(item=>`
    <div class="category-row"><div class="category-label"><span>${item.name}</span><strong>${item.count} adet</strong></div><div class="bar-track"><div class="bar-fill" style="width:${item.count/max*100}%"></div></div></div>`).join("");
}
function showToast(message){
  const toast=$("#toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2400);
}
function openDialog(item=null){
  $("#product-form").reset();$("#form-error").textContent="";
  $("#dialog-title").textContent=item?"Ürünü düzenle":"Yeni ürün ekle";
  $("#product-id").value=item?item.id:"";
  if(item){
    $("#product-name").value=item.name;$("#product-sku").value=item.sku;$("#product-category").value=item.category;
    $("#product-price").value=item.price;$("#product-quantity").value=item.quantity;$("#product-minimum").value=item.minimum;
  }else{$("#product-minimum").value=5;}
  $("#product-dialog").showModal();$("#product-name").focus();
}
function closeDialog(){$("#product-dialog").close();}
$("#add-product-top").addEventListener("click",()=>openDialog());
$("#close-dialog").addEventListener("click",closeDialog);
$("#cancel-dialog").addEventListener("click",closeDialog);
$("#product-dialog").addEventListener("click",event=>{if(event.target===$("#product-dialog"))closeDialog();});
$("#product-form").addEventListener("submit",event=>{
  event.preventDefault();
  const id=$("#product-id").value;
  const name=$("#product-name").value.trim(),sku=$("#product-sku").value.trim().toLocaleUpperCase("tr-TR");
  const price=Number($("#product-price").value),quantity=Number($("#product-quantity").value),minimum=Number($("#product-minimum").value);
  if(!name||!sku||![price,quantity,minimum].every(Number.isFinite)||price<0||quantity<0||minimum<0){$("#form-error").textContent="Lütfen alanları kontrol et. Sayısal değerler negatif olamaz.";return;}
  if(products.some(item=>item.sku.toLocaleLowerCase("tr-TR")===sku.toLocaleLowerCase("tr-TR")&&String(item.id)!==id)){$("#form-error").textContent="Bu ürün kodu zaten kayıtlı. Farklı bir SKU gir.";return;}
  const record={id:id?Number(id):Date.now(),name,sku,category:$("#product-category").value,price,quantity,minimum};
  if(id){products=products.map(item=>item.id===Number(id)?record:item);showToast("Ürün bilgileri güncellendi.");}
  else{products.push(record);showToast("Yeni ürün envantere eklendi.");}
  saveProducts();render();closeDialog();
});
$("#product-table").addEventListener("click",event=>{
  const button=event.target.closest("button[data-action]");if(!button)return;
  const id=Number(button.dataset.id),item=products.find(product=>product.id===id);if(!item)return;
  if(button.dataset.action==="edit"){openDialog(item);return;}
  if(button.dataset.action==="delete"&&confirm(`“${item.name}” ürününü silmek istediğine emin misin?`)){
    products=products.filter(product=>product.id!==id);saveProducts();render();showToast("Ürün silindi.");
  }
});
["search-input","category-filter","stock-filter"].forEach(id=>$("#"+id).addEventListener(id==="search-input"?"input":"change",renderTable));
$("#export-csv").addEventListener("click",()=>{
  const headers=["Ürün adı","SKU","Kategori","Birim maliyet","Stok adedi","Minimum stok"];
  const rows=products.map(item=>[item.name,item.sku,item.category,item.price,item.quantity,item.minimum]);
  const csv=[headers,...rows].map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(";")).join("\r\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="stokpilot-urunler.csv";link.click();URL.revokeObjectURL(url);
  showToast("CSV dosyası hazırlandı.");
});
$("#mobile-menu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-item").forEach(link=>link.addEventListener("click",()=>{document.querySelectorAll(".nav-item").forEach(item=>item.classList.remove("active"));link.classList.add("active");$("#sidebar").classList.remove("open");}));
$("#today-label").textContent=new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"long",year:"numeric"}).format(new Date());
render();
