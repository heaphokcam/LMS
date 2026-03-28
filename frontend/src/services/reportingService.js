/**
 * Monthly aggregates — replace with API when available.
 * @returns {Promise<{ ok: boolean, items: { month: string, approved: number, rejected: number, pending: number }[], error: string | null }>}
 */
export async function fetchMonthlyReport() {
  return { ok: true, items: [], error: null }
}
