export function formatCurrency(value:number) {
  return "Ksh " + Number(value || 0).toLocaleString();
}
