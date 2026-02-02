// src/lib/storage.ts
export function getPayments() {
  return JSON.parse(localStorage.getItem("payments") || "[]");
}

export function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions") || "[]");
}

export function getListings() {
  return JSON.parse(localStorage.getItem("listings") || "[]");
}

export function addPayment(payment: unknown) {
  const p = getPayments();
  p.push(payment);
  localStorage.setItem("payments", JSON.stringify(p));
}

export function addTransaction(tx: unknown) {
  const t = getTransactions();
  t.push(tx);
  localStorage.setItem("transactions", JSON.stringify(t));
}
