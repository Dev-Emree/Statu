export class CreateMonitorDto {
  name: string;
  url: string;
  type: string; // HTTP, TCP
  interval: number;
}
