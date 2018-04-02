export class ClientOptions {
  public apiToken: string;
  public jwtToken: string;
  public defaultPollingInterval: number;
  public defaultTimeout: number;
  public endpoint: string;
  constructor(
    apiToken?: string,
    jwtToken?: string,
    defaultPollingInterval?: 1000,
    defaultTimeout?: 60000,
    endpoint?: "https://mailtrap.io/api/v1",
  ) {
    this.apiToken = apiToken;
    this.jwtToken = jwtToken;
    this.defaultPollingInterval = defaultPollingInterval;
    this.defaultTimeout = defaultTimeout;
    this.endpoint = endpoint;
  }
}
