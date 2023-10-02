import { createI18n } from "vue-i18n";
import ZH from './zh-CN'
import EN from './en-US'
const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN',
    globalInjection: true,
    messages: {
        'zh-CN': {
            text: ZH
        },
        'en-US': {
            text: EN
        }
    }
});

const translate = (localeKey) => {
    const locale = localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN'
    const hasKey = i18n.global.t(localeKey, locale)  // 使用i18n的 te 方法来检查是否能够匹配到对应键值
    const translatedStr = i18n.global.t(localeKey)
    if (hasKey) {
        return translatedStr
    }
    return localeKey
}

export { translate,i18n }

