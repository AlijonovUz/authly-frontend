import { useMemo, useState } from 'react'
import {
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  GlobeIcon,
  InfoIcon,
  ServerIcon,
  ShieldAlertIcon,
} from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'
import { highlightCode } from './codeHighlighter.js'

export default function IntegrationGuideCard({ app, onCopy, onToast }) {
  const { t } = useI18n()
  const [platform, setPlatform] = useState('frontend') // 'frontend' | 'backend'
  const [tech, setTech] = useState('react') // frontend: 'react' | 'nextjs' | 'vue' | 'button' | 'env'
  // backend: 'python' | 'node' | 'laravel' | 'curl' | 'webhook'

  const clientId = app?.client_id || 'CLIENT_ID'
  const rawUris = app?.redirect_uris ? app.redirect_uris.split(/\s+/).filter(Boolean) : []
  const firstUri = rawUris[0] || 'https://saytingiz.uz/auth/callback'
  const webhookSecret = app?.webhook_info?.secret || 'whsec_sample_secret'

  // Faylni yuklab olish
  const handleDownloadDoc = (type) => {
    const fileName =
      type === 'frontend'
        ? 'Authly_Frontend_Integration_Guide.docx'
        : 'Authly_Backend_Integration_Guide.docx'
    const link = document.createElement('a')
    link.href = `/docs/${fileName}`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    onToast?.({
      type: 'success',
      title: t('dev.docDownloading'),
      message: `${fileName} ${t('dev.docDownloaded')}`,
    })
  }

  // Snippets
  const getFrontendSnippet = () => {
    switch (tech) {
      case 'react':
        return `// src/pages/AuthlyCallback.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export const AuthlyCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const requestSentRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage("Avtorizatsiya bekor qilindi yoki xatolik yuz berdi.");
      return;
    }
    if (!code) {
      setErrorMessage("Avtorizatsiya kodi (code) topilmadi.");
      return;
    }

    // Kod bir martalik bo'lgani uchun faqat 1 marta yuboramiz
    if (requestSentRef.current) return;
    requestSentRef.current = true;

    axios
      .post(\`\${process.env.REACT_APP_BACKEND_API_URL}/api/v1/auth/authly/callback/\`, {
        code: code,
      })
      .then((response) => {
        const { access_token, user } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user_profile", JSON.stringify(user));
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        const msg = err.response?.data?.detail || "Kirish jarayonida xatolik yuz berdi.";
        setErrorMessage(msg);
      });
  }, [searchParams, navigate]);

  if (errorMessage) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2 style={{ color: "#DC2626" }}>Xatolik yuz berdi</h2>
        <p style={{ color: "#4B5563", margin: "16px 0" }}>{errorMessage}</p>
        <button
          onClick={() => navigate("/login")}
          style={{ padding: "10px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Login sahifasiga qaytish
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ margin: "0 auto 20px", width: "40px", height: "40px", border: "4px solid #E5E7EB", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <h3 style={{ color: "#1F2937" }}>Authly orqali tizimga kirilmoqda...</h3>
      <p style={{ color: "#6B7280" }}>Iltimos, kuting...</p>
    </div>
  );
};`

      case 'nextjs':
        return `// app/auth/callback/page.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthlyCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const hasRequested = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (error) {
      setErrorMsg("Kirish rad etildi yoki bekor qilindi.");
      return;
    }
    if (!code) {
      setErrorMsg("Avtorizatsiya kodi mavjud emas.");
      return;
    }
    if (hasRequested.current) return;
    hasRequested.current = true;

    async function sendCode() {
      try {
        const res = await fetch(\`\${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth/authly/callback/\`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || "Avtorizatsiya amalga oshmadi.");
        }
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard");
      } catch (err: any) {
        setErrorMsg(err.message);
      }
    }
    sendCode();
  }, [searchParams, router]);

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Avtorizatsiya xatosi</h2>
        <p className="mt-2 text-slate-600">{errorMsg}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login sahifasiga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="mt-4 text-slate-700 font-medium">Authly bilan tasdiqlanmoqda...</p>
    </div>
  );
}`

      case 'vue':
        return `<!-- src/views/AuthlyCallback.vue -->
<template>
  <div class="callback-container">
    <div v-if="error" class="error-box">
      <h2>Xatolik</h2>
      <p>{{ error }}</p>
      <button @click="goToLogin">Qayta urinish</button>
    </div>
    <div v-else class="loading-box">
      <div class="spinner"></div>
      <p>Authly orqali kirilmoqda...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const error = ref(null);

onMounted(async () => {
  const code = route.query.code;
  const errorParam = route.query.error;
  if (errorParam) {
    error.value = "Kirish bekor qilindi.";
    return;
  }
  if (!code) {
    error.value = "Avtorizatsiya kodi topilmadi.";
    return;
  }
  try {
    const res = await axios.post("/api/v1/auth/authly/callback/", { code });
    localStorage.setItem("token", res.data.access_token);
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.detail || "Tizimga kirishda xatolik yuz berdi.";
  }
});

const goToLogin = () => router.push("/login");
</script>`

      case 'button':
        return `<!-- Authly SSO Rasmiy Kirish Tugmasi -->
<button class="authly-login-btn" onclick="handleAuthlyLogin()">
  <svg class="authly-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
  <span>Authly orqali kirish</span>
</button>

<script>
function handleAuthlyLogin() {
  const url = new URL("https://authly.uz/login");
  url.searchParams.set("client_id", "${clientId}");
  url.searchParams.set("redirect_uri", "${firstUri}");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "read");
  window.location.href = url.toString();
}
</script>

<style>
.authly-login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 320px;
  padding: 12px 20px;
  background-color: #2563EB;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.authly-login-btn:hover {
  background-color: #1D4ED8;
}
.authly-login-btn:active {
  transform: scale(0.98);
}
.authly-icon {
  width: 20px;
  height: 20px;
}
</style>`

      case 'env':
        return `# Frontend (.env) — Vite / React
VITE_AUTHLY_FRONTEND_URL=https://authly.uz
VITE_AUTHLY_CLIENT_ID=${clientId}
VITE_AUTHLY_REDIRECT_URI=${firstUri}
VITE_BACKEND_API_URL=https://api.saytingiz.uz

# Next.js uchun (.env.local)
NEXT_PUBLIC_AUTHLY_FRONTEND_URL=https://authly.uz
NEXT_PUBLIC_AUTHLY_CLIENT_ID=${clientId}
NEXT_PUBLIC_AUTHLY_REDIRECT_URI=${firstUri}
NEXT_PUBLIC_BACKEND_API_URL=https://api.saytingiz.uz`

      default:
        return ''
    }
  }

  const getBackendSnippet = () => {
    switch (tech) {
      case 'python':
        return `# services/authly.py
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class AuthlySSOService:
    @staticmethod
    def get_login_url(state: str = "") -> str:
        base_url = f"{settings.AUTHLY_FRONTEND_URL}/login"
        params = {
            "client_id": "${clientId}",
            "redirect_uri": "${firstUri}",
            "response_type": "code",
            "scope": "read",
        }
        if state:
            params["state"] = state
        req = requests.Request("GET", base_url, params=params).prepare()
        return req.url

    @staticmethod
    def exchange_code_for_token(code: str) -> dict:
        url = f"{settings.AUTHLY_BACKEND_URL}/oauth/token/"
        data = {
            "grant_type": "authorization_code",
            "client_id": "${clientId}",
            "client_secret": settings.AUTHLY_CLIENT_SECRET,
            "code": code,
            "redirect_uri": "${firstUri}",
        }
        resp = requests.post(url, data=data, timeout=10)
        if resp.status_code != 200:
            raise AuthenticationFailed("Authly token olishda xatolik yuz berdi.")
        return resp.json()

    @staticmethod
    def get_user_profile(access_token: str) -> dict:
        url = f"{settings.AUTHLY_BACKEND_URL}/api/v1/sso/profile/"
        headers = {"Authorization": f"Bearer {access_token}"}
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code != 200:
            raise AuthenticationFailed("Authly profil ma'lumotlarini olib bo'lmadi.")
        return resp.json()["data"]

    @classmethod
    def authenticate_or_register(cls, code: str):
        token_data = cls.exchange_code_for_token(code)
        profile = cls.get_user_profile(token_data["access_token"])
        
        user, _ = User.objects.update_or_create(
            authly_id=profile["authly_id"],
            defaults={
                "first_name": profile.get("first_name", ""),
                "last_name": profile.get("last_name", ""),
                "phone_number": profile.get("phone", ""),
                "avatar_url": profile.get("avatar") or "",
            }
        )
        return user`

      case 'node':
        return `// services/authly.service.ts
import axios from "axios";

export class AuthlySSOService {
  static getLoginUrl(state: string = ""): string {
    const params = new URLSearchParams({
      client_id: "${clientId}",
      redirect_uri: "${firstUri}",
      response_type: "code",
      scope: "read",
      ...(state && { state }),
    });
    return \`https://authly.uz/login?\${params.toString()}\`;
  }

  static async handleCallback(code: string) {
    // 1. Kodni tokenga almashtirish
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: "${clientId}",
      client_secret: process.env.AUTHLY_CLIENT_SECRET!,
      code: code,
      redirect_uri: "${firstUri}",
    });

    const tokenRes = await axios.post(
      "https://api.authly.uz/oauth/token/",
      tokenParams.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const { access_token } = tokenRes.data;

    // 2. Profil ma'lumotlarini yuklab olish
    const profileRes = await axios.get(
      "https://api.authly.uz/api/v1/sso/profile/",
      { headers: { Authorization: \`Bearer \${access_token}\` } }
    );
    return profileRes.data.data;
  }
}`

      case 'laravel':
        return `<?php
namespace App\\Services;

use Illuminate\\Support\\Facades\\Http;
use Exception;

class AuthlySSOService
{
    public function getLoginUrl(?string $state = null): string
    {
        $params = http_build_query([
            'client_id'     => '${clientId}',
            'redirect_uri'  => '${firstUri}',
            'response_type' => 'code',
            'scope'         => 'read',
            'state'         => $state,
        ]);
        return 'https://authly.uz/login?' . $params;
    }

    public function handleCallback(string $code): array
    {
        // 1. Kodni tokenga almashtirish
        $tokenResponse = Http::asForm()->post('https://api.authly.uz/oauth/token/', [
            'grant_type'    => 'authorization_code',
            'client_id'     => '${clientId}',
            'client_secret' => config('services.authly.client_secret'),
            'code'          => $code,
            'redirect_uri'  => '${firstUri}',
        ]);

        if (!$tokenResponse->successful()) {
            throw new Exception("Authly avtorizatsiyadan o'tib bo'lmadi.");
        }

        $accessToken = $tokenResponse->json('access_token');

        // 2. Profil ma'lumotlarini yuklab olish
        $profileResponse = Http::withToken($accessToken)
            ->get('https://api.authly.uz/api/v1/sso/profile/');

        if (!$profileResponse->successful()) {
            throw new Exception("Authly profilini olishda xatolik.");
        }

        return $profileResponse->json('data');
    }
}`

      case 'curl':
        return `# 1. Kodni tokenga almashtirish (POST /oauth/token/)
curl -X POST "https://api.authly.uz/oauth/token/" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code" \\
  -d "client_id=${clientId}" \\
  -d "client_secret=SIZNING_CLIENT_SECRET" \\
  -d "code=CALLBACK_CODE_SHU_YERDA" \\
  -d "redirect_uri=${firstUri}"

# 2. Profil ma'lumotlarini olish (GET /api/v1/sso/profile/)
curl -X GET "https://api.authly.uz/api/v1/sso/profile/" \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Accept: application/json"`

      case 'webhook':
        return `# Webhook imzosini tekshirish (Python namunasi)
import hmac
import hashlib

def verify_authly_signature(raw_body: bytes, signature_header: str, secret: str = "${webhookSecret}") -> bool:
    """
    X-SSO-Signature sarlavhasi (HMAC-SHA256) orqali tekshirish
    """
    if not signature_header or not signature_header.startswith("sha256="):
        return False
        
    expected_sig = signature_header.split("sha256=", 1)[1]
    calculated_sig = hmac.new(
        secret.encode("utf-8"),
        msg=raw_body,
        digestmod=hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(calculated_sig, expected_sig)`

      default:
        return ''
    }
  }

  const activeSnippet = platform === 'frontend' ? getFrontendSnippet() : getBackendSnippet()

  const highlightedHtml = useMemo(() => {
    let lang = 'javascript'
    if (tech === 'python' || tech === 'webhook') lang = 'python'
    else if (tech === 'laravel') lang = 'php'
    else if (tech === 'curl') lang = 'shell'
    else if (tech === 'env') lang = 'env'
    return highlightCode(activeSnippet, lang)
  }, [activeSnippet, tech])

  return (
    <div className="dev-card dev-guide-card">
      {/* Header with Title and Download Buttons */}
      <div className="dev-card__header dev-guide-header">
        <div className="dev-card__header-titles">
          <h3 className="dev-card__title">
            <CodeIcon width="17" height="17" />
            {t('dev.guideTitle')}
          </h3>
          <p className="dev-hint">{t('dev.guideSubtitle')}</p>
        </div>

        {/* Word (.docx) yuklab olish tugmalari */}
        <div className="dev-guide-docs-actions">
          <button
            type="button"
            className="dev-btn-secondary dev-btn-sm"
            onClick={() => handleDownloadDoc('frontend')}
            title="Frontend (.docx)"
          >
            <DownloadIcon width="14" height="14" />
            <span>{t('dev.downloadFrontendDoc')}</span>
          </button>
          <button
            type="button"
            className="dev-btn-secondary dev-btn-sm"
            onClick={() => handleDownloadDoc('backend')}
            title="Backend (.docx)"
          >
            <DownloadIcon width="14" height="14" />
            <span>{t('dev.downloadBackendDoc')}</span>
          </button>
        </div>
      </div>

      {/* 1-darajali Tab: Platform Selector (Frontend vs Backend) */}
      <div className="dev-guide-platform-tabs">
        <button
          type="button"
          className={`dev-guide-platform-tab ${platform === 'frontend' ? 'is-active dev-guide-platform-tab--frontend' : ''}`}
          onClick={() => {
            setPlatform('frontend')
            setTech('react')
          }}
        >
          <GlobeIcon width="15" height="15" />
          <span>{t('dev.frontendClient')}</span>
        </button>
        <button
          type="button"
          className={`dev-guide-platform-tab ${platform === 'backend' ? 'is-active dev-guide-platform-tab--backend' : ''}`}
          onClick={() => {
            setPlatform('backend')
            setTech('python')
          }}
        >
          <ServerIcon width="15" height="15" />
          <span>{t('dev.backendServer')}</span>
        </button>
      </div>

      {/* 2-darajali Tab: Texnologiya tanlash (Har biri o'ziga xos brend rangida) */}
      <div className="dev-guide-tech-tabs">
        {platform === 'frontend' ? (
          <>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--react ${tech === 'react' ? 'is-active' : ''}`}
              onClick={() => setTech('react')}
            >
              React.js
            </button>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--nextjs ${tech === 'nextjs' ? 'is-active' : ''}`}
              onClick={() => setTech('nextjs')}
            >
              Next.js 14+
            </button>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--vue ${tech === 'vue' ? 'is-active' : ''}`}
              onClick={() => setTech('vue')}
            >
              Vue 3
            </button>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--button ${tech === 'button' ? 'is-active' : ''}`}
              onClick={() => setTech('button')}
            >
              {t('dev.loginButton')}
            </button>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--env ${tech === 'env' ? 'is-active' : ''}`}
              onClick={() => setTech('env')}
            >
              {t('dev.envParams')}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--python ${tech === 'python' ? 'is-active' : ''}`}
              onClick={() => setTech('python')}
            >
              Python (Django)
            </button>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--node ${tech === 'node' ? 'is-active' : ''}`}
              onClick={() => setTech('node')}
            >
              Node.js (Express)
            </button>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--laravel ${tech === 'laravel' ? 'is-active' : ''}`}
              onClick={() => setTech('laravel')}
            >
              PHP (Laravel)
            </button>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--curl ${tech === 'curl' ? 'is-active' : ''}`}
              onClick={() => setTech('curl')}
            >
              cURL & REST API
            </button>
            <button
              type="button"
              className={`dev-guide-tech-btn dev-guide-tech-btn--webhook ${tech === 'webhook' ? 'is-active' : ''}`}
              onClick={() => setTech('webhook')}
            >
              Webhook HMAC
            </button>
          </>
        )}
      </div>

      {/* Xavfsizlik eslatmasi */}
      {platform === 'frontend' ? (
        <div className="dev-guide-alert dev-guide-alert--warning">
          <ShieldAlertIcon width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>{t('dev.securityRule')}</strong> {t('dev.securityRuleText')}
          </div>
        </div>
      ) : (
        <div className="dev-guide-alert dev-guide-alert--info">
          <InfoIcon width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>{t('dev.serverReq')}</strong> {t('dev.serverReqText')}
          </div>
        </div>
      )}

      {/* Kod Bloki (VS Code Syntax Highlighting bilan) */}
      <div className={`dev-code-block dev-code-block--${tech}`}>
        <div className="dev-code-block__header">
          <span className={`dev-code-block__lang dev-code-block__lang--${tech}`}>
            {platform === 'frontend'
              ? tech === 'react' || tech === 'nextjs'
                ? 'TypeScript / React'
                : tech === 'vue'
                  ? 'Vue 3'
                  : tech === 'button'
                    ? 'HTML & CSS'
                    : 'ENV'
              : tech === 'python'
                ? 'Python'
                : tech === 'node'
                  ? 'TypeScript / Node'
                  : tech === 'laravel'
                    ? 'PHP'
                    : tech === 'curl'
                      ? 'cURL / Bash'
                      : 'HMAC-SHA256 Python'}
          </span>
          <button
            type="button"
            className="dev-copy-btn"
            style={{ color: '#cdd6f4' }}
            onClick={() => onCopy(activeSnippet, t('dev.copy'))}
            title={t('dev.copy')}
          >
            <CopyIcon width="14" height="14" />
            <span style={{ fontSize: '11px', marginLeft: '4px' }}>{t('dev.copy')}</span>
          </button>
        </div>
        <pre dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </div>
    </div>
  )
}
