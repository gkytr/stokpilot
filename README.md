# StokPilot — Stok Yönetim Paneli

Responsive demo uygulaması: ürün envanteri, stok seviyeleri ve kritik stok takibi.

## Özellikler
- KPI kartları: toplam ürün, stok adedi, yaklaşık stok maliyeti ve kritik stok sayısı
- Ürün ekleme, düzenleme ve silme (CRUD)
- Ürün adı ve SKU ile arama
- Kategori ve stok durumuna göre filtreleme
- Minimum stok seviyesine göre uyarılar
- Kategori bazlı stok dağılımı
- CSV dışa aktarma
- LocalStorage ile tarayıcıda veri saklama
- Mobil uyumlu arayüz

## Çalıştırma
Projeyi klonlayıp `index.html` dosyasını tarayıcıda açabilirsin. Build aracı veya backend gerekmez.

## Teknolojiler
HTML5, CSS3, Vanilla JavaScript, LocalStorage.

## Kapsam
Bu çalışma portfolyo amaçlı bir frontend prototipidir. Örnek veriler kullanır ve kayıtları yalnızca tarayıcıdaki LocalStorage alanında tutar. Backend, kimlik doğrulama, çok kullanıcılı erişim, merkezi veritabanı veya gerçek satış entegrasyonu içermez. Stok değeri, birim maliyet ile stok adedinin çarpımıdır.

## Geliştirme fikirleri
- Backend API ve veritabanı entegrasyonu
- Kullanıcı rolleri ve kimlik doğrulama
- Stok giriş/çıkış hareket geçmişi
- Satış siparişleri ve raporlama
- Tarih aralığına göre grafikler
