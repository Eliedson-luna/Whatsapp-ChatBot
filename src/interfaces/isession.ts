import { SessionProperties } from "../models/chatSession/session/sessionProperties";

export interface ISession {
    sessions: Map<string, SessionProperties>
}