export const AppRoutes = {
  login: () => "/login",
  signUp: () => "/sign-up",
  userSetup: () => "/user-setup",
  groups: {
    index: () => `/groups`,
    show: (id: string) => `/groups/${id}`,
  },
  turnMode: (groupId: string) => `${AppRoutes.groups.show(groupId)}/turn-mode`,
  profile: () => "/profile",
}
