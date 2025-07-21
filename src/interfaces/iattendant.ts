export interface Attendant {
    getNumber(): string
    notifyAttendant(): Promise<void>
}