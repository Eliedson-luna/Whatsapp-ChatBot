import { ISession } from "../../../interfaces/isession";
import { SessionProperties } from "./sessionProperties";

export class Session implements ISession {
  private static instance: Session;
  
  sessions: Map<string, SessionProperties>;

  private constructor() { this.sessions = new Map(); }

  public static getInstance(): Session {
    if (!Session.instance) {
      Session.instance = new Session();
    }
    return Session.instance;
  }

  getSession(userId: string): SessionProperties {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, new SessionProperties(userId));
    }
    return this.sessions.get(userId)!;
  }

  deleteSession(userId: string) {
    this.sessions.delete(userId);
  }
}