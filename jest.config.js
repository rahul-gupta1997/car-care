module.exports = {
  preset: 'jest-expo',
  // Jest runs CommonJS; prefer package require exports over native legacy ESM entries.
  testEnvironmentOptions: { customExportConditions: ['node', 'node-addons'] },
  testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  clearMocks: true,
  collectCoverageFrom: [
    'src/features/**/*Slice.ts',
    'src/features/auth/schemas.ts',
    'src/features/auth/session.ts',
    'src/components/ui/App{Button,Input}/index.tsx',
  ],
};
