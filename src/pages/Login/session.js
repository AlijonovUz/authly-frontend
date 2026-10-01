import { getMe, isProfileComplete } from '../../api/auth.js'
import { returnToSource } from '../../api/sso.js'
import { getSourceSite } from '../../utils/sourceSite.js'

// Kirish muvaffaqiyatli bo'lgach: profil to'liq va kelgan sayt ma'lum bo'lsa — o'sha saytga qaytamiz,
// aks holda profilni to'ldirish sahifasiga o'tamiz.
export async function continueAfterLogin() {
  try {
    const me = await getMe()
    const source = getSourceSite()
    if (isProfileComplete(me) && source) {
      await returnToSource(source)
      return
    }
  } catch {
    // Profilni ololmasak ham, to'ldirish sahifasida qaytadan urinib ko'riladi
  }
  window.location.hash = '#/profile'
}
