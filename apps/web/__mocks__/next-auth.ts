const nextAuthMock = jest.fn().mockImplementation(options => {
  if (options.debug) {
    console.debug('NextAuth initialization complete')
  }

  return {
    debug: true,
    providers: options.providers,
    adapter: options.adapter,
    session: {
      user: {
        id: 'mockUserId',
        name: 'Mock User',
        email: 'mockuser@example.com',
      },
    },
  }
})

module.exports = nextAuthMock
