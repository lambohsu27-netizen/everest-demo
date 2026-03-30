#!/usr/bin/env bash
# Curl examples for backoffice-service — copy individual blocks into Postman.
# Defaults match k8s ingress (everest-api.merpati.io/backoffice).
# For local testing override BASE_URL:
#   export BASE_URL=http://localhost:3000

BASE_URL="${BASE_URL:-https://everest-api.merpati.io}"
HOMEPAGE="${HOMEPAGE:-backoffice}"
API="${BASE_URL}/${HOMEPAGE}/v1"

# ──────────────────────────────────────────────────────────────────────────────
# PASSWORD ENCRYPTION (AES-256-CBC)
# ──────────────────────────────────────────────────────────────────────────────
# The "password" field in /auth/register and /auth/login must be encrypted
# by the frontend before sending. Format: "{iv_base64}:{ciphertext_base64}"
#
# Frontend (CryptoJS):
#   const key = CryptoJS.enc.Utf8.parse(DECRYPT_CRYPTO)  // 32-char key
#   const iv  = CryptoJS.lib.WordArray.random(16)
#   const enc = CryptoJS.AES.encrypt(rawPassword, key, { iv, mode: CryptoJS.mode.CBC })
#   const payload = iv.toString(CryptoJS.enc.Base64) + ":" + enc.ciphertext.toString(CryptoJS.enc.Base64)
#
# To generate a test-encrypted password from the terminal (Node.js):
# node -e "
#   const crypto = require('crypto')
#   const key = Buffer.from('aaaaa', 'utf8')
#   const iv  = crypto.randomBytes(16)
#   const c   = crypto.createCipheriv('aes-256-cbc', key, iv)
#   const enc = Buffer.concat([c.update('Everest@2026!', 'utf8'), c.final()])
#   console.log(iv.toString('base64') + ':' + enc.toString('base64'))
# "
#

# ──────────────────────────────────────────────────────────────────────────────
# HEALTH
# ──────────────────────────────────────────────────────────────────────────────

# GET /health
curl -sS "${BASE_URL}/health" | python3 -m json.tool


# ──────────────────────────────────────────────────────────────────────────────
# REGISTER FLOW
# ──────────────────────────────────────────────────────────────────────────────

# 1. Register — returns user_id, sends OTP email
curl -sS -X POST "${API}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Secret1!"
  }' | python3 -m json.tool

# 2. Verify OTP — submit the 4-digit code from the email
#    Replace user_id and code with real values
curl -sS -X POST "${API}/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "00000000-0000-0000-0000-000000000000",
    "code": "1234"
  }' | python3 -m json.tool

# 3. Resend OTP — triggers 30s cooldown per request
curl -sS -X POST "${API}/auth/resend-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "00000000-0000-0000-0000-000000000000"
  }' | python3 -m json.tool

# 4. Magic link — paste the full URL from the verification email
curl -sS "${API}/auth/verify-email?token=REPLACE_WITH_JWT_FROM_EMAIL" | python3 -m json.tool


# ──────────────────────────────────────────────────────────────────────────────
# LOGIN FLOW
# ──────────────────────────────────────────────────────────────────────────────

# 5. Login — returns access_token (15 min) + refresh_token (7 days)
curl -sS -X POST "${API}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Secret1!"
  }' | python3 -m json.tool

# 6. Login with remember_me — refresh_token valid for 30 days instead of 7
curl -sS -X POST "${API}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Secret1!",
    "remember_me": true
  }' | python3 -m json.tool

# 7. Refresh — exchange refresh_token for a new access + refresh token pair
#    (old refresh_token is revoked immediately — rotation)
curl -sS -X POST "${API}/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "REPLACE_WITH_REFRESH_TOKEN"
  }' | python3 -m json.tool

# 8. Logout — revokes the refresh_token so it can no longer be used
curl -sS -X POST "${API}/auth/logout" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "REPLACE_WITH_REFRESH_TOKEN"
  }' | python3 -m json.tool

# 9. Session — get current user profile + permissions (for FE menu visibility)
TOKEN="REPLACE_WITH_ACCESS_TOKEN"
curl -sS "${API}/auth/session" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool


# ──────────────────────────────────────────────────────────────────────────────
# FORGOT / RESET PASSWORD FLOW
# ──────────────────────────────────────────────────────────────────────────────

# 10. Forgot password — OTP flow; 409 if a code is already valid; generic 200 if email not registered
curl -sS -X POST "${API}/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}' | python3 -m json.tool

# 11. Resend forgot password — new OTP after 1-minute cooldown (429 + retry_after if too soon)
curl -sS -X POST "${API}/auth/forgot-password/resend" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}' | python3 -m json.tool

# 12. Reset password — token from reset email link, password AES-256-CBC encrypted
#     Generate encrypted password with:
#       node -e "
#         const crypto = require('crypto')
#         const key = Buffer.from('aaaa', 'utf8')
#         const iv  = crypto.randomBytes(16)
#         const c   = crypto.createCipheriv('aes-256-cbc', key, iv)
#         const enc = Buffer.concat([c.update('NewSecret1!', 'utf8'), c.final()])
#         console.log(iv.toString('base64') + ':' + enc.toString('base64'))
#       "
curl -sS -X POST "${API}/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "REPLACE_WITH_RAW_TOKEN_FROM_EMAIL_LINK",
    "password": "REPLACE_WITH_AES_ENCRYPTED_NEW_PASSWORD"
  }' | python3 -m json.tool


# ──────────────────────────────────────────────────────────────────────────────
# SETTINGS (requires auth + general_settings.edit permission)
# ──────────────────────────────────────────────────────────────────────────────


# 13. Get general settings
curl -sS "${API}/settings/general" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

# 14. Update general settings
curl -sS -X PUT "${API}/settings/general" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "session_timeout": 30,
    "verification_threshold": 65
  }' | python3 -m json.tool


# ──────────────────────────────────────────────────────────────────────────────
# SETTINGS / USERS (under /v1/settings/users — requires auth; POST needs user_management.add_new)
# ──────────────────────────────────────────────────────────────────────────────

# 15. List users — paginated, with search and status filter
curl -sS "${API}/settings/users?page=1&limit=10" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

# 16. List users — search by name or email, filter by status
curl -sS "${API}/settings/users?search=admin&status=active" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

# 17. Get user detail (includes PIC info + audit trail)
curl -sS "${API}/settings/users/REPLACE_WITH_USER_UUID" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

# 18. Generate a random secure password (12 chars)
curl -sS "${API}/settings/users/generate-password" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

# 19. Create user (multipart form with optional avatar upload)
#     password must be AES-256-CBC encrypted (see encryption section above)
curl -sS -X POST "${API}/settings/users" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "name=Jane Doe" \
  -F "email=jane@example.com" \
  -F "phone=+6281234567890" \
  -F "password=REPLACE_WITH_AES_ENCRYPTED_PASSWORD" \
  -F "role_id=REPLACE_WITH_ROLE_UUID" \
  -F 'company_ids=["REPLACE_WITH_COMPANY_UUID"]' \
  -F "is_active=true" \
  -F "avatar=@/path/to/photo.jpg" | python3 -m json.tool


# ──────────────────────────────────────────────────────────────────────────────
# PERMISSIONS (requires auth)
# ──────────────────────────────────────────────────────────────────────────────

# 20. Get all permission modules with sub-permissions (for Access menu UI)
curl -sS "${API}/permissions" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool


# ──────────────────────────────────────────────────────────────────────────────
# SETTINGS / ROLES (under /v1/settings/roles — auth; POST/DELETE need role_access.*)
# ──────────────────────────────────────────────────────────────────────────────

# 21. List roles — paginated with search
curl -sS "${API}/settings/roles?page=1&limit=10&search=" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

# 22. Create role with permissions
#     permissions = array of { module_key, sub_permissions: [key, ...] }
curl -sS -X POST "${API}/settings/roles" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Area Manager",
    "permissions": [
      { "module_key": "dashboard", "sub_permissions": ["view"] },
      { "module_key": "workforce", "sub_permissions": ["add_new", "edit"] },
      { "module_key": "company", "sub_permissions": ["view", "edit"] }
    ]
  }' | python3 -m json.tool

# 23. Get role detail (permissions grouped by module + audit trail)
curl -sS "${API}/settings/roles/REPLACE_WITH_ROLE_UUID" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

# 24. Update role — full replace of name + permissions
#     permissions = array of { module_key, sub_permissions: [key, ...] }
curl -sS -X PUT "${API}/settings/roles/REPLACE_WITH_ROLE_UUID" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Area Manager",
    "permissions": [
      { "module_key": "dashboard", "sub_permissions": ["view"] },
      { "module_key": "workforce", "sub_permissions": ["add_new", "edit"] },
      { "module_key": "user_management", "sub_permissions": ["add_new", "edit", "delete"] }
    ]
  }' | python3 -m json.tool

# 25. Bulk delete roles (blocked if any role is assigned to active users)
curl -sS -X DELETE "${API}/settings/roles" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["REPLACE_WITH_ROLE_UUID_1", "REPLACE_WITH_ROLE_UUID_2"]
  }' | python3 -m json.tool
