// ================= Допоміжні функції виведення =================
const $ = (id) => document.getElementById(id);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const fmt = (v) => (typeof v === "boolean" ? (v ? "так" : "ні") : esc(v));

// Малює таблицю з масиву плоских об'єктів
function table(rows) {
  if (!rows.length) return '<p class="muted">Нічого не знайдено</p>';
  const keys = Object.keys(rows[0]);
  const head = keys.map((k) => `<th>${esc(k)}</th>`).join("");
  const body = rows
    .map((r) => `<tr>${keys.map((k) => `<td>${fmt(r[k])}</td>`).join("")}</tr>`)
    .join("");
  return `<table><tr>${head}</tr>${body}</table>`;
}

// Таблиця "ключ — значення" для об'єкта
function keyValueTable(obj, keyTitle, valueTitle) {
  const body = Object.entries(obj)
    .map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join("");
  return `<table><tr><th>${keyTitle}</th><th>${valueTitle}</th></tr>${body}</table>`;
}

// ================= Завдання 1 =================
const products = [
  { name: "Ноутбук", category: "Електроніка", price: 25000, inStock: 5 },
  { name: "Смартфон", category: "Електроніка", price: 18000, inStock: 0 },
  { name: "Навушники", category: "Аксесуари", price: 1500, inStock: 12 },
  { name: "Клавіатура", category: "Аксесуари", price: 900, inStock: 0 },
  { name: "Монітор", category: "Електроніка", price: 7000, inStock: 3 },
];

function getAvailableProducts(items) {
  return items.filter((product) => product.inStock > 0);
}

function findProductByName(items, name) {
  const found = items.find(
    (product) => product.name.toLowerCase() === String(name).trim().toLowerCase()
  );
  return found ?? "Товар не знайдено";
}

$("t1-all").innerHTML = table(products);
$("t1-available").innerHTML = table(getAvailableProducts(products));

function searchProduct() {
  const result = findProductByName(products, $("t1-input").value);
  $("t1-result").innerHTML =
    typeof result === "string" ? `<p class="muted">${result}</p>` : table([result]);
}
$("t1-btn").addEventListener("click", searchProduct);
$("t1-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchProduct();
});

// ================= Завдання 2 =================
const students = [
  { name: "Олена", age: 19, grade: 92, group: "КН-21" },
  { name: "Андрій", age: 20, grade: 78, group: "КН-22" },
  { name: "Марія", age: 19, grade: 85, group: "КН-21" },
  { name: "Іван", age: 21, grade: 64, group: "КН-23" },
  { name: "Софія", age: 20, grade: 97, group: "КН-22" },
  { name: "Дмитро", age: 19, grade: 71, group: "КН-23" },
];

function groupBy(list) {
  return list.reduce((groups, student) => {
    if (!groups[student.group]) {
      groups[student.group] = [];
    }
    groups[student.group].push(student);
    return groups;
  }, {});
}

function sortStudentsByGrade(list) {
  return [...list].sort((a, b) => b.grade - a.grade);
}

$("t2-groups").innerHTML = Object.entries(groupBy(students))
  .map(([group, list]) => `<h4>Група ${esc(group)}</h4>${table(list)}`)
  .join("");
$("t2-sorted").innerHTML = table(sortStudentsByGrade(students));

// ================= Завдання 3 =================
const employees = [
  { name: "Петро", position: "Розробник", salary: 40000, years: 3 },
  { name: "Ольга", position: "Дизайнер", salary: 32000, years: 5 },
  { name: "Максим", position: "Менеджер", salary: 45000, years: 8 },
  { name: "Юлія", position: "Тестувальник", salary: 28000, years: 2 },
];

function getAverageSalary(list) {
  if (list.length === 0) return 0;
  const total = list.reduce((sum, employee) => sum + employee.salary, 0);
  return total / list.length;
}

function findMostExperiencedEmployee(list) {
  return list.reduce((best, employee) =>
    employee.years > best.years ? employee : best
  );
}

$("t3-all").innerHTML = table(employees);
$("t3-average").innerHTML = `Середня зарплата: <b>${getAverageSalary(employees).toFixed(2)}</b>`;
$("t3-experienced").innerHTML = table([findMostExperiencedEmployee(employees)]);

// ================= Завдання 4 =================
const books = [
  { title: "Кобзар", author: "Тарас Шевченко", year: 1840, rating: 4.8, isRead: true },
  { title: "Лісова пісня", author: "Леся Українка", year: 1911, rating: 4.6, isRead: false },
  { title: "Тіні забутих предків", author: "Михайло Коцюбинський", year: 1911, rating: 4.2, isRead: true },
  { title: "Intermezzo", author: "Михайло Коцюбинський", year: 1908, rating: 3.9, isRead: false },
  { title: "Fata morgana", author: "Михайло Коцюбинський", year: 1910, rating: 4.0, isRead: false },
  { title: "Захар Беркут", author: "Іван Франко", year: 1883, rating: 4.5, isRead: true },
];

function getUnreadBooks(list) {
  return list.reduce((titles, book) => {
    if (!book.isRead) titles.push(book.title);
    return titles;
  }, []);
}

function getBooksByAuthor(list, author) {
  return list
    .reduce((result, book) => {
      if (book.author === author) result.push(book);
      return result;
    }, [])
    .sort((a, b) => a.year - b.year);
}

function getTopRatedBooks(list) {
  return list
    .reduce((result, book) => {
      if (book.rating > 4) result.push(book);
      return result;
    }, [])
    .sort((a, b) => b.rating - a.rating);
}

$("t4-all").innerHTML = table(books);
$("t4-unread").innerHTML =
  "<ul>" + getUnreadBooks(books).map((t) => `<li>${esc(t)}</li>`).join("") + "</ul>";
$("t4-top").innerHTML = table(getTopRatedBooks(books));

const authors = [...new Set(books.map((b) => b.author))];
$("t4-author").innerHTML = authors.map((a) => `<option>${esc(a)}</option>`).join("");
function showAuthorBooks() {
  $("t4-author-result").innerHTML = table(getBooksByAuthor(books, $("t4-author").value));
}
$("t4-author").addEventListener("change", showAuthorBooks);
showAuthorBooks();

// ================= Завдання 5 =================
const orders = [
  { orderId: 1, customer: { name: "Олена", email: "olena@example.com" }, items: ["Ноутбук", "Мишка"], total: 26000 },
  { orderId: 2, customer: { name: "Андрій", email: "andriy@example.com" }, items: ["Навушники"], total: 1500 },
  { orderId: 3, customer: { name: "Олена", email: "olena@example.com" }, items: ["Монітор"], total: 7000 },
  { orderId: 4, customer: { name: "Марія", email: "maria@example.com" }, items: ["Клавіатура", "Мишка"], total: 1300 },
];

function getTotalSpentByCustomer(orderList, customerName) {
  return orderList
    .filter((order) => order.customer.name === customerName)
    .reduce((sum, order) => sum + order.total, 0);
}

// Для відображення "розгортаємо" вкладені дані в плоскі рядки
$("t5-all").innerHTML = table(
  orders.map((o) => ({
    orderId: o.orderId,
    "customer.name": o.customer.name,
    "customer.email": o.customer.email,
    items: o.items.join(", "),
    total: o.total,
  }))
);

const customers = [...new Set(orders.map((o) => o.customer.name))];
$("t5-customer").innerHTML = customers.map((c) => `<option>${esc(c)}</option>`).join("");
function showCustomerTotal() {
  const name = $("t5-customer").value;
  $("t5-result").innerHTML = `${esc(name)} витратив(-ла): <b>${getTotalSpentByCustomer(orders, name)}</b>`;
}
$("t5-customer").addEventListener("change", showCustomerTotal);
showCustomerTotal();

// ================= Завдання 6 =================
const productsCatalog = [
  { productId: 1, name: "Ноутбук", price: 25000 },
  { productId: 2, name: "Навушники", price: 1500 },
  { productId: 3, name: "Монітор", price: 7000 },
];

const purchases = [
  { purchaseId: 101, productId: 1, quantity: 2 },
  { purchaseId: 102, productId: 2, quantity: 5 },
  { purchaseId: 103, productId: 1, quantity: 1 },
  { purchaseId: 104, productId: 3, quantity: 3 },
  { purchaseId: 105, productId: 2, quantity: 2 },
];

function getTotalSales(productList, purchaseList) {
  return purchaseList.reduce((sales, purchase) => {
    const product = productList.find((p) => p.productId === purchase.productId);
    if (!product) return sales;
    sales[product.name] = (sales[product.name] || 0) + product.price * purchase.quantity;
    return sales;
  }, {});
}

$("t6-products").innerHTML = table(productsCatalog);
$("t6-purchases").innerHTML = table(purchases);
$("t6-sales").innerHTML = keyValueTable(
  getTotalSales(productsCatalog, purchases),
  "Товар",
  "Дохід"
);
