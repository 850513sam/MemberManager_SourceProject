import { StartUp } from "../StartUp";
import { PlayerInfo } from "../PlayerInfo";

export default class DenomConverter {
    public static valueToDollar(value: number) {
        return value / PlayerInfo.getInstance().getDenom();
    }
}
