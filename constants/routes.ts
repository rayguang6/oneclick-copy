// constants/routes.js

export const ROUTES = {
    HOME: '/',
    ADS_LIBRARY: '/ads',
    REEVE_COLLECTION: '/reeve-collection',
    PROFILE: (id: string) => `/profile/${id}`,
    PROJECT: (projectId: string) => `/projects/${projectId}`,
    TOOL: (projectId: string, toolSlug: string) => `/projects/${projectId}/tools/${toolSlug}`,
    CONVERSATION: (projectId: string, toolSlug: string, conversationId: string) => `/projects/${projectId}/tools/${toolSlug}/conversations/${conversationId}`,
}

export const NAV_LINKS = [
    { href: ROUTES.HOME, label: 'Projects' },
    { href: ROUTES.ADS_LIBRARY, label: 'My Ads' },
    { href: ROUTES.REEVE_COLLECTION, label: "Reeve's Collection" },
]