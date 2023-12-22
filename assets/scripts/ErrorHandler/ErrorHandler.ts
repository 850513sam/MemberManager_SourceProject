import { error } from 'cc';
import { StartUp } from '../Game/StartUp';
import { CustomErrorName, ErrorUtils } from './Config/error.config';

export default class ErrorHandler {
    private static instance: ErrorHandler = null;

    public static get Instance() {
        if (!this.instance) {
            this.instance = new ErrorHandler();
        }
        return this.instance;
    }

    private constructor() {
        window.addEventListener('error', (event) => {
            error(event.message);
            this.handle(CustomErrorName.FRONT_END_ERROR);
        });
    }

    public handle(error: Error): boolean;
    public handle(errorMessage: string): boolean;
    public handle(arg: Error | string): boolean {
        const message = arg instanceof Error ? arg.message : arg;
        const customError = ErrorUtils.findErrorBy(message);
        if (!customError) {
            // Game.Instance.message.showFatalError(message);
            error(`Unknown error: ${message}`);
            return false;
        }
        switch (customError.type) {
            case 'GameState':
                StartUp.getInstance().message.showGameStateError(customError.name);
                return true;
            case 'Hint':
                StartUp.getInstance().message.showHint(customError.name);
                return true;
            case 'Ignore':
                return true;
            default:
                StartUp.getInstance().message.showFatalError(customError.name);
                return false;
        }
    }
}
