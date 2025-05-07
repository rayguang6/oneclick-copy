// constants/routes.js

export const ROUTES = {
    HOME: '/',
    ADS_LIBRARY: '/ads',
    REEVE_COLLECTION: '/reeve-collection',
    PROJECT: (projectId: string) => `/projects/${projectId}`,
    PROFILE: (id: string) => `/profile/${id}`,
  }
  
  export const NAV_LINKS = [
    { href: ROUTES.HOME, label: 'Home' },
    { href: ROUTES.ADS_LIBRARY, label: 'My Ads' },
    { href: ROUTES.REEVE_COLLECTION, label: "Reeve's Collection" },
]