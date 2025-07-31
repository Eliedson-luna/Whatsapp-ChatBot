import { getAttendantMethod, getCellNumber } from "../../config/config";
import { Attendant } from "../../models/attendant/attendant";
import { AppError } from "../../models/error/appError";

export async function callAttendant(requestedId: number, customerName: string, userId: string) {
    try {
        const attendantNumber = await getCellNumber(requestedId);
        const attendant = new Attendant(attendantNumber)
        attendant.setCustomerName(customerName);
        attendant.setUserId(userId);
        const attendantMethod = await getAttendantMethod(requestedId);
        switch (attendantMethod) {
            case 'sendLink':
                await attendant.sendLink();
                break;
            case 'notify':
                await attendant.notifyAttendant();
                break;
            default:
                throw new AppError(
                    'attendantDAO.callAttendant()',
                    new Error(`Método inválido: ${attendantMethod}`)
                );
        }

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new AppError('attendantDAO.callAttendant()', error);
        } else {
            throw new Error("Erro desconhecido ao enviar notificação.")
        }
    }
}