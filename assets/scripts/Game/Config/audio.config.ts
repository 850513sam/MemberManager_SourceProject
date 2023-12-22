import { SupportLanguage } from '../../I18n/Config/support.config';

export enum SoundEffect {
    // button
    // BUTTON_COMMON_01 = 'bt_common01',
    BUTTON_CLICK = 'click',
    EXPLOSION = 'explosion',
    CASHOUT_WIN = 'cash_out_win',
    ROCKET_FLY = 'rocket_fly',
    ROUND_START = 'round_start',

    MUCKED = 'hilo_flip',
    FLIP = 'hilo_mucked',
}
export enum Music {
    BGM_01 = 'music_bg',
}

export enum Voice {
    START_BETTING = 'vc_bet01',
}

export enum VoiceLanguage {
    Chinsese = 'chinese',
    English = 'english',
    Vietnamese = 'vietnamese',
    Japanese = 'japanese'
}

export const supporLanguageToVoiceLanguage: { [value in SupportLanguage]: VoiceLanguage } = {
    [SupportLanguage.EN]: VoiceLanguage.English,
    [SupportLanguage.SCH]: VoiceLanguage.Chinsese,
    [SupportLanguage.TCH]: VoiceLanguage.Chinsese,
    [SupportLanguage.VI]: VoiceLanguage.Vietnamese,
    [SupportLanguage.JA]: VoiceLanguage.Japanese,
};
