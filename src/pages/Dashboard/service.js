/* eslint-disable import/prefer-default-export */
// Mock service since APIs are not available yet.

export const DashboardService = {
  getMetrics: async () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            total_employees: 120,
            active_employees: 110,
          },
        })
      }, 500)
    }),
  getEmployees: async () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [],
          meta: { total: 0 },
        })
      }, 500)
    }),
}
