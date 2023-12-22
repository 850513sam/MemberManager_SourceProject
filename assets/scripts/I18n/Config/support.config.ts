enum SupportLanguage {
    EN = 'en',
    SCH = 'sch',
    TCH = 'tch',
    VI = 'vi',
    JA = 'ja',
    ES = 'es',
    PT = 'pt',
    KO = 'ko',
    ID = 'id',
    TH = 'th',
}

// eslint-disable-next-line no-redeclare
namespace SupportLanguage {
    export function contains(language: string): language is SupportLanguage {
        return Object.values(SupportLanguage).includes(language as SupportLanguage);
    }
}

Object.defineProperty(SupportLanguage, 'contains', {
    enumerable: false,
});

export { SupportLanguage };
