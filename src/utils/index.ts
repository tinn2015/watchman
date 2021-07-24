/**
 * @description: 获取错误类型
 * @param {*} error.message
 * @return {*}
 */
export const getErrorType = (message: string): string => {
  const errorTypes = ['ReferenceError', 'SyntaxError', 'TypeError', 'RangeError']
  let type = 'OtherError'
  errorTypes.forEach(i => {
   if (message.indexOf(i) > -1) {
    type = i
   }
  })
  return type
}
