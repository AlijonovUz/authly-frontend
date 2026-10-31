import { getCachedUser, getMe, isProfileComplete } from '../../api/auth.js'
import { getPublicApplications, returnToSource } from '../../api/sso.js'
import { getSourceSite } from '../../utils/sourceSite.js'

export async function continueAfterLogin() {
  const source = getSourceSite()
  const cachedUser = getCachedUser()

  if (source && cachedUser && isProfileComplete(cachedUser)) {
    await returnToSource(source)
    return
  }

  try {
    const [me] = await Promise.all([
      getMe(),
      getPublicApplications().catch(() => []),
    ])
    if (source && isProfileComplete(me)) {
      await returnToSource(source)
      return
    }
  } catch (err) {
    if (err?.status === 401) {
      window.location.hash = '#/'
      return
    }
    throw err
  }
  window.location.hash = '#/profile'
}
