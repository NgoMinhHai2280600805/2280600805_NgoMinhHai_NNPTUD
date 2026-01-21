// Câu 1: Constructor Product
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}

// Câu 2: Khởi tạo mảng products
const products = [
    new Product(1, "Laptop Dell", 25000000, 5, "Electronics", true),
    new Product(2, "iPhone 15", 32000000, 3, "Electronics", true),
    new Product(3, "Tai nghe Bluetooth", 1500000, 0, "Accessories", false),
    new Product(4, "Chuột Logitech", 800000, 10, "Accessories", true),
    new Product(5, "Bàn phím cơ", 2000000, 7, "Accessories", true),
    new Product(6, "Màn hình LG", 6000000, 2, "Electronics", true),
];

// Câu 3: Mảng mới chỉ chứa name và price
const nameAndPrice = products.map(p => ({
    name: p.name,
    price: p.price
}));
console.log("Câu 3:", nameAndPrice);

// Câu 4: Lọc sản phẩm còn hàng 
const inStockProducts = products.filter(p => p.quantity > 0);
console.log("Câu 4:", inStockProducts);

// Câu 5: Kiểm tra có sản phẩm giá > 30.000.000 không
const hasExpensiveProduct = products.some(p => p.price > 30000000);
console.log("Câu 5:", hasExpensiveProduct);

// Câu 6: Kiểm tra tất cả sản phẩm Accessories có đang bán không
const accessoriesAvailable = products
    .filter(p => p.category === "Accessories")
    .every(p => p.isAvailable === true);
console.log("Câu 6:", accessoriesAvailable);

// Câu 7: Tính tổng giá trị kho hàng
const totalInventoryValue = products.reduce(
    (total, p) => total + p.price * p.quantity,
    0
);
console.log("Câu 7: Tổng giá trị kho =", totalInventoryValue);

// Câu 8: for...of in thông tin sản phẩm
console.log("Câu 8:");
for (const p of products) {
    console.log(`${p.name} - ${p.category} - ${p.isAvailable ? "Đang bán" : "Ngừng bán"}`);
}

// Câu 9: for...in in tên thuộc tính và giá trị
console.log("Câu 9:");
for (const key in products[0]) {
    console.log(key + ":", products[0][key]);
}

// Câu 10: Danh sách tên sản phẩm đang bán và còn hàng
const sellingAndInStock = products
    .filter(p => p.isAvailable && p.quantity > 0)
    .map(p => p.name);

console.log("Câu 10:", sellingAndInStock);
