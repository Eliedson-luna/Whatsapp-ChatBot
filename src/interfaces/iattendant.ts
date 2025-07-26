export interface IAttendant {
    getNumber(): string
    notifyAttendant(): Promise<void>
}