import { SupportLanguage } from './Config/support.config';

export type ILocaleDataSet<T> = { [value in SupportLanguage]: T };

export class LocaleDataSet<T> implements ILocaleDataSet<T> {
    eng: T;
    sch: T;
    tch: T;
    ja: T;
    vi: T;
    pt: T;
    es: T;

    public getData(language: SupportLanguage) {
        return this[language];
    }
}
