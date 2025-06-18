// __mocks__/next/navigation.ts
export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  forward: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
});
