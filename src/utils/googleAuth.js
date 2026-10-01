// Google orqali kirish — Google Identity Services (GIS). Natijada id_token (credential) olinadi
// va backend'ga (/auth/google/login/) yuboriladi.
//
// Dizayndagi o'zimizning tugma ko'rinib turadi, uning ustiga Google'ning haqiqiy tugmasi
// shaffof qilib joylanadi (GIS oynani faqat o'z tugmasidan ochishga ruxsat beradi).
//
// Google Cloud Console → OAuth client → "Authorized JavaScript origins" ga qo'shilishi kerak:
//   https://passport.raqamlinazorat.uz   va   http://localhost:5173

const CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '39718534758-otk8par32b12bg9t168k1ea9u57aleu4.apps.googleusercontent.com'

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

// Google tugmasining eng katta kengligi va "large" o'lchamdagi balandligi
export const GOOGLE_BUTTON_WIDTH = 400
export const GOOGLE_BUTTON_HEIGHT = 40

let loading = null
let listener = null

function loadGis() {
  loading ??= new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve(window.google.accounts.id)
      return
    }
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () =>
      window.google?.accounts?.id ? resolve(window.google.accounts.id) : reject(new Error('GIS yo‘q'))
    script.onerror = () => reject(new Error('Google skripti yuklanmadi'))
    document.head.appendChild(script)
  })
    .then((gis) => {
      gis.initialize({
        client_id: CLIENT_ID,
        callback: ({ credential }) => listener?.(credential),
        // Google'ning to'liq "Choose an account" oynasi (popup). FedCM yoqilsa Chrome uning
        // o'rniga o'zining kichik dialogini ko'rsatadi
        ux_mode: 'popup',
        auto_select: false,
        use_fedcm_for_button: false,
      })
      return gis
    })
    .catch((err) => {
      // Keyingi urinishda qaytadan yuklanadi
      loading = null
      throw err
    })
  return loading
}

// container ichiga Google tugmasini chizadi. onCredential(idToken) — akkaunt tanlangach chaqiriladi.
// Qaytaradi: tozalash funksiyasi.
export async function renderGoogleButton(container, { locale, onCredential }) {
  const gis = await loadGis()
  listener = onCredential
  container.replaceChildren()
  gis.renderButton(container, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    shape: 'rectangular',
    text: 'continue_with',
    width: GOOGLE_BUTTON_WIDTH,
    locale,
  })
  // Keyinroq chizilgan tugmaga tegmaymiz (StrictMode'da effekt ikki marta ishlaydi)
  const rendered = container.firstElementChild
  return () => {
    if (listener === onCredential) listener = null
    if (container.firstElementChild === rendered) container.replaceChildren()
  }
}
