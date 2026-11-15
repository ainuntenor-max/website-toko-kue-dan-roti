// 1. DATA PRODUK
const products = [
    {
        id: 1,
        name: "Chocolate Truffle Cake",
        price: 99900,
        // Ganti link di bawah ini dengan foto baru yang Anda inginkan
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400"
    },
    {
        id: 2,
        name: "Red Velvet Cake",
        price: 89900,
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400"
    },
    {
        id: 3,
        name: "Pineapple Cake",
        price: 79900,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400"
    },
    {
        id: 4,
        name: "Black Forest Cake",
        price: 94900,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
    },
    {
        id: 5,
        name: "Butterscotch Cake",
        price: 89900,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400"
    }
];

// 2. KERANJANG
let cart = [];

// 3. FORMAT HARGA RUPIAH
function formatRupiah(harga) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(harga);
}

// 4. MENAMPILKAN PRODUK
function tampilkanProduk(daftarProduk = products) {
    const grid = document.getElementById("productGrid");

    grid.innerHTML = daftarProduk.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${formatRupiah(product.price)}</p>
            <button class="add-cart-btn"
                onclick="tambahKeKeranjang(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

// 5. TAMBAH KE KERANJANG
function tambahKeKeranjang(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const item = cart.find(item => item.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    alert(product.name + " berhasil ditambahkan!");
}

// 6. UPDATE JUMLAH KERANJANG
function updateCartCount() {
    const total = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    document.getElementById("cartCount").textContent = total;
}

// 7. MEMBUKA KERANJANG
function lihatKeranjang() {
    document.getElementById("orderModal").classList.add("active");
    tampilkanKeranjang();
}

// 8. MENAMPILKAN ISI KERANJANG
function tampilkanKeranjang() {
    const cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<div class="empty-cart">Keranjang masih kosong ♡</div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatRupiah(item.price)}</p>

                    <div class="quantity-control">
                        <button onclick="ubahJumlah(${item.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="ubahJumlah(${item.id}, 1)">+</button>
                    </div>
                </div>

                <button class="remove-item"
                    onclick="hapusProduk(${item.id})">
                    Hapus
                </button>
            </div>
        `).join("");
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cartTotal").textContent =
        "Total: " + formatRupiah(total);
}

// 9. MENGUBAH JUMLAH PRODUK
function ubahJumlah(id, perubahan) {
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity += perubahan;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCartCount();
    tampilkanKeranjang();
}

// 10. MENGHAPUS PRODUK
function hapusProduk(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    tampilkanKeranjang();
}

// 11. MENUTUP KERANJANG
function tutupKeranjang() {
    document.getElementById("orderModal").classList.remove("active");
}

// 12. CHECKOUT WHATSAPP
function checkoutWhatsApp(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const nama = document.getElementById("namaPelanggan").value.trim();
    const nomor = document.getElementById("nomorPelanggan").value.trim();
    const alamat = document.getElementById("alamatPelanggan").value.trim();
    const catatan = document.getElementById("catatanPelanggan").value.trim();

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    let pesan = "HALO PINKY AINUN - CAKE SHOP ♡\n\n";
    pesan += "Saya ingin memesan produk berikut:\n\n";

    cart.forEach(item => {
        pesan += item.name + "\n";
        pesan += "Jumlah: " + item.quantity + "\n";
        pesan += "Harga: " +
            formatRupiah(item.price * item.quantity) + "\n\n";
    });

    pesan += "TOTAL: " + formatRupiah(total) + "\n\n";
    pesan += "Nama: " + nama + "\n";
    pesan += "Nomor HP: " + nomor + "\n";
    pesan += "Alamat: " + alamat + "\n";
    pesan += "Catatan: " + (catatan || "-");

    const nomorToko = "6282229088348";

    const linkWhatsApp = "https://wa.me/" + nomorToko +
        "?text=" + encodeURIComponent(pesan);

    window.open(linkWhatsApp, "_blank");
}

// 13. PENCARIAN PRODUK
function cariProduk() {
    const kataKunci = prompt("Masukkan nama kue:");

    if (!kataKunci) return;

    const hasil = products.filter(product =>
        product.name.toLowerCase().includes(kataKunci.toLowerCase())
    );

    tampilkanProduk(hasil);

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

// 14. FAVORIT
function favorit() {
    alert("Terima kasih sudah mengunjungi Pinky Ainun Cake Shop ♡");
}

// 15. MENJALANKAN WEBSITE
tampilkanProduk();
updateCartCount();