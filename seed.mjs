// Demo seeder for Manager Library (T-21). Uses ONLY the public API (data-model.md §9): never SQL.
// Usage: BASE=http://localhost:8000/api/v1 ADMIN_USERNAME=... ADMIN_PASSWORD=... node seed.mjs
const BASE = process.env.BASE ?? 'http://localhost:8000/api/v1';
const CATEGORIES = [
  '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444', '55555555-5555-4555-8555-555555555555',
];

async function call(method, path, token, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${data?.code ?? ''}`);
  return data;
}

const run = Date.now().toString().slice(-9);
const { access_token: token } = await call('POST', '/auth/login', null, {
  username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD,
});

const books = [];
for (let i = 0; i < 40; i++) {
  const isbn = '978' + run.slice(-8) + String(i).padStart(2, '0');
  books.push(await call('POST', '/books', token, {
    title: `Libro de demostración ${String(i + 1).padStart(2, '0')}`, author: `Autor ${(i % 8) + 1}`,
    isbn, category_id: CATEGORIES[i % 5], total_copies: 2 + (i % 3),
  }));
}

const members = [];
for (let i = 0; i < 10; i++) {
  members.push(await call('POST', '/members', token, { full_name: `Socio demo ${i + 1}`, document_number: `DEMO-${run}-${i + 1}` }));
}

const loans = [];
for (let i = 0; i < 15; i++) {
  loans.push(await call('POST', '/loans', token, { member_id: members[i % 10].id, items: [{ book_id: books[i % 12].id }] }));
}

const today = new Date().toISOString().slice(0, 10);
const report = await call('GET', `/reports/most-borrowed?from=${today}&to=${today}`, token);
const overdue = await call('GET', '/loans/overdue', token);
console.log(JSON.stringify({ books: books.length, members: members.length, loans: loans.length, report_rows: report.rows.length, overdue_lines: overdue.items.length }));
