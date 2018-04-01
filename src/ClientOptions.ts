export class ClientOptions {
  constructor(
    public apiToken: string,
    public jwtToken: string,
    public defaultPollingInterval: 1000,
    public defaultTimeout: 60000,
  ) {}
}
