export interface Monitor {
  id: number;
  name: string;
  url: string;
  type: string;
  interval: number;
  status: string;
  lastCheck?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Heartbeat {
  id: number;
  monitorId: number;
  status: string;
  latency: number;
  timestamp: string;
}

export interface Incident {
  id: number;
  monitorId: number;
  status: string;
  startedAt: string;
  resolvedAt?: string;
}
