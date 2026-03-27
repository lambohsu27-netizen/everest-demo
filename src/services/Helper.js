import { myToaster } from '@interstellar-component'
import $ from 'jquery'
import moment from 'moment'
import CryptoJS from 'crypto-js'

export const handleError =
  (func, control, config = {}) =>
  async (data) => {
    if (!func) throw new Error('func is required')
    if (!control) throw new Error('control is required')
    await func(data, config).catch((e) => {
      console.log(e)
      myToaster(e)
      e.errors?.forEach((err, index) => {
        control.setError(err.path, { message: err.msg })
        if (index === 0)
          $(`[name=${err.path}]`)?.get(0)?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      })
    })
  }

export const checkErrorYup = (errors) => {
  if (errors) {
    const error = Object.keys(errors).find((e) => e)
    // if (errors[error]?.message)
    //   myToaster({ status: 500, message: errors[error]?.message })
    if (Array.isArray(errors[error])) {
      const _error = Object.keys(errors[error]).find((e) => e)
      if ($(`#input-${error}-${_error}`).length) {
        $(`#input-${error}-${_error}`).get(0).scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    } else if ($(`#input-${error}`).length) {
      $(`#input-${error}`).get(0).scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }
}

export const appendFormdata = (FormData, data, name) => {
  name = name || ''
  if (typeof data === 'object') {
    $.each(data, (index, value) => {
      if (name === '') {
        appendFormdata(FormData, value, index)
      } else {
        appendFormdata(FormData, value, `${name}[${index}]`)
      }
    })
  } else {
    FormData.append(name, data)
  }
}

// 32 chars

export function encryptPassword(plainPassword) {
  const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_APP_SECRET_KEY)
  const iv = CryptoJS.lib.WordArray.random(16)
  const encrypted = CryptoJS.AES.encrypt(plainPassword, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

export const mimeTypes = {
  '.aac': 'audio/aac',
  '.abw': 'application/x-abiword',
  '.apng': 'image/apng',
  '.arc': 'application/x-freearc',
  '.avif': 'image/avif',
  '.avi': 'video/x-msvideo',
  '.azw': 'application/vnd.amazon.ebook',
  '.bin': 'application/octet-stream',
  '.bmp': 'image/bmp',
  '.bz': 'application/x-bzip',
  '.bz2': 'application/x-bzip2',
  '.cda': 'application/x-cdf',
  '.csh': 'application/x-csh',
  '.css': 'text/css',
  '.csv': 'text/csv',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.eot': 'application/vnd.ms-fontobject',
  '.epub': 'application/epub+zip',
  '.gz': 'application/gzip',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.ico': 'image/vnd.microsoft.icon',
  '.ics': 'text/calendar',
  '.jar': 'application/java-archive',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.jsonld': 'application/ld+json',
  '.midi': 'audio/midi',
  '.mjs': 'text/javascript',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.mpeg': 'video/mpeg',
  '.mpkg': 'application/vnd.apple.installer+xml',
  '.odp': 'application/vnd.oasis.opendocument.presentation',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.oga': 'audio/ogg',
  '.ogv': 'video/ogg',
  '.ogx': 'application/ogg',
  '.opus': 'audio/opus',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.php': 'application/x-httpd-php',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.rar': 'application/vnd.rar',
  '.rtf': 'application/rtf',
  '.sh': 'application/x-sh',
  '.svg': 'image/svg+xml',
  '.tar': 'application/x-tar',
  '.tiff': 'image/tiff',
  '.ts': 'video/mp2t',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.vsd': 'application/vnd.visio',
  '.wav': 'audio/wav',
  '.weba': 'audio/webm',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xhtml': 'application/xhtml+xml',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xml': 'application/xml',
  '.xul': 'application/vnd.mozilla.xul+xml',
  '.zip': 'application/zip',
  '.3gp': 'video/3gpp; audio/3gpp',
  '.3g2': 'video/3gpp2; audio/3gpp2',
  '.7z': 'application/x-7z-compressed',
}

export const Access = {
  DASHBOARD: 'dashboard',
  ENQUIRY: 'application_enquiry',
  WORKFORCE: 'workforce',
  COMPANY: 'company',
  AUDIT_TRAIL: 'audit_trail',
  EMPLOYEE_LEVEL: 'employee_level',
  USER_MANAGEMENT: 'user_management',
  ROLE_ACCESS: 'role_access',
  CONSENT_EDITOR: 'consent_editor',
  GENERAL_SETTINGS: 'general_settings',
}

export const constantBranch = {
  SEMUA_CABANG: '2223f257-b2bd-42fc-a5aa-3577cc724f67',
}

export const convertToMimeDict = (fileExtensions) => {
  const resultDict = {}

  fileExtensions.forEach((ext) => {
    const mimeType = mimeTypes[ext]
    if (mimeType) {
      if (!resultDict[mimeType]) {
        resultDict[mimeType] = [ext]
      } else {
        resultDict[mimeType].push(ext)
      }
    }
  })

  return resultDict
}

export const formatFileExtensions = (fileExtensions) => {
  let text = fileExtensions.map((ext) => ext.replace('.', '').toUpperCase()).join(', ')
  text = text.replace(/,(?=[^,]*$)/, ' or ')

  return text
}

export const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${Math.round(100 * (bytes / 1024 ** i)) / 100} ${sizes[i]}`
}

export const formatDate = (date) => moment(date).format('DD MMM YYYY')

// Helper function to format a value as Indonesian Rupiah.
export const formatToCurrencyIDR = (val) => {
  if (!val) return ''
  // Remove any non-digit characters
  const numericValue = val.toString().replace(/\D/g, '')
  if (!numericValue) return ''
  // Add the "Rp" prefix and thousand separator using dot every 3 digits
  return 'Rp' + numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

var _st = function (z, g) {
  return '' + (g != '' ? '[' : '') + z + (g != '' ? ']' : '')
}

var isObj = function (a) {
  if (!!a && a.constructor === Object) {
    return true
  }
  return false
}

export function fromObject(params, skipobjects, prefix) {
  if (skipobjects === void 0) {
    skipobjects = false
  }
  if (prefix === void 0) {
    prefix = ''
  }
  var result = ''
  if (typeof params != 'object' || params === null) {
    // Added null check
    // If prefix is empty, it means this is a standalone value not part of an object/array structure
    // which is not typical for query string generation from an object, but handle defensively.
    // However, for filter items, this branch shouldn't be hit directly with params.filter
    return prefix
      ? prefix + '=' + encodeURIComponent(params) + '&'
      : encodeURIComponent(params) + '&'
  }

  for (var param in params) {
    // eslint-disable-next-line no-prototype-builtins
    if (params.hasOwnProperty(param)) {
      // Good practice
      var c = ''
      if (Array.isArray(params)) {
        // If the current 'params' is an array
        c = prefix + '[' + param + ']' // param here is the index
      } else {
        // If the current 'params' is an object
        c = prefix + _st(param, prefix)
      }

      if (isObj(params[param]) && !skipobjects) {
        result += fromObject(params[param], false, c)
      } else if (Array.isArray(params[param]) && !skipobjects) {
        // This recursive call handles nested arrays.
        // The prefix 'c' will be like 'filter[0][someArrayKey]'
        // and then it will generate 'filter[0][someArrayKey][0]', 'filter[0][someArrayKey][1]'
        result += fromObject(params[param], false, c)
      } else {
        result += c + '=' + encodeURIComponent(params[param] ?? '') + '&' // Added ?? '' for null/undefined
      }
    }
  }
  return result
}
