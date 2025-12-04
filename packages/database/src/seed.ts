import { prisma } from './client';

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      emailVerified: new Date(),
      image: 'https://example.com/john.jpg',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      emailVerified: new Date(),
      image: 'https://example.com/jane.jpg',
    },
  });

  // Create Accounts for the Users
  const account1 = await prisma.account.create({
    data: {
      userId: user1.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: 'google_account_123',
      refresh_token: 'refresh_token_value_1',
      access_token: 'access_token_value_1',
      expires_at: 1622512800, // Example UNIX timestamp
      token_type: 'Bearer',
      scope: 'profile email',
      id_token: 'id_token_value_1',
      session_state: 'active',
    },
  });

  const account2 = await prisma.account.create({
    data: {
      userId: user2.id,
      type: 'oauth',
      provider: 'github',
      providerAccountId: 'github_account_456',
      refresh_token: 'refresh_token_value_2',
      access_token: 'access_token_value_2',
      expires_at: 1622512800,
      token_type: 'Bearer',
      scope: 'repo user',
      id_token: 'id_token_value_2',
      session_state: 'active',
    },
  });

  // Create Sessions for the Users
  const session1 = await prisma.session.create({
    data: {
      sessionToken: 'session_token_123',
      userId: user1.id,
      expires: new Date(Date.now() + 3600000), // 1 hour from now
    },
  });

  const session2 = await prisma.session.create({
    data: {
      sessionToken: 'session_token_456',
      userId: user2.id,
      expires: new Date(Date.now() + 3600000), // 1 hour from now
    },
  });

  // Create Verification Tokens (Usually for email verification)
  const verificationToken1 = await prisma.verificationToken.create({
    data: {
      identifier: user1.email!,
      token: 'verification_token_123',
      expires: new Date(Date.now() + 3600000), // 1 hour from now
    },
  });

  const verificationToken2 = await prisma.verificationToken.create({
    data: {
      identifier: user2.email!,
      token: 'verification_token_456',
      expires: new Date(Date.now() + 3600000),
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
