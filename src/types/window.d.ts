// Extend the Window interface to include the enoki property
declare interface Window {
  enoki?: {
    getAccounts: () => Promise<Array<{ address: string }>>;
    state?: {
      token?: string;
      user?: {
        idToken?: string;
      };
    };
  };
}
