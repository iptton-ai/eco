import { configure, defineRule } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n'
import * as rules from '@vee-validate/rules'
import zhCN from '@vee-validate/i18n/dist/locale/zh_CN.json'

const activeRules = ['required', 'email', 'min', 'max', 'alpha_spaces', 'numeric'] as const

type RuleName = (typeof activeRules)[number]

type RuleImplementations = Record<string, unknown>

export function setupValidation() {
  const implementations = rules as RuleImplementations

  activeRules.forEach((ruleName: RuleName) => {
    const implementation = implementations[ruleName]

    if (typeof implementation === 'function') {
      defineRule(ruleName, implementation as Parameters<typeof defineRule>[1])
    }
  })

  configure({
    generateMessage: localize({
      'zh-CN': {
        messages: zhCN.messages,
      },
    }),
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: true,
  })

  setLocale('zh-CN')
}
