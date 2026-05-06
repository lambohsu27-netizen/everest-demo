import { COMPANIES } from './companies'

export const ROLES = [
  { id: 'role-superadmin', name: 'Super Admin' },
  { id: 'role-admin', name: 'Admin' },
  { id: 'role-hr-manager', name: 'HR Manager' },
  { id: 'role-hr-officer', name: 'HR Officer' },
  { id: 'role-viewer', name: 'Viewer' },
]

export const USER_STATUSES = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'invited', name: 'Invited' },
]

export const COMPANY_OPTIONS = COMPANIES.map((c) => ({ id: c.id, name: c.name }))

export const USER_OPTIONS = [
  { id: 'u0000001-0000-0000-0000-000000000001', name: 'Super Admin' },
  { id: 'u0000002-0000-0000-0000-000000000002', name: 'Citra Wulandari' },
  { id: 'u0000003-0000-0000-0000-000000000003', name: 'Bagus Hartanto' },
  { id: 'u0000004-0000-0000-0000-000000000004', name: 'Ratna Pradipta' },
]

export const BUSINESS_CATEGORIES = [
  { id: 'bc-01', name: 'Multi-Finance' },
  { id: 'bc-02', name: 'Freight Forwarding' },
  { id: 'bc-03', name: 'Industrial Equipment' },
  { id: 'bc-04', name: 'Software-as-a-Service' },
  { id: 'bc-05', name: 'Renewable Energy' },
  { id: 'bc-06', name: 'Retail & E-commerce' },
  { id: 'bc-07', name: 'Healthcare Services' },
]

export const INDUSTRIES = [
  { id: 'ind-01', name: 'Financial Services' },
  { id: 'ind-02', name: 'Logistics & Distribution' },
  { id: 'ind-03', name: 'Manufacturing' },
  { id: 'ind-04', name: 'Technology & Software' },
  { id: 'ind-05', name: 'Energy & Utilities' },
  { id: 'ind-06', name: 'Retail' },
  { id: 'ind-07', name: 'Healthcare' },
]

export const EMPLOYEE_RANGES = [
  { id: 'er-01', name: '< 50 employees' },
  { id: 'er-02', name: '50 - 100 employees' },
  { id: 'er-03', name: '100 - 500 employees' },
  { id: 'er-04', name: '500 - 1,000 employees' },
  { id: 'er-05', name: '1,000 - 5,000 employees' },
  { id: 'er-06', name: '> 5,000 employees' },
]

export const REJECTION_REASONS = [
  { id: 'rj-01', name: 'KTP image not clear' },
  { id: 'rj-02', name: 'NPWP missing or invalid' },
  { id: 'rj-03', name: 'Signature does not match KTP' },
  { id: 'rj-04', name: 'Personal data inconsistent with documents' },
  { id: 'rj-05', name: 'Consent form not signed' },
  { id: 'rj-06', name: 'Other (please specify)' },
]

export const PROVINCES = [
  { id: '31', name: 'DKI Jakarta' },
  { id: '32', name: 'Jawa Barat' },
  { id: '33', name: 'Jawa Tengah' },
  { id: '35', name: 'Jawa Timur' },
  { id: '36', name: 'Banten' },
]

export const CITIES = [
  { id: '3171', province_id: '31', name: 'Jakarta Pusat' },
  { id: '3172', province_id: '31', name: 'Jakarta Utara' },
  { id: '3173', province_id: '31', name: 'Jakarta Barat' },
  { id: '3174', province_id: '31', name: 'Jakarta Selatan' },
  { id: '3175', province_id: '31', name: 'Jakarta Timur' },
  { id: '3273', province_id: '32', name: 'Kota Bandung' },
  { id: '3275', province_id: '32', name: 'Kota Bekasi' },
  { id: '3276', province_id: '32', name: 'Kota Depok' },
  { id: '3374', province_id: '33', name: 'Kota Semarang' },
  { id: '3578', province_id: '35', name: 'Kota Surabaya' },
  { id: '3671', province_id: '36', name: 'Kota Tangerang' },
  { id: '3674', province_id: '36', name: 'Kota Tangerang Selatan' },
]

export const DISTRICTS = [
  { id: '317402', city_id: '3174', name: 'Kebayoran Baru' },
  { id: '317403', city_id: '3174', name: 'Kebayoran Lama' },
  { id: '317404', city_id: '3174', name: 'Pancoran' },
  { id: '317405', city_id: '3174', name: 'Setiabudi' },
  { id: '317406', city_id: '3174', name: 'Tebet' },
  { id: '317301', city_id: '3173', name: 'Kebon Jeruk' },
  { id: '327301', city_id: '3273', name: 'Coblong' },
  { id: '327302', city_id: '3273', name: 'Cibeunying Kaler' },
  { id: '357801', city_id: '3578', name: 'Genteng' },
  { id: '357802', city_id: '3578', name: 'Wonokromo' },
]

export const SUBDISTRICTS = [
  { id: '3174021001', district_id: '317402', name: 'Senayan' },
  { id: '3174021002', district_id: '317402', name: 'Gunung' },
  { id: '3174021003', district_id: '317402', name: 'Cipete Utara' },
  { id: '3174051001', district_id: '317405', name: 'Kuningan Timur' },
  { id: '3174051002', district_id: '317405', name: 'Karet Kuningan' },
  { id: '3273011001', district_id: '327301', name: 'Dago' },
]

export const POSTAL_CODES = [
  { id: 'pc-12190', code: '12190', subdistrict_id: '3174021001' },
  { id: 'pc-12180', code: '12180', subdistrict_id: '3174021002' },
  { id: 'pc-12410', code: '12410', subdistrict_id: '3174021003' },
  { id: 'pc-12950', code: '12950', subdistrict_id: '3174051001' },
  { id: 'pc-12940', code: '12940', subdistrict_id: '3174051002' },
  { id: 'pc-40135', code: '40135', subdistrict_id: '3273011001' },
]
