const GitHub = jest.fn().mockImplementation(config => ({
  id: 'github',
  name: 'GitHub',
  type: 'oauth',
  ...config,
  clientId: config?.clientId || 'mockClientId',
  clientSecret: config?.clientSecret || 'mockClientSecret',
}))

export default GitHub
