// Script Utama UTS Pemrograman Web 1 - Deli Nurlaeli (312510061)

document.addEventListener("DOMContentLoaded", function () {
    // 1. Greeting Local Time
    const greetingTitle = document.getElementById("greetingTitle");
    const localTimeDisplay = document.getElementById("localTimeDisplay");
    
    if (greetingTitle && localTimeDisplay) {
        const now = new Date();
        const hours = now.getHours();
        let waktuStr = "pagi";
        let emoji = "🌅";

        if (hours >= 3 && hours < 11) {
            waktuStr = "pagi";
            emoji = "🌅";
        } else if (hours >= 11 && hours < 15) {
            waktuStr = "siang";
            emoji = "☀️";
        } else if (hours >= 15 && hours < 18) {
            waktuStr = "sore";
            emoji = "🌇";
        } else {
            waktuStr = "malam";
            emoji = "🌙";
        }

        greetingTitle.innerHTML = `${emoji} Selamat ${waktuStr}, Deli Nurlaeli!`;
        localTimeDisplay.innerHTML = `Waktu Lokal: ${now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${now.toLocaleTimeString('id-ID')}`;
    }

    const totalBooks = document.getElementById("totalBooks");
    if (totalBooks && typeof katalogBuku !== 'undefined') {
        totalBooks.innerText = `${katalogBuku.length} Buku`;
    }

    // 2. Login Form & Alert
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if ((email === "admin@bookstore.com" && password === "123456") || (email.length > 3 && password.length >= 4)) {
                alert("Login Berhasil! Mengalihkan ke Dashboard...");
                window.location.href = "dashboard.html";
            } else {
                alert("email/password yang anda masukkan salah");
            }
        });
    }

    // Modals handler
    const forgotModal = document.getElementById("forgotModal");
    const registerModal = document.getElementById("registerModal");
    const forgotBtn = document.getElementById("forgotBtn");
    const registerBtn = document.getElementById("registerBtn");
    const closeForgot = document.getElementById("closeForgot");
    const closeRegister = document.getElementById("closeRegister");

    if (forgotBtn && forgotModal) {
        forgotBtn.onclick = (e) => { e.preventDefault(); forgotModal.style.display = "flex"; };
        closeForgot.onclick = () => { forgotModal.style.display = "none"; };
    }
    if (registerBtn && registerModal) {
        registerBtn.onclick = (e) => { e.preventDefault(); registerModal.style.display = "flex"; };
        closeRegister.onclick = () => { registerModal.style.display = "none"; };
    }

    window.onclick = (event) => {
        if (event.target == forgotModal) forgotModal.style.display = "none";
        if (event.target == registerModal) registerModal.style.display = "none";
    };

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm("Yakin ingin keluar?")) {
                window.location.href = "index.html";
            }
        };
    }

    // 3. Stok & Katalog Table (DOM)
    const catalogTableBody = document.getElementById("catalogTableBody");
    if (catalogTableBody && typeof katalogBuku !== 'undefined') {
        renderCatalog();
    }

    const addBookForm = document.getElementById("addBookForm");
    if (addBookForm) {
        addBookForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const title = document.getElementById("newTitle").value;
            const author = document.getElementById("newAuthor").value;
            const price = parseInt(document.getElementById("newPrice").value);
            const stock = parseInt(document.getElementById("newStock").value);

            const newId = katalogBuku.length + 1;
            katalogBuku.push({ id: newId, judul: title, penulis: author, harga: price, stok: stock });
            
            alert("Buku baru berhasil ditambahkan via DOM!");
            renderCatalog();
            addBookForm.reset();
        });
    }

    function renderCatalog() {
        if (!catalogTableBody) return;
        catalogTableBody.innerHTML = "";
        katalogBuku.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.id}</td>
                <td><strong>${item.judul}</strong></td>
                <td>${item.penulis}</td>
                <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
                <td><span class="badge ${item.stok > 5 ? 'badge-success' : 'badge-warning'}">${item.stok} pcs</span></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteBook(${index})" style="background:#e74c3c; color:white; padding:6px 12px; border:none; border-radius:4px; cursor:pointer;">Hapus</button>
                </td>
            `;
            catalogTableBody.appendChild(tr);
        });
    }

    window.deleteBook = function(index) {
        if (confirm("Yakin ingin menghapus buku ini?")) {
            katalogBuku.splice(index, 1);
            renderCatalog();
        }
    };

    // 4. Checkout / Pemesanan
    const selectBook = document.getElementById("selectBook");
    const cartTableBody = document.getElementById("cartTableBody");
    let cart = [];

    if (selectBook && typeof katalogBuku !== 'undefined') {
        katalogBuku.forEach(book => {
            const opt = document.createElement("option");
            opt.value = book.id;
            opt.textContent = `${book.judul} - Rp ${book.harga.toLocaleString('id-ID')}`;
            selectBook.appendChild(opt);
        });
    }

    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn) {
        addToCartBtn.onclick = function() {
            const bookId = parseInt(selectBook.value);
            const qty = parseInt(document.getElementById("buyQty").value);
            const selectedBook = katalogBuku.find(b => b.id === bookId);

            if (selectedBook && qty > 0) {
                cart.push({ ...selectedBook, qty: qty });
                renderCart();
            }
        };
    }

    function renderCart() {
        if (!cartTableBody) return;
        cartTableBody.innerHTML = "";
        let total = 0;

        cart.forEach((item, idx) => {
            const subtotal = item.harga * item.qty;
            total += subtotal;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.judul}</td>
                <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
                <td>${item.qty}</td>
                <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
                <td><button class="btn btn-sm btn-danger" onclick="removeFromCart(${idx})" style="background:#e74c3c; color:white; padding:4px 8px; border:none; border-radius:4px; cursor:pointer;">X</button></td>
            `;
            cartTableBody.appendChild(tr);
        });

        const cartTotalPrice = document.getElementById("cartTotalPrice");
        if (cartTotalPrice) {
            cartTotalPrice.innerText = `Rp ${total.toLocaleString('id-ID')}`;
        }
    }

    window.removeFromCart = function(idx) {
        cart.splice(idx, 1);
        renderCart();
    };

    const checkoutForm = document.getElementById("checkoutForm");
    const successModal = document.getElementById("successModal");
    const generatedDONumber = document.getElementById("generatedDONumber");
    const closeSuccessModal = document.getElementById("closeSuccessModal");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function(e) {
            e.preventDefault();
            if (cart.length === 0) {
                alert("Keranjang belanja masih kosong!");
                return;
            }
            const randomDO = "DO-" + Math.floor(10000 + Math.random() * 90000);
            if (generatedDONumber) generatedDONumber.innerText = randomDO;
            if (successModal) successModal.style.display = "flex";
        });
    }

    if (closeSuccessModal) {
        closeSuccessModal.onclick = function() {
            successModal.style.display = "none";
            window.location.href = "tracking.html";
        };
    }

    // 5. Tracking Page
    const searchDoBtn = document.getElementById("searchDoBtn");
    const trackingResultCard = document.getElementById("trackingResultCard");

    if (searchDoBtn) {
        searchDoBtn.onclick = function() {
            const doNum = document.getElementById("doInput").value.trim();
            if (dummyTracking[doNum]) {
                const data = dummyTracking[doNum];
                document.getElementById("resDo").innerText = doNum;
                document.getElementById("resName").innerText = data.nama;
                document.getElementById("resDate").innerText = data.tanggal;
                document.getElementById("resCourier").innerText = data.ekspedisi;
                document.getElementById("resTotal").innerText = data.total;

                const s1 = document.getElementById("step1");
                const s2 = document.getElementById("step2");
                const s3 = document.getElementById("step3");

                s1.className = "progress-step completed";
                s2.className = data.status >= 2 ? "progress-step completed" : "progress-step";
                s3.className = data.status >= 3 ? "progress-step completed" : "progress-step";

                trackingResultCard.style.display = "block";
            } else {
                alert("Nomor Delivery Order (DO) tidak ditemukan! Coba: DO-99214");
                if (trackingResultCard) trackingResultCard.style.display = "none";
            }
        };
    }
});
